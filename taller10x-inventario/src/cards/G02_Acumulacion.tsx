import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { TrayIcon } from "../components/icons/TrayIcon";

const WORD_FRAMES = [48, 66, 84, 108, 126];
const WORDS = ["Reportes.", "Correos.", "Minutas.", "Prospección.", "Cotizaciones."];

// T03 (0-48) + T04 (48-108) + T05 (108-162) — marfil. The list grows until
// it overflows the tray.
export const G02_Acumulacion: React.FC = () => {
  const frame = useCurrentFrame();

  const t03Shrink = interpolate(frame, [38, 48], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const t03RiseY = interpolate(frame, [38, 48], [0, -330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t03Opacity = interpolate(frame, [48, 110], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const listOpacity = interpolate(frame, [46, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const listScale = interpolate(frame, [108, 118], [1, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const overflowY = interpolate(frame, [126, 150], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ scale: `${t03Shrink}`, translate: `0px ${t03RiseY}px`, opacity: t03Opacity, position: "absolute" }}>
        <Line
          fontSize={72}
          color={COLORS.carbon}
          weight={400}
          segments={[
            { text: "Y no fue lo " },
            { text: "único.", color: COLORS.petroleo, decoration: "underline", decorationFrame: 18 },
          ]}
        />
      </div>

      <div
        style={{
          opacity: listOpacity,
          scale: `${listScale}`,
          translate: `0px ${overflowY}px`,
          display: "flex",
          alignItems: "center",
          gap: 90,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {WORDS.map((word, i) => (
            <Line
              key={word}
              enterFrame={WORD_FRAMES[i]}
              fontSize={62}
              color={COLORS.carbon}
              weight={500}
              textAlign="left"
              segments={[{ text: word }]}
            />
          ))}
        </div>
        <TrayIcon color={COLORS.petroleo} width={190} sheetFrames={WORD_FRAMES} startFrame={44} />
      </div>
    </AbsoluteFill>
  );
};
