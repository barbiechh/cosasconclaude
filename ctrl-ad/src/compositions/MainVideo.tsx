import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Hook3} from '../components/Hook3';
import {Body} from '../components/Body';
import {EndCard} from '../components/EndCard';
import {PaperBackground} from '../components/PaperBackground';
import {SceneShell} from '../components/SceneShell';
import {Captions} from '../components/Captions';
import {SoundDesign} from '../components/SoundDesign';
import {
  AUDIO_SRC,
  BODY_AUDIO_START_FRAME,
  BODY_FRAMES,
  HOOK,
  HOOK_FRAMES,
  TOTAL_FRAMES,
  bodyCueFrame,
  secToFrame,
} from '../data/timing';
import {END_CARD_CUE, END_CARD_ENTER, OVERLAP} from '../data/scenes';

export type MainVideoProps = {
  usePlaceholder: boolean;
};

/**
 * Papel único de fondo + Hook (0 .. HOOK_FRAMES) + Body + EndCard + captions.
 *
 * El audio del hook y el del body son pistas separadas: el hook toca su propio
 * tramo (HOOK.audioSrc) y el body siempre toca el MP3 original desde
 * BODY_AUDIO_START. Para otro hook se cambia <Hook3> por <Hook1>/<Hook2> y HOOK
 * de timing.ts; el body queda igual y solo se desplaza en la línea de tiempo.
 */
export const MainVideo: React.FC<MainVideoProps> = ({usePlaceholder}) => {
  const hookAudioStart = secToFrame(HOOK.audioStartSeconds);
  const hookFrames = HOOK.exitToBody === 'push' ? HOOK_FRAMES + OVERLAP : HOOK_FRAMES;
  const endCardFrom = HOOK_FRAMES + bodyCueFrame(END_CARD_CUE);
  const endCardFrames = TOTAL_FRAMES - endCardFrom;

  return (
    <AbsoluteFill>
      <PaperBackground />

      <Sequence from={0} durationInFrames={HOOK_FRAMES} name="Hook audio">
        <Audio src={staticFile(HOOK.audioSrc)} startFrom={hookAudioStart} endAt={hookAudioStart + HOOK_FRAMES} />
      </Sequence>
      <Sequence from={HOOK_FRAMES} durationInFrames={BODY_FRAMES} name="Body audio">
        <Audio src={staticFile(AUDIO_SRC)} startFrom={BODY_AUDIO_START_FRAME} />
      </Sequence>

      {/* Con corte a juego, el hook termina justo donde empieza el body (sin solape). */}
      <Sequence from={0} durationInFrames={hookFrames} name="Hook3">
        <SceneShell durationInFrames={hookFrames} enter="none" exit={HOOK.exitToBody === 'push' ? 'push' : 'none'} drift={0}>
          <Hook3 usePlaceholder={usePlaceholder} />
        </SceneShell>
      </Sequence>
      <Sequence from={HOOK_FRAMES} durationInFrames={BODY_FRAMES} name="Body">
        <Body usePlaceholder={usePlaceholder} />
      </Sequence>
      <Sequence from={endCardFrom} durationInFrames={endCardFrames} name="EndCard">
        <SceneShell durationInFrames={endCardFrames} enter={END_CARD_ENTER} exit="none" drift={0.03}>
          <EndCard usePlaceholder={usePlaceholder} />
        </SceneShell>
      </Sequence>

      <SoundDesign />
      <Captions />
    </AbsoluteFill>
  );
};
