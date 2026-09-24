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
  | 'pop' | 'whoosh' | 'whoosh_soft' | 'tick' | 'card' | 'draw' | 'fish' | 'erase' | 'click' | 'buzz'
  | 'gear_stop' | 'lock' | 'reveal' | 'flip' | 'stamp' | 'snap' | 'rise'
  | 'tap_soft' | 'paper_slide' | 'water_splash' | 'water_swell' | 'bubble1' | 'bubble2' | 'bubble3' | 'chime_soft' | 'latch';

export type SfxCue = {sfx: Sfx; at: number; volume: number};

const H = (k: keyof typeof HOOK.cues, o = 0) => hookCueFrame(k, o);
const B = (k: BodyCueKey, o = 0) => HOOK_FRAMES + bodyCueFrame(k, o);

// El trinquete de gear_stop termina con un golpe a ~29 frames de su inicio.
const GEAR_THUD = 29;

/**
 * V3: el "lock" (clics + campanita, el sonido tipo check-in) sonaba 7 veces;
 * ahora solo 2, donde de verdad es una confirmación: "she feels like herself
 * again" y la garantía. El resto de momentos usa un timbre que corresponde a
 * la acción (agua, burbujas, papel, marimba grave, pestillo) o se queda en
 * silencio cuando la voz y la animación bastan. Tampoco hay ya cadenas de
 * "pop" o de "card" idénticos.
 */
