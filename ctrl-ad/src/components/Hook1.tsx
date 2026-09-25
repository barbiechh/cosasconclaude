import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {TimedText} from './TimedText';
import {Figure, Fin, LeaderRing, Orca, headPoint} from './figures';
import {Arrow, Bar, Target} from './mechanisms';
import {Layer, clamp, ease, easeOut, font, mix, ramp, springAt} from './kit';
import {COLORS, LAYOUT, TYPE} from '../styles/tokens';
import {HEIGHT, WIDTH, hook1CueFrame as hookCueFrame} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

/**
 * HOOK 1 — módulo autocontenido. Sus tiempos salen de HOOK.cues (relativos a
 * su propio inicio). Un Hook2 es otro componente con la misma forma.
 *
 * Women -> figura ilustrada; killer whales -> la orca entra enorme y se
 * acomoda; only -> un trazo encierra a las dos; perimenopause -> arco amarillo
 * que las une; complete opposite -> la orca sube y guía a su grupo, del lado
 * de ella el foco, las palabras y la energía pierden estabilidad.
 */
export const Hook1: React.FC<HookProps> = ({usePlaceholder: p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = {
    women: hookCueFrame('women'),
    whales: hookCueFrame('killerWhales'),
    only: hookCueFrame('only'),
    earth: hookCueFrame('earth'),
    peri: hookCueFrame('perimenopause'),
    but: hookCueFrame('but'),
    whale: hookCueFrame('toAWhale'),
    complete: hookCueFrame('completeOpposite'),
    opposite: hookCueFrame('opposite'),
    woman: hookCueFrame('toAWoman'),
  };

  // Orca: entra nadando de cuerpo entero a su lado del cuadro.
  const oIn = ramp(frame, f.whales - 3, f.whales + 9, easeOut);
  const swim = ramp(frame, f.whales - 2, f.whales + 16, easeOut);
  const oSeen = frame >= f.whales - 2;
  const split = ramp(frame, f.but, f.but + 14);
  const rise = ramp(frame, f.whale, f.whale + 26);
  const orca = {
    x: mix(mix(-320, 265, swim), 250, split),
    y: mix(mix(960, 880, swim), 880, split) - rise * 120,
    w: 440 * (1 + 0.06 * Math.sin(Math.PI * ramp(frame, f.whale, f.whale + 10))),
  };

  // Mujer: al centro; con la orca se corre a la derecha.
  const wIn = springAt(frame, fps, f.women, 12);
  const opp = ramp(frame, f.opposite, f.woman + 10, (t) => t);
  const woman = {x: mix(mix(540, 780, oIn), 810, split), feet: 1215, h: mix(760, 620, oIn)};
  const head = headPoint(woman.x, woman.feet, woman.h);

  // Trazo que encierra a las dos ("the only animals").
  const loop = ramp(frame, f.only, f.only + 24, (t) => t);
  const loopOut = ramp(frame, f.peri, f.peri + 8);
  // Arco que las conecta ("perimenopause").
  const arc = ramp(frame, f.peri - 2, f.peri + 16);
  const arcOut = ramp(frame, f.but, f.but + 8);

  // Zoom final hacia ella ("...to a woman").
  const z = ease(interpolate(frame, [f.woman, f.woman + 14], [0, 1], clamp));
  const zs = 1 + 0.45 * z;
  const zx = (WIDTH / 2 - woman.x) * z * 0.9;
  const zy = (860 - (woman.feet - woman.h / 2)) * z * 0.6;

  // su grupo, visto de lejos: aletas dorsales que asoman detrás de ella
  const pod = [
    {x: 110, y: 1130, h: 110, d: 4},
    {x: 250, y: 1180, h: 90, d: 9},
    {x: 390, y: 1140, h: 100, d: 14},
    {x: 170, y: 1270, h: 80, d: 18},
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translate(${zx}px, ${zy}px) scale(${zs})`, transformOrigin: `${woman.x}px 860px`}}>
        {/* lado de la orca: guía, sube, el grupo la sigue */}
        <LeaderRing cx={orca.x} cy={orca.y + 20} rx={230} ry={130} t={ramp(frame, f.whale, f.whale + 16)} pulse={frame / 8} />
        {pod.map((o, i) => {
          const k = springAt(frame, fps, f.whale + o.d, 12);
          if (k <= 0) return null;
          return <Fin key={i} x={o.x + Math.sin(frame / 12 + i) * 6} y={o.y - rise * 80} h={o.h * k} tilt={Math.sin(frame / 9 + i) * 3} />;
        })}
        {oSeen && <Orca p={p} x={orca.x} y={orca.y + Math.sin(frame / 10) * 6} w={orca.w} rot={-8 * (1 - swim)} />}
        <Arrow a={[495, 1180]} b={[495, 620]} t={ramp(frame, f.whale + 4, f.whale + 22)} color={COLORS.green} width={16} />

        {/* lado de ella */}
        {wIn > 0 && (
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - wIn) * 160}px)`, opacity: Math.min(1, wIn * 2)}}>
            <Figure x={woman.x} y={woman.feet} h={woman.h} armL={8} armR={8} slump={opp * 0.7} grey={opp * 0.5}
              tilt={Math.sin(frame / 4) * 4 * opp} lean={Math.sin(frame / 5) * 2 * opp} />
          </div>
        )}
        <Pads x={woman.x - 205} frame={frame} fps={fps} f={f} />
        <Unsteady head={head} from={f.opposite} frame={frame} fps={fps} />
        <Arrow a={[600, 730]} b={[600, 1180]} t={ramp(frame, f.opposite + 8, f.opposite + 28)} color={COLORS.red} width={16} />

        {/* trazo de "only" y arco de "perimenopause" */}
        {loop > 0 && loopOut < 1 && (
          <Layer opacity={1 - loopOut}>
            <path d="M 540 470 C 980 470 1040 900 990 1150 C 940 1360 160 1380 90 1130 C 30 900 110 470 560 470"
              fill="none" stroke={COLORS.ink} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - loop} />
          </Layer>
        )}
        {arc > 0 && arcOut < 1 && (
          <Layer opacity={1 - arcOut}>
            <path d={`M ${orca.x + 60} ${orca.y - 120} Q 540 380 ${head[0] - 20} ${head[1] - 70}`} fill="none" stroke={COLORS.ink} strokeWidth={34}
              strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arc} />
            <path d={`M ${orca.x + 60} ${orca.y - 120} Q 540 380 ${head[0] - 20} ${head[1] - 70}`} fill="none" stroke={COLORS.yellow} strokeWidth={20}
              strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arc} />
            <circle cx={orca.x + 60} cy={orca.y - 120} r={22 * Math.min(1, arc * 4)} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={6} />
            <circle cx={head[0] - 20} cy={head[1] - 70} r={22 * Math.max(0, arc * 1.4 - 0.4)} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={6} />
          </Layer>
        )}

        {/* divisor */}
        <div style={{position: 'absolute', top: 0, left: WIDTH / 2 - 4, width: 8, height: HEIGHT, backgroundColor: COLORS.ink, transformOrigin: 'top', transform: `scaleY(${split})`}} />
      </AbsoluteFill>

      <TimedText text="PERIMENOPAUSE" highlight="PERIMENOPAUSE" enterAtFrame={f.peri} exitAtFrame={f.but + 2} top={LAYOUT.topText} fontSize={TYPE.key} maxWidth={960} />

      <div style={{position: 'absolute', inset: 0, opacity: 1 - z}}>
        <SplitWord text="COMPLETE" enterAt={f.complete} centerX={270} />
        <SplitWord text="OPPOSITE" enterAt={f.opposite} centerX={810} strikeAt={f.opposite + 5} />
      </div>
    </AbsoluteFill>
  );
};

