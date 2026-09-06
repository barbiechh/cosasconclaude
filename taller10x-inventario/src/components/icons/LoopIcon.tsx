import { interpolate, useCurrentFrame } from "remotion";
import { StrokePath } from "../StrokePath";

/**
 * LA_nodos replacement: repetition read as repetition — two concentric
 * arcs with arrowheads, spinning in opposite directions, continuously.
 * Reads instantly as "loop / repeat", unlike the earlier node-web attempt.
 */
export const LoopIcon: React.FC<{ color: string; size: number; startFrame?: number }> = ({
  color,
  size,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();

  const drawIn = interpolate(frame, [startFrame, startFrame + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spinOuter = interpolate(frame, [startFrame, startFrame + 400], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spinInner = interpolate(frame, [startFrame, startFrame + 400], [0, -520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <g style={{ rotate: `${spinOuter}deg`, transformOrigin: "100px 100px", opacity: drawIn }}>
        <StrokePath d="M 100 12 A 88 88 0 1 1 24 145" color={color} strokeWidth={3} startFrame={startFrame} durationInFrames={16} />
        <path d="M 8 130 L 24 145 L 42 132" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g style={{ rotate: `${spinInner}deg`, transformOrigin: "100px 100px", opacity: drawIn }}>
        <StrokePath d="M 100 46 A 54 54 0 1 0 154 100" color={color} strokeWidth={3} startFrame={startFrame + 4} durationInFrames={16} />
        <path d="M 168 90 L 154 100 L 166 112" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};
