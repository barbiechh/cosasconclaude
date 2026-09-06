import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { NodesDiagram } from "../components/icons/NodesDiagram";

// T12 (0-72) + T13 (72-150) — petróleo. The node diagram draws in, then
// unravels outward as the second line lands.
export const G06_TareasRepetitivas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center" }}>
      <NodesDiagram color={COLORS.durazno} labelColor={COLORS.durazno} startFrame={10} staggerFrames={8} unravelFrame={82} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, translate: "0px -160px" }}>
        <Line enterFrame={0} fontSize={68} color={COLORS.marfil} weight={400} segments={[{ text: "Las tareas repetitivas" }]} />
        <Line
          enterFrame={78}
          fontSize={68}
          color={COLORS.marfil}
          weight={400}
          segments={[
            { text: "ya no son de " },
            { text: "personas.", color: COLORS.durazno, decoration: "underline", decorationFrame: 92 },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
