import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Card } from "../components/Card";
import { MorphNumber } from "../components/MorphNumber";

const ROWS: [string, string][] = [
  ["Ingresos del mes", "$1,840,000"],
  ["Gastos operativos", "$612,000"],
  ["Utilidad neta", "$1,228,000"],
  ["Margen", "66.7%"],
];

// 0:36 - 0:40 (120f) — Second flow card pushes in from the right.
export const Scene09Flujo2: React.FC = () => {
  const frame = useCurrentFrame();

  const cardX = interpolate(frame, [0, 20], [900, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const settle = interpolate(frame, [20, 24, 28], [1, 0.995, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ translate: `${cardX}px 0px`, scale: `${settle}` }}>
        <Card width={900} padding={56}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontFamily,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 2,
                color: COLORS.textSecondary,
                maxWidth: 420,
              }}
            >
              EL REPORTE FINANCIERO DEL MES
            </div>
            <MorphNumber from="6 h" to="20 min" morphFrame={70} fontSize={40} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {ROWS.map(([label, value], i) => {
              const rowStart = 26 + i * 12;
              const opacity = interpolate(frame, [rowStart, rowStart + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const translateY = interpolate(frame, [rowStart, rowStart + 8], [10, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              });
              return (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: i < ROWS.length - 1 ? "1px solid #EDEBE4" : "none",
                    opacity,
                    translate: `0px ${translateY}px`,
                  }}
                >
                  <span style={{ fontFamily, fontSize: 28, color: COLORS.textPrimary }}>{label}</span>
                  <span style={{ fontFamily, fontSize: 28, fontWeight: 700, color: COLORS.textPrimary }}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
