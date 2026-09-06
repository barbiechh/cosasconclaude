import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { RollingNumber } from "./RollingNumber";

export const TaskRow: React.FC<{
  label: string;
  hours: number;
  enterFrame: number;
  fontSize?: number;
}> = ({ label, hours, enterFrame, fontSize = 34 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [enterFrame, enterFrame + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [enterFrame, enterFrame + 5], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 1100,
        padding: "18px 0",
        opacity,
        translate: `0px ${translateY}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: COLORS.textPrimary,
          }}
        />
        <span style={{ fontFamily, fontSize, fontWeight: 400, color: COLORS.textPrimary }}>
          {label}
        </span>
      </div>
      <RollingNumber
        fromValue={0}
        toValue={hours}
        startFrame={enterFrame}
        endFrame={enterFrame + 18}
        suffix=" h"
        fontSize={fontSize}
        weight={700}
      />
    </div>
  );
};
