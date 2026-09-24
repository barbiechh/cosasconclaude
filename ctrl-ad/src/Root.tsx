import React from 'react';
import {Composition} from 'remotion';
import {MainVideo} from './compositions/MainVideo';
import {FPS, WIDTH, HEIGHT, TOTAL_FRAMES, END_CARD_HOLD_SECONDS, secToFrame} from './data/timing';

const TOTAL_WITH_HOLD = TOTAL_FRAMES + secToFrame(END_CARD_HOLD_SECONDS);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vista previa: siempre placeholders, útil para trabajar el timing sin fotos reales. */}
      <Composition
        id="CTRL-Preview"
        component={MainVideo}
        durationInFrames={TOTAL_WITH_HOLD}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{usePlaceholder: true}}
      />

      {/* Composición final: usa los recursos reales de /public si existen, y cae a placeholder si falta alguno. */}
      <Composition
        id="CTRL-Final"
        component={MainVideo}
        durationInFrames={TOTAL_WITH_HOLD}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{usePlaceholder: false}}
      />
    </>
  );
};
