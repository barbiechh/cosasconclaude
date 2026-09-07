import { interpolate, useCurrentFrame } from "remotion";
import { StrokePath } from "../StrokePath";

/** A quick 8-ray impact burst — a comic-style "pow" for a punchy landing. */
export const BurstRays: React.FC<{ color: string; size: number; startFrame: number }> = ({ color, size, startFrame }) => {
  const frame = useCurrentFrame();
  const rayCount = 8;

  const groupOpacity = interpolate(frame, [startFrame, startFrame + 3, startFrame + 8, startFrame + 22], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (360 / rayCount) * i + 22.5;
    const rad = (angle * Math.PI) / 180;
    const inner = 34;
    const outer = 50;
    return {
      i,
      x1: 50 + Math.cos(rad) * inner,
      y1: 50 + Math.sin(rad) * inner,
      x2: 50 + Math.cos(rad) * outer,
      y2: 50 + Math.sin(rad) * outer,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", opacity: groupOpacity }}
    >
      {rays.map(({ x1, y1, x2, y2, i }) => (
        <StrokePath key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} color={color} strokeWidth={2.5} startFrame={startFrame + i * 0.6} durationInFrames={5} />
      ))}
    </svg>
  );
};
