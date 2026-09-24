import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {TimedText} from './TimedText';
import {Figure, LeaderRing, Orca, headPoint} from './figures';
import {Arrow, Bar, Target} from './mechanisms';
import {Layer, clamp, ease, easeOut, font, mix, ramp, springAt} from './kit';
import {COLORS, LAYOUT, TYPE} from '../styles/tokens';
import {HEIGHT, WIDTH, hookCueFrame} from '../data/timing';

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
    peri: hookCueFrame('perimenopause'),
    but: hookCueFrame('but'),
    whale: hookCueFrame('toAWhale'),
    complete: hookCueFrame('completeOpposite'),
    opposite: hookCueFrame('opposite'),
    woman: hookCueFrame('toAWoman'),
  };

  // Orca: entra enorme, casi llenando el cuadro, y se encoge a su lugar.
  const oIn = ramp(frame, f.whales, f.whales + 24, easeOut);
  const oSeen = frame >= f.whales;
  const split = ramp(frame, f.but, f.but + 14);
  const rise = ramp(frame, f.whale, f.whale + 26);
  const orca = {
    x: mix(mix(460, 290, oIn), 250, split),
    y: mix(mix(900, 880, oIn), 880, split) - rise * 120,
    w: mix(1900, 440, oIn) * (1 + 0.06 * Math.sin(Math.PI * ramp(frame, f.whale, f.whale + 10))),
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

  const pod = [
    {x: 110, y: 1090, d: 4},
    {x: 300, y: 1150, d: 9},
    {x: 170, y: 1260, d: 14},
  ];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translate(${zx}px, ${zy}px) scale(${zs})`, transformOrigin: `${woman.x}px 860px`}}>
        {/* lado de la orca: guía, sube, el grupo la sigue */}
        <LeaderRing cx={orca.x} cy={orca.y + 20} rx={230} ry={130} t={ramp(frame, f.whale, f.whale + 16)} pulse={frame / 8} />
        {pod.map((o, i) => {
          const k = springAt(frame, fps, f.whale + o.d, 12);
          if (k <= 0) return null;
          return <Orca key={i} p={p} x={o.x} y={o.y - rise * 80 + Math.sin(frame / 9 + i) * 5} w={130} scale={k} />;
        })}
        {oSeen && <Orca p={p} x={orca.x} y={orca.y + Math.sin(frame / 10) * 6} w={orca.w} rot={-4 * (1 - oIn)} opacity={Math.min(1, (frame - f.whales) / 3)} />}
        <Arrow a={[495, 1180]} b={[495, 620]} t={ramp(frame, f.whale + 4, f.whale + 22)} color={COLORS.green} width={16} />

        {/* lado de ella */}
        {wIn > 0 && (
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - wIn) * 160}px)`, opacity: Math.min(1, wIn * 2)}}>
            <Figure x={woman.x} y={woman.feet} h={woman.h} armL={8} armR={8} slump={opp * 0.7} grey={opp * 0.5}
              tilt={Math.sin(frame / 4) * 4 * opp} lean={Math.sin(frame / 5) * 2 * opp} />
          </div>
        )}
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
