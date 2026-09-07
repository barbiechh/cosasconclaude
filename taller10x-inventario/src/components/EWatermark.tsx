import { CanvasImage, staticFile } from "remotion";

/** The Espacio "E" mark, used as a faint corner watermark on marfil breather scenes. */
export const EWatermark: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  return (
    <div style={{ position: "absolute", right: -60, top: "50%", translate: "0px -50%", opacity }}>
      <CanvasImage src={staticFile("images/espacio-e-petroleo.png")} width={460} height={714} fit="contain" />
    </div>
  );
};
