import React from 'react';
import {Composition, Folder} from 'remotion';
import {Explainer} from './Explainer';
import {QuestionScene} from './scenes/QuestionScene';
import {StudyScene} from './scenes/StudyScene';
import {RevealScene} from './scenes/RevealScene';
import {BackwardsScene} from './scenes/BackwardsScene';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Explainer-Preview15s" component={Explainer} width={1080} height={1920} fps={30} durationInFrames={474} />
      <Folder name="Escenas">
        <Composition id="Escena1-Pregunta" component={QuestionScene} width={1080} height={1920} fps={30} durationInFrames={137} />
        <Composition id="Escena2-Estudio" component={StudyScene} width={1080} height={1920} fps={30} durationInFrames={153} />
        <Composition id="Escena3-Revelacion" component={RevealScene} width={1080} height={1920} fps={30} durationInFrames={40} />
        <Composition id="Escena4-AlReves" component={BackwardsScene} width={1080} height={1920} fps={30} durationInFrames={144} />
      </Folder>
    </>
  );
};
