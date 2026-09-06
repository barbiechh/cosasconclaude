import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";
import { TrayIcon } from "../components/icons/TrayIcon";

// T19 (0-78) + T20 (78-138) — marfil. The number is the illustration.
export const G10_X10: React.FC = () => {
  const frame = useCurrentFrame();

  const underline = interpolate(frame, [10, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const shrink = interpolate(frame, [62, 74], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [62, 74], [0, -420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const x10Opacity = interpolate(frame, [78, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px`, opacity: x10Opacity, position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily, fontSize: 620, fontWeight: 700, color: COLORS.carbon, lineHeight: 1 }}>×10</div>
        <div
          style={{
            width: 560,
            height: 14,
            backgroundColor: COLORS.petroleo,
            marginTop: -10,
            scale: `${underline} 1`,
            transformOrigin: "center",
          }}
        />
      </div>

      <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 90 }}>
        <Line
          enterFrame={80}
          fontSize={68}
          color={COLORS.carbon}
          weight={400}
          textAlign="left"
          segments={[{ text: "Llegas con " }, { text: "pendientes.", color: COLORS.petroleo }]}
        />
        <TrayIcon color={COLORS.petroleo} width={170} sheetFrames={[80, 86, 92, 98, 104]} startFrame={80} />
      </div>
    </AbsoluteFill>
  );
};
