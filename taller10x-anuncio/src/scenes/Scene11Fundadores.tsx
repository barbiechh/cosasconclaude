import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { PortraitCard } from "../components/PortraitCard";

// 0:44 - 0:49 (150f) — Who teaches it: the two Espacio co-founders.
export const Scene11Fundadores: React.FC = () => {
  const frame = useCurrentFrame();

  const leftBob = interpolate(frame, [0, 75, 150], [0, -8, 0]);
  const rightBob = interpolate(frame, [0, 75, 150], [0, 8, 0]);

  const lineOpacity = interpolate(frame, [100, 115], [0, 1], {
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", gap: 100 }}>
          <div style={{ translate: `0px ${leftBob}px` }}>
            <PortraitCard
              photoFile="images/lalo-garcia.png"
              role="Cofundador · Espacio"
              name="Lalo García"
              enterFrame={0}
              fromLeft
            />
          </div>
          <div style={{ translate: `0px ${rightBob}px` }}>
            <PortraitCard
              photoFile="images/abraham-cobos.png"
              role="Cofundador · Espacio"
              name="Abraham Cobos"
              enterFrame={0}
              fromLeft={false}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 30,
            fontWeight: 500,
            color: COLORS.textSecondary,
            opacity: lineOpacity,
          }}
        >
          Han trabajado con más de 20 corporaciones en México.
        </div>
      </div>
    </AbsoluteFill>
  );
};
