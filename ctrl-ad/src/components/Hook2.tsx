import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Figure, LeaderRing, Orca, headPoint} from './figures';
import {Arrow, Fog, Rays} from './mechanisms';
import {Layer, Pic, easeOut, font, mix, ramp, springAt} from './kit';
import {COLORS} from '../styles/tokens';
import {hook2CueFrame} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

// Mundo de la carrera (coordenadas propias; una cámara lo encuadra).
const START = 150;
const FIN = 1500;
const WATER = {top: 610, bottom: 880};
const TRACK = {top: 900, bottom: 1210};
const ORCA_Y = 745;
const FEET = 1195;
const WOMAN_H = 310;
const OVERRUN = 230;

/**
 * HOOK 2 — módulo autocontenido (tiempos en HOOK2.cues).
 * "Killer whales hit perimenopause at the same age women do": carrera de dos
 * carriles, orca en el agua y mujer en la pista, hacia la meta PERIMENOPAUSE;
 * cruzan juntas en "same age". "But it does the exact opposite to them": los
 * carriles se separan en direcciones opuestas y la mirada va hacia ella;
 * "...what's really going on in a woman's brain right now": su cerebro, con
 * una pregunta abierta que el body responde.
 */
export const Hook2: React.FC<HookProps> = ({usePlaceholder: p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = {
    peri: hook2CueFrame('perimenopause'),
    same: hook2CueFrame('same'),
    age: hook2CueFrame('age'),
    womenDo: hook2CueFrame('womenDo'),
    but: hook2CueFrame('but'),
    exact: hook2CueFrame('exact'),
    opposite: hook2CueFrame('opposite'),
    toThem: hook2CueFrame('toThem'),
    reason: hook2CueFrame('reason'),
    really: hook2CueFrame('really'),
    womans: hook2CueFrame('womans'),
    brain: hook2CueFrame('brain'),
  };
  // Cruzan la meta exactamente a la vez, en "age".
  const CROSS = f.age + 2;

  // Progreso de cada una: la orca sale más rápido, la mujer remata más fuerte;
  // empatan en la meta.
  const t = Math.min(1, Math.max(0, frame / CROSS));
  const after = ramp(frame, CROSS, CROSS + 24, easeOut) * OVERRUN;
  const xOrca = frame <= CROSS ? mix(START, FIN, Math.pow(t, 0.78)) : FIN + after;
  const xWoman = frame <= CROSS ? mix(START, FIN, Math.pow(t, 1.3)) : FIN + after * 0.9;

  // Cámara: de cerca en la salida, se abre en "perimenopause" para mostrar la
  // meta, y vuelve a acercarse para la llegada.
  const open = ramp(frame, f.peri - 2, f.peri + 12) * (1 - ramp(frame, f.peri + 22, CROSS - 4));
  const track = (xOrca + xWoman) / 2 + 160;
  const cx = Math.min(mix(track, FIN - 350, open), FIN + 140);
  const scale = mix(frame < f.peri ? 1.2 : 1, 0.72, open);
  const cy = 910;

  // Separación de carriles en direcciones opuestas ("But it does the exact opposite").
  const split = ramp(frame, f.but, f.but + 22);
  const topShift = {x: -300 * split, y: -430 * split, r: -7 * split};
  const botShift = {x: 40 * split, y: 150 * split};

  // Acercamiento hacia su cabeza ("the reason why explains...").
  const zoom = ramp(frame, f.reason - 4, f.reason + 26);
  const headWorld = headPoint(xWoman, FEET, WOMAN_H);
  const hx = (headWorld[0] + botShift.x - cx) * scale + 540;
  const hy = (headWorld[1] + botShift.y - cy) * scale + 900;
  const Z = 2.8;
  const zs = 1 + (Z - 1) * zoom;
  const target = {x: 540, y: 880};

  const flash = Math.max(0, 1 - Math.abs(frame - CROSS) / 5);
  const bannerPop = springAt(frame, fps, f.peri + 2, 10);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translate(${(target.x - hx) * zoom}px, ${(target.y - hy) * zoom}px) scale(${zs})`, transformOrigin: `${hx}px ${hy}px`}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0',
          transform: `translate(540px, 900px) scale(${scale}) translate(${-cx}px, ${-cy}px)`}}>
          {/* carril del agua: la orca */}
          <div style={{position: 'absolute', inset: 0, transform: `translate(${topShift.x}px, ${topShift.y}px) rotate(${topShift.r}deg)`, transformOrigin: `${FIN}px ${WATER.bottom}px`}}>
            <Lane top={WATER.top} bottom={WATER.bottom} color="#d6e4e9" frame={frame} water />
            <LeaderRing cx={xOrca} cy={ORCA_Y + 10} rx={200} ry={110} t={ramp(frame, f.opposite, f.opposite + 14)} pulse={frame / 8} />
            <Wake x={xOrca - 170} y={ORCA_Y + 30} frame={frame} on={frame < CROSS + 10} />
            <Orca p={p} x={xOrca + ramp(frame, f.but, f.reason) * 120} y={ORCA_Y + Math.sin(frame / 5) * 8 - split * 60} w={300} rot={Math.sin(frame / 6) * 4 - split * 14} />
          </div>
          {/* carril de la pista: ella */}
          <div style={{position: 'absolute', inset: 0, transform: `translate(${botShift.x}px, ${botShift.y}px)`}}>
            <Lane top={TRACK.top} bottom={TRACK.bottom} color="#e8d8bf" frame={frame} />
            <Figure x={xWoman} y={FEET} h={WOMAN_H} step={frame < CROSS + 20 ? frame * 0.9 : 0} lean={frame < CROSS ? 6 : 0} armL={frame < CROSS ? 18 + Math.sin(frame * 0.9) * 14 : 8}
              armR={frame < CROSS ? 18 - Math.sin(frame * 0.9) * 14 : 8} />
          </div>
          {/* meta */}
          <div style={{position: 'absolute', inset: 0, opacity: 1 - ramp(frame, f.but, f.but + 7), transform: `translateY(${-300 * split}px)`}}>
            <Finish frame={frame} cross={CROSS} pop={bannerPop} />
          </div>
        </div>
      </AbsoluteFill>

      {flash > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(255,255,255,${0.75 * flash})`}} />}

      {/* la mirada va de la separación hacia ella */}
      <Arrow a={[330, 560]} b={[target.x - 110 * (1 - zoom) + 0, target.y - 180]} bend={-0.35}
        t={ramp(frame, f.exact, f.toThem + 6)} color={COLORS.ink} width={12} opacity={1 - ramp(frame, f.reason + 10, f.reason + 20)} />
      <BrainReveal p={p} frame={frame} fps={fps} f={f} x={target.x} headY={target.y} />
    </AbsoluteFill>
  );
};

