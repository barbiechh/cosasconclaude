import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { GeometryLines } from "../components/GeometryLines";
import { KineticWords } from "../components/KineticWords";

// 0:16 - 0:22 (180f) — Full reset: color, ground and pace change at once.
export const Scene05Petroleo: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = 1 + (frame / 180) * 0.02;
  const showSecondLine = frame >= 90;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.petroleo,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, scale: `${scale}`, transformOrigin: "center" }}>
        <GeometryLines color={COLORS.geometry} opacity={0.35} drawDurationInFrames={150} />
      </div>
      <div style={{ scale: `${scale}`, maxWidth: 1400, textAlign: "center" }}>
        {!showSecondLine ? (
          <KineticWords
            text="Las tareas repetitivas ya no son trabajo de personas."
            startFrame={6}
            fontSize={62}
            color={COLORS.marfil}
            staggerFrames={4}
          />
        ) : (
          <KineticWords
            text="El trabajo nuevo es dirigir a quien las hace."
            startFrame={90}
            fontSize={62}
            color={COLORS.marfil}
            staggerFrames={4}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
