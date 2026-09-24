import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {Cutout} from './Cutout';
import {TimedText} from './TimedText';
import {COLORS, LAYOUT} from '../styles/tokens';
import {HEIGHT, HOOK_FRAMES, WIDTH, hookCueFrame} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * HOOK 1 — módulo autocontenido. Sus tiempos salen de HOOK.cues (relativos a
 * su propio inicio). Un Hook2 es otro componente con la misma forma.
 */
export const Hook1: React.FC<HookProps> = ({usePlaceholder}) => {
  const frame = useCurrentFrame();
  const f = {
    women: hookCueFrame('women'),
    whales: hookCueFrame('killerWhales'),
    peri: hookCueFrame('perimenopause'),
    whale: hookCueFrame('toAWhale'),
    opposite: hookCueFrame('completeOpposite'),
    woman: hookCueFrame('toAWoman'),
  };

  // "complete opposite": los dos lados se separan con fuerza.
  const split = interpolate(frame, [f.opposite, f.opposite + 9], [0, 1], clamp);
  const splitEase = 1 - Math.pow(1 - split, 3);
  // "...to a whale": la orca da un pequeño golpe de escala.
  const whalePulse = interpolate(frame, [f.whale, f.whale + 4, f.whale + 12], [1, 1.07, 1], clamp);
  // "...to a woman": zoom controlado hacia la mujer, preparando el corte.
  const womanZoom = interpolate(frame, [f.woman, HOOK_FRAMES], [1, 1.1], clamp);

  return (
    <AbsoluteFill>
      <PaperBackground />

      <AbsoluteFill
        style={{
          transform: `scale(${womanZoom})`,
          transformOrigin: '72% 55%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${-splitEase * 70}px) scale(${whalePulse})`,
            transformOrigin: '25% 50%',
          }}
        >
          <Cutout
            assetId="hook.orca"
            usePlaceholder={usePlaceholder}
            enterAtFrame={f.whales}
            width={500}
            height={420}
            top={620}
            left={30}
            rotationDeg={-4}
            fromX={-120}
            fromY={0}
            label="ORCA — recorte editorial grande"
          />
        </div>

        <div style={{position: 'absolute', inset: 0, transform: `translateX(${splitEase * 70}px)`}}>
          <Cutout
            assetId="hook.woman"
            usePlaceholder={usePlaceholder}
            enterAtFrame={f.women - 4}
            width={480}
            height={720}
            top={470}
            left={WIDTH - 520}
            rotationDeg={3}
            fromX={120}
            fromY={0}
            label="MUJER — recorte editorial grande"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: WIDTH / 2 - 3,
            width: 6,
            height: HEIGHT,
            backgroundColor: COLORS.ink,
            transformOrigin: 'top',
            transform: `scaleY(${split})`,
          }}
        />
      </AbsoluteFill>

      <TimedText text="PERIMENOPAUSE" highlight="PERIMENOPAUSE" enterAtFrame={f.peri} top={LAYOUT.topText} fontSize={84} />
      <TimedText text="the complete opposite" enterAtFrame={f.opposite} top={LAYOUT.bottomText} fontSize={60} />
    </AbsoluteFill>
  );
};
