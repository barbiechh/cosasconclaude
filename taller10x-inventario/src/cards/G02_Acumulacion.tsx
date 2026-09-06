import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { TrayIcon } from "../components/icons/TrayIcon";

const WORD_FRAMES = [40, 54, 68, 88, 102];
const WORDS = ["Reportes.", "Correos.", "Minutas.", "Prospección.", "Cotizaciones."];

// T03 (0-40) + T04 (40-88) + T05 (88-130) — marfil. The list grows until
// it overflows the tray. Tightened stagger for pace.
export const G02_Acumulacion: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 130], [1, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const t03Shrink = interpolate(frame, [30, 40], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const t03RiseY = interpolate(frame, [30, 40], [0, -330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t03Opacity = interpolate(frame, [40, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const listOpacity = interpolate(frame, [38, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const listScale = interpolate(frame, [88, 96], [1, 0.74], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const overflowY = interpolate(frame, [102, 120], [0, -60], {
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
            { text: "único.", color: COLORS.petroleo, decoration: "underline", decorationFrame: 14 },
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
        <TrayIcon color={COLORS.petroleo} width={190} sheetFrames={WORD_FRAMES} startFrame={36} />
      </div>
    </AbsoluteFill>
  );
};
