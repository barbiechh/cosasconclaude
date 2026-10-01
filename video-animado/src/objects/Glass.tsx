import React, {useId} from 'react';
import {C} from '../components/palette';
import {svgRotate} from '../components/anim';

// Vaso (o vaso de precipitados) que se llena: `fill` 0..1, `t` = frame para olas y burbujas.
type Props = {
  readonly width: number;
  readonly fill: number;
  readonly t: number;
  readonly shape?: 'tumbler' | 'beaker';
  readonly ice?: boolean;
  readonly foam?: number;
  readonly style?: React.CSSProperties;
};

const W = 300;
const H = 420;
const BOTTOM = 398;
const DEPTH = 360;

const OUTLINES = {
  tumbler: 'M28 20 L272 20 L242 388 Q240 404 222 404 L78 404 Q60 404 58 388 Z',
  beaker: 'M44 22 L256 22 L256 388 Q256 404 240 404 L60 404 Q44 404 44 388 Z',
};

export const Glass: React.FC<Props> = ({width, fill, t, shape = 'tumbler', ice = false, foam = 0, style}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const clip = `glass-clip-${id}`;
  const liq = `glass-liq-${id}`;
  const level = BOTTOM - Math.max(0, Math.min(1, fill)) * DEPTH;
  const wave = (x: number) => level + Math.sin(x / 38 + t * 0.18) * 5 * Math.min(1, fill * 4);
  let surface = `M0 ${wave(0).toFixed(1)}`;
  for (let x = 20; x <= W; x += 20) surface += ` L${x} ${wave(x).toFixed(1)}`;
  const liquidPath = `${surface} L${W} ${H} L0 ${H} Z`;
  const height = BOTTOM - level;

  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <clipPath id={clip}>
          <path d={OUTLINES[shape]} />
        </clipPath>
        <linearGradient id={liq} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={C.amberLight} />
          <stop offset="0.5" stopColor={C.amber} />
          <stop offset="1" stopColor={C.amberDeep} />
        </linearGradient>
      </defs>

      <path d={OUTLINES[shape]} fill={C.glass} />
      <g clipPath={`url(#${clip})`}>
        <path d={liquidPath} fill={`url(#${liq})`} />
        {height > 30
          ? Array.from({length: 9}, (_, i) => {
              const x = 70 + ((i * 53) % 160);
              const span = Math.max(1, height - 20);
              const y = BOTTOM - 10 - ((t * (1.6 + (i % 3) * 0.5) + i * 47) % span);
              return <circle key={i} cx={x + Math.sin(t * 0.1 + i) * 6} cy={y} r={4 + (i % 3) * 2.5} fill="#fff6d8" opacity={0.55} />;
            })
          : null}
        {ice && fill > 0.35 ? (
          <g transform={svgRotate(14 + Math.sin(t * 0.07) * 4, 170, level + 40)}>
            <rect x={130} y={level - 8 + Math.sin(t * 0.09) * 4} width={84} height={78} rx={14} fill="#fff" fillOpacity={0.45} stroke="#fff" strokeOpacity={0.8} strokeWidth={5} />
          </g>
        ) : null}
        {foam > 0.01 ? (
          <path
            d={`M0 ${level + 6} ${Array.from({length: 8}, (_, i) => `A 22 ${16 * foam} 0 0 1 ${(i + 1) * 40} ${level + 6}`).join(' ')} L${W} ${level + 24} L0 ${level + 24} Z`}
            fill="#fff4dc"
            opacity={0.95}
          />
        ) : null}
        <path d={`M0 ${level + 2} L${W} ${level + 2}`} stroke="#fff3c9" strokeWidth={5} opacity={fill > 0.02 ? 0.7 : 0} />
      </g>

      {shape === 'beaker'
        ? [120, 190, 260, 330].map((y) => <path key={y} d={`M44 ${y} L84 ${y}`} stroke={C.glassEdge} strokeWidth={6} strokeLinecap="round" opacity={0.75} />)
        : null}
      <path d="M58 52 L80 360" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.22} />
      <path d={OUTLINES[shape]} fill="none" stroke={C.glassEdge} strokeWidth={9} strokeLinejoin="round" />
      <path d={OUTLINES[shape]} fill="none" stroke={C.ink} strokeWidth={3} strokeLinejoin="round" opacity={0.6} />
      {shape === 'beaker' ? <path d="M30 22 L270 22" stroke={C.glassEdge} strokeWidth={12} strokeLinecap="round" /> : null}
    </svg>
  );
};
