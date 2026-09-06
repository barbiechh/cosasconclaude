import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { TrayIcon } from "../components/icons/TrayIcon";

// T20 only — marfil. Jumps straight here, no ×10 stage. Fast, punchy.
export const G10_Pendientes: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 70], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });
  const punch = interpolate(frame, [0, 5, 14], [0.9, 1.04, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 90, scale: `${punch}` }}>
        <Line
          enterFrame={0}
          fontSize={78}
          color={COLORS.carbon}
          weight={400}
          textAlign="left"
          segments={[{ text: "Llegas con " }, { text: "pendientes.", color: COLORS.petroleo }]}
        />
        <TrayIcon color={COLORS.petroleo} width={190} sheetFrames={[6, 12, 18, 24, 30]} startFrame={0} />
      </div>
    </AbsoluteFill>
  );
};
