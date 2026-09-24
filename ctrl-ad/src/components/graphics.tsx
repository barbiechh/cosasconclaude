/**
 * Gráficos animados dibujados en código (SVG/CSS). No dependen de imágenes:
 * dan acción a los tramos explicativos. Todos reciben frames locales de su
 * escena y sus tiempos salen de cues del guion.
 */
import React from 'react';
import {Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_WEIGHT} from '../styles/tokens';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const font = {fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT} as const;

const usePop = (from: number, damping = 12) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame < from ? 0 : spring({frame: frame - from, fps, config: {damping, stiffness: 200, mass: 0.6}});
};

const visible = (frame: number, from: number, until?: number) => frame >= from && (until === undefined || frame < until);

const fadeOut = (frame: number, until?: number, len = 6) =>
  until === undefined ? 1 : interpolate(frame, [until - len, until], [1, 0], clamp);

// ---------------------------------------------------------------------------

/** Batería que se vacía (o se carga) entre dos frames. */
export const Battery: React.FC<{
  x: number; y: number; w?: number;
  enterAt: number; until?: number;
  from: number; to: number; changeFrom: number; changeTo: number;
}> = ({x, y, w = 300, enterAt, until, from, to, changeFrom, changeTo}) => {
  const frame = useCurrentFrame();
  const pop = usePop(enterAt);
  if (!visible(frame, enterAt, until)) return null;
  const level = interpolate(frame, [changeFrom, changeTo], [from, to], clamp);
  const color = level < 0.3 ? COLORS.red : level > 0.7 ? COLORS.green : COLORS.yellow;
  const h = w * 0.5;
  const shake = level < 0.2 ? Math.sin(frame * 2.3) * 3 : 0;
  return (
    <div style={{position: 'absolute', left: x + shake, top: y, transform: `scale(${pop})`, opacity: fadeOut(frame, until)}}>
      <svg width={w + 30} height={h + 60}>
        <rect x={4} y={4} width={w} height={h} rx={16} fill={COLORS.card} stroke={COLORS.ink} strokeWidth={8} />
        <rect x={w + 6} y={h * 0.3} width={20} height={h * 0.4} rx={5} fill={COLORS.ink} />
        <rect x={18} y={18} width={Math.max(0, (w - 28) * level)} height={h - 28} rx={8} fill={color} />
        <text x={w / 2 + 4} y={h + 52} textAnchor="middle" {...font} fontSize={44} fill={COLORS.ink}>
          {Math.round(level * 100)}%
        </text>
      </svg>
    </div>
  );
};

/** Calendario de escritorio cuyas hojas pasan rápido: "a year or two". */
export const CalendarFlip: React.FC<{x: number; y: number; enterAt: number; flipFrom: number; flipTo: number; until?: number}> = ({
  x, y, enterAt, flipFrom, flipTo, until,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(enterAt);
  if (!visible(frame, enterAt, until)) return null;
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const total = 24;
  const p = interpolate(frame, [flipFrom, flipTo], [0, total], clamp);
  const i = Math.min(total - 1, Math.floor(p));
  const flip = p - Math.floor(p);
  const year = i < 12 ? 'YEAR 1' : 'YEAR 2';
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 420, height: 440, transform: `scale(${pop}) rotate(-3deg)`, opacity: fadeOut(frame, until)}}>
      <div style={{position: 'absolute', inset: 0, background: COLORS.card, border: `6px solid ${COLORS.ink}`, borderRadius: 18, boxShadow: '0 14px 30px rgba(0,0,0,0.2)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 90, background: COLORS.red, borderRadius: '12px 12px 0 0', ...font, fontSize: 44, color: 'white', textAlign: 'center', lineHeight: '90px'}}>
        {year}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', ...font, fontSize: 150, color: COLORS.ink,
        transform: `perspective(700px) rotateX(${flip * 70}deg)`, transformOrigin: 'top', opacity: 1 - flip * 0.6}}>
        {months[i % 12]}
      </div>
      {[70, 175, 280].map((rx) => (
        <div key={rx} style={{position: 'absolute', top: -22, left: rx + 20, width: 22, height: 50, borderRadius: 11, background: COLORS.ink}} />
      ))}
    </div>
  );
};

