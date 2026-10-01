import React, {useId} from 'react';
import {C} from '../components/palette';
import {svgRotate, svgScaleAt} from '../components/anim';

// Personaje principal: "frijol" de cabeza grande y ojos brillantes.
// Cada parte (ojos, cejas, boca, brazos, accesorios) es un grupo animable.

export type BeanMouth = 'smile' | 'grin' | 'o' | 'wow' | 'flat' | 'frown';

export type BeanPose = {
  readonly lookX?: number; // -1..1
  readonly lookY?: number; // -1..1
  readonly blink?: number; // 0 abierto, 1 cerrado
  readonly happyEyes?: number; // 0..1, ojos en arco
  readonly browY?: number; // px, negativo = arriba
  readonly browTilt?: number; // grados, + preocupado, - enojado
  readonly mouth?: BeanMouth;
  readonly mouthScale?: number;
  readonly armL?: number; // grados alrededor del hombro
  readonly armR?: number;
  readonly sweat?: number; // 0..1
  readonly blush?: number; // 0..1
  readonly coat?: boolean;
  readonly goggles?: boolean;
  readonly clipboard?: boolean;
};

type Props = BeanPose & {
  readonly width: number;
  readonly style?: React.CSSProperties;
};

const W = 400;
const H = 600;
const OUT = 7;

const Eye: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  lookX: number;
  lookY: number;
  blink: number;
  happy: number;
}> = ({cx, cy, rx, ry, lookX, lookY, blink, happy}) => {
  const ix = cx + lookX * rx * 0.32;
  const iy = cy + lookY * ry * 0.3;
  const ir = rx * 0.7;
  const open = Math.max(0.06, 1 - blink) * (1 - happy);
  return (
    <g>
      <g transform={svgScaleAt(1, open, cx, cy)} opacity={open > 0.07 ? 1 : 0}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fffaf2" stroke={C.ink} strokeWidth={OUT} />
        <circle cx={ix} cy={iy} r={ir} fill={C.eyeDark} />
        <circle cx={ix} cy={iy + ir * 0.25} r={ir * 0.72} fill="#5a3826" opacity={0.6} />
        <circle cx={ix} cy={iy} r={ir * 0.45} fill="#120a05" />
        <circle cx={ix - ir * 0.38} cy={iy - ir * 0.4} r={ir * 0.32} fill="#fff" />
        <circle cx={ix + ir * 0.35} cy={iy + ir * 0.35} r={ir * 0.13} fill="#fff" />
      </g>
      {happy > 0.01 ? (
        <path
          d={`M${cx - rx * 0.8} ${cy + 8} Q${cx} ${cy - ry * 0.9 * happy} ${cx + rx * 0.8} ${cy + 8}`}
          fill="none"
          stroke={C.ink}
          strokeWidth={10}
          strokeLinecap="round"
          opacity={happy}
        />
      ) : null}
      {blink > 0.9 && happy < 0.01 ? (
        <path d={`M${cx - rx * 0.8} ${cy} Q${cx} ${cy + 12} ${cx + rx * 0.8} ${cy}`} fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      ) : null}
    </g>
  );
};

const Mouth: React.FC<{type: BeanMouth; scale: number}> = ({type, scale}) => {
  const cx = 205;
  const cy = 278;
  const t = svgScaleAt(scale, scale, cx, cy);
  if (type === 'smile') {
    return <path transform={t} d="M178 270 Q205 296 232 270" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />;
  }
  if (type === 'flat') {
    return <path transform={t} d="M184 280 Q205 284 226 278" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />;
  }
  if (type === 'frown') {
    return <path transform={t} d="M182 288 Q205 268 228 288" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />;
  }
  if (type === 'grin') {
    return (
      <g transform={t}>
        <path d="M168 262 Q205 266 242 262 Q238 318 205 318 Q172 318 168 262 Z" fill="#4a1e14" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        <path d="M184 302 Q205 290 226 302 Q218 315 205 315 Q192 315 184 302 Z" fill="#e7746a" />
        <path d="M172 265 Q205 270 238 265 L236 276 Q205 281 174 276 Z" fill="#fff" />
      </g>
    );
  }
  const big = type === 'wow';
  return (
    <g transform={t}>
      <ellipse cx={cx} cy={cy + 6} rx={big ? 24 : 14} ry={big ? 32 : 18} fill="#4a1e14" stroke={C.ink} strokeWidth={7} />
      <ellipse cx={cx} cy={cy + (big ? 24 : 16)} rx={big ? 13 : 7} ry={big ? 8 : 4} fill="#e7746a" />
    </g>
  );
};

const Arm: React.FC<{
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  rot: number;
  sleeve: string;
  children?: React.ReactNode;
}> = ({sx, sy, ex, ey, rot, sleeve, children}) => (
  <g transform={svgRotate(rot, sx, sy)}>
    <path d={`M${sx} ${sy} L${ex} ${ey}`} stroke={C.ink} strokeWidth={56} strokeLinecap="round" />
    <path d={`M${sx} ${sy} L${ex} ${ey}`} stroke={sleeve} strokeWidth={42} strokeLinecap="round" />
    <path d={`M${sx + 6} ${sy + 8} L${ex + 6} ${ey - 4}`} stroke={C.skinShade} strokeWidth={10} strokeLinecap="round" opacity={0.45} />
    {children}
  </g>
);

