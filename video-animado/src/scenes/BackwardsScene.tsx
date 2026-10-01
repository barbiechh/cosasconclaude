import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bean} from '../characters/Bean';
import {BigArrow, CheckMark, Lightbulb, QuestionMark, Sparkle} from '../objects/Symbols';
import {Glow, Motes, Place} from '../components/Stage';
import {PathParticles} from '../components/PathParticles';
import {clamp, pop, ramp, wobble} from '../components/anim';
import {C} from '../components/palette';
import {cue} from '../data/timeline';

// 10.99–15.80 s · "It sounds backwards, but once you understand why, it makes complete sense."
const T = {
  it: cue(10.99, 'backwards'),
  backwards: cue(11.71, 'backwards'),
  but: cue(12.43, 'backwards'),
  once: cue(12.67, 'backwards'),
  understand: cue(13.23, 'backwards'),
  why: cue(13.55, 'backwards'),
  makes: cue(14.27, 'backwards'),
  complete: cue(14.59, 'backwards'),
  sense: cue(15.07, 'backwards'),
};

// Haz de luz: del check baja serpenteando hasta la bombilla y la cabeza.
const BEAM = 'M540 560 C420 640 660 700 540 780 C470 830 610 900 540 1060';

export const BackwardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // La flecha se da la vuelta (con anticipación) y luego se transforma en check.
  const flip = pop(frame, T.backwards, fps, 9);
  const arrowRot =
    frame < T.backwards
      ? interpolate(frame, [T.backwards - 5, T.backwards], [0, -18], clamp)
      : -18 + 198 * flip;
  const arrowOut = ramp(frame, [T.makes, T.makes + 7], [1, 0]);
  const checkIn = pop(frame, T.makes + 5, fps, 9);
  const confused = frame >= T.backwards && frame < T.once;

  const bulbIn = pop(frame, T.once, fps, 9);
  const bulbOn =
    frame < T.understand ? 0 : frame < T.why ? (Math.floor(frame / 2) % 2 === 0 ? 0.65 : 0.1) : ramp(frame, [T.why, T.why + 6], [0.7, 1]);

  const joy = ramp(frame, [T.complete, T.complete + 6], [0, 1]);
  const hopT = Math.max(0, Math.min(1, (frame - (T.sense - 4)) / 14));
  const hop = -Math.sin(hopT * Math.PI) * 90;
  const landSquash = interpolate(frame, [T.sense + 10, T.sense + 13, T.sense + 19], [1, 0.9, 1], clamp);

  const scratch = confused ? ramp(frame, [T.backwards + 3, T.backwards + 10], [0, 1]) : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        scale: interpolate(frame, [0, 40, T.sense, T.sense + 8], [1.06, 1, 1, 1.04], clamp),
        transformOrigin: '540px 900px',
      }}
    >
      <Motes seed="b" />
      <Glow x={540} y={400} size={900} opacity={0.3 + checkIn * 0.2} />
      <Glow x={540} y={880} size={760} opacity={bulbOn * 0.6} color={C.amberLight} />

      {/* Flecha que gira "al revés" */}
      <Place
        x={540}
        y={400}
        style={{
          scale: pop(frame, 0, fps, 11) * arrowOut,
          rotate: `${arrowRot + arrowOut * (1 - arrowOut) * 120 + (frame > T.backwards + 12 && frame < T.makes ? wobble(frame, 0.2, 4) : 0)}deg`,
        }}
      >
        <BigArrow width={420} />
      </Place>

      {/* ...y se transforma en un check */}
      <Place x={540} y={400} style={{scale: checkIn, rotate: `${interpolate(checkIn, [0, 1], [-30, 0])}deg`}}>
        <CheckMark width={420} draw={ramp(frame, [T.makes + 5, T.complete + 8], [0, 1])} />
      </Place>

      {/* Estallido de chispas en la transformación */}
      {Array.from({length: 8}, (_, i) => {
        const k = ramp(frame, [T.makes + 4, T.makes + 18], [0, 1]);
        const a = (i / 8) * Math.PI * 2;
        return (
          <Place
            key={i}
            x={540 + Math.cos(a) * (120 + k * 300)}
            y={400 + Math.sin(a) * (120 + k * 300)}
            style={{scale: k > 0 ? 1 - k : 0, rotate: `${k * 180}deg`}}
          >
            <Sparkle size={70} />
          </Place>
        );
      })}

      {/* Luz que baja del check a la cabeza */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <PathParticles d={BEAM} start={T.makes + 8} stop={T.sense + 10} count={18} speed={24} gap={3} size={11} />
      </svg>

      {/* Interrogaciones de confusión */}
      <Place
        x={180}
        y={1010}
        style={{scale: pop(frame, T.backwards + 5, fps, 8) * (1 - ramp(frame, [T.but, T.but + 6], [0, 1])), rotate: `${-15 + wobble(frame, 0.2, 8)}deg`}}
      >
        <QuestionMark size={130} />
      </Place>
      <Place
        x={905}
        y={950}
        style={{scale: pop(frame, T.backwards + 11, fps, 8) * (1 - ramp(frame, [T.but, T.but + 6], [0, 1])), rotate: `${15 + wobble(frame, 0.2, 8, 1)}deg`}}
      >
        <QuestionMark size={100} />
      </Place>

      {/* Bombilla de la idea */}
      <Place
        x={540}
        y={850}
        style={{
          translate: `-50% calc(-50% + ${interpolate(bulbIn, [0, 1], [-700, 0]) + wobble(frame, 0.12, 8)}px)`,
          rotate: `${wobble(frame, 0.1, 4)}deg`,
          opacity: frame >= T.once ? 1 : 0,
        }}
      >
        <Lightbulb width={220} on={bulbOn} />
      </Place>

      {/* Personaje en primer plano */}
      <Place
        x={540}
        y={1470}
        style={{
          translate: `-50% calc(-50% + ${interpolate(pop(frame, 0, fps, 12), [0, 1], [600, 0]) + hop}px)`,
          scale: `${2 - landSquash} ${landSquash}`,
          transformOrigin: '50% 100%',
        }}
      >
        <Bean
          width={660}
          lookX={confused ? wobble(frame, 0.25, 0.3) : 0}
          lookY={frame < T.once ? -0.85 : frame < T.makes ? -1 : -0.7}
          blink={interpolate(frame, [T.but, T.but + 2, T.but + 5], [0, 1, 0], clamp)}
          happyEyes={joy}
          browY={frame >= T.once && frame < T.makes ? -16 : 0}
          browTilt={confused ? -12 : frame >= T.once && frame < T.makes ? 6 : 0}
          mouth={frame < T.backwards ? 'smile' : confused ? (frame < T.backwards + 10 ? 'flat' : 'frown') : frame < T.makes ? 'o' : frame < T.complete ? 'smile' : 'grin'}
          armR={interpolate(scratch, [0, 1], [0, -150]) + scratch * wobble(frame, 0.9, 12) + joy * -130}
          armL={joy * 130}
          blush={0.5 + joy * 0.4}
        />
      </Place>
    </AbsoluteFill>
  );
};
