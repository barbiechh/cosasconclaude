import React from 'react';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, Series, staticFile, useVideoConfig} from 'remotion';
import {Captions} from './components/Captions';
import {C} from './components/palette';
import {SCENES, PREVIEW_DURATION, FPS} from './data/timeline';
import {QuestionScene} from './scenes/QuestionScene';
import {StudyScene} from './scenes/StudyScene';
import {RevealScene} from './scenes/RevealScene';
import {BackwardsScene} from './scenes/BackwardsScene';

loadFont({family: 'Montserrat', url: staticFile('fonts/montserrat-latin-900-normal.woff2'), weight: '900'});

// Vista previa: primeros ~15 s del voiceover (corta en la pausa de 15.8 s).
export const Explainer: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Series>
        <Series.Sequence name="Pregunta" durationInFrames={SCENES.question.duration} premountFor={fps}>
          <QuestionScene />
        </Series.Sequence>
        <Series.Sequence name="Estudio" durationInFrames={SCENES.study.duration} premountFor={fps}>
          <StudyScene />
        </Series.Sequence>
        <Series.Sequence name="Revelación" durationInFrames={SCENES.reveal.duration} premountFor={fps}>
          <RevealScene />
        </Series.Sequence>
        <Series.Sequence name="Al revés" durationInFrames={SCENES.backwards.duration} premountFor={fps}>
          <BackwardsScene />
        </Series.Sequence>
      </Series>
      <Captions until={PREVIEW_DURATION / FPS} />
      <Audio src={staticFile('voiceover.mp3')} premountFor={fps} />
    </AbsoluteFill>
  );
};
