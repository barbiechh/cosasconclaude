import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {TimedText} from './TimedText';
import {Pic, easeOut, font, mix, ramp, springAt} from './kit';
import {LeaderRing} from './figures';
import {Calendar30, Flow, Rays} from './mechanisms';
import {CTRL_ASPECT} from './scenes/Fix';
import {COLORS, LAYOUT} from '../styles/tokens';
import {BodyCueKey, bodyCueFrame} from '../data/timing';
import {END_CARD_CUE} from '../data/scenes';
import {END_CARD_TEXTS} from '../data/keywords';

export interface EndCardProps {
  usePlaceholder: boolean;
}

/** Frame de un cue relativo al inicio de la EndCard. */
export const endCardFrame = (key: BodyCueKey, offset = 0) => bodyCueFrame(key) - bodyCueFrame(END_CARD_CUE) + offset;

/**
 * "CTRL just gives her brain what it needs ... thirty day guarantee ... in
 * stock ... tap below, that's your sign."
 * El anillo del líder recibe el frasco real; la garantía es un calendario de
 * 30 días que se completa junto al frasco; cierre limpio con frasco + CTA.
 */
export const EndCard: React.FC<EndCardProps> = ({usePlaceholder: p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const e = endCardFrame;

  const rise = springAt(frame, fps, 2, 13, 140);
  const toSide = ramp(frame, e('comesWith', -4), e('comesWith', 12));
  const toFinal = ramp(frame, e('yourSign', -8), e('yourSign', 10));
  const x = mix(mix(540, 330, toSide), 540, toFinal);
  const w = mix(mix(360, 300, toSide), 300, toFinal);
  const bottom = mix(1250, 1110, toFinal);
  const h = w / CTRL_ASPECT;

  const cal = springAt(frame, fps, e('comesWith', 4), 13);
  const calOut = ramp(frame, e('tapBelow', -2), e('tapBelow', 12));
  const days = ramp(frame, e('guarantee'), e('guaranteeWord', 16), (t) => t) * 30;
  const stock = springAt(frame, fps, e('inStock', -3), 10);
  const stockOut = toFinal;
  const tap = springAt(frame, fps, e('tapBelow'), 11);
  const bob = Math.abs(Math.sin(frame / 7)) * 16;
  const sign = springAt(frame, fps, e('yourSign'), 12);

  return (
    <AbsoluteFill>
      <Rays cx={x} cy={bottom - h / 2} r0={h * 0.45} r1={h * 0.62} t={ramp(frame, 4, 22, easeOut) * (1 - toSide * 0.6)} n={18} spin={frame / 100} />
      <LeaderRing cx={x} cy={bottom - 6} rx={w * 0.72} ry={46} t={ramp(frame, 0, 14)} pulse={frame / 8} />
      {frame > e('herBrainEnd') && frame < e('comesWith', 10) && (
        <Flow path={[[x, bottom - h], [x - 40, bottom - h - 90], [x + 50, bottom - h - 150], [x, bottom - h - 220]]} t={frame} count={6} speed={34} size={14}
          opacity={ramp(frame, e('herBrainEnd'), e('herBrainEnd', 8)) * (1 - toSide)} seed="ec" />
      )}
      <Pic id="product.ctrlBottle" p={p} x={x} y={bottom - h / 2 + (1 - rise) * 420} w={w} aspect={CTRL_ASPECT} opacity={Math.min(1, rise * 2)} />

      {cal > 0 && calOut < 1 && (
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - cal) * 600 + calOut * 700}px) rotate(${(1 - cal) * 8}deg)`, transformOrigin: '760px 900px'}}>
          <Calendar30 cx={760} cy={900} w={400} days={days} />
        </div>
      )}

      {stock > 0 && (
        <div style={{position: 'absolute', left: x - 150, top: bottom - h - 100, width: 300, textAlign: 'center', transform: `scale(${stock * (1 - stockOut)})`, opacity: 1 - stockOut}}>
          <span style={{display: 'inline-block', padding: '10px 28px', borderRadius: 40, background: COLORS.green, border: `6px solid ${COLORS.ink}`, ...font, fontSize: 42, color: 'white'}}>
            ● {END_CARD_TEXTS.stock}
          </span>
        </div>
      )}

      <TimedText text={END_CARD_TEXTS.guarantee} highlight="30-DAY" enterAtFrame={e('guaranteeWord')} top={LAYOUT.topText} fontSize={74} maxWidth={960} />

      {sign > 0 && (
        <div style={{position: 'absolute', left: 90, width: 900, top: 1140, textAlign: 'center', ...font, fontSize: 66, color: COLORS.ink, transform: `translateY(${(1 - sign) * 30}px)`, opacity: Math.min(1, sign * 2)}}>
          {END_CARD_TEXTS.sign}
        </div>
      )}
      {tap > 0 && (
        <div style={{position: 'absolute', left: 540 - 220, top: mix(1275, 1250, toFinal), width: 440, textAlign: 'center', transform: `scale(${tap})`, opacity: Math.min(1, tap * 2)}}>
          <span style={{display: 'inline-block', padding: '12px 34px', borderRadius: 44, background: COLORS.yellow, border: `6px solid ${COLORS.ink}`, ...font, fontSize: 46, color: COLORS.ink}}>
            {END_CARD_TEXTS.tap} <span style={{display: 'inline-block', transform: `translateY(${bob}px)`}}>↓</span>
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
