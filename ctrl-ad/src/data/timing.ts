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
import rawHook2Words from './hook2-words.json';
import rawHook3Words from './hook3-words.json';
import rawHook4Words from './hook4-words.json';

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
const HOOK2_WORDS = rawHook2Words as VoWord[];
const HOOK3_WORDS = rawHook3Words as VoWord[];
const HOOK4_WORDS = rawHook4Words as VoWord[];
/** Palabras del body (tiempos del MP3 del body). */
export const BODY_WORDS = WORDS.filter((w) => w.section === 'body');

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');

/**
 * Segundo (absoluto dentro del MP3) en que empieza `phrase` dentro de la
 * sección indicada. `focus` elige qué palabra de la frase marca el cue
 * (0 = la primera). Falla al renderizar si la frase no existe en el guion.
 */
export const phraseAt = (section: Section, phrase: string, focus = 0, words: VoWord[] = WORDS): number => {
  const target = phrase.split(/\s+/).map(norm);
  const pool = words.filter((w) => w.section === section);
  for (let i = 0; i + target.length <= pool.length; i++) {
    if (target.every((t, k) => norm(pool[i + k].word) === t)) {
      return pool[i + focus].start;
    }
  }
  throw new Error(`Frase no encontrada en el guion (${section}): "${phrase}"`);
};

// ---------------------------------------------------------------------------
// HOOKS — módulos sustituibles, cada uno con su audio, sus palabras y sus cues
// (relativos a su propio inicio). `HOOK` es el que usa el video.
// ---------------------------------------------------------------------------
export const BODY_AUDIO_START_SECONDS = WORDS.find((w) => w.section === 'body')!.start;

type HookWord = {word: string; start: number; end: number};
type HookDef<C extends string> = {
  id: string;
  audioSrc: string;
  audioStartSeconds: number;
  durationSeconds: number;
  /** palabras del hook con tiempos relativos al inicio del hook (captions) */
  words: HookWord[];
  /**
   * Paso al body: 'push' = barrido lateral; 'match' = corte a juego (el hook
   * termina con la orca exactamente donde empieza la primera escena).
   */
  exitToBody: 'push' | 'match';
  cues: Record<C, number>;
};

const hookCueIn = (words: VoWord[], start: number) => (phrase: string, focus = 0) => phraseAt('hook', phrase, focus, words) - start;

// HOOK 1 (ya no va en el render final): primeros 7.86 s de la voz original.
const h1 = hookCueIn(WORDS, 0);
export const HOOK1: HookDef<'women' | 'killerWhales' | 'only' | 'earth' | 'but' | 'perimenopause' | 'toAWhale' | 'completeOpposite' | 'opposite' | 'toAWoman'> = {
  id: 'hook1',
  audioSrc: AUDIO_SRC,
  audioStartSeconds: 0,
  // El hook termina exactamente donde empieza "Around forty".
  durationSeconds: BODY_AUDIO_START_SECONDS,
  words: WORDS.filter((w) => w.section === 'hook'),
  exitToBody: 'push',
  cues: {
    women: h1('Women'),
    killerWhales: h1('killer whales'),
    only: h1('the only animals', 1),
    earth: h1('on Earth', 1),
    but: h1('But what it does'),
    perimenopause: h1('perimenopause'),
    toAWhale: h1('to a whale', 2),
    completeOpposite: h1('complete opposite'),
    opposite: h1('complete opposite', 1),
    toAWoman: h1('to a woman', 2),
  },
};

// HOOK 2: grabación propia (script/hook2.txt, audio-src/hook2-original.mp3 ->
// public/audio/hook2.wav con scripts/prepare_hook_audio.py), alineada en
// src/data/hook2-words.json.
const h2 = hookCueIn(HOOK2_WORDS, 0);
export const HOOK2: HookDef<'killer' | 'perimenopause' | 'atTheSameAge' | 'same' | 'age' | 'womenDo' | 'but' | 'exact' | 'opposite' | 'toThem' | 'reason' | 'why' | 'explains' | 'really' | 'womans' | 'brain' | 'rightNow'> = {
  id: 'hook2',
  audioSrc: 'audio/hook2.wav',
  audioStartSeconds: 0,
  // La grabación entera (la voz termina en 8.64 s; el resto es respiro).
  durationSeconds: 8.72,
  words: HOOK2_WORDS,
  exitToBody: 'push',
  cues: {
    killer: h2('Killer whales'),
    perimenopause: h2('perimenopause'),
    atTheSameAge: h2('at the same age'),
    same: h2('the same age', 1),
    age: h2('same age', 1),
    womenDo: h2('women do'),
    but: h2('But it does'),
    exact: h2('the exact opposite', 1),
    opposite: h2('exact opposite', 1),
    toThem: h2('to them'),
    reason: h2('the reason why', 1),
    why: h2('reason why', 1),
    explains: h2('explains'),
    really: h2("what's really", 1),
    womans: h2("a woman's brain", 1),
    brain: h2("woman's brain", 1),
    rightNow: h2('right now'),
  },
};

