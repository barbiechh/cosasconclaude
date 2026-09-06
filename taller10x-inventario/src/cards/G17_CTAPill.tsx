import { AbsoluteFill } from "remotion";
import { COLORS } from "../theme";
import { Pill } from "../components/Pill";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";

// T32 (0-66) — marfil.
export const G17_CTAPill: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <EspacioSymbol color={COLORS.petroleo} startFrame={4} opacity={0.5} />
      <Pill enterFrame={8} fontSize={34}>
        Inscríbete al Taller 10x
      </Pill>
    </AbsoluteFill>
  );
};
