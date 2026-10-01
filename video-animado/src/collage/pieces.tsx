import React from 'react';
import {Img} from 'remotion';
import {PHOTOS, PhotoId, SHOW_PLACEHOLDER_TAGS} from './assets';
import {smooth} from './marks';
import {tornPath, useSafeId} from './paper';
import {FONT, K, TEX} from './theme';

// ---------- Siluetas en blanco y negro (gráficas, no fotográficas) ----------

// Cabeza humana de perfil mirando a la derecha (caja 600x800).
const HEAD_PTS: [number, number][] = [
  [196, 800], [206, 650], [150, 560], [112, 455], [104, 330], [150, 205], [250, 118], [360, 92], [462, 128], [528, 215],
  [548, 300], [540, 334], [562, 368], [600, 432], [568, 456], [578, 482], [562, 502], [574, 524], [552, 548], [562, 586],
  [512, 616], [452, 632], [442, 700], [452, 800],
];
export const HEAD_PATH = smooth(HEAD_PTS, true);

export const HeadProfile: React.FC<{readonly width: number; readonly flip?: boolean; readonly children?: React.ReactNode; readonly style?: React.CSSProperties}> = ({
  width,
  flip = false,
  children,
  style,
}) => {
  const ht = useSafeId('hp');
  return (
    <div style={{position: 'relative', width, height: (width * 800) / 600, scale: flip ? '-1 1' : undefined, ...style}}>
      <svg width={width} height={(width * 800) / 600} viewBox="0 0 600 800" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <pattern id={ht} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <circle cx={6} cy={6} r={2.6} fill="#5b5b5b" />
          </pattern>
        </defs>
        <path d={HEAD_PATH} fill={K.ink} />
        <path d={HEAD_PATH} fill={`url(#${ht})`} opacity={0.55} transform="translate(26 -10) scale(0.94)" style={{mixBlendMode: 'screen'}} />
      </svg>
      {children}
    </div>
  );
};

// Silueta de busto frontal (para "nadie").
export const BustSilhouette: React.FC<{readonly width: number; readonly tone?: string}> = ({width, tone = K.ink}) => (
  <svg width={width} height={width * 1.2} viewBox="0 0 400 480" style={{overflow: 'visible'}}>
    <path d="M200 40 C262 40 296 92 292 150 C290 200 266 240 236 254 L236 286 C320 300 384 350 392 480 L8 480 C16 350 80 300 164 286 L164 254 C134 240 110 200 108 150 C104 92 138 40 200 40 Z" fill={tone} />
  </svg>
);

// Lupa en silueta.
export const MagnifierSil: React.FC<{readonly width: number}> = ({width}) => (
  <svg width={width} height={width} viewBox="0 0 300 300" style={{overflow: 'visible'}}>
    <path d="M186 186 L280 280" stroke={K.ink} strokeWidth={34} strokeLinecap="round" />
    <circle cx={118} cy={118} r={92} fill="rgba(255,255,255,0.35)" stroke={K.ink} strokeWidth={22} />
  </svg>
);

// ---------- Piezas de papel a color ----------

// Cerebro recortado en papel rosa (vista lateral) con pliegues a lápiz.
const CEREBRUM =
  'M108 300 C58 272 46 196 92 142 C118 84 198 42 280 46 C362 36 452 62 502 122 C548 172 552 242 520 288 C500 322 462 332 432 326 C410 352 370 362 330 352 C300 366 250 364 220 346 C180 352 138 336 108 300 Z';
const CEREBELLUM = 'M404 330 C436 326 482 334 492 364 C498 396 458 412 422 402 C394 394 382 352 404 330 Z';
const FOLDS = [
  'M140 150 C170 130 196 160 226 138 C252 120 276 146 300 128',
  'M110 220 C140 196 168 236 198 210 C226 188 252 222 284 200',
  'M326 104 C350 90 376 116 404 100 C430 88 456 112 480 106',
  'M318 170 C344 152 370 188 398 168 C424 150 450 182 486 170',
  'M170 290 C200 270 222 300 252 282 C282 264 304 296 334 280',
  'M302 232 C330 214 352 248 382 230 C410 214 436 244 470 236',
  'M286 52 C276 110 300 160 290 222',
];

export const PaperBrain: React.FC<{readonly width: number; readonly color?: string; readonly glow?: number}> = ({width, color = K.pink, glow = 0}) => {
  const clip = useSafeId('pb');
  return (
    <svg width={width} height={(width * 420) / 600} viewBox="40 30 520 390" style={{overflow: 'visible'}}>
      <defs>
        <clipPath id={clip}>
          <path d={CEREBRUM} />
          <path d={CEREBELLUM} />
        </clipPath>
      </defs>
      {glow > 0 ? <ellipse cx={300} cy={220} rx={300 * (0.9 + glow * 0.2)} ry={210 * (0.9 + glow * 0.2)} fill={K.yellow} opacity={glow * 0.9} /> : null}
      <path d={CEREBELLUM} fill={color} />
      <path d={CEREBRUM} fill={color} />
      <g clipPath={`url(#${clip})`} style={{mixBlendMode: 'multiply'}}>
        <image href={TEX.grain} x={0} y={0} width={1080} height={1920} />
        <ellipse cx={360} cy={420} rx={300} ry={150} fill="#c9707c" opacity={0.35} />
      </g>
      {FOLDS.map((d) => (
        <path key={d} d={d} fill="none" stroke="#a24a58" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
      ))}
    </svg>
  );
};

