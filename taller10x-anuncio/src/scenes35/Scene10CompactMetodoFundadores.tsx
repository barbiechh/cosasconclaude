import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Pill } from "../components/Pill";
import { PortraitCard } from "../components/PortraitCard";

const PILLS = ["Cero código", "Grupos reducidos", "Tus archivos reales"];
const SWITCH_FRAME = 24;

// 35s cut — "Pills de método + retratos de cofundadores en split rápido"
// (brief's own 30s note). Method pills for the first ~0.8s, hard cut to a
// quick founders split for the rest. 60f total.
export const Scene10CompactMetodoFundadores: React.FC = () => {
  const frame = useCurrentFrame();
  const showFounders = frame >= SWITCH_FRAME;

  const pillStyle = (enterFrame: number) => {
    const opacity = interpolate(frame, [enterFrame, enterFrame + 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const translateY = interpolate(frame, [enterFrame, enterFrame + 6], [8, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    return { opacity, translate: `0px ${translateY}px` };
  };

  const foundersFrame = frame - SWITCH_FRAME;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!showFounders ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={pillStyle(0)}>
            <Pill variant="outline" fontSize={24}>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                Con
                <span style={{ fontWeight: 700 }}>Claude</span>
                y
                <span style={{ fontWeight: 700 }}>ChatGPT</span>
              </span>
            </Pill>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {PILLS.map((label, i) => (
              <div key={label} style={pillStyle(3 + i * 3)}>
                <Pill variant="outline" fontSize={22}>
                  {label}
                </Pill>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 70, scale: "0.72" }}>
          <PortraitCard
            photoFile="images/lalo-garcia.png"
            role="Cofundador · Espacio"
            name="Lalo García"
            enterFrame={foundersFrame}
            fromLeft
          />
          <PortraitCard
            photoFile="images/abraham-cobos.png"
            role="Cofundador · Espacio"
            name="Abraham Cobos"
            enterFrame={foundersFrame}
            fromLeft={false}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
