import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {TornPaper} from './paper';
import {K} from './theme';

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Dos hojas rasgadas se cierran sobre la escena (0..close) y se abren revelando la siguiente.
export const PaperCloseOpen: React.FC<{readonly close?: number; readonly total?: number; readonly color?: string}> = ({close = 9, total = 22, color = K.paper}) => {
  const f = useCurrentFrame();
  const k = f < close ? interpolate(f, [0, close], [0, 1], {...cl, easing: (t) => 1 - Math.pow(1 - t, 3)}) : interpolate(f, [close + 1, total], [1, 0], {...cl, easing: (t) => t * t});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: -60, top: interpolate(k, [0, 1], [-1100, -40])}}>
        <TornPaper w={1200} h={1040} color={color} seed="tr-top" rough={[4, 4, 26, 4]} />
      </div>
      <div style={{position: 'absolute', left: -60, top: interpolate(k, [0, 1], [1960, 940])}}>
        <TornPaper w={1200} h={1040} color={color} seed="tr-bot" rough={[26, 4, 4, 4]} />
      </div>
    </AbsoluteFill>
  );
};

// Una hoja sube y barre toda la pantalla; el corte de escena ocurre cuando cubre (frame `cover`).
export const PaperWipe: React.FC<{readonly cover?: number; readonly total?: number; readonly color?: string}> = ({cover = 10, total = 20, color = K.paper}) => {
  const f = useCurrentFrame();
  const ty = f <= cover ? interpolate(f, [0, cover - 1], [1960, -190], {...cl, easing: (t) => 1 - Math.pow(1 - t, 3)}) : interpolate(f, [cover + 1, total], [-190, -2500], {...cl, easing: (t) => t * t});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: -60, top: ty, rotate: '-2deg'}}>
        <TornPaper w={1200} h={2300} color={color} seed="tr-wipe" rough={[24, 4, 24, 4]} />
      </div>
    </AbsoluteFill>
  );
};
