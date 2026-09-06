import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Pill } from "../components/Pill";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";

// T32 (0-60) — marfil. The real brand isotype lands above the CTA.
export const G17_CTAPill: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoPunch = interpolate(frame, [0, 7, 16], [0.6, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <EspacioSymbol color={COLORS.petroleo} startFrame={4} opacity={0.5} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ opacity: logoOpacity, scale: `${logoPunch}` }}>
          <CanvasImage src={staticFile("images/espacio-logo.png")} width={64} height={76} fit="contain" />
        </div>
        <Pill enterFrame={14} fontSize={34}>
          Inscríbete al Taller 10x
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
