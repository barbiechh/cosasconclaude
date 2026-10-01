import {useCurrentFrame, useVideoConfig} from 'remotion';
import {WORDS_FULL} from '../data/transcriptFull';

// Frame absoluto de la palabra i del voiceover (timestamps reales).
export const wf = (i: number) => Math.round(WORDS_FULL[i].start * 30);

// Escenas de los primeros 15 s (frames absolutos). Cortes en pausas reales del audio.
export const HOOK = {
  question: {from: 0, to: 73},
  options: {from: 73, to: 141},
  study: {from: 141, to: 288},
  reveal: {from: 288, to: 330},
  backwards: {from: 330, to: 474},
} as const;

// Dentro de una escena: frame local y cue local de la palabra i.
export const useCues = (from: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {f, fps, c: (i: number) => wf(i) - from};
};
