import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { StrokePath } from "../components/StrokePath";
import { ColorWipe } from "../components/ColorWipe";

// T16 (0-60) — marfil, standalone. The long arrow motivates the wipe that
// follows it off the right edge.
export const G08_Ventaja: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <StrokePath d="M 300 760 L 2000 760" color={COLORS.petroleo} strokeWidth={2} startFrame={20} durationInFrames={24} />
      </svg>

      <Line
        enterFrame={0}
        fontSize={68}
        color={COLORS.carbon}
        weight={400}
        segments={[
          { text: "La ventaja es del " },
          { text: "primero.", color: COLORS.petroleo, decoration: "underline", decorationFrame: 10 },
        ]}
      />

      <ColorWipe toColor={COLORS.petroleo} axis="x" fromEdge="start" startFrame={52} />
    </AbsoluteFill>
  );
};
