import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { Pill } from "../components/Pill";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";
import { BurstRays } from "../components/icons/BurstRays";

// T32 (0-100) — marfil. The real landing-page promise lands first
// ("Multiplícate ×10 en un solo día."), then the isotype and the pill land
// with an overshoot bounce and an impact burst — punchier than a plain
// fade/scale-in.
export const G17_CTAPill: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 100], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const headlineOpacity = interpolate(frame, [46, 56], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [46, 56], [0, -30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const logoOpacity = interpolate(frame, [48, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoPunch = interpolate(frame, [48, 54, 61], [0.5, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  const pillOpacity = interpolate(frame, [60, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillScale = interpolate(frame, [60, 68, 74], [0.55, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <EspacioSymbol color={COLORS.petroleo} startFrame={4} opacity={0.5} />

      <div style={{ position: "absolute", translate: `0px ${-190 + headlineY}px`, opacity: headlineOpacity }}>
        <Line
          enterFrame={4}
          fontSize={62}
          color={COLORS.carbon}
          weight={400}
          segments={[{ text: "Multiplícate " }, { text: "×10", color: COLORS.petroleo, bold: true }, { text: " en un solo día." }]}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <div style={{ opacity: logoOpacity, scale: `${logoPunch}` }}>
          <CanvasImage src={staticFile("images/espacio-logo.png")} width={64} height={76} fit="contain" />
        </div>
        <div style={{ position: "relative", opacity: pillOpacity, scale: `${pillScale}` }}>
          <BurstRays color={COLORS.petroleo} size={620} startFrame={64} />
          <Pill fontSize={34}>
            Inscríbete al Taller 10x
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};
