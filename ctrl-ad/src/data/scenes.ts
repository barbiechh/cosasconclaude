import {BodyCueKey, HOOK_FRAMES, bodyCueFrame} from './timing';

/** Frames que dura cada transición: la escena saliente y la entrante se solapan. */
export const OVERLAP = 10;

/** push = barrido lateral (el papel se desplaza con el contenido); zoom = entra desde el fondo. */
export type TransitionKind = 'push' | 'zoom';

export type SceneId = 'orcas' | 'bridge' | 'fade' | 'brain' | 'answers' | 'fix' | 'recovery' | 'closing';

const PLAN: {id: SceneId; from: BodyCueKey; enter: TransitionKind}[] = [
  {id: 'orcas', from: 'aroundForty', enter: 'push'},
  {id: 'bridge', from: 'obviously', enter: 'push'},
  {id: 'fade', from: 'becauseForAWoman', enter: 'push'},
  {id: 'brain', from: 'nobodyTellsHer', enter: 'zoom'},
  {id: 'answers', from: 'usualAnswers', enter: 'push'},
  {id: 'fix', from: 'pushingHarder', enter: 'push'},
  {id: 'recovery', from: 'onceTheBrain', enter: 'zoom'},
  {id: 'closing', from: 'natureBuilt', enter: 'push'},
];

export const END_CARD_CUE: BodyCueKey = 'ctrlJustGives';
export const END_CARD_ENTER: TransitionKind = 'push';

export type ScenePlan = {
  id: SceneId;
  /** frame de inicio, relativo al <Body> */
  from: number;
  /** duración incluida la salida solapada con la siguiente */
  durationInFrames: number;
  enter: TransitionKind;
  exit: TransitionKind;
  /** frame local de un cue dentro de la escena */
  at: (key: BodyCueKey, offset?: number) => number;
};

export const SCENES: Record<SceneId, ScenePlan> = Object.fromEntries(
  PLAN.map((s, i) => {
    const from = bodyCueFrame(s.from);
    const next = PLAN[i + 1];
    const to = next ? bodyCueFrame(next.from) : bodyCueFrame(END_CARD_CUE);
    const plan: ScenePlan = {
      id: s.id,
      from,
      durationInFrames: to - from + OVERLAP,
      enter: s.enter,
      exit: next ? next.enter : END_CARD_ENTER,
      at: (key, offset = 0) => bodyCueFrame(key) - from + offset,
    };
    return [s.id, plan];
  })
) as Record<SceneId, ScenePlan>;

/** Frames (en la línea de tiempo completa) donde empieza un barrido lateral. */
export const PUSH_FRAMES: number[] = [
  HOOK_FRAMES, // hook -> orcas
  ...PLAN.slice(1).filter((s) => s.enter === 'push').map((s) => HOOK_FRAMES + bodyCueFrame(s.from)),
  ...(END_CARD_ENTER === 'push' ? [HOOK_FRAMES + bodyCueFrame(END_CARD_CUE)] : []),
];
