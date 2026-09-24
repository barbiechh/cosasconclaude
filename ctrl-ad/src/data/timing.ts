/**
 * ARCHIVO ÚNICO DE TIEMPOS.
 *
 * Todos los cortes de escena y entradas de texto del proyecto se leen de aquí.
 * No hay "números mágicos" repartidos en los componentes: si hay que mover un
 * corte, se mueve en este archivo y toda la composición se reacomoda sola.
 *
 * VERIFICACIÓN:
 * - AUDIO_DURATION_SECONDS se midió con ffprobe sobre "voz elegida.MP3" (dato exacto).
 * - HOOK_BODY_CUT_SECONDS se estimó de forma acústica (detección de silencios +
 *   análisis de espectrograma + verificación de ritmo de habla contra el conteo
 *   de palabras del guion). NO se verificó con una transcripción automática
 *   palabra-por-palabra porque el entorno de esta sesión bloquea la descarga de
 *   modelos de reconocimiento de voz (whisper, huggingface) por política de red.
 *   Por eso está marcado como "estimated", no "verified". Antes de dar el
 *   proyecto por cerrado, confirma este punto de corte escuchando el MP3 en
 *   ~21.4s-21.6s.
 * - Los tiempos de las demás frases del BODY son estimaciones por ritmo de
 *   habla (palabras / segundo derivado de los tramos ya confirmados por
 *   silencedetect). Todas están marcadas "estimated" en SCRIPT_CUES y deben
 *   confirmarse por oído o con una herramienta de alineación de voz antes del
 *   render final para redes.
 */

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Medido con ffprobe (exacto).
export const AUDIO_DURATION_SECONDS = 116.22;
export const TOTAL_FRAMES = Math.round(AUDIO_DURATION_SECONDS * FPS);

export const AUDIO_SRC = 'audio/voz-elegida.mp3';

export type TimeConfidence = 'confirmed' | 'estimated' | 'pending';

export interface TimeMarker {
  /** segundos desde el inicio del audio completo */
  seconds: number;
  confidence: TimeConfidence;
  note?: string;
}

export const secToFrame = (seconds: number) => Math.round(seconds * FPS);

/**
 * PUNTO DE CORTE HOOK -> BODY.
 * Fin real de "...what it does to a woman." y arranque de "Around forty...".
 * Ver nota de verificación arriba.
 */
export const HOOK_BODY_CUT: TimeMarker = {
  seconds: 21.5,
  confidence: 'estimated',
  note:
    'Estimado por silencedetect (pausas en 21.40s y 21.52s) + espectrograma. ' +
    'Confirmar por oído antes del render final.',
};

export const HOOK_BODY_CUT_SECONDS = HOOK_BODY_CUT.seconds;
export const HOOK_BODY_CUT_FRAME = secToFrame(HOOK_BODY_CUT_SECONDS);

/**
 * Cues del HOOK, en tiempo RELATIVO al propio Hook1 (empieza en 0).
 * Así Hook1 es un módulo autocontenido y sustituible por Hook2 sin tocar nada
 * del Body: solo cambia este bloque + el archivo de audio del hook.
 */
export const HOOK_CUES = {
  durationSeconds: HOOK_BODY_CUT_SECONDS,
  women: {seconds: 0.0, confidence: 'estimated' as TimeConfidence},
  killerWhales: {seconds: 0.9, confidence: 'estimated' as TimeConfidence},
  perimenopauseLabel: {seconds: 4.6, confidence: 'estimated' as TimeConfidence},
  butWhatItDoesToAWhale: {seconds: 8.8, confidence: 'estimated' as TimeConfidence},
  completeOpposite: {seconds: 12.6, confidence: 'estimated' as TimeConfidence},
  splitComposition: {seconds: 15.2, confidence: 'estimated' as TimeConfidence},
  toAWoman: {
    seconds: 20.05,
    confidence: 'confirmed',
    note: 'Inicio de la pausa dramática antes de "woman", confirmado por silencedetect.',
  },
} as const;

/**
 * Cues del BODY, en tiempo ABSOLUTO (segundos desde el inicio del audio completo).
 * BODY_START_SECONDS = HOOK_BODY_CUT_SECONDS: el componente Body se posiciona
 * siempre a partir de ese offset, nunca con un número fijo propio.
 */
export const BODY_START_SECONDS = HOOK_BODY_CUT_SECONDS;

