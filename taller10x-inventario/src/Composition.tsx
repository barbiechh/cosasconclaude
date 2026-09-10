import { Composition } from "remotion";
import { Ad70 } from "./Ad70";
import { GifIntro } from "./GifIntro";
import { CalculatorGif } from "./CalculatorGif";
import { EjemplosGif } from "./EjemplosGif";
import { FlowLoop } from "./FlowLoop";
import { FoundersStill } from "./FoundersStill";
import { TallerTitle } from "./TallerTitle";
import { COLORS } from "./theme";

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="ElInventario"
        component={Ad70}
        durationInFrames={1681}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GifIntro"
        component={GifIntro}
        durationInFrames={254}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CalculatorGif"
        component={CalculatorGif}
        durationInFrames={262}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="EjemplosGif"
        component={EjemplosGif}
        durationInFrames={400}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="FlowLoop"
        component={FlowLoop}
        durationInFrames={80}
        fps={30}
        width={480}
        height={160}
      />
      <Composition
        id="FoundersStill"
        component={FoundersStill}
        durationInFrames={40}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TallerTitlePetroleo"
        component={TallerTitle}
        durationInFrames={70}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ bg: COLORS.petroleo, labelColor: COLORS.durazno, textColor: COLORS.marfil, label: "CDMX · 25 SEP 2026", text: "Taller 10x" }}
      />
      <Composition
        id="TallerTitleMarfil"
        component={TallerTitle}
        durationInFrames={70}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ bg: COLORS.marfil, labelColor: COLORS.petroleo, textColor: COLORS.carbon, label: "CDMX · 25 SEP 2026", text: "Taller 10x" }}
      />
    </>
  );
};
