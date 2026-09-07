import { Composition } from "remotion";
import { Ad70 } from "./Ad70";

export const MyComposition = () => {
  return (
    <Composition
      id="ElInventario"
      component={Ad70}
      durationInFrames={1701}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
