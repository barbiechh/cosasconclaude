import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { KineticWords } from "../components/KineticWords";

const ITEMS = [
  "enviar seguimiento a prospectos",
  "armar propuesta del cliente",
  "actualizar el reporte semanal",
  "confirmar la llamada de manana",
];

// 0:27 - 0:31 (120f) — A wipe turns the messy list into a working system.
export const Scene07Promesa: React.FC = () => {
  const frame = useCurrentFrame();

  const listOpacity = interpolate(frame, [40, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wipe = interpolate(frame, [46, 110], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
        <div style={{ textAlign: "center" }}>
          <KineticWords text="Llegas con tu lista de pendientes." startFrame={0} fontSize={52} />
          <div style={{ height: 10 }} />
          <KineticWords
            text="Sales con sistemas que la trabajan por ti."
            startFrame={22}
            fontSize={52}
            color={COLORS.textSecondary}
          />
        </div>

        <div style={{ position: "relative", width: 1000, height: 260, opacity: listOpacity }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              justifyContent: "center",
            }}
          >
            {ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "monospace",
                  fontSize: 26,
                  color: COLORS.textSecondary,
                  transform: `rotate(${i % 2 === 0 ? -0.6 : 0.5}deg)`,
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              justifyContent: "center",
              backgroundColor: COLORS.marfil,
              clipPath: `inset(0 ${100 - wipe}% 0 0)`,
            }}
          >
            {ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  fontFamily,
                  fontSize: 26,
                  fontWeight: 500,
                  color: COLORS.textPrimary,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    backgroundColor: COLORS.textPrimary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: COLORS.white,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${wipe}%`,
              width: 2,
              backgroundColor: COLORS.geometry,
              opacity: wipe > 0 && wipe < 100 ? 1 : 0,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
