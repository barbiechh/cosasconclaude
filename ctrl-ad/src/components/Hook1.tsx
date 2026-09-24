import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Cutout} from './Cutout';
import {TimedText} from './TimedText';
import {COLORS, FONT_FAMILY, FONT_WEIGHT, LAYOUT} from '../styles/tokens';
import {HEIGHT, WIDTH, hookCueFrame} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

// Composición: orca a la izquierda, mujer a la derecha (sin salirse del cuadro al separarse).
const SPLIT = 70;
const WOMAN = {left: 560, top: 480, width: 440, height: 660};
// Cara de la mujer dentro de su recorte (proporción del ancho/alto) y a dónde la lleva el zoom.
const FACE = {x: 0.55, y: 0.2};
const ZOOM_TO = {x: WIDTH / 2, y: 760, scale: 1.9};

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
    complete: hookCueFrame('completeOpposite'),
    opposite: hookCueFrame('opposite'),
    woman: hookCueFrame('toAWoman'),
  };

  // "complete opposite": los dos lados se separan con fuerza.
  const split = ease(interpolate(frame, [f.complete, f.complete + 9], [0, 1], clamp));
  // "...to a whale": la orca da un golpe de escala.
  const whalePulse = interpolate(frame, [f.whale, f.whale + 4, f.whale + 12], [1, 1.08, 1], clamp);

  // "...to a woman": la cámara va a su cara (la cara termina centrada y a 1.9x).
  const z = ease(interpolate(frame, [f.woman, f.woman + 12], [0, 1], clamp));
  const faceX = WOMAN.left + SPLIT + FACE.x * WOMAN.width;
  const faceY = WOMAN.top + FACE.y * WOMAN.height;
  const s = 1 + (ZOOM_TO.scale - 1) * z;
  const tx = (ZOOM_TO.x - faceX * ZOOM_TO.scale) * z;
  const ty = (ZOOM_TO.y - faceY * ZOOM_TO.scale) * z;
  const wordsOut = interpolate(frame, [f.woman, f.woman + 8], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '0 0'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${-split * SPLIT}px) scale(${whalePulse})`,
            transformOrigin: '25% 50%',
          }}
        >
          <Cutout assetId="hook.orca" usePlaceholder={usePlaceholder} enterAtFrame={f.whales}
            width={500} height={527} top={580} left={20} rotationDeg={-4} fromX={-120} fromY={0} label="ORCA — recorte editorial grande" />
        </div>

        <div style={{position: 'absolute', inset: 0, transform: `translateX(${split * SPLIT}px)`}}>
          <Cutout assetId="hook.woman" usePlaceholder={usePlaceholder} enterAtFrame={f.women - 4}
            {...WOMAN} rotationDeg={3} fromX={120} fromY={0} label="MUJER — recorte editorial grande" />
        </div>

        <div
          style={{
            position: 'absolute', top: 0, left: WIDTH / 2 - 3, width: 6, height: HEIGHT,
            backgroundColor: COLORS.ink, transformOrigin: 'top', transform: `scaleY(${split})`,
          }}
        />
      </AbsoluteFill>

      <TimedText text="PERIMENOPAUSE" highlight="PERIMENOPAUSE" enterAtFrame={f.peri} top={LAYOUT.topText} fontSize={84} />

      <div style={{position: 'absolute', inset: 0, opacity: wordsOut}}>
        <SplitWord text="COMPLETE" enterAt={f.complete} split={split} targetX={280} />
        <SplitWord text="OPPOSITE" enterAt={f.opposite} split={split} targetX={790} strikeAt={f.opposite + 5} />
      </div>
    </AbsoluteFill>
  );
};

/** Palabra que sale del centro hacia su mitad; con `strikeAt`, se tacha con un trazo rojo. */
const SplitWord: React.FC<{text: string; enterAt: number; split: number; targetX: number; strikeAt?: number}> = ({
  text, enterAt, split, targetX, strikeAt,
}) => {
  const frame = useCurrentFrame();
  if (frame < enterAt) return null;
  const x = WIDTH / 2 + (targetX - WIDTH / 2) * Math.max(split, 0.35);
  const pop = interpolate(frame, [enterAt, enterAt + 5], [0.6, 1], clamp);
  const op = interpolate(frame, [enterAt, enterAt + 4], [0, 1], clamp);
  const strike = strikeAt === undefined ? 0 : ease(interpolate(frame, [strikeAt, strikeAt + 8], [0, 1], clamp));
  const W = 400;
  return (
    <div style={{position: 'absolute', top: 1230, left: x - W / 2, width: W, textAlign: 'center', opacity: op, transform: `scale(${pop})`}}>
      <span style={{fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT, fontSize: 68, color: COLORS.ink, letterSpacing: -0.5}}>{text}</span>
      {strikeAt !== undefined && (
        <svg width={W + 40} height={90} style={{position: 'absolute', left: -20, top: 0, overflow: 'visible'}}>
          <path d={`M 20 58 C ${W * 0.35} 40, ${W * 0.65} 52, ${W + 20} 30`} fill="none" stroke={COLORS.red} strokeWidth={11}
            strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
        </svg>
      )}
    </div>
  );
};
