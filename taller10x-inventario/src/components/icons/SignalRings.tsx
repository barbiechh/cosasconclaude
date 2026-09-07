import { interpolate, useCurrentFrame } from "remotion";
import { StrokePath } from "../StrokePath";

const RADII = [160, 320, 480, 640, 800, 960];

/**
 * Concentric arcs radiating from the top-right corner, like a signal or a
 * radar sweep — replaces the single sine-wave motif with something with
 * more visual rhythm, still thin single-color line art.
 */
export const SignalRings: React.FC<{ color: string; startFrame?: number; opacity?: number }> = ({
  color,
  startFrame = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const cx = 1920;
  const cy = 0;

  const drift = interpolate(frame, [startFrame, startFrame + 200], [0, 14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      {RADII.map((r, i) => {
        const radius = r + drift;
        const d = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius}`;
        return (
          <StrokePath
            key={i}
            d={d}
            color={color}
            strokeWidth={1.5}
            startFrame={startFrame + i * 6}
            durationInFrames={26}
          />
        );
      })}
    </svg>
  );
};
