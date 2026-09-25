import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Calf, Figure, Fin, Orca, headPoint} from './figures';
import {Rays} from './mechanisms';
import {Layer, Pic, ease, easeOut, font, mix, ramp, springAt} from './kit';
import {COLORS} from '../styles/tokens';
import {HOOK3, hook3CueFrame, secToFrame} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

// Libro abierto (coordenadas del libro = coordenadas del cuadro con cámara en reposo).
const BOOK = {left: 20, right: 1060, top: 520, bottom: 1262};
const PAGE = {top: 540, bottom: 1238, gutter: 540, left: 40, right: 1040};
const LINE_Y = 1140; // línea de tiempo que cruza las dos páginas
const ORCA = {x: 290, y: 835, w: 340};
const WOMAN = {x: 790, feet: 1050, h: 380};
const BRAIN_L = {x: 300, y: 610};
const BRAIN_R = {x: 790, y: 575};
// Pose de la orca en el primer frame del body (escena Orcas, línea de vida en 0).
const BODY_ORCA = {x: 70, y: 750, w: 270};

type Cam = {x: number; y: number; s: number};
const mixCam = (a: Cam, b: Cam, t: number): Cam => ({x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: mix(a.s, b.s, t)});

/**
 * HOOK 3 — doble página de libro ilustrado que cobra vida (tiempos en HOOK3.cues).
 * 1) orca en una página, mujer en la otra; una línea de tiempo cruza el libro y
 *    las dos llegan juntas a la marca PERIMENOPAUSE en "same age";
 * 2) "For one of them": la cámara se acerca, aparecen dos cerebros y la duda;
 * 3) "the best thing...": la página de la orca se enciende (conexiones, rutas,
 *    la manada);
 * 4) "For the other...": giro a la página de ella; agenda incompleta, notas y
 *    una palabra que se escapa; la página pierde el orden;
 * 5) la orca vuelve volando a la pose con la que empieza el body.
 */
export const Hook3: React.FC<HookProps> = ({usePlaceholder: p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = {
    hits: hook3CueFrame('hits'),
    killer: hook3CueFrame('killer'),
    women: hook3CueFrame('women'),
    exactly: hook3CueFrame('exactly'),
    age: hook3CueFrame('age'),
    forOne: hook3CueFrame('forOne'),
    them: hook3CueFrame('them'),
    best: hook3CueFrame('best'),
    happens: hook3CueFrame('happens'),
    brain: hook3CueFrame('brain'),
    forOther: hook3CueFrame('forOther'),
    other: hook3CueFrame('other'),
    years: hook3CueFrame('years'),
    rather: hook3CueFrame('rather'),
    forget: hook3CueFrame('forget'),
  };
  // El hook termina (sin solape) donde empieza el body.
  const END = secToFrame(HOOK3.durationSeconds);
  const MATCH_FROM = END - 15;

  // Cámara
  let cam: Cam = {x: 540, y: 900, s: 1};
  cam = mixCam(cam, {x: 540, y: 830, s: 1.25}, ramp(frame, f.forOne, f.forOne + 14));
  cam = mixCam(cam, {x: 300, y: 800, s: 1.95}, ramp(frame, f.best - 2, f.best + 14));
  cam = mixCam(cam, {x: 790, y: 790, s: 1.95}, ramp(frame, f.forOther - 2, f.forOther + 10, ease));
  const whip = Math.sin(Math.PI * ramp(frame, f.forOther - 2, f.forOther + 10)) * 6; // desenfoque del giro
  const match = ramp(frame, MATCH_FROM, END - 1, ease);

  const open = ramp(frame, 0, 12, easeOut);
  const bookOut = ramp(frame, MATCH_FROM, MATCH_FROM + 10);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: 1 - bookOut, filter: whip > 0.3 ? `blur(${whip}px)` : undefined,
        transform: `translate(540px, 900px) scale(${cam.s * (1 - 0.15 * bookOut)}) translate(${-cam.x}px, ${-cam.y}px)`, transformOrigin: '0 0'}}>
        <Book open={open} disorder={ramp(frame, f.other, f.forget + 10, (t) => t)} frame={frame} />
        <OrcaPage p={p} frame={frame} fps={fps} f={f} hideOrca={frame >= MATCH_FROM} />
        <WomanPage p={p} frame={frame} fps={fps} f={f} />
        <Timeline frame={frame} fps={fps} f={f} p={p} />
        <WhichOne frame={frame} fps={fps} f={f} p={p} />
      </AbsoluteFill>

      {/* 5) la orca vuelve a su pose del body */}
      {frame >= MATCH_FROM && (
        <Orca p={p} x={mix(-260, BODY_ORCA.x, match)} y={mix(880, BODY_ORCA.y, match)} w={mix(420, BODY_ORCA.w, match)} rot={mix(-10, 0, match)} />
      )}
    </AbsoluteFill>
  );
};

