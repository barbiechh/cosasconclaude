import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Self-hosted so rendering never depends on reaching fonts.gstatic.com.
// Space Grotesk is a variable font: the same file serves every weight below.
const FONT_URL = staticFile("fonts/SpaceGrotesk-Variable.woff2");

for (const weight of ["400", "500", "700"]) {
  loadFont({ family: "Space Grotesk", url: FONT_URL, weight });
}

export const fontFamily = "Space Grotesk";

export const COLORS = {
  marfil: "#F5F4F0",
  textPrimary: "#111111",
  textSecondary: "#6B6B6B",
  pillBg: "#EDE7DC",
  geometry: "#E8B9A0",
  petroleo: "#0F3A4F",
  carbon: "#1E1E1E",
  white: "#FFFFFF",
} as const;
