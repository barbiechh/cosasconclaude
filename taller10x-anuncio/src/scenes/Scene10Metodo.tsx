import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Pill } from "../components/Pill";

const PILLS = ["Cero código", "Grupos reducidos", "Tus archivos reales"];

// 0:40 - 0:44 (120f) — Method pills, two waves. No bounce on the pills
// themselves (the brief calls that out explicitly) — the extra motion here
// comes from a slow living-camera drift on the whole group instead.
export const Scene10Metodo: React.FC = () => {
  const frame = useCurrentFrame();

  const drift = interpolate(frame, [0, 120], [-6, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  const pillStyle = (enterFrame: number) => {
    const opacity = interpolate(frame, [enterFrame, enterFrame + 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateY = interpolate(frame, [enterFrame, enterFrame + 9], [10, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    const scale = interpolate(frame, [enterFrame, enterFrame + 9], [0.92, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      output: "perceptual-scale",
    });
    return { opacity, translate: `0px ${translateY}px`, scale: `${scale}` };
  };

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
          gap: 32,
          translate: `${drift}px 0px`,
        }}
      >
        <div style={pillStyle(0)}>
          <Pill variant="outline" fontSize={26}>
            <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
              Con
              <span style={{ fontWeight: 700 }}>Claude</span>
              y
              <span style={{ fontWeight: 700 }}>ChatGPT</span>
            </span>
          </Pill>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {PILLS.map((label, i) => (
            <div key={label} style={pillStyle(16 + i * 6)}>
              <Pill variant="outline" fontSize={24}>
                {label}
              </Pill>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