type F = Record<string, number>;

/** Tapas, páginas, sombra del lomo y cantos de hojas. */
const Book: React.FC<{open: number; disorder: number; frame: number}> = ({open, disorder, frame}) => {
  const pageStyle = (side: 'L' | 'R'): React.CSSProperties => ({
    position: 'absolute',
    top: PAGE.top,
    left: side === 'L' ? PAGE.left : PAGE.gutter,
    width: PAGE.gutter - PAGE.left,
    height: PAGE.bottom - PAGE.top,
    background: side === 'L'
      ? 'linear-gradient(90deg, #f6efdd 0%, #fbf7ec 12%, #fbf7ec 85%, #e9dfc6 100%)'
      : 'linear-gradient(90deg, #e9dfc6 0%, #fbf7ec 15%, #fbf7ec 88%, #f3ecd8 100%)',
    transformOrigin: side === 'L' ? '100% 50%' : '0% 50%',
    transform: `scaleX(${open})${side === 'R' ? ` rotate(${disorder * 2.5 + Math.sin(frame / 5) * disorder * 0.6}deg)` : ''}`,
    boxShadow: 'inset 0 0 30px rgba(120,100,60,0.12)',
  });
  return (
    <>
      <div style={{position: 'absolute', left: BOOK.left, top: BOOK.top, width: BOOK.right - BOOK.left, height: BOOK.bottom - BOOK.top, borderRadius: 18,
        background: COLORS.blue, border: `6px solid ${COLORS.ink}`, boxShadow: '0 24px 40px rgba(0,0,0,0.28)', boxSizing: 'border-box'}} />
      {/* cantos de las hojas */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: PAGE.left + 6 + i * 3, right: 1080 - PAGE.right + 6 + i * 3, top: PAGE.bottom - 4 + i * 5, height: 6,
          background: '#efe6cf', borderBottom: '2px solid #cdbf9c', opacity: open}} />
      ))}
      <div style={pageStyle('L')}>
        <PageDecor />
      </div>
      <div style={pageStyle('R')}>
        <PageDecor right lines={disorder} />
      </div>
      <div style={{position: 'absolute', left: PAGE.gutter - 26, top: PAGE.top, width: 52, height: PAGE.bottom - PAGE.top,
        background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(80,60,30,0.22) 50%, rgba(0,0,0,0) 100%)', opacity: open}} />
    </>
  );
};

/** Filetes de página de libro ilustrado; en la de ella se tuercen con el desorden. */
const PageDecor: React.FC<{right?: boolean; lines?: number}> = ({right, lines = 0}) => (
  <svg width={500} height={700} style={{position: 'absolute', left: 0, top: 0}}>
    <rect x={22} y={22} width={456} height={654} fill="none" stroke="#d9cba6" strokeWidth={3} />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={right ? 60 : 250} x2={right ? 250 + lines * 40 : 440} y1={70 + i * 18 + (right ? lines * i * 14 : 0)} y2={70 + i * 18 - (right ? lines * (2 - i) * 10 : 0)}
        stroke="#d9cba6" strokeWidth={5} strokeLinecap="round" />
    ))}
  </svg>
);

