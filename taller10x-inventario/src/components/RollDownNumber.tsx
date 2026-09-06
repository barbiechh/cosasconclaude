import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../theme";

/**
 * CIFRA_RUEDA preset: digits roll straight down like an odometer reel — the
 * old value slides down and out while the new one slides down into place
 * right behind it, landing with a heavy ease-out. Never a cross-fade.
 *
 * Both text layers share one grid cell (so the box auto-sizes to the wider
 * of the two) and move in exact pixels, one reel-height (H) apart — no
 * percentage-of-own-box math, which is what caused the previous version to
 * misalign the two layers.
 */
export const RollDownNumber: React.FC<{
  from: string;
  to: string;
  rollFrame: number;
  fontSize: number;
  color: string;
  durationInFrames?: number;
}> = ({ from, to, rollFrame, fontSize, color, durationInFrames = 14 }) => {
  const frame = useCurrentFrame();
  const H = fontSize * 1.15;

  const progress = interpolate(frame, [rollFrame, rollFrame + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.11, 0.85, 0.2, 1),
  });

  const textStyle = (translateY: number): React.CSSProperties => ({
    gridArea: "1 / 1",
    fontFamily,
    fontWeight: 700,
    fontSize,
    lineHeight: `${H}px`,
    color,
    whiteSpace: "nowrap",
    translate: `0px ${translateY}px`,
  });

  return (
    <div style={{ position: "relative", height: H, overflow: "hidden", display: "inline-grid" }}>
      <div style={textStyle(progress * H)}>{from}</div>
      <div style={textStyle((progress - 1) * H)}>{to}</div>
    </div>
  );
};
