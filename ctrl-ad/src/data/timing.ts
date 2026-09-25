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

// Voz final: la original (voz-elegida.mp3) con el tramo "Nature built this
// stage ... get back there." reemplazado por una toma nueva
// (scripts/splice_voiceover.py + scripts/splice_words.py). Medido con ffprobe.
export const AUDIO_SRC = 'audio/voz-final.wav';
export const AUDIO_DURATION_SECONDS = 116.84;

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
    only: hookCue('the only animals', 1),
    earth: hookCue('on Earth', 1),
    but: hookCue('But what it does'),
    perimenopause: hookCue('perimenopause'),
    toAWhale: hookCue('to a whale', 2),
    completeOpposite: hookCue('complete opposite'),
    opposite: hookCue('complete opposite', 1),
    toAWoman: hookCue('to a woman', 2),
  },
};

// ---------------------------------------------------------------------------
// BODY — empieza en BODY_AUDIO_START_SECONDS del MP3 original.
// ---------------------------------------------------------------------------
const BODY_CUE_PHRASES = {
  // Orcas
  aroundForty: ['Around forty'],
  forty: ['Around forty', 1],
  stopsHaving: ['stops having babies'],
  babies: ['stops having babies', 2],
  livesToNinety: ['then lives to ninety'],
  ninety: ['lives to ninety', 2],
  nobodyCould: ['Nobody could work'],
  why: ['out why', 1],
  scientists: ['until scientists', 1],
  families: ['same families', 1],
  thirtyYears: ['for thirty years', 1],
  afterMenopause: ['After menopause'],
  leaderWord: ['becomes the leader', 2],
  wholePod: ['the whole pod', 1],
  fishDisappear: ['When the fish disappear'],
  fishWord: ['When the fish disappear', 2],
  disappearWord: ['fish disappear', 1],
  everyWhaleFollows: ['every whale follows her'],
  followsWord: ['every whale follows her', 2],
  sheRemembers: ['because she remembers'],
  whereTheFood: ['where the food'],
  twentyYearsAgo: ['twenty years ago'],
  // Puente
  obviously: ['Obviously a woman'],
  isntAWhale: ['isn\'t a whale'],
  butIfABrain: ['But if a brain'],
  brainWord: ['But if a brain', 3],
  atItsBest: ['at its best'],
  bestWord: ['at its best', 2],
  whyDoSoMany: ['why do so many'],
  manyWomen: ['many women', 1],
  feelingLike: ['feeling like the worst'],
  worstVersion: ['the worst version', 1],
  // Slow fade
  becauseForAWoman: ['Because for a woman'],
  arrives: ['stage arrives', 1],
  slowFade: ['a slow fade', 1],
  firstTheFocus: ['First the focus'],
  focusGoes: ['the focus goes', 1],
  wordsGo: ['then the words', 2],
  driveGoes: ['then the drive', 2],
  snaps: ['until she snaps'],
  snapsWord: ['she snaps', 1],
  peopleSheLoves: ['the people she loves', 1],
  creepsIn: ['And because it creeps'],
  overAYear: ['over a year or two'],
  sheStarts: ['she starts to believe'],
  believeWord: ['starts to believe', 2],
  thisIsJustWho: ['this is just who'],
  isNow: ['who she is now', 3],
  // Estrógeno y dopamina
  nobodyTellsHer: ['Nobody tells her'],
  otherwise: ['tells her otherwise', 2],
  everyoneLooking: ['because everyone is looking', 1],
  atTheHormones: ['at the hormones', 2],
  andNobodyAt: ['and nobody at', 1],
  herBrain: ['for her brain', 2],
  estrogen: ['Estrogen had a second job'],
  secondJob: ['a second job', 1],
  forFortyYears: ['For forty years'],
  helpedTheBrain: ['it helped the brain', 1],
  makeDopamine: ['make dopamine', 1],
  theChemical: ['the chemical behind'],
  focusWord: ['behind focus', 1],
  driveWord: ['drive and follow'],
  followThrough: ['follow through'],
  // El interruptor
  inPerimenopause: ['In perimenopause'],
  justDrop: ['just drop', 1],
  flickers: ['it flickers', 1],
  lightWord: ['like a light', 2],
  badSwitch: ['a bad switch', 1],
  switchWord: ['a bad switch', 2],
  everyTimeItDips: ['and every time'],
  itDips: ['time it dips', 2],
  dopamineDips: ['dopamine dips with it'],
  dipsWord: ['dopamine dips with it', 1],
  thatsTheFog: ['That\'s the fog'],
  fogWord: ['That\'s the fog', 2],
  // Las respuestas de siempre
  usualAnswers: ['It\'s also why'],
  usualWord: ['the usual answers', 1],
  dontReach: ['don\'t reach it', 1],
  hrtSorts: ['HRT sorts the sweats'],
  sortsWord: ['HRT sorts the sweats', 1],
  sweats: ['sorts the sweats', 2],
  leavesTheFog: ['leaves the fog'],
  stimulants: ['Stimulants like Adderall'],
  adderall: ['Stimulants like Adderall', 2],
  pushOut: ['push out dopamine'],
  alreadyMade: ['already made'],
  quietlyStop: ['quietly stop working'],
  stopWord: ['quietly stop working', 1],
  // El fix -> CTRL
  pushingHarder: ['So pushing harder'],
  harder: ['So pushing harder', 2],
  neverTheFix: ['was never the fix', 1],
  theFixIs: ['The fix is giving'],
  givingTheBrain: ['giving the brain'],
  buildsDopamine: ['builds dopamine from'],
  aminoAcid: ['an amino acid'],
  tyrosine: ['called tyrosine', 1],
  smallCompany: ['A small company'],
  b6: ['bit of B6', 2],
  calmingPlants: ['two calming plants'],
  plantsWord: ['two calming plants', 2],
  nothingLikeStimulant: ['feels nothing like'],
  stimulantWord: ['like a stimulant', 2],
  calledIt: ['and called it CTRL', 1],
  ctrl: ['called it CTRL', 2],
  nothingHormonal: ['Nothing hormonal'],
  sitsFine: ['sits fine next'],
  nextToHrt: ['next to HRT', 2],
  // Recuperación
  onceTheBrain: ['And once the brain'],
  buildingAgain: ['building dopamine again'],
  fogLifts: ['the fog lifts'],
  liftsWord: ['the fog lifts', 2],
  driveComesBack: ['The drive comes back'],
  driveBack: ['The drive comes back', 1],
  soDoesPatience: ['so does the patience'],
  patienceWord: ['does the patience', 2],
  feelsLikeHerself: ['She feels like herself'],
  herselfWord: ['feels like herself', 2],
  // Cierre
  natureBuilt: ['Nature built this stage'],
  stageOfLife: ['stage of life'],
  makeAWoman: ['make a woman', 2],
  everybodyFollows: ['everybody follows'],
  followsFinal: ['everybody follows', 1],
  // Producto y garantía
  ctrlJustGives: ['CTRL just gives'],
  herBrainEnd: ['gives her brain', 2],
  getBackThere: ['get back there'],
  comesWith: ['It comes with'],
  guarantee: ['thirty day guarantee'],
  guaranteeWord: ['day guarantee', 1],
  inStock: ['in stock', 1],
  tapBelow: ['tap below'],
  yourSign: ['that\'s your sign'],
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
