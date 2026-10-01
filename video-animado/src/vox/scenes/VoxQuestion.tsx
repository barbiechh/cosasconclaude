import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {clamp, pop, ramp} from '../../components/anim';
import {cue} from '../../data/timeline';
import {PaperBrain} from '../characters/PaperBrain';
import {PaperCapsule, PaperGlass, PaperPillBottle} from '../objects/PaperProps';
import {boil, Cutout, FONT_HEAD, Marker, PaperBackground, Tape, tornRect, TypeTag, useStepFrame, V} from '../style';

// 0.00–4.57 s · "What works better for an ADHD brain? Alcohol or stimulants?"
const T = {
  adhd: cue(1.12, 'question'),
  brain: cue(1.84, 'question'),
  alcohol: cue(2.54, 'question'),
  or: cue(3.34, 'question'),
  stimulants: cue(3.58, 'question'),
};

// Trazos de "energía" alrededor del cerebro y la interrogación a rotulador.
const ZIGS = [
  'M150 820 L110 790 L140 770 L96 738',
  'M930 820 L972 790 L942 768 L986 736',
  'M250 600 L222 556 L256 548 L232 500',
  'M830 600 L858 556 L824 548 L848 500',
  'M150 1140 L104 1160 L132 1184 L88 1204',
  'M930 1140 L976 1160 L948 1184 L992 1204',
];
const QMARK = 'M890 640 C890 580 990 580 990 640 C990 690 940 690 940 740 M940 790 L942 796';

export const VoxQuestion: React.FC = () => {
  const frame = useStepFrame(2);
  const {fps} = useVideoConfig();

  const enter = pop(frame, 0, fps, 12);
  const room = ramp(frame, [T.alcohol - 8, T.alcohol + 6], [0, 1]);
  const adhdOn = frame >= T.adhd && frame < T.alcohol;
  const glassK = pop(frame, T.alcohol, fps, 12);
  const bottleK = pop(frame, T.stimulants, fps, 12);
  const lid = pop(frame, T.stimulants + 10, fps, 10);

  const lookX = frame < T.alcohol ? 0.2 : frame < T.or ? -0.9 : frame < T.stimulants ? 0 : 0.9;
  const lookY = frame < T.alcohol ? -0.6 : 0.9;

  return (
    <AbsoluteFill style={{scale: interpolate(frame, [0, 137], [1.04, 1], clamp)}}>
      <PaperBackground />

      {/* Tira de papel kraft rasgado bajo las dos opciones */}
      <svg
        width={1080}
        height={1920}
        style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: room, translate: `0px ${(1 - room) * 300}px`}}
      >
        <path d={tornRect(1140, 520, 'kraft1', 14)} transform="translate(-30 1270) rotate(-2)" fill={V.kraft} />
      </svg>

      {/* Cerebro: grande al principio, sube para dejar sitio */}
      <Cutout
        x={540 + (adhdOn ? boil(frame, 'shake', 10, 2) : 0)}
        y={interpolate(room, [0, 1], [1040, 840]) + interpolate(enter, [0, 1], [900, 0])}
        seed="brain"
        frame={frame}
        jitter={adhdOn ? 3 : 1}
        style={{scale: interpolate(room, [0, 1], [1.25, 0.86]), rotate: `${frame >= T.brain && frame < T.alcohol ? -7 : -2}deg`}}
      >
        <PaperBrain
          width={760}
          lookX={lookX}
          lookY={lookY}
          blink={frame >= 22 && frame < 26 ? 1 : 0}
          browY={frame < T.alcohol ? -6 : -12}
          browTilt={frame >= T.brain && frame < T.alcohol ? 14 : frame >= T.or ? 8 : 0}
          mouth={frame < T.adhd ? 'flat' : frame < T.brain ? 'wavy' : frame < T.alcohol ? 'o' : frame < T.or ? 'smile' : 'o'}
        />
      </Cutout>

      {ZIGS.map((d, i) => (
        <Marker key={d} d={d} draw={adhdOn ? ramp(frame, [T.adhd + i * 2, T.adhd + i * 2 + 6], [0, 1]) : 0} width={12} />
      ))}
      <Marker d={QMARK} draw={frame < T.alcohol ? ramp(frame, [T.brain, T.brain + 10], [0, 1]) : 0} width={16} />

      {/* Opción 1: alcohol */}
      <Cutout
        x={interpolate(glassK, [0, 1], [-300, 290])}
        y={1450}
        seed="glass"
        frame={frame}
        style={{rotate: `${interpolate(glassK, [0, 1], [-40, -4])}deg`}}
      >
        <PaperGlass width={330} fill={ramp(frame, [T.alcohol + 6, T.alcohol + 24], [0, 0.75])} t={frame} />
      </Cutout>
      {frame >= T.alcohol + 6 ? <Tape x={290} y={1215} rot={-12} /> : null}
      <TypeTag text="ALCOHOL" typed={ramp(frame, [T.alcohol + 4, T.alcohol + 16], [0, 1], (x) => x)} x={290} y={1760} rot={-3} frame={frame} />

      {/* "OR" */}
      <div
        style={{
          position: 'absolute',
          left: 545,
          top: 1420,
          translate: '-50% -50%',
          width: 170,
          height: 170,
          borderRadius: '50%',
          background: V.ink,
          color: V.yellow,
          fontFamily: FONT_HEAD,
          fontWeight: 700,
          fontSize: 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          scale: pop(frame, T.or, fps, 8),
          rotate: `${8 + boil(frame, 'or', 3)}deg`,
          filter: 'url(#vox-sticker)',
        }}
      >
        OR
      </div>

      {/* Opción 2: estimulantes */}
      <Cutout
        x={interpolate(bottleK, [0, 1], [1400, 805])}
        y={1450}
        seed="bottle"
        frame={frame}
        style={{rotate: `${interpolate(bottleK, [0, 1], [40, 5])}deg`}}
      >
        <PaperPillBottle width={280} lid={lid} />
      </Cutout>
      <TypeTag text="STIMULANTS" typed={ramp(frame, [T.stimulants + 4, T.stimulants + 18], [0, 1], (x) => x)} x={800} y={1760} rot={3} frame={frame} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'url(#vox-shadow)'}}>
        {[
          {tx: 700, ty: 1120, rot: 200},
          {tx: 900, ty: 1080, rot: -240},
          {tx: 1010, ty: 1230, rot: 280},
        ].map((p, i) => {
          const k = ramp(frame, [T.stimulants + 12 + i * 2, T.stimulants + 26 + i * 2], [0, 1]);
          if (k <= 0) return null;
          return (
            <PaperCapsule
              key={i}
              x={interpolate(k, [0, 1], [805, p.tx])}
              y={interpolate(k, [0, 1], [1220, p.ty]) - Math.sin(k * Math.PI) * 180}
              rot={k * p.rot}
              size={0.95}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
