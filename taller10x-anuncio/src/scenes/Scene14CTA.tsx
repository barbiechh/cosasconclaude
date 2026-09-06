import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { GeometryLines } from "../components/GeometryLines";
import { Pill } from "../components/Pill";

// 0:57 - 1:00 (90f) — Landing frame. Static for the last 12 frames minimum.
export const Scene14CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const brandOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pillScale = interpolate(frame, [0, 16], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });
  const pillOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const detailsOpacity = interpolate(frame, [20, 32], [0, 1], {
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
      <GeometryLines opacity={0.5} drawDurationInFrames={65} />

      <div
        style={{
          position: "absolute",
          top: 64,
          left: 80,
          fontFamily,
          fontSize: 26,
          fontWeight: 700,
          color: COLORS.textPrimary,
          opacity: brandOpacity,
        }}
      >
        Espacio
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ scale: `${pillScale}`, opacity: pillOpacity }}>
          <Pill variant="black" fontSize={32} style={{ padding: "26px 56px" }}>
            Inscríbete al Taller 10x
          </Pill>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: detailsOpacity,
          }}
        >
          <div style={{ fontFamily, fontSize: 30, fontWeight: 500, color: COLORS.textSecondary }}>
            ai.espacio.cool
          </div>
          <div style={{ fontFamily, fontSize: 24, fontWeight: 400, color: COLORS.textSecondary }}>
            $19,900 MXN por persona · 25 de septiembre · CDMX
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
