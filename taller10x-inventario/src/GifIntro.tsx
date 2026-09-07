import { AbsoluteFill, CanvasImage, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";
import { Line } from "./components/Line";
import { Pill } from "./components/Pill";
import { TrayIcon } from "./components/icons/TrayIcon";
import { DirectorHub } from "./components/icons/DirectorHub";
import { ColorWipe } from "./components/ColorWipe";
import { EMotionBackdrop } from "./components/EMotionBackdrop";

// A standalone GIF export: each beat gets its own background (durazno for
// the chaos of "pendientes", petróleo for the calm of "sistemas", marfil
// for the CTA), joined with color wipes, and each scene carries its own
// motion graphic instead of type alone.

const push = (frame: number, durationInFrames: number) =>
  interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

const Antes: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = interpolate(frame, [34, 38, 42, 46, 50], [0, -3, 3, -2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.durazno, justifyContent: "center", alignItems: "center", scale: `${push(frame, 70)}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
        <Line enterFrame={0} fontSize={78} color={COLORS.carbon} weight={400} textAlign="left" segments={[{ text: "Llegas con " }, { text: "pendientes.", color: COLORS.petroleo }]} />
        <div style={{ rotate: `${shake}deg` }}>
          <TrayIcon color={COLORS.petroleo} width={190} sheetFrames={[6, 12, 18, 24, 30]} startFrame={0} />
        </div>
      </div>
      <ColorWipe toColor={COLORS.petroleo} axis="x" fromEdge="end" startFrame={58} durationInFrames={12} />
    </AbsoluteFill>
  );
};

const Despues: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center", scale: `${push(frame, 64)}` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <DirectorHub color={COLORS.durazno} size={280} startFrame={2} />
        <Line instant fontSize={78} color={COLORS.marfil} weight={400} segments={[{ text: "Sales con " }, { text: "sistemas.", color: COLORS.durazno, decoration: "underline", decorationFrame: 22 }]} />
      </div>
      <ColorWipe toColor={COLORS.marfil} axis="x" fromEdge="end" startFrame={52} durationInFrames={12} />
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const enterOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillScale = interpolate(frame, [14, 22, 28], [0.55, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const pillOpacity = interpolate(frame, [14, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center", scale: `${push(frame, 80)}` }}>
      <EMotionBackdrop durationInFrames={80} />
      <div style={{ position: "absolute", top: 64, left: 64 }}>
        <CanvasImage src={staticFile("images/espacio-logo.png")} width={32} height={38} fit="contain" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, opacity: enterOpacity }}>
        <Line instant fontSize={58} color={COLORS.carbon} weight={400} segments={[{ text: "Multiplícate " }, { text: "×10", color: COLORS.petroleo, bold: true }, { text: " en un solo día." }]} />
        <div style={{ scale: `${pillScale}`, opacity: pillOpacity }}>
          <Pill fontSize={32}>Inscríbete al Taller 10x</Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GifIntro: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="Antes" durationInFrames={70} layout="none">
        <Antes />
      </Sequence>
      <Sequence name="Despues" from={70} durationInFrames={64} layout="none">
        <Despues />
      </Sequence>
      <Sequence name="CTA" from={134} durationInFrames={80} layout="none">
        <CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
