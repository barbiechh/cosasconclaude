import { CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";

export const PortraitCard: React.FC<{
  photoFile: string;
  role: string;
  name: string;
  enterFrame: number;
  fromLeft: boolean;
}> = ({ photoFile, role, name, enterFrame, fromLeft }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [enterFrame, enterFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [enterFrame, enterFrame + 16], [fromLeft ? -50 : 50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const scale = interpolate(frame, [enterFrame, enterFrame + 10, enterFrame + 20], [0.88, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        translate: `${translateX}px 0px`,
        scale: `${scale}`,
      }}
    >
      <CanvasImage
        src={staticFile(photoFile)}
        width={420}
        height={520}
        fit="cover"
        style={{ borderRadius: 24 }}
      />
      <div
        style={{
          marginTop: 28,
          fontFamily,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLORS.textSecondary,
        }}
      >
        {role}
      </div>
      <div
        style={{
          marginTop: 6,
          fontFamily,
          fontSize: 32,
          fontWeight: 700,
          color: COLORS.textPrimary,
        }}
      >
        {name}
      </div>
    </div>
  );
};
