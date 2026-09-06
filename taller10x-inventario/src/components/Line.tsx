import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../theme";

export type Segment = {
  text: string;
  color?: string;
  bold?: boolean;
  decoration?: "underline" | "strike";
  decorationColor?: string;
  decorationFrame?: number;
  fadeOutFrame?: number;
};

/**
 * One line of kinetic type: a whole-block pop entrance (POP_palabra preset —
 * opacity + 12px, easeOutCubic, 8 frames) with per-segment color and an
 * optional hand-underline / strike-through that grows in on its own frame.
 */
export const Line: React.FC<{
  segments: Segment[];
  fontSize: number;
  color: string;
  weight?: number;
  enterFrame?: number;
  instant?: boolean;
  letterSpacing?: number;
  textAlign?: "center" | "left";
}> = ({ segments, fontSize, color, weight = 400, enterFrame = 0, instant = false, letterSpacing, textAlign = "center" }) => {
  const frame = useCurrentFrame();

  const opacity = instant
    ? 1
    : interpolate(frame, [enterFrame, enterFrame + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const translateY = instant
    ? 0
    : interpolate(frame, [enterFrame, enterFrame + 8], [12, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: weight,
        color,
        opacity,
        translate: `0px ${translateY}px`,
        letterSpacing,
        textAlign,
        lineHeight: 1.15,
      }}
    >
      {segments.map((seg, i) => {
        const decorationProgress =
          seg.decoration && seg.decorationFrame !== undefined
            ? interpolate(frame, [seg.decorationFrame, seg.decorationFrame + 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              })
            : 1;
        const segOpacity =
          seg.fadeOutFrame !== undefined
            ? interpolate(frame, [seg.fadeOutFrame, seg.fadeOutFrame + 10], [1, 0.35], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              whiteSpace: "pre",
              color: seg.color ?? color,
              fontWeight: seg.bold ? 700 : weight,
              opacity: segOpacity,
            }}
          >
            {seg.text}
            {seg.decoration ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: seg.decoration === "strike" ? "52%" : undefined,
                  bottom: seg.decoration === "underline" ? "-0.08em" : undefined,
                  height: fontSize * 0.045,
                  backgroundColor: seg.decorationColor ?? seg.color ?? color,
                  scale: `${decorationProgress} 1`,
                  transformOrigin: "left center",
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};
