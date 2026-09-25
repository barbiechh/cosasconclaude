import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Calf, Figure, Fin, LeaderRing, Orca, headPoint} from './figures';
import {Layer, Pic, ease, easeOut, font, mix, ramp, springAt} from './kit';
import {COLORS} from '../styles/tokens';
import {HOOK4, hook4CueFrame, secToFrame} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

// Pared del museo: 3 columnas x 4 filas de láminas.
const COLS = [200, 540, 880];
const ROWS = [520, 760, 1000, 1240];
const PLATE = {w: 290, h: 205};
type Kind = 'fish' | 'bird' | 'snail' | 'turtle' | 'butterfly' | 'deer' | 'elephant' | 'frog' | 'beetle' | 'cat' | 'orca' | 'woman';
const WALL: Kind[][] = [
  ['bird', 'butterfly', 'snail'],
  ['orca', 'deer', 'fish'],
  ['turtle', 'elephant', 'woman'],
  ['frog', 'beetle', 'cat'],
];
// Fichas grandes sobre la mesa.
const CARD = {w: 440, h: 560};
const ORCA_CARD = {x: 290, y: 930, r: -4};
const WOMAN_CARD = {x: 790, y: 950, r: 4};
const ORCA_SLOT = {x: COLS[0], y: ROWS[1]};
const WOMAN_SLOT = {x: COLS[2], y: ROWS[2]};
// Pose de la orca en el primer frame del body (escena Orcas, línea de vida en 0).
const BODY_ORCA = {x: 70, y: 750, w: 270};

/**
 * HOOK 4 — museo de historia natural hecho de láminas ilustradas (HOOK4.cues).
 * 1) una luz barre la pared y las láminas se cierran: en "Only two" quedan dos;
 * 2) "Killer whales, and women": caen sobre la mesa como fichas grandes;
 * 3) "One of them comes out of it stronger...": la orca sale de su lámina, el
 *    mar se abre y aparece la manada;
 * 4) "The other one gets told it's just part of getting older": una mano
 *    estampa el sello en la ficha de ella; ella lo aparta y aparece su cerebro;
 * 5) la orca vuelve a la pose con la que empieza el body.
 */
