/**
 * "Obviously a woman isn't a whale. But if a brain at this age is built to be
 * at its best, why do so many women ... feel like the worst version of themselves?"
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Layer, Pic, font, mix, ramp, springAt} from '../kit';
import {Figure, Hair, OrcaTail, TAIL_ASPECT} from '../figures';
import {Rays} from '../mechanisms';
import {Scene, SceneProps} from './SceneFrame';

type At = SceneProps['plan']['at'];

export const Bridge: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  return (
    <Scene plan={plan} punches={[at('isntAWhale'), at('bestWord'), at('worstVersion')]}>
      <Beat from={0} to={at('butIfABrain')} enter="fade" exit="fade">
        <NotAWhale p={p} at={at} />
      </Beat>
      <Beat from={at('butIfABrain')} to={at('whyDoSoMany')} enter="up" exit="shrink">
        <AtItsBest p={p} at={at} />
      </Beat>
      <Beat from={at('whyDoSoMany')} to={plan.durationInFrames} enter="fade" exit="fade">
        <SoManyWomen at={at} />
      </Beat>
    </Scene>
  );
};

const WATER_Y = 1040;

const NotAWhale: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const neq = springAt(frame, fps, at('isntAWhale'), 9, 260);
  // la cola sube del agua al entrar y se hunde un poco después del "≠"
  const tailY = (1 - springAt(frame, fps, 2, 14)) * (420 / TAIL_ASPECT + 80) + ramp(frame, at('isntAWhale', 10), at('butIfABrain'), (t) => t) * 60;
  return (
    <>
      <Figure x={290} y={1240} h={640} />
      {/* cola que sale del agua (detalle; la orca completa ya se vio en la escena anterior) */}
      <div style={{position: 'absolute', left: 560, top: 560, width: 480, height: WATER_Y - 560, overflow: 'hidden'}}>
        <OrcaTail p={p} x={250} y={WATER_Y - 560 - 150 + tailY} w={400} rot={-14 + Math.sin(frame / 12) * 2} />
      </div>
      <Layer>
        <path d={`M 560 ${WATER_Y} q 30 -14 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`} fill="none" stroke={COLORS.ink} strokeWidth={10} strokeLinecap="round" />
        <path d={`M 600 ${WATER_Y + 26} q 30 -10 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`} fill="none" stroke="#9fb4c3" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
      </Layer>
      {neq > 0 && (
        <div style={{position: 'absolute', left: 540 - 150, top: 860 - 150, width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...font, fontSize: 300, lineHeight: 1, color: COLORS.red, transform: `scale(${mix(2.2, 1, neq)})`, opacity: Math.min(1, neq * 2),
          textShadow: `0 0 0 ${COLORS.ink}, 6px 6px 0 ${COLORS.ink}`}}>
          ≠
        </div>
      )}
    </>
  );
};

const AtItsBest: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brain = springAt(frame, fps, at('brainWord'), 11);
  const best = ramp(frame, at('bestWord', -2), at('bestWord', 12));
  return (
    <>
      <Rays cx={540} cy={620} r0={150} r1={250} t={best} n={16} spin={frame / 60} />
      {brain > 0 && <Pic id="body.brainDiagram" p={p} x={540} y={620} w={400} aspect={1.5} scale={brain * (1 + 0.12 * best)} />}
      <Layer opacity={brain}>
        <line x1={540} y1={760} x2={540} y2={820} stroke={COLORS.ink} strokeWidth={8} strokeDasharray="6 12" strokeLinecap="round" />
      </Layer>
      <Figure x={540} y={1300} h={500} armL={8 + best * 20} armR={8 + best * 20} />
    </>
  );
};

const CROWD: {x: number; coat: string; hair: Hair; h: number}[] = [
  {x: 170, coat: '#7d8f7a', hair: 'bun', h: 440},
  {x: 355, coat: '#a0685a', hair: 'bob', h: 470},
  {x: 540, coat: COLORS.blue, hair: 'bob', h: 490},
  {x: 725, coat: '#8a7fa0', hair: 'short', h: 460},
  {x: 910, coat: '#b0935c', hair: 'bun', h: 450},
];

const SoManyWomen: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const worst = ramp(frame, at('feelingLike'), at('worstVersion', 12));
  const line = ramp(frame, at('feelingLike'), at('worstVersion', 10), (t) => t);
  const order = [2, 1, 3, 0, 4];
  return (
    <>
      <Layer>
        <path d="M 110 500 C 380 500 520 560 640 610 S 900 690 980 700" fill="none" stroke={COLORS.red} strokeWidth={16} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} opacity={0.9} />
      </Layer>
      {CROWD.map((c, i) => {
        const k = springAt(frame, fps, at('whyDoSoMany', order.indexOf(i) * 5), 12);
        if (k <= 0) return null;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - k) * 120}px)`, opacity: Math.min(1, k * 2)}}>
            <Figure x={c.x} y={1230} h={c.h} coat={c.coat} hair={c.hair} slump={worst} grey={worst * 0.75} lean={worst * (i % 2 ? 3 : -3)} tilt={worst * (i % 2 ? -6 : 6)} />
          </div>
        );
      })}
    </>
  );
};
