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

type Chunk = {words: {text: string; from: number}[]; from: number; to: number};

const MAX_WORDS = 4;
// ~18 caracteres caben en una sola línea de 820 px: el caption nunca salta a dos líneas.
const MAX_CHARS = 18;
// Tras la última palabra, el caption se queda un poco y se va (no se queda colgado en las pausas).
export const CAPTION_HOLD_FRAMES = 10;
const HOLD_FRAMES = CAPTION_HOLD_FRAMES;

// Frases cortas: cada cláusula (hasta la puntuación) se reparte en el menor
// número de trozos de ≤4 palabras y ≤18 caracteres, con largos parecidos
// (sin palabras huérfanas que aparecen un instante).
// TODAS las palabras del voiceover se subtitulan (ya no se ocultan cuando hay titular arriba).
type W = {text: string; from: number; end: number};
const len = (ws: W[]) => ws.reduce((n, w) => n + w.text.length, 0) + ws.length - 1;
const fits = (ws: W[]) => ws.length <= MAX_WORDS && len(ws) <= MAX_CHARS;

const splitClause = (ws: W[]): W[][] => {
  // DP: menos trozos primero; a igual número, el reparto más parejo.
  const best: {n: number; cost: number; cut: number}[] = [{n: 0, cost: 0, cut: -1}];
  for (let i = 1; i <= ws.length; i++) {
    best[i] = {n: Infinity, cost: Infinity, cut: -1};
    for (let j = Math.max(0, i - MAX_WORDS); j < i; j++) {
      const piece = ws.slice(j, i);
      if (!fits(piece) && i - j > 1) continue;
      const n = best[j].n + 1;
      const cost = best[j].cost + (MAX_CHARS - len(piece)) ** 2;
      if (n < best[i].n || (n === best[i].n && cost < best[i].cost)) best[i] = {n, cost, cut: j};
    }
  }
  const out: W[][] = [];
  for (let i = ws.length; i > 0; i = best[i].cut) out.unshift(ws.slice(best[i].cut, i));
  return out;
};

const CHUNKS: Chunk[] = (() => {
  const clauses: W[][] = [[]];
  for (const w of rawWords as VoWord[]) {
    clauses[clauses.length - 1].push({text: w.word.replace(/[.,]+$/, ''), from: toFrame(w, w.start), end: toFrame(w, w.end)});
    if (/[.,?!]$/.test(w.word)) clauses.push([]);
  }
  const pieces = clauses.filter((c) => c.length).flatMap(splitClause);
  return pieces.map((ws, i) => ({
    words: ws.map(({text, from}) => ({text, from})),
    from: ws[0].from,
    to: Math.min(pieces[i + 1]?.[0].from ?? Infinity, ws[ws.length - 1].end + HOLD_FRAMES),
  }));
})();

/** Posición fija: centrado, dentro del área segura de Reels/TikTok (x 130-950, arriba de la franja inferior de la app). */
const CAPTION = {top: 1405, width: 820, fontSize: 60};

/** Caption abajo en el área segura, con la palabra hablada resaltada. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const chunk = CHUNKS.find((c) => frame >= c.from && frame < c.to);
  if (!chunk) return null;
  const local = frame - chunk.from;
  const pop = interpolate(local, [0, 4], [0.9, 1], {extrapolateRight: 'clamp'});
  const fade = interpolate(local, [0, 3], [0, 1], {extrapolateRight: 'clamp'}) * interpolate(chunk.to - frame, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  let active = -1;
  chunk.words.forEach((w, i) => {
    if (w.from <= frame) active = i;
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: CAPTION.top,
        left: (WIDTH - CAPTION.width) / 2,
        width: CAPTION.width,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        fontFamily: FONT_FAMILY,
        fontWeight: FONT_WEIGHT,
        fontSize: CAPTION.fontSize,
        lineHeight: 1.25,
        color: COLORS.ink,
        transform: `scale(${pop})`,
        opacity: fade,
        // halo de papel: se lee aunque pase una imagen por detrás
        textShadow: `0 0 10px ${COLORS.paper}, 0 0 4px ${COLORS.paper}, 0 0 2px ${COLORS.paper}`,
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
              margin: '0 4px',
              padding: '0 9px',
              borderRadius: 8,
              backgroundColor: on ? COLORS.yellow : 'transparent',
              transform: `scale(${1 + 0.06 * k})`,
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

/** Para revisión: los captions con sus tiempos (frames de la línea de tiempo). */
export const CAPTION_CHUNKS = CHUNKS;
