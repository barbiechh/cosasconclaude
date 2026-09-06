import { interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";

/**
 * Word-by-word reveal with no displacement: each word appears in its final
 * position, only opacity fades in and font weight jumps once it lands.
 */
export const KineticWords: React.FC<{
  text: string;
  startFrame: number;
  staggerFrames?: number;
  fontSize: number;
  color?: string;
  finalWeight?: number;
}> = ({ text, startFrame, staggerFrames = 5, fontSize, color = COLORS.textPrimary, finalWeight = 700 }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");

  return (
    <span style={{ fontFamily, fontSize, color, lineHeight: 1.25 }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * staggerFrames;
        const opacity = interpolate(frame, [wordStart, wordStart + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const weight = frame >= wordStart + 3 ? finalWeight : 400;
        return (
          <span key={i} style={{ opacity, fontWeight: weight }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};
