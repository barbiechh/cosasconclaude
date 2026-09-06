import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const FONT_URL = staticFile("fonts/SpaceGrotesk-Variable.woff2");

for (const weight of ["400", "500", "700"]) {
  loadFont({ family: "Space Grotesk", url: FONT_URL, weight });
}

export const fontFamily = "Space Grotesk";

export const COLORS = {
  petroleo: "#003146",
  marfil: "#F5F4F0",
  carbon: "#111111",
  durazno: "#F3C7B1",
} as const;

export type Background = "petroleo" | "marfil" | "carbon";

/** Pairing rules from the brief, no exceptions: durazno never sits on marfil. */
export const paletteFor = (bg: Background) => {
  if (bg === "marfil") {
    return { bg: COLORS.marfil, text: COLORS.carbon, accent: COLORS.petroleo };
  }
  const bgColor = bg === "petroleo" ? COLORS.petroleo : COLORS.carbon;
  return { bg: bgColor, text: COLORS.marfil, accent: COLORS.durazno };
};