export const Hook4: React.FC<HookProps> = ({usePlaceholder: p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = {
    two: hook4CueFrame('two'),
    peri: hook4CueFrame('peri'),
    killer: hook4CueFrame('killer'),
    whales: hook4CueFrame('whales'),
    women: hook4CueFrame('women'),
    one: hook4CueFrame('one'),
    stronger: hook4CueFrame('stronger'),
    been: hook4CueFrame('been'),
    other: hook4CueFrame('other'),
    told: hook4CueFrame('told'),
    just: hook4CueFrame('just'),
    part: hook4CueFrame('part'),
    getting: hook4CueFrame('getting'),
    older: hook4CueFrame('older'),
  };
  const END = secToFrame(HOOK4.durationSeconds);
  const MATCH_FROM = END - 11;

  // 1) la pared se retira cuando caen las fichas
  const wallOut = ramp(frame, f.killer - 4, f.killer + 12, ease);
  // 2) mesa
  const table = ramp(frame, f.killer - 6, f.killer + 8, easeOut);
  // 3) el mar se abre desde la ficha de la orca y se vuelve a cerrar
  const sea = ramp(frame, f.one, f.stronger - 2, ease) * (1 - ramp(frame, f.other - 2, f.other + 8, ease));
  // 4) cámara hacia la ficha de ella
  const zoom = ramp(frame, f.other, f.other + 12, ease);
  const zs = 1 + 0.45 * zoom;
  const zx = (540 - WOMAN_CARD.x) * zoom;
  const zy = (880 - WOMAN_CARD.y) * zoom;
  const whip = Math.sin(Math.PI * ramp(frame, f.other, f.other + 12)) * 6;
  const out = ramp(frame, MATCH_FROM, MATCH_FROM + 8);
  const match = ramp(frame, MATCH_FROM, END - 1, ease);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: 1 - out, filter: whip > 0.3 ? `blur(${whip}px)` : undefined,
        transform: `translate(${zx}px, ${zy}px) scale(${zs})`, transformOrigin: `${WOMAN_CARD.x}px ${WOMAN_CARD.y}px`}}>
        {/* mesa */}
        {table > 0 && (
          <div style={{position: 'absolute', left: -200, right: -200, top: mix(1950, 520, table), bottom: -400, background: '#d7c09a',
            borderTop: `8px solid ${COLORS.ink}`, boxShadow: 'inset 0 30px 60px rgba(0,0,0,0.15)'}}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 90 + i * 150, height: 4, background: 'rgba(120,90,50,0.25)'}} />
            ))}
          </div>
        )}
        {wallOut < 1 && (
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${-1100 * wallOut}px)`}}>
            <Wall frame={frame} fps={fps} f={f} p={p} />
          </div>
        )}
        <OrcaCard p={p} frame={frame} fps={fps} f={f} sea={sea} />
        <WomanCard p={p} frame={frame} fps={fps} f={f} />
      </AbsoluteFill>

      {/* 3) el mar y la manada, por encima de todo mientras dura */}
      {sea > 0 && <Sea p={p} frame={frame} f={f} k={sea} />}

      {/* 4) la mano con el sello entra desde fuera del cuadro */}
      <StampHand frame={frame} f={f} />

      {/* 5) la orca vuelve a su pose del body */}
      {frame >= MATCH_FROM && (
        <Orca p={p} x={mix(-260, BODY_ORCA.x, match)} y={mix(880, BODY_ORCA.y, match)} w={mix(420, BODY_ORCA.w, match)} rot={mix(-10, 0, match)} />
      )}
    </AbsoluteFill>
  );
};

type F = Record<string, number>;

// ---------------------------------------------------------------------------
/** Pared de láminas: una luz barre y se cierran todas menos dos. */
const Wall: React.FC<{frame: number; fps: number; f: F; p: boolean}> = ({frame, fps, f, p}) => {
  const sweep = ramp(frame, 0, f.two, (t) => t); // 0..1 diagonal
  const dark = ramp(frame, 2, f.two + 2);
  const placard = springAt(frame, fps, f.peri, 11);
  const glow = 0.8 + 0.2 * Math.sin(frame / 6);
  return (
    <>
      {/* penumbra del museo */}
      <div style={{position: 'absolute', inset: 0, background: `rgba(22,20,18,${0.55 * dark})`}} />
      {WALL.map((row, r) =>
        row.map((kind, c) => {
          const x = COLS[c];
          const y = ROWS[r];
          const keep = kind === 'orca' || kind === 'woman';
          // orden del barrido: diagonal de arriba-izquierda a abajo-derecha
          const order = (c + r * 1.2) / (2 + 3 * 1.2);
          const closeAt = Math.round(order * (f.two - 3)) + 1;
          const shut = keep ? 0 : ramp(frame, closeAt, closeAt + 4, easeOut);
          if (keep && frame >= f.killer) return null; // ya son fichas en la mesa
          return (
            <React.Fragment key={`${r}-${c}`}>
              {keep && dark > 0 && (
                <div style={{position: 'absolute', left: x - 260, top: y - 330, width: 520, height: 520, borderRadius: '50%', opacity: dark * glow,
                  background: 'radial-gradient(circle at 50% 55%, rgba(255,240,190,0.75) 0%, rgba(255,240,190,0.25) 40%, rgba(255,240,190,0) 70%)'}} />
              )}
              <Plate x={x} y={y} kind={kind} p={p} shut={shut} />
            </React.Fragment>
          );
        })
      )}
      {/* la luz que recorre la pared */}
      {sweep < 1 && (
        <div style={{position: 'absolute', left: mix(-500, 1300, sweep) - 250, top: mix(300, 1450, sweep) - 400, width: 500, height: 800, borderRadius: '50%',
          transform: 'rotate(-35deg)', background: 'radial-gradient(ellipse, rgba(255,245,210,0.85) 0%, rgba(255,245,210,0) 65%)'}} />
      )}
      {/* placa del museo */}
      {placard > 0 && (
        <div style={{position: 'absolute', left: 540 - 250, top: 880 - 48, width: 500, height: 96, borderRadius: 12, background: COLORS.yellow,
          border: `6px solid ${COLORS.ink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: 52,
          color: COLORS.ink, transform: `scale(${placard})`, boxShadow: '0 12px 24px rgba(0,0,0,0.35)'}}>
          PERIMENOPAUSE
        </div>
      )}
    </>
  );
};

