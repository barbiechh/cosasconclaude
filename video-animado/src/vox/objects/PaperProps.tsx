import React from 'react';
import {svgRotate} from '../../components/anim';
import {Halftone, useSafeId, V} from '../style';

// Vaso recortado que se llena (`fill` 0..1). `t` mueve la superficie y las burbujas.
export const PaperGlass: React.FC<{
  readonly width: number;
  readonly fill: number;
  readonly t: number;
  readonly ice?: boolean;
  readonly style?: React.CSSProperties;
}> = ({width, fill, t, ice = true, style}) => {
  const ht = useSafeId('glass-ht');
  const clip = useSafeId('glass-clip');
  const shape = 'M28 20 L272 20 L242 392 L58 392 Z';
  const level = 392 - Math.max(0, Math.min(1, fill)) * 350;
  const wave = (x: number) => level + Math.sin(x / 40 + t * 0.2) * 5 * Math.min(1, fill * 4);
  let surface = `M0 ${wave(0)}`;
  for (let x = 30; x <= 300; x += 30) surface += ` L${x} ${wave(x)}`;
  return (
    <svg width={width} height={(width * 410) / 300} viewBox="0 0 300 410" style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color={V.amberDeep} size={12} />
        <clipPath id={clip}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill="#dfe8ea" />
      <g clipPath={`url(#${clip})`}>
        <path d={`${surface} L300 420 L0 420 Z`} fill={V.amber} />
        <path d={`${surface} L300 420 L0 420 Z`} fill={`url(#${ht})`} opacity={0.55} transform="translate(60 40)" />
        {fill > 0.1
          ? Array.from({length: 7}, (_, i) => {
              const span = 392 - level;
              const y = 380 - ((t * 2 + i * 53) % Math.max(1, span - 10));
              return <circle key={i} cx={80 + ((i * 47) % 150)} cy={y} r={5 + (i % 3) * 3} fill={V.white} opacity={0.7} />;
            })
          : null}
        {ice && fill > 0.35 ? (
          <rect x={120} y={level - 14} width={86} height={80} rx={10} fill={V.white} opacity={0.75} transform={svgRotate(14, 160, level + 20)} />
        ) : null}
      </g>
      <path d="M60 48 L84 360" stroke={V.white} strokeWidth={16} strokeLinecap="round" opacity={0.8} />
      <path d={shape} fill="none" stroke={V.ink} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
};

// Cápsula de papel.
export const PaperCapsule: React.FC<{readonly x: number; readonly y: number; readonly rot: number; readonly size?: number}> = ({
  x,
  y,
  rot,
  size = 1,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size})`}>
    <rect x={-46} y={-20} width={92} height={40} rx={20} fill={V.white} />
    <path d="M0 -20 L-26 -20 A20 20 0 0 0 -26 20 L0 20 Z" fill={V.red} />
    <rect x={-46} y={-20} width={92} height={40} rx={20} fill="none" stroke={V.ink} strokeWidth={5} />
  </g>
);

// Frasco de estimulantes; `lid` 0..1 hace saltar la tapa.
export const PaperPillBottle: React.FC<{readonly width: number; readonly lid?: number; readonly style?: React.CSSProperties}> = ({
  width,
  lid = 0,
  style,
}) => {
  const ht = useSafeId('bottle-ht');
  return (
    <svg width={width} height={(width * 420) / 260} viewBox="0 0 260 420" style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color="#9c4a12" size={12} />
      </defs>
      <rect x={40} y={96} width={180} height={304} rx={26} fill="#ef8a3a" />
      <rect x={150} y={96} width={70} height={304} rx={20} fill={`url(#${ht})`} opacity={0.6} />
      <rect x={40} y={186} width={180} height={128} fill={V.white} />
      <path d="M62 222 H198 M62 248 H170 M62 274 H186" stroke={V.gray} strokeWidth={9} strokeLinecap="round" />
      <PaperCapsule x={100} y={360} rot={-20} size={0.7} />
      <PaperCapsule x={170} y={352} rot={30} size={0.7} />
      <rect x={40} y={96} width={180} height={304} rx={26} fill="none" stroke={V.ink} strokeWidth={6} />
      <g transform={`translate(${lid * 50} ${-lid * 130}) ${svgRotate(lid * 32, 130, 60)}`}>
        <rect x={30} y={22} width={200} height={78} rx={14} fill={V.white} stroke={V.ink} strokeWidth={6} />
        {[62, 94, 126, 158, 190].map((x) => (
          <path key={x} d={`M${x} 36 V86`} stroke={V.gray} strokeWidth={7} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
};

// Hoja de un estudio científico (sin texto legible): líneas, gráfica y resaltado.
export const StudyDoc: React.FC<{
  readonly width: number;
  readonly chart: number; // 0..1 dibuja la gráfica
  readonly highlight: number; // 0..1 pasa el marcador amarillo
  readonly style?: React.CSSProperties;
}> = ({width, chart, highlight, style}) => {
  const ht = useSafeId('doc-ht');
  const pts = [
    [90, 640],
    [170, 600],
    [250, 612],
    [330, 548],
    [410, 520],
    [490, 470],
  ];
  const line = `M${pts.map((p) => p.join(' ')).join(' L')}`;
  return (
    <svg width={width} height={(width * 780) / 600} viewBox="0 0 600 780" style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color={V.navy} size={10} />
      </defs>
      <path d="M0 0 L600 0 L600 780 L0 780 Z" fill={V.white} />
      <rect x={50} y={50} width={500} height={34} fill={V.ink} />
      <rect x={50} y={100} width={330} height={18} fill={V.gray} />
      {[160, 196, 232, 268, 304].map((y, i) => (
        <rect key={y} x={50} y={y} width={i % 2 ? 470 : 500} height={14} fill="#cfc9bd" />
      ))}
      <rect x={46} y={190} width={480 * highlight} height={26} fill={V.yellow} opacity={0.75} />
      <rect x={46} y={226} width={430 * Math.max(0, highlight * 2 - 1)} height={26} fill={V.yellow} opacity={0.75} />
      <rect x={50} y={360} width={500} height={340} fill={`url(#${ht})`} opacity={0.18} />
      <path d="M80 380 L80 670 L530 670" fill="none" stroke={V.ink} strokeWidth={6} />
      <path d={line} fill="none" stroke={V.red} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={11} fill={V.navy} opacity={chart > i / pts.length ? 1 : 0} />
      ))}
      <rect x={50} y={720} width={260} height={14} fill="#cfc9bd" />
    </svg>
  );
};

// Sobre con el resultado; `open` 0..1 levanta la solapa.
export const Envelope: React.FC<{readonly width: number; readonly open?: number; readonly style?: React.CSSProperties}> = ({
  width,
  open = 0,
  style,
}) => (
  <svg width={width} height={width * 0.7} viewBox="0 0 400 280" style={{overflow: 'visible', ...style}}>
    <rect x={0} y={0} width={400} height={280} fill={V.kraft} />
    <path d="M0 280 L200 140 L400 280 Z" fill="#b8925f" />
    <path d={`M0 0 L200 ${160 - open * 320} L400 0 Z`} fill="#d8b98c" stroke="#9e7a48" strokeWidth={4} />
    <circle cx={200} cy={150 - open * 300} r={26} fill={V.red} opacity={open < 0.3 ? 1 : 0} />
    <rect x={0} y={0} width={400} height={280} fill="none" stroke="#7f6038" strokeWidth={5} />
  </svg>
);

// Bombilla recortada; `on` 0..1 enciende el semitono amarillo.
export const PaperBulb: React.FC<{readonly width: number; readonly on: number; readonly style?: React.CSSProperties}> = ({
  width,
  on,
  style,
}) => {
  const ht = useSafeId('bulb-ht');
  return (
    <svg width={width} height={width * 1.3} viewBox="0 0 260 340" style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color="#e0a800" size={11} />
      </defs>
      <path
        d="M130 14 C60 14 22 66 22 120 C22 166 54 190 76 222 L184 222 C206 190 238 166 238 120 C238 66 200 14 130 14 Z"
        fill={on > 0.5 ? V.yellow : '#d8d2c4'}
      />
      <path d="M130 14 C200 14 238 66 238 120 C238 166 206 190 184 222 L150 222 C170 180 200 150 196 100 Z" fill={`url(#${ht})`} opacity={on > 0.5 ? 0.8 : 0.3} />
      <path d="M100 222 L104 160 Q130 130 156 160 L160 222" fill="none" stroke={V.ink} strokeWidth={6} strokeLinecap="round" />
      <rect x={80} y={222} width={100} height={64} fill={V.gray} />
      <path d="M80 244 H180 M80 266 H180" stroke={V.ink} strokeWidth={5} />
      <path d="M130 14 C60 14 22 66 22 120 C22 166 54 190 76 222 L184 222 C206 190 238 166 238 120 C238 66 200 14 130 14 Z" fill="none" stroke={V.ink} strokeWidth={6} />
    </svg>
  );
};

// Flecha de papel rojo rasgado (apunta hacia arriba).
export const PaperArrow: React.FC<{readonly width: number; readonly style?: React.CSSProperties}> = ({width, style}) => {
  const ht = useSafeId('arrow-ht');
  return (
    <svg width={width} height={width * 1.1} viewBox="0 0 400 440" style={{overflow: 'visible', ...style}}>
      <defs>
        <Halftone id={ht} color="#8f1f14" size={12} />
      </defs>
      <path d="M200 16 L384 214 L266 208 L262 424 L140 420 L136 210 L18 216 Z" fill={V.red} />
      <path d="M200 16 L384 214 L266 208 L262 424 L210 422 Z" fill={`url(#${ht})`} opacity={0.6} />
    </svg>
  );
};

// Lupa.
export const Magnifier: React.FC<{readonly width: number; readonly style?: React.CSSProperties}> = ({width, style}) => (
  <svg width={width} height={width} viewBox="0 0 300 300" style={{overflow: 'visible', ...style}}>
    <path d="M190 190 L280 280" stroke={V.ink} strokeWidth={34} strokeLinecap="round" />
    <circle cx={120} cy={120} r={98} fill="#cfe6ea" fillOpacity={0.45} stroke={V.ink} strokeWidth={18} />
    <path d="M64 96 Q80 64 112 56" fill="none" stroke={V.white} strokeWidth={12} strokeLinecap="round" />
  </svg>
);
