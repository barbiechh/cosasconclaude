import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { ClockIcon } from "../components/icons/ClockIcon";
import { DocumentIcon } from "../components/icons/DocumentIcon";
import { Line } from "../components/Line";

// T01 (0-48) + T02 (48-102) — carbón. The hook: no fade, opens on the number.
export const G01_Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const shrink = interpolate(frame, [38, 48], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [38, 48], [0, -400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const clockOpacity = interpolate(frame, [38, 48], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const docOpacity = interpolate(frame, [56, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", opacity: clockOpacity }}>
        <ClockIcon color={COLORS.durazno} size={1500} startFrame={0} />
      </div>
      <div style={{ position: "absolute", opacity: docOpacity }}>
        <DocumentIcon color={COLORS.durazno} size={220} startFrame={56} />
      </div>

      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px` }}>
        <Line
          instant
          fontSize={380}
          color={COLORS.marfil}
          weight={700}
          segments={[
            { text: "4", color: COLORS.durazno },
            { text: " horas." },
          ]}
        />
      </div>

      <div style={{ position: "absolute", translate: "0px 210px" }}>
        <Line
          enterFrame={50}
          fontSize={78}
          color={COLORS.marfil}
          weight={400}
          segments={[{ text: "Una sola propuesta." }]}
        />
      </div>
    </AbsoluteFill>
  );
};
