import React from 'react';
import {random} from 'remotion';
import {E, MONO} from '../theme';
import {useSafeId} from '../kit';

// El "tanque de dopamina": metáfora central del video.
// level 0..1 nivel; shove 0..1 empuja las moléculas hacia delante (izquierda);
// drip = gotas cayendo por el grifo; flood 0..1 agita la superficie.
type Props = {
  readonly width: number;
  readonly level: number;
  readonly t: number;
  readonly shove?: number;
  readonly drip?: boolean;
  readonly flood?: number;
  readonly baseline?: number | null; // línea punteada de referencia
  readonly liquid?: string;
  readonly label?: string;
  readonly dark?: boolean;
  readonly style?: React.CSSProperties;
};

const W = 360;
const H = 640;
const TOP = 70;
const BOTTOM = 560;
const L = 40;
const R = 320;

export const Tank: React.FC<Props> = ({
  width,
  level,
  t,
  shove = 0,
  drip = false,
  flood = 0,
  baseline = null,
  liquid = E.blue,
  label = 'DOPAMINE',
  dark = false,
  style,
}) => {
  const clip = useSafeId('tank-clip');
  const lv = Math.max(0, Math.min(1.02, level));
  const y0 = BOTTOM - lv * (BOTTOM - TOP);
  const amp = 4 + flood * 16;
  let surf = `M${L} ${y0}`;
  for (let x = L; x <= R; x += 14) surf += ` L${x} ${y0 + Math.sin(x / 26 + t * (0.15 + flood * 0.35)) * amp * Math.min(1, lv * 5)}`;
  const ink = dark ? E.cream : E.ink;
  const n = Math.round(4 + lv * 26);
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <clipPath id={clip}>
          <rect x={L} y={TOP} width={R - L} height={BOTTOM - TOP} rx={26} />
        </clipPath>
      </defs>
      <rect x={L} y={TOP} width={R - L} height={BOTTOM - TOP} rx={26} fill={dark ? 'rgba(255,255,255,0.06)' : 'rgba(29,43,58,0.05)'} />
      <g clipPath={`url(#${clip})`}>
        {lv > 0.005 ? <path d={`${surf} L${R} ${H} L${L} ${H} Z`} fill={liquid} opacity={0.88} /> : null}
        {lv > 0.005
          ? Array.from({length: n}, (_, i) => {
              const rx = random(`m${i}`);
              const ry = random(`n${i}`);
              const homeX = L + 30 + rx * (R - L - 60);
              const frontX = L + 26 + random(`f${i}`) * 70;
              const x = homeX + (frontX - homeX) * shove + Math.sin(t * 0.08 + i) * 4;
              const y = Math.max(y0 + 22, BOTTOM - 20 - ry * (BOTTOM - y0 - 40)) + Math.cos(t * 0.07 + i * 2) * 4;
              return <circle key={i} cx={x} cy={y} r={7} fill={E.cream} opacity={0.85} />;
            })
          : null}
      </g>
      {baseline !== null ? (
        <g>
          <path
            d={`M${L - 24} ${BOTTOM - baseline * (BOTTOM - TOP)} L${R + 24} ${BOTTOM - baseline * (BOTTOM - TOP)}`}
            stroke={ink}
            strokeWidth={3}
            strokeDasharray="10 10"
            opacity={0.6}
          />
        </g>
      ) : null}
      {[0.25, 0.5, 0.75].map((k) => (
        <path key={k} d={`M${R - 34} ${BOTTOM - k * (BOTTOM - TOP)} L${R - 4} ${BOTTOM - k * (BOTTOM - TOP)}`} stroke={ink} strokeWidth={3} opacity={0.5} />
      ))}
      <rect x={L} y={TOP} width={R - L} height={BOTTOM - TOP} rx={26} fill="none" stroke={ink} strokeWidth={5} />
      <path d={`M${L + 22} ${TOP + 30} L${L + 22} ${BOTTOM - 40}`} stroke={dark ? E.cream : '#fff'} strokeWidth={10} strokeLinecap="round" opacity={0.35} />
      {/* grifo */}
      <path d={`M${(L + R) / 2 - 18} ${BOTTOM} L${(L + R) / 2 - 18} ${BOTTOM + 34} L${(L + R) / 2 + 18} ${BOTTOM + 34} L${(L + R) / 2 + 18} ${BOTTOM}`} fill="none" stroke={ink} strokeWidth={5} />
      {drip && lv > 0.01
        ? [0, 1, 2].map((i) => {
            const p = ((t + i * 9) % 27) / 27;
            return <ellipse key={i} cx={(L + R) / 2} cy={BOTTOM + 44 + p * 70} rx={7} ry={10} fill={liquid} opacity={1 - p} />;
          })
        : null}
      <text x={W / 2} y={TOP - 22} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={4} fill={ink} opacity={0.75}>
        {label}
      </text>
    </svg>
  );
};
