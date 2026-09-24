import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import rawWords from '../data/voiceover-words.json';
import {BODY_AUDIO_START_SECONDS, HOOK, WIDTH, secToFrame} from '../data/timing';
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
const CHUNKS: Chunk[] = (() => {
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

/** Caption siempre visible, abajo en el área segura, con la palabra hablada resaltada. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  let idx = -1;
  for (let i = 0; i < CHUNKS.length && CHUNKS[i].from <= frame; i++) idx = i;
  if (idx < 0) return null;
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
