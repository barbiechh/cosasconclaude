import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Pill } from "../components/Pill";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";
import { BurstRays } from "../components/icons/BurstRays";

// T32 (0-60) — marfil. The real brand isotype lands above the CTA, then the
// pill lands with an overshoot bounce and an impact burst — punchier than a
// plain fade/scale-in.
export const G17_CTAPill: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 60], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const logoOpacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoPunch = interpolate(frame, [0, 6, 13], [0.5, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  const pillOpacity = interpolate(frame, [12, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillScale = interpolate(frame, [12, 20, 26], [0.55, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <EspacioSymbol color={COLORS.petroleo} startFrame={4} opacity={0.5} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ opacity: logoOpacity, scale: `${logoPunch}` }}>
          <CanvasImage src={staticFile("images/espacio-logo.png")} width={64} height={76} fit="contain" />
        </div>
        <div style={{ position: "relative", opacity: pillOpacity, scale: `${pillScale}` }}>
          <BurstRays color={COLORS.petroleo} size={620} startFrame={18} />
          <Pill fontSize={34}>
            Inscríbete al Taller 10x
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};
