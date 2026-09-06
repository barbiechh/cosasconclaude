import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { EspacioSymbol } from "../components/icons/EspacioSymbol";

// T10 (0-54) + T11 (54-126) — marfil. A breather: the brand symbol draws
// slowly behind the tesis's opening line.
export const G05_NoEresLento: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 105], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const shrink = interpolate(frame, [34, 44], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [34, 44], [0, -300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t10Opacity = interpolate(frame, [44, 76], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const symbolOpacity = interpolate(frame, [46, 60], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ opacity: symbolOpacity }}>
        <EspacioSymbol color={COLORS.petroleo} startFrame={46} />
      </div>

      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px`, opacity: t10Opacity, position: "absolute" }}>
        <Line
          fontSize={72}
          color={COLORS.carbon}
          weight={400}
          segments={[
            { text: "No eres " },
            { text: "lento.", decoration: "strike", decorationColor: COLORS.petroleo, decorationFrame: 6 },
          ]}
        />
      </div>

      <div style={{ position: "absolute" }}>
        <Line
          enterFrame={48}
          fontSize={68}
          color={COLORS.carbon}
          weight={400}
          segments={[{ text: "El trabajo cambió de " }, { text: "dueño.", color: COLORS.petroleo, decoration: "underline", decorationFrame: 20 }]}
        />
      </div>
    </AbsoluteFill>
  );
};
