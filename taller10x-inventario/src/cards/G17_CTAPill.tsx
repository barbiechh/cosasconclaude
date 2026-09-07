import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { Pill } from "../components/Pill";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";
import { BurstRays } from "../components/icons/BurstRays";
import { EWatermark } from "../components/EWatermark";

// T32 (0-80) — marfil. The real landing-page promise stays on screen
// ("Multiplícate ×10 en un solo día.") while the isotype and the pill build
// underneath it — the pill lands with an overshoot bounce and an impact
// burst, punchier than a plain fade/scale-in.
export const G17_CTAPill: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 80], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const logoOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoPunch = interpolate(frame, [20, 26, 33], [0.5, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  const pillOpacity = interpolate(frame, [32, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillScale = interpolate(frame, [32, 40, 46], [0.55, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <EWatermark />
      <EspacioSymbol color={COLORS.petroleo} startFrame={4} opacity={0.5} />

      <div style={{ position: "absolute", translate: "0px -190px" }}>
        <Line
          enterFrame={4}
          fontSize={62}
          color={COLORS.carbon}
          weight={400}
          segments={[{ text: "Multiplícate " }, { text: "×10", color: COLORS.petroleo, bold: true }, { text: " en un solo día." }]}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, translate: "0px 40px" }}>
        <div style={{ opacity: logoOpacity, scale: `${logoPunch}` }}>
          <CanvasImage src={staticFile("images/espacio-logo.png")} width={64} height={76} fit="contain" />
        </div>
        <div style={{ position: "relative", opacity: pillOpacity, scale: `${pillScale}` }}>
          <BurstRays color={COLORS.petroleo} size={620} startFrame={36} />
          <Pill fontSize={34}>
            Inscríbete al Taller 10x
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};
