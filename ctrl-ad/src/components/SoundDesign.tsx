import React from 'react';
import {Audio, Sequence, interpolate, staticFile} from 'remotion';
import {PADS, SFX} from '../data/sfx';

/** Efectos sincronizados con eventos visuales + dos fondos muy bajos (src/data/sfx.ts). */
export const SoundDesign: React.FC = () => (
  <>
    {SFX.map((c, i) => (
      <Sequence key={i} from={Math.max(0, c.at)} durationInFrames={90} name={`sfx ${c.sfx}`}>
        <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={c.volume} />
      </Sequence>
    ))}
    {PADS.map((pad) => {
      const len = pad.to - pad.from;
      return (
        <Sequence key={pad.src} from={pad.from} durationInFrames={len} name={pad.src}>
          <Audio src={staticFile(`sfx/${pad.src}.wav`)} loop
            volume={(f) => pad.volume * interpolate(f, [0, 30, len - 30, len], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
        </Sequence>
      );
    })}
  </>
);
