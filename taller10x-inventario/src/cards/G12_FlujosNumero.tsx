import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { RollDownNumber } from "../components/RollDownNumber";
import { CollapseArrow } from "../components/icons/CollapseArrow";

// T22 (0-78) + T23 (78-150) — petróleo. Two proof numbers, same mechanic:
// the label changes and the whole block re-rolls.
export const G12_FlujosNumero: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacityT22 = interpolate(frame, [0, 8, 70, 78], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacityT23 = interpolate(frame, [78, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ position: "relative", height: 34, width: 700, textAlign: "center" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              fontFamily,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: 2,
              color: COLORS.durazno,
              opacity: labelOpacityT22,
            }}
          >
            DE LA REUNIÓN A LA PROPUESTA
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              fontFamily,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: 2,
              color: COLORS.durazno,
              opacity: labelOpacityT23,
            }}
          >
            EL REPORTE DEL MES
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {frame < 78 ? (
            <RollDownNumber from="4 h" to="15 min" rollFrame={14} fontSize={140} color={COLORS.durazno} />
          ) : (
            <RollDownNumber from="6 h" to="20 min" rollFrame={92} fontSize={140} color={COLORS.durazno} />
          )}
          <CollapseArrow color={COLORS.durazno} width={frame < 78 ? 220 : 150} drawFrame={frame < 78 ? 2 : 80} collapseFrame={frame < 78 ? 14 : 92} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
