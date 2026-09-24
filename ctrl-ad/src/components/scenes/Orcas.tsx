/**
 * "Around forty she stops having babies ... twenty years ago."
 * 1) línea de vida que se sigue alargando después de la etapa reproductiva,
 * 2) fichas de observación y marcas de años que se acumulan,
 * 3) el grupo: la mayor pasa al frente y el resto se ordena detrás; los peces se van,
 * 4) la ruta vieja: ella la sigue y el grupo la sigue a ella.
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Card, Layer, Pic, Pt, bezier, bezierD, easeOut, font, mix, ramp, springAt} from '../kit';
import {Calf, CalfKind, Fin, LeaderRing, Orca, Waves} from '../figures';
import {Scene, SceneProps} from './SceneFrame';

const LINE_Y = 900;
const CALVES: {kind: CalfKind; age: number; w: number}[] = [
  {kind: 'a', age: 7, w: 200},
  {kind: 'b', age: 20, w: 135},
  {kind: 'c', age: 33, w: 195},
];
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
      <Beat from={at('afterMenopause')} to={at('sheRemembers')} enter="fade" exit="fade">
        <PodFormation p={p} at={at} />
      </Beat>
      <Beat from={at('sheRemembers')} to={end} enter="pop" exit="fade">
        <OldRoute p={p} at={at} />
      </Beat>
    </Scene>
  );
};

type At = SceneProps['plan']['at'];

// ---------------------------------------------------------------------------
const Lifeline: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = ramp(frame, 2, at('forty', 8), easeOut); // 0 -> 40
  const second = ramp(frame, at('livesToNinety'), at('ninety', 8)); // 40 -> 90
  const age = second > 0 ? mix(40, 90, second) : 40 * first;
  const cap = springAt(frame, fps, at('babies'), 9);
  const bracket = ramp(frame, at('nobodyCould'), at('nobodyCould', 14));
  const tipX = ageX(age);
  // las crías que ya tuvo la acompañan; después de los 40 no llega ninguna nueva
  const follow = ramp(frame, at('livesToNinety', -4), at('livesToNinety', 16));
  const slot = springAt(frame, fps, at('babies', 4), 12) * (1 - ramp(frame, at('livesToNinety', 4), at('livesToNinety', 14)));
  return (
    <>
      <Layer>
        <line x1={ageX(0)} x2={ageX(40 * first)} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.ink} strokeWidth={30} strokeLinecap="round" />
        <line x1={ageX(0)} x2={ageX(40 * first)} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.yellow} strokeWidth={16} strokeLinecap="round" />
        {second > 0 && <line x1={ageX(40)} x2={ageX(age)} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.ink} strokeWidth={16} strokeLinecap="round" />}
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
      <div style={{position: 'absolute', left: ageX(40) - 90, top: LINE_Y + 265, width: 180, textAlign: 'center', ...font, fontSize: 70, color: COLORS.ink, opacity: first}}>40</div>
      {second > 0.6 && (
        <div style={{position: 'absolute', left: ageX(90) - 110, top: LINE_Y + 40, width: 180, textAlign: 'center', ...font, fontSize: 70, color: COLORS.ink,
          transform: `scale(${springAt(frame, fps, at('ninety'), 10)})`}}>90</div>
      )}
      {/* crías nacidas antes de los 40: aparecen en su edad y luego nadan con ella */}
      {CALVES.map((c, i) => {
        const k = springAt(frame, fps, at('stopsHaving', i * 6), 11);
        if (k <= 0) return null;
        const x = mix(ageX(c.age), tipX - 260 - i * 190, follow);
        const y = LINE_Y + (i % 2 ? 200 : 115) + Math.sin(frame / 8 + i * 2) * 7;
        return <Calf key={c.kind} p={p} kind={c.kind} x={x} y={y} w={c.w} scale={k} rot={Math.sin(frame / 10 + i) * 3} />;
      })}
      {/* el hueco de después de los 40 queda vacío */}
      {slot > 0.01 && (
        <div style={{position: 'absolute', left: ageX(49) - 95, top: LINE_Y + 75, width: 190, height: 90, borderRadius: 40,
          border: `6px dashed ${COLORS.grey}`, transform: `scale(${slot})`, opacity: Math.min(1, slot * 1.5)}} />
      )}
      <Orca p={p} x={tipX - 60} y={LINE_Y - 150 + Math.sin(frame / 7) * 6} w={270} rot={Math.sin(frame / 9) * 3} />
    </>
  );
};

