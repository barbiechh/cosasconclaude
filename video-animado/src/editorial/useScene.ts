import {useCurrentFrame, useVideoConfig} from 'remotion';
import {prog, settle} from './kit';
import {at, SceneId, sceneOf} from './timeline';

// Utilidades de tiempo de una escena: todo se ancla a palabras del voiceover.
export const useScene = (id: SceneId) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = (i: number) => at(id, i);
  return {
    f,
    fps,
    dur: sceneOf(id).duration,
    a,
    // progreso suave que empieza en la palabra i (+ desfase), dura d frames
    k: (i: number, d = 14, off = 0) => prog(f, a(i) + off, a(i) + off + d),
    // entrada con leve rebote en la palabra i
    s: (i: number, off = 0, damping = 16) => settle(f, a(i) + off, fps, damping),
    // ¿ya sonó la palabra i?
    past: (i: number, off = 0) => f >= a(i) + off,
  };
};
