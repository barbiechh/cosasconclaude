import { interpolate, useCurrentFrame } from "remotion";
import { StrokePath } from "../StrokePath";

const TARGETS = [
  { x: 60, y: 210 },
  { x: 170, y: 260 },
  { x: 300, y: 260 },
  { x: 410, y: 210 },
];

/**
 * A clean "one hub, several tasks" motif: a solid dot (the director) with a
 * fan of lines down to small task squares. Replaces the earlier silhouette
 * treatment, which read as noise rather than a person directing work.
 */
export const DirectorHub: React.FC<{ color: string; size: number; startFrame?: number }> = ({
  color,
  size,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const hubScale = interpolate(frame, [startFrame, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={size} height={size * (300 / 470)} viewBox="0 0 470 300" style={{ overflow: "visible" }}>
      <circle cx={235} cy={40} r={22 * hubScale} fill={color} />
      {TARGETS.map((t, i) => {
        const lineStart = startFrame + 8 + i * 5;
        return (
          <g key={i}>
            <StrokePath d={`M 235 40 L ${t.x} ${t.y}`} color={color} strokeWidth={1.5} startFrame={lineStart} durationInFrames={8} />
            <StrokePath
              d={`M ${t.x - 16} ${t.y - 16} L ${t.x + 16} ${t.y - 16} L ${t.x + 16} ${t.y + 16} L ${t.x - 16} ${t.y + 16} Z`}
              color={color}
              strokeWidth={1.5}
              startFrame={lineStart + 6}
              durationInFrames={8}
            />
          </g>
        );
      })}
    </svg>
  );
};
