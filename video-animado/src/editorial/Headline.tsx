import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {WORDS_FULL} from '../data/transcriptFull';
import {SCENE_TIMES} from './timeline';
import {E, MONO, SERIF} from './theme';

// Palabras clave en cursiva de color (por significado).
const KEY: Record<string, string> = {
  adhd: E.blueDeep,
  alcohol: E.ochre,
  drink: E.ochre,
  drinking: E.ochre,
  stimulants: E.brick,
  stimulant: E.brick,
  pill: E.brick,
  dopamine: E.blueDeep,
  tank: E.blueDeep,
  empty: E.blueDeep,
  tyrosine: E.sageDeep,
  b6: E.sageDeep,
  rhodiola: E.sageDeep,
  theanine: E.sageDeep,
  control: E.blueDeep,
  normal: E.blueDeep,
  worse: E.brick,
  backwards: E.ochre,
  sense: E.blueDeep,
  store: E.blueDeep,
  fresh: E.sageDeep,
  steady: E.sageDeep,
  clear: E.sageDeep,
  guarantee: E.blueDeep,
  nothing: E.blueDeep,
  trap: E.brick,
  lower: E.brick,
  crash: E.brick,
};
const NIGHT_KEY: Record<string, string> = {...KEY, alcohol: E.ochreLight, drink: E.ochreLight, drinking: E.ochreLight, dopamine: E.blue, tank: E.blue, empty: E.blue, control: E.blue, normal: E.blue, lower: '#e08a72', worse: '#e08a72', crash: '#e08a72'};

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

// Frases: corta en puntuación fuerte, en comas a partir de 4 palabras, o a las 8 palabras.
const PHRASES: number[][] = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  WORDS_FULL.forEach((w, i) => {
    cur.push(i);
    const strong = /[.?!]$/.test(w.text);
    const comma = /,$/.test(w.text);
    const next = WORDS_FULL[i + 1];
    const gap = next ? next.start - w.end : 0;
    if (strong || (comma && cur.length >= 4) || cur.length >= 8 || gap > 0.45 || SCENE_TIMES.some((s) => s.word === i + 1)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  // Une fragmentos de 1-2 palabras con la frase siguiente si caben.
  const merged: number[][] = [];
  for (const p of out) {
    const last = merged[merged.length - 1];
    const lastEndsStrong = last && /[.?!]$/.test(WORDS_FULL[last[last.length - 1]].text);
    if (last && last.length <= 2 && last.length + p.length <= 8 && !lastEndsStrong && !SCENE_TIMES.some((s) => s.word === p[0])) {
      last.push(...p);
    } else merged.push([...p]);
  }
  return merged;
})();

export const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scene = [...SCENE_TIMES].reverse().find((s) => frame >= s.from) ?? SCENE_TIMES[0];
  const dark = scene.dark;
  const pi = PHRASES.findIndex((p, i) => t >= WORDS_FULL[p[0]].start - 0.08 && (i === PHRASES.length - 1 || t < WORDS_FULL[PHRASES[i + 1][0]].start - 0.08));
  const kickerK = interpolate(frame - scene.from, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const keys = dark ? NIGHT_KEY : KEY;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 104,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: dark ? E.mist : E.slate,
          opacity: kickerK,
        }}
      >
        <span style={{width: 56 * kickerK, height: 3, background: dark ? E.blue : E.ochre}} />
        {scene.kicker}
      </div>
      {pi >= 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            top: 160,
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 22,
            fontFamily: SERIF,
            fontSize: 92,
            lineHeight: 1.04,
            color: dark ? E.cream : E.ink,
          }}
        >
          {PHRASES[pi].map((i) => {
            const w = WORDS_FULL[i];
            const sf = Math.round(w.start * fps);
            const k = interpolate(frame, [sf - 2, sf + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const key = keys[clean(w.text)];
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: k,
                  translate: `0px ${(1 - k) * 18}px`,
                  fontStyle: key ? 'italic' : 'normal',
                  color: key ?? undefined,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      ) : null}
    </>
  );
};
