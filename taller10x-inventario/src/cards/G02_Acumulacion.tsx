import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { TrayIcon } from "../components/icons/TrayIcon";

const WORD_FRAMES = [52, 69, 86, 108, 125];
const WORDS = ["Reportes.", "Correos.", "Minutas.", "Prospección.", "Cotizaciones."];

// T03 (0-52) + T04 (52-108) + T05 (108-155) — marfil. The list grows until
// it overflows the tray.
export const G02_Acumulacion: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 155], [1, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const t03Shrink = interpolate(frame, [42, 52], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const t03RiseY = interpolate(frame, [42, 52], [0, -330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t03Opacity = interpolate(frame, [52, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const listOpacity = interpolate(frame, [50, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const listScale = interpolate(frame, [108, 118], [1, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const overflowY = interpolate(frame, [125, 145], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ scale: `${t03Shrink}`, translate: `0px ${t03RiseY}px`, opacity: t03Opacity, position: "absolute" }}>
        <Line
          fontSize={72}
          color={COLORS.carbon}
          weight={400}
          segments={[
            { text: "Y no fue lo " },
            { text: "único.", color: COLORS.petroleo, decoration: "underline", decorationFrame: 16 },
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
        <TrayIcon color={COLORS.petroleo} width={190} sheetFrames={WORD_FRAMES} startFrame={48} />
      </div>
    </AbsoluteFill>
  );
};
