import { interpolate, useCurrentFrame } from "remotion";
import { StrokePath } from "../StrokePath";

/** LA_reloj: a thin circle with a hand spinning fast — the weight of hours. */
export const ClockIcon: React.FC<{
  color: string;
  size: number;
  startFrame?: number;
  turns?: number;
  spinDurationInFrames?: number;
}> = ({ color, size, startFrame = 0, turns = 4, spinDurationInFrames = 36 }) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [startFrame, startFrame + spinDurationInFrames], [0, turns * 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <StrokePath
        d="M 100 10 A 90 90 0 1 1 99.9 10"
        color={color}
        strokeWidth={2}
        startFrame={startFrame}
        durationInFrames={8}
      />
      <line
        x1={100}
        y1={100}
        x2={100}
        y2={28}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        style={{ rotate: `${rotation}deg`, transformOrigin: "100px 100px" }}
      />
      <circle cx={100} cy={100} r={4} fill={color} />
    </svg>
  );
};
