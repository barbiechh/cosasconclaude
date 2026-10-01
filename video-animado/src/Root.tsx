import React from 'react';
import {Composition, Folder} from 'remotion';
import {Explainer} from './Explainer';
import {QuestionScene} from './scenes/QuestionScene';
import {StudyScene} from './scenes/StudyScene';
import {RevealScene} from './scenes/RevealScene';
import {BackwardsScene} from './scenes/BackwardsScene';
import {VoxExplainer} from './vox/VoxExplainer';
import {CollageHook} from './collage/CollageHook';
import {S01Question} from './collage/scenes/S01Question';
import {S02Options} from './collage/scenes/S02Options';
import {S03Study} from './collage/scenes/S03Study';
import {S04Reveal} from './collage/scenes/S04Reveal';
import {S05Backwards} from './collage/scenes/S05Backwards';
import {EditorialExplainer, EDITORIAL_SCENES} from './editorial/EditorialExplainer';
import {SCENE_TIMES, TOTAL_FRAMES} from './editorial/timeline';
import {VoxQuestion} from './vox/scenes/VoxQuestion';
import {VoxStudy} from './vox/scenes/VoxStudy';
import {VoxReveal} from './vox/scenes/VoxReveal';
import {VoxBackwards} from './vox/scenes/VoxBackwards';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Collage-Hook15s" component={CollageHook} width={1080} height={1920} fps={30} durationInFrames={474} />
      <Folder name="Escenas-Collage">
        <Composition id="Collage01-Pregunta" component={S01Question} width={1080} height={1920} fps={30} durationInFrames={73} />
        <Composition id="Collage02-Opciones" component={S02Options} width={1080} height={1920} fps={30} durationInFrames={68} />
        <Composition id="Collage03-Estudio" component={S03Study} width={1080} height={1920} fps={30} durationInFrames={147} />
        <Composition id="Collage04-Resultado" component={S04Reveal} width={1080} height={1920} fps={30} durationInFrames={42} />
        <Composition id="Collage05-AlReves" component={S05Backwards} width={1080} height={1920} fps={30} durationInFrames={144} />
      </Folder>
      <Composition id="CTRL-Editorial" component={EditorialExplainer} width={1080} height={1920} fps={30} durationInFrames={TOTAL_FRAMES} />
      <Folder name="Escenas-Editorial">
        {SCENE_TIMES.map((sc) => (
          <Composition key={sc.id} id={`Ed-${sc.id}`} component={EDITORIAL_SCENES[sc.id]} width={1080} height={1920} fps={30} durationInFrames={sc.duration} />
        ))}
      </Folder>
      <Composition id="Explainer-Preview15s" component={Explainer} width={1080} height={1920} fps={30} durationInFrames={474} />
      <Folder name="Escenas">
        <Composition id="Escena1-Pregunta" component={QuestionScene} width={1080} height={1920} fps={30} durationInFrames={137} />
        <Composition id="Escena2-Estudio" component={StudyScene} width={1080} height={1920} fps={30} durationInFrames={153} />
        <Composition id="Escena3-Revelacion" component={RevealScene} width={1080} height={1920} fps={30} durationInFrames={40} />
        <Composition id="Escena4-AlReves" component={BackwardsScene} width={1080} height={1920} fps={30} durationInFrames={144} />
      </Folder>
      <Composition id="Vox-Preview15s" component={VoxExplainer} width={1080} height={1920} fps={30} durationInFrames={474} />
      <Folder name="Escenas-Vox">
        <Composition id="Vox1-Pregunta" component={VoxQuestion} width={1080} height={1920} fps={30} durationInFrames={137} />
        <Composition id="Vox2-Estudio" component={VoxStudy} width={1080} height={1920} fps={30} durationInFrames={153} />
        <Composition id="Vox3-Revelacion" component={VoxReveal} width={1080} height={1920} fps={30} durationInFrames={40} />
        <Composition id="Vox4-AlReves" component={VoxBackwards} width={1080} height={1920} fps={30} durationInFrames={144} />
      </Folder>
    </>
  );
};
