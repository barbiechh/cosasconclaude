import { Composition } from "remotion";
import { Landing, FPS, DURATION_IN_FRAMES, WIDTH, HEIGHT } from "./Landing";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Landing"
        component={Landing}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
