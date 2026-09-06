import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";

// T17 (0-66) + T18 (66-126) — petróleo.
export const G09_Taller10x: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shrink = interpolate(frame, [52, 64], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [52, 64], [0, -300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const labelFade = interpolate(frame, [52, 64], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div
          style={{
            fontFamily,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 4,
            color: COLORS.durazno,
            opacity: labelOpacity * labelFade,
            position: "absolute",
            translate: "0px -140px",
          }}
        >
          CDMX · 25 SEP 2026
        </div>
        <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px` }}>
          <Line instant fontSize={130} color={COLORS.marfil} weight={700} segments={[{ text: "Taller 10x" }]} />
        </div>
      </div>

      <div style={{ position: "absolute" }}>
        <Line
          enterFrame={68}
          fontSize={76}
          color={COLORS.marfil}
          weight={400}
          segments={[{ text: "Un día", color: COLORS.durazno, bold: true }, { text: ". Presencial." }]}
        />
      </div>
    </AbsoluteFill>
  );
};
