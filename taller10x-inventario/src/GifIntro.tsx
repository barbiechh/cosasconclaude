import { AbsoluteFill, CanvasImage, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";
import { Line } from "./components/Line";
import { Pill } from "./components/Pill";
import { TrayIcon } from "./components/icons/TrayIcon";

// A standalone GIF export, deliberately not a slice of the ad: durazno
// background (never used full-bleed in the video), a poster-style frame,
// and slide transitions instead of the video's color wipes — so it reads
// as its own asset, not a clip lifted from the ad. Still the same story:
// the before/after of taking the workshop, then the CTA.

const Frame: React.FC = () => (
  <div style={{ position: "absolute", inset: 36, border: `3px solid ${COLORS.carbon}` }} />
);

const Logo: React.FC = () => (
  <div style={{ position: "absolute", top: 64, left: 64 }}>
    <CanvasImage src={staticFile("images/espacio-logo.png")} width={32} height={38} fit="contain" />
  </div>
);

const Antes: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const exitY = interpolate(frame, [durationInFrames - 14, durationInFrames], [0, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const exitOpacity = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 90, translate: `0px ${exitY}px`, opacity: exitOpacity }}>
      <Line enterFrame={0} fontSize={78} color={COLORS.carbon} weight={400} textAlign="left" segments={[{ text: "Llegas con " }, { text: "pendientes.", color: COLORS.petroleo }]} />
      <TrayIcon color={COLORS.petroleo} width={190} sheetFrames={[6, 12, 18, 24, 30]} startFrame={0} />
    </div>
  );
};

const Despues: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const enterY = interpolate(frame, [0, 14], [70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const enterOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ translate: `0px ${enterY}px`, opacity: enterOpacity * exitOpacity }}>
      <Line instant fontSize={78} color={COLORS.carbon} weight={400} segments={[{ text: "Sales con " }, { text: "sistemas.", color: COLORS.petroleo, decoration: "underline", decorationFrame: 14 }]} />
    </div>
  );
};

const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const enterY = interpolate(frame, [0, 14], [70, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const enterOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillScale = interpolate(frame, [16, 24, 30], [0.55, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const pillOpacity = interpolate(frame, [16, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, translate: `0px ${enterY}px`, opacity: enterOpacity }}>
      <Line instant fontSize={58} color={COLORS.carbon} weight={400} segments={[{ text: "Multiplícate " }, { text: "×10", color: COLORS.petroleo, bold: true }, { text: " en un solo día." }]} />
      <div style={{ scale: `${pillScale}`, opacity: pillOpacity }}>
        <Pill fontSize={32}>Inscríbete al Taller 10x</Pill>
      </div>
    </div>
  );
};

export const GifIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.durazno, justifyContent: "center", alignItems: "center" }}>
      <Sequence name="Antes" durationInFrames={70} layout="none">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Antes durationInFrames={70} />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Despues" from={70} durationInFrames={64} layout="none">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Despues durationInFrames={64} />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="CTA" from={134} durationInFrames={80} layout="none">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <CTA />
        </AbsoluteFill>
      </Sequence>
      <Frame />
      <Logo />
    </AbsoluteFill>
  );
};
