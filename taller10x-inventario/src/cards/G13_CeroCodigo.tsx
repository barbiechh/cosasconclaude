import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { Line } from "../components/Line";
import { DocumentIcon } from "../components/icons/DocumentIcon";
import { CodeSlashIcon } from "../components/icons/CodeSlashIcon";
import { EWatermark } from "../components/EWatermark";

const DOCS = [
  { start: 2, x: -190, y: -6, rotate: -7 },
  { start: 8, x: 0, y: -34, rotate: 0 },
  { start: 14, x: 190, y: -6, rotate: 7 },
];

// T24 (0-46) + T25 (46-108) — marfil. Second breather, now more literal:
// three files fly in and stack for "tus archivos", then the group rises
// away as a `</>` mark draws in and gets struck through for "cero código",
// paying off with the Claude/ChatGPT chips landing right after the strike.
export const G13_CeroCodigo: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 108], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const shrink = interpolate(frame, [36, 46], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [36, 46], [0, -280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const t24Opacity = interpolate(frame, [46, 72], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const codeIconOpacity = interpolate(frame, [46, 56], [0, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chip1Scale = interpolate(frame, [78, 84, 90], [0.4, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const chip1Opacity = interpolate(frame, [78, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chip2Scale = interpolate(frame, [84, 90, 96], [0.4, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const chip2Opacity = interpolate(frame, [84, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <EWatermark />
      <div style={{ opacity: codeIconOpacity, position: "absolute", translate: "0px -170px" }}>
        <CodeSlashIcon color={COLORS.petroleo} strikeColor={COLORS.carbon} size={280} startFrame={48} />
      </div>

      <div
        style={{
          scale: `${shrink}`,
          translate: `0px ${riseY}px`,
          opacity: t24Opacity,
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", width: 700, height: 150 }}>
          {DOCS.map(({ start, x, y, rotate }, i) => {
            const slideY = interpolate(frame, [start, start + 16], [130, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const opacity = interpolate(frame, [start, start + 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  translate: `calc(-50% + ${x}px) calc(-50% + ${y + slideY}px)`,
                  rotate: `${rotate}deg`,
                  opacity,
                }}
              >
                <DocumentIcon color={COLORS.petroleo} size={62} startFrame={start} />
              </div>
            );
          })}
        </div>
        <Line fontSize={72} color={COLORS.carbon} weight={400} segments={[{ text: "Con " }, { text: "tus", color: COLORS.petroleo }, { text: " archivos." }]} />
      </div>

      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 42 }}>
        <Line enterFrame={50} fontSize={78} color={COLORS.carbon} weight={400} segments={[{ text: "Cero", color: COLORS.petroleo, bold: true }, { text: " código." }]} />
        <div style={{ display: "flex", gap: 22 }}>
          <div
            style={{
              scale: `${chip1Scale}`,
              opacity: chip1Opacity,
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: `2px solid ${COLORS.carbon}`,
              borderRadius: 999,
              padding: "10px 26px 10px 18px",
              fontFamily,
              fontSize: 20,
              fontWeight: 600,
              color: COLORS.carbon,
            }}
          >
            <CanvasImage src={staticFile("images/claude-symbol.png")} width={22} height={22} fit="contain" style={{ filter: "brightness(0)" }} />
            Claude
          </div>
          <div
            style={{
              scale: `${chip2Scale}`,
              opacity: chip2Opacity,
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: `2px solid ${COLORS.carbon}`,
              borderRadius: 999,
              padding: "10px 26px 10px 18px",
              fontFamily,
              fontSize: 20,
              fontWeight: 600,
              color: COLORS.carbon,
            }}
          >
            <CanvasImage src={staticFile("images/chatgpt-logo.png")} width={20} height={20} fit="contain" />
            ChatGPT
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
