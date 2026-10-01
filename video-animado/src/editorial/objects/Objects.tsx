import React from 'react';
import {Img, staticFile} from 'remotion';
import {E, MONO, SANS, SERIF} from '../theme';
import {Halftone, mixHex, useSafeId} from '../kit';

type Base = {readonly width: number; readonly style?: React.CSSProperties};
const svgStyle = (s?: React.CSSProperties): React.CSSProperties => ({overflow: 'visible', ...s});

// Vaso bajo con licor ámbar. fill 0..1.
export const Tumbler: React.FC<Base & {readonly fill: number; readonly t?: number; readonly dark?: boolean}> = ({width, fill, t = 0, dark = false, style}) => {
  const clip = useSafeId('tum');
  const ht = useSafeId('tum-ht');
  const shape = 'M30 30 L270 30 L250 330 Q248 350 228 350 L72 350 Q52 350 50 330 Z';
  const y = 340 - Math.max(0, Math.min(1, fill)) * 290;
  let s = `M0 ${y}`;
  for (let x = 0; x <= 300; x += 20) s += ` L${x} ${y + Math.sin(x / 30 + t * 0.15) * 4}`;
  const ink = dark ? E.cream : E.ink;
  return (
    <svg width={width} height={(width * 370) / 300} viewBox="0 0 300 370" style={svgStyle(style)}>
      <defs>
        <clipPath id={clip}>
          <path d={shape} />
        </clipPath>
        <Halftone id={ht} color="#8a5714" size={10} />
      </defs>
      <path d={shape} fill={dark ? 'rgba(255,255,255,0.07)' : 'rgba(29,43,58,0.05)'} />
      <g clipPath={`url(#${clip})`}>
        <path d={`${s} L300 380 L0 380 Z`} fill={E.ochre} />
        <path d={`${s} L300 380 L0 380 Z`} fill={`url(#${ht})`} opacity={0.45} transform="translate(90 30)" />
        {fill > 0.3 ? <rect x={110} y={y - 18} width={80} height={74} rx={10} fill="#fff" opacity={0.55} transform={`rotate(12 150 ${y + 18})`} /> : null}
      </g>
      <path d="M62 60 L78 300" stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.5} />
      <path d={shape} fill="none" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

// Frasco de receta genérico (sin marca).
export const RxBottle: React.FC<Base & {readonly lid?: number}> = ({width, lid = 0, style}) => {
  const ht = useSafeId('rx-ht');
  return (
    <svg width={width} height={(width * 420) / 260} viewBox="0 0 260 420" style={svgStyle(style)}>
      <defs>
        <Halftone id={ht} color="#7a3d14" size={10} />
      </defs>
      <rect x={40} y={100} width={180} height={300} rx={22} fill="#d98a4a" />
      <rect x={150} y={100} width={70} height={300} rx={18} fill={`url(#${ht})`} opacity={0.5} />
      <rect x={40} y={180} width={180} height={140} fill={E.cream} />
      <text x={60} y={222} fontFamily={MONO} fontSize={26} fill={E.ink} letterSpacing={2}>
        Rx
      </text>
      <path d="M60 252 H200 M60 278 H176 M60 302 H190" stroke={E.mist} strokeWidth={8} strokeLinecap="round" />
      <rect x={40} y={100} width={180} height={300} rx={22} fill="none" stroke={E.ink} strokeWidth={5} />
      <g transform={`translate(${lid * 40} ${-lid * 110}) rotate(${lid * 25} 130 60)`}>
        <rect x={28} y={28} width={204} height={78} rx={12} fill={E.cream} stroke={E.ink} strokeWidth={5} />
        {[64, 98, 132, 166, 200].map((x) => (
          <path key={x} d={`M${x} 42 V92`} stroke={E.mist} strokeWidth={6} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
};

// Cápsula (coordenadas SVG locales).
export const Capsule: React.FC<{readonly x: number; readonly y: number; readonly rot: number; readonly size?: number; readonly color?: string}> = ({
  x,
  y,
  rot,
  size = 1,
  color = E.brick,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size})`}>
    <rect x={-46} y={-20} width={92} height={40} rx={20} fill={E.cream} />
    <path d="M0 -20 L-26 -20 A20 20 0 0 0 -26 20 L0 20 Z" fill={color} />
    <rect x={-46} y={-20} width={92} height={40} rx={20} fill="none" stroke={E.ink} strokeWidth={4} />
  </g>
);

export const CapsuleArt: React.FC<Base & {readonly color?: string; readonly rot?: number}> = ({width, color, rot = -30, style}) => (
  <svg width={width} height={width * 0.6} viewBox="-60 -36 120 72" style={svgStyle(style)}>
    <Capsule x={0} y={0} rot={rot} size={1} color={color} />
  </svg>
);

// Taza de café con vapor.
export const Coffee: React.FC<Base & {readonly t?: number}> = ({width, t = 0, style}) => (
  <svg width={width} height={width} viewBox="0 0 300 300" style={svgStyle(style)}>
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M${110 + i * 40} 110 C${96 + i * 40} ${86 - (t % 20)} ${126 + i * 40} ${70 - (t % 20)} ${110 + i * 40} ${40 - (t % 20)}`}
        fill="none"
        stroke={E.mist}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.7}
      />
    ))}
    <ellipse cx={150} cy={262} rx={120} ry={22} fill={E.cream} stroke={E.ink} strokeWidth={5} />
    <path d="M60 130 L240 130 L222 240 Q218 258 198 258 L102 258 Q82 258 78 240 Z" fill={E.cream} stroke={E.ink} strokeWidth={5} />
    <ellipse cx={150} cy={132} rx={88} ry={14} fill="#6b4a33" />
    <path d="M236 150 C290 150 290 220 228 222" fill="none" stroke={E.ink} strokeWidth={10} />
  </svg>
);