/** Globo de diálogo cuyas letras se despegan y caen: se van las palabras. */
export const ScatterWord: React.FC<{text: string; x: number; y: number; enterAt: number; scatterAt: number; until?: number}> = ({
  text, x, y, enterAt, scatterAt, until,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(enterAt);
  if (!visible(frame, enterAt, until)) return null;
  const s = Math.max(0, frame - scatterAt);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${pop})`, opacity: fadeOut(frame, until)}}>
      <svg width={520} height={300} style={{position: 'absolute', left: 0, top: 0}}>
        <path d="M 30 20 H 490 Q 510 20 510 40 V 190 Q 510 210 490 210 H 170 L 110 270 L 120 210 H 30 Q 10 210 10 190 V 40 Q 10 20 30 20 Z"
          fill={COLORS.card} stroke={COLORS.ink} strokeWidth={7} />
      </svg>
      <div style={{position: 'absolute', left: 0, top: 58, width: 520, textAlign: 'center', whiteSpace: 'nowrap'}}>
        {[...text].map((c, i) => {
          const dir = random(`sc-${text}-${i}`) - 0.5;
          const fall = s * s * (0.6 + random(`sf-${text}-${i}`) * 0.8);
          return (
            <span key={i} style={{display: 'inline-block', ...font, fontSize: 96, color: COLORS.ink,
              transform: `translate(${dir * s * 14}px, ${fall}px) rotate(${dir * s * 18}deg)`,
              opacity: interpolate(s, [0, 22], [1, 0], clamp)}}>
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Estallido de trazos rojos en zigzag alrededor de un punto: el enojo. */
export const JaggedBurst: React.FC<{cx: number; cy: number; at: number; radius?: number; until?: number}> = ({cx, cy, at, radius = 300, until}) => {
  const frame = useCurrentFrame();
  if (!visible(frame, at, until)) return null;
  const local = frame - at;
  const grow = interpolate(local, [0, 5], [0.4, 1], clamp);
  const op = interpolate(local, [0, 2, 28, 40], [0, 1, 1, 0], clamp);
  const rays = 10;
  return (
    <svg width={radius * 2.6} height={radius * 2.6} style={{position: 'absolute', left: cx - radius * 1.3, top: cy - radius * 1.3, opacity: op}}>
      {Array.from({length: rays}, (_, i) => {
        const a = (i / rays) * Math.PI * 2 + 0.2;
        const r0 = radius * 0.78 * grow;
        const r1 = radius * 1.18 * grow;
        const c = radius * 1.3;
        const pts = [0, 1, 2, 3].map((k) => {
          const r = r0 + ((r1 - r0) * k) / 3;
          const off = (k % 2 ? 1 : -1) * 0.07;
          return `${c + Math.cos(a + off) * r},${c + Math.sin(a + off) * r}`;
        });
        return <polyline key={i} points={pts.join(' ')} fill="none" stroke={COLORS.red} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Hoja de análisis hormonal con barras; una lupa la recorre. */
export const LabReport: React.FC<{x: number; y: number; enterAt: number; sweepFrom: number; sweepTo: number; until?: number}> = ({
  x, y, enterAt, sweepFrom, sweepTo, until,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(enterAt, 14);
  if (!visible(frame, enterAt, until)) return null;
  const rows = [
    {name: 'ESTROGEN', v: 0.35, flag: '↓'},
    {name: 'PROGESTERONE', v: 0.45, flag: '↓'},
    {name: 'FSH', v: 0.85, flag: '↑'},
    {name: 'LH', v: 0.7, flag: '↑'},
  ];
  const sweep = Easing.inOut(Easing.quad)(interpolate(frame, [sweepFrom, sweepTo], [0, 1], clamp));
  const lensY = 150 + sweep * 300;
  const lensX = 90 + Math.sin(sweep * Math.PI * 2) * 170 + 170;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 760, height: 620, transform: `scale(${pop}) rotate(2deg)`, opacity: fadeOut(frame, until)}}>
      <div style={{position: 'absolute', inset: 0, background: COLORS.card, border: `3px solid ${COLORS.inkSoft}`, boxShadow: '0 14px 30px rgba(0,0,0,0.2)'}} />
      <div style={{position: 'absolute', left: 40, top: 30, ...font, fontSize: 46, color: COLORS.ink}}>HORMONE PANEL</div>
      <div style={{position: 'absolute', left: 40, top: 92, right: 40, height: 4, background: COLORS.ink}} />
      {rows.map((r, i) => {
        const grow = interpolate(frame, [enterAt + 6 + i * 4, enterAt + 18 + i * 4], [0, 1], clamp);
        return (
          <div key={r.name} style={{position: 'absolute', left: 40, top: 130 + i * 110, width: 680}}>
            <div style={{...font, fontSize: 32, color: COLORS.inkSoft}}>{r.name}</div>
            <div style={{position: 'absolute', left: 0, top: 48, width: 560, height: 30, background: '#e6e1d4', borderRadius: 6}} />
            <div style={{position: 'absolute', left: 0, top: 48, width: 560 * r.v * grow, height: 30, background: r.flag === '↓' ? COLORS.red : COLORS.inkSoft, borderRadius: 6}} />
            <div style={{position: 'absolute', left: 590, top: 30, ...font, fontSize: 54, color: r.flag === '↓' ? COLORS.red : COLORS.ink}}>{r.flag}</div>
          </div>
        );
      })}
      {frame >= sweepFrom && (
        <svg width={300} height={300} style={{position: 'absolute', left: lensX - 110, top: lensY - 110}}>
          <circle cx={110} cy={110} r={92} fill="rgba(255,255,255,0.25)" stroke={COLORS.ink} strokeWidth={14} />
          <line x1={176} y1={176} x2={280} y2={280} stroke={COLORS.ink} strokeWidth={30} strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

/** Esqueleto de la molécula de estrógeno (tres hexágonos y un pentágono) que se dibuja. */
export const EstrogenMolecule: React.FC<{x: number; y: number; drawFrom: number; until?: number; scale?: number}> = ({x, y, drawFrom, until, scale = 1}) => {
  const frame = useCurrentFrame();
  if (!visible(frame, drawFrom, until)) return null;
  const draw = interpolate(frame, [drawFrom, drawFrom + 22], [0, 1], clamp);
  const hex = (cx: number, cy: number, r = 46) =>
    Array.from({length: 6}, (_, i) => {
      const a = Math.PI / 6 + (i * Math.PI) / 3;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
  const pent = (cx: number, cy: number, r = 42) =>
    Array.from({length: 5}, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5 + 0.3;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(' ');
  const common = {fill: 'none', stroke: COLORS.ink, strokeWidth: 7, strokeLinejoin: 'round' as const, pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - draw};
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${scale})`, transformOrigin: 'top left', opacity: fadeOut(frame, until)}}>
      <svg width={460} height={300}>
        <polygon points={hex(70, 170)} {...common} />
        <polygon points={hex(150, 124)} {...common} />
        <polygon points={hex(230, 170)} {...common} />
        <polygon points={pent(312, 128)} {...common} />
        <line x1={20} y1={196} x2={-10} y2={214} {...common} />
        <text x={0} y={250} {...font} fontSize={30} fill={COLORS.inkSoft} opacity={draw}>HO</text>
        <line x1={336} y1={90} x2={356} y2={50} {...common} />
        <text x={344} y={40} {...font} fontSize={30} fill={COLORS.inkSoft} opacity={draw}>OH</text>
      </svg>
      <div style={{...font, fontSize: 52, color: COLORS.ink, marginTop: -10, opacity: draw}}>ESTROGEN</div>
    </div>
  );
};

