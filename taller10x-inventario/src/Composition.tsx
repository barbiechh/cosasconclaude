import { Composition } from "remotion";
import { Ad70 } from "./Ad70";
import { GifIntro } from "./GifIntro";

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
        durationInFrames={286}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
