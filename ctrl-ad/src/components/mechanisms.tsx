/**
 * Mecanismos dibujados en código. Son presentacionales: reciben su estado
 * (ángulo, nivel, progreso...) y la escena decide cuándo cambia, a partir de
 * los cues del guion. Mismo objeto = misma forma y color en todo el video.
 */
import React from 'react';
import {random} from 'remotion';
import {COLORS} from '../styles/tokens';
import {Pt, bezier, font} from './kit';

const abs = (x: number, y: number, w: number, h: number): React.CSSProperties => ({position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h});

/** Diana del foco + cursor amarillo. `cursor` = desplazamiento del cursor desde el centro. */
export const Target: React.FC<{cx: number; cy: number; r: number; cursor: Pt; lock: number; cursorOpacity?: number; grey?: number}> = ({
  cx, cy, r, cursor, lock, cursorOpacity = 1, grey = 0,
}) => {
  const ink = grey > 0.5 ? COLORS.grey : COLORS.ink;
  const [dx, dy] = cursor;
  const cr = r * 0.26;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <circle cx={cx} cy={cy} r={r} fill={COLORS.card} stroke={ink} strokeWidth={12} />
      <circle cx={cx} cy={cy} r={r * 0.64} fill="none" stroke={ink} strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r * 0.28} fill={lock > 0 ? `rgba(244,201,58,${0.4 + 0.6 * lock})` : 'none'} stroke={ink} strokeWidth={10} />
      <circle cx={cx} cy={cy} r={r * 0.07} fill={grey > 0.5 ? COLORS.grey : COLORS.red} />
      {lock > 0 && <circle cx={cx} cy={cy} r={r * (1 + 0.25 * lock)} fill="none" stroke={COLORS.yellow} strokeWidth={8} opacity={1 - lock * 0.6} />}
      <g transform={`translate(${cx + dx}, ${cy + dy})`} opacity={cursorOpacity}>
        <circle r={cr} fill="rgba(244,201,58,0.25)" stroke={COLORS.ink} strokeWidth={14} />
        <circle r={cr} fill="none" stroke={COLORS.yellow} strokeWidth={8} />
        {[0, 90, 180, 270].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1={cr + 6} x2={cr + 34} y1={0} y2={0} stroke={COLORS.ink} strokeWidth={14} strokeLinecap="round" />
            <line x1={cr + 6} x2={cr + 34} y1={0} y2={0} stroke={COLORS.yellow} strokeWidth={7} strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** Línea de texto que se escribe letra a letra; `shown` = letras visibles (puede bajar: se borran). */
export const TypeLine: React.FC<{cx: number; cy: number; w: number; text: string; shown: number; caret: boolean; smudge?: number; size?: number; color?: string}> = ({
  cx, cy, w, text, shown, caret, smudge = 0, size = 150, color = COLORS.ink,
}) => {
  const n = Math.max(0, Math.min(text.length, Math.floor(shown)));
  const h = size * 1.5;
  return (
    <div style={{...abs(cx, cy, w, h)}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 10, height: 8, background: COLORS.ink, borderRadius: 4, opacity: 0.85}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: size, color, letterSpacing: 6}}>
        <span>{text.slice(0, n)}</span>
        <span style={{display: 'inline-block', width: size * 0.09, height: size * 0.95, marginLeft: 8, background: COLORS.yellow, border: `4px solid ${COLORS.ink}`, opacity: caret ? 1 : 0}} />
        {/* letras que faltan: huecos punteados */}
        <span style={{color: 'transparent', WebkitTextStroke: `3px ${COLORS.greyLight}`, marginLeft: 8, opacity: 0.8}}>{text.slice(n)}</span>
      </div>
      {smudge > 0 && (
        <div style={{position: 'absolute', left: '8%', right: '8%', top: '30%', height: '40%', borderRadius: 60,
          background: 'radial-gradient(ellipse, rgba(200,194,182,0.75) 0%, rgba(200,194,182,0) 70%)', opacity: smudge}} />
      )}
    </div>
  );
};

