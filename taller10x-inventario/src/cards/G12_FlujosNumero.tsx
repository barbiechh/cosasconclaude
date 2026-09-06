import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { RollDownNumber } from "../components/RollDownNumber";
import { CollapseArrow } from "../components/icons/CollapseArrow";

const SPLIT = 56;

// T22 (0-56) + T23 (56-112) — petróleo. Two proof numbers, same mechanic:
// the label changes and the whole block re-rolls. Tightened for pace.
export const G12_FlujosNumero: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 112], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const labelOpacityT22 = interpolate(frame, [0, 8, SPLIT - 8, SPLIT], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacityT23 = interpolate(frame, [SPLIT, SPLIT + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
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
          {frame < SPLIT ? (
            <RollDownNumber from="4 h" to="15 min" rollFrame={10} fontSize={140} color={COLORS.durazno} />
          ) : (
            <RollDownNumber from="6 h" to="20 min" rollFrame={SPLIT + 10} fontSize={140} color={COLORS.durazno} />
          )}
          <CollapseArrow
            color={COLORS.durazno}
            width={frame < SPLIT ? 220 : 150}
            drawFrame={frame < SPLIT ? 2 : SPLIT}
            collapseFrame={frame < SPLIT ? 10 : SPLIT + 10}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
