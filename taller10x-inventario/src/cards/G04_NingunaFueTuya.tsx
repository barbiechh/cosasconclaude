import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { ColorWipe } from "../components/ColorWipe";

// T08 (0-56) + T09 (56-116) — carbón. Both lines stay on screen together;
// the wipe (vertical, bottom to top) closes into marfil.
export const G04_NingunaFueTuya: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, 110], [1, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <Line
          enterFrame={0}
          fontSize={64}
          color={COLORS.marfil}
          weight={400}
          segments={[
            { text: "Ninguna", color: COLORS.durazno, decoration: "underline", decorationFrame: 4 },
            { text: " hora fue una decisión tuya." },
          ]}
        />
        <Line
          enterFrame={56}
          fontSize={64}
          color={COLORS.marfil}
          weight={400}
          segments={[{ text: "Fue el " }, { text: "formato.", color: COLORS.durazno }, { text: " No tú." }]}
        />
      </div>

      <ColorWipe toColor={COLORS.marfil} axis="y" fromEdge="end" startFrame={110} />
    </AbsoluteFill>
  );
};
