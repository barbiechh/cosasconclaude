import { StrokePath } from "../StrokePath";

const TARGETS = [
  { x: 40, y: 40 },
  { x: 160, y: 20 },
  { x: 190, y: 100 },
  { x: 150, y: 175 },
  { x: 30, y: 165 },
];

/**
 * Shared "N lines radiating outward, one at a time" motif — used for the
 * silhouette-to-tasks diagram (LA_silueta_agentes) and for the emptied tray
 * sending its work elsewhere (LA_bandeja, empty state).
 */
export const RadiatingArrows: React.FC<{
  color: string;
  size: number;
  centerX?: number;
  centerY?: number;
  startFrame?: number;
  staggerFrames?: number;
  markers?: boolean;
}> = ({ color, size, centerX = 100, centerY = 100, startFrame = 0, staggerFrames = 4, markers = true }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      {TARGETS.map((t, i) => (
        <g key={i}>
          <StrokePath
            d={`M ${centerX} ${centerY} L ${t.x} ${t.y}`}
            color={color}
            strokeWidth={1.5}
            startFrame={startFrame + i * staggerFrames}
            durationInFrames={6}
          />
          {markers ? (
            <rect
              x={t.x - 8}
              y={t.y - 8}
              width={16}
              height={16}
              rx={2}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              opacity={0.9}
            />
          ) : null}
        </g>
      ))}
    </svg>
  );
};
