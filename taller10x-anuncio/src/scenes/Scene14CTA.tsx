import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { GeometryLines } from "../components/GeometryLines";
import { Pill } from "../components/Pill";

const IMPACT_FRAME = 14;

/** A crisp expanding ring on impact — punch, not glow. */
const ImpactRing: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = interpolate(frame, [IMPACT_FRAME, IMPACT_FRAME + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [IMPACT_FRAME, IMPACT_FRAME + 4, IMPACT_FRAME + 20], [0, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const size = 420 + progress * 340;
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size / 3.4,
        borderRadius: 999,
        border: `2px solid ${COLORS.geometry}`,
        opacity,
      }}
    />
  );
};

// 0:57 - 1:00 (90f) — Landing frame. Static for the last 12 frames minimum.
export const Scene14CTA: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow living-camera push, done well before the mandatory static tail.
  const cameraPush = interpolate(frame, [0, 68], [1, 1.018], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
    output: "perceptual-scale",
  });
  // A short punch bump layered on top when the pill lands.
  const impactPunch = interpolate(
    frame,
    [IMPACT_FRAME, IMPACT_FRAME + 5, IMPACT_FRAME + 16],
    [1, 1.025, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      output: "perceptual-scale",
    },
  );
  const sceneScale = cameraPush * impactPunch;

  const brandOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandY = interpolate(frame, [0, 14, 20], [-22, 3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const pillOpacity = interpolate(frame, [IMPACT_FRAME - 8, IMPACT_FRAME - 2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillScale = interpolate(
    frame,
    [IMPACT_FRAME - 8, IMPACT_FRAME, IMPACT_FRAME + 10],
    [0.5, 1.12, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      output: "perceptual-scale",
    },
  );
  const pillRotate = interpolate(frame, [IMPACT_FRAME - 8, IMPACT_FRAME + 10], [-4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const urlOpacity = interpolate(frame, [30, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlY = interpolate(frame, [30, 44], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dateOpacity = interpolate(frame, [38, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dateY = interpolate(frame, [38, 52], [26, 0], {
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
      <div style={{ position: "absolute", inset: 0, scale: `${sceneScale}`, transformOrigin: "center" }}>
        <GeometryLines opacity={0.55} drawDurationInFrames={38} />
        <GeometryLines color={COLORS.pillBg} opacity={0.6} flip drawDurationInFrames={50} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          opacity: brandOpacity,
          translate: `0px ${brandY}px`,
          scale: `${sceneScale}`,
        }}
      >
        <CanvasImage src={staticFile("images/espacio-logo.png")} width={40} height={48} fit="contain" />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          scale: `${sceneScale}`,
        }}
      >
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <ImpactRing frame={frame} />
          <div
            style={{
              scale: `${pillScale}`,
              rotate: `${pillRotate}deg`,
              opacity: pillOpacity,
            }}
          >
            <Pill variant="black" fontSize={32} style={{ padding: "26px 56px" }}>
              Inscríbete al Taller 10x
            </Pill>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div
            style={{
              fontFamily,
              fontSize: 30,
              fontWeight: 500,
              color: COLORS.textSecondary,
              opacity: urlOpacity,
              translate: `0px ${urlY}px`,
            }}
          >
            ai.espacio.cool
          </div>
          <div
            style={{
              fontFamily,
              fontSize: 24,
              fontWeight: 400,
              color: COLORS.textSecondary,
              opacity: dateOpacity,
              translate: `0px ${dateY}px`,
            }}
          >
            25 de septiembre · CDMX
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
