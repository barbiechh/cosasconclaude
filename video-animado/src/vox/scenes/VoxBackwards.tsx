import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {clamp, pop, ramp} from '../../components/anim';
import {PathParticles} from '../../components/PathParticles';
import {cue} from '../../data/timeline';
import {PaperDoll} from '../characters/PaperDoll';
import {PaperArrow, PaperBulb} from '../objects/PaperProps';
import {Cutout, Marker, PaperBackground, tornRect, useStepFrame, V} from '../style';

// 10.99–15.80 s · "It sounds backwards, but once you understand why, it makes complete sense."
const T = {
  backwards: cue(11.71, 'backwards'),
  but: cue(12.43, 'backwards'),
  once: cue(12.67, 'backwards'),
  understand: cue(13.23, 'backwards'),
  why: cue(13.55, 'backwards'),
  makes: cue(14.27, 'backwards'),
  complete: cue(14.59, 'backwards'),
  sense: cue(15.07, 'backwards'),
};

const Q1 = 'M150 1180 C150 1130 230 1130 230 1180 C230 1220 190 1220 190 1262 M190 1300 L191 1306';
const Q2 = 'M870 1150 C870 1110 936 1110 936 1150 C936 1182 904 1182 904 1214 M904 1246 L905 1252';
const CHECK = 'M370 690 L490 820 L730 530';
const LIGHT = 'M560 840 C680 900 790 920 850 980 C890 1040 780 1120 600 1170';
const RAYS = Array.from({length: 8}, (_, i) => {
  const a = -Math.PI / 2 + (i - 3.5) * 0.38;
  return `M${850 + Math.cos(a) * 165} ${995 + Math.sin(a) * 165} L${850 + Math.cos(a) * 225} ${995 + Math.sin(a) * 225}`;
});

export const VoxBackwards: React.FC = () => {
  const frame = useStepFrame(2);
  const {fps} = useVideoConfig();

  const flip = pop(frame, T.backwards, fps, 9);
  const arrowRot = frame < T.backwards ? interpolate(frame, [T.backwards - 6, T.backwards], [0, -15], clamp) : -15 + 195 * flip;
  const arrowOut = 1 - ramp(frame, [T.makes, T.makes + 6]);
  const checkBg = pop(frame, T.makes + 4, fps, 9);
  const confused = frame >= T.backwards && frame < T.once;
  const bulbK = pop(frame, T.once, fps, 10);
  const bulbOn = frame < T.understand ? 0 : frame < T.why ? (Math.floor(frame / 4) % 2 ? 1 : 0) : 1;
  const joy = frame >= T.complete ? 1 : 0;
  const hop = -Math.sin(Math.max(0, Math.min(1, (frame - (T.sense - 4)) / 14)) * Math.PI) * 80;

  return (
    <AbsoluteFill style={{scale: interpolate(frame, [0, 30], [1.04, 1], clamp)}}>
      <PaperBackground />

      {/* Flecha que se da la vuelta */}
      <Cutout x={540} y={690} seed="arrow" frame={frame} style={{scale: pop(frame, 0, fps, 11) * arrowOut, rotate: `${arrowRot}deg`}}>
        <PaperArrow width={360} />
      </Cutout>

      {/* ...y se convierte en un check de rotulador sobre papel amarillo */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'url(#vox-shadow)'}}>
        <path d={tornRect(420, 400, 'checkbg', 16)} transform={`translate(540 690) scale(${checkBg}) rotate(-4) translate(-210 -200)`} fill={V.yellow} />
      </svg>
      <Marker d={CHECK} draw={ramp(frame, [T.makes + 6, T.complete + 6])} width={40} />

      {/* Luz que baja del check a la bombilla y a la cabeza */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <PathParticles d={LIGHT} start={T.makes + 8} stop={T.sense + 8} count={16} speed={22} gap={3} size={12} color={V.ink} glow={V.yellow} shine={false} />
      </svg>

      {/* Bombilla de la idea */}
      {RAYS.map((d) => (
        <Marker key={d} d={d} draw={frame >= T.why ? 1 : 0} width={12} color={V.ink} />
      ))}
      <Cutout x={850} y={interpolate(bulbK, [0, 1], [-300, 1040])} seed="bulb" frame={frame} style={{rotate: '10deg', opacity: frame >= T.once ? 1 : 0}}>
        <PaperBulb width={240} on={bulbOn} />
      </Cutout>

      {/* Interrogaciones de confusión */}
      <Marker d={Q1} draw={confused ? ramp(frame, [T.backwards + 4, T.backwards + 12]) : 0} width={15} />
      <Marker d={Q2} draw={confused ? ramp(frame, [T.backwards + 10, T.backwards + 18]) : 0} width={13} />

      <Cutout
        x={480}
        y={interpolate(pop(frame, 0, fps, 12), [0, 1], [2400, 1530]) + hop}
        seed="doll4"
        frame={frame}
        style={{rotate: `${confused ? -4 : 0}deg`}}
      >
        <PaperDoll
          width={600}
          lookX={frame >= T.once && frame < T.makes ? 0.8 : 0}
          lookY={-0.8}
          blink={frame >= T.but && frame < T.but + 4 ? 1 : 0}
          happyEyes={joy}
          browY={frame >= T.once && frame < T.makes ? -16 : 0}
          browTilt={confused ? -14 : 0}
          mouth={frame < T.backwards ? 'smile' : confused ? 'frown' : frame < T.makes ? 'o' : frame < T.complete ? 'smile' : 'grin'}
          armR={(confused ? -150 + (Math.floor(frame / 4) % 2 ? 10 : -10) : 0) + joy * -135}
          armL={joy * 135}
        />
      </Cutout>
    </AbsoluteFill>
  );
};
