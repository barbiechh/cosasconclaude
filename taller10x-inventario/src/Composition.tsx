import { Composition } from "remotion";
import { Ad70 } from "./Ad70";

export const MyComposition = () => {
  return (
    <Composition
      id="ElInventario-70s"
      component={Ad70}
      durationInFrames={2112}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
