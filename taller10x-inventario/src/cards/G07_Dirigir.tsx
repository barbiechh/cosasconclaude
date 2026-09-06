import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";
import { SilhouetteIcon } from "../components/icons/SilhouetteIcon";
import { RadiatingArrows } from "../components/icons/RadiatingArrows";

// T14 (0-72) + T15 (72-150) — carbón. The peak of the anuncio: "dirigir."
// alone, escala máxima, half a second of pause before it lands (per VO note).
export const G07_Dirigir: React.FC = () => {
  const frame = useCurrentFrame();

  const diagramOpacity = interpolate(frame, [72, 84], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordOpacity = interpolate(frame, [90, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordScale = interpolate(frame, [90, 100], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 90,
          fontFamily,
          fontSize: 44,
          fontWeight: 500,
          color: COLORS.marfil,
          opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        El trabajo nuevo:
      </div>

      <div style={{ opacity: diagramOpacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <SilhouetteIcon color={COLORS.durazno} size={220} startFrame={6} />
          <div style={{ position: "absolute", inset: 0 }}>
            <RadiatingArrows color={COLORS.durazno} size={220} centerX={100} centerY={110} startFrame={20} staggerFrames={4} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          opacity: wordOpacity,
          scale: `${wordScale}`,
        }}
      >
        <Line instant fontSize={430} color={COLORS.durazno} weight={700} segments={[{ text: "dirigir." }]} />
      </div>
    </AbsoluteFill>
  );
};
