import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Hook1} from '../components/Hook1';
import {Body} from '../components/Body';
import {EndCard} from '../components/EndCard';
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

export type MainVideoProps = {
  usePlaceholder: boolean;
};

/**
 * Hook (0 .. HOOK_FRAMES) + Body (desde HOOK_FRAMES) + EndCard.
 *
 * El audio del hook y el del body son pistas separadas: el hook toca su propio
 * tramo (HOOK.audioSrc) y el body siempre toca el MP3 original desde
 * BODY_AUDIO_START. Para Hook2 se cambia <Hook1> por <Hook2> y el bloque HOOK
 * de timing.ts; el body queda igual y solo se desplaza en la línea de tiempo.
 */
export const MainVideo: React.FC<MainVideoProps> = ({usePlaceholder}) => {
  const hookAudioStart = secToFrame(HOOK.audioStartSeconds);
  const endCardFrom = HOOK_FRAMES + bodyCueFrame('ctrlJustGives');

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={HOOK_FRAMES} name="Hook audio">
        <Audio src={staticFile(HOOK.audioSrc)} startFrom={hookAudioStart} endAt={hookAudioStart + HOOK_FRAMES} />
      </Sequence>
      <Sequence from={HOOK_FRAMES} durationInFrames={BODY_FRAMES} name="Body audio">
        <Audio src={staticFile(AUDIO_SRC)} startFrom={BODY_AUDIO_START_FRAME} />
      </Sequence>

      <Sequence from={0} durationInFrames={HOOK_FRAMES} name="Hook1">
        <Hook1 usePlaceholder={usePlaceholder} />
      </Sequence>
      <Sequence from={HOOK_FRAMES} durationInFrames={BODY_FRAMES} name="Body">
        <Body usePlaceholder={usePlaceholder} />
      </Sequence>
      <Sequence from={endCardFrom} durationInFrames={TOTAL_FRAMES - endCardFrom} name="EndCard">
        <EndCard
          usePlaceholder={usePlaceholder}
          guaranteeAtFrame={bodyCueFrame('guarantee') - bodyCueFrame('ctrlJustGives')}
          yourSignAtFrame={bodyCueFrame('yourSign') - bodyCueFrame('ctrlJustGives')}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
