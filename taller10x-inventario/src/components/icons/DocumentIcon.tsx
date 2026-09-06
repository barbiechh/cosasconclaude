import { StrokePath } from "../StrokePath";

/** LA_hoja_propuesta: a simplified document — outline plus a few text lines. */
export const DocumentIcon: React.FC<{ color: string; size: number; startFrame?: number }> = ({
  color,
  size,
  startFrame = 0,
}) => {
  const lines = [40, 60, 80, 60];
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 160 208" style={{ overflow: "visible" }}>
      <StrokePath
        d="M 10 4 L 110 4 L 150 44 L 150 204 L 10 204 Z"
        color={color}
        strokeWidth={2}
        startFrame={startFrame}
        durationInFrames={12}
      />
      <StrokePath d="M 110 4 L 110 44 L 150 44" color={color} strokeWidth={2} startFrame={startFrame + 6} durationInFrames={6} />
      {lines.map((w, i) => (
        <StrokePath
          key={i}
          d={`M 30 ${80 + i * 24} L ${30 + w} ${80 + i * 24}`}
          color={color}
          strokeWidth={1.5}
          startFrame={startFrame + 14 + i * 3}
          durationInFrames={5}
        />
      ))}
    </svg>
  );
};
