import React, {useId} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {clamp} from '../components/anim';
import {interpolate} from 'remotion';

// ---------- Paleta "Vox": papel crema, tinta negra, amarillo marcador, rojo rotulador ----------
export const V = {
  paper: '#efe7d6',
  paperDark: '#ddd2bb',
  kraft: '#c9a678',
  ink: '#151412',
  yellow: '#ffd21f',
  red: '#e2412f',
  navy: '#22374a',
  teal: '#3e8a8f',
  skin: '#e8b08a',
  skinShade: '#c9876a',
  pink: '#f0a39b',
  pinkDeep: '#cf6b70',
  amber: '#e9962e',
  amberDeep: '#a85a14',
  white: '#fffdf6',
  gray: '#9b968c',
} as const;

export const FONT_HEAD = 'Oswald';
export const FONT_TYPE = 'Special Elite';

// Animación "a dos": el frame avanza de 2 en 2 (12 fps aparentes), como stop-motion.
export const useStepFrame = (step = 2) => {
  const f = useCurrentFrame();
  return f - (f % step);
};

// Temblor de papel: cambia cada `every` frames.
export const boil = (frame: number, seed: string, amp: number, every = 4) =>
  (random(`${seed}-${Math.floor(frame / every)}`) - 0.5) * 2 * amp;

// Borde irregular de papel rasgado.
export const tornRect = (w: number, h: number, seed: string, rough = 10, step = 34) => {
  const pts: string[] = [];
  const j = (k: string) => (random(`${seed}-${k}`) - 0.5) * 2 * rough;
  for (let x = 0; x <= w; x += step) pts.push(`${x} ${j(`t${x}`)}`);
  for (let y = 0; y <= h; y += step) pts.push(`${w + j(`r${y}`)} ${y}`);
  for (let x = w; x >= 0; x -= step) pts.push(`${x} ${h + j(`b${x}`)}`);
  for (let y = h; y >= 0; y -= step) pts.push(`${j(`l${y}`)} ${y}`);
  return `M${pts.join(' L')} Z`;
};

// Definiciones globales: filtro de pegatina (borde blanco + sombra dura) y grano.
export const VoxDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="vox-sticker" x="-15%" y="-15%" width="130%" height="130%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="9" result="d" />
        <feFlood floodColor={V.white} />
        <feComposite in2="d" operator="in" result="border" />
        <feOffset in="d" dx="9" dy="12" result="so" />
        <feFlood floodColor="#000" floodOpacity="0.3" />
        <feComposite in2="so" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="border" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="vox-shadow" x="-15%" y="-15%" width="130%" height="130%">
        <feOffset in="SourceAlpha" dx="8" dy="10" result="so" />
        <feFlood floodColor="#000" floodOpacity="0.28" />
        <feComposite in2="so" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// Fondo de papel a sangre con grano, cuadrícula tenue y viñeta.
export const PaperBackground: React.FC<{readonly color?: string; readonly grid?: boolean}> = ({
  color = V.paper,
  grid = true,
}) => {
  const frame = useStepFrame(4);
  return (
    <AbsoluteFill style={{backgroundColor: color}}>
      <VoxDefs />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="vox-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 7} />
            <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0.55 -0.12" />
          </filter>
          <filter id="vox-blotch">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={3} />
            <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.16 -0.04" />
          </filter>
          <radialGradient id="vox-vignette" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.65" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#3a2a12" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {grid
          ? Array.from({length: 33}, (_, i) => (
              <path key={`h${i}`} d={`M0 ${i * 60} H1080`} stroke="#6b8aa0" strokeOpacity={0.12} strokeWidth={2} />
            ))
          : null}
        {grid
          ? Array.from({length: 19}, (_, i) => (
              <path key={`v${i}`} d={`M${i * 60} 0 V1920`} stroke="#6b8aa0" strokeOpacity={0.12} strokeWidth={2} />
            ))
          : null}
        <rect width={1080} height={1920} filter="url(#vox-blotch)" />
        <rect width={1080} height={1920} filter="url(#vox-grain)" />
        <rect width={1080} height={1920} fill="url(#vox-vignette)" />
      </svg>
    </AbsoluteFill>
  );
};

// Trama de semitono para sombrear dentro de un SVG.
export const Halftone: React.FC<{readonly id: string; readonly color: string; readonly size?: number}> = ({
  id,
  color,
  size = 11,
}) => (
  <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <circle cx={size / 2} cy={size / 2} r={size * 0.3} fill={color} />
  </pattern>
);

export const useSafeId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