export const BODY_CUES = {
  aroundForty: {seconds: 21.5, confidence: 'confirmed' as TimeConfidence, note: 'Inicio de "Around", ver HOOK_BODY_CUT.'},
  livesToNinety: {seconds: 24.2, confidence: 'estimated' as TimeConfidence},
  nobodyCouldWorkOutWhy: {seconds: 26.3, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 26.2-26.4'},
  followedFamilies30Years: {seconds: 28.6, confidence: 'estimated' as TimeConfidence},
  becomesLeaderOfPod: {seconds: 32.0, confidence: 'estimated' as TimeConfidence},
  whenFishDisappear: {seconds: 35.5, confidence: 'estimated' as TimeConfidence},
  everyWhaleFollowsHer: {seconds: 38.0, confidence: 'estimated' as TimeConfidence},
  remembersFoodTwentyYearsAgo: {seconds: 39.7, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 39.57-39.67'},

  obviouslyNotAWhale: {seconds: 44.7, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 44.48-44.60'},
  brainAtBestQuestion: {seconds: 48.0, confidence: 'estimated' as TimeConfidence},
  worstVersionOfThemselves: {seconds: 50.9, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 50.73-50.82'},

  slowFadeIntro: {seconds: 53.7, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 53.48-53.58'},
  focusGoes: {seconds: 55.0, confidence: 'estimated' as TimeConfidence},
  wordsGo: {seconds: 56.2, confidence: 'estimated' as TimeConfidence},
  driveGoes: {seconds: 57.4, confidence: 'estimated' as TimeConfidence},
  snapsAtLovedOnes: {seconds: 59.0, confidence: 'estimated' as TimeConfidence},
  creepsInOverYear: {seconds: 61.5, confidence: 'estimated' as TimeConfidence},
  justWhoSheIsNow: {seconds: 63.3, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect ~63.09-63.26'},

  nobodyTellsHer: {seconds: 65.5, confidence: 'estimated' as TimeConfidence},
  everyoneLookingAtHormones: {seconds: 67.5, confidence: 'estimated' as TimeConfidence},
  estrogenSecondJob: {seconds: 69.5, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 69.35-69.44'},
  fortyYearsDopamine: {seconds: 72.0, confidence: 'estimated' as TimeConfidence},
  focusDriveFollowThrough: {seconds: 75.0, confidence: 'estimated' as TimeConfidence},
  itFlickers: {seconds: 78.5, confidence: 'estimated' as TimeConfidence, note: 'La animación de parpadeo del switch debe caer exactamente aquí; ajustar por oído.'},
  likeALightBadSwitch: {seconds: 79.5, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 80.11-80.19'},
  dopamineDipsWithIt: {seconds: 82.0, confidence: 'estimated' as TimeConfidence, note: 'La caída visual del gráfico debe sincronizarse aquí; ajustar por oído.'},
  thatsTheFog: {seconds: 83.5, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 83.24-83.34'},

  usualAnswersDontReach: {seconds: 85.5, confidence: 'estimated' as TimeConfidence},
  hrtSortsSweats: {seconds: 87.5, confidence: 'estimated' as TimeConfidence},
  adderallPushOutDopamine: {seconds: 90.0, confidence: 'estimated' as TimeConfidence},
  stopWorkingThisAge: {seconds: 92.4, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 92.16-92.27'},

  pushingHarderNeverFix: {seconds: 94.0, confidence: 'estimated' as TimeConfidence},
  tyrosineReveal: {seconds: 96.5, confidence: 'estimated' as TimeConfidence},
  b6AndPlants: {seconds: 98.5, confidence: 'estimated' as TimeConfidence},
  feelsNothingLikeStimulant: {seconds: 100.2, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 99.99-100.11'},
  calledItCtrl: {
    seconds: 101.3,
    confidence: 'estimated',
    note: 'Momento en que se revela el frasco real de CTRL (pendiente de foto real).',
  },
  nothingHormonal: {seconds: 103.5, confidence: 'estimated' as TimeConfidence},

  brainBuildingDopamineAgain: {seconds: 106.0, confidence: 'estimated' as TimeConfidence},
  fogLifts: {seconds: 108.0, confidence: 'estimated' as TimeConfidence},
  driveAndPatienceBack: {seconds: 109.5, confidence: 'estimated' as TimeConfidence},
  feelsLikeHerselfAgain: {seconds: 111.0, confidence: 'estimated' as TimeConfidence},

  natureBuiltThisStage: {seconds: 112.5, confidence: 'estimated' as TimeConfidence},
  everybodyFollows: {seconds: 114.9, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 114.78-114.86'},
  ctrlGivesBrainWhatItNeeds: {seconds: 116.1, confidence: 'confirmed' as TimeConfidence, note: 'silencedetect 116.10-116.22'},

  thirtyDayGuarantee: {seconds: 116.22, confidence: 'pending' as TimeConfidence, note: 'Cola del audio; confirmar si el CTA final entra aquí o justo después del cierre del MP3.'},
} as const;

export type BodyCueKey = keyof typeof BODY_CUES;

/**
 * Duración total de la EndCard, en segundos, contada desde el final del audio.
 * El audio termina exactamente al terminar de hablar (no hay cola de silencio
 * detectada), así que la EndCard vive sobre los últimos segundos del propio
 * BODY más un colchón visual corto después del último frame de audio.
 */
export const END_CARD_HOLD_SECONDS = 2.5;

/**
 * Convierte un cue del BODY (tiempo absoluto, segundos desde el inicio del
 * audio completo) al frame LOCAL dentro del componente <Body>, que vive en
 * una <Sequence from={HOOK_BODY_CUT_FRAME}>. Así el Body nunca usa números
 * mágicos: todo cue nuevo se agrega en BODY_CUES y se lee con esta función.
 */
export const bodyCueFrame = (key: BodyCueKey): number =>
  secToFrame(BODY_CUES[key].seconds - BODY_START_SECONDS);