export const Bean: React.FC<Props> = ({
  width,
  style,
  lookX = 0,
  lookY = 0,
  blink = 0,
  happyEyes = 0,
  browY = 0,
  browTilt = 0,
  mouth = 'smile',
  mouthScale = 1,
  armL = 0,
  armR = 0,
  sweat = 0,
  blush = 0.5,
  coat = false,
  goggles = false,
  clipboard = false,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const head = `bean-head-${id}`;
  const body = `bean-body-${id}`;
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <radialGradient id={head} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor={C.skinLight} />
          <stop offset="0.55" stopColor={C.skin} />
          <stop offset="1" stopColor={C.skinShade} />
        </radialGradient>
        <linearGradient id={body} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={coat ? C.coat : C.skin} />
          <stop offset="1" stopColor={coat ? C.coatShade : C.skinShade} />
        </linearGradient>
      </defs>

      {/* Cuerpo */}
      <g id="body">
        <path d="M92 610 C92 440 120 330 200 330 C280 330 308 440 308 610 Z" fill={`url(#${body})`} stroke={C.ink} strokeWidth={OUT} />
        {coat ? (
          <g>
            <path d="M200 345 L200 610" stroke={C.ink} strokeWidth={5} />
            <path d="M158 342 L200 440 L242 342" fill="#7a5a44" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
            <path d="M165 345 L200 425 L235 345 Z" fill={C.skinShade} />
            <rect x={225} y={470} width={52} height={40} rx={6} fill="none" stroke={C.ink} strokeWidth={5} />
            <path d="M240 470 L240 452" stroke="#e4572e" strokeWidth={7} strokeLinecap="round" />
          </g>
        ) : null}
      </g>

      {/* Cabeza */}
      <g id="head">
        <circle cx={200} cy={190} r={158} fill={`url(#${head})`} stroke={C.ink} strokeWidth={OUT} />
        <ellipse cx={275} cy={88} rx={34} ry={22} fill="#fff" opacity={0.35} transform={svgRotate(28, 275, 88)} />
        <circle cx={312} cy={128} r={9} fill="#fff" opacity={0.3} />
        <ellipse cx={112} cy={262} rx={28} ry={16} fill="#ee8f7a" opacity={blush * 0.7} />
        <ellipse cx={300} cy={266} rx={26} ry={15} fill="#ee8f7a" opacity={blush * 0.7} />

        <g id="eyes">
          <Eye cx={140} cy={200} rx={44} ry={50} lookX={lookX} lookY={lookY} blink={blink} happy={happyEyes} />
          <Eye cx={264} cy={205} rx={40} ry={46} lookX={lookX} lookY={lookY} blink={blink} happy={happyEyes} />
        </g>

        <g id="brows" transform={`translate(0 ${browY})`}>
          <path d="M112 134 Q140 122 168 132" transform={svgRotate(-browTilt, 140, 130)} fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
          <path d="M240 138 Q266 127 292 137" transform={svgRotate(browTilt, 266, 134)} fill="none" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
        </g>

        <g id="mouth">
          <Mouth type={mouth} scale={mouthScale} />
        </g>

        {goggles ? (
          <g id="goggles">
            <path d="M48 92 Q200 40 352 92" fill="none" stroke="#5b3a2a" strokeWidth={20} strokeLinecap="round" />
            <circle cx={150} cy={74} r={36} fill="#9fd6dc" fillOpacity={0.55} stroke={C.ink} strokeWidth={9} />
            <circle cx={252} cy={74} r={36} fill="#9fd6dc" fillOpacity={0.55} stroke={C.ink} strokeWidth={9} />
            <path d="M136 60 L150 52" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            <path d="M238 60 L252 52" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
          </g>
        ) : null}

        <g id="sweat" opacity={sweat}>
          <path d="M352 150 Q372 190 360 206 Q346 218 334 204 Q326 190 352 150 Z" fill="#9fd6ec" stroke={C.ink} strokeWidth={5} />
          <path d="M344 196 Q340 186 346 178" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>

      {/* Brazos: se dibujan sobre la cabeza para poder rascarse o señalar */}
      <g id="arm-left">
        <Arm sx={112} sy={400} ex={74} ey={540} rot={armL} sleeve={coat ? C.coat : C.skin}>
          {clipboard ? (
            <g transform={svgRotate(-8, 80, 520)}>
              <rect x={18} y={440} width={130} height={170} rx={12} fill="#a6713f" stroke={C.ink} strokeWidth={6} />
              <rect x={32} y={462} width={102} height={134} rx={6} fill={C.cream} />
              <rect x={58} y={430} width={50} height={22} rx={6} fill="#cfc5b6" stroke={C.ink} strokeWidth={5} />
              <path d="M46 492 H118 M46 516 H110 M46 540 H118 M46 564 H96" stroke="#c9b9a2" strokeWidth={7} strokeLinecap="round" />
            </g>
          ) : null}
          <circle cx={74} cy={540} r={30} fill={C.skin} stroke={C.ink} strokeWidth={OUT} />
        </Arm>
      </g>
      <g id="arm-right">
        <Arm sx={288} sy={400} ex={328} ey={540} rot={armR} sleeve={coat ? C.coat : C.skin}>
          <circle cx={328} cy={540} r={30} fill={C.skin} stroke={C.ink} strokeWidth={OUT} />
        </Arm>
      </g>
    </svg>
  );
};
