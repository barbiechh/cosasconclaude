import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {WORDS} from '../data/transcript';
import {C} from './palette';
import {pop} from './anim';

// Subtítulo de una palabra, como en la referencia, sincronizado con los timestamps.
const HIGHLIGHT = new Set(['ADHD', 'ALCOHOL', 'STIMULANTS', 'BACKWARDS', 'SENSE', 'DOPAMINE', 'STUDY']);

export const Captions: React.FC<{readonly y?: number; readonly until: number}> = ({y = 1660, until}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const words = WORDS.filter((w) => w.start < until);
  const idx = words.findIndex((w, i) => t >= w.start && (i === words.length - 1 || t < words[i + 1].start));
  if (idx < 0) return null;
  const w = words[idx];
  // La palabra se mantiene visible durante las pausas, como mucho 0.6 s.
  if (t > w.end + 0.6 && idx === words.length - 1) return null;
  const startFrame = Math.round(w.start * fps);
  const text = w.text.replace(/[.,?!]/g, '').toUpperCase();
  const s = pop(frame, startFrame, fps, 12);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: y,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'Montserrat',
          fontWeight: 900,
          fontSize: 104,
          letterSpacing: 2,
          color: HIGHLIGHT.has(text) ? C.amberLight : '#ffffff',
          WebkitTextStroke: '22px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 10px 0 rgba(0,0,0,0.6)',
          translate: `0px ${interpolate(s, [0, 1], [30, 0])}px`,
          scale: interpolate(s, [0, 1], [0.55, 1], {easing: Easing.linear}),
          opacity: interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
