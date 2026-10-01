import React, {useMemo} from 'react';
import {getLength, getPointAtLength} from '@remotion/paths';
import {useCurrentFrame} from 'remotion';
import {C} from './palette';

// Partículas brillantes que recorren un trazado SVG (coordenadas del lienzo 1080x1920).
type Props = {
  readonly d: string;
  readonly start: number; // frame en que sale la primera
  readonly stop?: number; // frame en que deja de emitir
  readonly count?: number;
  readonly speed?: number; // px por frame
  readonly gap?: number; // frames entre partículas
  readonly size?: number;
  readonly color?: string;
};

export const PathParticles: React.FC<Props> = ({
  d,
  start,
  stop = Infinity,
  count = 12,
  speed = 22,
  gap = 5,
  size = 14,
  color = C.amberLight,
}) => {
  const frame = useCurrentFrame();
  const len = useMemo(() => getLength(d), [d]);
  return (
    <g>
      {Array.from({length: count}, (_, i) => {
        const born = start + i * gap;
        if (born > stop || frame < born) return null;
        const dist = (frame - born) * speed;
        if (dist > len) return null;
        const p = getPointAtLength(d, dist);
        if (!p) return null;
        const fade = Math.min(1, (len - dist) / 80);
        const r = size * (0.75 + 0.25 * Math.sin(frame * 0.5 + i));
        return (
          <g key={i} opacity={fade}>
            <circle cx={p.x} cy={p.y} r={r * 2.4} fill={C.glow} opacity={0.25} />
            <circle cx={p.x} cy={p.y} r={r} fill={color} />
            <circle cx={p.x - r * 0.3} cy={p.y - r * 0.3} r={r * 0.35} fill="#fff" opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};
