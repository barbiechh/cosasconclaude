import { StrokePath } from "../StrokePath";

/** LA_silueta_agentes: a simplified person, line-only, no fill. */
export const SilhouetteIcon: React.FC<{
  color: string;
  size: number;
  startFrame?: number;
  opacity?: number;
}> = ({ color, size, startFrame = 0, opacity = 1 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible", opacity }}>
      <StrokePath
        d="M 100 30 A 24 24 0 1 1 99.9 30"
        color={color}
        strokeWidth={2}
        startFrame={startFrame}
        durationInFrames={8}
      />
      <StrokePath
        d="M 55 170 C 55 110 145 110 145 170"
        color={color}
        strokeWidth={2}
        startFrame={startFrame + 6}
        durationInFrames={10}
      />
    </svg>
  );
};
