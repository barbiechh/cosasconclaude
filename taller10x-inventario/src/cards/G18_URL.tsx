import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";

// T33 (0-60) — carbón, final. Last 12 frames are fully static.
export const G18_URL: React.FC = () => {
  const frame = useCurrentFrame();
  const urlOpacity = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const detailsOpacity = interpolate(frame, [16, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ fontFamily, fontSize: 76, fontWeight: 700, color: COLORS.marfil, opacity: urlOpacity }}>
          ai.espacio.<span style={{ color: COLORS.durazno }}>cool</span>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 2,
            color: COLORS.marfil,
            opacity: detailsOpacity * 0.7,
          }}
        >
          CDMX · 25 SEP 2026
        </div>
      </div>
    </AbsoluteFill>
  );
};
