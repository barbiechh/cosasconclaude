import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "./theme";

// For beehiiv: two concrete before/after examples of what the workshop's
// AI flows do to a task, each ending in a stat pair, then a soft close
// (no button — just context + a quiet brand mention).

// Node icons — small, single-color, drawn inside a circular badge.
const RecordIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    <circle cx={15} cy={15} r={11} stroke={color} strokeWidth={2} fill="none" />
    <circle cx={15} cy={15} r={5} fill={color} />
  </svg>
);
const ChartIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    <line x1={7} y1={23} x2={7} y2={15} stroke={color} strokeWidth={3} strokeLinecap="round" />
    <line x1={15} y1={23} x2={15} y2={7} stroke={color} strokeWidth={3} strokeLinecap="round" />
    <line x1={23} y1={23} x2={23} y2={11} stroke={color} strokeWidth={3} strokeLinecap="round" />
  </svg>
);
const DocsIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    <rect x={6} y={4} width={15} height={19} rx={2} stroke={color} strokeWidth={1.6} fill="#FFFFFF" />
    <rect x={9.5} y={7.5} width={15} height={19} rx={2} stroke={color} strokeWidth={1.8} fill="#FFFFFF" />
    <line x1={13} y1={13} x2={21} y2={13} stroke={color} strokeWidth={1.4} />
    <line x1={13} y1={17} x2={21} y2={17} stroke={color} strokeWidth={1.4} />
    <line x1={13} y1={21} x2={18} y2={21} stroke={color} strokeWidth={1.4} />
  </svg>
);
const SendIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    <path d="M5 16 L26 4 L16 26 L13 16 Z" stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <line x1={13} y1={16} x2={26} y2={4} stroke={color} strokeWidth={2} />
  </svg>
);

const NODE_SIZE = 76;

const FlowNode: React.FC<{ icon: React.ReactNode; label: string; enterFrame: number }> = ({ icon, label, enterFrame }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [enterFrame, enterFrame + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [enterFrame, enterFrame + 10], [0.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity, scale: `${scale}`, width: 168 }}>
      <div
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          borderRadius: "50%",
          border: `2.5px solid ${COLORS.petroleo}`,
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 24px rgba(17,17,17,0.06)",
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily, fontSize: 18, fontWeight: 500, color: COLORS.carbon, textAlign: "center" }}>{label}</div>
    </div>
  );
};

// A pipeline rail: draws on once, then a small pulse travels along it on
// a loop — the "this runs automatically" cue.
const Connector: React.FC<{ drawFrame: number; pulseStart: number; pulseEnd: number }> = ({ drawFrame, pulseStart, pulseEnd }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [drawFrame, drawFrame + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const period = 28;
  const active = frame >= pulseStart && frame <= pulseEnd;
  const t = active ? ((frame - pulseStart) % period) / period : 0;
  const dotOpacity = active ? interpolate(t, [0, 0.1, 0.85, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  return (
    <svg width={54} height={12} viewBox="0 0 54 12" style={{ overflow: "visible", flexShrink: 0, marginTop: NODE_SIZE / 2 - 6 }}>
      <path d="M2 6 L52 6" stroke={COLORS.petroleo} strokeWidth={2} fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - draw} opacity={0.45} />
      <circle cx={2 + t * 50} cy={6} r={4.5} fill={COLORS.durazno} opacity={dotOpacity} />
    </svg>
  );
};

const Flow: React.FC<{ icons: [React.ReactNode, React.ReactNode, React.ReactNode]; steps: [string, string, string] }> = ({ icons, steps }) => (
  <div style={{ display: "flex", alignItems: "flex-start" }}>
    <FlowNode icon={icons[0]} label={steps[0]} enterFrame={14} />
    <Connector drawFrame={26} pulseStart={40} pulseEnd={78} />
    <FlowNode icon={icons[1]} label={steps[1]} enterFrame={38} />
    <Connector drawFrame={50} pulseStart={60} pulseEnd={78} />
    <FlowNode icon={icons[2]} label={steps[2]} enterFrame={62} />
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

const Example: React.FC<{
  title: string;
  icons: [React.ReactNode, React.ReactNode, React.ReactNode];
  steps: [string, string, string];
  before: string;
  after: string;
}> = ({ title, icons, steps, before, after }) => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flowOpacity = interpolate(frame, [80, 92], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const statOpacity = interpolate(frame, [86, 96], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", translate: "0px -190px", opacity: titleOpacity, fontFamily, fontSize: 38, fontWeight: 500, color: COLORS.carbon, textAlign: "center" }}>
        {title}
      </div>
      <div style={{ position: "absolute", opacity: flowOpacity }}>
        <Flow icons={icons} steps={steps} />
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
        <Example
          title="De la junta a la propuesta enviada."
          icons={[<RecordIcon key="1" color={COLORS.petroleo} />, <DocsIcon key="2" color={COLORS.petroleo} />, <SendIcon key="3" color={COLORS.petroleo} />]}
          steps={["Grabas la sesión", "Sale la minuta y la propuesta", "Se manda el correo"]}
          before="4 horas"
          after="15 min"
        />
      </Sequence>
      <Sequence name="Ejemplo2" from={150} durationInFrames={150} layout="none">
        <Example
          title="El reporte del mes."
          icons={[<ChartIcon key="1" color={COLORS.petroleo} />, <DocsIcon key="2" color={COLORS.petroleo} />, <SendIcon key="3" color={COLORS.petroleo} />]}
          steps={["Entran los números", "Sale el reporte, explicado", "Correo listo para el equipo"]}
          before="6 horas"
          after="20 min"
        />
      </Sequence>
      <Sequence name="Closing" from={300} durationInFrames={100} layout="none">
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
