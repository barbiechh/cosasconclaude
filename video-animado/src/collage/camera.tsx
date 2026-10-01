import React, {createContext, useContext} from 'react';
import {AbsoluteFill} from 'remotion';

// Cámara de escena con parallax: cada capa se desplaza según su profundidad.
// depth 0 = fondo fijo, 1 = plano de la cámara, >1 = primer plano (se mueve más).
export type Cam = {readonly x: number; readonly y: number; readonly s: number; readonly ox?: number; readonly oy?: number};

const CamCtx = createContext<Cam>({x: 0, y: 0, s: 1});

export const Camera: React.FC<{readonly cam: Cam; readonly children: React.ReactNode}> = ({cam, children}) => (
  <CamCtx.Provider value={cam}>{children}</CamCtx.Provider>
);

export const Layer: React.FC<{readonly depth: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties}> = ({depth, children, style}) => {
  const cam = useContext(CamCtx);
  const s = 1 + (cam.s - 1) * depth;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${cam.ox ?? 540}px ${cam.oy ?? 960}px`,
        scale: s,
        translate: `${-cam.x * depth}px ${-cam.y * depth}px`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
