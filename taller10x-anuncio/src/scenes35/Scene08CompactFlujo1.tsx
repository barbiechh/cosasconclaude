import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Card } from "../components/Card";
import { MorphNumber } from "../components/MorphNumber";

const NODES = ["Junta", "Notas", "Propuesta enviada"];

// 35s cut — compressed version of Scene08Flujo1 (75f instead of 150f).
export const Scene08CompactFlujo1: React.FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardY = interpolate(frame, [0, 9], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineProgress = interpolate(frame, [6, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cursorProgress = interpolate(frame, [12, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const cursorX = 5 + cursorProgress * 672;

  const clickBump = interpolate(frame, [44, 46, 49], [1, 1.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ opacity: cardOpacity, translate: `0px ${cardY}px`, position: "relative" }}>
        <Card width={900} padding={56}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 56,
            }}
          >
            <div
              style={{
                fontFamily,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 2,
                color: COLORS.textSecondary,
                maxWidth: 420,
              }}
            >
              DE LA REUNIÓN A LA PROPUESTA ENVIADA
            </div>
            <MorphNumber from="4 h" to="15 min" morphFrame={47} fontSize={40} />
          </div>

          <div style={{ position: "relative", height: 90, width: 700 }}>
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                width: 688,
                height: 2,
                backgroundColor: "#E5E1D8",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 6,
                left: 6,
                width: 688 * lineProgress,
                height: 2,
                backgroundColor: COLORS.geometry,
              }}
            />
            {NODES.map((node, i) => (
              <div
                key={node}
                style={{
                  position: "absolute",
                  left: i * 340,
                  top: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  scale: i === 2 ? `${clickBump}` : "1",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    backgroundColor: COLORS.textPrimary,
                  }}
                />
                <span style={{ fontFamily, fontSize: 22, color: COLORS.textPrimary }}>{node}</span>
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                top: -18,
                left: cursorX,
                width: 16,
                height: 16,
                borderRadius: "50%",
                border: `2px solid ${COLORS.textPrimary}`,
                backgroundColor: COLORS.marfil,
              }}
            />
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
