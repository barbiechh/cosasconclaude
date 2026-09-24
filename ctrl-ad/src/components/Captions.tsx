import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import rawWords from '../data/voiceover-words.json';
import {BODY_AUDIO_START_SECONDS, HOOK, HOOK_FRAMES, TOTAL_FRAMES, WIDTH, bodyCueFrame, secToFrame} from '../data/timing';
import {BODY_KEYWORDS, END_CARD_TEXTS, HOOK_TEXT_WINDOWS, cueFrame} from '../data/keywords';
import {OVERLAP, SCENES} from '../data/scenes';
import {COLORS, FONT_FAMILY, FONT_WEIGHT} from '../styles/tokens';

type VoWord = {word: string; section: 'hook' | 'body'; start: number; end: number};

// Segundo del MP3 -> frame de la línea de tiempo (el body se desplaza si cambia el hook).
const toFrame = (w: VoWord, t: number) =>
  w.section === 'hook'
    ? secToFrame(t - HOOK.audioStartSeconds)
    : secToFrame(HOOK.durationSeconds + (t - BODY_AUDIO_START_SECONDS));

type Chunk = {words: {text: string; from: number}[]; from: number};

const MAX_WORDS = 4;
const MAX_CHARS = 20;

// Frases cortas: se corta en puntuación, a las 4 palabras o a los ~20 caracteres.
export const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: Chunk | null = null;
  let chars = 0;
  for (const w of rawWords as VoWord[]) {
    const text = w.word.replace(/[.,]+$/, '');
    const from = toFrame(w, w.start);
    if (!cur || cur.words.length >= MAX_WORDS || chars + text.length > MAX_CHARS) {
      cur = {words: [], from};
      chars = 0;
      out.push(cur);
    }
    cur.words.push({text, from});
    chars += text.length + 1;
    if (/[.,?!]$/.test(w.word)) cur = null;
  }
  return out;
})();

// ---------------------------------------------------------------------------
// No repetir abajo lo que ya dice arriba: una frase se oculta solo si TODAS sus
// palabras con contenido están en el titular visible. Si dice algo más, se muestra.

const STOP = new Set(['the', 'a', 'an', 'and', 'of', 'to', 'it', 'is', 'at', 'in', 'on', 'for', 'she', 'her', 'its', 'so', 'as', 'with', 'that', 'this', 'be']);
const NUM: Record<string, string> = {'40': 'forty', '90': 'ninety', '30': 'thirty', '20': 'twenty', '2nd': 'second'};
const norm = (w: string) => {
  const c = w.toLowerCase().replace(/[^a-z0-9']/g, '').replace(/'s$/, '');
  return NUM[c] ?? c;
};
const content = (text: string) => text.split(/[\s·-]+/).map(norm).filter((w) => w && !STOP.has(w));

const bodyToTimeline = (f: number) => HOOK_FRAMES + f;
const sceneEnd = (bodyFrame: number) => {
  const s = Object.values(SCENES).find((sc) => bodyFrame >= sc.from && bodyFrame < sc.from + sc.durationInFrames - OVERLAP);
  return s ? s.from + s.durationInFrames - OVERLAP : TOTAL_FRAMES - HOOK_FRAMES;
};

const TOP_TEXTS: {words: Set<string>; from: number; to: number}[] = [
  ...HOOK_TEXT_WINDOWS.map((w) => ({words: new Set(content(w.text)), from: w.from, to: w.to})),
  ...BODY_KEYWORDS.map((k) => {
    const from = cueFrame(k.from);
    const to = k.to ? cueFrame(k.to) : sceneEnd(from);
    return {words: new Set(content(k.text)), from: bodyToTimeline(from), to: bodyToTimeline(to)};
  }),
  {words: new Set(content(END_CARD_TEXTS.guarantee)), from: bodyToTimeline(bodyCueFrame('guarantee')), to: TOTAL_FRAMES},
  {words: new Set(content(END_CARD_TEXTS.stock)), from: bodyToTimeline(bodyCueFrame('inStock', -3)), to: TOTAL_FRAMES},
  {words: new Set(content(END_CARD_TEXTS.tap)), from: bodyToTimeline(bodyCueFrame('tapBelow')), to: TOTAL_FRAMES},
  {words: new Set(content(END_CARD_TEXTS.sign)), from: bodyToTimeline(bodyCueFrame('yourSign')), to: TOTAL_FRAMES},
];

export const HIDDEN: boolean[] = CHUNKS.map((chunk, i) => {
  const from = chunk.from;
  const to = CHUNKS[i + 1]?.from ?? TOTAL_FRAMES;
  const words = chunk.words.flatMap((w) => content(w.text));
  if (!words.length) return false;
  return TOP_TEXTS.some((t) => {
    // el titular tiene que estar ya en pantalla cuando empieza la frase
    const probe = Math.min(from + 2, to - 1);
    if (t.from > probe || t.to <= probe) return false;
    const shared = words.filter((w) => t.words.has(w)).length;
    return shared === words.length;
  });
});

/** Caption abajo en el área segura, con la palabra hablada resaltada (salvo si repite el titular). */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  let idx = -1;
  for (let i = 0; i < CHUNKS.length && CHUNKS[i].from <= frame; i++) idx = i;
  if (idx < 0 || HIDDEN[idx]) return null;
  const chunk = CHUNKS[idx];
  const local = frame - chunk.from;
  const pop = interpolate(local, [0, 4], [0.9, 1], {extrapolateRight: 'clamp'});
  const fade = interpolate(local, [0, 3], [0, 1], {extrapolateRight: 'clamp'});

  let active = -1;
  chunk.words.forEach((w, i) => {
    if (w.from <= frame) active = i;
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 1405,
        left: (WIDTH - 920) / 2,
        width: 920,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: FONT_WEIGHT,
        fontSize: 60,
        lineHeight: 1.25,
        color: COLORS.ink,
        transform: `scale(${pop})`,
        opacity: fade,
      }}
    >
      {chunk.words.map((w, i) => {
        const on = i === active;
        const k = on ? interpolate(frame - w.from, [0, 3], [0, 1], {extrapolateRight: 'clamp'}) : 0;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              margin: '0 7px',
              padding: '0 10px',
              borderRadius: 8,
              backgroundColor: on ? COLORS.yellow : 'transparent',
              transform: `scale(${1 + 0.08 * k})`,
              opacity: i <= active ? 1 : 0.55,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

