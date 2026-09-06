import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";

// T24 (0-46) + T25 (46-92) — marfil. Second breather: the symbol draws
// again behind "Cero código."
export const G13_CeroCodigo: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 108], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const shrink = interpolate(frame, [36, 46], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [36, 46], [0, -280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t24Opacity = interpolate(frame, [46, 72], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const symbolOpacity = interpolate(frame, [48, 62], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sellosOpacity = interpolate(frame, [72, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ opacity: symbolOpacity }}>
        <EspacioSymbol color={COLORS.petroleo} startFrame={48} flip />
      </div>

      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px`, opacity: t24Opacity, position: "absolute" }}>
        <Line fontSize={72} color={COLORS.carbon} weight={400} segments={[{ text: "Con " }, { text: "tus", color: COLORS.petroleo }, { text: " archivos." }]} />
      </div>

      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 42 }}>
        <Line enterFrame={50} fontSize={78} color={COLORS.carbon} weight={400} segments={[{ text: "Cero", color: COLORS.petroleo, bold: true }, { text: " código." }]} />
        <div
          style={{
            display: "flex",
            gap: 28,
            fontFamily,
            fontSize: 22,
            fontWeight: 500,
            color: COLORS.carbon,
            opacity: sellosOpacity,
          }}
        >
          <span>Claude</span>
          <span>ChatGPT</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
