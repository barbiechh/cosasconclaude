import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";

// T24 (0-60) + T25 (60-126) — marfil. Second breather: the symbol draws
// again behind "Cero código."
export const G13_CeroCodigo: React.FC = () => {
  const frame = useCurrentFrame();

  const shrink = interpolate(frame, [48, 60], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [48, 60], [0, -280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t24Opacity = interpolate(frame, [60, 96], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const symbolOpacity = interpolate(frame, [62, 76], [0, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sellosOpacity = interpolate(frame, [92, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: symbolOpacity }}>
        <EspacioSymbol color={COLORS.petroleo} startFrame={62} flip />
      </div>

      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px`, opacity: t24Opacity, position: "absolute" }}>
        <Line fontSize={72} color={COLORS.carbon} weight={400} segments={[{ text: "Con " }, { text: "tus", color: COLORS.petroleo }, { text: " archivos." }]} />
      </div>

      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 42 }}>
        <Line enterFrame={64} fontSize={78} color={COLORS.carbon} weight={400} segments={[{ text: "Cero", color: COLORS.petroleo, bold: true }, { text: " código." }]} />
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
