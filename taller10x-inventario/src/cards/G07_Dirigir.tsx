import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";
import { DirectorHub } from "../components/icons/DirectorHub";

// T14 (0-72) + T15 (72-150) — carbón. The peak of the anuncio: "dirigir."
// alone, escala máxima, half a second of pause before it lands (per VO note).
export const G07_Dirigir: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 95], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const diagramOpacity = interpolate(frame, [52, 60], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordOpacity = interpolate(frame, [64, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordScale = interpolate(frame, [64, 74], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
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

      <div style={{ opacity: diagramOpacity }}>
        <DirectorHub color={COLORS.durazno} size={420} startFrame={10} />
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
