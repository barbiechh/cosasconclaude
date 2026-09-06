import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

/**
 * Recurring brand geometry: a wide arc crossed by horizontals, drawn with a
 * continuous stroke animation. Used as a quiet background scaffold, never as
 * a protagonist element.
 */
export const GeometryLines: React.FC<{
  color?: string;
  opacity?: number;
  flip?: boolean;
  drawDurationInFrames?: number;
}> = ({ color = COLORS.geometry, opacity = 1, flip = false, drawDurationInFrames = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const draw = interpolate(frame, [0, drawDurationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M -100 850 C 400 1050, 900 -50, 1500 250 C 1750 400, 1850 250, 2050 100"
        fill="none"
        stroke={color}
        strokeWidth={2}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={interpolate(draw, [0, 1], [1, 0])}
      />
      <path
        d="M 200 300 L 1750 300"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={interpolate(
          frame,
          [0.25 * fps + 0, 0.25 * fps + drawDurationInFrames * 0.7],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) },
        )}
      />
      <path
        d="M 100 720 L 1350 720"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={interpolate(
          frame,
          [0.4 * fps + 0, 0.4 * fps + drawDurationInFrames * 0.7],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) },
        )}
      />
    </svg>
  );
};
