import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { GridSquares } from "../components/icons/GridSquares";
import { ColorWipe } from "../components/ColorWipe";

// T31 (0-62) — petróleo, standalone. Wipe (horizontal) closes into marfil.
export const G16_DoceLugares: React.FC = () => {
  const frame = useCurrentFrame();
  const labelOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numberOpacity = interpolate(frame, [6, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numberPunch = interpolate(frame, [6, 12, 20], [0.88, 1.05, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily, fontSize: 24, fontWeight: 500, letterSpacing: 3, color: COLORS.durazno, opacity: labelOpacity }}>
          25 SEP
        </div>
        <div style={{ opacity: numberOpacity, scale: `${numberPunch}`, fontFamily, fontSize: 190, fontWeight: 700, color: COLORS.durazno }}>
          12 lugares.
        </div>
        <GridSquares color={COLORS.durazno} count={12} columns={6} cellSize={28} gap={12} startFrame={14} staggerFrames={2} />
      </div>

      <ColorWipe toColor={COLORS.marfil} axis="x" fromEdge="start" startFrame={54} />
    </AbsoluteFill>
  );
};
