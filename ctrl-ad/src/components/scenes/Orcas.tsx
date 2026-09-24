/**
 * "Around forty she stops having babies ... twenty years ago."
 * Cada momento con un protagonista distinto (nunca el mismo recorte dos veces seguidas):
 * 1) línea de vida = superficie del mar: la aleta dorsal la recorre; en
 *    "stops having babies" aparecen las tres crías y la barra roja en 40,
 * 2) fichas de observación: fotos de la manada (recortes de una foto real),
 * 3) "After menopause, she becomes the leader": la orca adulta en primer plano,
 * 4) "the whole pod ... every whale follows her": el grupo visto desde arriba,
 * 5) la ruta vieja: ella la sigue y las sombras del grupo la siguen a ella.
 */
import React from 'react';
import {Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Card, Layer, Pic, Pt, bezier, bezierD, easeOut, font, mix, ramp, springAt} from '../kit';
import {Calf, CalfPose, LeaderRing, Orca, OrcaFin, OrcaTop, FIN_ASPECT} from '../figures';
import {resolveAsset} from '../../data/assets';
import {Scene, SceneProps} from './SceneFrame';

const LINE_Y = 900;
const ageX = (age: number) => 130 + (age / 90) * 820;

export const Orcas: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  const end = plan.durationInFrames;
  return (
    <Scene plan={plan} punches={[at('ninety'), at('leaderWord'), at('disappearWord')]}>
      <Beat from={0} to={at('scientists')} exit="up">
        <Lifeline p={p} at={at} />
      </Beat>
      <Beat from={at('scientists')} to={at('afterMenopause')} enter="right" exit="left">
        <Observation p={p} at={at} />
      </Beat>
      <Beat from={at('afterMenopause')} to={at('wholePod', -4)} enter="right" exit="shrink" origin={[600, 900]}>
        <LeaderClose p={p} at={at} />
      </Beat>
      <Beat from={at('wholePod', -4)} to={at('sheRemembers')} enter="fade" exit="fade">
        <PodFromAbove p={p} at={at} />
      </Beat>
      <Beat from={at('sheRemembers')} to={end} enter="pop" exit="fade">
        <OldRoute p={p} at={at} />
      </Beat>
    </Scene>
  );
};

type At = SceneProps['plan']['at'];

// ---------------------------------------------------------------------------
/** Tres crías (las de la imagen nueva, separadas), bajo el tramo 0-40. */
const CALF_SPOTS: {pose: CalfPose; x: number; y: number; w: number; lag: number; rot: number}[] = [
  {pose: 'right', x: 255, y: 1030, w: 270, lag: 0, rot: -3},
  {pose: 'front', x: 440, y: 1165, w: 190, lag: 6, rot: 2},
  {pose: 'left', x: 235, y: 1235, w: 250, lag: 12, rot: 3},
];

