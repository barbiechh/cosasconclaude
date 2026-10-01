import React, {useId} from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {E, MONO, SANS} from './theme';

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Progreso suave 0..1 entre dos frames.
export const prog = (f: number, a: number, b: number, e: (t: number) => number = ease) =>
  interpolate(f, [a, b], [0, 1], {...cl, easing: e});

// Entrada con un rebote pequeño y contenido.
export const settle = (f: number, start: number, fps: number, damping = 16) =>
  spring({frame: f - start, fps, config: {damping, stiffness: 120, mass: 0.8}});

export const mix = (k: number, a: number, b: number) => a + (b - a) * k;

// Mezcla dos colores hex (k = 0 -> a, 1 -> b).
export const mixHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
};

export const useSafeId = (p: string) => `${p}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

// Filtros comunes: recorte con borde crema fino + sombra suave.
export const EditorialDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="ed-cut" x="-20%" y="-20%" width="140%" height="140%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d" />
        <feFlood floodColor={E.cream} />
        <feComposite in2="d" operator="in" result="border" />
        <feGaussianBlur in="d" stdDeviation="12" result="blur" />
        <feOffset in="blur" dx="0" dy="14" result="so" />
        <feFlood floodColor="#1d2b3a" floodOpacity="0.22" />
        <feComposite in2="so" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="border" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="ed-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
        <feOffset in="blur" dx="0" dy="14" result="so" />
        <feFlood floodColor="#0b1219" floodOpacity="0.25" />
        <feComposite in2="so" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// Fondo a sangre: papel claro u oscuro, grano fino y viñeta suave.
export const Paper: React.FC<{readonly dark?: boolean; readonly tint?: string}> = ({dark = false, tint}) => {
  const bg = tint ?? (dark ? E.night : E.paper);
  return (
    <AbsoluteFill style={{backgroundColor: bg}}>
      <EditorialDefs />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="ed-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
            <feColorMatrix
              values={
                dark
                  ? '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.10 -0.03'
                  : '0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0.22 -0.06'
              }
            />
          </filter>
          <radialGradient id="ed-vig" cx="0.5" cy="0.48" r="0.78">
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor={dark ? '#000' : '#5a4630'} stopOpacity={dark ? 0.45 : 0.14} />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} filter="url(#ed-grain)" />
        <rect width={1080} height={1920} fill="url(#ed-vig)" />
      </svg>
    </AbsoluteFill>
  );
};

// Pieza colocada en el lienzo, centrada en (x, y). `cut` = recorte con borde y sombra.
export const Piece: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly cut?: boolean;
  readonly soft?: boolean;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({x, y, cut = false, soft = false, style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      translate: '-50% -50%',
      display: 'flex',
      filter: cut ? 'url(#ed-cut)' : soft ? 'url(#ed-soft)' : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

// Lienzo SVG a pantalla completa para trazos, líneas guía y partículas.
export const Canvas: React.FC<{readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({
  children,
  style,
}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}>
    {children}
  </svg>
);

// Trazo que se dibuja (draw 0..1).
export const Ink: React.FC<{
  readonly d: string;
  readonly draw: number;
  readonly color?: string;
  readonly width?: number;
  readonly dash?: string;
  readonly opacity?: number;
}> = ({d, draw, color = E.ink, width = 5, dash, opacity = 1}) =>
  draw <= 0 ? null : dash ? (
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} opacity={opacity * Math.min(1, draw * 3)} />
  ) : (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.min(1, draw)}
      opacity={opacity}
    />
  );

// Etiqueta en versalitas con filete fino que se extiende.
export const Label: React.FC<{
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly k: number; // 0..1 entrada
  readonly color?: string;
  readonly align?: 'left' | 'center' | 'right';
  readonly size?: number;
  readonly mono?: boolean;
}> = ({text, x, y, k, color = E.ink, align = 'center', size = 34, mono = false}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      translate: align === 'center' ? '-50% -50%' : align === 'right' ? '-100% -50%' : '0 -50%',
      opacity: k,
      fontFamily: mono ? MONO : SANS,
      fontWeight: mono ? 500 : 700,
      fontSize: size,
      letterSpacing: mono ? 2 : 6,
      color,
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
      gap: 10,
      marginTop: (1 - k) * 16,
    }}
  >
    <span>{text}</span>
    <span style={{height: 3, width: `${k * 100}%`, background: color, opacity: 0.6}} />
  </div>
);

// Trama de semitono.
export const Halftone: React.FC<{readonly id: string; readonly color: string; readonly size?: number}> = ({id, color, size = 10}) => (
  <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <circle cx={size / 2} cy={size / 2} r={size * 0.28} fill={color} />
  </pattern>
);

// Cámara lenta de escena: un leve acercamiento continuo.
export const useDrift = (from = 1.03, to = 1) => {
  const f = useCurrentFrame();
  return {f, scale: interpolate(f, [0, 240], [from, to], {...cl, easing: Easing.inOut(Easing.quad)})};
};
