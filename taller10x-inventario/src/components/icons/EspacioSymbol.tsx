import { StrokePath } from "../StrokePath";

/** LA_simbolo_espacio: the brand's wide arc crossed by horizontals. */
export const EspacioSymbol: React.FC<{
  color: string;
  startFrame?: number;
  flip?: boolean;
  opacity?: number;
}> = ({ color, startFrame = 0, flip = false, opacity = 1 }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, opacity, transform: flip ? "scaleX(-1)" : undefined }}
      preserveAspectRatio="xMidYMid slice"
    >
      <StrokePath
        d="M -100 850 C 400 1050, 900 -50, 1500 250 C 1750 400, 1850 250, 2050 100"
        color={color}
        strokeWidth={2}
        startFrame={startFrame}
        durationInFrames={30}
      />
      <StrokePath
        d="M 200 300 L 1750 300"
        color={color}
        strokeWidth={1.5}
        startFrame={startFrame + 8}
        durationInFrames={22}
      />
      <StrokePath
        d="M 100 720 L 1350 720"
        color={color}
        strokeWidth={1.5}
        startFrame={startFrame + 14}
        durationInFrames={22}
      />
    </svg>
  );
};