const gearPath = (r: number, teeth: number) => {
  const pts: string[] = [];
  const ro = r;
  const ri = r * 0.8;
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = a0 + (Math.PI * 2) / teeth * 0.18;
    const a2 = a0 + (Math.PI * 2) / teeth * 0.5;
    const a3 = a0 + (Math.PI * 2) / teeth * 0.68;
    const p = (a: number, rr: number) => `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
    pts.push(`${i ? 'L' : 'M'} ${p(a0, ri)} L ${p(a1, ro)} L ${p(a2, ro)} L ${p(a3, ri)}`);
  }
  return pts.join(' ') + ' Z';
};

/** Engranaje (el empuje). */
export const Gear: React.FC<{cx: number; cy: number; r: number; angle: number; teeth?: number; color?: string; grey?: boolean}> = ({
  cx, cy, r, angle, teeth = 10, color = COLORS.yellow, grey = false,
}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
      <path d={gearPath(r, teeth)} fill={grey ? COLORS.greyLight : color} stroke={COLORS.ink} strokeWidth={10} strokeLinejoin="round" />
      <circle r={r * 0.42} fill={COLORS.card} stroke={COLORS.ink} strokeWidth={10} />
      <circle r={r * 0.12} fill={COLORS.ink} />
      <line x1={0} y1={-r * 0.42} x2={0} y2={-r * 0.7} stroke={COLORS.ink} strokeWidth={10} />
    </g>
  </svg>
);

/** Barra de progreso. */
export const Bar: React.FC<{cx: number; cy: number; w: number; h?: number; value: number; color: string}> = ({cx, cy, w, h = 64, value, color}) => (
  <div style={{...abs(cx, cy, w, h), border: `7px solid ${COLORS.ink}`, borderRadius: h / 2, background: COLORS.card, overflow: 'hidden', boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color, borderRight: value > 0.01 ? `6px solid ${COLORS.ink}` : undefined}} />
  </div>
);

/** Flecha dibujada de a hacia b; t = cuánto se ha trazado. */
export const Arrow: React.FC<{a: Pt; b: Pt; t: number; color?: string; width?: number; bend?: number; opacity?: number}> = ({
  a, b, t, color = COLORS.ink, width = 12, bend = 0, opacity = 1,
}) => {
  if (t <= 0) return null;
  const mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * bend;
  const my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * bend;
  const q = (u: number) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * my + u * u * b[1]];
  const tip = q(t);
  const pre = q(Math.max(0, t - 0.04));
  const ang = Math.atan2(tip[1] - pre[1], tip[0] - pre[0]);
  const hl = width * 3.2;
  const h1 = [tip[0] - Math.cos(ang - 0.5) * hl, tip[1] - Math.sin(ang - 0.5) * hl];
  const h2 = [tip[0] - Math.cos(ang + 0.5) * hl, tip[1] - Math.sin(ang + 0.5) * hl];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
      <path d={`M ${a} Q ${mx} ${my} ${b}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      <path d={`M ${h1} L ${tip} L ${h2}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/** Grieta roja en zigzag (la ruptura). */
export const Crack: React.FC<{cx: number; top: number; bottom: number; t: number; opacity?: number}> = ({cx, top, bottom, t, opacity = 1}) => {
  if (t <= 0) return null;
  const n = 9;
  const d = Array.from({length: n + 1}, (_, i) => {
    const y = top + ((bottom - top) * i) / n;
    const x = cx + (i % 2 ? 1 : -1) * (26 + random(`ck-${i}`) * 30);
    return `${i ? 'L' : 'M'} ${x.toFixed(0)} ${y.toFixed(0)}`;
  }).join(' ');
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
      <path d={d} fill="none" stroke={COLORS.ink} strokeWidth={24} strokeLinejoin="miter" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
      <path d={d} fill="none" stroke={COLORS.red} strokeWidth={14} strokeLinejoin="miter" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    </svg>
  );
};

/** Partículas de dopamina que viajan por una curva. `t` = frame local de la escena. */
export const Flow: React.FC<{path: [Pt, Pt, Pt, Pt]; t: number; count?: number; speed?: number; size?: number; color?: string; opacity?: number; spread?: number; seed?: string}> = ({
  path, t, count = 12, speed = 40, size = 20, color = COLORS.yellow, opacity = 1, spread = 16, seed = 'fl',
}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
    {Array.from({length: count}, (_, i) => {
      const u = (((t + (i * speed) / count) % speed) + speed) % speed / speed;
      const p = bezier(...path, u);
      const off = (random(`${seed}-${i}`) - 0.5) * spread * 2;
      const fade = Math.min(1, u * 6, (1 - u) * 6);
      return <circle key={i} cx={p.x + off} cy={p.y - off} r={size * (0.75 + random(`${seed}s-${i}`) * 0.5)} fill={color} stroke={COLORS.ink} strokeWidth={4} opacity={fade} />;
    })}
  </svg>
);

/** Niebla sobre una zona: `amount` 0..1, `lift` la levanta y la abre. */
export const Fog: React.FC<{x: number; y: number; w: number; h: number; amount: number; lift?: number; t: number}> = ({x, y, w, h, amount, lift = 0, t}) => {
  if (amount <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: amount * (1 - lift), pointerEvents: 'none'}}>
      {Array.from({length: 8}, (_, i) => {
        const bw = w * (0.55 + random(`fg-w${i}`) * 0.4);
        const bx = random(`fg-x${i}`) * (w - bw * 0.5) - bw * 0.25;
        const by = random(`fg-y${i}`) * (h - bw * 0.4);
        const drift = Math.sin(t / 35 + i * 1.7) * 30;
        const side = bx + bw / 2 < w / 2 ? -1 : 1;
        return (
          <div key={i} style={{position: 'absolute', left: bx + drift + side * lift * w * 0.8, top: by - lift * 260, width: bw, height: bw * 0.55, borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(250,250,248,0.96) 0%, rgba(245,245,242,0.75) 45%, rgba(245,245,242,0) 72%)'}} />
        );
      })}
    </div>
  );
};

/** Foco (la luz del interruptor). glow 0..1. */
export const Bulb: React.FC<{cx: number; cy: number; size: number; glow: number}> = ({cx, cy, size: s, glow}) => (
  <div style={{position: 'absolute', left: cx - s / 2, top: cy - s * 0.55}}>
    <div style={{position: 'absolute', left: -s * 0.6, top: -s * 0.55, width: s * 2.2, height: s * 2.2, borderRadius: '50%',
      background: `radial-gradient(circle, rgba(244,201,58,${0.8 * glow}) 0%, rgba(244,201,58,${0.25 * glow}) 38%, rgba(244,201,58,0) 62%)`}} />
    <svg width={s} height={s * 1.35} style={{position: 'relative', overflow: 'visible'}}>
      <path d={`M ${s * 0.5} ${s * 0.05} C ${s * 0.1} ${s * 0.05} ${s * 0.02} ${s * 0.5} ${s * 0.3} ${s * 0.72} L ${s * 0.32} ${s * 0.9} H ${s * 0.68} L ${s * 0.7} ${s * 0.72} C ${s * 0.98} ${s * 0.5} ${s * 0.9} ${s * 0.05} ${s * 0.5} ${s * 0.05} Z`}
        fill={glow > 0.5 ? '#fff2b8' : '#dedad0'} stroke={COLORS.ink} strokeWidth={9} />
      <path d={`M ${s * 0.4} ${s * 0.7} L ${s * 0.44} ${s * 0.45} L ${s * 0.5} ${s * 0.55} L ${s * 0.56} ${s * 0.45} L ${s * 0.6} ${s * 0.7}`}
        fill="none" stroke={glow > 0.5 ? COLORS.red : COLORS.grey} strokeWidth={7} strokeLinejoin="round" />
      {[0.95, 1.05, 1.15].map((k) => (
        <rect key={k} x={s * 0.33} y={s * k - s * 0.03} width={s * 0.34} height={s * 0.07} rx={s * 0.03} fill={COLORS.inkSoft} />
      ))}
    </svg>
  </div>
);

/** Rayos que salen de un punto (brillo / revelación). */
export const Rays: React.FC<{cx: number; cy: number; r0: number; r1: number; t: number; n?: number; color?: string; spin?: number}> = ({
  cx, cy, r0, r1, t, n = 14, color = COLORS.yellow, spin = 0,
}) => {
  if (t <= 0) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(1, t * 1.5)}}>
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 + spin;
        const ra = r0 + (r1 - r0) * 0.15;
        const rb = r0 + (r1 - r0) * t;
        return <line key={i} x1={cx + Math.cos(a) * ra} y1={cy + Math.sin(a) * ra} x2={cx + Math.cos(a) * rb} y2={cy + Math.sin(a) * rb}
          stroke={color} strokeWidth={16} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Palomita dibujada. */
export const Check: React.FC<{cx: number; cy: number; size: number; t: number; color?: string; disc?: boolean}> = ({cx, cy, size, t, color = COLORS.green, disc = true}) => {
  if (t <= 0) return null;
  const s = size;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {disc && <circle cx={cx} cy={cy} r={s * 0.55 * Math.min(1, t * 2)} fill={color} stroke={COLORS.ink} strokeWidth={6} />}
      <path d={`M ${cx - s * 0.26} ${cy + s * 0.02} L ${cx - s * 0.06} ${cy + s * 0.22} L ${cx + s * 0.3} ${cy - s * 0.22}`} fill="none"
        stroke={disc ? 'white' : color} strokeWidth={s * 0.13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, t * 1.6 - 0.4))} />
    </svg>
  );
};

/** Tachón rojo en X. */
export const Cross: React.FC<{cx: number; cy: number; size: number; t: number}> = ({cx, cy, size, t}) => {
  if (t <= 0) return null;
  const s = size / 2;
  const a = Math.min(1, t * 2);
  const b = Math.max(0, Math.min(1, t * 2 - 1));
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M ${cx - s} ${cy - s} L ${cx + s} ${cy + s}`} stroke={COLORS.red} strokeWidth={size * 0.12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
      <path d={`M ${cx + s} ${cy - s} L ${cx - s} ${cy + s}`} stroke={COLORS.red} strokeWidth={size * 0.12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
    </svg>
  );
};

/** Gotas de sudor. */
export const Drops: React.FC<{cx: number; cy: number; size: number; opacity?: number}> = ({cx, cy, size, opacity = 1}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
    {[[-0.55, 0.1, 0.8], [0, -0.25, 1], [0.55, 0.15, 0.75]].map(([dx, dy, k], i) => {
      const s = size * 0.5 * k;
      const x = cx + dx * size;
      const y = cy + dy * size;
      return <path key={i} d={`M ${x} ${y - s * 1.3} C ${x + s * 0.9} ${y - s * 0.2} ${x + s} ${y + s * 0.9} ${x} ${y + s} C ${x - s} ${y + s * 0.9} ${x - s * 0.9} ${y - s * 0.2} ${x} ${y - s * 1.3} Z`}
        fill="#8fc0e0" stroke={COLORS.ink} strokeWidth={7} />;
    })}
  </svg>
);

/** Depósito de vidrio con dopamina (nivel 0..1). */
export const Tank: React.FC<{cx: number; cy: number; w: number; h: number; level: number}> = ({cx, cy, w, h, level}) => (
  <div style={{...abs(cx, cy, w, h), border: `8px solid ${COLORS.ink}`, borderRadius: '24px 24px 40px 40px', background: 'rgba(251,250,246,0.85)', overflow: 'hidden', boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${Math.max(0, level) * 100}%`, background: COLORS.yellow, borderTop: level > 0.02 ? `6px solid ${COLORS.ink}` : undefined}} />
    {Array.from({length: 7}, (_, i) => (
      <div key={i} style={{position: 'absolute', left: `${12 + random(`tk-${i}`) * 70}%`, bottom: `${random(`tb-${i}`) * Math.max(0, level - 0.08) * 100}%`,
        width: 22, height: 22, borderRadius: '50%', border: `4px solid ${COLORS.ink}`, background: '#f8dc7a', opacity: level > 0.06 ? 1 : 0}} />
    ))}
  </div>
);

/** Calendario de 30 días; `days` = días marcados (0..30, puede ser fraccional). */
export const Calendar30: React.FC<{cx: number; cy: number; w: number; days: number}> = ({cx, cy, w, days}) => {
  const cols = 6;
  const rows = 5;
  const head = w * 0.2;
  const cell = (w - 40) / cols;
  const h = head + rows * cell + 30;
  return (
    <div style={{...abs(cx, cy, w, h), background: COLORS.card, border: `7px solid ${COLORS.ink}`, borderRadius: 22, boxShadow: '0 16px 30px rgba(0,0,0,0.2)', boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: head, background: COLORS.green, borderRadius: '14px 14px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: head * 0.62, color: 'white', letterSpacing: 2}}>
        30 DAYS
      </div>
      {[0.25, 0.75].map((k) => (
        <div key={k} style={{position: 'absolute', top: -26, left: w * k - 14, width: 28, height: 56, borderRadius: 14, background: COLORS.ink}} />
      ))}
      {Array.from({length: 30}, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const on = Math.max(0, Math.min(1, days - i));
        return (
          <div key={i} style={{position: 'absolute', left: 13 + c * cell, top: head + 12 + r * cell, width: cell - 12, height: cell - 12, borderRadius: 10,
            border: `4px solid ${COLORS.ink}`, background: on > 0.5 ? COLORS.green : 'transparent', boxSizing: 'border-box',
            transform: `scale(${1 + 0.15 * Math.sin(Math.PI * on)})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...font, fontSize: cell * 0.5, color: 'white'}}>
            {on > 0.5 ? '✓' : ''}
          </div>
        );
      })}
    </div>
  );
};

/** Bloques de construcción (tirosina) que viajan por una curva y cambian de color al pasar `convertAt` (0..1). */
export const Blocks: React.FC<{path: [Pt, Pt, Pt, Pt]; t: number; count?: number; speed?: number; size?: number; convertAt?: number; opacity?: number}> = ({
  path, t, count = 7, speed = 60, size = 42, convertAt = 2, opacity = 1,
}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
    {Array.from({length: count}, (_, i) => {
      const u = (((t + (i * speed) / count) % speed) + speed) % speed / speed;
      const p = bezier(...path, u);
      const fade = Math.min(1, u * 8, (1 - u) * 8);
      const done = u > convertAt;
      return (
        <rect key={i} x={p.x - size / 2} y={p.y - size / 2} width={size} height={size} rx={8} fill={done ? COLORS.yellow : COLORS.card}
          stroke={COLORS.ink} strokeWidth={6} opacity={fade} transform={`rotate(${p.angle + (done ? 45 : 0)}, ${p.x}, ${p.y})`} />
      );
    })}
  </svg>
);
