import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { RadiatingArrows } from "../components/icons/RadiatingArrows";
import { ColorWipe } from "../components/ColorWipe";

// T21 (0-72) — carbón, standalone. The tray is empty now; the work leaves
// the frame on its own. Wipe (vertical) closes into petróleo.
export const G11_SalesConSistemas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", translate: "260px 40px" }}>
        <RadiatingArrows color={COLORS.durazno} size={220} centerX={40} centerY={100} startFrame={14} staggerFrames={4} markers={false} />
      </div>

      <Line
        enterFrame={0}
        fontSize={72}
        color={COLORS.marfil}
        weight={400}
        segments={[
          { text: "Sales con " },
          { text: "sistemas.", color: COLORS.durazno, decoration: "underline", decorationFrame: 8 },
        ]}
      />

      <ColorWipe toColor={COLORS.petroleo} axis="y" fromEdge="end" startFrame={64} />
    </AbsoluteFill>
  );
};
