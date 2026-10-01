import React from 'react';
import {C} from '../components/palette';

// Signo de interrogación dibujado como trazo (no tipográfico).
export const QuestionMark: React.FC<{
  readonly size: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({size, color = C.amberLight, style}) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{overflow: 'visible', ...style}}>
    <path d="M24 42 Q24 12 52 12 Q80 12 80 40 Q80 60 54 70 L54 90" fill="none" stroke={C.ink} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 42 Q24 12 52 12 Q80 12 80 40 Q80 60 54 70 L54 90" fill="none" stroke={color} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={54} cy={122} r={15} fill={color} stroke={C.ink} strokeWidth={6} />
  </svg>
);

// Chispa de cuatro puntas.
export const Sparkle: React.FC<{
  readonly size: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({size, color = C.amberLight, style}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible', ...style}}>
    <path d="M0 -48 Q6 -6 48 0 Q6 6 0 48 Q-6 6 -48 0 Q-6 -6 0 -48 Z" fill={color} />
  </svg>
);

// Tarjeta de resultado del estudio, con una incógnita.
export const AnswerCard: React.FC<{
  readonly width: number;
  readonly style?: React.CSSProperties;
}> = ({width, style}) => (
  <svg width={width} height={width * 1.25} viewBox="0 0 320 400" style={{overflow: 'visible', ...style}}>
    <rect x={10} y={10} width={300} height={380} rx={34} fill={C.cream} stroke={C.ink} strokeWidth={9} />
    <rect x={34} y={34} width={252} height={332} rx={22} fill="none" stroke={C.amber} strokeWidth={6} strokeDasharray="18 14" />
    <g transform="translate(95 80) scale(1.3)">
      <path d="M24 42 Q24 12 52 12 Q80 12 80 40 Q80 60 54 70 L54 90" fill="none" stroke={C.amberDeep} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={54} cy={122} r={13} fill={C.amberDeep} />
    </g>
  </svg>
);

// Bombilla de "idea": `on` 0..1 la ilumina.
export const Lightbulb: React.FC<{
  readonly width: number;
  readonly on: number;
  readonly style?: React.CSSProperties;
}> = ({width, on, style}) => (
  <svg width={width} height={width * 1.3} viewBox="0 0 260 340" style={{overflow: 'visible', ...style}}>
    {Array.from({length: 10}, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      const r0 = 140;
      const r1 = 140 + 50 * on;
      return (
        <path
          key={i}
          d={`M${130 + Math.cos(a) * r0} ${130 + Math.sin(a) * r0} L${130 + Math.cos(a) * r1} ${130 + Math.sin(a) * r1}`}
          stroke={C.amberLight}
          strokeWidth={14}
          strokeLinecap="round"
          opacity={on}
        />
      );
    })}
    <path d="M130 14 C60 14 22 66 22 120 C22 166 54 190 76 222 L184 222 C206 190 238 166 238 120 C238 66 200 14 130 14 Z" fill={on > 0.05 ? '#ffe39a' : '#5a4636'} fillOpacity={0.35 + on * 0.65} stroke={C.ink} strokeWidth={9} />
    <path d="M100 222 L104 160 Q130 130 156 160 L160 222" fill="none" stroke={on > 0.5 ? '#fff6d6' : '#a07a58'} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M70 70 Q50 100 58 130" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.5} />
    <rect x={78} y={222} width={104} height={30} rx={8} fill="#b9aa98" stroke={C.ink} strokeWidth={7} />
    <rect x={84} y={250} width={92} height={26} rx={8} fill="#9d8f7e" stroke={C.ink} strokeWidth={7} />
    <path d="M100 276 L160 276 L146 300 L114 300 Z" fill="#6d5f50" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

// Flecha gruesa (apunta hacia arriba en reposo).
export const BigArrow: React.FC<{
  readonly width: number;
  readonly style?: React.CSSProperties;
}> = ({width, style}) => (
  <svg width={width} height={width * 1.1} viewBox="0 0 400 440" style={{overflow: 'visible', ...style}}>
    <path d="M200 20 L376 210 L262 210 L262 420 L138 420 L138 210 L24 210 Z" fill={C.amber} stroke={C.ink} strokeWidth={12} strokeLinejoin="round" />
    <path d="M200 60 L320 190 L240 190 L240 400 L200 400 Z" fill={C.amberDeep} opacity={0.35} />
    <path d="M196 54 L80 180" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.35} />
  </svg>
);

// Marca de verificación; `draw` 0..1 traza el recorrido.
export const CheckMark: React.FC<{
  readonly width: number;
  readonly draw: number;
  readonly style?: React.CSSProperties;
}> = ({width, draw, style}) => {
  const len = 520;
  return (
    <svg width={width} height={width * 1.1} viewBox="0 0 400 440" style={{overflow: 'visible', ...style}}>
      <circle cx={200} cy={220} r={190} fill="#3a2a10" stroke={C.amber} strokeWidth={12} opacity={Math.min(1, draw * 2)} />
      <path d="M100 230 L172 304 L310 150" fill="none" stroke={C.ink} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
      <path d="M100 230 L172 304 L310 150" fill="none" stroke={C.amberLight} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
    </svg>
  );
};
