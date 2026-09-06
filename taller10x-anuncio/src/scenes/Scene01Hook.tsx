import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { MorphNumber } from "../components/MorphNumber";

// 0:00 - 0:02 (60f) — Hook. Two numbers, three words. Works muted.
export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [36, 39], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineScale = interpolate(frame, [36, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <MorphNumber from="4 h" to="15 min" morphFrame={18} fontSize={172} />
        <div
          style={{
            fontFamily,
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: 6,
            color: COLORS.textSecondary,
            opacity: labelOpacity,
          }}
        >
          LA MISMA PROPUESTA.
        </div>
        <div
          style={{
            width: 160,
            height: 3,
            backgroundColor: COLORS.geometry,
            scale: `${lineScale} 1`,
            transformOrigin: "left center",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
