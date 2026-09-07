import { AbsoluteFill, Sequence } from "remotion";
import { COLORS } from "./theme";
import { G10_Pendientes } from "./cards/G10_Pendientes";
import { G11_SalesConSistemas } from "./cards/G11_SalesConSistemas";
import { G17_CTAPill } from "./cards/G17_CTAPill";
import { ColorWipe } from "./components/ColorWipe";

// A short highlight reel for the GIF export, built to show the actual
// transformation of taking the workshop: "Llegas con pendientes." (before)
// → "Sales con sistemas." (after, its own built-in wipe to petróleo) → the
// CTA. Color wipes join every cut instead of hard cuts.
export const GifIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="Pendientes" durationInFrames={70} layout="none">
        <AbsoluteFill>
          <G10_Pendientes />
          <ColorWipe toColor={COLORS.carbon} axis="x" fromEdge="end" startFrame={58} durationInFrames={12} />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Sistemas" from={70} durationInFrames={68} layout="none">
        <AbsoluteFill>
          <G11_SalesConSistemas />
          <ColorWipe toColor={COLORS.marfil} axis="x" fromEdge="end" startFrame={56} durationInFrames={12} />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="CTAPill" from={138} durationInFrames={80} layout="none">
        <G17_CTAPill />
      </Sequence>
    </AbsoluteFill>
  );
};