/** Una lámina enmarcada; `shut` baja una tapa sobre ella. */
const Plate: React.FC<{x: number; y: number; kind: Kind; p: boolean; shut: number}> = ({x, y, kind, p, shut}) => (
  <div style={{position: 'absolute', left: x - PLATE.w / 2, top: y - PLATE.h / 2, width: PLATE.w, height: PLATE.h, background: '#fbf7ec',
    border: `8px solid ${COLORS.inkSoft}`, boxShadow: '0 10px 18px rgba(0,0,0,0.3)', boxSizing: 'border-box', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 8, border: '2px solid #d9cba6'}} />
    <Specimen kind={kind} p={p} />
    {shut > 0 && (
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: `${shut * 100}%`, background: '#2c2824', borderBottom: `6px solid ${COLORS.ink}`}}>
        <div style={{position: 'absolute', left: '44%', bottom: 14, width: '12%', height: 8, borderRadius: 4, background: '#b8964f', opacity: shut}} />
      </div>
    )}
  </div>
);

/** Ilustraciones de las láminas (silueta a tinta, como grabados de museo). */
const Specimen: React.FC<{kind: Kind; p: boolean}> = ({kind, p}) => {
  const W = PLATE.w - 16;
  const H = PLATE.h - 16;
  if (kind === 'orca') return <Orca p={p} x={W / 2 + 8} y={H / 2 + 12} w={170} />;
  if (kind === 'woman') return <Figure x={W / 2 + 8} y={H + 2} h={170} />;
  if (kind === 'fish') return <Pic id="body.fishSchool" p={p} x={W / 2 + 8} y={H / 2 + 8} w={230} aspect={3} shadow={false} />;
  const ink = COLORS.inkSoft;
  const shapes: Record<string, React.ReactNode> = {
    bird: (<><ellipse cx={130} cy={100} rx={48} ry={30} fill={ink} /><circle cx={178} cy={78} r={18} fill={ink} /><path d="M 194 78 L 214 84 L 194 88 Z" fill={COLORS.yellow} /><path d="M 100 92 Q 130 40 170 92 Z" fill="#5d564b" /><path d="M 84 100 L 50 88 L 60 112 Z" fill={ink} /><line x1={120} y1={128} x2={116} y2={156} stroke={ink} strokeWidth={5} /><line x1={140} y1={128} x2={144} y2={156} stroke={ink} strokeWidth={5} /></>),
    butterfly: (<><ellipse cx={137} cy={95} rx={6} ry={40} fill={ink} /><path d="M 131 80 C 80 20 50 70 90 100 C 60 130 100 150 131 110 Z" fill="#5d564b" /><path d="M 143 80 C 194 20 224 70 184 100 C 214 130 174 150 143 110 Z" fill="#5d564b" /><circle cx={100} cy={72} r={9} fill={COLORS.yellow} /><circle cx={174} cy={72} r={9} fill={COLORS.yellow} /></>),
    snail: (<><path d="M 60 140 L 210 140 Q 225 140 222 128 L 200 124 Z" fill={ink} /><circle cx={130} cy={100} r={42} fill="#5d564b" /><path d="M 130 100 m -8 0 a 8 8 0 1 1 16 0 a 18 18 0 1 1 -34 0 a 28 28 0 1 1 54 0" fill="none" stroke="#fbf7ec" strokeWidth={5} /><line x1={206} y1={124} x2={214} y2={92} stroke={ink} strokeWidth={5} /><line x1={216} y1={126} x2={230} y2={98} stroke={ink} strokeWidth={5} /></>),
    turtle: (<><path d="M 70 118 Q 137 20 204 118 Z" fill="#5d564b" /><path d="M 90 118 L 100 96 L 137 86 L 174 96 L 184 118" fill="none" stroke="#fbf7ec" strokeWidth={4} /><rect x={62} y={114} width={150} height={12} rx={6} fill={ink} /><circle cx={222} cy={112} r={14} fill={ink} /><rect x={86} y={122} width={16} height={22} rx={6} fill={ink} /><rect x={172} y={122} width={16} height={22} rx={6} fill={ink} /></>),
    deer: (<><ellipse cx={128} cy={104} rx={56} ry={26} fill={ink} /><rect x={172} y={50} width={16} height={50} rx={6} fill={ink} transform="rotate(20 180 75)" /><ellipse cx={196} cy={48} rx={20} ry={12} fill={ink} /><path d="M 190 36 L 176 8 M 184 22 L 168 18 M 200 36 L 214 8 M 208 22 L 224 16" stroke={ink} strokeWidth={5} /><path d="M 88 124 L 84 160 M 104 126 L 106 160 M 152 126 L 150 160 M 166 124 L 172 160" stroke={ink} strokeWidth={8} strokeLinecap="round" /></>),
    elephant: (<><ellipse cx={126} cy={96} rx={70} ry={44} fill={ink} /><circle cx={196} cy={80} r={30} fill={ink} /><path d="M 216 88 Q 236 120 220 150" fill="none" stroke={ink} strokeWidth={14} strokeLinecap="round" /><ellipse cx={184} cy={80} rx={16} ry={22} fill="#5d564b" /><rect x={74} y={120} width={22} height={38} rx={6} fill={ink} /><rect x={150} y={120} width={22} height={38} rx={6} fill={ink} /></>),
    frog: (<><ellipse cx={137} cy={110} rx={62} ry={38} fill="#5d564b" /><circle cx={112} cy={72} r={16} fill={ink} /><circle cx={162} cy={72} r={16} fill={ink} /><circle cx={112} cy={72} r={6} fill={COLORS.yellow} /><circle cx={162} cy={72} r={6} fill={COLORS.yellow} /><path d="M 80 136 Q 60 150 90 152 M 194 136 Q 214 150 184 152" stroke={ink} strokeWidth={8} fill="none" strokeLinecap="round" /></>),
    beetle: (<><ellipse cx={137} cy={100} rx={40} ry={52} fill={ink} /><line x1={137} y1={52} x2={137} y2={152} stroke="#fbf7ec" strokeWidth={4} /><circle cx={137} cy={44} r={16} fill={ink} /><path d="M 100 80 L 70 66 M 98 104 L 64 104 M 100 128 L 70 144 M 174 80 L 204 66 M 176 104 L 210 104 M 174 128 L 204 144" stroke={ink} strokeWidth={5} /></>),
    cat: (<><ellipse cx={120} cy={116} rx={52} ry={32} fill={ink} /><circle cx={176} cy={84} r={26} fill={ink} /><path d="M 160 66 L 164 42 L 178 60 Z M 186 60 L 198 40 L 200 68 Z" fill={ink} /><path d="M 70 116 Q 40 100 56 70" fill="none" stroke={ink} strokeWidth={10} strokeLinecap="round" /><circle cx={168} cy={82} r={4} fill={COLORS.yellow} /><circle cx={186} cy={82} r={4} fill={COLORS.yellow} /></>),
  };
  return (
    <svg width={W} height={H} viewBox="0 0 274 189" style={{position: 'absolute', left: 8, top: 8}}>
      {shapes[kind]}
    </svg>
  );
};

