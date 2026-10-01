import React from 'react';
import {svgRotate, svgScaleAt} from '../../components/anim';
import {Halftone, useSafeId, V} from '../style';

// Cerebro recortado: silueta festoneada plana, pliegues de tinta, semitono
// en la parte inferior y cara de tinta simple para que pueda reaccionar.

export type PaperBrainMouth = 'smile' | 'grin' | 'o' | 'wow' | 'flat' | 'wavy';

type Props = {
  readonly width: number;
  readonly lookX?: number;
  readonly lookY?: number;
  readonly blink?: number;
  readonly browY?: number;
  readonly browTilt?: number;
  readonly mouth?: PaperBrainMouth;
  readonly style?: React.CSSProperties;
};

const W = 520;
const H = 400;

const scallop = (cx: number, cy: number, rx: number, ry: number, n: number) => {
  const pts = Array.from({length: n}, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const k = i % 2 === 0 ? 1 : 0.96;
    return [cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)] as const;
  });
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const [x0, y0] = pts[i - 1];
    const [x, y] = pts[i % n];
    const r = Math.hypot(x - x0, y - y0) * 0.6;
    d += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + ' Z';
};

const OUTLINE = scallop(260, 200, 226, 170, 16);
const FOLDS = [
  'M262 40 C246 90 276 130 256 186',
  'M104 116 C138 92 172 130 210 104',
  'M70 196 C100 174 128 214 158 190',
  'M314 100 C350 82 384 120 424 108',
  'M352 168 C386 152 412 194 450 180',
  'M120 160 C144 150 156 176 180 168',
  'M300 146 C320 136 338 156 358 146',
];

export const PaperBrain: React.FC<Props> = ({
  width,
  lookX = 0,
  lookY = 0,
  blink = 0,
  browY = 0,
  browTilt = 0,
  mouth = 'smile',
  style,
}) => {
  const ht = useSafeId('brain-ht');
  const clip = useSafeId('brain-clip');
  const open = Math.max(0.08, 1 - blink);
  const eye = (cx: number, cy: number) => (
    <g key={cx} transform={svgScaleAt(1, open, cx, cy)}>
      <ellipse cx={cx + lookX * 12} cy={cy + lookY * 10} rx={16} ry={21} fill={V.ink} />
      <circle cx={cx + lookX * 12 - 6} cy={cy + lookY * 10 - 8} r={5} fill={V.white} />
    </g>
  );
  const mouthEl = () => {
    switch (mouth) {
      case 'smile':
        return <path d="M234 300 Q260 322 286 300" fill="none" stroke={V.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'flat':
        return <path d="M240 308 L280 306" fill="none" stroke={V.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'wavy':
        return <path d="M232 308 Q246 296 260 308 Q274 320 288 306" fill="none" stroke={V.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'grin':
        return <path d="M224 294 Q260 298 296 294 Q290 342 260 342 Q230 342 224 294 Z" fill={V.ink} />;
      case 'wow':
        return <ellipse cx={260} cy={314} rx={20} ry={26} fill={V.ink} />;
      default:
        return <ellipse cx={260} cy={312} rx={12} ry={15} fill={V.ink} />;
    }
  };
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color={V.pinkDeep} size={13} />
        <clipPath id={clip}>
          <path d={OUTLINE} />
        </clipPath>
      </defs>
      <g id="brain">
        <path d={OUTLINE} fill={V.pink} />
        <g clipPath={`url(#${clip})`}>
          <ellipse cx={300} cy={380} rx={300} ry={160} fill={`url(#${ht})`} />
        </g>
        {FOLDS.map((d) => (
          <path key={d} d={d} fill="none" stroke={V.pinkDeep} strokeWidth={8} strokeLinecap="round" />
        ))}
      </g>
      <g id="eyes">
        {eye(206, 238)}
        {eye(314, 238)}
      </g>
      <g id="brows" transform={`translate(0 ${browY})`}>
        <path d="M182 192 L230 188" transform={svgRotate(-browTilt, 206, 190)} stroke={V.ink} strokeWidth={10} strokeLinecap="round" />
        <path d="M290 188 L338 192" transform={svgRotate(browTilt, 314, 190)} stroke={V.ink} strokeWidth={10} strokeLinecap="round" />
      </g>
      <g id="mouth">{mouthEl()}</g>
    </svg>
  );
};
