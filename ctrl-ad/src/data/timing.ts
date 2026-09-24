/**
 * ARCHIVO ÚNICO DE TIEMPOS.
 *
 * Los tiempos de cada palabra salen de `voiceover-words.json`, generado por
 * alineación forzada del MP3 contra el guion (scripts/align_voiceover.py).
 * Los cues se definen por FRASE del guion, no por segundos escritos a mano:
 * si cambia el audio, se vuelve a correr la alineación y todo se reacomoda.
 *
 * Verificación hecha: las pausas detectadas con ffmpeg (silencedetect) caen en
 * la puntuación del guion, y un reconocimiento libre (sin darle el texto)
 * escuchó "woman" 7.40s -> "around" 7.87s, "flickers" 63.38s y "control"
 * (CTRL) 94.39s, igual que la alineación.
 */
import rawWords from './voiceover-words.json';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const secToFrame = (seconds: number) => Math.round(seconds * FPS);

// Medido con ffprobe.
export const AUDIO_SRC = 'audio/voz-elegida.mp3';
export const AUDIO_DURATION_SECONDS = 116.22;

type Section = 'hook' | 'body';
interface VoWord {
  word: string;
  section: Section;
  start: number;
  end: number;
}
const WORDS = rawWords as VoWord[];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');

/**
 * Segundo (absoluto dentro del MP3) en que empieza `phrase` dentro de la
 * sección indicada. `focus` elige qué palabra de la frase marca el cue
 * (0 = la primera). Falla al renderizar si la frase no existe en el guion.
 */
export const phraseAt = (section: Section, phrase: string, focus = 0): number => {
  const target = phrase.split(/\s+/).map(norm);
  const pool = WORDS.filter((w) => w.section === section);
  for (let i = 0; i + target.length <= pool.length; i++) {
    if (target.every((t, k) => norm(pool[i + k].word) === t)) {
      return pool[i + focus].start;
    }
  }
  throw new Error(`Frase no encontrada en el guion (${section}): "${phrase}"`);
};

// ---------------------------------------------------------------------------
// HOOK — módulo sustituible. Sus cues son relativos a su propio inicio.
// Para Hook2: nuevo texto en script/, nuevo audio, re-alinear y cambiar este
// bloque (audioSrc, audioStartSeconds, durationSeconds, cues).
// ---------------------------------------------------------------------------
const HOOK_AUDIO_START = 0;
export const BODY_AUDIO_START_SECONDS = WORDS.find((w) => w.section === 'body')!.start;

const hookCue = (phrase: string, focus = 0) => phraseAt('hook', phrase, focus) - HOOK_AUDIO_START;

export const HOOK = {
  audioSrc: AUDIO_SRC,
  audioStartSeconds: HOOK_AUDIO_START,
  // El hook termina exactamente donde empieza "Around forty".
  durationSeconds: BODY_AUDIO_START_SECONDS - HOOK_AUDIO_START,
  cues: {
    women: hookCue('Women'),
    killerWhales: hookCue('killer whales'),
    perimenopause: hookCue('perimenopause'),
    toAWhale: hookCue('to a whale', 2),
    completeOpposite: hookCue('complete opposite'),
    toAWoman: hookCue('to a woman', 2),
  },
};

