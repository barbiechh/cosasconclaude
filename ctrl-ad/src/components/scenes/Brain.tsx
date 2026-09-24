/**
 * "Nobody tells her otherwise, because everyone is looking at the hormones,
 * and nobody at what the hormones were doing for her brain. Estrogen had a
 * second job all along. For forty years it helped the brain make dopamine,
 * the chemical behind focus, drive and follow through."
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Card, Layer, Pic, Pt, easeOut, font, mix, ramp, springAt} from '../kit';
import {Figure} from '../figures';
import {Arrow, Check, Flow, Gear, Target} from '../mechanisms';
import {Scene, SceneProps} from './SceneFrame';

type At = SceneProps['plan']['at'];

export const Brain: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  return (
    <Scene plan={plan} punches={[at('herBrain'), at('secondJob'), at('focusWord'), at('driveWord'), at('followThrough')]}>
      <Beat from={0} to={at('everyoneLooking', -4)} enter="fade" exit="fade">
        <NobodyTells at={at} />
      </Beat>
      <Beat from={at('everyoneLooking', -4)} to={plan.durationInFrames} enter="fade" exit="fade">
        <System p={p} at={at} />
      </Beat>
    </Scene>
  );
};

const NobodyTells: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubble = springAt(frame, fps, 6, 12);
  const empty = ramp(frame, at('otherwise'), at('otherwise', 10));
  return (
    <>
      <Figure x={400} y={1260} h={640} grey={0.4} slump={0.4} />
      {bubble > 0 && (
        <div style={{position: 'absolute', left: 600, top: 600, width: 340, height: 220, transform: `scale(${bubble})`, transformOrigin: '0% 100%'}}>
          <svg width={340} height={260} style={{position: 'absolute', overflow: 'visible'}}>
            <path d="M 30 10 H 310 Q 330 10 330 30 V 170 Q 330 190 310 190 H 90 L 20 250 L 50 190 H 30 Q 10 190 10 170 V 30 Q 10 10 30 10 Z" fill={COLORS.card} stroke={COLORS.ink} strokeWidth={8} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={110 + i * 60} cy={100} r={16} fill={COLORS.ink} opacity={(1 - empty) * (Math.floor(frame / 5 + i) % 3 === 0 ? 1 : 0.35)} />
            ))}
          </svg>
        </div>
      )}
    </>
  );
};

const ARROWS: [Pt, Pt][] = [
  [[120, 470], [300, 620]],
  [[970, 460], [790, 610]],
  [[100, 1120], [280, 920]],
  [[990, 1100], [800, 920]],
  [[560, 1300], [540, 980]],
];

const MECH = {focus: 220, drive: 540, follow: 860, y: 1090};

const System: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // fases de cámara
  const reveal = ramp(frame, at('andNobodyAt', 16), at('herBrain', 6));
  const toEstro = ramp(frame, at('estrogen', -4), at('estrogen', 14));
  const toMech = ramp(frame, at('theChemical', -6), at('theChemical', 14));

  // el cerebro: fuera del área de atención -> centro -> derecha -> arriba
  let bx = mix(150, 540, reveal);
  let by = mix(1250, 800, reveal);
  let bw = mix(230, 540, reveal);
  bx = mix(bx, 700, toEstro);
  by = mix(by, 900, toEstro);
  bw = mix(bw, 440, toEstro);
  bx = mix(bx, 540, toMech);
  by = mix(by, 640, toMech);
  bw = mix(bw, 400, toMech);
  const brainGrey = 1 - reveal;

  const cardOut = reveal;
  const arrowsFade = ramp(frame, at('andNobodyAt'), at('andNobodyAt', 12));

  // estrógeno
  const node = springAt(frame, fps, at('estrogen', 2), 11);
  const estroOut = toMech;
  const b1 = ramp(frame, at('estrogen', 6), at('estrogen', 18), easeOut);
  const b2 = ramp(frame, at('secondJob', -2), at('secondJob', 14), easeOut);
  const pulse = ramp(frame, at('forFortyYears'), at('forFortyYears', 8));
  const dopa = ramp(frame, at('makeDopamine', -4), at('makeDopamine', 8));

  const focusLock = ramp(frame, at('focusWord', -2), at('focusWord', 8), easeOut);
  const driveOn = frame >= at('driveWord');
  const followT = ramp(frame, at('followThrough'), at('followThrough', 14));
  let gearAngle = 0;
  for (let f = at('driveWord'); f < frame; f++) gearAngle += 7;
  const mechIn = (i: number) => springAt(frame, fps, at('theChemical', 4 + i * 4), 12);

  return (
    <>
      {/* la tarjeta que todos miran */}
      {cardOut < 1 && (
        <div style={{position: 'absolute', inset: 0, transform: `translateY(${-cardOut * 800}px)`, opacity: 1 - cardOut}}>
          <Card x={540} y={780} w={560} h={360} rot={-2}>
            <div style={{position: 'absolute', top: 50, width: '100%', textAlign: 'center', ...font, fontSize: 72, color: COLORS.ink}}>HORMONES</div>
            <svg width={560} height={200} style={{position: 'absolute', top: 150, left: 0}}>
              <path d="M 40 110 C 120 20 180 20 250 100 S 400 180 520 60" fill="none" stroke={COLORS.red} strokeWidth={12} strokeLinecap="round" />
            </svg>
          </Card>
          {ARROWS.map(([a, b], i) => (
            <Arrow key={i} a={a} b={b} t={ramp(frame, at('everyoneLooking', i * 6), at('everyoneLooking', 10 + i * 6), easeOut)} width={14} opacity={1 - arrowsFade} />
          ))}
        </div>
      )}

      {/* estrógeno y sus dos trabajos */}
      {node > 0 && estroOut < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - estroOut}}>
          <Layer>
            <path d="M 250 700 L 250 1210" fill="none" stroke={COLORS.blue} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b1} />
            <circle cx={250} cy={1220} r={24 * b1} fill={COLORS.blue} stroke={COLORS.ink} strokeWidth={6} />
            <path d="M 250 860 C 330 960 420 920 520 900" fill="none" stroke={COLORS.blue} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b2} />
          </Layer>
          {pulse > 0 && <Flow path={[[250, 700], [250, 860], [420, 920], [520, 900]]} t={frame} count={6} speed={36} size={14} color={COLORS.blue} opacity={pulse} seed="es" />}
          <div style={{position: 'absolute', left: 250 - 130, top: 600 - 90, width: 260, height: 180, borderRadius: 90, background: COLORS.blue, border: `7px solid ${COLORS.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: 44, color: 'white', transform: `scale(${node})`, boxShadow: '0 12px 24px rgba(0,0,0,0.2)'}}>
            ESTROGEN
          </div>
        </div>
      )}

      {/* dopamina hacia los tres mecanismos */}
      {dopa > 0 && toMech < 1 && <Flow path={[[bx, by + 120], [bx, by + 260], [bx - 60, by + 300], [bx - 40, by + 380]]} t={frame} count={8} opacity={dopa * (1 - toMech)} seed="d0" />}
      {toMech > 0 && (
        <>
          <Flow path={[[540, 780], [540, 900], [MECH.focus, 860], [MECH.focus, MECH.y - 110]]} t={frame} count={7} opacity={toMech} seed="d1" />
          <Flow path={[[540, 780], [540, 880], [MECH.drive, 900], [MECH.drive, MECH.y - 110]]} t={frame} count={7} opacity={toMech} seed="d2" />
          <Flow path={[[540, 780], [540, 900], [MECH.follow, 860], [MECH.follow, MECH.y - 110]]} t={frame} count={7} opacity={toMech} seed="d3" />
          <div style={{position: 'absolute', inset: 0, transform: `scale(${mechIn(0)})`, transformOrigin: `${MECH.focus}px ${MECH.y}px`}}>
            <Target cx={MECH.focus} cy={MECH.y} r={110} cursor={[mix(80, 0, focusLock), mix(-70, 0, focusLock)]} lock={focusLock} />
          </div>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${mechIn(1)})`, transformOrigin: `${MECH.drive}px ${MECH.y}px`}}>
            <Gear cx={MECH.drive} cy={MECH.y} r={110} angle={gearAngle} grey={!driveOn} />
          </div>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${mechIn(2)})`, transformOrigin: `${MECH.follow}px ${MECH.y}px`}}>
            <Layer>
              <line x1={MECH.follow - 100} x2={MECH.follow + 90} y1={MECH.y + 40} y2={MECH.y + 40} stroke={COLORS.ink} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 20" />
              <circle cx={mix(MECH.follow - 100, MECH.follow + 60, followT)} cy={MECH.y + 40} r={34} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={7} />
            </Layer>
            <Check cx={MECH.follow + 40} cy={MECH.y - 50} size={140} t={ramp(frame, at('followThrough', 10), at('followThrough', 20))} />
          </div>
        </>
      )}

      <Pic id="body.brainDiagram" p={p} x={bx} y={by} w={bw} aspect={1.5} opacity={mix(0.55, 1, reveal)} filter={brainGrey > 0.01 ? `grayscale(${brainGrey})` : undefined}
        scale={1 + 0.05 * Math.sin(Math.PI * dopa)} />
    </>
  );
};
