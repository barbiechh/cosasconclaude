import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { ColorWipe } from "../components/ColorWipe";

// T21 (0-56) — carbón, standalone. Clean text, no line art. Wipe (vertical)
// closes into petróleo.
export const G11_SalesConSistemas: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 56], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
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

      <ColorWipe toColor={COLORS.petroleo} axis="y" fromEdge="end" startFrame={50} />
    </AbsoluteFill>
  );
};
