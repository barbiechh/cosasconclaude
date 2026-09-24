import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Hook1} from '../components/Hook1';
import {Body} from '../components/Body';
import {EndCard} from '../components/EndCard';
import {
  AUDIO_SRC,
  HOOK_BODY_CUT_FRAME,
  TOTAL_FRAMES,
  bodyCueFrame,
  secToFrame,
  END_CARD_HOLD_SECONDS,
} from '../data/timing';

export interface MainVideoProps {
  usePlaceholder: boolean;
}

/**
 * Ensambla Hook1 + Body + EndCard + audio, todo posicionado desde
 * src/data/timing.ts. Para reemplazar el hook por Hook2 en el futuro:
 *   1. Crear src/components/Hook2.tsx (con sus propios HOOK2_CUES si hace falta).
 *   2. Cambiar el <Hook1 .../> de abajo por <Hook2 .../>.
 *   3. Cambiar HOOK_AUDIO_SRC por el nuevo archivo de audio del hook.
 * El <Body> y su audio (que arrancan en HOOK_BODY_CUT_FRAME leyendo el MISMO
 * archivo original vía startFrom) no se tocan.
 */
const HOOK_AUDIO_SRC = AUDIO_SRC; // hoy Hook1 y Body comparten el mismo MP3.

export const MainVideo: React.FC<MainVideoProps> = ({usePlaceholder}) => {
  // bodyCueFrame() da un frame RELATIVO al inicio del Body; para usarlo como
  // `from` de una Sequence a nivel raíz hay que sumarle HOOK_BODY_CUT_FRAME.
  const endCardStart = HOOK_BODY_CUT_FRAME + bodyCueFrame('ctrlGivesBrainWhatItNeeds');
  const endCardDuration = TOTAL_FRAMES - endCardStart + secToFrame(END_CARD_HOLD_SECONDS);

  return (
    <AbsoluteFill style={{backgroundColor: '#f4f1e9'}}>
      {/* --- AUDIO --- */}
      <Sequence from={0} durationInFrames={HOOK_BODY_CUT_FRAME} name="Hook audio">
        <Audio src={staticFile(HOOK_AUDIO_SRC)} endAt={HOOK_BODY_CUT_FRAME} />
      </Sequence>
      <Sequence
        from={HOOK_BODY_CUT_FRAME}
        durationInFrames={TOTAL_FRAMES - HOOK_BODY_CUT_FRAME}
        name="Body audio"
      >
        <Audio src={staticFile(AUDIO_SRC)} startFrom={HOOK_BODY_CUT_FRAME} />
      </Sequence>

      {/* --- VISUAL --- */}
      <Sequence from={0} durationInFrames={HOOK_BODY_CUT_FRAME} name="Hook1">
        <Hook1 usePlaceholder={usePlaceholder} />
      </Sequence>

      <Sequence
        from={HOOK_BODY_CUT_FRAME}
        durationInFrames={TOTAL_FRAMES - HOOK_BODY_CUT_FRAME}
        name="Body"
      >
        <Body usePlaceholder={usePlaceholder} />
      </Sequence>

      <Sequence from={endCardStart} durationInFrames={endCardDuration} name="EndCard">
        <EndCard usePlaceholder={usePlaceholder} />
      </Sequence>
    </AbsoluteFill>
  );
};
