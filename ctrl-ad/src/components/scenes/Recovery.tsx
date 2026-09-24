/**
 * "And once the brain is building dopamine again, the fog lifts. The drive
 * comes back, and so does the patience. She feels like herself again."
 * No es un reverso literal: cada cosa vuelve en una composición nueva.
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Layer, Pic, Pt, easeOut, mix, ramp, springAt} from '../kit';
import {Figure, handPoint, headPoint} from '../figures';
import {Bar, Blocks, Check, Flow, Fog, Gear, Rays, Target, TypeLine} from '../mechanisms';
import {Scene, SceneProps} from './SceneFrame';

type At = SceneProps['plan']['at'];

export const Recovery: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  return (
    <Scene plan={plan} punches={[at('liftsWord'), at('driveBack'), at('patienceWord'), at('herselfWord')]}>
      <Beat from={0} to={at('driveComesBack')} enter="fade" exit="up">
        <FogLifts p={p} at={at} />
      </Beat>
      <Beat from={at('driveComesBack')} to={at('soDoesPatience')} enter="up" exit="left">
        <DriveBack at={at} />
      </Beat>
      <Beat from={at('soDoesPatience')} to={at('feelsLikeHerself')} enter="right" exit="fade">
        <Together at={at} />
      </Beat>
      <Beat from={at('feelsLikeHerself')} to={plan.durationInFrames} enter="fade" exit="fade">
        <Herself at={at} />
      </Beat>
    </Scene>
  );
};

const FogLifts: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const building = ramp(frame, at('buildingAgain', -4), at('buildingAgain', 8));
  const lift = ramp(frame, at('fogLifts', -2), at('liftsWord', 10), (t) => t * t);
  const clear = ramp(frame, at('liftsWord'), at('liftsWord', 14), easeOut);
  return (
    <>
      <Rays cx={540} cy={760} r0={230} r1={380} t={clear} n={16} spin={frame / 70} />
      {building > 0 && <Blocks path={[[540, 1260], [540, 1120], [540, 1000], [540, 900]]} t={frame} count={5} speed={40} convertAt={2} opacity={building} />}
      {building > 0 && (
        <>
          <Flow path={[[420, 700], [300, 620], [220, 560], [120, 520]]} t={frame} count={7} speed={32} opacity={building} seed="r1" />
          <Flow path={[[660, 700], [780, 620], [860, 560], [960, 520]]} t={frame} count={7} speed={32} opacity={building} seed="r2" />
        </>
      )}
      <Pic id="body.brainDiagram" p={p} x={540} y={760} w={mix(440, 480, clear)} aspect={1.5} />
      <Fog x={120} y={480} w={840} h={560} amount={0.72} lift={lift} t={frame} />
    </>
  );
};

const DriveBack: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = at('driveComesBack');
  const mesh = springAt(frame, fps, at('driveBack', -4), 12);
  const on = frame >= at('driveBack', 4);
  const t = Math.max(0, frame - at('driveBack', 4));
  const a = on ? t * 6 : 0;
  const fill = mix(0.36, 1, ramp(frame, at('driveBack', 4), at('soDoesPatience', -6), easeOut));
  return (
    <>
      <Gear cx={430} cy={800} r={210} teeth={12} angle={a + 8} grey={!on && frame < s + 2} />
      <Gear cx={mix(1200, 718, mesh)} cy={mix(1100, 1012, mesh)} r={140} teeth={8} angle={-a * 1.5} color={COLORS.green} />
      <Bar cx={540} cy={1220} w={760} h={80} value={fill} color={COLORS.green} />
    </>
  );
};

const Together: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const come = springAt(frame, fps, at('soDoesPatience'), 14, 120);
  const bond = ramp(frame, at('patienceWord', -4), at('patienceWord', 10), easeOut);
  const feet = 1260;
  const W = {x: mix(120, 300, come), h: 640};
  const C = {x: 540, h: 420};
  const P = {x: mix(960, 780, come), h: 680};
  const arm = 24;
  const w1 = handPoint(W.x, feet, W.h, 'R', arm);
  const c1 = handPoint(C.x, feet, C.h, 'L', arm);
  const c2 = handPoint(C.x, feet, C.h, 'R', arm);
  const p1 = handPoint(P.x, feet, P.h, 'L', arm);
  const seg = (a: Pt, b: Pt) => <line x1={a[0]} y1={a[1]} x2={mix(a[0], b[0], bond)} y2={mix(a[1], b[1], bond)} stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />;
  return (
    <>
      <div style={{position: 'absolute', left: 540 - 420, top: 880 - 330, width: 840, height: 660, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(244,201,58,0.35) 0%, rgba(244,201,58,0) 68%)', opacity: bond}} />
      <Layer>
        {seg(w1, c1)}
        {seg(p1, c2)}
      </Layer>
      <Figure x={W.x} y={feet} h={W.h} armR={arm} step={(1 - come) * frame / 3} />
      <Figure x={C.x} y={feet} h={C.h} coat="#6f8f84" hair="bun" armL={arm} armR={arm} />
      <Figure x={P.x} y={feet} h={P.h} coat={COLORS.grey} hair="short" armL={arm} step={(1 - come) * frame / 3} />
    </>
  );
};

const ORBIT: {from: Pt; to: Pt}[] = [
  {from: [-200, 400], to: [230, 620]},
  {from: [1300, 380], to: [800, 620]},
  {from: [-200, 1300], to: [220, 1030]},
  {from: [1300, 1300], to: [860, 1030]},
];

const Herself: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const pos = (i: number): Pt => {
    const k = ramp(frame, at('feelsLikeHerself', i * 3), at('herselfWord', 4 + i * 3), easeOut);
    return [mix(ORBIT[i].from[0], ORBIT[i].to[0], k), mix(ORBIT[i].from[1], ORBIT[i].to[1], k)];
  };
  const [a, b, c, d] = [0, 1, 2, 3].map(pos);
  const link = ramp(frame, at('herselfWord', 4), at('herselfWord', 16));
  const head = headPoint(540, 1270, 660);
  return (
    <>
      <Layer opacity={link}>
        {[a, b, c, d].map((q, i) => (
          <line key={i} x1={q[0]} y1={q[1]} x2={head[0]} y2={head[1] + 60} stroke={COLORS.yellow} strokeWidth={8} strokeDasharray="3 16" strokeLinecap="round" />
        ))}
      </Layer>
      <Target cx={a[0]} cy={a[1]} r={100} cursor={[0, 0]} lock={1} />
      <TypeLine cx={b[0]} cy={b[1]} w={330} text="WORDS" shown={5} caret={false} size={72} />
      <Gear cx={c[0]} cy={c[1]} r={95} angle={frame * 5} />
      <Check cx={d[0]} cy={d[1]} size={170} t={link > 0 ? 1 : 0.6} />
      <Figure x={540} y={1270} h={660} armL={10 + link * 18} armR={10 + link * 18} />
    </>
  );
};
