import {WORDS_FULL} from '../data/transcriptFull';

export const FPS = 30;
export const TOTAL_FRAMES = Math.ceil(191.75 * FPS);

// Frame absoluto en que empieza la palabra i del voiceover.
export const wf = (i: number) => Math.round(WORDS_FULL[i].start * FPS);

// Cada escena arranca en una palabra del guion (índice en WORDS_FULL).
// `kicker` = etiqueta de capítulo; `dark` = papel nocturno.
export const SCENE_LIST = [
  {id: 'Question', word: 0, kicker: 'The question', dark: false},
  {id: 'Study', word: 10, kicker: 'The study', dark: false},
  {id: 'Reveal', word: 23, kicker: 'The result', dark: false},
  {id: 'Backwards', word: 26, kicker: 'The paradox', dark: false},
  {id: 'Deficit', word: 38, kicker: 'The ADHD brain', dark: false},
  {id: 'Dopamine', word: 60, kicker: 'Dopamine', dark: false},
  {id: 'Hunting', word: 79, kicker: 'Refilling the tank', dark: false},
  {id: 'Flood', word: 102, kicker: 'The first drink', dark: true},
  {id: 'Grab', word: 126, kicker: 'Self-medicating', dark: true},
  {id: 'Rebound', word: 147, kicker: 'The rebound', dark: true},
  {id: 'Morning', word: 173, kicker: 'The morning after', dark: false},
  {id: 'Week', word: 198, kicker: 'The cost', dark: false},
  {id: 'Stimulant', word: 224, kicker: 'The prescription', dark: false},
  {id: 'Afternoon', word: 249, kicker: 'The comedown', dark: false},
  {id: 'Trap', word: 271, kicker: 'The trap', dark: false},
  {id: 'Draining', word: 290, kicker: 'The trap', dark: false},
  {id: 'NoStorage', word: 312, kicker: 'The real problem', dark: false},
  {id: 'Tyrosine', word: 334, kicker: 'Tyrosine', dark: false},
  {id: 'Refill', word: 361, kicker: 'A full tank', dark: false},
  {id: 'ClearDay', word: 387, kicker: 'A different day', dark: false},
  {id: 'Evening', word: 405, kicker: 'A different evening', dark: false},
  {id: 'Team', word: 419, kicker: 'The formula', dark: false},
  {id: 'Steady', word: 446, kicker: 'The formula', dark: false},
  {id: 'Ingredients', word: 469, kicker: 'Ingredients', dark: false},
  {id: 'Calm', word: 492, kicker: 'Ingredients', dark: false},
  {id: 'Control', word: 503, kicker: 'CTRL.', dark: true},
  {id: 'ControlBack', word: 517, kicker: 'CTRL.', dark: true},
  {id: 'Routine', word: 536, kicker: 'How to take it', dark: false},
  {id: 'Guarantee', word: 544, kicker: '30-day guarantee', dark: false},
  {id: 'Outro', word: 565, kicker: 'CTRL.', dark: true},
] as const;

export type SceneId = (typeof SCENE_LIST)[number]['id'];

// Las escenas empiezan 4 frames antes de su primera palabra (la primera, en 0).
export const SCENE_TIMES = SCENE_LIST.map((s, i) => {
  const from = i === 0 ? 0 : wf(s.word) - 4;
  const next = i === SCENE_LIST.length - 1 ? TOTAL_FRAMES : wf(SCENE_LIST[i + 1].word) - 4;
  return {...s, from, duration: next - from};
});

export const sceneOf = (id: SceneId) => SCENE_TIMES.find((s) => s.id === id)!;

// Frame local (dentro de la escena) de la palabra i.
export const at = (id: SceneId, i: number) => wf(i) - sceneOf(id).from;