/** Sello de goma que cae con golpe. */
export const Stamp: React.FC<{text: string; x: number; y: number; at: number; until?: number; rotate?: number; color?: string}> = ({
  text, x, y, at, until, rotate = -12, color = COLORS.red,
}) => {
  const frame = useCurrentFrame();
  if (!visible(frame, at, until)) return null;
  const k = interpolate(frame - at, [0, 5, 8], [2.4, 0.94, 1], clamp);
  const op = interpolate(frame - at, [0, 3], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${k}) rotate(${rotate}deg)`, opacity: op * fadeOut(frame, until),
      border: `8px solid ${color}`, borderRadius: 14, padding: '6px 26px', ...font, fontSize: 70, color, letterSpacing: 2, background: 'rgba(251,250,246,0.6)'}}>
      {text}
    </div>
  );
};

/** Partículas de dopamina: brotan de un punto (o convergen hacia él). */
export const DopamineParticles: React.FC<{
  cx: number; cy: number; from: number; until?: number; mode?: 'out' | 'in'; count?: number; spread?: number; rate?: number;
}> = ({cx, cy, from, until, mode = 'out', count = 26, spread = 430, rate = 1}) => {
  const frame = useCurrentFrame();
  if (!visible(frame, from, until)) return null;
  const local = (frame - from) * rate;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: fadeOut(frame, until, 8), overflow: 'visible'}}>
      {Array.from({length: count}, (_, i) => {
        const a = random(`da-${i}`) * Math.PI * 2;
        const delay = random(`dd-${i}`) * 24;
        const life = ((local - delay) % 40 + 40) % 40;
        if (local < delay) return null;
        const u = life / 40;
        const d = mode === 'out' ? u * spread : (1 - u) * spread;
        const px = cx + Math.cos(a) * d;
        const py = cy + Math.sin(a) * d * 0.8;
        const r = 12 + random(`dr-${i}`) * 10;
        const op = mode === 'out' ? 1 - u : u;
        return (
          <g key={i} opacity={op}>
            <circle cx={px} cy={py} r={r} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={3} />
            {i % 4 === 0 && <text x={px} y={py + 8} textAnchor="middle" {...font} fontSize={20} fill={COLORS.ink}>DA</text>}
          </g>
        );
      })}
    </svg>
  );
};

type IconKind = 'focus' | 'drive' | 'follow' | 'words';

const Icon: React.FC<{kind: IconKind; size: number}> = ({kind, size}) => {
  const s = size;
  const st = {fill: 'none', stroke: COLORS.ink, strokeWidth: s * 0.07, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  if (kind === 'focus')
    return (
      <svg width={s} height={s}>
        <circle cx={s / 2} cy={s / 2} r={s * 0.38} {...st} />
        <circle cx={s / 2} cy={s / 2} r={s * 0.22} {...st} />
        <circle cx={s / 2} cy={s / 2} r={s * 0.06} fill={COLORS.red} />
      </svg>
    );
  if (kind === 'drive')
    return (
      <svg width={s} height={s}>
        <path d={`M ${s * 0.2} ${s * 0.75} L ${s * 0.75} ${s * 0.2}`} {...st} />
        <path d={`M ${s * 0.42} ${s * 0.2} H ${s * 0.78} V ${s * 0.56}`} {...st} />
      </svg>
    );
  if (kind === 'words')
    return (
      <svg width={s} height={s}>
        <path d={`M ${s * 0.15} ${s * 0.2} H ${s * 0.85} V ${s * 0.65} H ${s * 0.45} L ${s * 0.28} ${s * 0.82} V ${s * 0.65} H ${s * 0.15} Z`} {...st} />
      </svg>
    );
  return (
    <svg width={s} height={s}>
      <path d={`M ${s * 0.18} ${s * 0.52} L ${s * 0.42} ${s * 0.75} L ${s * 0.84} ${s * 0.26}`} {...st} />
    </svg>
  );
};

/** Ficha redonda con ícono y nombre (focus / drive / follow-through). */
export const IconChip: React.FC<{
  kind: IconKind; label: string; x: number; y: number; enterAt: number; until?: number;
  flyOutAt?: number; checked?: number; fromX?: number; fromY?: number;
}> = ({kind, label, x, y, enterAt, until, flyOutAt, checked, fromX = 0, fromY = 0}) => {
  const frame = useCurrentFrame();
  const pop = usePop(enterAt, 10);
  if (!visible(frame, enterAt, until)) return null;
  const fly = flyOutAt === undefined ? 0 : interpolate(frame, [flyOutAt, flyOutAt + 14], [0, 1], clamp);
  const flyEase = fly * fly;
  const tx = (1 - pop) * fromX + flyEase * (x < 540 ? -700 : 700);
  const ty = (1 - pop) * fromY + flyEase * 500;
  const check = checked === undefined ? 0 : interpolate(frame, [checked, checked + 6], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 240, textAlign: 'center',
      transform: `translate(${tx}px, ${ty}px) rotate(${flyEase * 60}deg) scale(${Math.max(0.01, pop)})`, opacity: 1 - fly * 0.8}}>
      <div style={{width: 190, height: 190, margin: '0 auto', borderRadius: '50%', background: COLORS.card, border: `7px solid ${COLORS.ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 22px rgba(0,0,0,0.18)', position: 'relative'}}>
        <Icon kind={kind} size={130} />
        {check > 0 && (
          <div style={{position: 'absolute', right: -14, top: -14, width: 76, height: 76, borderRadius: '50%', background: COLORS.green,
            transform: `scale(${check})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', ...font, fontSize: 48}}>✓</div>
        )}
      </div>
      <div style={{...font, fontSize: 40, color: COLORS.ink, marginTop: 14}}>{label}</div>
    </div>
  );
};

/**
 * Gráfica en vivo: la línea de estrógeno se dibuja, cae ("doesn't just drop"),
 * luego parpadea en zigzag ("it flickers"); la de dopamina aparece y cae con
 * ella ("dopamine dips with it").
 */
export const HormoneChart: React.FC<{
  x: number; y: number; appearAt: number; dropAt: number; flickerAt: number;
  estrogenDipAt: number; dopamineAt: number; dopamineDipAt: number; until?: number;
}> = ({x, y, appearAt, dropAt, flickerAt, estrogenDipAt, dopamineAt, dopamineDipAt, until}) => {
  const frame = useCurrentFrame();
  if (!visible(frame, appearAt, until)) return null;
  const W = 880;
  const H = 440;
  const reveal = interpolate(frame, [appearAt, appearAt + 30], [0.05, 1], clamp);
  const drop = interpolate(frame, [dropAt, dropAt + 10], [0, 1], clamp);
  const flicker = interpolate(frame, [flickerAt, flickerAt + 6], [0, 1], clamp);
  const eDip = interpolate(frame, [estrogenDipAt, estrogenDipAt + 6, estrogenDipAt + 22], [0, 1, 0.3], clamp);
  const dShow = interpolate(frame, [dopamineAt, dopamineAt + 12], [0, 1], clamp);
  const dDip = interpolate(frame, [dopamineDipAt, dopamineDipAt + 6], [0, 1], clamp);

  const estrogen = (u: number) => {
    let v = 0.25; // alto = arriba
    if (u > 0.35) v += drop * (u - 0.35) * 0.55;
    v += flicker * Math.sin(u * 60 + frame * 1.7) * 0.11 * (u > 0.35 ? 1 : 0.2);
    v += eDip * Math.exp(-Math.pow((u - 0.78) / 0.07, 2)) * 0.3;
    return v;
  };
  const dopamine = (u: number) => estrogen(u) + 0.14 + dDip * Math.exp(-Math.pow((u - 0.8) / 0.08, 2)) * 0.32;
  const path = (fn: (u: number) => number, upto: number) =>
    Array.from({length: 90}, (_, i) => i / 89)
      .filter((u) => u <= upto)
      .map((u, i) => `${i ? 'L' : 'M'} ${40 + u * (W - 60)} ${20 + Math.min(0.98, fn(u)) * (H - 40)}`)
      .join(' ');

  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, height: H, opacity: fadeOut(frame, until)}}>
      <div style={{position: 'absolute', inset: 0, background: COLORS.card, border: `4px solid ${COLORS.ink}`, boxShadow: '0 14px 30px rgba(0,0,0,0.18)'}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={30} x2={W - 20} y1={H * g} y2={H * g} stroke="#ddd6c6" strokeWidth={2} strokeDasharray="8 10" />
        ))}
        <path d={path(estrogen, reveal)} fill="none" stroke={COLORS.inkSoft} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        {dShow > 0 && (
          <path d={path(dopamine, reveal)} fill="none" stroke={COLORS.red} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" opacity={dShow} />
        )}
      </svg>
      <div style={{position: 'absolute', left: 30, top: -64, ...font, fontSize: 40, color: COLORS.inkSoft}}>estrogen</div>
      <div style={{position: 'absolute', right: 30, top: -64, ...font, fontSize: 40, color: COLORS.red, opacity: dShow}}>dopamine</div>
    </div>
  );
};

/** Foco dibujado: brilla, y parpadea en "flickers". */
export const LightBulb: React.FC<{x: number; y: number; enterAt: number; flickerAt: number; size?: number; until?: number}> = ({
  x, y, enterAt, flickerAt, size = 300, until,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(enterAt);
  if (!visible(frame, enterAt, until)) return null;
  const local = frame - flickerAt;
  const pattern = [1, 0.05, 0.9, 0.1, 0.2, 1, 0.05, 0.7, 0.15, 1, 0.3, 0.9];
  // Después del parpadeo principal sigue fallando de vez en cuando.
  const glow = local < 0 ? 1 : local < pattern.length * 2 ? pattern[Math.floor(local / 2)] : (Math.floor(frame / 5) % 7 === 0 ? 0.25 : 0.85);
  const s = size;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${pop})`, opacity: fadeOut(frame, until)}}>
      <div style={{position: 'absolute', left: -s * 0.5, top: -s * 0.45, width: s * 2, height: s * 2, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(244,201,58,${0.75 * glow}) 0%, rgba(244,201,58,0) 60%)`}} />
      <svg width={s} height={s * 1.35} style={{position: 'relative'}}>
        <path d={`M ${s * 0.5} ${s * 0.05} C ${s * 0.1} ${s * 0.05} ${s * 0.02} ${s * 0.5} ${s * 0.3} ${s * 0.72} L ${s * 0.32} ${s * 0.9} H ${s * 0.68} L ${s * 0.7} ${s * 0.72} C ${s * 0.98} ${s * 0.5} ${s * 0.9} ${s * 0.05} ${s * 0.5} ${s * 0.05} Z`}
          fill={glow > 0.5 ? '#fff4c2' : '#e8e4d8'} stroke={COLORS.ink} strokeWidth={8} />
        <path d={`M ${s * 0.4} ${s * 0.7} L ${s * 0.44} ${s * 0.45} L ${s * 0.5} ${s * 0.55} L ${s * 0.56} ${s * 0.45} L ${s * 0.6} ${s * 0.7}`}
          fill="none" stroke={glow > 0.5 ? COLORS.red : COLORS.inkSoft} strokeWidth={6} strokeLinejoin="round" />
        {[0.95, 1.05, 1.15].map((k) => (
          <rect key={k} x={s * 0.33} y={s * k - s * 0.03} width={s * 0.34} height={s * 0.07} rx={s * 0.03} fill={COLORS.inkSoft} />
        ))}
      </svg>
    </div>
  );
};

/** Niebla: bancos blancos que se deslizan; en liftAt se abren hacia los lados. */
export const FogLayer: React.FC<{from: number; liftAt?: number; top?: number; height?: number; until?: number}> = ({
  from, liftAt, top = 380, height = 1000, until,
}) => {
  const frame = useCurrentFrame();
  if (!visible(frame, from, until)) return null;
  const inOp = interpolate(frame, [from, from + 12], [0, 1], clamp);
  const lift = liftAt === undefined ? 0 : Easing.in(Easing.quad)(interpolate(frame, [liftAt, liftAt + 26], [0, 1], clamp));
  return (
    <div style={{position: 'absolute', left: 0, top, width: 1080, height, opacity: inOp * (1 - lift), pointerEvents: 'none'}}>
      {Array.from({length: 9}, (_, i) => {
        const bx = random(`fx-${i}`) * 1080 - 200;
        const by = random(`fy-${i}`) * (height - 300);
        const w = 500 + random(`fw-${i}`) * 400;
        const drift = Math.sin(frame / 40 + i) * 40 + (frame - from) * (i % 2 ? 0.6 : -0.6);
        const side = bx + w / 2 < 540 ? -1 : 1;
        return (
          <div key={i} style={{position: 'absolute', left: bx + drift + side * lift * 900, top: by, width: w, height: w * 0.55, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(252,252,250,0.95) 0%, rgba(252,252,250,0.7) 45%, rgba(252,252,250,0) 72%)'}} />
        );
      })}
    </div>
  );
};

/** Medidor vertical que se llena. */
export const Meter: React.FC<{x: number; y: number; label: string; enterAt: number; fillFrom: number; fillTo: number; until?: number}> = ({
  x, y, label, enterAt, fillFrom, fillTo, until,
}) => {
  const frame = useCurrentFrame();
  const pop = usePop(enterAt);
  if (!visible(frame, enterAt, until)) return null;
  const level = Easing.out(Easing.cubic)(interpolate(frame, [fillFrom, fillTo], [0.08, 1], clamp));
  const H = 560;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${pop})`, opacity: fadeOut(frame, until)}}>
      <div style={{position: 'relative', width: 120, height: H, border: `7px solid ${COLORS.ink}`, borderRadius: 60, background: COLORS.card, overflow: 'hidden'}}>
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: H * level, background: COLORS.yellow}} />
      </div>
      <div style={{...font, fontSize: 34, color: COLORS.ink, textAlign: 'center', marginTop: 12, width: 120}}>{label}</div>
      <div style={{position: 'absolute', left: 140, top: H * (1 - level) - 20, ...font, fontSize: 44, color: COLORS.ink}}>{Math.round(level * 100)}%</div>
    </div>
  );
};

/** Línea nerviosa (zigzag rojo) que se calma en una onda suave: la paciencia vuelve. */
export const CalmLine: React.FC<{x: number; y: number; from: number; calmAt: number; until?: number}> = ({x, y, from, calmAt, until}) => {
  const frame = useCurrentFrame();
  if (!visible(frame, from, until)) return null;
  const calm = interpolate(frame, [calmAt, calmAt + 20], [0, 1], clamp);
  const W = 860;
  const d = Array.from({length: 120}, (_, i) => {
    const u = i / 119;
    const jag = (random(`cl-${i}-${Math.floor(frame / 2)}`) - 0.5) * 120 * (1 - calm);
    const wave = Math.sin(u * Math.PI * 4 + frame / 6) * 36 * calm;
    return `${i ? 'L' : 'M'} ${u * W} ${90 + jag + wave}`;
  }).join(' ');
  const color = calm > 0.5 ? COLORS.green : COLORS.red;
  return (
    <svg width={W} height={180} style={{position: 'absolute', left: x, top: y, opacity: interpolate(frame, [from, from + 6], [0, 1], clamp) * fadeOut(frame, until)}}>
      <path d={d} fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};
