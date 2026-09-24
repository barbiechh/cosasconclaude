/**
 * Diseño sonoro: cada efecto va atado a un evento visual (cue del guion +
 * desfase en frames). Volúmenes bajos: la voz siempre manda.
 * Los WAV salen de scripts/make_sfx.py -> public/sfx/.
 * Progresión: ligero y seco al principio, tensión grave de fondo en la
 * explicación (pad_tense) y cálido desde que aparece CTRL (pad_warm).
 */
import {BodyCueKey, HOOK, HOOK_FRAMES, TOTAL_FRAMES, bodyCueFrame, hookCueFrame} from './timing';
import {PUSH_FRAMES} from './scenes';
import {FLICKERS} from '../components/scenes/Flicker';

export type Sfx =
  | 'pop' | 'whoosh' | 'tick' | 'card' | 'draw' | 'fish' | 'erase' | 'click' | 'buzz'
  | 'gear_stop' | 'lock' | 'reveal' | 'flip' | 'stamp' | 'snap' | 'rise';

export type SfxCue = {sfx: Sfx; at: number; volume: number};

const H = (k: keyof typeof HOOK.cues, o = 0) => hookCueFrame(k, o);
const B = (k: BodyCueKey, o = 0) => HOOK_FRAMES + bodyCueFrame(k, o);

// El trinquete de gear_stop termina con un golpe a ~29 frames de su inicio.
const GEAR_THUD = 29;

