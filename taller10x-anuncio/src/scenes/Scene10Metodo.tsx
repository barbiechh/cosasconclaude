import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Pill } from "../components/Pill";

const PILLS = ["Cero código", "Grupos reducidos", "Tus archivos reales"];

// 0:40 - 0:44 (120f) — Method pills, two waves, no bounce.
export const Scene10Metodo: React.FC = () => {
  const frame = useCurrentFrame();

  const pillStyle = (enterFrame: number) => {
    const opacity = interpolate(frame, [enterFrame, enterFrame + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateY = interpolate(frame, [enterFrame, enterFrame + 10], [8, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    return { opacity, translate: `0px ${translateY}px` };
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
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
            <div key={label} style={pillStyle(20 + i * 4)}>
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