/** Foco, palabras y energía alrededor de su cabeza: aparecen y pierden estabilidad. */
const Unsteady: React.FC<{head: [number, number]; from: number; frame: number; fps: number}> = ({head, from, frame, fps}) => {
  const k = springAt(frame, fps, from, 11);
  if (k <= 0) return null;
  const t = Math.max(0, frame - from - 5);
  const wob = Math.min(1, t / 25);
  const fall = t * t * 0.09;
  const item = (i: number) => ({
    dx: Math.sin(frame / 3 + i * 2) * 14 * wob,
    dy: fall * (0.6 + i * 0.25),
    r: Math.sin(frame / 4 + i) * 16 * wob + wob * (i - 1) * 20,
  });
  const a = item(0);
  const b = item(1);
  const c = item(2);
  const letters = 'ABC';
  return (
    <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, k * 2)}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${a.dx}px, ${a.dy}px) rotate(${a.r}deg) scale(${k})`, transformOrigin: `${head[0] - 120}px ${head[1] - 210}px`}}>
        <Target cx={head[0] - 120} cy={head[1] - 210} r={62} cursor={[Math.sin(frame / 2.5) * 40 * wob + 20, Math.cos(frame / 3.1) * 36 * wob - 10]} lock={0} />
      </div>
      <div style={{position: 'absolute', left: head[0] + 20, top: head[1] - 290, width: 200, height: 110, transform: `translate(${b.dx}px, ${b.dy}px) rotate(${b.r}deg) scale(${k})`,
        background: COLORS.card, border: `6px solid ${COLORS.ink}`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: 58}}>
        {[...letters].map((ch, i) => (
          <span key={i} style={{display: 'inline-block', transform: `translateY(${Math.max(0, t - 6 - i * 4) ** 2 * 0.25 * (0.7 + random(`hl${i}`))}px) rotate(${Math.max(0, t - 6 - i * 4) * (i - 1) * 6}deg)`}}>{ch}</span>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${c.dx}px, ${c.dy}px) rotate(${c.r}deg) scale(${k})`, transformOrigin: `${head[0] + 120}px ${head[1] - 60}px`}}>
        <Bar cx={head[0] + 130} cy={head[1] - 110} w={170} h={54} value={mix(0.9, 0.12, Math.min(1, t / 26))} color={t > 16 ? COLORS.red : COLORS.green} />
      </div>
    </div>
  );
};

