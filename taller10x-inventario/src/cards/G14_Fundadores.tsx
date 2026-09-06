import { AbsoluteFill, CanvasImage, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { ArcBehind } from "../components/icons/ArcBehind";
import { GridSquares } from "../components/icons/GridSquares";

// T26 (0-72) + T27 (72-138) — carbón.
export const G14_Fundadores: React.FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const namesOpacity = interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shrink = interpolate(frame, [58, 70], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
    output: "perceptual-scale",
  });
  const riseY = interpolate(frame, [58, 70], [0, -300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const namesFadeOut = interpolate(frame, [72, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const numberOpacity = interpolate(frame, [76, 86], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.carbon, justifyContent: "center", alignItems: "center" }}>
      <div style={{ scale: `${shrink}`, translate: `0px ${riseY}px`, opacity: namesFadeOut, position: "absolute" }}>
        <div style={{ fontFamily, fontSize: 24, fontWeight: 500, letterSpacing: 3, color: COLORS.durazno, opacity: labelOpacity, textAlign: "center", marginBottom: 24 }}>
          COFUNDADORES · ESPACIO
        </div>
        <div style={{ display: "flex", gap: 100, opacity: namesOpacity, position: "relative" }}>
          <div style={{ position: "relative", width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <ArcBehind color={COLORS.durazno} size={260} startFrame={6} />
            <CanvasImage
              src={staticFile("images/lalo-garcia.png")}
              width={160}
              height={200}
              fit="cover"
              style={{ borderRadius: 16, position: "relative" }}
            />
            <div style={{ fontFamily, fontSize: 40, fontWeight: 700, color: COLORS.marfil, position: "relative" }}>Lalo García</div>
          </div>
          <div style={{ position: "relative", width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <ArcBehind color={COLORS.durazno} size={260} startFrame={12} flip />
            <CanvasImage
              src={staticFile("images/abraham-cobos.png")}
              width={160}
              height={200}
              fit="cover"
              style={{ borderRadius: 16, position: "relative" }}
            />
            <div style={{ fontFamily, fontSize: 40, fontWeight: 700, color: COLORS.marfil, position: "relative" }}>Abraham Cobos</div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", opacity: numberOpacity * 0.5 }}>
        <GridSquares color={COLORS.durazno} count={20} columns={5} cellSize={34} gap={14} startFrame={78} staggerFrames={2} />
      </div>
      <div style={{ position: "absolute", opacity: numberOpacity }}>
        <div style={{ fontFamily, fontSize: 130, fontWeight: 700, color: COLORS.durazno, textAlign: "center" }}>+20</div>
        <div style={{ fontFamily, fontSize: 44, fontWeight: 400, color: COLORS.marfil, textAlign: "center" }}>corporaciones.</div>
      </div>
    </AbsoluteFill>
  );
};
