import React from 'react';
import {svgRotate, svgScaleAt} from '../../components/anim';
import {Halftone, useSafeId, V} from '../style';

// Personaje recortado en papel: misma silueta que el "frijol", pero plano,
// con sombreado de semitono y cara de tinta simple (ojos de punto, cejas, boca).

export type DollMouth = 'smile' | 'grin' | 'o' | 'wow' | 'flat' | 'frown';

type Props = {
  readonly width: number;
  readonly lookX?: number;
  readonly lookY?: number;
  readonly blink?: number;
  readonly happyEyes?: number;
  readonly browY?: number;
  readonly browTilt?: number;
  readonly mouth?: DollMouth;
  readonly armL?: number;
  readonly armR?: number;
  readonly sweat?: number;
  readonly coat?: boolean;
  readonly glasses?: boolean;
  readonly skin?: string;
  readonly shirt?: string;
  readonly style?: React.CSSProperties;
};

const W = 400;
const H = 600;

export const PaperDoll: React.FC<Props> = ({
  width,
  lookX = 0,
  lookY = 0,
  blink = 0,
  happyEyes = 0,
  browY = 0,
  browTilt = 0,
  mouth = 'smile',
  armL = 0,
  armR = 0,
  sweat = 0,
  coat = false,
  glasses = false,
  skin = V.skin,
  shirt = V.teal,
  style,
}) => {
  const ht = useSafeId('doll-ht');
  const htLight = useSafeId('doll-htl');
  const headClip = useSafeId('doll-head');
  const bodyClip = useSafeId('doll-body');
  const torso = coat ? V.white : shirt;
  const ex = lookX * 12;
  const ey = lookY * 12;
  const open = Math.max(0.08, 1 - blink) * (1 - happyEyes);

  const eye = (cx: number, cy: number) => (
    <g key={cx}>
      <g transform={svgScaleAt(1, open, cx, cy)} opacity={open > 0.1 ? 1 : 0}>
        <ellipse cx={cx + ex} cy={cy + ey} rx={17} ry={22} fill={V.ink} />
        <circle cx={cx + ex - 6} cy={cy + ey - 8} r={5.5} fill={V.white} />
      </g>
      {happyEyes > 0.05 ? (
        <path d={`M${cx - 22} ${cy + 6} Q${cx} ${cy - 22} ${cx + 22} ${cy + 6}`} fill="none" stroke={V.ink} strokeWidth={9} strokeLinecap="round" opacity={happyEyes} />
      ) : null}
      {blink > 0.9 && happyEyes < 0.05 ? <path d={`M${cx - 20} ${cy} L${cx + 20} ${cy}`} stroke={V.ink} strokeWidth={8} strokeLinecap="round" /> : null}
    </g>
  );

  const mouthEl = () => {
    switch (mouth) {
      case 'smile':
        return <path d="M178 272 Q205 296 232 272" fill="none" stroke={V.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'flat':
        return <path d="M184 282 L226 280" fill="none" stroke={V.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'frown':
        return <path d="M182 290 Q205 270 228 290" fill="none" stroke={V.ink} strokeWidth={8} strokeLinecap="round" />;
      case 'grin':
        return <path d="M168 264 Q205 268 242 264 Q236 318 205 318 Q174 318 168 264 Z" fill={V.ink} />;
      case 'wow':
        return <ellipse cx={205} cy={290} rx={22} ry={30} fill={V.ink} />;
      default:
        return <ellipse cx={205} cy={286} rx={13} ry={17} fill={V.ink} />;
    }
  };

  const arm = (sx: number, sy: number, ex2: number, ey2: number, rot: number, key: string) => (
    <g key={key} transform={svgRotate(rot, sx, sy)}>
      <path d={`M${sx} ${sy} L${ex2} ${ey2}`} stroke={torso} strokeWidth={46} strokeLinecap="round" />
      <path d={`M${sx} ${sy} L${ex2} ${ey2}`} stroke={`url(#${htLight})`} strokeWidth={46} strokeLinecap="round" opacity={0.6} />
      <circle cx={ex2} cy={ey2} r={28} fill={skin} />
    </g>
  );

  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color={V.skinShade} size={12} />
        <Halftone id={htLight} color="rgba(0,0,0,0.18)" size={10} />
        <clipPath id={headClip}>
          <circle cx={200} cy={190} r={158} />
        </clipPath>
        <clipPath id={bodyClip}>
          <path d="M92 610 C92 440 120 330 200 330 C280 330 308 440 308 610 Z" />
        </clipPath>
      </defs>

      <g id="body">
        <path d="M92 610 C92 440 120 330 200 330 C280 330 308 440 308 610 Z" fill={torso} />
        <g clipPath={`url(#${bodyClip})`}>
          <rect x={230} y={320} width={120} height={300} fill={`url(#${htLight})`} />
        </g>
        {coat ? (
          <g>
            <path d="M160 340 L200 440 L240 340 Z" fill={shirt} />
            <path d="M200 440 L200 610" stroke={V.gray} strokeWidth={4} />
            <rect x={228} y={470} width={50} height={38} fill="none" stroke={V.gray} strokeWidth={4} />
          </g>
        ) : null}
      </g>

      <g id="head">
        <circle cx={200} cy={190} r={158} fill={skin} />
        <g clipPath={`url(#${headClip})`}>
          <circle cx={262} cy={250} r={170} fill={`url(#${ht})`} opacity={0.8} />
          <circle cx={150} cy={130} r={150} fill={skin} />
        </g>
        <ellipse cx={116} cy={262} rx={26} ry={14} fill={V.red} opacity={0.25} />
        <ellipse cx={298} cy={266} rx={24} ry={13} fill={V.red} opacity={0.25} />
        <g id="eyes">
          {eye(146, 205)}
          {eye(262, 208)}
        </g>
        <g id="brows" transform={`translate(0 ${browY})`}>
          <path d="M120 150 L172 146" transform={svgRotate(-browTilt, 146, 148)} stroke={V.ink} strokeWidth={11} strokeLinecap="round" />
          <path d="M236 150 L288 154" transform={svgRotate(browTilt, 262, 152)} stroke={V.ink} strokeWidth={11} strokeLinecap="round" />
        </g>
        <g id="mouth">{mouthEl()}</g>
        {glasses ? (
          <g id="glasses" fill="none" stroke={V.ink} strokeWidth={7}>
            <circle cx={146} cy={205} r={44} />
            <circle cx={262} cy={208} r={44} />
            <path d="M190 204 Q204 194 218 204" />
          </g>
        ) : null}
        <g id="sweat" opacity={sweat}>
          <path d="M350 140 Q372 184 358 200 Q342 212 330 196 Q324 182 350 140 Z" fill="#7fc4e0" />
        </g>
      </g>

      <g id="arm-left">{arm(112, 400, 74, 540, armL, 'l')}</g>
      <g id="arm-right">{arm(288, 400, 328, 540, armR, 'r')}</g>
    </svg>
  );
};