/** Aparición a tinta: se descubre de izquierda a derecha. */
const Ink: React.FC<{t: number; children: React.ReactNode}> = ({t, children}) =>
  t <= 0 ? null : <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`}}>{children}</div>;

// ---------------------------------------------------------------------------
const OrcaPage: React.FC<{p: boolean; frame: number; fps: number; f: F; hideOrca: boolean}> = ({p, frame, fps, f, hideOrca}) => {
  const reveal = ramp(frame, f.killer - 4, f.killer + 12, (t) => t);
  const alive = ramp(frame, f.best, f.best + 10);
  const pod = (i: number) => springAt(frame, fps, f.happens + i * 5, 11);
  const glow = ramp(frame, f.brain - 4, f.brain + 10);
  return (
    <>
      {/* la página se enciende */}
      {alive > 0 && (
        <div style={{position: 'absolute', left: PAGE.left, top: PAGE.top, width: PAGE.gutter - PAGE.left, height: PAGE.bottom - PAGE.top, opacity: alive,
          background: 'radial-gradient(circle at 50% 30%, rgba(244,201,58,0.35) 0%, rgba(244,201,58,0.08) 45%, rgba(244,201,58,0) 70%)'}} />
      )}
      {/* rutas que salen de ella */}
      <Layer>
        {[
          `M ${ORCA.x + 120} ${ORCA.y + 20} C 420 760, 470 700, 520 640`,
          `M ${ORCA.x - 130} ${ORCA.y + 40} C 150 980, 250 1060, 420 1080`,
          `M ${ORCA.x + 60} ${ORCA.y + 90} C 380 1000, 470 960, 520 900`,
        ].map((d, i) => (
          <path key={`r${i}`} d={d} fill="none" stroke={COLORS.yellow} strokeWidth={9} strokeLinecap="round" pathLength={1}
            strokeDasharray={1} strokeDashoffset={1 - ramp(frame, f.best + 6 + i * 6, f.best + 24 + i * 6, (t) => t)} />
        ))}
      </Layer>
      <Ink t={reveal}>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          {[0, 1].map((i) => (
            <path key={i} d={`M 80 ${ORCA.y + 150 + i * 34} q 30 -12 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`} fill="none" stroke="#9fb7c0" strokeWidth={5} strokeLinecap="round" />
          ))}
        </svg>
        {!hideOrca && <Orca p={p} x={ORCA.x} y={ORCA.y + Math.sin(frame / 10) * 5 * alive} w={ORCA.w} rot={Math.sin(frame / 12) * 2 * alive} />}
      </Ink>
      {/* la manada aparece alrededor */}
      {pod(0) > 0 && <Calf p={p} kind="a" x={140} y={1010} w={130} scale={pod(0)} />}
      {pod(1) > 0 && <Calf p={p} kind="c" x={430} y={1030} w={120} scale={pod(1)} />}
      {pod(2) > 0 && <Fin x={120} y={720} h={70 * pod(2)} opacity={0.8} />}
      {pod(3) > 0 && <Fin x={470} y={730} h={60 * pod(3)} opacity={0.8} />}
      {/* su cerebro: se encienden conexiones */}
      <BrainNet cx={BRAIN_L.x} cy={BRAIN_L.y} frame={frame} from={f.best} glow={glow} />
      <Rays cx={BRAIN_L.x} cy={BRAIN_L.y} r0={120} r1={175} t={glow} n={12} spin={frame / 60} />
    </>
  );
};

/** Red de conexiones alrededor del cerebro de la orca. */
const NODES: [number, number][] = [[-120, -40], [-80, -95], [0, -120], [85, -95], [125, -30], [110, 50], [40, 90], [-50, 85], [-115, 45]];
const BrainNet: React.FC<{cx: number; cy: number; frame: number; from: number; glow: number}> = ({cx, cy, frame, from, glow}) => {
  if (frame < from) return null;
  return (
    <Layer>
      {NODES.map(([x, y], i) => {
        const [nx, ny] = NODES[(i + 3) % NODES.length];
        const t = ramp(frame, from + i * 3, from + 10 + i * 3, (u) => u);
        return (
          <g key={i}>
            <line x1={cx + x} y1={cy + y} x2={mix(cx + x, cx + nx, t)} y2={mix(cy + y, cy + ny, t)} stroke={COLORS.yellow} strokeWidth={6} strokeLinecap="round" opacity={0.9} />
            <circle cx={cx + x} cy={cy + y} r={10 + 4 * glow * Math.abs(Math.sin(frame / 5 + i))} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={4} opacity={t > 0 ? 1 : 0} />
          </g>
        );
      })}
    </Layer>
  );
};

// ---------------------------------------------------------------------------
const WomanPage: React.FC<{p: boolean; frame: number; fps: number; f: F}> = ({p, frame, fps, f}) => {
  const reveal = ramp(frame, f.women - 4, f.women + 12, (t) => t);
  const mess = ramp(frame, f.other, f.forget + 10, (t) => t);
  const agenda = springAt(frame, fps, f.other + 2, 12);
  const notes = [0, 1, 2, 3].map((i) => springAt(frame, fps, f.years + i * 4, 11));
  const word = ramp(frame, f.rather, f.rather + 26, (t) => t);
  const drift = (i: number, amp: number) => ({
    x: Math.sin(frame / 7 + i * 2.1) * amp * mess + mess * mess * (i % 2 ? 40 : -35),
    y: Math.cos(frame / 9 + i) * amp * 0.6 * mess + mess * mess * 30 * (i % 3),
    r: Math.sin(frame / 8 + i) * 8 * mess + (i - 1.5) * 10 * mess,
  });
  const head = headPoint(WOMAN.x, WOMAN.feet, WOMAN.h);
  return (
    <>
      <Ink t={reveal}>
        <Figure x={WOMAN.x} y={WOMAN.feet} h={WOMAN.h} slump={mess * 0.5} grey={mess * 0.35} tilt={Math.sin(frame / 6) * 3 * mess} />
      </Ink>
      {/* agenda con tareas sin terminar, encima de su cerebro */}
      {agenda > 0 && (() => {
        const d = drift(0, 6);
        return (
          <div style={{position: 'absolute', left: BRAIN_R.x - 170 + d.x, top: BRAIN_R.y - 20 + d.y, width: 230, height: 180, background: COLORS.card,
            border: `5px solid ${COLORS.ink}`, borderRadius: 12, boxShadow: '0 10px 18px rgba(0,0,0,0.2)', transform: `scale(${agenda}) rotate(${-5 + d.r}deg)`}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 34, background: COLORS.red, borderRadius: '6px 6px 0 0'}} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{position: 'absolute', left: 16, top: 50 + i * 40, width: 196, height: 30}}>
                <div style={{position: 'absolute', left: 0, top: 2, width: 24, height: 24, border: `4px solid ${COLORS.ink}`, borderRadius: 4, boxSizing: 'border-box'}} />
                {i === 0 && <div style={{position: 'absolute', left: 4, top: -2, ...font, fontSize: 26, color: COLORS.green, opacity: 0.8}}>✓</div>}
                <div style={{position: 'absolute', left: 36, top: 12, width: [150, 120, 140][i] * (i === 2 ? 1 - word * 0.5 : 1), height: 7, borderRadius: 4, background: COLORS.inkSoft,
                  opacity: i === 1 ? 0.45 : 0.8}} />
              </div>
            ))}
          </div>
        );
      })()}
      {/* notas sueltas */}
      {[[610, 470, '#f6d86b'], [960, 500, '#f2b8a6'], [640, 820, '#bfe0c9'], [975, 800, '#f6d86b']].map(([x, y, c], i) => {
        const k = notes[i];
        if (k <= 0) return null;
        const d = drift(i + 1, 10);
        return (
          <div key={i} style={{position: 'absolute', left: (x as number) - 42 + d.x, top: (y as number) - 42 + d.y, width: 84, height: 84, background: c as string,
            border: `4px solid ${COLORS.ink}`, boxShadow: '0 6px 10px rgba(0,0,0,0.18)', transform: `scale(${k}) rotate(${(i % 2 ? 9 : -8) + d.r}deg)`}}>
            <div style={{position: 'absolute', left: 12, top: 24, width: 50, height: 6, background: COLORS.inkSoft, opacity: 0.6, borderRadius: 3}} />
            <div style={{position: 'absolute', left: 12, top: 42, width: 36, height: 6, background: COLORS.inkSoft, opacity: 0.6, borderRadius: 3}} />
          </div>
        );
      })}
      {/* una palabra que se le escapa */}
      {frame >= f.rather - 4 && (
        <div style={{position: 'absolute', left: head[0] + 60, top: head[1] - 20, whiteSpace: 'nowrap', ...font, fontSize: 56, color: COLORS.ink}}>
          {[...'WORD'].map((ch, i) => {
            const u = Math.max(0, word * 1.4 - i * 0.12);
            return (
              <span key={i} style={{display: 'inline-block', opacity: Math.max(0, 1 - u * 1.1) * Math.min(1, (frame - f.rather + 4) / 4),
                transform: `translate(${u * (90 + i * 30)}px, ${-u * (60 + random(`w${i}`) * 50)}px) rotate(${u * (20 + i * 15)}deg)`}}>{ch}</span>
            );
          })}
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
/** Línea de tiempo que cruza las dos páginas; las dos llegan juntas a PERIMENOPAUSE. */
const Timeline: React.FC<{frame: number; fps: number; f: F; p: boolean}> = ({frame, fps, f, p}) => {
  const draw = ramp(frame, 2, 18, easeOut);
  const tab = springAt(frame, fps, 4, 11);
  const arrive = f.age + 2;
  const xo = mix(90, PAGE.gutter - 44, ramp(frame, f.hits, arrive, (t) => t * (2 - t)));
  const xw = mix(990, PAGE.gutter + 44, ramp(frame, f.women, arrive, (t) => t * t * (3 - 2 * t)));
  const met = springAt(frame, fps, arrive, 9);
  const pulse = Math.max(0, 1 - Math.abs(frame - arrive) / 10);
  const fade = 1 - ramp(frame, f.forOne + 2, f.forOne + 12);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: fade}}>
      <Layer>
        <line x1={540 - 450 * draw} x2={540 + 450 * draw} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.ink} strokeWidth={8} strokeLinecap="round" />
        {Array.from({length: 11}, (_, i) => {
          const x = 90 + i * 90;
          return <line key={i} x1={x} x2={x} y1={LINE_Y - 12} y2={LINE_Y + 12} stroke={COLORS.ink} strokeWidth={5} opacity={draw} />;
        })}
        {frame >= f.hits && <line x1={90} x2={xo} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.inkSoft} strokeWidth={14} strokeLinecap="round" />}
        {frame >= f.women && <line x1={990} x2={xw} y1={LINE_Y} y2={LINE_Y} stroke={COLORS.blue} strokeWidth={14} strokeLinecap="round" />}
        <rect x={PAGE.gutter - 9} y={LINE_Y - 40 - 20 * met} width={18} height={80 + 40 * met} rx={9} fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth={5} />
        {pulse > 0 && <circle cx={PAGE.gutter} cy={LINE_Y} r={40 + 90 * (1 - pulse)} fill="none" stroke={COLORS.yellow} strokeWidth={10} opacity={pulse} />}
      </Layer>
      {/* fichas de cada una sobre la línea */}
      {frame >= f.hits && (
        <Token x={xo} color="#e8eef0">
          <Orca p={p} x={45} y={45} w={80} />
        </Token>
      )}
      {frame >= f.women && (
        <Token x={xw} color="#dfe8f2">
          <Figure x={45} y={82} h={76} />
        </Token>
      )}
      {/* la marca central */}
      <div style={{position: 'absolute', left: PAGE.gutter - 230, top: LINE_Y + 34, width: 460, height: 62, borderRadius: 12, background: COLORS.yellow,
        border: `5px solid ${COLORS.ink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', ...font, fontSize: 40,
        color: COLORS.ink, transform: `scale(${tab * (1 + 0.12 * pulse)})`, boxShadow: '0 8px 14px rgba(0,0,0,0.2)'}}>
        PERIMENOPAUSE
      </div>
    </div>
  );
};

