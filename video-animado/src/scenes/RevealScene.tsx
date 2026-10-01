import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrainBuddy} from '../characters/BrainBuddy';
import {Glass} from '../objects/Glass';
import {AnswerCard, Sparkle} from '../objects/Symbols';
import {Glow, Motes, Place} from '../components/Stage';
import {clamp, pop, ramp, wobble} from '../components/anim';
import {C} from '../components/palette';
import {cue} from '../data/timeline';

// 9.67–10.99 s · "It was alcohol."
const T = {
  it: cue(9.67, 'reveal'),
  alcohol: cue(10.16, 'reveal'),
};

const SPARKS = [
  {x: 200, y: 330, s: 90, d: 0},
  {x: 900, y: 420, s: 120, d: 3},
  {x: 140, y: 860, s: 70, d: 6},
  {x: 950, y: 900, s: 80, d: 2},
  {x: 540, y: 190, s: 100, d: 5},
];

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // La tarjeta gira y se transforma en el vaso.
  const cardFlip = ramp(frame, [T.it, T.it + 5], [1, 0]);
  const glassFlip = pop(frame, T.it + 5, fps, 10);
  const impact = pop(frame, T.alcohol, fps, 8);
  const brainIn = pop(frame, -5, fps, 10);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        scale: interpolate(impact, [0, 1], [1.1, 1]),
        translate: `${frame >= T.alcohol && frame < T.alcohol + 8 ? wobble(frame, 3, 7) : 0}px 0px`,
      }}
    >
      <Motes seed="r" count={44} />
      <Glow x={540} y={680} size={1400} opacity={0.25 + impact * 0.35} />

      {/* Rayos detrás del vaso */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: impact * 0.55}}>
        <g transform={`translate(540 680) rotate(${frame * 0.8})`}>
          {Array.from({length: 14}, (_, i) => (
            <path key={i} d="M0 0 L-70 -1100 L70 -1100 Z" fill={C.amber} opacity={0.35} transform={`rotate(${(i * 360) / 14})`} />
          ))}
        </g>
      </svg>

      <Place x={540} y={interpolate(cardFlip, [0, 1], [700, 830])} style={{scale: `${cardFlip} 1`, opacity: cardFlip > 0.01 ? 1 : 0}}>
        <AnswerCard width={230} />
      </Place>

      <Place
        x={540}
        y={680}
        style={{
          scale: `${glassFlip} ${interpolate(glassFlip, [0, 1], [0.6, 1])}`,
          rotate: `${wobble(frame, 0.2, 2)}deg`,
          opacity: frame >= T.it + 5 ? 1 : 0,
        }}
      >
        <Glass width={560} fill={ramp(frame, [T.alcohol - 2, T.alcohol + 18], [0.05, 0.88])} foam={ramp(frame, [T.alcohol + 12, T.alcohol + 22], [0, 1])} t={frame} ice />
      </Place>

      {SPARKS.map((s, i) => (
        <Place key={i} x={s.x} y={s.y} style={{scale: pop(frame, T.alcohol + s.d, fps, 7), rotate: `${frame * 2 + i * 30}deg`}}>
          <Sparkle size={s.s} />
        </Place>
      ))}

      {/* El cerebro asoma desde abajo, sorprendido */}
      <Place
        x={540}
        y={1490}
        style={{
          translate: `-50% calc(-50% + ${interpolate(brainIn, [0, 1], [700, 0]) + wobble(frame, 0.3, 6)}px)`,
        }}
      >
        <BrainBuddy
          width={700}
          lookY={-0.95}
          lookX={0}
          browY={frame >= T.alcohol ? -22 : -10}
          browTilt={frame >= T.alcohol ? 0 : 8}
          mouth={frame < T.alcohol ? 'o' : frame < T.alcohol + 12 ? 'wow' : 'grin'}
          sparkle={impact}
          armL={interpolate(impact, [0, 1], [0, 120], clamp)}
          armR={interpolate(impact, [0, 1], [0, -120], clamp)}
        />
      </Place>
    </AbsoluteFill>
  );
};
