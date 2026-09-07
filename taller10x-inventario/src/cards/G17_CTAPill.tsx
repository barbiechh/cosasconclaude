import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { Pill } from "../components/Pill";
import { SignalRings } from "../components/icons/SignalRings";
import { EWatermark } from "../components/EWatermark";

// T32 (0-80) — marfil. Just the real landing-page promise ("Multiplícate
// ×10 en un solo día.") staying on screen while the pill lands right
// underneath it with an overshoot bounce.
export const G17_CTAPill: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 80], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const pillOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillScale = interpolate(frame, [20, 28, 34], [0.55, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <EWatermark />
      <SignalRings color={COLORS.petroleo} startFrame={4} opacity={0.5} />

      <div style={{ position: "absolute", translate: "0px -80px" }}>
        <Line
          enterFrame={4}
          fontSize={62}
          color={COLORS.carbon}
          weight={400}
          segments={[{ text: "Multiplícate " }, { text: "×10", color: COLORS.petroleo, bold: true }, { text: " en un solo día." }]}
        />
      </div>

      <div style={{ opacity: pillOpacity, scale: `${pillScale}`, translate: "0px 40px" }}>
        <Pill fontSize={34}>
          Inscríbete al Taller 10x
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
