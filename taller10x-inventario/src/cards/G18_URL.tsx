import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";

// T33 (0-60) — carbón, final. Last 12 frames are fully static.
export const G18_URL: React.FC = () => {
  const frame = useCurrentFrame();
  const logoOpacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlOpacity = interpolate(frame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlPunch = interpolate(frame, [0, 5, 14], [0.92, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const detailsOpacity = interpolate(frame, [16, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 56, left: 80, opacity: logoOpacity }}>
        <CanvasImage
          src={staticFile("images/espacio-logo.png")}
          width={40}
          height={48}
          fit="contain"
          style={{ filter: "invert(1)" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, scale: `${urlPunch}` }}>
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
