import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { StrokePath } from "../components/StrokePath";

const ITEMS = ["DOS LLAMADAS 1 A 1", "GRABACIÓN EDITADA", "TALLER DE ACTUALIZACIÓN", "BIBLIOTECA DE PROMPTS"];

// T28 (0-72) + T29 (72-126) + T30 (126-174) — marfil.
export const G15_45Dias: React.FC = () => {
  const frame = useCurrentFrame();

  const shrink = interpolate(frame, [58, 72], [1, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [58, 72], [0, -260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t28Opacity = interpolate(frame, [72, 110], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const row1Enter = interpolate(frame, [68, 76], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const row1StrikeFrame = 84;
  const row1Strike = interpolate(frame, [row1StrikeFrame, row1StrikeFrame + 6], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const row1Dim = interpolate(frame, [row1StrikeFrame, row1StrikeFrame + 10], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const row2Opacity = interpolate(frame, [126, 134], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const row2StrikeFrame = 138;
  const row2Strike = interpolate(frame, [row2StrikeFrame, row2StrikeFrame + 6], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const row2Dim = interpolate(frame, [row2StrikeFrame, row2StrikeFrame + 10], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px`, opacity: t28Opacity, position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ fontFamily, fontSize: 68, fontWeight: 400, color: COLORS.carbon }}>
          <span style={{ fontWeight: 700, color: COLORS.petroleo }}>45</span> días después.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {ITEMS.map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width={70} height={4}>
                <StrokePath d="M 0 2 L 70 2" color={COLORS.petroleo} strokeWidth={2} startFrame={12 + i * 8} durationInFrames={8} />
              </svg>
              <span style={{ fontFamily, fontSize: 18, fontWeight: 500, letterSpacing: 1.5, color: COLORS.petroleo }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", translate: "0px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ position: "relative", opacity: row1Enter * row1Dim, textAlign: "center" }}>
          <span style={{ fontFamily, fontSize: 56, fontWeight: 400, color: COLORS.carbon }}>11 sep · agotado</span>
          <div style={{ position: "absolute", left: 0, top: "50%", width: `${row1Strike}%`, height: 2, backgroundColor: COLORS.petroleo }} />
        </div>
        <div style={{ position: "relative", opacity: row2Opacity * row2Dim, textAlign: "center" }}>
          <span style={{ fontFamily, fontSize: 56, fontWeight: 400, color: COLORS.carbon }}>18 sep · agotado</span>
          <div style={{ position: "absolute", left: 0, top: "50%", width: `${row2Strike}%`, height: 2, backgroundColor: COLORS.petroleo }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
