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
      {/* tras un hook con corte a juego, la orca ya está en su lugar: sin entrada */}
      <Beat from={0} to={at('nobodyCould')} enter={plan.enter === 'none' ? 'none' : 'pop'} exit="up">
        <Lifeline p={p} at={at} />
      </Beat>
      <Beat from={at('nobodyCould')} to={at('afterMenopause')} enter="up" exit="left">
        <ResearchBoard p={p} at={at} />
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

// ---------------------------------------------------------------------------
// Lámina de investigación: tres familias con las mismas ilustraciones, hilos
// que unen a los miembros de cada una, fichas de observación que se llenan y
// una regla de 30 años. Las crías crecen: son las mismas familias con el tiempo.
type FamilyMember = {kind: 'adult' | CalfKind; x: number; y: number; w: number; left?: boolean};
type Family = {color: string; cx: number; cy: number; rx: number; ry: number; members: FamilyMember[]; card: {x: number; y: number}};
const FAMILIES: Family[] = [
  {color: COLORS.red, cx: 300, cy: 700, rx: 190, ry: 130, card: {x: 190, y: 540},
    members: [{kind: 'adult', x: 300, y: 670, w: 210}, {kind: 'a', x: 230, y: 780, w: 125}, {kind: 'b', x: 390, y: 790, w: 85}]},
  {color: COLORS.blue, cx: 770, cy: 700, rx: 180, ry: 125, card: {x: 900, y: 540},
    members: [{kind: 'adult', x: 790, y: 670, w: 200, left: true}, {kind: 'c', x: 720, y: 785, w: 125, left: true}]},
  {color: COLORS.green, cx: 520, cy: 1010, rx: 210, ry: 125, card: {x: 860, y: 1100},
    members: [{kind: 'adult', x: 500, y: 980, w: 210}, {kind: 'a', x: 640, y: 1070, w: 115}, {kind: 'c', x: 380, y: 1075, w: 115}]},
];

const ResearchBoard: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = at('scientists');
  const stop = at('thirtyYears', 6);
  const years = ramp(frame, start, stop, (t) => t); // 0..1 = año 1..30
  const q = springAt(frame, fps, at('why'), 10) * (1 - ramp(frame, start, start + 8));
  const cards = springAt(frame, fps, at('families', -6), 12);
  const grow = 0.8 + 0.4 * years;
  return (
    <>
      <Card x={540} y={880} w={980} h={820} rot={-0.8} style={{background: '#f7f5ee'}} />
      {[[80, 490], [1000, 490], [80, 1270], [1000, 1270]].map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: x - 13, top: y - 13, width: 26, height: 26, borderRadius: 13, background: COLORS.red, border: `4px solid ${COLORS.ink}`}} />
      ))}
      {FAMILIES.map((fam, fi) => {
        const loop = ramp(frame, start + fi * 4, start + 16 + fi * 4, (t) => t);
        const lines = ramp(frame, start + 14 + fi * 4, start + 28 + fi * 4, (t) => t);
        const adult = fam.members[0];
        return (
          <React.Fragment key={fi}>
            <Layer>
              <ellipse cx={fam.cx} cy={fam.cy} rx={fam.rx} ry={fam.ry} fill="none" stroke={fam.color} strokeWidth={8} strokeDasharray="1" pathLength={1}
                strokeDashoffset={1 - loop} transform={`rotate(-4, ${fam.cx}, ${fam.cy})`} />
              {fam.members.slice(1).map((m, mi) => (
                <line key={mi} x1={adult.x} y1={adult.y + 30} x2={mix(adult.x, m.x, lines)} y2={mix(adult.y + 30, m.y, lines)}
                  stroke={fam.color} strokeWidth={7} strokeLinecap="round" />
              ))}
            </Layer>
            {fam.members.map((m, mi) =>
              m.kind === 'adult' ? (
                <Orca key={mi} p={p} x={m.x} y={m.y + Math.sin(frame / 12 + fi) * 4} w={m.w} flip={m.left} />
              ) : (
                <Calf key={mi} p={p} kind={m.kind} x={m.x} y={m.y + Math.sin(frame / 10 + mi) * 4} w={m.w} scale={grow} facingLeft={m.left} />
              )
            )}
            {q > 0 && (
              <div style={{position: 'absolute', left: fam.cx - 40, top: fam.cy - fam.ry - 70, width: 80, textAlign: 'center', ...font, fontSize: 90, color: COLORS.red,
                transform: `scale(${q}) rotate(${(fi - 1) * 8}deg)`}}>?</div>
            )}
            {cards > 0 && <ObsCard x={fam.card.x} y={fam.card.y} color={fam.color} k={cards} marks={Math.floor(years * 10)} rot={(fi - 1) * 4} />}
          </React.Fragment>
        );
      })}
      {/* regla de 30 años */}
      <Layer>
        <line x1={150} x2={930} y1={1225} y2={1225} stroke={COLORS.ink} strokeWidth={8} strokeLinecap="round" />
        {Array.from({length: 7}, (_, i) => (
          <line key={i} x1={150 + i * 130} x2={150 + i * 130} y1={1225} y2={i % 2 ? 1205 : 1190} stroke={COLORS.ink} strokeWidth={6} strokeLinecap="round" />
        ))}
        <line x1={150} x2={150 + years * 780} y1={1225} y2={1225} stroke={COLORS.yellow} strokeWidth={14} strokeLinecap="round" opacity={years > 0 ? 1 : 0} />
        {years > 0 && <circle cx={150 + years * 780} cy={1225} r={20} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={6} />}
      </Layer>
    </>
  );
};

/** Ficha de observación clavada a la lámina: marcas de conteo que se acumulan. */
const ObsCard: React.FC<{x: number; y: number; color: string; k: number; marks: number; rot: number}> = ({x, y, color, k, marks, rot}) => (
  <div style={{position: 'absolute', left: x - 80, top: y - 48, width: 160, height: 96, background: COLORS.card, border: `4px solid ${COLORS.ink}`, borderTop: `14px solid ${color}`,
    borderRadius: 8, boxShadow: '0 8px 16px rgba(0,0,0,0.18)', transform: `scale(${k}) rotate(${rot}deg)`, boxSizing: 'border-box'}}>
    <svg width={152} height={78} style={{position: 'absolute', left: 0, top: 0}}>
      {Array.from({length: Math.min(10, marks)}, (_, i) => {
        const g = Math.floor(i / 5);
        const j = i % 5;
        return j < 4 ? (
          <line key={i} x1={18 + g * 64 + j * 11} x2={18 + g * 64 + j * 11} y1={18} y2={58} stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" />
        ) : (
          <line key={i} x1={12 + g * 64} x2={60 + g * 64} y1={52} y2={24} stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" />
        );
      })}
    </svg>
  </div>
);

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
