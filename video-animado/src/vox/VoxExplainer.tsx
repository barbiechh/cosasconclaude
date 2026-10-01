import React from 'react';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, Series, staticFile, useVideoConfig} from 'remotion';
import {SCENES} from '../data/timeline';
import {VoxHeadline} from './VoxHeadline';
import {FONT_HEAD, FONT_TYPE, V} from './style';
import {VoxQuestion} from './scenes/VoxQuestion';
import {VoxStudy} from './scenes/VoxStudy';
import {VoxReveal} from './scenes/VoxReveal';
import {VoxBackwards} from './scenes/VoxBackwards';

loadFont({family: FONT_HEAD, url: staticFile('fonts/oswald-latin-700-normal.woff2'), weight: '700'});
loadFont({family: FONT_TYPE, url: staticFile('fonts/special-elite-latin-400-normal.woff2'), weight: '400'});

// Versión "estilo Vox": collage de papel, semitono, marcador y rotulador.
export const VoxExplainer: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: V.paper}}>
      <Series>
        <Series.Sequence name="Pregunta" durationInFrames={SCENES.question.duration} premountFor={fps}>
          <VoxQuestion />
        </Series.Sequence>
        <Series.Sequence name="Estudio" durationInFrames={SCENES.study.duration} premountFor={fps}>
          <VoxStudy />
        </Series.Sequence>
        <Series.Sequence name="Revelación" durationInFrames={SCENES.reveal.duration} premountFor={fps}>
          <VoxReveal />
        </Series.Sequence>
        <Series.Sequence name="Al revés" durationInFrames={SCENES.backwards.duration} premountFor={fps}>
          <VoxBackwards />
        </Series.Sequence>
      </Series>
      <VoxHeadline />
      <Audio src={staticFile('voiceover.mp3')} premountFor={fps} />
    </AbsoluteFill>
  );
};
