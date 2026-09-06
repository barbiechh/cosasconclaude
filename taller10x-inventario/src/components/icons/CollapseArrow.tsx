import { Easing, interpolate, useCurrentFrame } from "remotion";
import { StrokePath } from "../StrokePath";

/** LA_flecha_colapso: draws left-to-right, then narrows as the number rolls. */
export const CollapseArrow: React.FC<{
  color: string;
  width: number;
  drawFrame?: number;
  collapseFrame: number;
}> = ({ color, width, drawFrame = 0, collapseFrame }) => {
  const frame = useCurrentFrame();
  const collapse = interpolate(frame, [collapseFrame, collapseFrame + 14], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.11, 0.85, 0.2, 1),
  });

  return (
    <svg
      width={width}
      height={width * (24 / 400)}
      viewBox="0 0 400 24"
      style={{ overflow: "visible", scale: `${collapse} 1`, transformOrigin: "left center" }}
    >
      <StrokePath d="M 0 12 L 380 12" color={color} strokeWidth={2} startFrame={drawFrame} durationInFrames={12} />
      <StrokePath d="M 360 2 L 390 12 L 360 22" color={color} strokeWidth={2} startFrame={drawFrame + 8} durationInFrames={6} />
    </svg>
  );
};
