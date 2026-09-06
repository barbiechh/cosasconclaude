import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";

/**
 * The recurring "cifra" morph: no cross-fade. The old value collapses on the
 * same optical axis and the new one lands there, with a brusque 8% scale dip
 * on impact. Used for every "4 h -> 15 min" style beat in the ad.
 */
export const MorphNumber: React.FC<{
  from: string;
  to: string;
  morphFrame: number;
  fontSize: number;
  color?: string;
  weight?: number;
}> = ({ from, to, morphFrame, fontSize, color = COLORS.textPrimary, weight = 700 }) => {
  const frame = useCurrentFrame();

  const containerScale = interpolate(
    frame,
    [morphFrame, morphFrame + 4, morphFrame + 14],
    [1, 0.92, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) },
  );

  const oldOpacity = interpolate(frame, [morphFrame, morphFrame + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldScaleY = interpolate(frame, [morphFrame, morphFrame + 4], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const newOpacity = interpolate(frame, [morphFrame + 3, morphFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newScale = interpolate(frame, [morphFrame + 3, morphFrame + 12], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const showOld = frame < morphFrame + 6;
  const showNew = frame >= morphFrame + 3;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        scale: `${containerScale}`,
        fontFamily,
        fontWeight: weight,
        fontSize,
        color,
        lineHeight: 1,
      }}
    >
      <span style={{ opacity: showNew ? newOpacity : 0, scale: `${newScale}` }}>{to}</span>
      {showOld ? (
        <span
          style={{
            position: "absolute",
            inset: 0,
            opacity: oldOpacity,
            scale: `1 ${oldScaleY}`,
          }}
        >
          {from}
        </span>
      ) : null}
    </div>
  );
};
