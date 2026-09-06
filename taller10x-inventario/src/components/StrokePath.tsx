import { Easing, interpolate, useCurrentFrame } from "remotion";

/** Trim-paths style stroke-on: draws an SVG path from 0% to 100% over a few frames. */
export const StrokePath: React.FC<{
  d: string;
  color: string;
  strokeWidth?: number;
  startFrame: number;
  durationInFrames?: number;
  fill?: string;
}> = ({ d, color, strokeWidth = 2, startFrame, durationInFrames = 8, fill = "none" }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={interpolate(draw, [0, 1], [1, 0])}
    />
  );
};
