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
  | 'pop' | 'whoosh' | 'tick' | 'card' | 'draw' | 'fish' | 'erase' | 'click' | 'click2' | 'buzz'
  | 'gear_stop' | 'reveal' | 'flip' | 'stamp' | 'snap' | 'rise'
  | 'splash' | 'bubble' | 'thud' | 'knock' | 'type' | 'gear_spin' | 'gear_engage' | 'chime'
  | 'deflate' | 'marker' | 'pour' | 'rustle' | 'shimmer' | 'riffle';

export type SfxCue = {sfx: Sfx; at: number; volume: number};

const H = (k: keyof typeof HOOK.cues, o = 0) => hookCueFrame(k, o);
const B = (k: BodyCueKey, o = 0) => HOOK_FRAMES + bodyCueFrame(k, o);

// El trinquete de gear_stop termina con un golpe a ~29 frames de su inicio.
const GEAR_THUD = 29;

/**
 * Solo los gestos que necesitan énfasis llevan sonido, y cada tipo de gesto
 * tiene el suyo (casi ninguno se repite más de dos veces). Entre medio, la
 * escena respira con la voz y el fondo.
 */
export const SFX: SfxCue[] = [
  // Transiciones entre escenas: un soplo muy bajo en cada barrido
  ...PUSH_FRAMES.map((f) => ({sfx: 'whoosh' as const, at: f - 2, volume: 0.16})),

  // Hook
  {sfx: 'card', at: H('women', 2), volume: 0.2},
  {sfx: 'splash', at: H('killerWhales', -1), volume: 0.45},
  {sfx: 'flip', at: H('but', 2), volume: 0.2},
  {sfx: 'draw', at: H('only'), volume: 0.26},
  {sfx: 'erase', at: H('opposite', 5), volume: 0.32},
  {sfx: 'buzz', at: H('opposite', 10), volume: 0.28},

  // Orcas
  {sfx: 'bubble', at: B('stopsHaving'), volume: 0.35},
  {sfx: 'bubble', at: B('stopsHaving', 12), volume: 0.28},
  {sfx: 'thud', at: B('babies'), volume: 0.4},
  {sfx: 'draw', at: B('scientists'), volume: 0.26},
  {sfx: 'card', at: B('families', -6), volume: 0.28},
  {sfx: 'fish', at: B('disappearWord', 2), volume: 0.45},
  {sfx: 'splash', at: B('everyWhaleFollows'), volume: 0.22},
  {sfx: 'draw', at: B('sheRemembers', 12), volume: 0.32},

  // Puente
  {sfx: 'knock', at: B('isntAWhale'), volume: 0.4},
  {sfx: 'shimmer', at: B('bestWord', -4), volume: 0.35},

  // Slow fade
  {sfx: 'tick', at: B('focusGoes', 5), volume: 0.3},
  {sfx: 'type', at: B('wordsGo', -6), volume: 0.4},
  {sfx: 'erase', at: B('wordsGo', 5), volume: 0.38},
  {sfx: 'gear_stop', at: B('driveGoes', 12 - GEAR_THUD), volume: 0.42},

  // Familia e identidad
  {sfx: 'snap', at: B('snapsWord', -1), volume: 0.45},
  {sfx: 'flip', at: B('overAYear'), volume: 0.26},
  {sfx: 'stamp', at: B('isNow', -2), volume: 0.4},

  // Estrógeno y dopamina
  {sfx: 'whoosh', at: B('andNobodyAt', 16), volume: 0.28},
  {sfx: 'draw', at: B('secondJob', -2), volume: 0.26},
  {sfx: 'gear_spin', at: B('driveWord'), volume: 0.32},

  // El interruptor: clics alternados, solo en los apagones marcados
  ...FLICKERS.filter((_, i) => i % 2 === 0 || i === FLICKERS.length - 1).map(([k, o], i) => ({
    sfx: (i % 2 ? 'click2' : 'click') as Sfx,
    at: B(k, o),
    volume: 0.38,
  })),
  {sfx: 'buzz', at: B('lightWord'), volume: 0.24},

  // Las respuestas de siempre
  {sfx: 'deflate', at: B('stopWord', 4), volume: 0.36},

  // El fix -> CTRL
  {sfx: 'marker', at: B('neverTheFix', 2), volume: 0.34},
  {sfx: 'pour', at: B('aminoAcid', 4), volume: 0.34},
  {sfx: 'gear_spin', at: B('b6', -4), volume: 0.26},
  {sfx: 'rustle', at: B('calmingPlants', 2), volume: 0.36},
  {sfx: 'reveal', at: B('ctrl', -2), volume: 0.48},
  {sfx: 'chime', at: B('nextToHrt'), volume: 0.3},

  // Recuperación
  {sfx: 'rise', at: B('fogLifts', -4), volume: 0.38},
  {sfx: 'gear_engage', at: B('driveBack', -2), volume: 0.42},
  {sfx: 'shimmer', at: B('herselfWord', 2), volume: 0.3},

  // Producto y garantía
  {sfx: 'riffle', at: B('guarantee'), volume: 0.3},
  {sfx: 'chime', at: B('guaranteeWord', 16), volume: 0.34},
  {sfx: 'pop', at: B('tapBelow'), volume: 0.3},
];

/** Fondos: [archivo, desde, hasta, volumen]. */
export const PADS: {src: 'pad_tense' | 'pad_warm'; from: number; to: number; volume: number}[] = [
  {src: 'pad_tense', from: B('nobodyTellsHer'), to: B('pushingHarder', 20), volume: 0.1},
  {src: 'pad_warm', from: B('ctrl', -4), to: TOTAL_FRAMES, volume: 0.1},
];
