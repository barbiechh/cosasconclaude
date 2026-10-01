import React from 'react';
import {E} from '../theme';
import {Halftone, mixHex, useSafeId} from '../kit';

// Cerebro en vista lateral, estilo ilustración editorial.
// `level` 0..1 = cuánta dopamina tiene (relleno azul que sube desde abajo).
type Props = {
  readonly width: number;
  readonly level?: number;
  readonly t?: number;
  readonly dim?: number; // 0..1, apaga los colores (cerebro "vacío")
  readonly outline?: boolean;
  readonly style?: React.CSSProperties;
};

const W = 600;
const H = 470;
export const CEREBRUM =
  'M108 300 C58 272 46 196 92 142 C118 84 198 42 280 46 C362 36 452 62 502 122 C548 172 552 242 520 288 C500 322 462 332 432 326 C410 352 370 362 330 352 C300 366 250 364 220 346 C180 352 138 336 108 300 Z';
const CEREBELLUM = 'M404 330 C436 326 482 334 492 364 C498 396 458 412 422 402 C394 394 382 352 404 330 Z';
const STEM = 'M352 344 C358 382 362 414 352 462 L392 462 C398 414 398 382 404 346 Z';
const GYRI = [
  'M140 150 C170 130 196 160 226 138 C252 120 276 146 300 128',
  'M110 220 C140 196 168 236 198 210 C226 188 252 222 284 200',
  'M326 104 C350 90 376 116 404 100 C430 88 456 112 480 106',
  'M318 170 C344 152 370 188 398 168 C424 150 450 182 486 170',
  'M170 290 C200 270 222 300 252 282 C282 264 304 296 334 280',
  'M302 232 C330 214 352 248 382 230 C410 214 436 244 470 236',
  'M286 52 C276 110 300 160 290 222',
  'M414 352 C436 352 458 358 476 370',
  'M412 374 C434 376 456 382 474 390',
];

export const Brain: React.FC<Props> = ({width, level = 0, t = 0, dim = 0, outline = true, style}) => {
  const ht = useSafeId('brain-ht');
  const clip = useSafeId('brain-clip');
  const top = 440 - Math.max(0, Math.min(1, level)) * 420;
  let wave = `M0 ${top}`;
  for (let x = 0; x <= W; x += 30) wave += ` L${x} ${top + Math.sin(x / 45 + t * 0.12) * 7}`;
  const base = mixHex(E.rose, E.mist, dim * 0.7);
  return (
    <svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color={E.roseDeep} size={11} />
        <clipPath id={clip}>
          <path d={CEREBRUM} />
          <path d={CEREBELLUM} />
          <path d={STEM} />
        </clipPath>
      </defs>
      <path d={STEM} fill={base} />
      <path d={CEREBELLUM} fill={base} />
      <path d={CEREBRUM} fill={base} />
      <g clipPath={`url(#${clip})`}>
        <ellipse cx={360} cy={420} rx={330} ry={170} fill={`url(#${ht})`} opacity={0.5 - dim * 0.3} />
        {level > 0.001 ? <path d={`${wave} L${W} ${H} L0 ${H} Z`} fill={E.blue} opacity={0.82} /> : null}
        {level > 0.001 ? <path d={wave} fill="none" stroke={E.cream} strokeWidth={4} opacity={0.7} /> : null}
      </g>
      {GYRI.map((d) => (
        <path key={d} d={d} fill="none" stroke={E.roseDeep} strokeWidth={6} strokeLinecap="round" opacity={0.75 - dim * 0.4} />
      ))}
      {outline ? (
        <g fill="none" stroke={E.ink} strokeWidth={4} strokeLinejoin="round" opacity={0.85}>
          <path d={CEREBRUM} />
          <path d={CEREBELLUM} />
          <path d={STEM} />
        </g>
      ) : null}
    </svg>
  );
};
