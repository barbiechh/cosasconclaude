import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

// A small standalone looping graphic: record -> docs -> send, connected by
// rails with a durazno pulse relaying across. No entrance/exit — every
// frame is a valid loop point since node 80 wraps seamlessly to frame 0.

const RecordIcon: React.FC = () => (
  <svg width={26} height={26} viewBox="0 0 30 30">
    <circle cx={15} cy={15} r={11} stroke={COLORS.petroleo} strokeWidth={2} fill="none" />
    <circle cx={15} cy={15} r={5} fill={COLORS.petroleo} />
  </svg>
);
const DocsIcon: React.FC = () => (
  <svg width={26} height={26} viewBox="0 0 30 30">
    <rect x={7} y={5} width={16} height={20} rx={2} stroke={COLORS.petroleo} strokeWidth={1.8} fill="#FFFFFF" />
    <line x1={11} y1={12} x2={19} y2={12} stroke={COLORS.petroleo} strokeWidth={1.4} />
    <line x1={11} y1={16} x2={19} y2={16} stroke={COLORS.petroleo} strokeWidth={1.4} />
    <line x1={11} y1={20} x2={16} y2={20} stroke={COLORS.petroleo} strokeWidth={1.4} />
  </svg>
);
const SendIcon: React.FC = () => (
  <svg width={26} height={26} viewBox="0 0 30 30">
    <path d="M5 16 L26 4 L16 26 L13 16 Z" stroke={COLORS.petroleo} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <line x1={13} y1={16} x2={26} y2={4} stroke={COLORS.petroleo} strokeWidth={2} />
  </svg>
);

const NODE_SIZE = 64;

const Node: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <div
    style={{
      width: NODE_SIZE,
      height: NODE_SIZE,
      borderRadius: "50%",
      border: `2px solid ${COLORS.petroleo}`,
      backgroundColor: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    {icon}
  </div>
);

const SEGMENT = 40;
const TOTAL_LOOP = SEGMENT * 2;

const Connector: React.FC<{ activeStart: number }> = ({ activeStart }) => {
  const frame = useCurrentFrame() % TOTAL_LOOP;
  const local = frame - activeStart;
  const active = local >= 0 && local < SEGMENT;
  const t = active ? local / SEGMENT : 0;
  const opacity = active ? Math.sin(t * Math.PI) : 0;

  return (
    <svg width={60} height={12} viewBox="0 0 60 12" style={{ overflow: "visible", flexShrink: 0 }}>
      <path d="M2 6 L58 6" stroke={COLORS.petroleo} strokeWidth={2} opacity={0.35} strokeLinecap="round" />
      <circle cx={2 + t * 56} cy={6} r={4.5} fill={COLORS.durazno} opacity={opacity} />
    </svg>
  );
};

export const FlowLoop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Node icon={<RecordIcon />} />
        <Connector activeStart={0} />
        <Node icon={<DocsIcon />} />
        <Connector activeStart={SEGMENT} />
        <Node icon={<SendIcon />} />
      </div>
    </AbsoluteFill>
  );
};
