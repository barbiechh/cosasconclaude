import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { MorphNumber } from "../components/MorphNumber";

// 35s cut — Flujo 2 reduced to just its number, per the brief's own 30s note:
// "Flujo 2 solo como dato". 45f.
export const Scene09CompactStat: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div
          style={{
            fontFamily,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 2,
            color: COLORS.textSecondary,
            opacity: labelOpacity,
          }}
        >
          EL REPORTE FINANCIERO DEL MES
        </div>
        <MorphNumber from="6 h" to="20 min" morphFrame={18} fontSize={80} />
      </div>
    </AbsoluteFill>
  );
};
