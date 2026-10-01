import React, {useId} from 'react';
import {C} from '../components/palette';

// Matraz de laboratorio que burbujea. `boil` 0..1 controla la intensidad.
type Props = {
  readonly width: number;
  readonly fill: number;
  readonly boil: number;
  readonly t: number;
  readonly style?: React.CSSProperties;
};

const W = 420;
const H = 560;
const SHAPE = 'M178 40 L178 222 A170 170 0 1 0 242 222 L242 40 Z';

export const Flask: React.FC<Props> = ({width, fill, boil, t, style}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clip = `flask-clip-${id}`;
  const liq = `flask-liq-${id}`;
  const level = 548 - fill * 330;
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <clipPath id={clip}>
          <path d={SHAPE} />
        </clipPath>
        <radialGradient id={liq} cx="0.5" cy="0.9" r="0.8">
          <stop offset="0" stopColor={C.amberLight} />
          <stop offset="1" stopColor={C.amberDeep} />
        </radialGradient>
      </defs>
      <path d={SHAPE} fill={C.glass} />
      <g clipPath={`url(#${clip})`}>
        <path
          d={`M0 ${level + Math.sin(t * 0.2) * 6 * boil} Q105 ${level - 14 * boil} 210 ${level} T420 ${level} L420 600 L0 600 Z`}
          fill={`url(#${liq})`}
        />
        {Array.from({length: 14}, (_, i) => {
          const x = 90 + ((i * 67) % 240);
          const speed = 2 + (i % 4) * 0.8;
          const y = 540 - ((t * speed * (0.4 + boil) + i * 31) % (540 - level + 10));
          return <circle key={i} cx={x + Math.sin(t * 0.3 + i) * 8} cy={y} r={(5 + (i % 4) * 3) * (0.5 + boil * 0.6)} fill="#fff4cf" opacity={0.25 + boil * 0.45} />;
        })}
      </g>
      <path d="M118 300 Q104 370 140 440" fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" opacity={0.22} />
      <path d={SHAPE} fill="none" stroke={C.glassEdge} strokeWidth={10} strokeLinejoin="round" />
      <path d="M160 40 L260 40" stroke={C.glassEdge} strokeWidth={16} strokeLinecap="round" />
      <path d={SHAPE} fill="none" stroke={C.ink} strokeWidth={3} opacity={0.6} />
    </svg>
  );
};

// Mechero con llama que parpadea; `power` 0..1.
export const Burner: React.FC<{
  readonly width: number;
  readonly power: number;
  readonly t: number;
  readonly style?: React.CSSProperties;
}> = ({width, power, t, style}) => {
  const flick = 1 + Math.sin(t * 0.9) * 0.06 + Math.sin(t * 1.7) * 0.04;
  const h = (60 + power * 110) * flick;
  return (
    <svg width={width} height={width * 0.75} viewBox="0 0 240 180" style={{overflow: 'visible', ...style}}>
      <path d={`M120 ${110 - h} Q170 ${100 - h * 0.35} 152 108 Q120 128 88 108 Q70 ${100 - h * 0.35} 120 ${110 - h} Z`} fill="#ff9a2e" opacity={0.95} />
      <path d={`M120 ${112 - h * 0.6} Q146 ${104 - h * 0.2} 136 110 Q120 120 104 110 Q94 ${104 - h * 0.2} 120 ${112 - h * 0.6} Z`} fill="#ffe08a" />
      <rect x={84} y={108} width={72} height={28} rx={8} fill="#7a5a44" stroke={C.ink} strokeWidth={6} />
      <path d="M50 176 L70 136 L170 136 L190 176 Z" fill="#5b4334" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
};