// ---------------------------------------------------------------------------
// BODY — empieza en BODY_AUDIO_START_SECONDS del MP3 original.
// ---------------------------------------------------------------------------
const BODY_CUE_PHRASES = {
  aroundForty: ['Around forty'],
  livesToNinety: ['then lives to ninety'],
  thirtyYears: ['for thirty years', 1],
  leaderOfPod: ['she becomes the leader'],
  fishDisappear: ['When the fish disappear'],
  everyWhaleFollows: ['every whale follows her'],
  sheRemembers: ['because she remembers'],
  twentyYearsAgo: ['twenty years ago'],

  obviously: ['Obviously a woman'],
  butIfABrain: ['But if a brain'],
  atItsBest: ['at its best'],
  whyDoSoMany: ['why do so many'],
  worstVersion: ['the worst version'],

  becauseForAWoman: ['Because for a woman'],
  slowFade: ['a slow fade'],
  focusGoes: ['the focus goes', 1],
  wordsGo: ['then the words', 2],
  driveGoes: ['then the drive', 2],
  snaps: ['until she snaps'],
  thisIsJustWho: ['this is just who'],

  nobodyTellsHer: ['Nobody tells her'],
  whatTheHormones: ['what the hormones'],
  herBrain: ['for her brain', 2],
  estrogen: ['Estrogen had a second job'],
  makeDopamine: ['make dopamine', 1],
  behindFocus: ['behind focus'],
  flickers: ['it flickers', 1],
  badSwitch: ['like a light'],
  everyTimeItDips: ['and every time'],
  dopamineDips: ['dopamine dips with it', 1],
  thatsTheFog: ["That's the fog"],

  everyoneLooking: ['because everyone is looking'],
  forFortyYears: ['For forty years'],
  helpedTheBrain: ['it helped the brain', 1],
  focusWord: ['behind focus', 1],
  driveWord: ['drive and follow', 0],
  followThrough: ['follow through'],
  inPerimenopause: ['In perimenopause'],
  justDrop: ['just drop', 1],
  itDips: ['time it dips', 2],
  snapsWord: ['she snaps', 1],
  creepsIn: ['And because it creeps'],
  overAYear: ['over a year or two'],
  sheStarts: ['she starts to believe'],
  firstTheFocus: ['First the focus'],
  usualAnswers: ["It's also why"],
  hrtSorts: ['HRT sorts the sweats'],
  leavesTheFog: ['leaves the fog'],
  stimulants: ['Stimulants like Adderall'],
  canOnlyPush: ['can only push'],
  quietlyStop: ['quietly stop working'],

  pushingHarder: ['So pushing harder'],
  theFixIs: ['The fix is giving'],
  tyrosine: ['called tyrosine', 1],
  b6: ['bit of B6', 2],
  calmingPlants: ['two calming plants'],
  nothingLikeStimulant: ['feels nothing like'],
  ctrl: ['called it CTRL', 2],
  nothingHormonal: ['Nothing hormonal'],

  onceTheBrain: ['And once the brain'],
  fogLifts: ['the fog lifts'],
  driveComesBack: ['The drive comes back'],
  soDoesPatience: ['so does the patience'],
  feelsLikeHerself: ['She feels like herself'],

  natureBuilt: ['Nature built this stage'],
  makeAWoman: ['make a woman', 2],
  everybodyFollows: ['everybody follows'],
  ctrlJustGives: ['CTRL just gives'],
  guarantee: ['thirty day guarantee'],
  yourSign: ["that's your sign"],
} as const satisfies Record<string, readonly [string] | readonly [string, number]>;

export type BodyCueKey = keyof typeof BODY_CUE_PHRASES;

/** Segundos absolutos (dentro del MP3) de cada cue del body. */
export const BODY_CUES = Object.fromEntries(
  Object.entries(BODY_CUE_PHRASES).map(([k, [phrase, focus]]) => [
    k,
    phraseAt('body', phrase, focus ?? 0),
  ])
) as Record<BodyCueKey, number>;

// ---------------------------------------------------------------------------
// LÍNEA DE TIEMPO DEL VIDEO
// ---------------------------------------------------------------------------
export const HOOK_FRAMES = secToFrame(HOOK.durationSeconds);
export const BODY_AUDIO_START_FRAME = secToFrame(BODY_AUDIO_START_SECONDS);
export const BODY_FRAMES = secToFrame(AUDIO_DURATION_SECONDS - BODY_AUDIO_START_SECONDS);
export const END_CARD_HOLD_SECONDS = 2.5;
export const TOTAL_FRAMES = HOOK_FRAMES + BODY_FRAMES + secToFrame(END_CARD_HOLD_SECONDS);

/** Frame de un cue del body, relativo al inicio del componente <Body>. */
export const bodyCueFrame = (key: BodyCueKey, offsetFrames = 0): number =>
  secToFrame(BODY_CUES[key] - BODY_AUDIO_START_SECONDS) + offsetFrames;

/** Frame de un cue del hook, relativo al inicio del componente <Hook1>. */
export const hookCueFrame = (key: keyof typeof HOOK.cues, offsetFrames = 0): number =>
  secToFrame(HOOK.cues[key]) + offsetFrames;