// Algo dulce: dónut glaseado.
export const Donut: React.FC<Base> = ({width, style}) => {
  const ht = useSafeId('donut');
  return (
    <svg width={width} height={width} viewBox="0 0 300 300" style={svgStyle(style)}>
      <defs>
        <Halftone id={ht} color="#9a6a3c" size={10} />
      </defs>
      <circle cx={150} cy={150} r={120} fill="#d8a76c" />
      <path d="M44 150 C40 70 110 34 150 36 C230 38 264 100 258 150 C250 176 232 160 214 176 C190 196 170 166 150 182 C126 200 104 170 84 186 C62 202 46 180 44 150 Z" fill={E.rose} />
      <circle cx={150} cy={150} r={120} fill={`url(#${ht})`} opacity={0.25} />
      {[
        [96, 96, 20],
        [150, 70, -30],
        [206, 100, 60],
        [90, 150, -60],
        [214, 150, 10],
        [130, 104, 80],
      ].map(([x, y, r], i) => (
        <rect key={i} x={x - 12} y={y - 4} width={24} height={8} rx={4} fill={i % 2 ? E.blue : E.cream} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <circle cx={150} cy={150} r={40} fill={E.paper} stroke={E.ink} strokeWidth={5} />
      <circle cx={150} cy={150} r={120} fill="none" stroke={E.ink} strokeWidth={5} />
    </svg>
  );
};

// Móvil con un feed que se desplaza (scroll 0..∞).
export const Phone: React.FC<Base & {readonly scroll?: number}> = ({width, scroll = 0, style}) => {
  const clip = useSafeId('phone');
  return (
    <svg width={width} height={width * 1.9} viewBox="0 0 240 456" style={svgStyle(style)}>
      <defs>
        <clipPath id={clip}>
          <rect x={18} y={40} width={204} height={376} rx={10} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={240} height={456} rx={34} fill={E.ink} />
      <rect x={18} y={40} width={204} height={376} rx={10} fill={E.cream} />
      <g clipPath={`url(#${clip})`}>
        {Array.from({length: 8}, (_, i) => {
          const y = 52 + ((i * 130 - scroll) % 1040 + 1040) % 1040 - 130;
          return (
            <g key={i}>
              <rect x={30} y={y} width={180} height={88} rx={8} fill={[E.blue, E.rose, E.sage, E.ochreLight][i % 4]} opacity={0.75} />
              <rect x={30} y={y + 96} width={120} height={10} rx={5} fill={E.mist} />
            </g>
          );
        })}
      </g>
      <rect x={96} y={16} width={48} height={8} rx={4} fill={E.slate} />
    </svg>
  );
};

export const Moon: React.FC<Base> = ({width, style}) => (
  <svg width={width} height={width} viewBox="0 0 200 200" style={svgStyle(style)}>
    <path d="M130 20 A85 85 0 1 0 180 140 A70 70 0 1 1 130 20 Z" fill={E.ochreLight} />
  </svg>
);

export const Sun: React.FC<Base & {readonly t?: number}> = ({width, t = 0, style}) => (
  <svg width={width} height={width} viewBox="0 0 200 200" style={svgStyle(style)}>
    <g transform={`rotate(${t * 0.4} 100 100)`}>
      {Array.from({length: 12}, (_, i) => (
        <path key={i} d="M100 8 L100 30" stroke={E.ochre} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 30} 100 100)`} />
      ))}
    </g>
    <circle cx={100} cy={100} r={52} fill={E.ochreLight} />
  </svg>
);

// Reloj; hours = hora (0..24) para las agujas.
export const Clock: React.FC<Base & {readonly hours: number; readonly dark?: boolean}> = ({width, hours, dark = false, style}) => {
  const ink = dark ? E.cream : E.ink;
  const ha = (hours % 12) * 30;
  const ma = (hours % 1) * 360;
  return (
    <svg width={width} height={width} viewBox="0 0 200 200" style={svgStyle(style)}>
      <circle cx={100} cy={100} r={88} fill={dark ? E.nightShade : E.cream} stroke={ink} strokeWidth={6} />
      {Array.from({length: 12}, (_, i) => (
        <path key={i} d="M100 22 L100 34" stroke={ink} strokeWidth={i % 3 ? 3 : 6} transform={`rotate(${i * 30} 100 100)`} />
      ))}
      <path d="M100 100 L100 56" stroke={ink} strokeWidth={8} strokeLinecap="round" transform={`rotate(${ha} 100 100)`} />
      <path d="M100 100 L100 36" stroke={E.ochre} strokeWidth={5} strokeLinecap="round" transform={`rotate(${ma} 100 100)`} />
      <circle cx={100} cy={100} r={8} fill={ink} />
    </svg>
  );
};

// Hoja de un estudio: líneas, gráfica de barras (sin datos inventados: solo forma).
export const StudyPage: React.FC<Base & {readonly draw: number; readonly mark?: number; readonly winner?: number}> = ({width, draw, mark = 0, winner = 0, style}) => {
  const ht = useSafeId('page');
  return (
    <svg width={width} height={(width * 760) / 580} viewBox="0 0 580 760" style={svgStyle(style)}>
      <defs>
        <Halftone id={ht} color={E.slate} size={9} />
      </defs>
      <rect x={0} y={0} width={580} height={760} fill={E.cream} />
      <text x={50} y={92} fontFamily={SERIF} fontSize={46} fill={E.ink}>
        Clinical study
      </text>
      <rect x={50} y={118} width={300} height={10} fill={E.mist} />
      {[170, 200, 230, 260].map((y, i) => (
        <rect key={y} x={50} y={y} width={i % 2 ? 440 : 480} height={10} fill="#d8d2c6" />
      ))}
      <rect x={44} y={222} width={460 * mark} height={22} fill={E.ochreLight} opacity={0.55} />
      <rect x={50} y={320} width={480} height={360} fill={`url(#${ht})`} opacity={0.12} />
      <path d="M90 340 L90 640 L510 640" fill="none" stroke={E.ink} strokeWidth={4} />
      {[0, 1, 2].map((i) => {
        const h = [190, 120, 80][i] * Math.max(0, Math.min(1, draw * 3 - i));
        return <rect key={i} x={140 + i * 120} y={640 - h} width={70} height={h} fill={i === 0 ? mixHex(E.slate, E.ochre, winner) : E.mist} />;
      })}
      <rect x={50} y={704} width={240} height={10} fill="#d8d2c6" />
    </svg>
  );
};

export const Magnifier: React.FC<Base> = ({width, style}) => (
  <svg width={width} height={width} viewBox="0 0 300 300" style={svgStyle(style)}>
    <path d="M190 190 L282 282" stroke={E.ink} strokeWidth={26} strokeLinecap="round" />
    <circle cx={120} cy={120} r={96} fill="#dfe8ee" fillOpacity={0.5} stroke={E.ink} strokeWidth={12} />
    <path d="M64 98 Q78 68 108 60" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" />
  </svg>
);

// Calendario semanal; state[i]: 0 vacío, 1 bien, 2 mal (tachado).
export const Week: React.FC<Base & {readonly state: number[]; readonly k?: number[]}> = ({width, state, k = [], style}) => {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <svg width={width} height={width * 0.36} viewBox="0 0 900 320" style={svgStyle(style)}>
      {days.map((d, i) => {
        const x = 10 + i * 126;
        const s = state[i] ?? 0;
        const kk = k[i] ?? 1;
        return (
          <g key={i}>
            <rect x={x} y={40} width={110} height={240} rx={10} fill={s === 1 ? E.ochreLight : E.cream} stroke={E.ink} strokeWidth={4} />
            <rect x={x} y={40} width={110} height={54} rx={10} fill={E.ink} />
            <text x={x + 55} y={78} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill={E.cream}>
              {d}
            </text>
            {s === 1 ? <path d={`M${x + 55} 140 a40 40 0 1 0 30 70 a32 32 0 1 1 -30 -70`} fill={E.ochre} opacity={kk} /> : null}
            {s === 2 ? (
              <path
                d={`M${x + 22} 128 L${x + 88} 250 M${x + 88} 128 L${x + 22} 250`}
                stroke={E.brick}
                strokeWidth={10}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - kk}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

// Fórmulas esqueléticas. morph 0 = tirosina, 1 = dopamina. draw 0..1 traza el anillo.
export const Molecule: React.FC<Base & {readonly morph: number; readonly draw?: number; readonly color?: string; readonly dark?: boolean}> = ({
  width,
  morph,
  draw = 1,
  color,
  dark = false,
  style,
}) => {
  const ink = color ?? (dark ? E.cream : E.ink);
  const cx = 200;
  const cy = 230;
  const r = 78;
  const v = Array.from({length: 6}, (_, k) => [cx + r * Math.cos((Math.PI / 3) * k), cy + r * Math.sin((Math.PI / 3) * k)]);
  const ring = `M${v.map((p) => p.join(' ')).join(' L')} Z`;
  const inner = [0, 2, 4].map((k) => {
    const a = v[k];
    const b = v[(k + 1) % 6];
    const s = 0.8;
    const ax = cx + (a[0] - cx) * s;
    const ay = cy + (a[1] - cy) * s;
    const bx = cx + (b[0] - cx) * s;
    const by = cy + (b[1] - cy) * s;
    return `M${ax} ${ay} L${bx} ${by}`;
  });
  const tyr = 1 - morph;
  const dop = morph;
  const txt = {fontFamily: SANS, fontWeight: 700, fontSize: 34, fill: ink} as const;
  return (
    <svg width={width} height={width * 0.62} viewBox="0 0 620 380" style={svgStyle(style)}>
      <g fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <path d={ring} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {inner.map((d) => (
          <path key={d} d={d} opacity={draw} />
        ))}
        <path d={`M${v[0][0]} ${v[0][1]} L350 190 L420 230`} opacity={draw} />
        {/* OH en para (ambas) */}
        <path d={`M${v[3][0]} ${v[3][1]} L60 230`} opacity={draw} />
        {/* dopamina: segundo OH y NH2 terminal */}
        <path d={`M${v[4][0]} ${v[4][1]} L120 92`} opacity={draw * dop} />
        <path d="M420 230 L490 190" opacity={draw * dop} />
        {/* tirosina: NH2 en alfa y COOH */}
        <path d="M420 230 L420 310" opacity={draw * tyr} />
        <path d="M420 230 L490 190" opacity={draw * tyr} />
      </g>
      <g opacity={draw}>
        <text x={58} y={242} textAnchor="end" {...txt}>
          HO
        </text>
        <text x={118} y={80} textAnchor="end" {...txt} opacity={dop}>
          HO
        </text>
        <text x={500} y={196} {...txt} opacity={dop}>
          NH₂
        </text>
        <text x={500} y={196} {...txt} opacity={tyr}>
          COOH
        </text>
        <text x={420} y={350} textAnchor="middle" {...txt} opacity={tyr}>
          NH₂
        </text>
      </g>
    </svg>
  );
};

// Hoja de té (teanina).
export const TeaLeaf: React.FC<Base> = ({width, style}) => (
  <svg width={width} height={width} viewBox="0 0 300 300" style={svgStyle(style)}>
    <path d="M40 260 C40 120 140 40 270 30 C262 170 180 260 40 260 Z" fill={E.sage} />
    <path d="M40 260 C120 190 190 120 262 40" fill="none" stroke={E.sageDeep} strokeWidth={6} />
    {[0.3, 0.5, 0.7].map((k) => (
      <path key={k} d={`M${40 + 222 * k} ${260 - 220 * k} l${-50} ${-10} M${40 + 222 * k} ${260 - 220 * k} l${14} ${46}`} stroke={E.sageDeep} strokeWidth={4} />
    ))}
    <path d="M40 260 C40 120 140 40 270 30 C262 170 180 260 40 260 Z" fill="none" stroke={E.ink} strokeWidth={4} />
  </svg>
);

// Rodiola: flores amarillas en racimo sobre tallo con hojas.
export const Rhodiola: React.FC<Base> = ({width, style}) => (
  <svg width={width} height={width * 1.2} viewBox="0 0 300 360" style={svgStyle(style)}>
    <path d="M150 350 L150 140" stroke={E.sageDeep} strokeWidth={10} />
    {[200, 250, 300].map((y, i) => (
      <g key={y}>
        <path d={`M150 ${y} C110 ${y - 10} 90 ${y - 40} 70 ${y - 50} C100 ${y - 54} 140 ${y - 40} 150 ${y}`} fill={E.sage} stroke={E.ink} strokeWidth={3} />
        <path d={`M150 ${y + 14} C190 ${y + 4} 210 ${y - 26} 230 ${y - 36} C200 ${y - 40} 160 ${y - 26} 150 ${y + 14}`} fill={E.sage} stroke={E.ink} strokeWidth={3} opacity={i === 2 ? 0 : 1} />
      </g>
    ))}
    {Array.from({length: 14}, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const rr = 30 + (i % 3) * 22;
      return <circle key={i} cx={150 + Math.cos(a) * rr} cy={110 + Math.sin(a) * rr * 0.7} r={16} fill={E.ochreLight} stroke={E.ink} strokeWidth={3} />;
    })}
    <circle cx={150} cy={110} r={18} fill={E.ochre} stroke={E.ink} strokeWidth={3} />
  </svg>
);

// Ficha de ingrediente (p. ej. B6).
export const Tile: React.FC<Base & {readonly symbol: string; readonly name: string; readonly color?: string}> = ({width, symbol, name, color = E.sage, style}) => (
  <svg width={width} height={width * 1.15} viewBox="0 0 260 300" style={svgStyle(style)}>
    <rect x={0} y={0} width={260} height={300} rx={8} fill={E.cream} stroke={E.ink} strokeWidth={5} />
    <rect x={0} y={0} width={260} height={18} fill={color} />
    <text x={130} y={180} textAnchor="middle" fontFamily={SERIF} fontSize={128} fill={E.ink}>
      {symbol}
    </text>
    <text x={130} y={260} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={3} fill={E.slate}>
      {name}
    </text>
  </svg>
);

// Sello circular de garantía.
export const Seal: React.FC<Base & {readonly t?: number}> = ({width, t = 0, style}) => {
  const id = useSafeId('seal');
  return (
    <svg width={width} height={width} viewBox="0 0 400 400" style={svgStyle(style)}>
      <defs>
        <path id={id} d="M200 200 m-140 0 a140 140 0 1 1 280 0 a140 140 0 1 1 -280 0" />
      </defs>
      <g transform={`rotate(${t * 0.3} 200 200)`}>
        {Array.from({length: 36}, (_, i) => (
          <path key={i} d="M200 6 L214 30 L186 30 Z" fill={E.blueDeep} transform={`rotate(${i * 10} 200 200)`} />
        ))}
        <circle cx={200} cy={200} r={176} fill={E.blueDeep} />
        <circle cx={200} cy={200} r={160} fill="none" stroke={E.cream} strokeWidth={3} />
        <text fontFamily={MONO} fontSize={26} letterSpacing={6} fill={E.cream}>
          <textPath href={`#${id}`} startOffset="0">
            MONEY-BACK GUARANTEE • MONEY-BACK GUARANTEE •
          </textPath>
        </text>
      </g>
      <text x={200} y={222} textAnchor="middle" fontFamily={SERIF} fontSize={108} fill={E.cream}>
        30
      </text>
      <text x={200} y={268} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={28} letterSpacing={8} fill={E.cream}>
        DAYS
      </text>
    </svg>
  );
};

// Desayuno: plato con tostada y huevo.
export const Breakfast: React.FC<Base> = ({width, style}) => (
  <svg width={width} height={width * 0.62} viewBox="0 0 400 250" style={svgStyle(style)}>
    <ellipse cx={200} cy={150} rx={190} ry={90} fill={E.cream} stroke={E.ink} strokeWidth={5} />
    <ellipse cx={200} cy={150} rx={140} ry={60} fill="none" stroke={E.mist} strokeWidth={4} />
    <path d="M110 100 Q110 70 150 72 L210 72 Q246 72 244 102 L240 180 L114 180 Z" fill="#d9a766" stroke={E.ink} strokeWidth={4} />
    <ellipse cx={280} cy={150} rx={62} ry={36} fill="#fff" stroke={E.ink} strokeWidth={4} />
    <circle cx={284} cy={146} r={18} fill={E.ochreLight} />
  </svg>
);

// Producto real (foto recortada del envase CTRL.).
export const Product: React.FC<Base> = ({width, style}) => (
  <Img src={staticFile('img/ctrl-product.png')} style={{width, height: (width * 1442) / 670, ...style}} />
);

// Flecha y signos sobrios.
export const Arrow: React.FC<Base & {readonly color?: string}> = ({width, color = E.ink, style}) => (
  <svg width={width} height={width * 0.4} viewBox="0 0 300 120" style={svgStyle(style)}>
    <path d="M10 60 L270 60 M220 18 L276 60 L220 102" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
