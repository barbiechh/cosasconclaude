import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { ClockIcon } from "../components/icons/ClockIcon";
import { DayBlocks } from "../components/icons/DayBlocks";
import { Line } from "../components/Line";

// T06 (0-60) + T07 (60-114) — petróleo. "16 horas" lands and stays; the
// clause under it recomposes into "Dos días completos."
export const G03_Total: React.FC = () => {
  const frame = useCurrentFrame();

  const shrink = interpolate(frame, [46, 58], [1, 0.34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [46, 58], [0, -420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const clockOpacity = interpolate(frame, [46, 58], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blocksOpacity = interpolate(frame, [64, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", opacity: clockOpacity }}>
        <ClockIcon color={COLORS.durazno} size={620} startFrame={0} turns={7} spinDurationInFrames={44} />
      </div>

      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px`, display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily, fontWeight: 700, fontSize: 260, color: COLORS.durazno }}>16</span>
        <span style={{ fontFamily, fontWeight: 400, fontSize: 62, color: COLORS.marfil, marginLeft: 18 }}>
          horas a la semana.
        </span>
      </div>

      <div style={{ position: "absolute", translate: "0px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <Line
          enterFrame={64}
          fontSize={72}
          color={COLORS.marfil}
          weight={400}
          segments={[
            { text: "Dos días", color: COLORS.durazno, bold: true },
            { text: " completos." },
          ]}
        />
        <div style={{ opacity: blocksOpacity }}>
          <DayBlocks color={COLORS.durazno} width={110} startFrame={66} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
