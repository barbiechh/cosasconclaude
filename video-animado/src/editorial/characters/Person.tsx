import React from 'react';
import {E} from '../theme';
import {Halftone, useSafeId} from '../kit';

// Persona de busto, estilo ilustración editorial. Cara sobria pero expresiva:
// ojos, cejas, boca y cabeza son grupos animables por props.
export type Expr = 'neutral' | 'tired' | 'calm' | 'happy' | 'irritated' | 'sad' | 'focused' | 'surprised';

type Props = {
  readonly width: number;
  readonly expr?: Expr;
  readonly lookX?: number;
  readonly lookY?: number;
  readonly blink?: number;
  readonly tilt?: number; // grados
  readonly shirt?: string;
  readonly skin?: string;
  readonly hair?: 'short' | 'long' | 'bun';
  readonly hairColor?: string;
  readonly glasses?: boolean;
  readonly coat?: boolean;
  readonly style?: React.CSSProperties;
};

const W = 500;
const H = 640;

const BROWS: Record<Expr, [number, number]> = {
  // [desplazamiento vertical, inclinación (+ = preocupado, - = enfado)]
  neutral: [0, 0],
  tired: [6, 10],
  calm: [-4, 0],
  happy: [-6, 0],
  irritated: [6, -14],
  sad: [2, 14],
  focused: [4, -6],
  surprised: [-14, 4],
};

const MOUTH: Record<Expr, string> = {
  neutral: 'M228 338 Q250 343 272 338',
  tired: 'M230 342 Q250 340 270 343',
  calm: 'M228 334 Q250 348 272 334',
  happy: 'M222 330 Q250 362 278 330',
  irritated: 'M230 344 Q250 334 270 344',
  sad: 'M228 348 Q250 332 272 348',
  focused: 'M234 340 L266 340',
  surprised: '',
};

export const Person: React.FC<Props> = ({
  width,
  expr = 'neutral',
  lookX = 0,
  lookY = 0,
  blink = 0,
  tilt = 0,
  shirt = E.blue,
  skin = E.skin,
  hair = 'short',
  hairColor = E.hair,
  glasses = false,
  coat = false,
  style,
}) => {
  const ht = useSafeId('p-ht');
  const headClip = useSafeId('p-head');
  const [by, bt] = BROWS[expr];
  const ex = lookX * 7;
  const ey = lookY * 6;
  const closedEyes = expr === 'calm' || expr === 'happy' || blink > 0.6;

  const eye = (cx: number) => {
    if (closedEyes) {
      return <path key={cx} d={`M${cx - 13} 266 Q${cx} ${expr === 'happy' ? 252 : 258} ${cx + 13} 266`} fill="none" stroke={E.ink} strokeWidth={6} strokeLinecap="round" />;
    }
    if (expr === 'tired') {
      return (
        <g key={cx}>
          <ellipse cx={cx + ex} cy={268 + ey} rx={9} ry={6} fill={E.ink} />
          <path d={`M${cx - 15} 262 Q${cx} 258 ${cx + 15} 263`} fill="none" stroke={E.ink} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    }
    const ry = expr === 'surprised' ? 14 : 11;
    return (
      <g key={cx}>
        <ellipse cx={cx + ex} cy={264 + ey} rx={9} ry={ry} fill={E.ink} />
        <circle cx={cx + ex - 3} cy={260 + ey} r={3} fill={E.cream} />
      </g>
    );
  };

  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color={E.skinShade} size={10} />
        <clipPath id={headClip}>
          <ellipse cx={250} cy={252} rx={118} ry={140} />
        </clipPath>
      </defs>

      {hair === 'long' ? <path d="M120 250 C110 130 190 90 252 92 C320 94 392 140 382 250 C392 340 400 420 360 470 L140 470 C100 420 108 340 120 250 Z" fill={hairColor} /> : null}

      <g id="torso">
        <path d="M40 640 C40 522 110 474 190 458 L310 458 C390 474 460 522 460 640 Z" fill={coat ? E.cream : shirt} />
        <path d="M330 470 C400 488 446 530 460 640 L330 640 Z" fill={`url(#${ht})`} opacity={coat ? 0.25 : 0.35} />
        {coat ? (
          <g>
            <path d="M206 458 L250 560 L294 458 Z" fill={shirt} />
            <path d="M190 460 L250 600 M310 460 L250 600" stroke={E.mist} strokeWidth={4} fill="none" />
          </g>
        ) : (
          <path d="M206 458 Q250 500 294 458" fill="none" stroke={E.ink} strokeWidth={3} opacity={0.4} />
        )}
      </g>
      <path d="M212 372 L288 372 L294 466 Q250 486 206 466 Z" fill={E.skinShade} />

      <g id="head" transform={`rotate(${tilt} 250 420)`}>
        <ellipse cx={132} cy={268} rx={20} ry={30} fill={skin} />
        <ellipse cx={368} cy={268} rx={20} ry={30} fill={skin} />
        <ellipse cx={250} cy={252} rx={118} ry={140} fill={skin} />
        <g clipPath={`url(#${headClip})`}>
          <ellipse cx={360} cy={300} rx={120} ry={190} fill={`url(#${ht})`} opacity={0.55} />
        </g>
        {hair === 'short' ? (
          <path d="M130 250 C120 140 190 96 255 98 C332 100 386 150 372 246 C362 196 330 162 280 158 C226 156 168 176 138 232 Z" fill={hairColor} />
        ) : null}
        {hair === 'long' ? <path d="M132 240 C126 140 196 104 256 106 C326 108 384 150 370 244 C336 180 260 150 180 176 C158 190 140 214 132 240 Z" fill={hairColor} /> : null}
        {hair === 'bun' ? (
          <g fill={hairColor}>
            <circle cx={250} cy={92} r={46} />
            <path d="M132 246 C124 146 192 104 254 106 C326 108 386 150 370 246 C352 186 300 160 250 160 C196 160 150 190 132 246 Z" />
          </g>
        ) : null}
        <g id="brows" transform={`translate(0 ${by})`}>
          <path d="M184 232 L226 230" transform={`rotate(${-bt} 205 231)`} stroke={E.ink} strokeWidth={7} strokeLinecap="round" />
          <path d="M274 230 L316 232" transform={`rotate(${bt} 295 231)`} stroke={E.ink} strokeWidth={7} strokeLinecap="round" />
        </g>
        <g id="eyes">{[205, 295].map(eye)}</g>
        <path d="M252 272 Q242 302 258 306" fill="none" stroke={E.skinShade} strokeWidth={5} strokeLinecap="round" />
        <g id="mouth">
          {expr === 'surprised' ? (
            <ellipse cx={250} cy={342} rx={12} ry={15} fill={E.ink} />
          ) : (
            <path d={MOUTH[expr]} fill="none" stroke={E.ink} strokeWidth={6} strokeLinecap="round" />
          )}
        </g>
        {glasses ? (
          <g fill="none" stroke={E.ink} strokeWidth={5}>
            <rect x={170} y={238} width={70} height={52} rx={18} />
            <rect x={260} y={238} width={70} height={52} rx={18} />
            <path d="M240 260 L260 260" />
          </g>
        ) : null}
      </g>
    </svg>
  );
};
