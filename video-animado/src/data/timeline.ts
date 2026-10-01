// Tiempos de escena derivados de los timestamps de palabra (transcript.ts).
export const FPS = 30;

// Segundos del audio -> frame absoluto.
export const sec = (s: number) => Math.round(s * FPS);

// Cortes en las pausas naturales del voiceover.
export const SCENES = {
  question: {from: 0, duration: sec(4.57)}, // "What works better... Alcohol or stimulants?"
  study: {from: sec(4.57), duration: sec(9.67) - sec(4.57)}, // "Scientists actually ran the study..."
  reveal: {from: sec(9.67), duration: sec(10.99) - sec(9.67)}, // "It was alcohol."
  backwards: {from: sec(10.99), duration: sec(15.8) - sec(10.99)}, // "It sounds backwards..."
} as const;

export const PREVIEW_DURATION = sec(15.8);

// Frame local dentro de una escena para un instante del audio.
export const cue = (s: number, scene: keyof typeof SCENES) =>
  sec(s) - SCENES[scene].from;
