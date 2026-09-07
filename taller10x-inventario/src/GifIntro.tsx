import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";
import { G01_Hook } from "./cards/G01_Hook";
import { G09_Taller10x } from "./cards/G09_Taller10x";
import { G13_CeroCodigo } from "./cards/G13_CeroCodigo";
import { ColorWipe } from "./components/ColorWipe";

// A short highlight reel for the GIF export: hook → "Taller 10x" reveal →
// "Cero código", joined with color wipes (carbón → petróleo → marfil)
// instead of hard cuts, so the very different backgrounds blend.
export const GifIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="Hook" durationInFrames={88} layout="none">
        <AbsoluteFill>
          <G01_Hook />
          <ColorWipe toColor={COLORS.petroleo} axis="x" fromEdge="end" startFrame={76} durationInFrames={12} />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Taller10x" from={88} durationInFrames={90} layout="none">
        <AbsoluteFill>
          <G09_Taller10x />
          <ColorWipe toColor={COLORS.marfil} axis="x" fromEdge="end" startFrame={78} durationInFrames={12} />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="CeroCodigo" from={178} durationInFrames={108} layout="none">
        <G13_CeroCodigo />
      </Sequence>
    </AbsoluteFill>
  );
};
