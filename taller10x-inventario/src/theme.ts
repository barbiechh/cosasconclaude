import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const GOOGLE_SANS_FILES: Record<string, string> = {
  "400": "GoogleSans-400.ttf",
  "500": "GoogleSans-500.ttf",
  "700": "GoogleSans-700.ttf",
};

for (const [weight, file] of Object.entries(GOOGLE_SANS_FILES)) {
  loadFont({ family: "Google Sans", url: staticFile(`fonts/${file}`), weight });
}

export const fontFamily = "Google Sans";

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
