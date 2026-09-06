import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Card } from "../components/Card";
import { TaskRow } from "../components/TaskRow";
import { RollingNumber } from "../components/RollingNumber";

// 0:09 - 0:13 (120f) — The four numbers collapse into one uncomfortable total.
export const Scene03Total: React.FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [0, 15], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardScale = interpolate(frame, [0, 15], [1, 0.96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const totalOpacity = interpolate(frame, [10, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const impactScale = interpolate(frame, [42, 46, 54], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  const showSubtitle = frame >= 66;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "absolute", opacity: cardOpacity, scale: `${cardScale}` }}>
        <Card width={1180} padding={56}>
          <div
            style={{
              fontFamily,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: 3,
              color: COLORS.textSecondary,
              marginBottom: 24,
            }}
          >
            ¿CUÁNTO VALE TU TIEMPO?
          </div>
          <TaskRow label="Generación de reportes" hours={3} enterFrame={0} />
          <TaskRow label="Generación y envío de correos" hours={3} enterFrame={0} />
          <TaskRow label="Prospección y seguimiento" hours={4} enterFrame={0} />
          <TaskRow label="Cierre financiero del mes" hours={6} enterFrame={0} />
        </Card>
      </div>

      <div
        style={{
          opacity: totalOpacity,
          scale: `${impactScale}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {!showSubtitle ? (
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <RollingNumber
              fromValue={0}
              toValue={16}
              startFrame={20}
              endFrame={46}
              suffix=""
              fontSize={168}
              weight={700}
            />
            <span
              style={{
                fontFamily,
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: 2,
                color: COLORS.textPrimary,
              }}
            >
              H A LA SEMANA
            </span>
          </div>
        ) : (
          <div
            style={{
              fontFamily,
              fontSize: 64,
              fontWeight: 500,
              color: COLORS.textPrimary,
            }}
          >
            Dos días completos.
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
