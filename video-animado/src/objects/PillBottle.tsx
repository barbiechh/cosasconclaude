import React, {useId} from 'react';
import {C} from '../components/palette';
import {svgRotate} from '../components/anim';

// Cápsula de dos colores (también se usa suelta, saltando fuera del frasco).
export const Capsule: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly rot: number;
  readonly size?: number;
}> = ({x, y, rot, size = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size})`}>
    <rect x={-46} y={-20} width={92} height={40} rx={20} fill={C.cream} stroke={C.ink} strokeWidth={6} />
    <path d="M0 -20 L-26 -20 A20 20 0 0 0 -26 20 L0 20 Z" fill={C.teal} />
    <rect x={-46} y={-20} width={92} height={40} rx={20} fill="none" stroke={C.ink} strokeWidth={6} />
    <path d="M0 -20 L0 20" stroke={C.ink} strokeWidth={4} />
    <path d="M-30 -9 L-12 -9" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
  </g>
);

// Frasco de estimulantes. `lid` 0..1 levanta y gira la tapa.
type Props = {
  readonly width: number;
  readonly lid?: number;
  readonly style?: React.CSSProperties;
};

const W = 260;
const H = 420;

export const PillBottle: React.FC<Props> = ({width, lid = 0, style}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const grad = `bottle-${id}`;
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={grad} x1="0" x2="1">
          <stop offset="0" stopColor="#f7a55a" />
          <stop offset="0.6" stopColor={C.orange} />
          <stop offset="1" stopColor="#b85a1e" />
        </linearGradient>
      </defs>
      <g id="bottle">
        <rect x={40} y={96} width={180} height={304} rx={30} fill={`url(#${grad})`} fillOpacity={0.92} stroke={C.ink} strokeWidth={7} />
        <Capsule x={95} y={360} rot={-20} size={0.75} />
        <Capsule x={165} y={350} rot={30} size={0.75} />
        <rect x={40} y={190} width={180} height={124} fill={C.cream} stroke={C.ink} strokeWidth={6} />
        <Capsule x={130} y={252} rot={-30} size={0.9} />
        <path d="M62 120 L62 170" stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.35} />
        <rect x={52} y={92} width={156} height={20} rx={6} fill="#b85a1e" stroke={C.ink} strokeWidth={6} />
      </g>
      <g id="lid" transform={`translate(${lid * 40} ${-lid * 120}) ${svgRotate(lid * 28, 130, 60)}`}>
        <rect x={30} y={20} width={200} height={80} rx={18} fill="#f4efe6" stroke={C.ink} strokeWidth={7} />
        {[60, 90, 120, 150, 180, 205].map((x) => (
          <path key={x} d={`M${x} 34 L${x} 86`} stroke="#cfc5b6" strokeWidth={7} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
};
