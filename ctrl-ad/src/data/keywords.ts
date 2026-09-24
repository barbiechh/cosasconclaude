/**
 * Palabras clave de arriba, como datos. Solo palabras grandes, una a la vez.
 * Body las pinta dentro de su escena y Captions las consulta para no repetir
 * abajo lo que ya dice arriba. `from`/`to` son cues del guion ([cue, desfase
 * en frames]); sin `to`, la palabra se queda hasta que termina su escena.
 */
import {BodyCueKey, HOOK_FRAMES, bodyCueFrame, hookCueFrame} from './timing';
import {TYPE} from '../styles/tokens';

type Cue = [BodyCueKey] | [BodyCueKey, number];

export type BodyKeyword = {
  text: string;
  /** fragmento resaltado en amarillo ('' = ninguno; por defecto, todo) */
  hi?: string;
  from: Cue;
  to?: Cue;
  size?: number;
  top?: number;
  /** número que corre (p. ej. LIVES TO 40 -> 90) */
  counter?: {prefix?: string; suffix?: string; from: number; to: number; until: Cue};
};

const L = TYPE.long;
const H = TYPE.hero;

export const BODY_KEYWORDS: BodyKeyword[] = [
  // Orcas
  {text: 'AROUND 40', hi: '40', from: ['aroundForty'], to: ['livesToNinety']},
  {text: 'LIVES TO 90', hi: '90', from: ['livesToNinety'], to: ['nobodyCould'], counter: {prefix: 'LIVES TO ', from: 40, to: 90, until: ['ninety', 6]}},
  {text: 'WHY?', from: ['nobodyCould'], to: ['scientists'], size: H},
  {text: '30 YEARS', hi: '30', from: ['scientists'], to: ['afterMenopause'], counter: {suffix: ' YEARS', from: 1, to: 30, until: ['thirtyYears', 6]}},
  {text: 'AFTER MENOPAUSE', hi: 'MENOPAUSE', from: ['afterMenopause'], to: ['leaderWord'], size: L},
  {text: 'THE LEADER', hi: 'LEADER', from: ['leaderWord'], to: ['fishWord']},
  {text: 'THE FISH DISAPPEAR', hi: 'DISAPPEAR', from: ['fishWord'], to: ['everyWhaleFollows'], size: L},
  {text: 'FOLLOWS HER', hi: 'HER', from: ['everyWhaleFollows'], to: ['sheRemembers']},
  {text: 'SHE REMEMBERS', hi: 'REMEMBERS', from: ['sheRemembers'], to: ['twentyYearsAgo']},
  {text: '20 YEARS AGO', hi: '20', from: ['twentyYearsAgo']},
  // Puente
  {text: 'AT ITS BEST', hi: 'BEST', from: ['atItsBest'], to: ['whyDoSoMany']},
  {text: 'THE WORST VERSION', hi: 'WORST', from: ['worstVersion'], size: L},
  // Slow fade
  {text: 'A SLOW FADE', hi: 'FADE', from: ['slowFade'], to: ['firstTheFocus']},
  {text: 'FOCUS', from: ['focusGoes'], to: ['wordsGo', -8], size: H},
  {text: 'DRIVE', from: ['driveGoes'], size: H},
  // Familia e identidad
  {text: 'SHE SNAPS', hi: 'SNAPS', from: ['snapsWord'], to: ['creepsIn']},
  {text: 'A YEAR OR TWO', hi: 'YEAR OR TWO', from: ['overAYear'], to: ['sheStarts']},
  {text: '“JUST WHO SHE IS NOW”', hi: 'NOW', from: ['thisIsJustWho'], size: L},
  // Estrógeno y dopamina
  {text: 'NOBODY TELLS HER', hi: 'NOBODY', from: ['nobodyTellsHer'], to: ['everyoneLooking'], size: L},
  {text: 'HER BRAIN', hi: 'BRAIN', from: ['herBrain'], to: ['estrogen']},
  {text: 'A SECOND JOB', hi: 'SECOND', from: ['secondJob'], to: ['forFortyYears']},
  {text: '40 YEARS', hi: '40', from: ['forFortyYears'], to: ['makeDopamine']},
  {text: 'DOPAMINE', from: ['makeDopamine'], to: ['focusWord'], size: H},
  {text: 'FOCUS', from: ['focusWord'], to: ['driveWord'], size: H},
  {text: 'DRIVE', from: ['driveWord'], to: ['followThrough'], size: H},
  {text: 'FOLLOW-THROUGH', from: ['followThrough'], size: L},
  // El interruptor
  {text: "IT DOESN'T JUST DROP", hi: 'DROP', from: ['inPerimenopause'], to: ['flickers'], size: L},
  {text: 'IT FLICKERS', hi: 'FLICKERS', from: ['flickers'], to: ['everyTimeItDips']},
  {text: 'DOPAMINE DIPS', hi: 'DIPS', from: ['dopamineDips'], to: ['thatsTheFog']},
  {text: 'THE FOG', hi: 'FOG', from: ['thatsTheFog'], size: H},
  // Las respuestas de siempre
  {text: 'THE USUAL ANSWERS', hi: 'USUAL', from: ['usualAnswers'], to: ['hrtSorts'], size: L},
  {text: 'HRT', from: ['hrtSorts'], to: ['leavesTheFog'], size: H},
  {text: 'LEAVES THE FOG', hi: 'FOG', from: ['leavesTheFog'], to: ['stimulants']},
  {text: 'STIMULANTS', from: ['stimulants'], to: ['quietlyStop']},
  {text: 'THEY STOP WORKING', hi: 'STOP', from: ['quietlyStop'], size: L},
  // El fix -> CTRL
  {text: 'NEVER THE FIX', hi: 'NEVER', from: ['neverTheFix'], to: ['theFixIs']},
  {text: 'THE FIX', hi: 'FIX', from: ['theFixIs'], to: ['tyrosine'], size: H},
  {text: 'TYROSINE', from: ['tyrosine'], to: ['b6']},
  {text: 'B6', from: ['b6'], to: ['calmingPlants'], size: H},
  {text: 'CALMING PLANTS', hi: 'CALMING', from: ['calmingPlants'], to: ['nothingLikeStimulant']},
  {text: 'NOTHING LIKE A STIMULANT', hi: 'NOTHING', from: ['nothingLikeStimulant'], to: ['calledIt'], size: 60},
  {text: 'NOTHING HORMONAL', hi: 'NOTHING', from: ['nothingHormonal'], size: L},
  // Recuperación
  {text: 'DOPAMINE AGAIN', hi: 'AGAIN', from: ['buildingAgain'], to: ['fogLifts']},
  {text: 'THE FOG LIFTS', hi: 'LIFTS', from: ['fogLifts'], to: ['driveComesBack']},
  {text: 'DRIVE', from: ['driveBack'], to: ['soDoesPatience'], size: H},
  {text: 'PATIENCE', from: ['patienceWord'], to: ['feelsLikeHerself'], size: H},
  {text: 'HERSELF AGAIN', hi: 'HERSELF', from: ['herselfWord']},
  // Cierre
  {text: 'NATURE BUILT THIS', hi: 'NATURE', from: ['natureBuilt'], to: ['makeAWoman'], size: L},
  {text: 'EVERYBODY FOLLOWS', hi: 'FOLLOWS', from: ['everybodyFollows'], size: L},
];

/** Frame (relativo al <Body>) de un cue. */
export const cueFrame = ([key, offset = 0]: Cue) => bodyCueFrame(key, offset);

/** Textos de arriba fuera del Body (hook y EndCard), en frames de la línea de tiempo. */
export const HOOK_TEXT_WINDOWS: {text: string; from: number; to: number}[] = [
  {text: 'PERIMENOPAUSE', from: hookCueFrame('perimenopause'), to: hookCueFrame('but')},
  {text: 'COMPLETE OPPOSITE', from: hookCueFrame('completeOpposite'), to: HOOK_FRAMES},
];

export const END_CARD_TEXTS = {
  guarantee: '30-DAY GUARANTEE',
  stock: 'IN STOCK',
  tap: 'TAP BELOW',
  sign: "that's your sign.",
};
