import { StrokePath } from "../StrokePath";

/** LA_bloques_dia: two rectangles filling with diagonal hatch lines. */
export const DayBlocks: React.FC<{ color: string; width: number; startFrame?: number }> = ({
  color,
  width,
  startFrame = 0,
}) => {
  const hatchCount = 6;

  return (
    <svg width={width * 2 + 24} height={(width * 2 + 24) * (124 / 424)} viewBox="0 0 424 124" style={{ overflow: "visible" }}>
      {[0, 1].map((blockIndex) => {
        const x0 = blockIndex * 224;
        const blockStart = startFrame + blockIndex * 8;
        return (
          <g key={blockIndex}>
            <StrokePath
              d={`M ${x0} 4 L ${x0 + 200} 4 L ${x0 + 200} 120 L ${x0} 120 Z`}
              color={color}
              strokeWidth={2}
              startFrame={blockStart}
              durationInFrames={10}
            />
            {Array.from({ length: hatchCount }).map((_, i) => (
              <StrokePath
                key={i}
                d={`M ${x0 + 6 + i * 32} 116 L ${x0 + 36 + i * 32} 8`}
                color={color}
                strokeWidth={1.5}
                startFrame={blockStart + 10 + i * 2}
                durationInFrames={5}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
};
