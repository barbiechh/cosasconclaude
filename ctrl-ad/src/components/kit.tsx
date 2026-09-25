/**
 * Primitivas de movimiento compartidas por el hook, el body y el cierre.
 * Todo se mide en frames locales de la escena; los tiempos vienen de cues.
 */
import React from 'react';
import {Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_WEIGHT} from '../styles/tokens';
import {getAssetSlot, resolveAsset} from '../data/assets';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.inOut(Easing.cubic);
export const easeOut = Easing.out(Easing.cubic);
export const font = {fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT} as const;

/** 0→1 entre dos frames, con curva. */
export const ramp = (frame: number, a: number, b: number, curve: (t: number) => number = ease) =>
  curve(interpolate(frame, [a, b], [0, 1], clamp));

/** Mezcla lineal. */
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Resorte corto que arranca en `at` (0 antes). */
export const springAt = (frame: number, fps: number, at: number, damping = 13, stiffness = 190) =>
  frame < at ? 0 : spring({frame: frame - at, fps, config: {damping, stiffness, mass: 0.6}});

export const useSpringAt = (at: number, damping = 13, stiffness = 190) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return springAt(frame, fps, at, damping, stiffness);
};

type Enter = 'pop' | 'up' | 'down' | 'left' | 'right' | 'fade' | 'drop' | 'none';
type Exit = 'fade' | 'up' | 'down' | 'left' | 'right' | 'shrink';

/**
 * Ventana de un momento: sus hijos existen solo entre `from` y `to`, entran
 * con resorte y salen antes de que empiece lo siguiente. Así nada de una
 * escena anterior se queda acumulado en pantalla.
 */
export const Beat: React.FC<{
  from: number;
  to?: number;
  enter?: Enter;
  exit?: Exit;
  outFrames?: number;
  /** centro de la transformación, en px del cuadro */
  origin?: [number, number];
  children: React.ReactNode;
}> = ({from, to, enter = 'pop', exit = 'fade', outFrames = 7, origin = [540, 870], children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < from || (to !== undefined && frame >= to)) return null;
  const k = springAt(frame, fps, from, 14, 200);
  const out = to === undefined ? 0 : ramp(frame, to - outFrames, to, Easing.in(Easing.cubic));
  let x = 0;
  let y = 0;
  let s = 1;
  const inv = 1 - k;
  if (enter === 'pop') s *= 0.8 + 0.2 * k;
  if (enter === 'up') y += inv * 140;
  if (enter === 'down') y -= inv * 140;
  if (enter === 'drop') y -= inv * 500;
  if (enter === 'left') x -= inv * 420;
  if (enter === 'right') x += inv * 420;
  if (exit === 'up') y -= out * 160;
  if (exit === 'down') y += out * 160;
  if (exit === 'left') x -= out * 500;
  if (exit === 'right') x += out * 500;
  if (exit === 'shrink') s *= 1 - 0.4 * out;
  const opIn = enter === 'none' ? 1 : enter === 'fade' ? ramp(frame, from, from + 8) : Math.min(1, (frame - from) / 4);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: opIn * (1 - out),
        transform: `translate(${x}px, ${y}px) scale(${s})`,
        transformOrigin: `${origin[0]}px ${origin[1]}px`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Recorte de imagen del manifiesto, centrado en (x, y). `w` manda; la altura
 * sale de la proporción del archivo (`aspect` = ancho / alto).
 */
export const Pic: React.FC<{
  id: string;
  p: boolean;
  x: number;
  y: number;
  w: number;
  aspect: number;
  rot?: number;
  flip?: boolean;
  scale?: number;
  opacity?: number;
  filter?: string;
  shadow?: boolean;
}> = ({id, p, x, y, w, aspect, rot = 0, flip = false, scale = 1, opacity = 1, filter, shadow = true}) => {
  const h = w / aspect;
  const asset = resolveAsset(id, p);
  if (!asset && !p && !getAssetSlot(id).brand) return null;
  const base: React.CSSProperties = {
    position: 'absolute',
    left: x - w / 2,
    top: y - h / 2,
    width: w,
    height: h,
    opacity,
    transform: `rotate(${rot}deg) scale(${(flip ? -1 : 1) * scale}, ${scale})`,
  };
  if (!asset)
    return (
      <div style={{...base, background: COLORS.placeholderBg, border: `3px dashed ${COLORS.placeholderBorder}`, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', ...font, fontSize: 22, color: COLORS.inkSoft}}>
        {getAssetSlot(id).description}
      </div>
    );
  return (
    <Img
      src={asset.src}
      style={{
        ...base,
        objectFit: 'contain',
        filter: [shadow ? 'drop-shadow(0 12px 16px rgba(0,0,0,0.22))' : '', filter ?? ''].join(' ').trim() || undefined,
      }}
    />
  );
};

/** Ficha de papel con sombra (fondo de gráficos). */
export const Card: React.FC<{x: number; y: number; w: number; h: number; rot?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  x, y, w, h, rot = 0, children, style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      background: COLORS.card,
      border: `5px solid ${COLORS.ink}`,
      borderRadius: 18,
      boxShadow: '0 14px 30px rgba(0,0,0,0.18)',
      transform: `rotate(${rot}deg)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Capa SVG del tamaño del cuadro para trazos y diagramas. */
export const Layer: React.FC<{children: React.ReactNode; opacity?: number; style?: React.CSSProperties}> = ({children, opacity = 1, style}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity, ...style}}>
    {children}
  </svg>
);

/** Punto y ángulo sobre una Bézier cúbica. */
export type Pt = [number, number];
export const bezier = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number) => {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return {x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI};
};
export const bezierD = (p0: Pt, p1: Pt, p2: Pt, p3: Pt) => `M ${p0} C ${p1} ${p2} ${p3}`;