// HOOK 3: doble página de libro ilustrado (script/hook3.txt,
// audio-src/hook3-original.mp3 -> public/audio/hook3.wav con 0.3 s de respiro
// al final), palabras en src/data/hook3-words.json.
const h3 = hookCueIn(HOOK3_WORDS, 0);
export const HOOK3: HookDef<'peri' | 'hits' | 'killer' | 'women' | 'exactly' | 'same' | 'age' | 'forOne' | 'them' | 'best' | 'happens' | 'herBrain' | 'brain' | 'forOther' | 'other' | 'years' | 'rather' | 'forget'> = {
  id: 'hook3',
  audioSrc: 'audio/hook3.wav',
  audioStartSeconds: 0,
  // voz 0.09..9.04 s + 0.3 s de respiro
  durationSeconds: 9.34,
  words: HOOK3_WORDS,
  exitToBody: 'match',
  cues: {
    peri: h3('Perimenopause hits'),
    hits: h3('hits killer'),
    killer: h3('killer whales'),
    women: h3('and women', 1),
    exactly: h3('at exactly', 1),
    same: h3('the same age', 1),
    age: h3('same age', 1),
    forOne: h3('For one of them'),
    them: h3('of them', 1),
    best: h3('the best thing', 1),
    happens: h3('ever happens', 1),
    herBrain: h3('to her brain', 1),
    brain: h3('her brain', 1),
    forOther: h3('For the other'),
    other: h3('the other', 1),
    years: h3('the years', 1),
    rather: h3("she'd rather", 1),
    forget: h3('rather forget', 1),
  },
};

// HOOK 4: museo de láminas ilustradas (script/hook4.txt,
// audio-src/hook4-original.mp3 -> public/audio/hook4.wav con 0.35 s de
// respiro), palabras en src/data/hook4-words.json.
const h4 = hookCueIn(HOOK4_WORDS, 0);
export const HOOK4: HookDef<'only' | 'two' | 'animals' | 'earth' | 'peri' | 'killer' | 'whales' | 'women' | 'one' | 'comesOut' | 'stronger' | 'been' | 'other' | 'gets' | 'told' | 'just' | 'part' | 'getting' | 'older'> = {
  id: 'hook4',
  audioSrc: 'audio/hook4.wav',
  audioStartSeconds: 0,
  // voz 0.11..9.99 s + 0.35 s de respiro
  durationSeconds: 10.48,
  words: HOOK4_WORDS,
  exitToBody: 'match',
  cues: {
    only: h4('Only two'),
    two: h4('Only two', 1),
    animals: h4('two animals', 1),
    earth: h4('on Earth', 1),
    peri: h4('through perimenopause', 1),
    killer: h4('Killer whales'),
    whales: h4('Killer whales', 1),
    women: h4('and women', 1),
    one: h4('One of them'),
    comesOut: h4('comes out', 0),
    stronger: h4('it stronger', 1),
    been: h4('ever been', 1),
    other: h4('The other one'),
    gets: h4('one gets', 1),
    told: h4('gets told', 1),
    just: h4("it's just", 1),
    part: h4('just part', 1),
    getting: h4('of getting', 1),
    older: h4('getting older', 1),
  },
};

/**
 * Hook activo en el video: HOOK = HOOK1 | HOOK2 | HOOK3 | HOOK4, y el
 * componente correspondiente en MainVideo.tsx. El body no cambia.
 */
export const HOOK = HOOK4;

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

/** Frame de un cue del hook activo, relativo al inicio del hook. */
export const hookCueFrame = (key: keyof typeof HOOK.cues, offsetFrames = 0): number =>
  secToFrame(HOOK.cues[key]) + offsetFrames;

/** Frames de cues de cada hook (cada componente usa el suyo). */
export const hook1CueFrame = (key: keyof typeof HOOK1.cues, offsetFrames = 0): number => secToFrame(HOOK1.cues[key]) + offsetFrames;
export const hook2CueFrame = (key: keyof typeof HOOK2.cues, offsetFrames = 0): number => secToFrame(HOOK2.cues[key]) + offsetFrames;
export const hook3CueFrame = (key: keyof typeof HOOK3.cues, offsetFrames = 0): number => secToFrame(HOOK3.cues[key]) + offsetFrames;
export const hook4CueFrame = (key: keyof typeof HOOK4.cues, offsetFrames = 0): number => secToFrame(HOOK4.cues[key]) + offsetFrames;
