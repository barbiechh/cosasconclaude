import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { GeometryLines } from "../components/GeometryLines";
import { KineticWords } from "../components/KineticWords";

// 0:13 - 0:16 (90f) — The hole in the music. Deliberate emptiness.
export const Scene04Linea: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GeometryLines opacity={0.18} drawDurationInFrames={90} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <KineticWords text="Ninguna de esas horas" startFrame={0} fontSize={68} />
        <KineticWords text="fue una decisión tuya." startFrame={20} fontSize={68} />
      </div>
    </AbsoluteFill>
  );
};
