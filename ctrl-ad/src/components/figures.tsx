/**
 * Personajes recurrentes, siempre con la misma forma y color:
 *  - Figure: persona ilustrada en papel recortado (la protagonista lleva abrigo
 *    azul; familia y seguidores, gris). No hay fotografías de personas.
 *  - Orca: el recorte de orca del hook, reutilizado en el grupo.
 *  - LeaderRing: anillo amarillo = quien guía (orca mayor y, al final, ella).
 */
import React from 'react';
import {COLORS} from '../styles/tokens';
import {Pic} from './kit';

export type Hair = 'bob' | 'short' | 'bun';

const VB_W = 200;
const VB_H = 540;

/**
 * Figura de pie, anclada por los pies en (x, y). `h` = alto en px.
 * armL/armR en grados (0 = brazo colgando, positivo = hacia afuera).
 */
export const Figure: React.FC<{
  x: number;
  y: number;
  h: number;
  coat?: string;
  hair?: Hair;
  hairColor?: string;
  armL?: number;
  armR?: number;
  lean?: number;
  flip?: boolean;
  opacity?: number;
  /** 0..1: pierde color (grises) */
  grey?: number;
  /** 0..1: se hunde (hombros y cabeza bajan) */
  slump?: number;
  /** inclinación de la cabeza en grados */
  tilt?: number;
  step?: number;
}> = ({
  x, y, h, coat = COLORS.blue, hair = 'bob', hairColor = COLORS.ink, armL = 6, armR = 6, lean = 0, flip = false,
  opacity = 1, grey = 0, slump = 0, tilt = 0, step = 0,
}) => {
  const w = (h * (VB_W + 40)) / (VB_H + 40);
  const sl = slump * 18;
  const legSwing = Math.sin(step) * 10;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`-20 -20 ${VB_W + 40} ${VB_H + 40}`}
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h,
        overflow: 'visible',
        opacity,
        transform: `rotate(${lean}deg) scaleX(${flip ? -1 : 1})`,
        transformOrigin: '50% 100%',
        filter: grey > 0 ? `grayscale(${grey}) brightness(${1 + grey * 0.08})` : undefined,
      }}
    >
      <defs>
        <filter id="paperCut" x="-30%" y="-15%" width="160%" height="135%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={5} result="thick" />
          <feFlood floodColor="#fffdf8" result="white" />
          <feComposite in="white" in2="thick" operator="in" result="outline" />
          <feDropShadow in="outline" dx={0} dy={7} stdDeviation={6} floodColor="#000" floodOpacity={0.24} result="shadowed" />
          <feMerge>
            <feMergeNode in="shadowed" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#paperCut)">
        {/* piernas */}
        <g transform={`rotate(${legSwing}, 85, 345)`}>
          <rect x={74} y={340} width={22} height={176} rx={8} fill={COLORS.ink} />
          <ellipse cx={82} cy={517} rx={21} ry={9} fill={COLORS.ink} />
        </g>
        <g transform={`rotate(${-legSwing}, 115, 345)`}>
          <rect x={104} y={340} width={22} height={176} rx={8} fill={COLORS.ink} />
          <ellipse cx={120} cy={517} rx={21} ry={9} fill={COLORS.ink} />
        </g>
        <g transform={`translate(0, ${sl})`}>
          {/* pelo detrás de la cabeza */}
          <g transform={`rotate(${tilt + slump * 14}, 100, 112)`}>
            {hair === 'bob' && (
              <path d="M58 82 Q56 22 100 20 Q144 22 142 82 L146 128 Q126 136 116 118 L84 118 Q74 136 54 128 Z" fill={hairColor} />
            )}
            {hair === 'bun' && <circle cx={100} cy={22} r={24} fill={hairColor} />}
            <rect x={89} y={104} width={22} height={34} fill={COLORS.skin} />
            <ellipse cx={100} cy={76} rx={33} ry={39} fill={COLORS.skin} />
            {hair === 'bob' && <path d="M66 72 Q66 32 102 32 Q136 34 136 74 Q120 54 96 56 Q78 58 66 72 Z" fill={hairColor} />}
            {hair !== 'bob' && <path d="M65 76 Q60 34 100 34 Q140 34 135 76 Q128 50 100 50 Q72 50 65 76 Z" fill={hairColor} />}
          </g>
          {/* abrigo */}
          <path d="M62 134 Q100 122 138 134 L160 352 Q100 364 40 352 Z" fill={coat} />
          <path d="M100 132 L100 356" stroke="rgba(0,0,0,0.14)" strokeWidth={4} />
          {/* brazos */}
          <g transform={`rotate(${armL + slump * -4}, 66, 144)`}>
            <rect x={53} y={138} width={25} height={160} rx={12} fill={coat} />
            <circle cx={65} cy={300} r={13} fill={COLORS.skin} />
          </g>
          <g transform={`rotate(${-armR - slump * -4}, 134, 144)`}>
            <rect x={122} y={138} width={25} height={160} rx={12} fill={coat} />
            <circle cx={135} cy={300} r={13} fill={COLORS.skin} />
          </g>
        </g>
      </g>
    </svg>
  );
};

/** Punto de una mano (en px del cuadro) de una figura sin girar ni hundir. */
export const handPoint = (x: number, y: number, h: number, side: 'L' | 'R', arm = 6): [number, number] => {
  const k = h / (VB_H + 40);
  const w = (VB_W + 40) * k;
  const sx = side === 'L' ? 66 : 134;
  const a = ((side === 'L' ? arm : -arm) * Math.PI) / 180;
  const hx = sx - Math.sin(a) * 156;
  const hy = 144 + Math.cos(a) * 156;
  return [x - w / 2 + (hx + 20) * k, y - h + (hy + 20) * k];
};

/** Punto de la cabeza (centro) de una figura. */
export const headPoint = (x: number, y: number, h: number): [number, number] => {
  const k = h / (VB_H + 40);
  return [x, y - h + (76 + 20) * k];
};

// La orca del recorte baja en diagonal; con -18° queda nadando recto hacia la derecha.
export const ORCA_ASPECT = 1222 / 1287;
const ORCA_LEVEL = -18;

export const Orca: React.FC<{
  p: boolean;
  x: number;
  y: number;
  w: number;
  rot?: number;
  flip?: boolean;
  opacity?: number;
  scale?: number;
  filter?: string;
}> = ({p, x, y, w, rot = 0, flip = false, opacity = 1, scale = 1, filter}) => (
  <Pic id="hook.orca" p={p} x={x} y={y} w={w} aspect={ORCA_ASPECT} rot={ORCA_LEVEL * (flip ? -1 : 1) + rot} flip={flip} opacity={opacity} scale={scale} filter={filter} />
);

/** Anillo amarillo dibujado (0..1) alrededor de un punto. */
export const LeaderRing: React.FC<{cx: number; cy: number; rx: number; ry: number; t: number; opacity?: number; pulse?: number}> = ({
  cx, cy, rx, ry, t, opacity = 1, pulse = 0,
}) => {
  if (t <= 0) return null;
  const s = 1 + 0.05 * Math.sin(pulse);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
      <ellipse cx={cx} cy={cy} rx={rx * s} ry={ry * s} fill="rgba(244,201,58,0.18)" stroke={COLORS.yellow} strokeWidth={12}
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} transform={`rotate(-8, ${cx}, ${cy})`} />
    </svg>
  );
};
