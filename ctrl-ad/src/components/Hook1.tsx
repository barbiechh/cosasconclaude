import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {TimedText} from './TimedText';
import {Figure, LeaderRing, Orca, OrcaTop, headPoint} from './figures';
import {Bar, Target} from './mechanisms';
import {Layer, Pt, bezier, bezierD, clamp, ease, easeOut, font, mix, ramp, springAt} from './kit';
import {COLORS, LAYOUT, TYPE} from '../styles/tokens';
import {WIDTH, hookCueFrame} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

/**
 * HOOK 1 — módulo autocontenido. Sus tiempos salen de HOOK.cues (relativos a
 * su propio inicio). Un Hook2 es otro componente con la misma forma.
 *
 * Primera mitad (misma idea que antes): Women -> figura ilustrada; killer
 * whales -> la orca entra enorme y se acomoda; only -> un trazo encierra a
 * las dos; perimenopause -> arco amarillo que las une.
 *
 * Segunda mitad ("But what it does to a whale is the complete opposite of
 * what it does to a woman"): la orca se sumerge y la escena se convierte en
 * DOS TRAYECTORIAS que parten del mismo punto. En "whale" la línea verde sube
 * y la orca (ahora vista desde arriba) la recorre; en "complete" su grupo la
 * sigue; en "opposite" la línea roja cae y ella se desliza hacia abajo
 * perdiendo foco, palabras y energía. La cuña entre las dos se abre.
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

  // --- Primera mitad ---------------------------------------------------------
  // Orca: entra enorme, casi llenando el cuadro, y se encoge a su lugar.
  const oIn = ramp(frame, f.whales, f.whales + 24, easeOut);
  // En "But" se sumerge: gira hacia abajo y sale por la esquina.
  const dive = ramp(frame, f.but, f.but + 16, (t) => t * t);
  const orca = {
    x: mix(mix(460, 290, oIn), 150, dive),
    y: mix(900, 880, oIn) + dive * 900,
    w: mix(1900, 440, oIn) * (1 - 0.3 * dive),
  };

  // Mujer: al centro; con la orca se corre a la derecha; en "But" baja al
  // punto de partida de las trayectorias.
  const wIn = springAt(frame, fps, f.women, 12);
  const toStart = ramp(frame, f.but, f.but + 14);
  const slide = ramp(frame, f.opposite, f.woman + 4, (t) => t);
  // de su lugar al inicio, por el tramo común, y luego cuesta abajo por la roja
  const along = slide < 0.25 ? null : bezier(...RED, (slide - 0.25) / 0.75 * 0.95);
  const redPt = along ?? {x: mix(START[0] + 60, FORK[0], slide / 0.25), y: FORK[1], angle: 0};
  // Ella espera al inicio; el tramo común se dibuja entre "But" y "whale".
  const shared = ramp(frame, f.but + 2, f.whale, (t) => t);
  const onPath: Pt = slide > 0 ? [redPt.x, redPt.y] : [START[0] + 60, START[1]];
  const woman = {
    x: mix(mix(540, 780, oIn), onPath[0], toStart),
    feet: mix(1215, onPath[1], toStart),
    h: mix(mix(760, 620, oIn), 380, toStart),
  };
  const head = headPoint(woman.x, woman.feet, woman.h);
  const opp = ramp(frame, f.opposite, f.woman + 10, (t) => t);

  // Trazo que encierra a las dos ("the only animals").
  const loop = ramp(frame, f.only, f.only + 24, (t) => t);
  const loopOut = ramp(frame, f.peri, f.peri + 8);
  // Arco que las conecta ("perimenopause").
  const arc = ramp(frame, f.peri - 2, f.peri + 16);
  const arcOut = ramp(frame, f.but, f.but + 8);

  // --- Segunda mitad: dos trayectorias -----------------------------------------
  const green = ramp(frame, f.whale, f.opposite + 4, (t) => t);
  const red = ramp(frame, f.opposite, f.woman, (t) => t);
  const wedge = Math.min(green, red);
  // Las puntas siguen separándose hasta el final del hook.
  const spread = ramp(frame, f.opposite, f.woman + 14);
  const onGreen = bezier(...GREEN, green * 0.86);
  const leader = green > 0 ? {x: onGreen.x, y: onGreen.y, angle: onGreen.angle} : {x: FORK[0], y: FORK[1], angle: -60};
  const topIn = springAt(frame, fps, f.whale - 2, 12);

  // Zoom final hacia ella ("...to a woman").
  const z = ease(interpolate(frame, [f.woman, f.woman + 12], [0, 1], clamp));
  const zs = 1 + 0.22 * z;
  const zx = (WIDTH / 2 - woman.x) * z * 0.45;
  const zy = (900 - (woman.feet - woman.h / 2)) * z * 0.35;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translate(${zx}px, ${zy}px) scale(${zs})`, transformOrigin: `${woman.x}px ${woman.feet - woman.h / 2}px`}}>
        {/* trayectorias (debajo de todo) */}
        {shared > 0 && (
          <Layer>
            {wedge > 0 && (
              <path d={`${bezierD(...bend(GREEN, 0, -spread * 40))} L ${RED[3][0]} ${RED[3][1] + spread * 30} C ${RED[2][0]} ${RED[2][1] + spread * 15} ${RED[1][0]} ${RED[1][1]} ${FORK[0]} ${FORK[1]} Z`}
                fill="rgba(244,201,58,0.18)" opacity={wedge} />
            )}
            <Stroke d={`M ${START[0]} ${START[1]} L ${FORK[0]} ${FORK[1]}`} t={shared} color={COLORS.yellow} />
            {green > 0 && <Stroke d={bezierD(...bend(GREEN, 0, -spread * 40))} t={green} color={COLORS.green} />}
            {red > 0 && <Stroke d={bezierD(...bend(RED, 0, spread * 30))} t={red} color={COLORS.red} />}
            <circle cx={START[0]} cy={START[1]} r={20 * shared} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={6} />
            {/* flechas en las puntas */}
            {green > 0.96 && <Head at={GREEN[3]} dy={-spread * 40} angle={-38} color={COLORS.green} />}
            {red > 0.96 && <Head at={RED[3]} dy={spread * 30} angle={52} color={COLORS.red} />}
          </Layer>
        )}

        {/* la orca adulta del principio; en "But" se sumerge */}
        {frame >= f.whales && dive < 1 && (
          <Orca p={p} x={orca.x} y={orca.y + Math.sin(frame / 10) * 6} w={orca.w} rot={-4 * (1 - oIn) + dive * 55}
            opacity={Math.min(1, (frame - f.whales) / 3) * (1 - dive)} />
        )}

        {/* lado de la orca, visto desde arriba: sube y el grupo la sigue */}
        {topIn > 0 && (
          <>
            {POD.map((o, i) => {
              const k = springAt(frame, fps, f.complete + o.d, 12);
              if (k <= 0) return null;
              const b = bezier(...GREEN, Math.max(0, green * 0.86 - o.lag));
              return <OrcaTop key={i} x={b.x - 40 * (i % 2 ? 1 : -1)} y={b.y + 20 * (i % 2 ? -1 : 1) - spread * 40 * (green * 0.86 - o.lag)}
                w={o.w} heading={90 + b.angle} sway={frame / 4 + i} scale={k} />;
            })}
            <LeaderRing cx={leader.x} cy={leader.y - spread * 40 * green * 0.86} rx={150} ry={125} t={ramp(frame, f.whale + 4, f.whale + 18)} pulse={frame / 8} />
            <OrcaTop x={leader.x} y={leader.y - spread * 40 * green * 0.86} w={140} heading={90 + leader.angle} sway={frame / 3.5} scale={topIn} />
          </>
        )}

        {/* lado de ella */}
        {wIn > 0 && (
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - wIn) * 160}px)`, opacity: Math.min(1, wIn * 2)}}>
            <Figure x={woman.x} y={woman.feet} h={woman.h} armL={8} armR={8} slump={opp * 0.7} grey={opp * 0.5}
              tilt={Math.sin(frame / 4) * 4 * opp} lean={redPt.angle * 0.25 * slide + Math.sin(frame / 5) * 2 * opp} />
          </div>
        )}
        <Unsteady head={head} from={f.opposite} frame={frame} fps={fps} scale={woman.h / 620} />

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
      </AbsoluteFill>

      <TimedText text="PERIMENOPAUSE" highlight="PERIMENOPAUSE" enterAtFrame={f.peri} exitAtFrame={f.but + 2} top={LAYOUT.topText} fontSize={TYPE.key} maxWidth={960} />

      {/* titular arriba, lejos del caption; se va con el zoom */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - z}}>
        <HeadWord text="COMPLETE" enterAt={f.complete} centerX={290} />
        <HeadWord text="OPPOSITE" enterAt={f.opposite} centerX={790} hi />
      </div>
    </AbsoluteFill>
  );
};

// Geometría de las trayectorias: salen juntas del mismo punto y se abren.
const START: Pt = [110, 1000];
const FORK: Pt = [330, 1000];
const GREEN: [Pt, Pt, Pt, Pt] = [FORK, [430, 840], [620, 560], [910, 480]];
const RED: [Pt, Pt, Pt, Pt] = [FORK, [440, 1090], [640, 1270], [890, 1300]];
const bend = (c: [Pt, Pt, Pt, Pt], dx: number, dy: number): [Pt, Pt, Pt, Pt] => [c[0], c[1], [c[2][0] + dx, c[2][1] + dy * 0.5], [c[3][0] + dx, c[3][1] + dy]];

const POD = [
  {d: 0, lag: 0.17, w: 96},
  {d: 4, lag: 0.3, w: 90},
  {d: 8, lag: 0.43, w: 86},
  {d: 12, lag: 0.56, w: 80},
];

const Stroke: React.FC<{d: string; t: number; color: string}> = ({d, t, color}) => (
  <>
    <path d={d} fill="none" stroke={COLORS.ink} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
    <path d={d} fill="none" stroke={color} strokeWidth={17} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
  </>
);

const Head: React.FC<{at: Pt; dy: number; angle: number; color: string}> = ({at, dy, angle, color}) => (
  <g transform={`translate(${at[0]}, ${at[1] + dy}) rotate(${angle})`}>
    <path d="M -10 -30 L 34 0 L -10 30 Z" fill={color} stroke={COLORS.ink} strokeWidth={7} strokeLinejoin="round" />
  </g>
);

/** Foco, palabras y energía alrededor de su cabeza: aparecen y pierden estabilidad. */
const Unsteady: React.FC<{head: [number, number]; from: number; frame: number; fps: number; scale?: number}> = ({head, from, frame, fps, scale = 1}) => {
  const k = springAt(frame, fps, from, 11) * scale;
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
  const s = scale;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: Math.min(1, k * 2)}}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${a.dx}px, ${a.dy}px) rotate(${a.r}deg) scale(${k})`, transformOrigin: `${head[0] - 120 * s}px ${head[1] - 210 * s}px`}}>
        <Target cx={head[0] - 120 * s} cy={head[1] - 210 * s} r={62} cursor={[Math.sin(frame / 2.5) * 40 * wob + 20, Math.cos(frame / 3.1) * 36 * wob - 10]} lock={0} />
      </div>
      <div style={{position: 'absolute', left: head[0] + 20 * s, top: head[1] - 290 * s, width: 200, height: 110, transform: `translate(${b.dx}px, ${b.dy}px) rotate(${b.r}deg) scale(${k})`,
        transformOrigin: '0 0', background: COLORS.card, border: `6px solid ${COLORS.ink}`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: 58}}>
        {[...letters].map((ch, i) => (
          <span key={i} style={{display: 'inline-block', transform: `translateY(${Math.max(0, t - 6 - i * 4) ** 2 * 0.25 * (0.7 + random(`hl${i}`))}px) rotate(${Math.max(0, t - 6 - i * 4) * (i - 1) * 6}deg)`}}>{ch}</span>
        ))}
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${c.dx}px, ${c.dy}px) rotate(${c.r}deg) scale(${k})`, transformOrigin: `${head[0] + 120 * s}px ${head[1] - 60 * s}px`}}>
        <Bar cx={head[0] + 130 * s} cy={head[1] - 110 * s} w={170} h={54} value={mix(0.9, 0.12, Math.min(1, t / 26))} color={t > 16 ? COLORS.red : COLORS.green} />
      </div>
    </div>
  );
};

/** Mitad del titular "COMPLETE OPPOSITE", arriba; `hi` = resaltado amarillo. */
const HeadWord: React.FC<{text: string; enterAt: number; centerX: number; hi?: boolean}> = ({text, enterAt, centerX, hi}) => {
  const frame = useCurrentFrame();
  if (frame < enterAt) return null;
  const x = mix(WIDTH / 2, centerX, ramp(frame, enterAt, enterAt + 8, easeOut));
  const pop = interpolate(frame, [enterAt, enterAt + 5], [0.6, 1], clamp);
  const op = interpolate(frame, [enterAt, enterAt + 4], [0, 1], clamp);
  const under = interpolate(frame, [enterAt + 3, enterAt + 12], [0, 1], clamp);
  const W = 480;
  return (
    <div style={{position: 'absolute', top: LAYOUT.topText, left: x - W / 2, width: W, textAlign: 'center', opacity: op, transform: `scale(${pop})`}}>
      <span style={{...font, fontSize: TYPE.key, color: COLORS.ink, letterSpacing: -0.5, position: 'relative', padding: '0 10px'}}>
        {hi && <span style={{position: 'absolute', left: 0, right: 0, bottom: 10, height: 34, background: COLORS.yellow, borderRadius: 6, zIndex: -1,
          transform: `scaleX(${under})`, transformOrigin: 'left'}} />}
        {text}
      </span>
    </div>
  );
};
