import { StrokePath } from "../StrokePath";

/** A single wide arc from the Espacio symbol, used behind a name. */
export const ArcBehind: React.FC<{ color: string; size: number; startFrame?: number; flip?: boolean }> = ({
  color,
  size,
  startFrame = 0,
  flip = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      style={{ position: "absolute", overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}
    >
      <StrokePath
        d="M -20 260 C 60 300 260 220 260 20"
        color={color}
        strokeWidth={2}
        startFrame={startFrame}
        durationInFrames={26}
      />
    </svg>
  );
};
