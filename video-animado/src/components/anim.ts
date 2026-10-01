import {Easing, interpolate, spring} from 'remotion';

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

// Entrada con rebote (0 -> 1, con sobreimpulso).
export const pop = (frame: number, start: number, fps: number, damping = 11) =>
  spring({frame: frame - start, fps, config: {damping, stiffness: 160, mass: 0.7}});

// Entrada suave sin rebote.
export const settle = (frame: number, start: number, fps: number) =>
  spring({frame: frame - start, fps, config: {damping: 200}});

export const ramp = (
  frame: number,
  [a, b]: [number, number],
  [x, y]: [number, number] = [0, 1],
  easing: (t: number) => number = Easing.bezier(0.45, 0, 0.2, 1),
) => interpolate(frame, [a, b], [x, y], {...clamp, easing});

// Anticipación: retrocede un poco antes de dispararse hacia 1.
export const anticipate = (frame: number, start: number, fps: number) => {
  const wind = interpolate(frame, [start - 6, start], [0, -0.12], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  return frame < start ? wind : -0.12 + 1.12 * pop(frame, start, fps, 12);
};

export const wobble = (frame: number, speed = 0.12, amp = 1, phase = 0) =>
  Math.sin(frame * speed + phase) * amp;

export const svgRotate = (deg: number, cx: number, cy: number) =>
  `rotate(${deg} ${cx} ${cy})`;

export const svgScaleAt = (sx: number, sy: number, cx: number, cy: number) =>
  `translate(${cx} ${cy}) scale(${sx} ${sy}) translate(${-cx} ${-cy})`;
