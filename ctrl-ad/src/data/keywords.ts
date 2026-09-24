/**
 * Palabras clave de arriba, como datos. Body las pinta dentro de su escena y
 * Captions las consulta para no repetir abajo lo que ya dice arriba.
 * `from`/`to` son cues del guion ([cue, desfase en frames]); sin `to`, la
 * palabra se queda hasta que termina su escena.
 */
import {BodyCueKey, HOOK_FRAMES, bodyCueFrame, hookCueFrame} from './timing';

type Cue = [BodyCueKey] | [BodyCueKey, number];

export type BodyKeyword = {
  text: string;
  /** fragmento resaltado en amarillo ('' = ninguno; por defecto, todo) */
  hi?: string;
  from: Cue;
  to?: Cue;
  size?: number;
  top?: number;
  width?: number;
  /** número que corre (p. ej. LIVES TO 40 -> 90) */
  counter?: {prefix: string; from: number; to: number};
};

export const BODY_KEYWORDS: BodyKeyword[] = [
  // 1. Orcas
  {text: 'AROUND 40', hi: '40', from: ['aroundForty'], to: ['livesToNinety']},
  {text: 'LIVES TO 90', from: ['livesToNinety'], to: ['thirtyYears'], counter: {prefix: 'LIVES TO ', from: 40, to: 90}},
  {text: '30 YEARS', from: ['thirtyYears'], to: ['leaderOfPod']},
  {text: 'THE LEADER', hi: 'LEADER', from: ['leaderOfPod'], to: ['fishDisappear']},
  {text: 'THE FISH DISAPPEAR', hi: 'DISAPPEAR', from: ['fishDisappear'], to: ['everyWhaleFollows'], size: 70},
  {text: 'FOLLOWS HER', hi: 'HER', from: ['everyWhaleFollows'], to: ['sheRemembers']},
  {text: 'SHE REMEMBERS', hi: 'REMEMBERS', from: ['sheRemembers'], to: ['twentyYearsAgo']},
  {text: '20 YEARS AGO', from: ['twentyYearsAgo']},
  // 2. Puente
  {text: 'WOMAN ≠ WHALE', hi: '≠', from: ['obviously'], to: ['butIfABrain']},
  {text: 'AT ITS BEST', hi: 'BEST', from: ['atItsBest'], to: ['worstVersion']},
  {text: 'THE WORST VERSION?', hi: 'WORST', from: ['worstVersion'], size: 70},
  // 3. Slow fade
  {text: 'A SLOW FADE', hi: 'FADE', from: ['slowFade'], to: ['firstTheFocus']},
  {text: 'FOCUS', from: ['focusGoes'], to: ['wordsGo'], size: 96},
  {text: 'WORDS', from: ['wordsGo'], to: ['driveGoes'], size: 96},
  {text: 'DRIVE', from: ['driveGoes'], to: ['snaps'], size: 96},
  {text: 'SHE SNAPS', hi: 'SNAPS', from: ['snaps'], to: ['creepsIn']},
  {text: 'IT CREEPS IN', hi: 'CREEPS', from: ['creepsIn'], to: ['overAYear']},
  {text: 'A YEAR OR TWO', from: ['overAYear'], to: ['sheStarts']},
  {text: 'SHE STARTS TO BELIEVE', hi: 'BELIEVE', from: ['sheStarts'], to: ['thisIsJustWho'], size: 66},
  {text: '“JUST WHO SHE IS NOW”', hi: 'NOW', from: ['thisIsJustWho'], size: 64},
  // 4. Estrógeno y dopamina
  {text: 'NOBODY TELLS HER', hi: 'NOBODY', from: ['nobodyTellsHer'], to: ['everyoneLooking']},
  {text: 'THE HORMONES', hi: 'HORMONES', from: ['everyoneLooking'], to: ['whatTheHormones']},
  {text: 'HER BRAIN', hi: 'BRAIN', from: ['whatTheHormones'], to: ['estrogen']},
  {text: 'ESTROGEN', from: ['estrogen'], to: ['forFortyYears']},
  {text: '40 YEARS', from: ['forFortyYears'], to: ['makeDopamine']},
  {text: 'DOPAMINE', from: ['makeDopamine'], to: ['focusWord'], size: 90},
  {text: 'FOCUS · DRIVE · FOLLOW-THROUGH', hi: 'FOCUS', from: ['focusWord'], to: ['inPerimenopause'], size: 48, width: 1000},
  {text: "IT DOESN'T JUST DROP", hi: 'DROP', from: ['inPerimenopause'], to: ['flickers'], size: 70},
  {text: 'IT FLICKERS', hi: 'FLICKERS', from: ['flickers'], to: ['everyTimeItDips']},
  {text: 'EVERY TIME IT DIPS', hi: 'DIPS', from: ['everyTimeItDips'], to: ['dopamineDips'], size: 70},
  {text: 'DOPAMINE DIPS', hi: 'DIPS', from: ['dopamineDips'], to: ['thatsTheFog']},
  {text: 'THE FOG', hi: 'FOG', from: ['thatsTheFog'], size: 96},
  // 5. HRT / estimulantes
  {text: 'THE USUAL ANSWERS', hi: 'USUAL', from: ['usualAnswers'], to: ['hrtSorts'], size: 70},
  {text: 'HRT', from: ['hrtSorts'], to: ['stimulants'], size: 96},
  {text: 'STIMULANTS', from: ['stimulants'], to: ['quietlyStop']},
  {text: 'THEY STOP WORKING', hi: 'STOP', from: ['quietlyStop'], size: 70},
  // 6. El fix -> CTRL
  {text: 'NEVER THE FIX', hi: 'NEVER', from: ['pushingHarder'], to: ['theFixIs']},
  {text: 'THE FIX', hi: 'FIX', from: ['theFixIs'], to: ['nothingLikeStimulant'], size: 90},
  {text: 'NOTHING LIKE A STIMULANT', hi: 'NOTHING', from: ['nothingLikeStimulant'], to: ['ctrl'], size: 60},
  {text: 'CTRL', hi: '', from: ['ctrl'], size: 110, top: 280},
  {text: 'NOTHING HORMONAL', hi: 'NOTHING', from: ['nothingHormonal'], size: 62, top: 1190},
  // 7. Recuperación
  {text: 'DOPAMINE AGAIN', hi: 'AGAIN', from: ['onceTheBrain'], to: ['fogLifts']},
  {text: 'THE FOG LIFTS', hi: 'LIFTS', from: ['fogLifts'], to: ['driveComesBack']},
  {text: 'DRIVE', from: ['driveComesBack'], to: ['soDoesPatience'], size: 96},
  {text: 'PATIENCE', from: ['soDoesPatience'], to: ['feelsLikeHerself'], size: 96},
  {text: 'HERSELF AGAIN', hi: 'HERSELF', from: ['feelsLikeHerself']},
  // 8. Cierre
  {text: 'NATURE BUILT THIS', hi: 'NATURE', from: ['natureBuilt'], to: ['everybodyFollows'], size: 70},
  {text: 'EVERYBODY FOLLOWS', hi: 'FOLLOWS', from: ['everybodyFollows'], size: 70},
];

/** Frame (relativo al <Body>) de un cue. */
export const cueFrame = ([key, offset = 0]: Cue) => bodyCueFrame(key, offset);

/** Textos de arriba fuera del Body (hook y EndCard), en frames de la línea de tiempo. */
export const HOOK_TEXT_WINDOWS: {text: string; from: number; to: number}[] = [
  {text: 'PERIMENOPAUSE', from: hookCueFrame('perimenopause'), to: HOOK_FRAMES},
  {text: 'COMPLETE OPPOSITE', from: hookCueFrame('completeOpposite'), to: HOOK_FRAMES},
];

export const END_CARD_TEXTS = {
  guarantee: '30-DAY GUARANTEE',
  sign: "that's your sign.",
};
