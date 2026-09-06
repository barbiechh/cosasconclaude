import { Easing, interpolate, useCurrentFrame } from "remotion";
import { StrokePath } from "../StrokePath";

/**
 * LA_bandeja: an in-tray that fills with sheets one by one. `sheetFrames`
 * gives the frame each sheet should land on; sheets beyond the tray's rim
 * overflow upward (the "desbordada" state), matching the brief's language
 * of pendientes spilling out of frame.
 */
export const TrayIcon: React.FC<{
  color: string;
  width: number;
  sheetFrames: number[];
  startFrame?: number;
  emptying?: boolean;
}> = ({ color, width, sheetFrames, startFrame = 0, emptying = false }) => {
  const frame = useCurrentFrame();

  return (
    <svg width={width} height={width * 1.6} viewBox="0 0 200 320" style={{ overflow: "visible" }}>
      <StrokePath
        d="M 20 220 L 60 300 L 140 300 L 180 220"
        color={color}
        strokeWidth={2}
        startFrame={startFrame}
        durationInFrames={10}
      />
      <StrokePath
        d="M 20 220 L 180 220"
        color={color}
        strokeWidth={2}
        startFrame={startFrame + 3}
        durationInFrames={6}
      />
      {sheetFrames.map((sheetFrame, i) => {
        const yStack = 210 - i * 26;
        const dropProgress = interpolate(frame, [sheetFrame, sheetFrame + 8], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const opacity = interpolate(frame, [sheetFrame, sheetFrame + 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const exitOpacity = emptying
          ? interpolate(frame, [sheetFrame, sheetFrame + 10], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 1;
        return (
          <rect
            key={i}
            x={45}
            y={yStack - 60 * dropProgress}
            width={110}
            height={14}
            rx={2}
            fill={color}
            opacity={opacity * exitOpacity}
          />
        );
      })}
    </svg>
  );
};
