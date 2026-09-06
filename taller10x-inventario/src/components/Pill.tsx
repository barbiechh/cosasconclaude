import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";

/** CTA pill: 96% to 100% scale-in, no bounce. */
export const Pill: React.FC<{ children: React.ReactNode; enterFrame?: number; fontSize?: number }> = ({
  children,
  enterFrame = 0,
  fontSize = 32,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [enterFrame, enterFrame + 10], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const opacity = interpolate(frame, [enterFrame, enterFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "inline-flex",
        padding: "26px 56px",
        borderRadius: 999,
        backgroundColor: COLORS.carbon,
        color: COLORS.marfil,
        fontFamily,
        fontWeight: 700,
        fontSize,
        scale: `${scale}`,
        opacity,
      }}
    >
      {children}
    </div>
  );
};