// Elemento recortado: aplica el borde de pegatina + temblor de papel.
export const Cutout: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly seed: string;
  readonly frame: number;
  readonly jitter?: number;
  readonly sticker?: boolean;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({x, y, seed, frame, jitter = 1, sticker = true, style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x + boil(frame, `${seed}x`, 2.5 * jitter),
      top: y + boil(frame, `${seed}y`, 2.5 * jitter),
      translate: '-50% -50%',
      display: 'flex',
      filter: sticker ? 'url(#vox-sticker)' : 'url(#vox-shadow)',
      rotate: `${boil(frame, `${seed}r`, 0.8 * jitter)}deg`,
      ...style,
    }}
  >
    {children}
  </div>
);

// Tira de cinta adhesiva semitransparente.
export const Tape: React.FC<{readonly x: number; readonly y: number; readonly rot: number; readonly w?: number}> = ({
  x,
  y,
  rot,
  w = 170,
}) => (
  <svg
    width={w}
    height={56}
    viewBox={`0 0 ${w} 56`}
    style={{position: 'absolute', left: x - w / 2, top: y - 28, rotate: `${rot}deg`, overflow: 'visible'}}
  >
    <path
      d={`M6 4 L${w - 4} 0 L${w - 10} 12 L${w} 24 L${w - 8} 38 L${w - 2} 54 L4 56 L12 42 L0 28 L10 16 Z`}
      fill="#f4ecc8"
      fillOpacity={0.72}
    />
  </svg>
);

// Trazo de rotulador rojo que se dibuja (`draw` 0..1). Coordenadas del lienzo.
export const Marker: React.FC<{
  readonly d: string;
  readonly draw: number;
  readonly color?: string;
  readonly width?: number;
}> = ({d, draw, color = V.red, width = 14}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, draw))}
      opacity={draw > 0 ? 0.92 : 0}
    />
  </svg>
);

// Círculo de rotulador imperfecto (casi dos vueltas) alrededor de (cx, cy).
export const markerLoop = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx * 0.9} ${cy - ry * 0.55}
   C${cx - rx * 0.4} ${cy - ry * 1.15} ${cx + rx * 1.05} ${cy - ry * 1.05} ${cx + rx * 1.02} ${cy}
   C${cx + rx} ${cy + ry * 1.1} ${cx - rx * 0.95} ${cy + ry * 1.12} ${cx - rx * 1.04} ${cy + ry * 0.05}
   C${cx - rx * 1.08} ${cy - ry * 0.7} ${cx - rx * 0.2} ${cy - ry * 1.12} ${cx + rx * 0.45} ${cy - ry * 1.02}`;

// Etiqueta de máquina de escribir sobre tira de papel; el texto se teclea con `typed` 0..1.
export const TypeTag: React.FC<{
  readonly text: string;
  readonly typed: number;
  readonly x: number;
  readonly y: number;
  readonly rot?: number;
  readonly frame: number;
  readonly size?: number;
  readonly bg?: string;
}> = ({text, typed, x, y, rot = -3, frame, size = 54, bg = V.white}) => {
  const n = Math.round(text.length * Math.max(0, Math.min(1, typed)));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + boil(frame, `tag${text}`, 1.5),
        translate: '-50% -50%',
        rotate: `${rot}deg`,
        background: bg,
        padding: '12px 26px 8px',
        fontFamily: FONT_TYPE,
        fontSize: size,
        color: V.ink,
        letterSpacing: 3,
        whiteSpace: 'pre',
        filter: 'url(#vox-shadow)',
        opacity: typed > 0 ? 1 : 0,
        clipPath: 'polygon(0 6%, 4% 0, 30% 5%, 62% 0, 100% 4%, 98% 52%, 100% 100%, 70% 95%, 35% 100%, 0 96%, 2% 50%)',
      }}
    >
      <span>{text.slice(0, n)}</span>
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </div>
  );
};

// Sello de goma rojo que "golpea" (`k` 0..1 = progreso de la entrada con rebote).
export const Stamp: React.FC<{
  readonly text: string;
  readonly x: number;
  readonly y: number;
  readonly rot: number;
  readonly k: number;
  readonly size?: number;
}> = ({text, x, y, rot, k, size = 120}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      translate: '-50% -50%',
      rotate: `${rot}deg`,
      scale: interpolate(k, [0, 1], [2.4, 1], clamp),
      opacity: interpolate(k, [0, 0.25], [0, 0.9], clamp),
      border: `10px solid ${V.red}`,
      borderRadius: 18,
      padding: '6px 34px 0',
      fontFamily: FONT_HEAD,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.15,
      color: V.red,
      letterSpacing: 6,
      mixBlendMode: 'multiply',
      WebkitMaskImage:
        'radial-gradient(circle at 20% 30%, transparent 0 3px, #000 4px), radial-gradient(circle at 70% 60%, transparent 0 4px, #000 5px)',
      WebkitMaskSize: '37px 29px, 53px 41px',
    }}
  >
    {text}
  </div>
);
