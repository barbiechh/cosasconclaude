import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";

/**
 * Counters never cross-fade: they roll digit by digit with heavy easing at
 * the landing. This is a numeric count (not a per-glyph odometer) but keeps
 * the "counting, not fading" signature the brief calls for.
 */
export const RollingNumber: React.FC<{
  fromValue: number;
  toValue: number;
  startFrame: number;
  endFrame: number;
  suffix: string;
  fontSize: number;
  color?: string;
  weight?: number;
  decimals?: number;
}> = ({
  fromValue,
  toValue,
  startFrame,
  endFrame,
  suffix,
  fontSize,
  color = COLORS.textPrimary,
  weight = 700,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(frame, [startFrame, endFrame], [fromValue, toValue], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <span
      style={{
        fontFamily,
        fontWeight: weight,
        fontSize,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