// [desplazamiento x, desplazamiento y, zoom] de cada foto
const CROPS: [number, number, number][] = [[0, 0, 1.05], [-150, 60, 1.7], [120, -20, 1.5], [-60, 90, 2.1], [200, 30, 1.8], [0, 20, 1.25]];

// ---------------------------------------------------------------------------
const Observation: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = at('scientists');
  const stop = at('thirtyYears', 6);
  const cards = CROPS.length;
  const years = Math.floor(mix(1, 30, ramp(frame, start, stop, (t) => t)));
  return (
    <>
      {Array.from({length: cards}, (_, i) => {
        const t0 = start + Math.round(((stop - start) * i) / cards);
        const k = springAt(frame, fps, t0, 15);
        if (k <= 0) return null;
        const x = 540 + (i - 2.5) * 18;
        const y = 800 - i * 14;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, transform: `translate(${(1 - k) * 700}px, ${(1 - k) * -80}px)`, opacity: Math.min(1, k * 2)}}>
            <Card x={x} y={y} w={560} h={380} rot={(i % 2 ? 1 : -1) * (2 + i * 0.6)}>
              {/* la misma familia en cada ficha, con otro encuadre */}
              <div style={{position: 'absolute', left: 18, top: 18, width: 514, height: 300, overflow: 'hidden', borderRadius: 6}}>
                <Pic id="body.orcaLeaderPod" p={p} x={257 + CROPS[i][0]} y={150 + CROPS[i][1]} w={514 * CROPS[i][2]} aspect={1672 / 941} shadow={false} />
              </div>
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
          return <line key={i} x1={x} x2={x} y1={1180} y2={tall ? 1090 : 1130} stroke={tall ? COLORS.red : COLORS.ink} strokeWidth={tall ? 12 : 8} strokeLinecap="round" />;
        })}
        <line x1={140} x2={140 + ramp(frame, start, stop, (t) => t) * 800} y1={1184} y2={1184} stroke={COLORS.ink} strokeWidth={10} strokeLinecap="round" />
      </Layer>
    </>
  );
};

// ---------------------------------------------------------------------------
// El grupo en la superficie: olas, aletas lejanas, dos adultas y las tres crías.
type Slot = {x: number; y: number};
type Member = {from: Slot; to: Slot; row: number} & ({kind: 'adult'; w: number} | {kind: CalfKind; w: number});
const LEADER_START: Slot = {x: 380, y: 980};
const LEADER_FRONT: Slot = {x: 790, y: 900};
const MEMBERS: Member[] = [
  {kind: 'adult', w: 210, from: {x: 700, y: 790}, to: {x: 540, y: 800}, row: 1},
  {kind: 'a', w: 195, from: {x: 600, y: 1150}, to: {x: 560, y: 1040}, row: 1},
  {kind: 'adult', w: 180, from: {x: 170, y: 860}, to: {x: 300, y: 860}, row: 2},
  {kind: 'c', w: 185, from: {x: 240, y: 1110}, to: {x: 360, y: 1090}, row: 2},
  {kind: 'b', w: 130, from: {x: 880, y: 1150}, to: {x: 160, y: 1010}, row: 3},
];
const FAR_FINS = [{x: 150, y: 700, h: 70}, {x: 290, y: 675, h: 58}, {x: 420, y: 705, h: 74}];

