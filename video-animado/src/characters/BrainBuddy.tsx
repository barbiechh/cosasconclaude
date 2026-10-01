import React, {useId} from 'react';
import {C} from '../components/palette';
import {svgRotate, svgScaleAt} from '../components/anim';

// Cerebro con cara: el "cerebro TDAH" del video.
// Ojos, cejas, boca, brazos y pies van en grupos separados.

export type BrainMouth = 'smile' | 'grin' | 'o' | 'wow' | 'flat' | 'wavy';

type Props = {
  readonly width: number;
  readonly lookX?: number;
  readonly lookY?: number;
  readonly blink?: number;
  readonly browY?: number;
  readonly browTilt?: number;
  readonly mouth?: BrainMouth;
  readonly armL?: number;
  readonly armR?: number;
  readonly sparkle?: number; // brillo extra en los ojos (0..1)
  readonly style?: React.CSSProperties;
};

const W = 520;
const H = 500;

// Silueta festoneada: arcos alrededor de una elipse.
const scallop = (cx: number, cy: number, rx: number, ry: number, n: number) => {
  const pts = Array.from({length: n}, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const wobble = i % 2 === 0 ? 1 : 0.97;
    return [cx + rx * wobble * Math.cos(a), cy + ry * wobble * Math.sin(a)] as const;
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

const OUTLINE = scallop(260, 205, 222, 168, 15);

const FOLDS = [
  'M260 52 C246 100 274 140 254 196',
  'M110 120 C140 96 176 132 212 108',
  'M76 196 C104 176 130 214 160 192',
  'M126 160 C150 150 160 176 184 168',
  'M316 104 C350 86 382 124 420 112',
  'M352 172 C384 156 410 196 446 182',
  'M300 150 C320 140 336 160 356 150',
  'M70 262 C92 252 104 276 124 270',
  'M396 266 C418 252 436 276 458 262',
];

export const BrainBuddy: React.FC<Props> = ({
  width,
  lookX = 0,
  lookY = 0,
  blink = 0,
  browY = 0,
  browTilt = 0,
  mouth = 'smile',
  armL = 0,
  armR = 0,
  sparkle = 0,
  style,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fill = `brain-fill-${id}`;
  const open = Math.max(0.06, 1 - blink);
  const eye = (cx: number, cy: number, r: number) => {
    const ix = cx + lookX * r * 0.35;
    const iy = cy + lookY * r * 0.3;
    return (
      <g transform={svgScaleAt(1, open, cx, cy)}>
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.12} fill="#fffaf2" stroke={C.ink} strokeWidth={6} />
        <circle cx={ix} cy={iy} r={r * 0.68} fill={C.eyeDark} />
        <circle cx={ix} cy={iy} r={r * 0.36} fill="#120a05" />
        <circle cx={ix - r * 0.26} cy={iy - r * 0.3} r={r * (0.24 + sparkle * 0.08)} fill="#fff" />
        <circle cx={ix + r * 0.25} cy={iy + r * 0.25} r={r * 0.1} fill="#fff" />
        {sparkle > 0.01 ? (
          <path
            d={`M${ix + r * 0.2} ${iy - r * 0.62} l${r * 0.08} ${r * 0.18} l${r * 0.18} ${r * 0.08} l-${r * 0.18} ${r * 0.08} l-${r * 0.08} ${r * 0.18} l-${r * 0.08} -${r * 0.18} l-${r * 0.18} -${r * 0.08} l${r * 0.18} -${r * 0.08} Z`}
            fill="#fff"
            opacity={sparkle}
          />
        ) : null}
      </g>
    );
  };

  const mouthEl = () => {
    switch (mouth) {
      case 'smile':
        return <path d="M232 312 Q260 336 288 312" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'flat':
        return <path d="M240 322 L280 320" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'wavy':
        return <path d="M232 322 Q246 310 260 322 Q274 334 288 320" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'grin':
        return (
          <g>
            <path d="M222 306 Q260 310 298 306 Q292 356 260 356 Q228 356 222 306 Z" fill="#4a1e14" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
            <path d="M238 342 Q260 330 282 342 Q272 354 260 354 Q248 354 238 342 Z" fill="#e7746a" />
          </g>
        );
      default: {
        const big = mouth === 'wow';
        return (
          <g>
            <ellipse cx={260} cy={326} rx={big ? 22 : 13} ry={big ? 28 : 16} fill="#4a1e14" stroke={C.ink} strokeWidth={6} />
            <ellipse cx={260} cy={big ? 344 : 336} rx={big ? 12 : 7} ry={big ? 7 : 4} fill="#e7746a" />
          </g>
        );
      }
    }
  };

  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <radialGradient id={fill} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor={C.brainPinkLight} />
          <stop offset="0.55" stopColor={C.brainPink} />
          <stop offset="1" stopColor={C.brainShade} />
        </radialGradient>
      </defs>

      <g id="feet">
        <path d="M210 360 L204 430" stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
        <path d="M310 360 L316 430" stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
        <path d="M210 360 L204 430" stroke={C.brainShade} strokeWidth={18} strokeLinecap="round" />
        <path d="M310 360 L316 430" stroke={C.brainShade} strokeWidth={18} strokeLinecap="round" />
        <ellipse cx={194} cy={440} rx={40} ry={20} fill={C.brainShade} stroke={C.ink} strokeWidth={6} />
        <ellipse cx={326} cy={440} rx={40} ry={20} fill={C.brainShade} stroke={C.ink} strokeWidth={6} />
      </g>

      <g id="arm-left" transform={svgRotate(armL, 58, 250)}>
        <path d="M58 250 Q20 280 14 320" fill="none" stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
        <path d="M58 250 Q20 280 14 320" fill="none" stroke={C.brainShade} strokeWidth={18} strokeLinecap="round" />
        <circle cx={14} cy={326} r={18} fill={C.brainPink} stroke={C.ink} strokeWidth={6} />
      </g>
      <g id="arm-right" transform={svgRotate(armR, 462, 250)}>
        <path d="M462 250 Q500 280 506 320" fill="none" stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
        <path d="M462 250 Q500 280 506 320" fill="none" stroke={C.brainShade} strokeWidth={18} strokeLinecap="round" />
        <circle cx={506} cy={326} r={18} fill={C.brainPink} stroke={C.ink} strokeWidth={6} />
      </g>

      <g id="brain">
        <path d={OUTLINE} fill={`url(#${fill})`} stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
        {FOLDS.map((d) => (
          <path key={d} d={d} fill="none" stroke={C.brainFold} strokeWidth={7} strokeLinecap="round" opacity={0.75} />
        ))}
        <ellipse cx={170} cy={86} rx={40} ry={18} fill="#fff" opacity={0.35} transform={svgRotate(-18, 170, 86)} />
        <ellipse cx={160} cy={300} rx={26} ry={14} fill="#ee7f7a" opacity={0.45} />
        <ellipse cx={360} cy={300} rx={26} ry={14} fill="#ee7f7a" opacity={0.45} />
      </g>

      <g id="eyes">
        {eye(204, 248, 40)}
        {eye(316, 248, 40)}
      </g>

      <g id="brows" transform={`translate(0 ${browY})`}>
        <path d="M176 186 Q204 176 230 186" transform={svgRotate(-browTilt, 204, 182)} fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
        <path d="M290 186 Q316 176 344 186" transform={svgRotate(browTilt, 316, 182)} fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      </g>

      <g id="mouth">{mouthEl()}</g>
    </svg>
  );
};
