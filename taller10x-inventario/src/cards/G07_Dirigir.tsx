import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";
import { DirectorHub } from "../components/icons/DirectorHub";

// T14 (0-76) + T15 (76-130) — carbón. The peak of the anuncio: "dirigir"
// lands huge, then "agentes de IA." clarifies what — without shrinking
// the hero word to fit both on one line.
export const G07_Dirigir: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 130], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const diagramOpacity = interpolate(frame, [62, 72], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wordOpacity = interpolate(frame, [76, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordScale = interpolate(frame, [76, 86], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const subOpacity = interpolate(frame, [96, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [96, 104], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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

      <div style={{ opacity: diagramOpacity, translate: "0px -60px" }}>
        <DirectorHub color={COLORS.durazno} size={420} startFrame={10} />
      </div>

      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: wordOpacity, scale: `${wordScale}` }}>
          <Line instant fontSize={400} color={COLORS.durazno} weight={700} segments={[{ text: "dirigir" }]} />
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily,
            fontSize: 62,
            fontWeight: 500,
            color: COLORS.marfil,
            opacity: subOpacity,
            translate: `0px ${subY}px`,
          }}
        >
          agentes de IA.
        </div>
      </div>
    </AbsoluteFill>
  );
};