/** Un carril: banda de color, líneas, marcas de distancia y salida. */
const Lane: React.FC<{top: number; bottom: number; color: string; frame: number; water?: boolean}> = ({top, bottom, color, frame, water}) => (
  <>
    <div style={{position: 'absolute', left: -600, top, width: FIN + 1400, height: bottom - top, background: color,
      borderTop: `6px solid ${COLORS.ink}`, borderBottom: `6px solid ${COLORS.ink}`, boxSizing: 'border-box'}} />
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {water
        ? [0.3, 0.62, 0.85].map((k, i) => {
            const y = top + (bottom - top) * k;
            const off = ((frame * 3 + i * 40) % 120);
            let d = `M ${-600 - off} ${y}`;
            for (let x = -600 - off; x < FIN + 800; x += 60) d += ` q 30 ${i % 2 ? 10 : -10} 60 0`;
            return <path key={i} d={d} fill="none" stroke="#9fb7c0" strokeWidth={5} strokeLinecap="round" />;
          })
        : <line x1={-600} x2={FIN + 800} y1={(top + bottom) / 2 + 60} y2={(top + bottom) / 2 + 60} stroke="#fffdf8" strokeWidth={8} strokeDasharray="40 30" />}
      {Array.from({length: 6}, (_, i) => {
        const x = START + i * 270;
        return <line key={i} x1={x} x2={x} y1={bottom - 26} y2={bottom - 4} stroke={COLORS.ink} strokeWidth={6} opacity={0.5} />;
      })}
      <line x1={START} x2={START} y1={top} y2={bottom} stroke="#fffdf8" strokeWidth={14} />
    </svg>
  </>
);

