import React from 'react';
import {Composition} from 'remotion';
import './styles/fonts';
import {MainVideo} from './compositions/MainVideo';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './data/timing';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Siempre con placeholders: para trabajar ritmo y layout sin fotos. */}
    <Composition id="CTRL-Preview" component={MainVideo} durationInFrames={TOTAL_FRAMES} fps={FPS}
      width={WIDTH} height={HEIGHT} defaultProps={{usePlaceholder: true}} />
    {/* Usa las fotos reales de /public si existen; si falta alguna, placeholder. */}
    <Composition id="CTRL-Final" component={MainVideo} durationInFrames={TOTAL_FRAMES} fps={FPS}
      width={WIDTH} height={HEIGHT} defaultProps={{usePlaceholder: false}} />
  </>
);
