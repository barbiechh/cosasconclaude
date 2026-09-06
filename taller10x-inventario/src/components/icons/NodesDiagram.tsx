import { interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../../theme";
import { StrokePath } from "../StrokePath";

const LABELS = ["REPORTES", "CORREOS", "PROPUESTAS", "PROSPECCIÓN", "MINUTAS", "COTIZACIONES"];

// Full-frame coordinates (viewBox matches the 1920x1080 canvas 1:1) kept
// well below the headline band so the diagram never sits on top of the text.
const POSITIONS = [
  { x: 260, y: 760 },
  { x: 620, y: 700 },
  { x: 1020, y: 700 },
  { x: 1380, y: 760 },
  { x: 1550, y: 950 },
  { x: 370, y: 950 },
];

const CENTER = { x: 960, y: 860 };

/**
 * LA_nodos: six labeled nodes connecting to a center, drawn one at a time.
 * `unravel` (T13) redirects the lines outward past the frame edge instead.
 */
export const NodesDiagram: React.FC<{
  color: string;
  labelColor: string;
  startFrame?: number;
  staggerFrames?: number;
  unravelFrame?: number;
}> = ({ color, labelColor, startFrame = 0, staggerFrames = 8, unravelFrame }) => {
  const frame = useCurrentFrame();

  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      {POSITIONS.map((pos, i) => {
        const nodeStart = startFrame + i * staggerFrames;
        const unravelProgress =
          unravelFrame !== undefined
            ? interpolate(frame, [unravelFrame, unravelFrame + 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;
        const dx = (pos.x - CENTER.x) * unravelProgress * 1.4;
        const dy = (pos.y - CENTER.y) * unravelProgress * 1.4;
        const opacity = interpolate(frame, [nodeStart, nodeStart + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <g key={i} style={{ opacity: opacity * (1 - unravelProgress * 0.5) }}>
            <StrokePath
              d={`M ${CENTER.x} ${CENTER.y} L ${pos.x + dx} ${pos.y + dy}`}
              color={color}
              strokeWidth={2}
              startFrame={nodeStart}
              durationInFrames={7}
            />
            <circle cx={pos.x + dx} cy={pos.y + dy} r={7} fill={color} />
            <text
              x={pos.x + dx}
              y={pos.y + dy - 20}
              fill={labelColor}
              fontFamily={fontFamily}
              fontSize={22}
              fontWeight={500}
              letterSpacing={1.5}
              textAnchor="middle"
            >
              {LABELS[i]}
            </text>
          </g>
        );
      })}
      <circle cx={CENTER.x} cy={CENTER.y} r={7} fill={color} opacity={0.6} />
    </svg>
  );
};
