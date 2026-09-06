import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Card } from "../components/Card";

const ITEMS = [
  "Dos llamadas 1 a 1",
  "Grabación editada del día",
  "Taller de actualización",
  "Biblioteca de prompts y flujos",
];

// 0:49 - 0:53 (120f) — Four cards fan in, then settle into a stitched row.
export const Scene12Acompanamiento: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleScale = interpolate(frame, [0, 14], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  const lineProgress = interpolate(frame, [55, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const stitchPunch = interpolate(frame, [88, 93, 102], [1, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
          scale: `${stitchPunch}`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: 2,
            color: COLORS.textPrimary,
            opacity: titleOpacity,
            scale: `${titleScale}`,
          }}
        >
          45 DÍAS DE ACOMPAÑAMIENTO
        </div>

        <div style={{ position: "relative", display: "flex", gap: 28 }}>
          <div
            style={{
              position: "absolute",
              top: -20,
              left: 40,
              width: `${lineProgress * (4 * 260 + 3 * 28 - 80)}px`,
              height: 2,
              backgroundColor: COLORS.geometry,
            }}
          />
          {ITEMS.map((item, i) => {
            const enterFrame = 12 + i * 3;
            const opacity = interpolate(frame, [enterFrame, enterFrame + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const rotate = interpolate(frame, [enterFrame, enterFrame + 16], [i % 2 === 0 ? -6 : 6, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            const translateY = interpolate(frame, [enterFrame, enterFrame + 16], [-30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });
            return (
              <div
                key={item}
                style={{
                  opacity,
                  rotate: `${rotate}deg`,
                  translate: `0px ${translateY}px`,
                }}
              >
                <Card width={260} padding={28}>
                  <div style={{ fontFamily, fontSize: 24, fontWeight: 500, color: COLORS.textPrimary }}>
                    {item}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
