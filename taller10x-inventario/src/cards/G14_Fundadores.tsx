import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { ArcBehind } from "../components/icons/ArcBehind";
import { GridSquares } from "../components/icons/GridSquares";

// T26 (0-70) + T27 (70-130) — carbón. Bigger throughout per feedback.
export const G14_Fundadores: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const namesOpacity = interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punch = interpolate(frame, [0, 6, 16], [0.92, 1.03, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  const shrink = interpolate(frame, [56, 68], [1, 0.42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [56, 68], [0, -330], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const namesFadeOut = interpolate(frame, [70, 96], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const numberOpacity = interpolate(frame, [74, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const numberPunch = interpolate(frame, [74, 80, 88], [0.9, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center" }}>
      <div style={{ scale: `${shrink * punch}`, translate: `0px ${riseY}px`, opacity: namesFadeOut, position: "absolute" }}>
        <div style={{ fontFamily, fontSize: 28, fontWeight: 500, letterSpacing: 3, color: COLORS.durazno, opacity: labelOpacity, textAlign: "center", marginBottom: 28 }}>
          COFUNDADORES · ESPACIO
        </div>
        <div style={{ display: "flex", gap: 150, opacity: namesOpacity, position: "relative" }}>
          <div style={{ position: "relative", width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
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
          <div style={{ position: "relative", width: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
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
        <GridSquares color={COLORS.durazno} count={20} columns={5} cellSize={34} gap={14} startFrame={76} staggerFrames={2} />
      </div>
      <div style={{ position: "absolute", opacity: numberOpacity, scale: `${numberPunch}` }}>
        <div style={{ fontFamily, fontSize: 150, fontWeight: 700, color: COLORS.durazno, textAlign: "center" }}>+20</div>
        <div style={{ fontFamily, fontSize: 48, fontWeight: 400, color: COLORS.marfil, textAlign: "center" }}>corporaciones.</div>
      </div>
    </AbsoluteFill>
  );
};