const Token: React.FC<{x: number; color: string; children: React.ReactNode}> = ({x, color, children}) => (
  <div style={{position: 'absolute', left: x - 48, top: LINE_Y - 48, width: 96, height: 96, borderRadius: 48, background: color, border: `5px solid ${COLORS.ink}`,
    boxSizing: 'border-box', overflow: 'hidden', boxShadow: '0 6px 10px rgba(0,0,0,0.2)'}}>
    <div style={{position: 'absolute', left: 0, top: 0}}>{children}</div>
  </div>
);

/** "For one of them": dos cerebros en sus páginas y un foco que duda entre ellos. */
const WhichOne: React.FC<{frame: number; fps: number; f: F; p: boolean}> = ({frame, fps, f, p}) => {
  const bl = springAt(frame, fps, f.forOne + 2, 12);
  const br = springAt(frame, fps, f.forOne + 6, 12);
  if (bl <= 0) return null;
  const doubt = frame >= f.forOne + 8 && frame < f.best;
  const onLeft = doubt ? Math.floor((frame - f.forOne) / 6) % 2 === 0 : frame >= f.best;
  const q = springAt(frame, fps, f.them, 10) * (1 - ramp(frame, f.best, f.best + 6));
  const rightGrey = ramp(frame, f.forOther, f.forOther + 10);
  return (
    <>
      {(doubt || frame < f.best + 6) && frame >= f.forOne + 8 && (
        <div style={{position: 'absolute', left: (onLeft ? BRAIN_L.x : BRAIN_R.x) - 150, top: (onLeft ? BRAIN_L.y : BRAIN_R.y) - 110, width: 300, height: 220,
          borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(244,201,58,0.45) 0%, rgba(244,201,58,0) 70%)', opacity: frame < f.best ? 1 : 1 - ramp(frame, f.best, f.best + 6)}} />
      )}
      <Pic id="body.brainDiagram" p={p} x={BRAIN_L.x} y={BRAIN_L.y} w={220} aspect={1.5} scale={bl} />
      <Pic id="body.brainDiagram" p={p} x={BRAIN_R.x} y={BRAIN_R.y} w={200} aspect={1.5} scale={br} filter={rightGrey > 0 ? `grayscale(${rightGrey * 0.6})` : undefined} />
      {q > 0 && (
        <div style={{position: 'absolute', left: PAGE.gutter - 45, top: 540, width: 90, textAlign: 'center', ...font, fontSize: 120, lineHeight: 1, color: COLORS.red,
          transform: `scale(${q}) rotate(${Math.sin(frame / 5) * 8}deg)`, textShadow: `3px 3px 0 ${COLORS.ink}`}}>?</div>
      )}
    </>
  );
};
