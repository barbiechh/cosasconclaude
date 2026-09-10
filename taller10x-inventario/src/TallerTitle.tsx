import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "./theme";

// A punchier "Taller 10x" title card — bigger overshoot bounce than the
// original scene, in two color variants (petróleo, matching the video;
// marfil, matching the recent standalone assets).
export const TallerTitle: React.FC<{
  bg: string;
  labelColor: string;
  textColor: string;
  label: string;
  text: string;
  withBackdrop?: boolean;
  titleFontSize?: number;
}> = ({ bg, labelColor, textColor, label, text, withBackdrop = false, titleFontSize = 130 }) => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 70], [1, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const labelOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelY = interpolate(frame, [0, 8], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const titleOpacity = interpolate(frame, [4, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleScale = interpolate(frame, [4, 14, 22], [0.4, 1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      {withBackdrop && (
        <div
          style={{
            position: "absolute",
            right: -260,
            bottom: -320,
            width: 900,
            height: 900,
            borderRadius: "50%",
            backgroundColor: labelColor,
            opacity: 0.45,
          }}
        />
      )}
      {withBackdrop && (
        <div
          style={{
            position: "absolute",
            right: 60,
            top: -260,
            width: 520,
            height: 520,
            borderRadius: "50%",
            backgroundColor: COLORS.durazno,
            opacity: 0.5,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          translate: `0px ${-140 + labelY}px`,
          opacity: labelOpacity,
          fontFamily,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 4,
          color: labelColor,
        }}
      >
        {label}
      </div>
      <div style={{ opacity: titleOpacity, scale: `${titleScale}`, fontFamily, fontSize: titleFontSize, fontWeight: 700, color: textColor }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};