// ---------------------------------------------------------------------------
/** Ficha grande: marco de museo con la ilustración y una etiqueta en blanco. */
const Card: React.FC<{x: number; y: number; r: number; scale: number; children: React.ReactNode}> = ({x, y, r, scale, children}) => (
  <div style={{position: 'absolute', left: x - CARD.w / 2, top: y - CARD.h / 2, width: CARD.w, height: CARD.h, background: '#fbf7ec',
    border: `9px solid ${COLORS.inkSoft}`, boxSizing: 'border-box', boxShadow: '0 20px 30px rgba(0,0,0,0.3)', transform: `rotate(${r}deg) scale(${scale})`}}>
    <div style={{position: 'absolute', inset: 12, border: '3px solid #d9cba6'}} />
    <div style={{position: 'absolute', left: 60, right: 60, bottom: 34, height: 10, borderRadius: 5, background: '#d9cba6'}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: CARD.w - 18, height: CARD.h - 18}}>{children}</div>
  </div>
);

/** Posición de una lámina: de su hueco en la pared a la mesa, con caída. */
const fallPose = (frame: number, fps: number, from: number, slot: {x: number; y: number}, to: {x: number; y: number; r: number}) => {
  const k = frame < from ? 0 : Math.min(1, springAt(frame, fps, from, 16, 170));
  const drop = ramp(frame, from, from + 10, (t) => t * t);
  return {
    x: mix(slot.x, to.x, drop),
    y: mix(slot.y, to.y, drop) - Math.sin(Math.PI * drop) * 120,
    r: mix(0, to.r, k),
    s: mix(PLATE.w / CARD.w, 1, drop) * (1 + 0.04 * Math.sin(Math.PI * ramp(frame, from + 10, from + 16))),
  };
};

