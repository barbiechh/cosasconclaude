import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "./theme";
import { Line } from "./components/Line";
import { Pill } from "./components/Pill";
import { StrokePath } from "./components/StrokePath";

// "¿Cuánto vale tu tiempo?" — a standalone ad GIF built around the
// landing page's time calculator: select repetitive tasks, watch the
// hours pile up, then the payoff (one task sped up 4h -> 15min with AI)
// and the CTA. Ends by fading back into the empty calculator so the
// loop has no hard jump.

const CARD_WIDTH = 880;
const CARD_LEFT = (1280 - CARD_WIDTH) / 2;
const CARD_TOP = 140;
const CARD_PADDING = 40;
const HEADER_HEIGHT = 70;
const ROW_HEIGHT = 84;
const ROW_GAP = 16;

const TASKS = [
  { label: "Reportes", hours: 3 },
  { label: "Correos", hours: 3 },
  { label: "Seguimiento de clientes", hours: 4 },
];
const CLICK_FRAMES = [56, 96, 132];

const rowCenterY = (i: number) => CARD_TOP + CARD_PADDING + HEADER_HEIGHT + i * (ROW_HEIGHT + ROW_GAP) + ROW_HEIGHT / 2;

const totalAt = (frame: number) => {
  const t1 = interpolate(frame, [CLICK_FRAMES[0], CLICK_FRAMES[0] + 10], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(frame, [CLICK_FRAMES[1], CLICK_FRAMES[1] + 10], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t3 = interpolate(frame, [CLICK_FRAMES[2], CLICK_FRAMES[2] + 10], [0, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return Math.round(t1 + t2 + t3);
};

const CheckCircle: React.FC<{ checked: boolean; checkFrame: number }> = ({ checked, checkFrame }) => (
  <svg width={36} height={36} viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
    <circle cx={18} cy={18} r={16} fill={checked ? COLORS.durazno : "#FFFFFF"} stroke={checked ? COLORS.durazno : "#D8D5CF"} strokeWidth={2} />
    {checked ? <StrokePath d="M 10 18 L 15 23 L 26 11" color={COLORS.carbon} strokeWidth={3} startFrame={checkFrame} durationInFrames={8} /> : null}
  </svg>
);

const TaskRow: React.FC<{ label: string; hours: number; selectFrame: number }> = ({ label, hours, selectFrame }) => {
  const frame = useCurrentFrame();
  const selected = frame >= selectFrame;
  const barOpacity = Number.isFinite(selectFrame)
    ? interpolate(frame, [selectFrame, selectFrame + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div style={{ height: ROW_HEIGHT, display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
      <div style={{ position: "absolute", left: -CARD_PADDING, top: 4, bottom: 4, width: 5, backgroundColor: COLORS.durazno, opacity: barOpacity, borderRadius: 3 }} />
      <CheckCircle checked={selected} checkFrame={selectFrame + 2} />
      <div style={{ fontFamily, fontSize: 30, color: COLORS.carbon, flex: 1 }}>{label}</div>
      <div style={{ fontFamily, fontSize: 30, fontWeight: 700, color: selected ? COLORS.petroleo : "#B3AFA8" }}>{hours} h</div>
    </div>
  );
};

const TotalBadge: React.FC<{ value: number }> = ({ value }) => (
  <div
    style={{
      fontFamily,
      fontSize: 24,
      fontWeight: 700,
      color: COLORS.carbon,
      backgroundColor: COLORS.marfil,
      border: `1.5px solid ${COLORS.carbon}`,
      borderRadius: 999,
      padding: "8px 22px",
    }}
  >
    Total: {value} h
  </div>
);

const CalculatorShell: React.FC<{ selectFrames?: number[]; headline?: boolean }> = ({ selectFrames = [Infinity, Infinity, Infinity], headline = true }) => {
  const frame = useCurrentFrame();
  const total = totalAt(selectFrames[0] === Infinity ? -1 : frame);

  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT,
        top: CARD_TOP,
        width: CARD_WIDTH,
        backgroundColor: "#FFFFFF",
        border: "1.5px solid #E4E1DA",
        borderRadius: 28,
        boxShadow: "0 24px 60px rgba(17,17,17,0.08)",
        padding: CARD_PADDING,
        overflow: "hidden",
      }}
    >
      <div style={{ height: HEADER_HEIGHT, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {headline ? (
          <div style={{ fontFamily, fontSize: 32, fontWeight: 500, color: COLORS.carbon }}>¿En qué se te van las horas?</div>
        ) : (
          <div />
        )}
        <TotalBadge value={total} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: ROW_GAP }}>
        {TASKS.map((t, i) => (
          <TaskRow key={t.label} label={t.label} hours={t.hours} selectFrame={selectFrames[i]} />
        ))}
      </div>
    </div>
  );
};

const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const waypoints = [
    { x: 1000, y: 60, at: 0 },
    { x: 286, y: rowCenterY(0) - 4, at: 56 },
    { x: 286, y: rowCenterY(1) - 4, at: 96 },
    { x: 286, y: rowCenterY(2) - 4, at: 132 },
    { x: 286, y: rowCenterY(2) - 4, at: 150 },
  ];
  let x = waypoints[0].x;
  let y = waypoints[0].y;
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (frame >= waypoints[i].at && frame <= waypoints[i + 1].at) {
      const t = interpolate(frame, [waypoints[i].at, waypoints[i + 1].at], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      x = waypoints[i].x + (waypoints[i + 1].x - waypoints[i].x) * t;
      y = waypoints[i].y + (waypoints[i + 1].y - waypoints[i].y) * t;
    }
  }
  if (frame > waypoints[waypoints.length - 1].at) {
    x = waypoints[waypoints.length - 1].x;
    y = waypoints[waypoints.length - 1].y;
  }

  return (
    <>
      <svg width={28} height={28} viewBox="0 0 28 28" style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}>
        <path d="M2 1 L2 20 L7 16 L10.5 24 L14 22.5 L10.5 15 L18 15 Z" fill={COLORS.carbon} stroke="#FFFFFF" strokeWidth={1.5} />
      </svg>
      {CLICK_FRAMES.map((clickFrame, i) => {
        const target = waypoints[i + 1];
        const scale = interpolate(frame, [clickFrame, clickFrame + 16], [0, 2.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const opacity = interpolate(frame, [clickFrame, clickFrame + 4, clickFrame + 16], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: target.x + 3,
              top: target.y + 3,
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: `2.5px solid ${COLORS.durazno}`,
              translate: "-50% -50%",
              scale: `${scale}`,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// Phase A: 0-150 (5s) — approach + three selections.
const PhaseCalculator: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineOpacity = interpolate(frame, [0, 8, 50, 62], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [138, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [138, 150], [1, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, opacity: exitOpacity, scale: `${exitScale}` }}>
      <div style={{ position: "absolute", left: CARD_LEFT, top: CARD_TOP - 56, opacity: headlineOpacity, fontFamily, fontSize: 22, fontWeight: 500, letterSpacing: 1, color: COLORS.petroleo }}>
        ¿EN QUÉ SE TE VAN LAS HORAS?
      </div>
      <CalculatorShell selectFrames={CLICK_FRAMES} headline={false} />
      <Cursor />
    </AbsoluteFill>
  );
};

// Phase B: 150-210 (2s) — the total, zoomed.
const PhaseTotal: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 16], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity, scale: `${scale}` }}>
        <div style={{ fontFamily, fontSize: 200, fontWeight: 700, color: COLORS.durazno, lineHeight: 1 }}>10</div>
        <div style={{ fontFamily, fontSize: 44, fontWeight: 500, color: COLORS.carbon }}>horas a la semana.</div>
        <div style={{ fontFamily, fontSize: 28, fontWeight: 400, color: COLORS.petroleo }}>En tareas repetitivas.</div>
      </div>
    </AbsoluteFill>
  );
};

// Phase C: 210-270 (2s) — the concrete payoff.
const PhaseTransform: React.FC = () => {
  const frame = useCurrentFrame();
  const captionOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftOpacity = interpolate(frame, [12, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineDraw = interpolate(frame, [24, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightOpacity = interpolate(frame, [30, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightScale = interpolate(frame, [30, 40, 46], [0.7, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", translate: "0px -170px", opacity: captionOpacity, fontFamily, fontSize: 32, fontWeight: 500, color: COLORS.carbon, textAlign: "center" }}>
        De la reunión a la propuesta enviada.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: leftOpacity }}>
          <div style={{ fontFamily, fontSize: 22, fontWeight: 500, color: "#8A8680" }}>La reunión</div>
          <div style={{ fontFamily, fontSize: 68, fontWeight: 700, color: COLORS.carbon }}>4 horas</div>
        </div>
        <svg width={140} height={40} viewBox="0 0 140 40" style={{ overflow: "visible" }}>
          <path d="M 4 20 L 120 20" stroke={COLORS.durazno} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lineDraw} />
          <path d="M 110 8 L 128 20 L 110 32" stroke={COLORS.durazno} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={lineDraw} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: rightOpacity, scale: `${rightScale}` }}>
          <div style={{ fontFamily, fontSize: 22, fontWeight: 500, color: "#8A8680" }}>La propuesta enviada</div>
          <div style={{ fontFamily, fontSize: 68, fontWeight: 700, color: COLORS.petroleo }}>15 min</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Phase D+E: 270-450 (6s) — CTA, fine print, then fade back to the empty calculator to loop.
const PhaseClosing: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [16, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillScale = interpolate(frame, [34, 42, 48], [0.55, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const pillOpacity = interpolate(frame, [34, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fineOpacity = interpolate(frame, [120, 132], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closingFade = interpolate(frame, [156, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loopInOpacity = interpolate(frame, [156, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, opacity: closingFade }}>
        <div style={{ opacity: headlineOpacity }}>
          <Line instant fontSize={64} color={COLORS.carbon} weight={500} segments={[{ text: "¿Cuánto vale tu tiempo?" }]} />
        </div>
        <div style={{ opacity: subOpacity, fontFamily, fontSize: 30, fontWeight: 400, color: COLORS.petroleo }}>Aprende a recuperarlo con IA.</div>
        <div style={{ scale: `${pillScale}`, opacity: pillOpacity }}>
          <Pill fontSize={30}>Inscríbete al Taller 10x</Pill>
        </div>
        <div style={{ opacity: fineOpacity, fontFamily, fontSize: 20, fontWeight: 500, color: "#8A8680", textAlign: "center" }}>
          CDMX · 25 de septiembre
          <br />
          ai.espacio.cool
        </div>
      </div>

      <div style={{ opacity: loopInOpacity, position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: CARD_LEFT, top: CARD_TOP - 56, fontFamily, fontSize: 22, fontWeight: 500, letterSpacing: 1, color: COLORS.petroleo }}>
          ¿EN QUÉ SE TE VAN LAS HORAS?
        </div>
        <CalculatorShell headline={false} />
      </div>
    </AbsoluteFill>
  );
};

export const CalculatorGif: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="Calculator" durationInFrames={150} layout="none">
        <PhaseCalculator />
      </Sequence>
      <Sequence name="Total" from={150} durationInFrames={60} layout="none">
        <PhaseTotal />
      </Sequence>
      <Sequence name="Transform" from={210} durationInFrames={60} layout="none">
        <PhaseTransform />
      </Sequence>
      <Sequence name="Closing" from={270} durationInFrames={180} layout="none">
        <PhaseClosing />
      </Sequence>
    </AbsoluteFill>
  );
};
