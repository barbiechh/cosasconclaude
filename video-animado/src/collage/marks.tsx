import React from 'react';
import {random} from 'remotion';
import {K} from './theme';

type P = [number, number];

// Curva suave que pasa por los puntos (Catmull-Rom -> Bézier).
export const smooth = (pts: P[], closed = false) => {
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2];
    d += ` C${(x1 + (x2 - x0) / 6).toFixed(1)} ${(y1 + (y2 - y0) / 6).toFixed(1)} ${(x2 - (x3 - x1) / 6).toFixed(1)} ${(y2 - (y3 - y1) / 6).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return closed ? d + ' Z' : d;
};

// Círculo a mano alzada: algo más de una vuelta, radio irregular.
export const handCircle = (cx: number, cy: number, rx: number, ry: number, seed: string) => {
  const n = 14;
  const pts: P[] = Array.from({length: n + 3}, (_, i) => {
    const a = -2.2 + (i / n) * Math.PI * 2;
    const r = 1 + (random(`${seed}${i}`) - 0.5) * 0.12 + i * 0.006;
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
  });
  return smooth(pts);
};

// Flecha a mano: cuerpo curvo por los puntos + punta según la última dirección.
export const handArrow = (pts: P[], head = 46) => {
  const body = smooth(pts);
  const [x1, y1] = pts[pts.length - 2];
  const [x2, y2] = pts[pts.length - 1];
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h1: P = [x2 - Math.cos(a - 0.5) * head, y2 - Math.sin(a - 0.5) * head];
  const h2: P = [x2 - Math.cos(a + 0.45) * head, y2 - Math.sin(a + 0.45) * head];
  return {body, head: `M${h1[0]} ${h1[1]} L${x2} ${y2} L${h2[0]} ${h2[1]}`};
};

// Trazo de rotulador que se dibuja siguiendo su recorrido (draw 0..1).
export const Mark: React.FC<{
  readonly d: string;
  readonly draw: number;
  readonly color?: string;
  readonly width?: number;
}> = ({d, draw, color = K.red, width = 12}) => {
  if (draw <= 0) return null;
  const common = {fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - Math.min(1, draw)} as const;
  return (
    <g>
      <path d={d} stroke={color} strokeWidth={width} {...common} />
      <path d={d} stroke={color} strokeWidth={width * 0.35} opacity={0.5} transform="translate(2.5 -2)" {...common} />
    </g>
  );
};

// Flecha dibujada: el cuerpo primero, la punta al final.
export const MarkArrow: React.FC<{readonly pts: P[]; readonly draw: number; readonly color?: string; readonly width?: number}> = ({
  pts,
  draw,
  color = K.red,
  width = 12,
}) => {
  const {body, head} = handArrow(pts, width * 4);
  return (
    <g>
      <Mark d={body} draw={Math.min(1, draw / 0.85)} color={color} width={width} />
      <Mark d={head} draw={(draw - 0.85) / 0.15} color={color} width={width} />
    </g>
  );
};

// Lienzo SVG a pantalla completa para las marcas.
export const MarkLayer: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
    {children}
  </svg>
);
