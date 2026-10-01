import React from 'react';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, Series, staticFile, useVideoConfig} from 'remotion';
import {Headline} from './Headline';
import {SCENE_TIMES, SceneId} from './timeline';
import {E, MONO, SANS, SERIF} from './theme';
import {EdBackwards, EdQuestion, EdReveal, EdStudy} from './scenes/Act1Hook';
import {EdDeficit, EdDopamine, EdFlood, EdGrab, EdHunting, EdMorning, EdRebound, EdWeek} from './scenes/Act2Mechanism';
import {EdAfternoon, EdDraining, EdStimulant, EdTrap} from './scenes/Act3Trap';
import {EdClearDay, EdEvening, EdNoStorage, EdRefill, EdTyrosine} from './scenes/Act4Solution';
import {EdCalm, EdControl, EdControlBack, EdGuarantee, EdIngredients, EdOutro, EdRoutine, EdSteady, EdTeam} from './scenes/Act5Product';

loadFont({family: SERIF, url: staticFile('fonts/dm-serif-display-latin-400-normal.woff2'), weight: '400', style: 'normal'});
loadFont({family: SERIF, url: staticFile('fonts/dm-serif-display-latin-400-italic.woff2'), weight: '400', style: 'italic'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-500-normal.woff2'), weight: '500'});
loadFont({family: SANS, url: staticFile('fonts/inter-latin-700-normal.woff2'), weight: '700'});
loadFont({family: MONO, url: staticFile('fonts/ibm-plex-mono-latin-500-normal.woff2'), weight: '500'});

export const EDITORIAL_SCENES: Record<SceneId, React.FC> = {
  Question: EdQuestion,
  Study: EdStudy,
  Reveal: EdReveal,
  Backwards: EdBackwards,
  Deficit: EdDeficit,
  Dopamine: EdDopamine,
  Hunting: EdHunting,
  Flood: EdFlood,
  Grab: EdGrab,
  Rebound: EdRebound,
  Morning: EdMorning,
  Week: EdWeek,
  Stimulant: EdStimulant,
  Afternoon: EdAfternoon,
  Trap: EdTrap,
  Draining: EdDraining,
  NoStorage: EdNoStorage,
  Tyrosine: EdTyrosine,
  Refill: EdRefill,
  ClearDay: EdClearDay,
  Evening: EdEvening,
  Team: EdTeam,
  Steady: EdSteady,
  Ingredients: EdIngredients,
  Calm: EdCalm,
  Control: EdControl,
  ControlBack: EdControlBack,
  Routine: EdRoutine,
  Guarantee: EdGuarantee,
  Outro: EdOutro,
};

// Video completo, versión editorial (Vox sobrio). Las escenas se generan desde SCENE_TIMES,
// que ancla cada corte a una palabra del voiceover.
export const EditorialExplainer: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: E.paper}}>
      <Series>
        {SCENE_TIMES.map((sc) => {
          const Scene = EDITORIAL_SCENES[sc.id];
          return (
            <Series.Sequence key={sc.id} name={sc.id} durationInFrames={sc.duration} premountFor={fps}>
              <Scene />
            </Series.Sequence>
          );
        })}
      </Series>
      <Headline />
      <Audio src={staticFile('voiceover.mp3')} premountFor={fps} />
    </AbsoluteFill>
  );
};
