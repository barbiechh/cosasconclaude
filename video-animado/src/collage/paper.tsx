import React, {useId} from 'react';
import {AbsoluteFill, Img, random} from 'remotion';
import {K, SHADOW, TEX} from './theme';

export const useSafeId = (p: string) => `${p}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

// Filtros globales del collage: contorno blanco de recorte.
export const CollageDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="k-contour" x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="d" />
        <feFlood floodColor={K.white} />
        <feComposite in2="d" operator="in" result="border" />
        <feMerge>
          <feMergeNode in="border" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="k-contour-thin" x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d" />
        <feFlood floodColor={K.white} />
        <feComposite in2="d" operator="in" result="border" />
        <feMerge>
          <feMergeNode in="border" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// Fondo de papel crema con textura real (imagen generada una vez).
export const PaperBg: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: K.paper}}>
    <CollageDefs />
    <Img src={TEX.cream} style={{width: '100%', height: '100%'}} />
  </AbsoluteFill>
);

// Contorno de papel rasgado (determinista). `rough` = amplitud por lado [arriba, derecha, abajo, izquierda].
export const tornPath = (w: number, h: number, seed: string, rough: [number, number, number, number] = [6, 6, 6, 6], step = 22) => {
  const j = (k: string, a: number) => (random(`${seed}-${k}`) - 0.5) * 2 * a;
  const pts: [number, number][] = [];
  for (let x = 0; x < w; x += step) pts.push([x, j(`t${x}`, rough[0])]);
  for (let y = 0; y < h; y += step) pts.push([w + j(`r${y}`, rough[1]), y]);
  for (let x = w; x > 0; x -= step) pts.push([x, h + j(`b${x}`, rough[2])]);
  for (let y = h; y > 0; y -= step) pts.push([j(`l${y}`, rough[3]), y]);
  return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
};

// Hoja o tira de papel rasgado, con borde blanco fibroso, grano y sombra corta.
export const TornPaper: React.FC<{
  readonly w: number;
  readonly h: number;
  readonly color: string;
  readonly seed: string;
  readonly rough?: [number, number, number, number];
  readonly edge?: boolean; // borde blanco de rasgado
  readonly shadow?: boolean;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({w, h, color, seed, rough = [7, 7, 7, 7], edge = true, shadow = true, style, children}) => {
  const clip = useSafeId('tp');
  const inner = tornPath(w, h, seed, rough);
  const outer = tornPath(w, h, `${seed}-edge`, rough.map((r) => r * 1.6 + 3) as [number, number, number, number]);
  return (
    <div style={{position: 'absolute', width: w, height: h, filter: shadow ? SHADOW : undefined, ...style}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <clipPath id={clip}>
            <path d={inner} />
          </clipPath>
        </defs>
        {edge ? <path d={outer} fill={K.white} /> : null}
        <path d={inner} fill={color} />
        <g clipPath={`url(#${clip})`} style={{mixBlendMode: 'multiply'}}>
          <image href={TEX.grain} x={-random(seed) * 400} y={-random(`${seed}y`) * 800} width={1080} height={1920} preserveAspectRatio="none" />
        </g>
      </svg>
      {children ? <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div> : null}
    </div>
  );
};

// Cinta adhesiva translúcida.
export const Tape: React.FC<{readonly x: number; readonly y: number; readonly rot: number; readonly w?: number; readonly o?: number}> = ({x, y, rot, w = 150, o = 1}) => (
  <svg width={w} height={46} viewBox={`0 0 ${w} 46`} style={{position: 'absolute', left: x - w / 2, top: y - 23, rotate: `${rot}deg`, opacity: o, overflow: 'visible'}}>
    <path d={`M4 3 L${w - 5} 0 L${w - 11} 11 L${w} 22 L${w - 8} 34 L${w - 3} 46 L5 44 L12 33 L0 22 L9 11 Z`} fill="#f5edd0" fillOpacity={0.75} />
  </svg>
);

// Recorte: contorno blanco + sombra corta. Envuelve fotos, siluetas y piezas de papel.
export const Cutout: React.FC<{
  readonly thin?: boolean;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({thin = false, style, children}) => (
  <div style={{display: 'flex', filter: `url(#${thin ? 'k-contour-thin' : 'k-contour'}) ${SHADOW}`, ...style}}>{children}</div>
);

// Coloca un elemento por su centro en el lienzo.
export const At: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({x, y, style, children}) => (
  <div style={{position: 'absolute', left: x, top: y, translate: '-50% -50%', display: 'flex', ...style}}>{children}</div>
);