const Lifeline: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = ramp(frame, 2, at('forty', 8), easeOut); // 0 -> 40
  const second = ramp(frame, at('livesToNinety'), at('ninety', 8)); // 40 -> 90
  const age = second > 0 ? mix(40, 90, second) : 40 * first;
  const cap = springAt(frame, fps, at('babies'), 9);
  const bracket = ramp(frame, at('nobodyCould'), at('nobodyCould', 14));
  const tipX = ageX(age);
  const finW = 150;
  const finH = finW / FIN_ASPECT;
  // Después de "babies" las crías se quedan atrás, un poco más pequeñas.
  const past = ramp(frame, at('livesToNinety'), at('ninety', 8));
  return (
    <>
      {/* crías: una por una en "stops having babies" */}
      {CALF_SPOTS.map((c, i) => {
        const k = springAt(frame, fps, at('stopsHaving', c.lag), 11);
        if (k <= 0) return null;
        return (
          <Calf key={c.pose} p={p} pose={c.pose} x={c.x + Math.sin(frame / 12 + i * 2) * 6} y={c.y + (1 - k) * 60 + Math.sin(frame / 9 + i) * 5}
            w={c.w} rot={c.rot + Math.sin(frame / 14 + i) * 2} scale={k * (1 - 0.1 * past)} opacity={Math.min(1, k * 2)} />
        );
      })}
      {/* la aleta dorsal recorre la línea (el borde del recorte queda bajo la línea) */}
      <OrcaFin p={p} x={tipX - 30} y={LINE_Y - finH / 2 + 14 + Math.sin(frame / 6) * 4} w={finW} rot={Math.sin(frame / 9) * 2} />
      <Layer>
        <line x1={ageX(0)} x2={ageX(40 * first)} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.ink} strokeWidth={30} strokeLinecap="round" />
        <line x1={ageX(0)} x2={ageX(40 * first)} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />
        {second > 0 && <line x1={ageX(40)} x2={ageX(age)} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.ink} strokeWidth={30} strokeLinecap="round" />}
        {/* estela corta detrás de la aleta */}
        <path d={`M ${tipX - 150} ${LINE_Y + 2} q 20 -16 40 0 q 20 16 40 0`} fill="none" stroke="#fbfaf6" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
        <circle cx={ageX(0)} cy={LINE_Y} r={18} fill={COLORS.ink} />
        {cap > 0 && (
          <g transform={`translate(${ageX(40)}, ${LINE_Y}) scale(${cap})`}>
            <rect x={-10} y={-70} width={20} height={140} rx={8} fill={COLORS.red} stroke={COLORS.ink} strokeWidth={5} />
          </g>
        )}
        {bracket > 0 && (
          <path d={`M ${ageX(41)} ${LINE_Y - 60} Q ${ageX(41)} ${LINE_Y - 110} ${ageX(50)} ${LINE_Y - 110} L ${ageX(81)} ${LINE_Y - 110} Q ${ageX(89)} ${LINE_Y - 110} ${ageX(89)} ${LINE_Y - 60}`}
            fill="none" stroke={COLORS.yellow} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - bracket} />
        )}
      </Layer>
      {/* edades grandes bajo la línea */}
      <div style={{position: 'absolute', left: ageX(40) - 70, top: LINE_Y + 40, width: 180, textAlign: 'center', ...font, fontSize: 70, color: COLORS.ink, opacity: first}}>40</div>
      {second > 0.6 && (
        <div style={{position: 'absolute', left: ageX(90) - 110, top: LINE_Y + 40, width: 180, textAlign: 'center', ...font, fontSize: 70, color: COLORS.ink,
          transform: `scale(${springAt(frame, fps, at('ninety'), 10)})`}}>90</div>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
/** Recortes (en px de la foto de 1672x941) de la foto real de la manada: fichas de identificación. */
const POD_PHOTO = {w: 1672, h: 941};
const PHOTO_CROPS: [number, number, number, number][] = [
  [0, 60, 1672, 880],
  [620, 170, 1020, 660],
  [60, 240, 560, 360],
  [300, 110, 560, 330],
  [840, 170, 640, 380],
  [800, 160, 420, 300],
];

const PhotoCrop: React.FC<{src: string; crop: [number, number, number, number]; w: number; h: number}> = ({src, crop, w, h}) => {
  const [cx, cy, cw, ch] = crop;
  const s = Math.max(w / cw, h / ch);
  const left = -(cx + cw / 2) * s + w / 2;
  const top = -(cy + ch / 2) * s + h / 2;
  return (
    <div style={{position: 'absolute', left: 22, top: 22, width: w, height: h, overflow: 'hidden', borderRadius: 6, border: `3px solid ${COLORS.ink}`}}>
      <Img src={src} style={{position: 'absolute', left, top, width: POD_PHOTO.w * s, height: POD_PHOTO.h * s, maxWidth: 'none'}} />
    </div>
  );
};

const Observation: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = at('scientists');
  const stop = at('thirtyYears', 6);
  const cards = PHOTO_CROPS.length;
  const years = Math.floor(mix(1, 30, ramp(frame, start, stop, (t) => t)));
  const photo = resolveAsset('body.orcaLeaderPod', p);
  return (
    <>
      {PHOTO_CROPS.map((crop, i) => {
        const t0 = start + Math.round(((stop - start) * i) / cards);
        const k = springAt(frame, fps, t0, 15);
        if (k <= 0) return null;
        // la primera, grande; el resto se apilan encima, cada una más pequeña y girada
        const w = i === 0 ? 640 : 500 - i * 12;
        const h = i === 0 ? 430 : 330 - i * 8;
        const x = 540 + (i === 0 ? 0 : (i % 2 ? 1 : -1) * (70 + i * 8));
        const y = 800 + (i === 0 ? 0 : -60 + i * 28);
        return (
          <div key={i} style={{position: 'absolute', inset: 0, transform: `translate(${(1 - k) * 700}px, ${(1 - k) * -80}px)`, opacity: Math.min(1, k * 2)}}>
            <Card x={x} y={y} w={w} h={h} rot={(i % 2 ? 1 : -1) * (2 + i * 0.8)} style={{background: '#fffdf8', borderWidth: 4}}>
              {photo ? (
                <PhotoCrop src={photo.src} crop={crop} w={w - 52} h={h - 52} />
              ) : (
                <>
                  <Orca p={p} x={w * 0.35} y={h * 0.45} w={170} />
                  <Orca p={p} x={w * 0.65} y={h * 0.55} w={120} />
                </>
              )}
            </Card>
          </div>
        );
      })}
      {/* regla de años: una marca por año */}
      <Layer>
        {Array.from({length: 30}, (_, i) => {
          if (i >= years) return null;
          const x = 150 + (i / 29) * 780;
          const tall = (i + 1) % 10 === 0;
          return <line key={i} x1={x} x2={x} y1={1250} y2={tall ? 1160 : 1200} stroke={tall ? COLORS.red : COLORS.ink} strokeWidth={tall ? 12 : 8} strokeLinecap="round" />;
        })}
        <line x1={140} x2={140 + ramp(frame, start, stop, (t) => t) * 800} y1={1254} y2={1254} stroke={COLORS.ink} strokeWidth={10} strokeLinecap="round" />
      </Layer>
    </>
  );
};

// ---------------------------------------------------------------------------
/** "After menopause, she becomes the leader": la orca adulta en primer plano, enorme. */
const LeaderClose: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const push = ramp(frame, at('afterMenopause'), at('wholePod'), (t) => t);
  const ring = ramp(frame, at('leaderWord', -2), at('leaderWord', 14));
  return (
    <>
      <LeaderRing cx={560} cy={930} rx={470} ry={300} t={ring} pulse={frame / 8} />
      <Orca p={p} x={620 - push * 30} y={900 + Math.sin(frame / 12) * 8} w={1120 * (1 + 0.08 * push)} rot={-8 + Math.sin(frame / 16) * 1.5} />
    </>
  );
};

