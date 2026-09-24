/**
 * "Nature built this stage of life to make a woman the one everybody follows."
 * El motivo de liderazgo de la orca (anillo amarillo al frente del grupo) pasa
 * a una figura humana con otras figuras detrás.
 */
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {mix, ramp} from '../kit';
import {Figure, Hair, LeaderRing, Orca} from '../figures';
import {Scene, SceneProps} from './SceneFrame';

const LEAD = {x: 780, y: 880};
const POD = [{x: 560, y: 740}, {x: 560, y: 1030}, {x: 340, y: 650}, {x: 340, y: 1120}, {x: 150, y: 880}];

const HUMAN_LEAD = {x: 790, feet: 1170, h: 460};
const QUEUE: {x: number; feet: number; h: number; coat: string; hair: Hair}[] = [
  {x: 600, feet: 1090, h: 370, coat: COLORS.grey, hair: 'short'},
  {x: 470, feet: 1030, h: 335, coat: '#a0685a', hair: 'bob'},
  {x: 350, feet: 975, h: 305, coat: '#7d8f7a', hair: 'bun'},
  {x: 240, feet: 930, h: 280, coat: '#8a7fa0', hair: 'short'},
  {x: 140, feet: 890, h: 255, coat: '#b0935c', hair: 'bob'},
];

export const Closing: React.FC<SceneProps> = ({plan, p}) => (
  <Scene plan={plan} punches={[plan.at('makeAWoman'), plan.at('followsFinal')]}>
    <Leadership plan={plan} p={p} />
  </Scene>
);

const Leadership: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  const frame = useCurrentFrame();
  const morph = ramp(frame, at('makeAWoman', -10), at('makeAWoman', 8));
  const walk = (lag: number) => ramp(frame, at('everybodyFollows', lag), at('everybodyFollows', 36 + lag), (t) => t);
  const ringIn = ramp(frame, 4, 20);
  const ringX = mix(LEAD.x, HUMAN_LEAD.x, morph) + walk(0) * 50;
  const ringY = mix(LEAD.y + 10, HUMAN_LEAD.feet - 10, morph);
  return (
    <>
      <LeaderRing cx={ringX} cy={ringY} rx={mix(200, 150, morph)} ry={mix(120, 48, morph)} t={ringIn} pulse={frame / 8} />
      {morph < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - morph, transform: `scale(${1 - 0.15 * morph})`, transformOrigin: '540px 880px'}}>
          {POD.map((s, i) => (
            <Orca key={i} p={p} x={s.x + frame * 0.6} y={s.y + Math.sin(frame / 10 + i) * 6} w={180} />
          ))}
          <Orca p={p} x={LEAD.x + frame * 0.6} y={LEAD.y + Math.sin(frame / 11) * 6} w={290} />
        </div>
      )}
      {morph > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: morph}}>
          {QUEUE.map((q, i) => ({q, i})).reverse().map(({q, i}) => {
            const w = walk(4 + i * 3);
            return <Figure key={i} x={q.x + w * 50} y={q.feet} h={q.h} coat={q.coat} hair={q.hair} step={w * 10} />;
          })}
          <Figure x={HUMAN_LEAD.x + walk(0) * 50} y={HUMAN_LEAD.feet} h={HUMAN_LEAD.h} step={walk(0) * 10} armL={10} armR={10} />
        </div>
      )}
    </>
  );
};
