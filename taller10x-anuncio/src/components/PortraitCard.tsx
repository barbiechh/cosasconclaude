import { Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";

/**
 * Placeholder portrait block: a monogram on a solid block, standing in for
 * the real founder photography the brief asks production to source
 * (section 17, "Assets que hay que pedir antes de arrancar"). Swap the
 * monogram circle for a real <CanvasImage> once the photos exist.
 */
export const PortraitCard: React.FC<{
  initials: string;
  role: string;
  name: string;
  background: "petroleo" | "white";
  enterFrame: number;
  fromLeft: boolean;
}> = ({ initials, role, name, background, enterFrame, fromLeft }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [enterFrame, enterFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateX = interpolate(frame, [enterFrame, enterFrame + 16], [fromLeft ? -24 : 24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const isDark = background === "petroleo";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        translate: `${translateX}px 0px`,
      }}
    >
      <div
        style={{
          width: 420,
          height: 520,
          borderRadius: 24,
          backgroundColor: isDark ? COLORS.petroleo : COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isDark ? "none" : "0 12px 40px rgba(17,17,17,0.06)",
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: isDark ? "rgba(245,244,240,0.12)" : COLORS.pillBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily,
            fontWeight: 700,
            fontSize: 56,
            color: isDark ? COLORS.marfil : COLORS.textPrimary,
            letterSpacing: 2,
          }}
        >
          {initials}
        </div>
      </div>
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
