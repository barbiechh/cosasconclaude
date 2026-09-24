import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../styles/tokens';
import {HEIGHT, WIDTH} from '../data/timing';
import {OVERLAP, PUSH_FRAMES} from '../data/scenes';

const ease = Easing.inOut(Easing.cubic);
const SRC = staticFile('images/paper-grid.jpg');

/**
 * Papel cuadriculado único para todo el video (celda de 36 px, repetible en
 * horizontal). En cada barrido entre escenas se desplaza un ancho completo,
 * junto con el contenido, como una cámara que recorre un collage largo.
 * Textura: scripts/make_paper_texture.py -> public/images/paper-grid.jpg.
 */
export const PaperBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = PUSH_FRAMES.reduce(
    (acc, t) => acc + ease(interpolate(frame, [t, t + OVERLAP], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})) * WIDTH,
    0
  );
  const x = -(offset % WIDTH);
  const tile = {position: 'absolute' as const, top: 0, width: WIDTH, height: HEIGHT};
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.paper}}>
      <Img src={SRC} style={{...tile, left: x}} />
      <Img src={SRC} style={{...tile, left: x + WIDTH}} />
    </AbsoluteFill>
  );
};
