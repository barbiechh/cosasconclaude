import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Card } from "../components/Card";
import { TaskRow } from "../components/TaskRow";

// 0:02 - 0:09 (210f) — The right column grows. The villain is the format.
export const Scene02Columna: React.FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardTranslateY = interpolate(frame, [0, 18], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const pushIn = interpolate(frame, [0, 210], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
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
      <div
        style={{
          opacity: cardOpacity,
          translate: `0px ${cardTranslateY}px`,
          scale: `${pushIn}`,
          transformOrigin: "70% center",
        }}
      >
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
          <TaskRow label="Generación de reportes" hours={3} enterFrame={20} />
          <TaskRow label="Generación y envío de correos" hours={3} enterFrame={55} />
          <TaskRow label="Prospección y seguimiento" hours={4} enterFrame={90} />
          <TaskRow label="Cierre financiero del mes" hours={6} enterFrame={125} />
        </Card>
      </div>
    </AbsoluteFill>
  );
};