// ---------------------------------------------------------------------------
/** "of the whole pod. When the fish disappear, every whale follows her": vista desde arriba. */
type Slot = {x: number; y: number};
const HEADING = 57; // hacia arriba a la derecha
const DIR = {x: Math.sin((HEADING * Math.PI) / 180), y: -Math.cos((HEADING * Math.PI) / 180)};
const TOP_LEADER: Slot = {x: 740, y: 720};
const TOP_SCATTER: Slot[] = [{x: 330, y: 620}, {x: 820, y: 1060}, {x: 170, y: 960}, {x: 520, y: 1200}, {x: 560, y: 830}];
const TOP_V: Slot[] = [{x: 545, y: 780}, {x: 690, y: 950}, {x: 350, y: 850}, {x: 620, y: 1150}, {x: 230, y: 1050}];

const PodFromAbove: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fishIn = ramp(frame, at('fishWord', -6), at('fishWord', 8), easeOut);
  const fishOut = ramp(frame, at('disappearWord', 2), at('disappearWord', 20), (t) => t * t);
  const follow = ramp(frame, at('everyWhaleFollows'), at('everyWhaleFollows', 36));
  const go = (lag: number) => ramp(frame, at('everyWhaleFollows', lag), at('everyWhaleFollows', 40 + lag)) * 110;
  const move = (s: Slot, lag: number): Slot => ({x: s.x + DIR.x * go(lag), y: s.y + DIR.y * go(lag)});
  const lead = move(TOP_LEADER, 0);
  const leadIn = springAt(frame, fps, at('wholePod', -4), 12);
  return (
    <>
      {/* ondas en el agua detrás de cada una */}
      <Layer>
        {[TOP_LEADER, ...TOP_V].map((s, i) => {
          const r = 60 + ((frame * 1.6 + i * 23) % 70);
          return <circle key={i} cx={s.x - DIR.x * 120} cy={s.y - DIR.y * 120} r={r} fill="none" stroke="#9fb4c3" strokeWidth={4} opacity={0.5 * (1 - (r - 60) / 70)} />;
        })}
      </Layer>
      {/* peces por delante del grupo; en "disappear" se retiran */}
      {fishIn > 0 && fishOut < 1 && (
        <Pic id="body.fishSchool" p={p} x={mix(1300, 860, fishIn) + fishOut * 420} y={500 - fishOut * 120} w={440} aspect={3}
          opacity={1 - fishOut} scale={1 - 0.35 * fishOut} rot={-20 - fishOut * 10} />
      )}
      {TOP_SCATTER.map((s, i) => {
        const row = i < 2 ? 1 : i < 4 ? 2 : 3;
        const k = ramp(frame, at('wholePod', -2 + row * 3), at('wholePod', 24 + row * 3));
        const inK = springAt(frame, fps, at('wholePod', -4 + i * 2), 12);
        const base = {x: mix(s.x, TOP_V[i].x, k), y: mix(s.y, TOP_V[i].y, k)};
        const pos = move(base, row * 5);
        const heading = mix(HEADING + (i % 2 ? 40 : -50), HEADING, k);
        return <OrcaTop key={i} x={pos.x} y={pos.y + Math.sin(frame / 10 + i * 1.3) * 5} w={88} heading={heading} sway={frame / 4 + i} scale={inK} />;
      })}
      {follow > 0 && (
        <Layer opacity={follow}>
          {TOP_V.map((s, i) => {
            const row = i < 2 ? 1 : i < 4 ? 2 : 3;
            const a = move(s, row * 5);
            return <line key={i} x1={a.x + DIR.x * 90} y1={a.y + DIR.y * 90} x2={lead.x - DIR.x * 130} y2={lead.y - DIR.y * 130} stroke={COLORS.yellow} strokeWidth={8}
              strokeDasharray="4 22" strokeLinecap="round" opacity={0.9} />;
          })}
        </Layer>
      )}
      <LeaderRing cx={lead.x} cy={lead.y} rx={150} ry={150} t={1} pulse={frame / 8} />
      <OrcaTop x={lead.x} y={lead.y + Math.sin(frame / 11) * 4} w={112} heading={HEADING} sway={frame / 3.5} scale={leadIn} />
    </>
  );
};

