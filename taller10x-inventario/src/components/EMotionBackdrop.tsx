import { CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";

/** The Espacio "E" mark as a living background element: it slides in, then
 * drifts with a slow rotate + scale for the rest of the scene. */
export const EMotionBackdrop: React.FC<{ durationInFrames: number; opacity?: number }> = ({
  durationInFrames,
  opacity = 0.14,
}) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const slideX = interpolate(frame, [0, 24], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rotate = interpolate(frame, [0, durationInFrames], [-5, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  return (
    <div
      style={{
        position: "absolute",
        right: -100,
        top: "50%",
        translate: `${slideX}px -50%`,
        rotate: `${rotate}deg`,
        scale: `${scale}`,
        opacity: opacity * enter,
      }}
    >
      <CanvasImage src={staticFile("images/espacio-e-petroleo.png")} width={620} height={962} fit="contain" />
    </div>
  );
};
