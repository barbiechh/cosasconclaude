import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { ArcBehind } from "../components/icons/ArcBehind";
import { GridSquares } from "../components/icons/GridSquares";

// T26 (0-88) + T27 (88-140) — carbón. Bigger and more alive: photos slide
// in with a slight rotation settle, then bob gently while they hold.
export const G14_Fundadores: React.FC = () => {
  const frame = useCurrentFrame();

  const push = interpolate(frame, [0, 140], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  const labelOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punch = interpolate(frame, [0, 6, 16], [0.92, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  const leftOpacity = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leftX = interpolate(frame, [4, 24], [-260, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftRotate = interpolate(frame, [4, 24], [-8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftBob = interpolate(frame, [24, 78], [0, -12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rightOpacity = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightX = interpolate(frame, [10, 30], [260, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rightRotate = interpolate(frame, [10, 30], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rightBob = interpolate(frame, [30, 84], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shrink = interpolate(frame, [76, 88], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [76, 88], [0, -330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const namesFadeOut = interpolate(frame, [90, 116], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const numberOpacity = interpolate(frame, [94, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numberPunch = interpolate(frame, [94, 100, 108], [0.9, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ scale: `${shrink * punch}`, translate: `0px ${riseY}px`, opacity: namesFadeOut, position: "absolute" }}>
        <div style={{ opacity: labelOpacity, textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily, fontSize: 22, fontWeight: 400, letterSpacing: 3, color: COLORS.marfil, opacity: 0.7 }}>
            IMPARTIDO POR
          </div>
          <div style={{ fontFamily, fontSize: 28, fontWeight: 500, letterSpacing: 3, color: COLORS.durazno, marginTop: 6 }}>
            COFUNDADORES · ESPACIO
          </div>
        </div>
        <div style={{ display: "flex", gap: 150, position: "relative" }}>
          <div
            style={{
              position: "relative",
              width: 460,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              opacity: leftOpacity,
              translate: `${leftX}px ${leftBob}px`,
              rotate: `${leftRotate}deg`,
            }}
          >
            <ArcBehind color={COLORS.durazno} size={360} startFrame={6} />
            <CanvasImage
              src={staticFile("images/lalo-garcia.png")}
              width={300}
              height={370}
              fit="cover"
              style={{ borderRadius: 20, position: "relative" }}
            />
            <div style={{ fontFamily, fontSize: 56, fontWeight: 700, color: COLORS.marfil, position: "relative" }}>Lalo García</div>
          </div>
          <div
            style={{
              position: "relative",
              width: 460,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              opacity: rightOpacity,
              translate: `${rightX}px ${rightBob}px`,
              rotate: `${rightRotate}deg`,
            }}
          >
            <ArcBehind color={COLORS.durazno} size={360} startFrame={12} flip />
            <CanvasImage
              src={staticFile("images/abraham-cobos.png")}
              width={300}
              height={370}
              fit="cover"
              style={{ borderRadius: 20, position: "relative" }}
            />
            <div style={{ fontFamily, fontSize: 56, fontWeight: 700, color: COLORS.marfil, position: "relative" }}>Abraham Cobos</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", opacity: numberOpacity * 0.5 }}>
        <GridSquares color={COLORS.durazno} count={20} columns={5} cellSize={34} gap={14} startFrame={96} staggerFrames={2} />
      </div>
      <div style={{ position: "absolute", opacity: numberOpacity, scale: `${numberPunch}` }}>
        <div style={{ fontFamily, fontSize: 150, fontWeight: 700, color: COLORS.durazno, textAlign: "center" }}>+20</div>
        <div style={{ fontFamily, fontSize: 48, fontWeight: 400, color: COLORS.marfil, textAlign: "center" }}>corporaciones.</div>
      </div>
    </AbsoluteFill>
  );
};
