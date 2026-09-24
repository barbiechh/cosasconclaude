/**
 * "...until she snaps at the people she loves most. And because it creeps in
 * over a year or two, she starts to believe this is just who she is now."
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Layer, Pt, easeOut, mix, ramp, springAt} from '../kit';
import {Figure, handPoint} from '../figures';
import {Crack, Gear, Target, TypeLine} from '../mechanisms';
import {CalendarFlip} from '../graphics';
import {Scene, SceneProps} from './SceneFrame';

type At = SceneProps['plan']['at'];

export const Family: React.FC<SceneProps> = ({plan}) => {
  const at = plan.at;
  return (
    <Scene plan={plan} punches={[at('snapsWord'), at('isNow')]}>
      <Beat from={0} to={at('creepsIn')} enter="fade" exit="fade">
        <Snap at={at} />
      </Beat>
      <Beat from={at('creepsIn')} to={at('sheStarts')} enter="up" exit="up">
        <Creeps at={at} />
      </Beat>
      <Beat from={at('sheStarts')} to={plan.durationInFrames} enter="fade" exit="fade">
        <Identity at={at} />
      </Beat>
    </Scene>
  );
};

const Snap: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const snap = at('snapsWord');
  const apart = springAt(frame, fps, snap, 9, 260);
  const turn = frame >= at('peopleSheLoves', 4);
  const away = ramp(frame, at('peopleSheLoves'), at('peopleSheLoves', 16));
  const crack = ramp(frame, snap - 1, snap + 4, (t) => t);
  const crackOut = ramp(frame, snap + 26, snap + 40);
  const flash = Math.max(0, 1 - Math.abs(frame - snap - 1) / 4);

  const W = {x: 400 - apart * 140, h: 640};
  const P = {x: 640 + apart * 110 + away * 20, h: 680};
  const C = {x: 810 + apart * 90 + away * 20, h: 430};
  const feet = 1260;
  const wh = handPoint(W.x, feet, W.h, 'R', 34 * (1 - apart) + 6);
  const ph = handPoint(P.x, feet, P.h, 'L', 34 * (1 - apart) + 6);
  // el lazo entre las manos se parte en dos y cuelga
  const mid: Pt = [(wh[0] + ph[0]) / 2, (wh[1] + ph[1]) / 2];
  const droop = apart * 90;
  return (
    <>
      {flash > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(178,58,46,${0.18 * flash})`}} />}
      <Layer>
        {apart < 0.02 ? (
          <line x1={wh[0]} y1={wh[1]} x2={ph[0]} y2={ph[1]} stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />
        ) : (
          <>
            <path d={`M ${wh} Q ${wh[0] + 30} ${wh[1] + droop} ${wh[0] + 40 - apart * 20} ${wh[1] + droop * 1.2}`} fill="none" stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />
            <path d={`M ${ph} Q ${ph[0] - 30} ${ph[1] + droop} ${ph[0] - 40 + apart * 20} ${ph[1] + droop * 1.2}`} fill="none" stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />
          </>
        )}
      </Layer>
      <Figure x={W.x} y={feet} h={W.h} armR={34 * (1 - apart) + 6} armL={6 + apart * 14} lean={-apart * 4} />
      <Figure x={P.x} y={feet} h={P.h} coat={COLORS.grey} hair="short" armL={34 * (1 - apart) + 6} flip={turn} grey={away * 0.5} lean={apart * 3} />
      <Figure x={C.x} y={feet} h={C.h} coat="#6f8f84" hair="bun" flip={turn} grey={away * 0.5} lean={apart * 5} />
      <Crack cx={mid[0] + 10} top={620} bottom={1260} t={crack} opacity={1 - crackOut} />
    </>
  );
};

const Creeps: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const creep = ramp(frame, at('creepsIn'), at('sheStarts'), (t) => t);
  return (
    <>
      <CalendarFlip x={330} y={640} enterAt={at('creepsIn')} flipFrom={at('overAYear', -4)} flipTo={at('sheStarts', -4)} />
      {/* una sombra gris que sube despacio */}
      <div style={{position: 'absolute', left: 0, right: 0, top: mix(1400, 560, creep), bottom: 620,
        background: 'linear-gradient(180deg, rgba(143,137,126,0) 0%, rgba(143,137,126,0.45) 30%, rgba(143,137,126,0.55) 100%)'}} />
    </>
  );
};

const SLOTS: {from: Pt; to: Pt}[] = [
  {from: [-300, 500], to: [275, 660]},
  {from: [1400, 520], to: [800, 660]},
  {from: [-300, 1200], to: [265, 1050]},
  {from: [1400, 1200], to: [815, 1050]},
];

const Identity: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frameDrop = springAt(frame, fps, at('thisIsJustWho', 4), 12);
  const fix = ramp(frame, at('isNow', -2), at('isNow', 6));
  const pos = (i: number): Pt => {
    const k = ramp(frame, at('sheStarts', i * 5), at('sheStarts', 16 + i * 5), easeOut);
    const s = SLOTS[i];
    return [mix(s.from[0], s.to[0], k), mix(s.from[1], s.to[1], k)];
  };
  const [a, b, c, d] = [0, 1, 2, 3].map(pos);
  const grey = mix(0.5, 1, fix);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, filter: `grayscale(${grey})`}}>
        <Target cx={a[0]} cy={a[1]} r={90} cursor={[70, 60]} lock={0} />
        <TypeLine cx={b[0]} cy={b[1]} w={300} text="WORDS" shown={2} caret={false} size={70} />
        <Gear cx={c[0]} cy={c[1]} r={85} angle={20} grey />
        <Layer>
          <path d={`M ${d[0] - 80} ${d[1] - 20} Q ${d[0] - 40} ${d[1] + 40} ${d[0]} ${d[1] + 50}`} fill="none" stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />
          <path d={`M ${d[0] + 80} ${d[1] - 20} Q ${d[0] + 40} ${d[1] + 40} ${d[0] + 10} ${d[1] + 60}`} fill="none" stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />
        </Layer>
      </div>
      <Figure x={540} y={1250} h={600} grey={mix(0.55, 0.9, fix)} slump={0.5} />
      {frameDrop > 0 && (
        <div style={{position: 'absolute', left: 110, top: 480, width: 860, height: 820, boxSizing: 'border-box',
          border: `${mix(12, 22, fix)}px solid ${COLORS.ink}`, borderRadius: 8, boxShadow: 'inset 0 0 0 10px #fffdf8, 0 16px 30px rgba(0,0,0,0.25)',
          transform: `translateY(${(1 - frameDrop) * -900}px) scale(${1 + fix * 0.02 * Math.sin(frame)})`}} />
      )}
    </>
  );
};
