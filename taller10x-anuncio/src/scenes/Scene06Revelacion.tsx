import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Pill } from "../components/Pill";

// 0:22 - 0:27 (150f) — Sharp contrast cut back to marfil. The offer lands.
export const Scene06Revelacion: React.FC = () => {
  const frame = useCurrentFrame();

  const pillOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillY = interpolate(frame, [0, 12], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const line1Opacity = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x10Scale = interpolate(frame, [32, 42], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });
  const x10Opacity = interpolate(frame, [32, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line2Opacity = interpolate(frame, [44, 54], [0, 1], {
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <div style={{ opacity: pillOpacity, translate: `0px ${pillY}px` }}>
          <Pill variant="beige" fontSize={22}>
            TALLER 10x · CDMX · 25 DE SEPTIEMBRE, 2026
          </Pill>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily, fontSize: 84, fontWeight: 400, color: COLORS.textPrimary }}>
            <span style={{ opacity: line1Opacity }}>Multiplícate </span>
            <span
              style={{
                display: "inline-block",
                opacity: x10Opacity,
                scale: `${x10Scale}`,
                fontWeight: 700,
              }}
            >
              ×10
            </span>
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 84,
              fontWeight: 400,
              color: COLORS.textPrimary,
              opacity: line2Opacity,
            }}
          >
            en un solo día.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
