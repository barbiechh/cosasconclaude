import { interpolate, useCurrentFrame } from "remotion";

/** LA_cuadricula: a grid of small squares, count parameterized, fast stagger. */
export const GridSquares: React.FC<{
  color: string;
  count: number;
  columns: number;
  cellSize: number;
  gap?: number;
  startFrame?: number;
  staggerFrames?: number;
}> = ({ color, count, columns, cellSize, gap = 8, startFrame = 0, staggerFrames = 2 }) => {
  const frame = useCurrentFrame();
  const rows = Math.ceil(count / columns);
  const width = columns * cellSize + (columns - 1) * gap;
  const height = rows * cellSize + (rows - 1) * gap;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {Array.from({ length: count }).map((_, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const cellStart = startFrame + i * staggerFrames;
        const scale = interpolate(frame, [cellStart, cellStart + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const cx = col * (cellSize + gap) + cellSize / 2;
        const cy = row * (cellSize + gap) + cellSize / 2;
        return (
          <rect
            key={i}
            x={cx - (cellSize / 2) * scale}
            y={cy - (cellSize / 2) * scale}
            width={cellSize * scale}
            height={cellSize * scale}
            rx={2}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
          />
        );
      })}
    </svg>
  );
};