export const SFX: SfxCue[] = [
  // Transiciones entre escenas (barrido o zoom)
  ...PUSH_FRAMES.map((f) => ({sfx: 'whoosh' as const, at: f - 2, volume: 0.28})),
  {sfx: 'whoosh', at: B('nobodyTellsHer', -2), volume: 0.28},
  {sfx: 'whoosh', at: B('onceTheBrain', -2), volume: 0.28},

  // Hook
  {sfx: 'pop', at: H('women', 1), volume: 0.35},
  {sfx: 'whoosh', at: H('killerWhales', -2), volume: 0.55},
  {sfx: 'draw', at: H('only'), volume: 0.3},
  {sfx: 'draw', at: H('perimenopause'), volume: 0.28},
  {sfx: 'pop', at: H('toAWhale', 4), volume: 0.3},
  {sfx: 'pop', at: H('completeOpposite'), volume: 0.28},
  {sfx: 'erase', at: H('opposite', 5), volume: 0.35},
  {sfx: 'buzz', at: H('opposite', 10), volume: 0.35},

  // Orcas
  {sfx: 'tick', at: B('forty'), volume: 0.3},
  {sfx: 'pop', at: B('stopsHaving'), volume: 0.22},
  {sfx: 'pop', at: B('stopsHaving', 5), volume: 0.22},
  {sfx: 'pop', at: B('stopsHaving', 10), volume: 0.22},
  {sfx: 'stamp', at: B('babies'), volume: 0.4},
  {sfx: 'draw', at: B('livesToNinety'), volume: 0.3},
  {sfx: 'tick', at: B('ninety', 6), volume: 0.3},
  ...[0, 1, 2, 3, 4, 5].map((i) => ({
    sfx: 'card' as const,
    at: B('scientists') + Math.round(((bodyCueFrame('thirtyYears', 6) - bodyCueFrame('scientists')) * i) / 6),
    volume: 0.3,
  })),
  {sfx: 'tick', at: B('thirtyYears', 6), volume: 0.3},
  {sfx: 'whoosh', at: B('leaderWord', -4), volume: 0.22},
  {sfx: 'pop', at: B('leaderWord', 6), volume: 0.28},
  {sfx: 'fish', at: B('disappearWord', 2), volume: 0.5},
  {sfx: 'draw', at: B('sheRemembers', 12), volume: 0.38},
  {sfx: 'draw', at: B('whereTheFood', 4), volume: 0.3},

  // Puente
  {sfx: 'stamp', at: B('isntAWhale'), volume: 0.38},
  {sfx: 'pop', at: B('brainWord'), volume: 0.3},
  {sfx: 'rise', at: B('atItsBest', -6), volume: 0.28},
  {sfx: 'pop', at: B('whyDoSoMany'), volume: 0.22},

  // Slow fade
  {sfx: 'tick', at: B('focusGoes', 5), volume: 0.35},
  {sfx: 'erase', at: B('wordsGo', 5), volume: 0.42},
  {sfx: 'erase', at: B('wordsGo', 22), volume: 0.32},
  {sfx: 'gear_stop', at: B('driveGoes', 12 - GEAR_THUD), volume: 0.45},

  // Familia e identidad
  {sfx: 'snap', at: B('snapsWord', -1), volume: 0.5},
  {sfx: 'flip', at: B('overAYear'), volume: 0.28},
  {sfx: 'flip', at: B('overAYear', 12), volume: 0.24},
  {sfx: 'flip', at: B('overAYear', 24), volume: 0.2},
  {sfx: 'card', at: B('thisIsJustWho', 8), volume: 0.35},
  {sfx: 'stamp', at: B('isNow', -2), volume: 0.45},

  // Estrógeno y dopamina
  {sfx: 'pop', at: B('everyoneLooking'), volume: 0.22},
  {sfx: 'pop', at: B('everyoneLooking', 24), volume: 0.22},
  {sfx: 'whoosh', at: B('andNobodyAt', 16), volume: 0.35},
  {sfx: 'pop', at: B('estrogen', 2), volume: 0.3},
  {sfx: 'draw', at: B('secondJob', -2), volume: 0.35},
  {sfx: 'tick', at: B('focusWord', 2), volume: 0.38},
  {sfx: 'lock', at: B('driveWord'), volume: 0.28},
  {sfx: 'lock', at: B('followThrough', 10), volume: 0.34},

  // El interruptor: un clic por apagón
  ...FLICKERS.map(([k, o]) => ({sfx: 'click' as const, at: B(k, o), volume: 0.42})),
  {sfx: 'buzz', at: B('lightWord'), volume: 0.3},
  {sfx: 'buzz', at: B('badSwitch'), volume: 0.26},

  // Las respuestas de siempre
  {sfx: 'tick', at: B('dontReach'), volume: 0.32},
  {sfx: 'lock', at: B('sortsWord', 4), volume: 0.3},
  {sfx: 'gear_stop', at: B('stopWord', 12 - GEAR_THUD), volume: 0.4},

  // El fix -> CTRL
  {sfx: 'stamp', at: B('neverTheFix', 2), volume: 0.35},
  {sfx: 'pop', at: B('aminoAcid', 4), volume: 0.3},
  {sfx: 'pop', at: B('b6', -4), volume: 0.3},
  {sfx: 'pop', at: B('calmingPlants', 2), volume: 0.3},
  {sfx: 'rise', at: B('calledIt', -10), volume: 0.35},
  {sfx: 'reveal', at: B('ctrl', -2), volume: 0.5},
  {sfx: 'whoosh', at: B('sitsFine', 2), volume: 0.22},
  {sfx: 'lock', at: B('nextToHrt'), volume: 0.34},

  // Recuperación
  {sfx: 'rise', at: B('fogLifts', -4), volume: 0.4},
  {sfx: 'lock', at: B('driveBack'), volume: 0.4},
  {sfx: 'pop', at: B('patienceWord'), volume: 0.3},
  {sfx: 'lock', at: B('herselfWord', 4), volume: 0.4},

  // Cierre y producto
  {sfx: 'whoosh', at: B('makeAWoman', -10), volume: 0.25},
  {sfx: 'reveal', at: B('ctrlJustGives'), volume: 0.4},
  {sfx: 'flip', at: B('comesWith', 4), volume: 0.3},
  ...[0, 1, 2, 3, 4, 5].map((i) => ({sfx: 'tick' as const, at: B('guarantee', i * 6), volume: 0.2})),
  {sfx: 'lock', at: B('guaranteeWord', 16), volume: 0.4},
  {sfx: 'pop', at: B('inStock', -3), volume: 0.32},
  {sfx: 'pop', at: B('tapBelow'), volume: 0.32},
  {sfx: 'stamp', at: B('yourSign'), volume: 0.3},
];

/** Fondos: [archivo, desde, hasta, volumen]. */
export const PADS: {src: 'pad_tense' | 'pad_warm'; from: number; to: number; volume: number}[] = [
  {src: 'pad_tense', from: B('nobodyTellsHer'), to: B('pushingHarder', 20), volume: 0.1},
  {src: 'pad_warm', from: B('ctrl', -4), to: TOTAL_FRAMES, volume: 0.1},
];
