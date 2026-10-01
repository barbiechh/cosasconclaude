import {staticFile} from 'remotion';

// Sistema visual del collage editorial. Todo color, sombra y textura sale de aquí.
export const K = {
  paper: '#eee5d0',
  ink: '#111111',
  white: '#fbf8f0',
  yellow: '#ffd21a',
  green: '#22c35e',
  red: '#e8352b',
  blue: '#2457e6',
  pink: '#f2a0a8',
  kraft: '#c7a06a',
  gray: '#8b867c',
} as const;

// Una sola familia tipográfica: Anton (gruesa y compacta), cargada desde archivo.
export const FONT = 'Anton';
export const FONT_URL = staticFile('assets/fonts/anton-latin-400-normal.woff2');

export const TEX = {
  cream: staticFile('assets/textures/paper-cream.jpg'),
  grain: staticFile('assets/textures/paper-grain.jpg'),
};

// Sombra corta y suave común a todas las piezas.
export const SHADOW = 'drop-shadow(3px 7px 5px rgba(20,14,6,0.32))';
export const SHADOW_FLAT = 'drop-shadow(2px 4px 3px rgba(20,14,6,0.28))';

export const FPS = 30;
export const W = 1080;
export const H = 1920;
