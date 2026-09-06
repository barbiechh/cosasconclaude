import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Pill } from "../components/Pill";
import { GeometryLines } from "../components/GeometryLines";

// 0:22 - 0:27 (150f) — Sharp contrast cut back to marfil. The offer lands.
export const Scene06Revelacion: React.FC = () => {
  const frame = useCurrentFrame();

  const impactPunch = interpolate(frame, [42, 47, 58], [1, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  const pillOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillScale = interpolate(frame, [0, 12], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  const line1Opacity = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const x10Scale = interpolate(frame, [32, 40, 46], [0.3, 1.16, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });
  const x10Opacity = interpolate(frame, [32, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x10Rotate = interpolate(frame, [32, 46], [-8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const line2Opacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Y = interpolate(frame, [50, 64], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, scale: `${impactPunch}`, transformOrigin: "center" }}>
        <GeometryLines opacity={0.14} drawDurationInFrames={90} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 44,
          scale: `${impactPunch}`,
        }}
      >
        <div style={{ opacity: pillOpacity, scale: `${pillScale}` }}>
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
                rotate: `${x10Rotate}deg`,
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
              translate: `0px ${line2Y}px`,
            }}
          >
            en un solo día.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