// ---------------------------------------------------------------------------
const ROUTE: [Pt, Pt, Pt, Pt] = [[250, 1150], [620, 1260], [480, 640], [880, 560]];

const OldRoute: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = ramp(frame, at('sheRemembers', 12), at('twentyYearsAgo', 2), (t) => t);
  const food = springAt(frame, fps, at('whereTheFood', 4), 12);
  const go = (lag: number) => ramp(frame, at('twentyYearsAgo', 4 + lag), at('twentyYearsAgo', 44 + lag)) * 0.62;
  const lead = bezier(...ROUTE, go(0));
  const podIn = ramp(frame, at('twentyYearsAgo', 0), at('twentyYearsAgo', 14));
  return (
    <>
      <Layer>
        <path d={bezierD(...ROUTE)} fill="none" stroke="rgba(154,118,80,0.25)" strokeWidth={46} strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        <path d={bezierD(...ROUTE)} fill="none" stroke={COLORS.sepia} strokeWidth={12} strokeLinecap="round"
          pathLength={1} strokeDasharray={`0.012 0.018`} strokeDashoffset={0} mask="url(#routeMask)" />
        <defs>
          <mask id="routeMask">
            <path d={bezierD(...ROUTE)} fill="none" stroke="white" strokeWidth={30} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          </mask>
        </defs>
      </Layer>
      {food > 0 && (
        <Pic id="body.fishSchool" p={p} x={860} y={560} w={330} aspect={3} scale={food} filter="sepia(0.9) saturate(0.7)" rot={-4} />
      )}
      {/* el grupo aparece por detrás y va en fila por la misma ruta */}
      {[1, 2, 3].map((i) => {
        const b = bezier(...ROUTE, Math.max(0, go(i * 7) - 0.12 * i));
        return <Orca key={i} p={p} x={b.x - 90 * i} y={b.y + 50 * i} w={150} rot={b.angle * 0.6} opacity={podIn * 0.8} filter="brightness(0.15) sepia(0.6)" />;
      })}
      <LeaderRing cx={lead.x} cy={lead.y + 8} rx={170} ry={100} t={1} pulse={frame / 8} />
      <Orca p={p} x={lead.x} y={lead.y + Math.sin(frame / 10) * 5} w={270} rot={lead.angle * 0.6} />
    </>
  );
};
