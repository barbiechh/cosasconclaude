/**
 * "In perimenopause it doesn't just drop, it flickers, like a light on a bad
 * switch, and every time it dips, dopamine dips with it. That's the fog."
 * El foco parpadea de forma irregular (cada apagón = un clic) y la línea de
 * dopamina, conectada debajo, baja un escalón en cada apagón.
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Card, Layer, Pic, mix, ramp, springAt} from '../kit';
import {Arrow, Bulb, Cross, Fog} from '../mechanisms';
import {Scene, SceneProps} from './SceneFrame';
import {BodyCueKey} from '../../data/timing';

/** Apagones del foco: [cue, desfase, duración en frames]. También los usa el diseño sonoro. */
export const FLICKERS: [BodyCueKey, number, number][] = [
  ['flickers', 0, 3],
  ['flickers', 6, 4],
  ['lightWord', 0, 3],
  ['badSwitch', 0, 5],
  ['switchWord', 2, 3],
  ['itDips', 0, 5],
  ['dopamineDips', 2, 4],
  ['dipsWord', 0, 6],
];
const DIPS_FROM: BodyCueKey = 'everyTimeItDips';

const G = {x0: 140, x1: 940, top: 1000, bottom: 1230};

export const Flicker: React.FC<SceneProps> = ({plan, p}) => (
  <Scene plan={plan} punches={[plan.at('flickers'), plan.at('dipsWord')]}>
    <FlickerSystem plan={plan} p={p} />
  </Scene>
);

const FlickerSystem: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const offs = FLICKERS.map(([k, o, d]) => [at(k, o), at(k, o) + d] as const);
  const isOff = (f: number) => offs.some(([a, b]) => f >= a && f < b);
  const dimmed = mix(1, 0.6, ramp(frame, at('justDrop', -4), at('justDrop', 12)));
  const glow = isOff(frame) ? 0.05 : frame >= at('flickers') ? 0.95 : dimmed;

  // dopamina: baja un escalón en cada apagón a partir de "every time it dips"
  const dipStart = at(DIPS_FROM);
  const level = (f: number) => {
    let v = 0.85;
    for (const [a] of offs) if (a >= dipStart && f >= a) v -= 0.14 * Math.min(1, (f - a) / 4);
    return Math.max(0.1, v);
  };
  const gIn = at(DIPS_FROM, -10);
  const gEnd = plan.durationInFrames;
  const gShow = springAt(frame, fps, gIn, 13);
  const pts: string[] = [];
  for (let f = gIn; f <= Math.min(frame, gEnd); f++) {
    const x = mix(G.x0 + 20, G.x1 - 20, (f - gIn) / (gEnd - gIn));
    const y = mix(G.bottom - 20, G.top + 20, level(f));
    pts.push(`${pts.length ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const tip = pts.length ? pts[pts.length - 1].split(' ').slice(1).map(Number) : [G.x0, G.bottom];

  const sw = springAt(frame, fps, at('lightWord', -4), 12);
  const toggle = isOff(frame) ? 8 : -8;
  const dropArrow = ramp(frame, at('justDrop', -4), at('justDrop', 10));
  const notJust = ramp(frame, at('flickers', -2), at('flickers', 8));
  const fog = ramp(frame, at('thatsTheFog'), at('fogWord', 10));
  const bulbX = sw > 0 ? mix(540, 660, Math.min(1, sw)) : 540;

  return (
    <>
      <div style={{position: 'absolute', inset: 0, filter: fog > 0 ? `blur(${fog * 3.5}px)` : undefined}}>
        {/* cable del interruptor al foco y del foco a la gráfica */}
        <Layer>
          {sw > 0 && <path d={`M 300 720 C 420 720 460 600 ${bulbX - 90} 640`} fill="none" stroke={COLORS.ink} strokeWidth={9} opacity={Math.min(1, sw)} />}
          {gShow > 0 && (
            <line x1={bulbX} y1={860} x2={bulbX} y2={G.top - 10} stroke={isOff(frame) ? COLORS.grey : COLORS.yellow} strokeWidth={12} strokeDasharray="4 18" strokeLinecap="round" opacity={gShow} />
          )}
        </Layer>
        {sw > 0 && (
          <div style={{position: 'absolute', inset: 0, transform: `scale(${sw})`, transformOrigin: '230px 720px'}}>
            <Pic id="body.lightSwitch" p={p} x={230} y={720} w={270} aspect={1.06} rot={toggle * 0.2} />
          </div>
        )}
        <Bulb cx={bulbX} cy={660} size={250} glow={glow} />
        {/* "doesn't just drop": la caída suave que uno esperaría, tachada */}
        {dropArrow > 0 && notJust < 1 && (
          <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(frame, at('flickers', 14), at('flickers', 22))}}>
            <Arrow a={[bulbX + 230, 560]} b={[bulbX + 230, 860]} t={dropArrow} color={COLORS.inkSoft} width={12} />
            <Cross cx={bulbX + 230} cy={710} size={150} t={notJust} />
          </div>
        )}
        {gShow > 0 && (
          <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, gShow), transform: `translateY(${(1 - gShow) * 120}px)`}}>
            <Card x={(G.x0 + G.x1) / 2} y={(G.top + G.bottom) / 2} w={G.x1 - G.x0 + 40} h={G.bottom - G.top + 40} />
            <Layer>
              <path d={pts.join(' ')} fill="none" stroke={COLORS.ink} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
              <path d={pts.join(' ')} fill="none" stroke={COLORS.yellow} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={tip[0]} cy={tip[1]} r={20} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={6} />
            </Layer>
          </div>
        )}
      </div>
      <Fog x={40} y={480} w={1000} h={840} amount={fog * 0.85} t={frame} />
    </>
  );
};