const PodFormation: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const toFront = ramp(frame, at('leaderWord', -4), at('leaderWord', 20));
  const ring = ramp(frame, at('leaderWord', 4), at('leaderWord', 22));
  const follow = ramp(frame, at('everyWhaleFollows'), at('everyWhaleFollows', 36));
  const fishIn = ramp(frame, at('fishWord', -6), at('fishWord', 8), easeOut);
  const fishOut = ramp(frame, at('disappearWord', 2), at('disappearWord', 20), (t) => t * t);
  const shift = (lag: number) => ramp(frame, at('everyWhaleFollows', lag), at('everyWhaleFollows', 30 + lag));
  const move = (s: Slot, lag: number): Slot => ({x: s.x + shift(lag) * 80, y: s.y - shift(lag) * 50});
  const lead = move({x: mix(LEADER_START.x, LEADER_FRONT.x, toFront), y: mix(LEADER_START.y, LEADER_FRONT.y, toFront)}, 0);
  // al seguirla, el mar corre más rápido
  const sea = frame * (1 + 2 * follow);
  return (
    <>
      <Waves ys={[740, 880, 1020, 1160, 1260]} t={sea} />
      {FAR_FINS.map((f, i) => {
        const q = move(f, 14 + i * 3);
        return <Fin key={i} x={q.x + Math.sin(frame / 14 + i) * 5} y={q.y} h={f.h} opacity={0.55} tilt={Math.sin(frame / 11 + i) * 3} />;
      })}
      {fishIn > 0 && fishOut < 1 && (
        <Pic id="body.fishSchool" p={p} x={mix(1300, 760, fishIn) + fishOut * 520} y={560 - fishOut * 60} w={560} aspect={3}
          opacity={1 - fishOut} scale={1 - 0.3 * fishOut} rot={-fishOut * 8} />
      )}
      {MEMBERS.map((m, i) => {
        const k = ramp(frame, at('wholePod', -6 + m.row * 3), at('wholePod', 22 + m.row * 3));
        const base = {x: mix(m.from.x, m.to.x, k), y: mix(m.from.y, m.to.y, k)};
        const pos = move(base, m.row * 5);
        const bob = Math.sin(frame / 9 + i * 1.3) * 7;
        return m.kind === 'adult' ? (
          <Orca key={i} p={p} x={pos.x} y={pos.y + bob} w={m.w} rot={Math.sin(frame / 13 + i) * 3} />
        ) : (
          <Calf key={i} p={p} kind={m.kind} x={pos.x} y={pos.y + bob} w={m.w} rot={Math.sin(frame / 10 + i) * 4} />
        );
      })}
      {follow > 0 && (
        <Layer opacity={follow}>
          {MEMBERS.map((m, i) => {
            const a = move(m.to, m.row * 5);
            return <line key={i} x1={a.x + m.w * 0.45} y1={a.y} x2={lead.x - 90} y2={lead.y} stroke={COLORS.yellow} strokeWidth={8} strokeDasharray="4 22" strokeLinecap="round" opacity={0.9} />;
          })}
        </Layer>
      )}
      <LeaderRing cx={lead.x} cy={lead.y + 10} rx={200} ry={120} t={ring} pulse={frame / 8} />
      <Orca p={p} x={lead.x} y={lead.y + Math.sin(frame / 11) * 6} w={mix(260, 310, toFront)} rot={Math.sin(frame / 14) * 2} />
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
        const x = b.x - 90 * i;
        const y = b.y + 50 * i;
        return i === 1 ? (
          <Calf key={i} p={p} kind="a" x={x} y={y} w={140} rot={b.angle * 0.5} opacity={podIn} />
        ) : (
          <Fin key={i} x={x} y={y + 30} h={80} opacity={podIn} tilt={b.angle * 0.3} />
        );
      })}
      <LeaderRing cx={lead.x} cy={lead.y + 8} rx={170} ry={100} t={1} pulse={frame / 8} />
      <Orca p={p} x={lead.x} y={lead.y + Math.sin(frame / 10) * 5} w={270} rot={lead.angle * 0.6} />
    </>
  );
};
