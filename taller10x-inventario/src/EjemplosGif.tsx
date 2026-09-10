import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "./theme";

// For beehiiv: two concrete before/after examples of what the workshop's
// AI flows do to a task, each ending in a stat pair, then a soft close
// (no button — just context + a quiet brand mention).

const Arrow: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [startFrame, startFrame + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={56} height={24} viewBox="0 0 56 24" style={{ overflow: "visible", flexShrink: 0 }}>
      <path d="M2 12 L44 12" stroke={COLORS.durazno} strokeWidth={3} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <path d="M36 4 L50 12 L36 20" stroke={COLORS.durazno} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={draw} />
    </svg>
  );
};

const FlowStep: React.FC<{ label: string; enterFrame: number }> = ({ label, enterFrame }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [enterFrame, enterFrame + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [enterFrame, enterFrame + 8], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <div
      style={{
        opacity,
        scale: `${scale}`,
        fontFamily,
        fontSize: 22,
        fontWeight: 500,
        color: COLORS.carbon,
        border: `2px solid ${COLORS.petroleo}`,
        borderRadius: 16,
        padding: "18px 22px",
        textAlign: "center",
        width: 250,
      }}
    >
      {label}
    </div>
  );
};

const Flow: React.FC<{ steps: [string, string, string] }> = ({ steps }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <FlowStep label={steps[0]} enterFrame={14} />
    <Arrow startFrame={24} />
    <FlowStep label={steps[1]} enterFrame={34} />
    <Arrow startFrame={44} />
    <FlowStep label={steps[2]} enterFrame={54} />
  </div>
);

const BeforeAfter: React.FC<{ before: string; after: string; opacity: number }> = ({ before, after, opacity }) => {
  const frame = useCurrentFrame();
  const leftOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineDraw = interpolate(frame, [10, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightOpacity = interpolate(frame, [14, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightScale = interpolate(frame, [14, 22], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 50, opacity }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: leftOpacity }}>
        <div style={{ fontFamily, fontSize: 20, fontWeight: 500, color: "#8A8680" }}>Hoy</div>
        <div style={{ fontFamily, fontSize: 60, fontWeight: 700, color: COLORS.carbon }}>{before}</div>
      </div>
      <svg width={130} height={36} viewBox="0 0 130 36" style={{ overflow: "visible" }}>
        <path d="M4 18 L110 18" stroke={COLORS.durazno} strokeWidth={4} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lineDraw} />
        <path d="M100 6 L118 18 L100 30" stroke={COLORS.durazno} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={lineDraw} />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: rightOpacity, scale: `${rightScale}` }}>
        <div style={{ fontFamily, fontSize: 20, fontWeight: 500, color: "#8A8680" }}>Después</div>
        <div style={{ fontFamily, fontSize: 60, fontWeight: 700, color: COLORS.petroleo }}>{after}</div>
      </div>
    </div>
  );
};

const Example: React.FC<{ title: string; steps: [string, string, string]; before: string; after: string }> = ({ title, steps, before, after }) => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flowOpacity = interpolate(frame, [80, 92], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const statOpacity = interpolate(frame, [86, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", translate: "0px -170px", opacity: titleOpacity, fontFamily, fontSize: 38, fontWeight: 500, color: COLORS.carbon, textAlign: "center" }}>
        {title}
      </div>
      <div style={{ position: "absolute", opacity: flowOpacity }}>
        <Flow steps={steps} />
      </div>
      <BeforeAfter before={before} after={after} opacity={statOpacity} />
    </AbsoluteFill>
  );
};

// Phase C: the close — no button, just context, then a quiet mention.
const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const line1Opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [16, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fineOpacity = interpolate(frame, [42, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closingFade = interpolate(frame, [76, 96], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loopInOpacity = interpolate(frame, [76, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: closingFade, maxWidth: 900, textAlign: "center" }}>
        <div style={{ opacity: line1Opacity, fontFamily, fontSize: 34, fontWeight: 500, color: COLORS.carbon }}>
          Son promedios de lo que vemos con clientes de Espacio.
        </div>
        <div style={{ opacity: line2Opacity, fontFamily, fontSize: 30, fontWeight: 400, color: COLORS.petroleo }}>
          Son dos ejemplos. En el taller montas los tuyos.
        </div>
        <div style={{ opacity: fineOpacity, fontFamily, fontSize: 20, fontWeight: 500, color: "#8A8680", letterSpacing: 1, marginTop: 10 }}>
          TALLER 10X · AI.ESPACIO.COOL
        </div>
      </div>

      <div style={{ position: "absolute", translate: "0px -170px", opacity: loopInOpacity, fontFamily, fontSize: 38, fontWeight: 500, color: COLORS.carbon, textAlign: "center" }}>
        De la junta a la propuesta enviada.
      </div>
    </AbsoluteFill>
  );
};

export const EjemplosGif: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="Ejemplo1" durationInFrames={150} layout="none">
        <Example title="De la junta a la propuesta enviada." steps={["Grabas la sesión", "Sale la minuta y la propuesta", "Se manda el correo"]} before="4 horas" after="15 min" />
      </Sequence>
      <Sequence name="Ejemplo2" from={150} durationInFrames={150} layout="none">
        <Example title="El reporte del mes." steps={["Entran los números", "Sale el reporte, explicado", "Correo listo para el equipo"]} before="6 horas" after="20 min" />
      </Sequence>
      <Sequence name="Closing" from={300} durationInFrames={100} layout="none">
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
