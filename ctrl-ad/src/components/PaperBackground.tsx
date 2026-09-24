import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {COLORS} from '../styles/tokens';

/**
 * Papel cuadriculado claro (celda de 36px, como la referencia). La textura se
 * genera con scripts/make_paper_texture.py; para cambiarla, reemplaza
 * public/images/paper-grid.jpg por otra imagen de 1080x1920.
 */
export const PaperBackground: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLORS.paper}}>
    <Img src={staticFile('images/paper-grid.jpg')} style={{width: '100%', height: '100%'}} />
  </AbsoluteFill>
);
