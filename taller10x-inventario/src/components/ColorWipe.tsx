import { Easing, interpolate, useCurrentFrame } from "remotion";

/**
 * WIPE_COLOR preset: a hard-edged color-field wipe that paints the next
 * scene's background over the current one, always in the last frames of the
 * outgoing card. By the time the Sequence boundary is hit, the field is
 * already fully painted, so the cut into the next scene is seamless.
 */
export const ColorWipe: React.FC<{
  toColor: string;
  axis: "x" | "y";
  fromEdge: "start" | "end";
  startFrame: number;
  durationInFrames?: number;
}> = ({ toColor, axis, fromEdge, startFrame, durationInFrames = 6 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const scale = axis === "x" ? `${progress} 1` : `1 ${progress}`;
  const transformOrigin =
    axis === "x"
      ? fromEdge === "start"
        ? "left center"
        : "right center"
      : fromEdge === "start"
        ? "center bottom"
        : "center top";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: toColor,
        scale,
        transformOrigin,
      }}
    />
  );
};
