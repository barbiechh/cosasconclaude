import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {OVERLAP, TransitionKind} from '../data/scenes';
import {WIDTH} from '../data/timing';

const ease = Easing.inOut(Easing.cubic);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Envoltorio de escena: entra y sale con la transición indicada (sincronizada
 * con el barrido del papel), deriva despacio (zoom y paneo leves para que nada
 * quede quieto) y da un golpe de zoom en los frames de `punches`.
 */
export const SceneShell: React.FC<{
  durationInFrames: number;
  enter: TransitionKind | 'none';
  exit: TransitionKind | 'none';
  punches?: number[];
  drift?: number;
  children: React.ReactNode;
}> = ({durationInFrames, enter, exit, punches = [], drift = 0.045, children}) => {
  const frame = useCurrentFrame();
  const exitStart = durationInFrames - OVERLAP;

  const tIn = enter === 'none' ? 1 : ease(interpolate(frame, [0, OVERLAP], [0, 1], clamp));
  const tOut = exit === 'none' ? 0 : ease(interpolate(frame, [exitStart, durationInFrames], [0, 1], clamp));

  let x = 0;
  let scale = 1;
  let opacity = 1;
  if (enter === 'push') x += (1 - tIn) * WIDTH;
  if (enter === 'zoom') {
    scale *= 0.72 + 0.28 * tIn;
    opacity *= tIn;
  }
  if (exit === 'push') x -= tOut * WIDTH;
  if (exit === 'zoom') {
    scale *= 1 + 0.5 * tOut;
    opacity *= 1 - tOut;
  }

  // Deriva continua de cámara.
  const life = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  scale *= 1 + drift * life;
  const driftY = -18 * life;

  // Golpes de zoom en palabras clave.
  for (const p of punches) {
    const k = interpolate(frame, [p, p + 3, p + 16], [0, 1, 0.35], clamp);
    scale *= 1 + 0.07 * k;
  }

  // Desenfoque breve durante el barrido, como un paneo rápido.
  const speedIn = enter === 'push' ? Math.sin(Math.PI * interpolate(frame, [0, OVERLAP], [0, 1], clamp)) : 0;
  const speedOut = exit === 'push' ? Math.sin(Math.PI * interpolate(frame, [exitStart, durationInFrames], [0, 1], clamp)) : 0;
  const blur = 5 * Math.max(speedIn, speedOut);

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${x}px, ${driftY}px) scale(${scale})`,
        opacity,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
