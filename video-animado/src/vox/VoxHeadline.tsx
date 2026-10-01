import React from 'react';
import {interpolate, useVideoConfig} from 'remotion';
import {WORDS} from '../data/transcript';
import {clamp, pop} from '../components/anim';
import {boil, FONT_HEAD, useStepFrame, V} from './style';

// Frases del guion (índices de WORDS) y palabras marcadas.
// "yellow" = marcador amarillo, "red" = subrayado de rotulador, "flip" = se voltea en espejo.
type Mark = 'yellow' | 'red' | 'flip';
const PHRASES: {from: number; to: number; marks: Record<number, Mark>}[] = [
  {from: 0, to: 6, marks: {5: 'yellow', 6: 'yellow'}},
  {from: 7, to: 9, marks: {7: 'yellow', 9: 'yellow'}},
  {from: 10, to: 14, marks: {14: 'yellow'}},
  {from: 15, to: 22, marks: {18: 'red'}},
  {from: 23, to: 25, marks: {25: 'yellow'}},
  {from: 26, to: 28, marks: {28: 'flip'}},
  {from: 29, to: 33, marks: {33: 'yellow'}},
  {from: 34, to: 37, marks: {36: 'yellow', 37: 'yellow'}},
];

export const VoxHeadline: React.FC<{readonly top?: number}> = ({top = 150}) => {
  const frame = useStepFrame(2);
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const pi = PHRASES.findIndex((p, i) => t >= WORDS[p.from].start && (i === PHRASES.length - 1 || t < WORDS[PHRASES[i + 1].from].start));
  if (pi < 0) return null;
  const phrase = PHRASES[pi];
  const words = WORDS.slice(phrase.from, phrase.to + 1);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 70,
        right: 70,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 26,
        rowGap: 4,
        fontFamily: FONT_HEAD,
        fontWeight: 700,
        fontSize: 118,
        lineHeight: 1.08,
        textTransform: 'uppercase',
        color: V.ink,
        rotate: `${boil(frame, `ph${pi}`, 0.4, 6) - 1}deg`,
      }}
    >
      {words.map((w, i) => {
        const idx = phrase.from + i;
        const startF = Math.round(w.start * fps);
        const k = pop(frame, startF, fps, 13);
        const mark = phrase.marks[idx];
        const swipe = interpolate(frame, [startF + 2, startF + 9], [0, 1], clamp);
        return (
          <span
            key={idx}
            style={{
              position: 'relative',
              display: 'inline-block',
              opacity: frame >= startF ? 1 : 0.0,
              translate: `0px ${interpolate(k, [0, 1], [-40, 0])}px`,
              rotate: `${interpolate(k, [0, 1], [-6, 0])}deg`,
              scale: mark === 'flip' ? `${interpolate(frame, [startF + 2, startF + 10], [1, -1], clamp)} 1` : undefined,
              color: mark === 'flip' ? V.red : V.ink,
            }}
          >
            {mark === 'yellow' ? (
              <span
                style={{
                  position: 'absolute',
                  left: -12,
                  right: -12,
                  top: '18%',
                  bottom: '4%',
                  background: V.yellow,
                  zIndex: -1,
                  transformOrigin: '0% 50%',
                  scale: `${swipe} 1`,
                  rotate: '-1.5deg',
                  clipPath: 'polygon(1% 8%, 30% 0, 70% 6%, 99% 0, 100% 90%, 64% 100%, 28% 94%, 0 100%)',
                }}
              />
            ) : null}
            {mark === 'red' ? (
              <svg
                width="100%"
                height={40}
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                style={{position: 'absolute', left: 0, bottom: -18, overflow: 'visible'}}
              >
                <path
                  d="M2 18 Q30 10 60 16 T98 12 M6 30 Q40 22 94 26"
                  fill="none"
                  stroke={V.red}
                  strokeWidth={7}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - swipe}
                />
              </svg>
            ) : null}
            <span style={{position: 'relative'}}>{w.text}</span>
          </span>
        );
      })}
    </div>
  );
};