const OrcaCard: React.FC<{p: boolean; frame: number; fps: number; f: F; sea: number}> = ({p, frame, fps, f, sea}) => {
  if (frame < f.killer) return null;
  const pose = fallPose(frame, fps, f.killer - 6, ORCA_SLOT, ORCA_CARD);
  const away = frame >= f.one && frame < f.other + 4; // la orca está fuera, en el mar
  return (
    <Card x={pose.x} y={pose.y} r={pose.r} scale={pose.s}>
      {[0, 1].map((i) => (
        <svg key={i} width={420} height={60} style={{position: 'absolute', left: 30, top: 330 + i * 30}}>
          <path d="M 0 30 q 30 -12 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0" fill="none" stroke="#9fb7c0" strokeWidth={5} strokeLinecap="round" />
        </svg>
      ))}
      {!away && <Orca p={p} x={(CARD.w - 18) / 2} y={250 + Math.sin(frame / 10) * 5} w={330 * (1 - sea * 0.3)} />}
    </Card>
  );
};

const WomanCard: React.FC<{p: boolean; frame: number; fps: number; f: F}> = ({p, frame, fps, f}) => {
  if (frame < f.killer) return null;
  const pose = frame < f.women - 6 ? {x: WOMAN_SLOT.x, y: WOMAN_SLOT.y, r: 0, s: PLATE.w / CARD.w} : fallPose(frame, fps, f.women - 6, WOMAN_SLOT, WOMAN_CARD);
  // el sello (una etiqueta estampada) y cómo ella la aparta
  const stamped = frame >= f.just;
  const slam = springAt(frame, fps, f.just, 9, 260);
  const push = ramp(frame, f.getting - 2, f.older + 8, ease);
  const arm = 8 + 70 * ramp(frame, f.getting - 4, f.getting + 6) * (1 - ramp(frame, f.older + 10, f.older + 18));
  const brain = springAt(frame, fps, f.getting + 4, 12);
  const W = CARD.w - 18;
  const feet = 470;
  const h = 330;
  const head = headPoint(W / 2, feet, h);
  return (
    <>
      {frame >= f.women - 6 && (
        <Card x={pose.x} y={pose.y} r={pose.r} scale={pose.s}>
          {brain > 0 && (
            <>
              <div style={{position: 'absolute', left: W / 2 - 110, top: head[1] - 190, width: 220, height: 160, borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(244,201,58,0.45) 0%, rgba(244,201,58,0) 70%)', opacity: brain}} />
              <Pic id="body.brainDiagram" p={p} x={W / 2} y={head[1] - 115} w={190} aspect={1.5} scale={brain} />
            </>
          )}
          <Figure x={W / 2} y={feet} h={h} armR={arm} tilt={push * -4} />
          {stamped && (
            <div style={{position: 'absolute', left: W / 2 - 185 + push * 360, top: head[1] - 175 + push * 140, width: 370, height: 190,
              transform: `rotate(${-7 + push * 38}deg) scale(${1.25 - 0.25 * slam})`, opacity: 1 - ramp(frame, f.older + 6, f.older + 12)}}>
              <div style={{position: 'absolute', inset: 0, background: '#fffdf8', boxShadow: '0 8px 16px rgba(0,0,0,0.25)'}} />
              <div style={{position: 'absolute', inset: 16, border: `7px solid ${COLORS.red}`, borderRadius: 10, display: 'flex', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center', ...font, fontSize: 34, lineHeight: 1.12, color: COLORS.red, letterSpacing: 1, opacity: 0.92}}>
                JUST PART OF<br />GETTING OLDER
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
/** El mar se abre desde la ficha de la orca; ella nada y aparece la manada. */
const Sea: React.FC<{p: boolean; frame: number; f: F; k: number}> = ({p, frame, f, k}) => {
  // recorte que crece desde el rectángulo de la ficha hasta todo el cuadro
  const l = mix(ORCA_CARD.x - CARD.w / 2, 0, k);
  const r = mix(1080 - (ORCA_CARD.x + CARD.w / 2), 0, k);
  const t = mix(ORCA_CARD.y - CARD.h / 2, 0, k);
  const b = mix(1920 - (ORCA_CARD.y + CARD.h / 2), 0, k);
  const swim = ramp(frame, f.one, f.other, (u) => u);
  const ox = mix(290, 800, swim);
  const oy = mix(930, 720, easeOut(swim));
  const ow = mix(330, 440, swim);
  const pod = (d: number) => Math.min(1, Math.max(0, (frame - d) / 8));
  const members = [
    {at: f.stronger - 4, el: (x: number) => <Fin x={x - 330} y={760} h={90} opacity={0.85} />},
    {at: f.stronger + 2, el: (x: number) => <Calf p={p} kind="a" x={x - 260} y={900} w={170} />},
    {at: f.stronger + 10, el: (x: number) => <Fin x={x - 520} y={880} h={110} opacity={0.85} />},
    {at: f.stronger + 16, el: (x: number) => <Calf p={p} kind="c" x={x - 450} y={1040} w={160} />},
    {at: f.stronger + 24, el: (x: number) => <Fin x={x - 640} y={1010} h={80} opacity={0.7} />},
    {at: f.stronger + 30, el: (x: number) => <Orca p={p} x={x - 600} y={690} w={200} opacity={0.9} />},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, clipPath: `inset(${t}px ${r}px ${b}px ${l}px)`}}>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #dfe9ec 0%, #cddde2 55%, #bccfd6 100%)'}} />
      <Layer>
        {[560, 700, 860, 1020, 1180, 1320].map((y, i) => {
          const off = ((frame * (3 + i * 0.6)) % 120);
          let d = `M ${-off} ${y}`;
          for (let x = -off; x < 1200; x += 60) d += ` q 30 ${i % 2 ? 10 : -10} 60 0`;
          return <path key={i} d={d} fill="none" stroke="#9fb7c0" strokeWidth={5} strokeLinecap="round" opacity={0.8} />;
        })}
        {/* estela de velocidad */}
        {[0, 1, 2].map((i) => (
          <line key={i} x1={ox - 230 - i * 70} x2={ox - 150 - i * 70} y1={oy + (i - 1) * 40} y2={oy + (i - 1) * 40} stroke="#fffdf8" strokeWidth={10} strokeLinecap="round" opacity={0.8 - i * 0.2} />
        ))}
      </Layer>
      {members.map((m, i) => (
        <div key={i} style={{position: 'absolute', inset: 0, opacity: pod(m.at), transform: `translateX(${(1 - pod(m.at)) * -80}px)`}}>{m.el(ox)}</div>
      ))}
      <LeaderRing cx={ox} cy={oy + 10} rx={ow * 0.62} ry={ow * 0.36} t={ramp(frame, f.been - 4, f.been + 10)} pulse={frame / 8} />
      <Orca p={p} x={ox} y={oy + Math.sin(frame / 7) * 8} w={ow} rot={-6 + Math.sin(frame / 9) * 3} />
    </div>
  );
};

// ---------------------------------------------------------------------------
/** Mano ilustrada con un sello de goma: entra, estampa y se va. */
const StampHand: React.FC<{frame: number; f: F}> = ({frame, f}) => {
  const inn = ramp(frame, f.told - 4, f.just - 3, easeOut);
  const hit = ramp(frame, f.just - 3, f.just, (t) => t * t);
  const outK = ramp(frame, f.just + 2, f.just + 12, ease);
  if (inn <= 0 || outK >= 1) return null;
  // destino: el caucho del sello cae sobre la etiqueta (centro ~ (556, 654) en
  // pantalla con la cámara sobre la ficha de ella); el caucho está 140 px bajo la mano.
  const TX = 556;
  const TY = 654 - 140;
  const x = mix(1300, TX, inn) + outK * 700;
  const y = mix(380, TY - 150, inn) + hit * 150 - outK * 520;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${x}, ${y}) rotate(${-12 + hit * 10})`}>
        {/* sello */}
        <rect x={-120} y={120} width={240} height={40} rx={8} fill={COLORS.red} stroke={COLORS.ink} strokeWidth={6} />
        <rect x={-100} y={96} width={200} height={30} rx={6} fill="#8a6a44" stroke={COLORS.ink} strokeWidth={6} />
        <rect x={-18} y={20} width={36} height={80} rx={12} fill="#8a6a44" stroke={COLORS.ink} strokeWidth={6} />
        <circle cx={0} cy={14} r={36} fill="#8a6a44" stroke={COLORS.ink} strokeWidth={6} />
        {/* mano y manga */}
        <path d="M -60 -20 Q -70 -70 -30 -80 L 50 -80 Q 80 -70 70 -20 Q 60 30 20 34 L -30 34 Q -60 26 -60 -20 Z" fill={COLORS.skin} stroke={COLORS.ink} strokeWidth={6} />
        <path d="M -64 -10 Q -96 -4 -90 22 Q -84 40 -52 30" fill={COLORS.skin} stroke={COLORS.ink} strokeWidth={6} />
        <rect x={-50} y={-260} width={110} height={190} rx={18} fill={COLORS.grey} stroke={COLORS.ink} strokeWidth={6} transform="rotate(8)" />
      </g>
    </svg>
  );
};
