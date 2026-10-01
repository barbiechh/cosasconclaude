import {Easing, interpolate, random, spring} from 'remotion';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const lerp = (k: number, a: number, b: number) => a + (b - a) * k;

// Desaceleración suave (sin rebote).
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {...cl, easing: Easing.bezier(0.16, 1, 0.3, 1)});

// Movimiento rápido de entrada y salida.
export const quick = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {...cl, easing: Easing.bezier(0.7, 0, 0.3, 1)});

// Colocación de un recorte: anticipación (retrocede un poco) y luego un pequeño rebote.
// Devuelve ~ -0.06 durante la anticipación, 0 -> 1 con sobreimpulso al colocarse.
export const place = (f: number, start: number, fps: number, damping = 13) => {
  if (f < start - 5) return 0;
  if (f < start) return interpolate(f, [start - 5, start], [0, -0.06], {...cl, easing: Easing.out(Easing.quad)});
  return -0.06 + 1.06 * spring({frame: f - start, fps, config: {damping, stiffness: 170, mass: 0.9}});
};

// Pegar una etiqueta: entra grande y girada, golpea y se asienta.
export const stick = (f: number, start: number, fps: number) =>
  spring({frame: f - start, fps, config: {damping: 11, stiffness: 260, mass: 0.6}});

// Ruido determinista (mismo resultado en vista previa y render).
export const jitter = (seed: string, amp: number) => (random(seed) - 0.5) * 2 * amp;