// Sobre de papel kraft. `tear` 0..1 arranca la tira superior; `open` 0..1 abre la solapa.
export const Envelope: React.FC<{readonly width: number; readonly tear?: number; readonly open?: number; readonly children?: React.ReactNode}> = ({
  width,
  tear = 0,
  open = 0,
  children,
}) => {
  const h = width * 0.66;
  const strip = tornPath(width, 70, 'env-strip', [2, 2, 10, 2]);
  return (
    <div style={{position: 'relative', width, height: h}}>
      {children}
      <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <rect x={0} y={60} width={width} height={h - 60} fill={K.kraft} />
        <path d={`M0 ${h} L${width / 2} ${h * 0.52} L${width} ${h}`} fill="#b38952" />
        <path d={`M0 60 L${width / 2} ${60 + (h * 0.42) * (1 - open * 1.8)} L${width} 60 Z`} fill="#d6b27c" opacity={open > 0.55 ? 0 : 1} />
        <image href={TEX.grain} x={0} y={0} width={width} height={h} opacity={0.5} style={{mixBlendMode: 'multiply'}} />
        <g transform={`translate(${tear * 60} ${-tear * 260}) rotate(${-tear * 22} ${width} 30)`} opacity={1 - Math.max(0, tear - 0.7) / 0.3}>
          <path d={strip} fill="#d6b27c" />
        </g>
      </svg>
    </div>
  );
};

// ---------- Fotografías ----------

// Silueta aproximada del objeto para el sustituto provisional (coordenadas 0..400 x 0..500).
const PLACEHOLDER_SHAPES: Record<PhotoId, string> = {
  product: 'M90 30 L310 30 L310 470 L90 470 Z',
  liquorGlass: 'M40 70 L360 70 L332 450 Q330 478 300 478 L100 478 Q70 478 68 450 Z',
  pills: 'M110 120 L290 120 L290 90 L120 90 Z M100 130 L300 130 L300 470 Q300 490 280 490 L120 490 Q100 490 100 470 Z',
  scientist:
    'M200 30 C256 30 288 76 286 128 C284 172 262 206 236 220 L236 250 C330 262 390 320 396 500 L4 500 C10 320 70 262 164 250 L164 220 C138 206 116 172 114 128 C112 76 144 30 200 30 Z',
};

// Fotografía recortada. Si falta la foto real, muestra un sustituto PROVISIONAL identificado.
export const Photo: React.FC<{readonly id: PhotoId; readonly width: number; readonly bw?: boolean; readonly tagX?: number; readonly tagW?: number}> = ({id, width, bw = false, tagX = 50, tagW = 86}) => {
  const asset = PHOTOS[id];
  const ht = useSafeId('ph');
  const grad = useSafeId('phg');
  if (asset.src) {
    return <Img src={asset.src} style={{width, filter: bw ? 'grayscale(1) contrast(1.15)' : undefined}} />;
  }
  const h = width * 1.25;
  return (
    <div style={{position: 'relative', width, height: h}}>
      <svg width={width} height={h} viewBox="0 0 400 500" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id={grad} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={bw ? '#d9d6cf' : '#e9d9b8'} />
            <stop offset="1" stopColor={bw ? '#5d5a55' : '#9a7b4a'} />
          </linearGradient>
          <pattern id={ht} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx={6} cy={6} r={2.4} fill="#000" opacity={0.25} />
          </pattern>
        </defs>
        <path d={PLACEHOLDER_SHAPES[id]} fill={`url(#${grad})`} />
        <path d={PLACEHOLDER_SHAPES[id]} fill={`url(#${ht})`} />
        <path d={PLACEHOLDER_SHAPES[id]} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={4} strokeDasharray="14 10" />
      </svg>
      {SHOW_PLACEHOLDER_TAGS ? (
        <div
          style={{
            position: 'absolute',
            left: `${tagX}%`,
            top: '54%',
            translate: '-50% -50%',
            width: `${tagW}%`,
            background: K.white,
            border: `4px solid ${K.red}`,
            padding: '10px 14px 8px',
            fontFamily: FONT,
            color: K.red,
            textAlign: 'center',
            lineHeight: 1.05,
          }}
        >
          <div style={{fontSize: width * 0.085}}>FOTO PROVISIONAL</div>
          <div style={{fontSize: width * 0.05, color: K.ink, marginTop: 4}}>{asset.description}</div>
        </div>
      ) : null}
    </div>
  );
};
