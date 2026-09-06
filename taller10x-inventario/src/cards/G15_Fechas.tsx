import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";

// T29 + T30 only — marfil. Cuts straight to the sold-out dates, no "45
// días" stage. Fast: both rows land inside the first 60 frames.
export const G15_Fechas: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 85], [1, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const row1StrikeFrame = 14;
  const row1Strike = interpolate(frame, [row1StrikeFrame, row1StrikeFrame + 7], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const row1Dim = interpolate(frame, [row1StrikeFrame, row1StrikeFrame + 10], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const row2Enter = interpolate(frame, [32, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const row2StrikeFrame = 42;
  const row2Strike = interpolate(frame, [row2StrikeFrame, row2StrikeFrame + 7], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const row2Dim = interpolate(frame, [row2StrikeFrame, row2StrikeFrame + 10], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ position: "relative", opacity: row1Dim, textAlign: "center" }}>
          <span style={{ fontFamily, fontSize: 60, fontWeight: 400, color: COLORS.carbon }}>11 sep · agotado</span>
          <div style={{ position: "absolute", left: 0, top: "50%", width: `${row1Strike}%`, height: 2, backgroundColor: COLORS.petroleo }} />
        </div>
        <div style={{ position: "relative", opacity: row2Enter * row2Dim, textAlign: "center" }}>
          <span style={{ fontFamily, fontSize: 60, fontWeight: 400, color: COLORS.carbon }}>18 sep · agotado</span>
          <div style={{ position: "absolute", left: 0, top: "50%", width: `${row2Strike}%`, height: 2, backgroundColor: COLORS.petroleo }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