export const SFX: SfxCue[] = [
  // Transiciones entre escenas: se alternan dos soplos distintos y bajos.
  ...PUSH_FRAMES.map((f, i) => ({sfx: (i % 2 ? 'whoosh_soft' : 'whoosh') as Sfx, at: f - 2, volume: i % 2 ? 0.3 : 0.24})),
  {sfx: 'whoosh_soft', at: B('nobodyTellsHer', -2), volume: 0.28},
  {sfx: 'whoosh', at: B('onceTheBrain', -2), volume: 0.24},

  // Hook
  {sfx: 'tap_soft', at: H('women', 1), volume: 0.35},
  {sfx: 'water_splash', at: H('killerWhales', -3), volume: 0.4},
  {sfx: 'draw', at: H('only'), volume: 0.3},
  {sfx: 'water_splash', at: H('but', 3), volume: 0.26}, // la orca se sumerge
  {sfx: 'water_swell', at: H('toAWhale', -2), volume: 0.34}, // sube por la línea verde
  {sfx: 'erase', at: H('opposite', 5), volume: 0.3}, // la línea roja cae

  // Orcas
  {sfx: 'water_swell', at: B('aroundForty', 2), volume: 0.2}, // la aleta corta el agua
  {sfx: 'tick', at: B('forty'), volume: 0.26},
  {sfx: 'bubble1', at: B('stopsHaving'), volume: 0.3}, // una burbuja por cría
  {sfx: 'bubble2', at: B('stopsHaving', 6), volume: 0.26},
  {sfx: 'bubble3', at: B('stopsHaving', 12), volume: 0.22},
  {sfx: 'stamp', at: B('babies'), volume: 0.4},
  {sfx: 'draw', at: B('livesToNinety'), volume: 0.26},
  {sfx: 'tick', at: B('ninety', 6), volume: 0.24},
  // fichas con fotos: papel sobre papel, sin repetir el mismo golpe seis veces
  ...[0, 2, 4].map((i, n) => ({
    sfx: (n === 0 ? 'card' : 'paper_slide') as Sfx,
    at: B('scientists') + Math.round(((bodyCueFrame('thirtyYears', 6) - bodyCueFrame('scientists')) * i) / 6),
    volume: n === 0 ? 0.3 : 0.24,
  })),
  {sfx: 'water_swell', at: B('afterMenopause', -2), volume: 0.26}, // primer plano de la orca
  {sfx: 'chime_soft', at: B('leaderWord', 2), volume: 0.26}, // el anillo de líder
  {sfx: 'fish', at: B('disappearWord', 2), volume: 0.4},
  {sfx: 'draw', at: B('sheRemembers', 12), volume: 0.32},

  // Puente
  {sfx: 'stamp', at: B('isntAWhale'), volume: 0.38},
  {sfx: 'tap_soft', at: B('brainWord'), volume: 0.28},
  {sfx: 'rise', at: B('atItsBest', -6), volume: 0.28},
  {sfx: 'paper_slide', at: B('whyDoSoMany'), volume: 0.2},

  // Slow fade
  {sfx: 'tick', at: B('focusGoes', 5), volume: 0.32},
  {sfx: 'erase', at: B('wordsGo', 5), volume: 0.4},
  {sfx: 'erase', at: B('wordsGo', 22), volume: 0.28},
  {sfx: 'gear_stop', at: B('driveGoes', 12 - GEAR_THUD), volume: 0.45},

  // Familia e identidad
  {sfx: 'snap', at: B('snapsWord', -1), volume: 0.5},
  {sfx: 'flip', at: B('overAYear'), volume: 0.28},
  {sfx: 'flip', at: B('overAYear', 12), volume: 0.22},
  {sfx: 'flip', at: B('overAYear', 24), volume: 0.17},
  {sfx: 'card', at: B('thisIsJustWho', 8), volume: 0.32},
  {sfx: 'stamp', at: B('isNow', -2), volume: 0.45},

  // Estrógeno y dopamina
  {sfx: 'tap_soft', at: B('everyoneLooking'), volume: 0.22},
  {sfx: 'whoosh_soft', at: B('andNobodyAt', 16), volume: 0.32},
  {sfx: 'card', at: B('estrogen', 2), volume: 0.26},
  {sfx: 'draw', at: B('secondJob', -2), volume: 0.32},
  {sfx: 'tick', at: B('focusWord', 2), volume: 0.34},
  {sfx: 'latch', at: B('driveWord'), volume: 0.3},
  {sfx: 'latch', at: B('followThrough', 10), volume: 0.36},

  // El interruptor: un clic por apagón
  ...FLICKERS.map(([k, o]) => ({sfx: 'click' as const, at: B(k, o), volume: 0.42})),
  {sfx: 'buzz', at: B('lightWord'), volume: 0.3},
  {sfx: 'buzz', at: B('badSwitch'), volume: 0.24},

  // Las respuestas de siempre
  {sfx: 'tick', at: B('dontReach'), volume: 0.3},
  {sfx: 'chime_soft', at: B('sortsWord', 4), volume: 0.24},
  {sfx: 'gear_stop', at: B('stopWord', 12 - GEAR_THUD), volume: 0.4},

  // El fix -> CTRL: cada ingrediente con su propio timbre
  {sfx: 'stamp', at: B('neverTheFix', 2), volume: 0.35},
  {sfx: 'card', at: B('aminoAcid', 4), volume: 0.28},
  {sfx: 'tap_soft', at: B('b6', -4), volume: 0.3},
  {sfx: 'paper_slide', at: B('calmingPlants', 2), volume: 0.26},
  {sfx: 'rise', at: B('calledIt', -10), volume: 0.35},
  {sfx: 'reveal', at: B('ctrl', -2), volume: 0.5},
  {sfx: 'paper_slide', at: B('nextToHrt', -2), volume: 0.24},

  // Recuperación
  {sfx: 'rise', at: B('fogLifts', -4), volume: 0.4},
  {sfx: 'chime_soft', at: B('driveBack'), volume: 0.3},
  {sfx: 'lock', at: B('herselfWord', 4), volume: 0.4},

  // Cierre y producto
  {sfx: 'whoosh_soft', at: B('makeAWoman', -10), volume: 0.26},
  {sfx: 'reveal', at: B('ctrlJustGives'), volume: 0.4},
  {sfx: 'flip', at: B('comesWith', 4), volume: 0.3},
  ...[0, 1, 2, 3, 4, 5].map((i) => ({sfx: 'tick' as const, at: B('guarantee', i * 6), volume: 0.18})),
  {sfx: 'lock', at: B('guaranteeWord', 16), volume: 0.36},
  {sfx: 'tap_soft', at: B('inStock', -3), volume: 0.28},
  {sfx: 'pop', at: B('tapBelow'), volume: 0.3},
  {sfx: 'stamp', at: B('yourSign'), volume: 0.3},
];

/** Fondos: [archivo, desde, hasta, volumen]. */
export const PADS: {src: 'pad_tense' | 'pad_warm'; from: number; to: number; volume: number}[] = [
  {src: 'pad_tense', from: B('nobodyTellsHer'), to: B('pushingHarder', 20), volume: 0.1},
  {src: 'pad_warm', from: B('ctrl', -4), to: TOTAL_FRAMES, volume: 0.1},
];