/** Estela de la orca. */
const Wake: React.FC<{x: number; y: number; frame: number; on: boolean}> = ({x, y, frame, on}) =>
  on ? (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={x - 40 - i * 55 - (frame % 6) * 4} x2={x - 10 - i * 55 - (frame % 6) * 4} y1={y + (i - 1) * 26} y2={y + (i - 1) * 26}
          stroke="#fffdf8" strokeWidth={8} strokeLinecap="round" opacity={0.9 - i * 0.25} />
      ))}
    </svg>
  ) : null;

/** Meta: línea a cuadros en ambos carriles, cinta que se rompe y la pancarta PERIMENOPAUSE. */
const Finish: React.FC<{frame: number; cross: number; pop: number}> = ({frame, cross, pop}) => {
  const broke = Math.max(0, frame - cross);
  const swing = Math.min(1, broke / 10);
  return (
    <>
      <div style={{position: 'absolute', left: FIN - 22, top: WATER.top, width: 44, height: TRACK.bottom - WATER.top,
        background: `repeating-conic-gradient(${COLORS.ink} 0% 25%, #fffdf8 0% 50%) 0 0 / 22px 22px`, border: `4px solid ${COLORS.ink}`, boxSizing: 'border-box'}} />
      {/* postes y pancarta */}
      <div style={{position: 'absolute', left: FIN - 420, top: 400, width: 14, height: TRACK.bottom - 400, background: COLORS.ink}} />
      <div style={{position: 'absolute', left: FIN + 406, top: 400, width: 14, height: TRACK.bottom - 400, background: COLORS.ink}} />
      <div style={{position: 'absolute', left: FIN - 410, top: 420, width: 820, height: 150, background: COLORS.yellow, border: `7px solid ${COLORS.ink}`,
        borderRadius: 14, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: 84, letterSpacing: 0,
        color: COLORS.ink, boxShadow: '0 12px 24px rgba(0,0,0,0.2)', transform: `scale(${0.85 + 0.15 * pop}) rotate(${Math.sin(frame / 14) * 0.8}deg)`}}>
        PERIMENOPAUSE
      </div>
      {/* cinta: entera hasta que cruzan, luego sus dos mitades caen */}
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {broke <= 0 ? (
          <line x1={FIN + 30} x2={FIN + 30} y1={WATER.top + 20} y2={TRACK.bottom - 20} stroke={COLORS.red} strokeWidth={10} />
        ) : (
          <>
            <path d={`M ${FIN + 30} ${WATER.top + 20} q ${40 * swing} ${120 * swing} ${120 * swing} ${220 * swing}`} fill="none" stroke={COLORS.red} strokeWidth={10} strokeLinecap="round" />
            <path d={`M ${FIN + 30} ${TRACK.bottom - 20} q ${40 * swing} ${-110 * swing} ${120 * swing} ${-200 * swing}`} fill="none" stroke={COLORS.red} strokeWidth={10} strokeLinecap="round" />
          </>
        )}
      </svg>
    </>
  );
};

/** Su cerebro aparece sobre ella, con una pregunta abierta. */
const BrainReveal: React.FC<{p: boolean; frame: number; fps: number; f: Record<string, number>; x: number; headY: number}> = ({p, frame, fps, f, x, headY}) => {
  const q = springAt(frame, fps, f.really, 10);
  const b = springAt(frame, fps, f.womans, 12);
  if (q <= 0 && b <= 0) return null;
  const by = headY - 330;
  const glow = ramp(frame, f.brain, f.brain + 12);
  return (
    <>
      <Rays cx={x} cy={by} r0={230} r1={330} t={glow} n={14} spin={frame / 70} />
      {b > 0 && (
        <>
          <Layer opacity={Math.min(1, b)}>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={x - 20 + i * 18} cy={headY - 150 + i * 28} r={9 - i * 2} fill={COLORS.ink} />
            ))}
          </Layer>
          <Pic id="body.brainDiagram" p={p} x={x} y={by} w={430} aspect={1.5} scale={b} />
          <Fog x={x - 260} y={by - 170} w={520} h={320} amount={0.45 * glow} t={frame} />
        </>
      )}
      {q > 0 && (
        <div style={{position: 'absolute', left: x + 170, top: by - 240, width: 140, textAlign: 'center', ...font, fontSize: 170, lineHeight: 1, color: COLORS.red,
          transform: `scale(${q}) rotate(${8 + Math.sin(frame / 6) * 4}deg)`, textShadow: `4px 4px 0 ${COLORS.ink}`}}>
          ?
        </div>
      )}
    </>
  );
};
