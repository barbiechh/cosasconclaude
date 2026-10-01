import React from 'react';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {HOOK} from './cues';
import {S01Question} from './scenes/S01Question';
import {S02Options} from './scenes/S02Options';
import {S03Study} from './scenes/S03Study';
import {S04Reveal} from './scenes/S04Reveal';
import {S05Backwards} from './scenes/S05Backwards';
import {PaperCloseOpen, PaperWipe} from './transitions';
import {FONT, FONT_URL, K} from './theme';

loadFont({family: FONT, url: FONT_URL, weight: '400'});

// Primeros 15,8 s del video en estilo collage editorial.
export const CollageHook: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: K.paper}}>
      <Sequence name="01 Pregunta" from={HOOK.question.from} durationInFrames={HOOK.question.to - HOOK.question.from} premountFor={fps}>
        <S01Question />
      </Sequence>
      <Sequence name="02 Opciones" from={HOOK.options.from} durationInFrames={HOOK.options.to - HOOK.options.from} premountFor={fps}>
        <S02Options />
      </Sequence>
      <Sequence name="03 Estudio" from={HOOK.study.from} durationInFrames={HOOK.study.to - HOOK.study.from} premountFor={fps}>
        <S03Study />
      </Sequence>
      <Sequence name="04 Resultado" from={HOOK.reveal.from} durationInFrames={HOOK.reveal.to - HOOK.reveal.from} premountFor={fps}>
        <S04Reveal />
      </Sequence>
      <Sequence name="05 Al revés" from={HOOK.backwards.from} durationInFrames={HOOK.backwards.to - HOOK.backwards.from} premountFor={fps}>
        <S05Backwards />
      </Sequence>
      {/* Transiciones de papel en los cortes */}
      <Sequence name="Rasgado 1→2" from={HOOK.options.from - 5} durationInFrames={16} premountFor={fps}>
        <PaperCloseOpen close={5} total={16} />
      </Sequence>
      <Sequence name="Barrido 2→3" from={HOOK.study.from - 10} durationInFrames={21} premountFor={fps}>
        <PaperWipe cover={10} total={21} />
      </Sequence>
      <Audio src={staticFile('assets/audio/voiceover.mp3')} premountFor={fps} />
    </AbsoluteFill>
  );
};
