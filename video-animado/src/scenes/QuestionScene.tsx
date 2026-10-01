import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrainBuddy} from '../characters/BrainBuddy';
import {Glass} from '../objects/Glass';
import {Capsule, PillBottle} from '../objects/PillBottle';
import {QuestionMark} from '../objects/Symbols';
import {Glow, Motes, Place} from '../components/Stage';
import {anticipate, clamp, pop, ramp, wobble} from '../components/anim';
import {C} from '../components/palette';
import {cue} from '../data/timeline';

// 0.00–4.57 s · "What works better for an ADHD brain? Alcohol or stimulants?"
const T = {
  enter: 0,
  adhd: cue(1.12, 'question'),
  brain: cue(1.84, 'question'),
  alcohol: cue(2.54, 'question'),
  or: cue(3.34, 'question'),
  stimulants: cue(3.58, 'question'),
};

const BOLT = 'M0 -60 L22 -12 L4 -10 L26 60 L-20 4 L0 2 L-18 -60 Z';

export const QuestionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const drop = pop(frame, T.enter, fps, 10);
  const landSquash = interpolate(frame, [7, 11, 17, 26], [1, 0.84, 1.07, 1], clamp);
  const tilt = ramp(frame, [T.brain, T.brain + 10], [0, -8]) * (frame < T.alcohol ? 1 : ramp(frame, [T.alcohol, T.alcohol + 8], [1, 0]));
  const adhdOn = frame >= T.adhd && frame < T.brain + 4;
  // Al principio el cerebro ocupa el centro del encuadre; sube para dejar sitio a las opciones.
  const makeRoom = ramp(frame, [T.alcohol - 8, T.alcohol + 6], [0, 1]);

  // Mirada del cerebro: arriba pensando -> vaso -> frasco.
  const lookX =
    frame < T.alcohol ? 0.35 : frame < T.or ? -0.85 : frame < T.stimulants ? ramp(frame, [T.or, T.or + 5], [-0.85, 0]) : 0.85;
  const lookY = frame < T.alcohol ? -0.7 : 0.85;

  const glassIn = anticipate(frame, T.alcohol, fps);
  const bottleIn = anticipate(frame, T.stimulants, fps);
  const lid = pop(frame, T.stimulants + 10, fps, 9);

  const flyingPills = [
    {tx: 690, ty: 1010, rot: 220},
    {tx: 905, ty: 960, rot: -260},
    {tx: 1000, ty: 1110, rot: 300},
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        scale: interpolate(frame, [0, 137], [1.05, 1], clamp),
        translate: `0px ${interpolate(frame, [T.alcohol - 6, T.alcohol + 14], [0, -36], clamp) + (frame > 7 && frame < 14 ? wobble(frame, 3, 6) : 0)}px`,
      }}
    >
      <Motes seed="q" />
      <Glow x={540} y={interpolate(makeRoom, [0, 1], [880, 640])} size={1350} opacity={0.42 + (adhdOn ? 0.12 * Math.sin(frame) : 0)} />

      {/* Chispas TDAH alrededor del cerebro */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {adhdOn
          ? [0, 1, 2, 3, 4, 5, 6].map((i) => {
              const a = -Math.PI * 0.95 + i * (Math.PI * 1.1) / 6 - Math.PI * 0.05;
              const s = pop(frame, T.adhd + i, fps, 9) * (Math.floor(frame / 3 + i) % 2 === 0 ? 1 : 0.75);
              return (
                <path
                  key={i}
                  d={BOLT}
                  transform={`translate(${540 + Math.cos(a) * 470} ${880 + Math.sin(a) * 470}) rotate(${(a * 180) / Math.PI + 90}) scale(${s * 1.3})`}
                  fill={C.amberLight}
                  stroke={C.ink}
                  strokeWidth={5}
                />
              );
            })
          : null}
      </svg>

      <Place
        x={540}
        y={interpolate(makeRoom, [0, 1], [880, 640])}
        style={{
          translate: `-50% calc(-50% + ${interpolate(drop, [0, 1], [-1300, 0]) + wobble(frame, 0.11, 10)}px)`,
          scale: `${(2 - landSquash) * interpolate(makeRoom, [0, 1], [1.18, 1])} ${landSquash * interpolate(makeRoom, [0, 1], [1.18, 1])}`,
          rotate: `${tilt + (adhdOn ? wobble(frame, 2.2, 2.5) : 0)}deg`,
          transformOrigin: '50% 90%',
        }}
      >
        <BrainBuddy
          width={790}
          lookX={lookX}
          lookY={lookY}
          blink={interpolate(frame, [20, 22, 25], [0, 1, 0], clamp)}
          browY={frame < T.alcohol ? -8 : -14}
          browTilt={frame >= T.brain && frame < T.alcohol ? 12 : frame >= T.or ? 8 : 0}
          mouth={frame < T.adhd ? 'flat' : frame < T.brain ? 'wavy' : frame < T.alcohol ? 'o' : frame < T.or ? 'smile' : 'o'}
          armL={frame >= T.brain && frame < T.alcohol ? ramp(frame, [T.brain, T.brain + 8], [0, 70]) : 0}
          armR={frame >= T.brain && frame < T.alcohol ? ramp(frame, [T.brain, T.brain + 8], [0, -70]) : 0}
          sparkle={adhdOn ? 1 : 0}
        />
      </Place>

      {/* Interrogaciones que brotan del cerebro */}
      <Place
        x={905}
        y={430}
        style={{
          scale: pop(frame, T.brain, fps, 8) * (1 - ramp(frame, [T.alcohol, T.alcohol + 6], [0, 1])),
          rotate: `${12 + wobble(frame, 0.15, 6)}deg`,
        }}
      >
        <QuestionMark size={150} />
      </Place>
      <Place
        x={165}
        y={500}
        style={{
          scale: pop(frame, T.brain + 6, fps, 8) * (1 - ramp(frame, [T.alcohol, T.alcohol + 6], [0, 1])),
          rotate: `${-14 + wobble(frame, 0.15, 6, 2)}deg`,
        }}
      >
        <QuestionMark size={105} />
      </Place>

      {/* Vaso de alcohol: entra desde abajo y se llena */}
      <Glow x={300} y={1450} size={700} opacity={0.5 * Math.max(0, Math.min(1, glassIn))} />
      <Place
        x={295}
        y={1440}
        style={{
          translate: `-50% calc(-50% + ${interpolate(glassIn, [-0.12, 0, 1], [900, 900, 0], {extrapolateLeft: 'clamp'})}px)`,
          scale: `${interpolate(frame, [T.alcohol + 8, T.alcohol + 12, T.alcohol + 18], [1, 1.08, 1], clamp)} ${interpolate(frame, [T.alcohol + 8, T.alcohol + 12, T.alcohol + 18], [1, 0.9, 1], clamp)}`,
          transformOrigin: '50% 100%',
          rotate: `${frame >= T.or ? ramp(frame, [T.or, T.or + 8], [0, -6]) : 0}deg`,
        }}
      >
        <Glass width={410} fill={ramp(frame, [T.alcohol + 6, T.alcohol + 26], [0, 0.78])} t={frame} ice />
      </Place>

      {/* Rayo "o" entre los dos */}
      <Place x={545} y={1360} style={{scale: pop(frame, T.or, fps, 7) * 1.1, rotate: `${wobble(frame, 0.6, 4)}deg`}}>
        <svg width={140} height={240} viewBox="-50 -70 100 140" style={{overflow: 'visible'}}>
          <path d={BOLT} fill={C.amberLight} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
        </svg>
      </Place>

      {/* Frasco de estimulantes: entra, se abre y salta una cápsula */}
      <Glow x={790} y={1450} size={650} color="#7cc6c9" opacity={0.28 * Math.max(0, Math.min(1, bottleIn))} />
      <Place
        x={795}
        y={1435}
        style={{
          translate: `-50% calc(-50% + ${interpolate(bottleIn, [-0.12, 0, 1], [900, 900, 0], {extrapolateLeft: 'clamp'})}px)`,
          rotate: `${frame >= T.stimulants ? wobble(frame, 0.5, 3 * (1 - lid)) : 0}deg`,
        }}
      >
        <PillBottle width={350} lid={lid} />
      </Place>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {flyingPills.map((p, i) => {
          const k = ramp(frame, [T.stimulants + 12 + i * 3, T.stimulants + 26 + i * 3], [0, 1]);
          if (k <= 0) return null;
          const x = interpolate(k, [0, 1], [795, p.tx]);
          const y = interpolate(k, [0, 1], [1190, p.ty]) - Math.sin(k * Math.PI) * 200;
          return <Capsule key={i} x={x} y={y} rot={k * p.rot} size={0.9} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
