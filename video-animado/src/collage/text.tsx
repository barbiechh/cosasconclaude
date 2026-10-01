import React from 'react';
import {interpolate} from 'remotion';
import {TornPaper} from './paper';
import {FONT, K} from './theme';

// Titular negro, grueso y compacto (1–3 palabras).
export const Headline: React.FC<{
  readonly text: string;
  readonly size?: number;
  readonly color?: string;
  readonly k?: number; // entrada 0..1 (con rebote)
  readonly style?: React.CSSProperties;
}> = ({text, size = 200, color = K.ink, k = 1, style}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      lineHeight: 0.9,
      letterSpacing: -1,
      textTransform: 'uppercase',
      color,
      whiteSpace: 'pre',
      opacity: interpolate(k, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'}),
      translate: `0px ${(1 - k) * 40}px`,
      ...style,
    }}
  >
    {text}
  </div>
);

// Etiqueta sobre tira de papel o bloque de color. `k` = progreso de "pegado" (spring).
export const LabelStrip: React.FC<{
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly k: number;
  readonly rot?: number;
  readonly bg?: string;
  readonly color?: string;
  readonly size?: number;
  readonly seed: string;
  readonly padX?: number;
}> = ({text, x, y, k, rot = -3, bg = K.ink, color = K.white, size = 88, seed, padX = 34}) => {
  const w = Math.round(text.length * size * 0.5 + padX * 2);
  const h = Math.round(size * 1.28);
  if (k <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        translate: '-50% -50%',
        rotate: `${rot + (1 - k) * 8}deg`,
        scale: interpolate(k, [0, 1], [1.25, 1]),
        opacity: interpolate(k, [0, 0.15], [0, 1], {extrapolateRight: 'clamp'}),
      }}
    >
      <TornPaper w={w} h={h} color={bg} seed={seed} rough={[3, 9, 3, 9]}>
        <span style={{fontFamily: FONT, fontSize: size, lineHeight: 1, color, textTransform: 'uppercase', letterSpacing: 0, paddingTop: size * 0.06}}>{text}</span>
      </TornPaper>
    </div>
  );
};
