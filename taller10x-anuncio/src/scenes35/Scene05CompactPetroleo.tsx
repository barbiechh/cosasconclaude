import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { GeometryLines } from "../components/GeometryLines";
import { KineticWords } from "../components/KineticWords";

// 35s cut — compressed version of Scene05Petroleo (150f instead of 180f),
// swapping lines earlier (frame 70 instead of 90).
export const Scene05CompactPetroleo: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = 1 + (frame / 150) * 0.02;
  const showSecondLine = frame >= 70;

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
        <GeometryLines color={COLORS.geometry} opacity={0.35} drawDurationInFrames={120} />
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
            startFrame={70}
            fontSize={62}
            color={COLORS.marfil}
            staggerFrames={4}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
