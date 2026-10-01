import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './palette';

// Coloca un elemento centrado en (x, y) del lienzo 1080x1920.
export const Place: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({x, y, style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      translate: '-50% -50%',
      display: 'flex',
      ...style,
    }}
  >
    {children}
  </div>
);

// Resplandor cálido difuso (el "glow" ámbar de la referencia).
export const Glow: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly color?: string;
  readonly opacity?: number;
}> = ({x, y, size, color = C.glow, opacity = 0.5}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
      opacity,
    }}
  />
);

// Polvo luminoso que sube por todo el encuadre, de abajo arriba.
export const Motes: React.FC<{readonly count?: number; readonly seed?: string}> = ({count = 36, seed = 'motes'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const x0 = random(`${seed}-x-${i}`) * width;
        const speed = 0.6 + random(`${seed}-s-${i}`) * 1.6;
        const y = (height + 40) - ((random(`${seed}-y-${i}`) * height + frame * speed) % (height + 80));
        const size = 3 + random(`${seed}-r-${i}`) * 7;
        const tw = 0.35 + 0.35 * Math.sin(frame * 0.08 + i * 1.7);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + Math.sin(frame * 0.02 + i) * 20,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: C.amberLight,
              boxShadow: `0 0 ${size * 2}px ${C.glow}`,
              opacity: tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Fondo negro a sangre con viñeta.
export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bg}} />
);