/** Mitad del titular partido; con `strikeAt`, se tacha con un trazo rojo. */
const SplitWord: React.FC<{text: string; enterAt: number; centerX: number; strikeAt?: number}> = ({text, enterAt, centerX, strikeAt}) => {
  const frame = useCurrentFrame();
  if (frame < enterAt) return null;
  const x = mix(WIDTH / 2, centerX, ramp(frame, enterAt, enterAt + 8, easeOut));
  const pop = interpolate(frame, [enterAt, enterAt + 5], [0.6, 1], clamp);
  const op = interpolate(frame, [enterAt, enterAt + 4], [0, 1], clamp);
  const strike = strikeAt === undefined ? 0 : ease(interpolate(frame, [strikeAt, strikeAt + 8], [0, 1], clamp));
  const W = 440;
  return (
    <div style={{position: 'absolute', top: 1255, left: x - W / 2, width: W, textAlign: 'center', opacity: op, transform: `scale(${pop})`}}>
      <span style={{...font, fontSize: 70, color: COLORS.ink, letterSpacing: -0.5, background: 'rgba(241,241,239,0.85)', padding: '0 10px'}}>{text}</span>
      {strikeAt !== undefined && (
        <svg width={W} height={100} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <path d={`M 40 62 C ${W * 0.35} 44, ${W * 0.65} 56, ${W - 40} 34`} fill="none" stroke={COLORS.red} strokeWidth={12}
            strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
        </svg>
      )}
    </div>
  );
};

/**
 * Compresas junto a ella (solo del lado de la mujer): una con una mancha
 * pequeña, otra con menos y una limpia. Las dos primeras caen a ritmo sobre sus
 * marcas; la tercera llega tarde y fuera de lugar, y la siguiente marca queda
 * vacía: el patrón se vuelve irregular.
 */
const Pads: React.FC<{x: number; frame: number; fps: number; f: Record<string, number>}> = ({x, frame, fps, f}) => {
  const out = ramp(frame, f.peri - 4, f.peri + 6);
  if (frame < f.women || out >= 1) return null;
  const slots = [590, 810, 1030, 1230];
  const pads = [
    {at: f.women + 2, y: slots[0], spot: 1, rot: 0},
    {at: f.women + 10, y: slots[1], spot: 0.5, rot: 0},
    {at: f.only + 4, y: slots[2] + 95, spot: 0, rot: 16},
  ];
  const wob = ramp(frame, f.earth, f.earth + 10);
  const empty = springAt(frame, fps, f.only + 12, 12);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {/* marcas del ritmo esperado */}
        <line x1={x} x2={x} y1={slots[0] - 90} y2={slots[3] + 90} stroke={COLORS.greyLight} strokeWidth={5} strokeDasharray="3 14" strokeLinecap="round" />
        {slots.slice(0, 3).map((y, i) => <line key={i} x1={x - 62} x2={x + 62} y1={y} y2={y} stroke={COLORS.grey} strokeWidth={6} strokeLinecap="round" />)}
        {empty > 0 && (
          <rect x={x - 46} y={slots[3] - 90} width={92} height={180} rx={46} fill="none" stroke={COLORS.grey} strokeWidth={5} strokeDasharray="10 10"
            transform={`scale(${empty})`} style={{transformOrigin: `${x}px ${slots[3]}px`}} />
        )}
      </svg>
      {pads.map((pd, i) => {
        const k = springAt(frame, fps, pd.at, 11);
        if (k <= 0) return null;
        const jitter = wob * Math.sin(frame / 3 + i * 2) * 5;
        return <Pad key={i} x={x} y={pd.y - (1 - k) * 160} rot={pd.rot + jitter} spot={pd.spot} opacity={Math.min(1, k * 2)} />;
      })}
    </div>
  );
};

const Pad: React.FC<{x: number; y: number; rot: number; spot: number; opacity: number}> = ({x, y, rot, spot, opacity}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity}}>
    <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(1.35)`}>
      <g style={{filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.2))'}}>
        {/* alas */}
        <path d="M -30 -26 Q -62 -14 -58 0 Q -62 14 -30 26 Z" fill="#fbfaf6" stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 30 -26 Q 62 -14 58 0 Q 62 14 30 26 Z" fill="#fbfaf6" stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-34} y={-72} width={68} height={144} rx={34} fill="#fffdf8" stroke={COLORS.ink} strokeWidth={6} />
        <rect x={-20} y={-54} width={40} height={108} rx={20} fill="none" stroke={COLORS.greyLight} strokeWidth={3} strokeDasharray="5 6" />
        {spot > 0 && <ellipse cx={0} cy={4} rx={9 + 9 * spot} ry={12 + 12 * spot} fill={COLORS.red} opacity={0.55 + 0.4 * spot} />}
      </g>
    </g>
  </svg>
);
