import { StrokePath } from "../StrokePath";

/** "</>" brackets struck through — the "no code needed" symbol. */
export const CodeSlashIcon: React.FC<{ color: string; strikeColor: string; size: number; startFrame?: number }> = ({
  color,
  strikeColor,
  size,
  startFrame = 0,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      <StrokePath d="M 70 55 L 25 100 L 70 145" color={color} strokeWidth={2.5} startFrame={startFrame} durationInFrames={10} />
      <StrokePath d="M 130 55 L 175 100 L 130 145" color={color} strokeWidth={2.5} startFrame={startFrame + 4} durationInFrames={10} />
      <StrokePath d="M 118 40 L 82 160" color={color} strokeWidth={2.5} startFrame={startFrame + 8} durationInFrames={10} />
      <StrokePath d="M 5 185 L 195 15" color={strikeColor} strokeWidth={3.5} startFrame={startFrame + 20} durationInFrames={9} />
    </svg>
  );
};
