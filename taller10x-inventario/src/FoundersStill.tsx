import { AbsoluteFill, CanvasImage, staticFile } from "remotion";
import { COLORS } from "./theme";
import { ArcBehind } from "./components/icons/ArcBehind";

// A static, text-free crop of the founders scene for standalone use —
// bigger photos, no labels or names.
export const FoundersStill: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.marfil, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 140 }}>
        <div style={{ position: "relative" }}>
          <ArcBehind color={COLORS.petroleo} size={560} startFrame={0} />
          <CanvasImage src={staticFile("images/lalo-garcia.png")} width={460} height={567} fit="cover" style={{ borderRadius: 28, position: "relative" }} />
        </div>
        <div style={{ position: "relative" }}>
          <ArcBehind color={COLORS.petroleo} size={560} startFrame={0} flip />
          <CanvasImage src={staticFile("images/abraham-cobos.png")} width={460} height={567} fit="cover" style={{ borderRadius: 28, position: "relative" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
