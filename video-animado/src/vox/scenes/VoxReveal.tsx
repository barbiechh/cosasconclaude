import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {pop, ramp} from '../../components/anim';
import {cue} from '../../data/timeline';
import {PaperBrain} from '../characters/PaperBrain';
import {Envelope, PaperGlass} from '../objects/PaperProps';
import {Cutout, Marker, markerLoop, PaperBackground, useStepFrame, V} from '../style';

// 9.67–10.99 s · "It was alcohol."
const T = {
  it: cue(9.67, 'reveal'),
  alcohol: cue(10.16, 'reveal'),
};

const ARROW_L = 'M150 640 C200 720 230 760 300 800 M300 800 L240 796 M300 800 L282 744';
const ARROW_R = 'M940 1240 C880 1200 860 1160 800 1100 M800 1100 L812 1160 M800 1100 L858 1112';

export const VoxReveal: React.FC = () => {
  const frame = useStepFrame(2);
  const {fps} = useVideoConfig();
  const envOpen = ramp(frame, [T.it, T.it + 6]);
  const glassK = pop(frame, T.it + 4, fps, 10);
  const impact = pop(frame, T.alcohol, fps, 8);

  return (
    <AbsoluteFill style={{scale: interpolate(impact, [0, 1], [1.08, 1])}}>
      <PaperBackground color={V.yellow} grid={false} />

      {/* Rayos de semitono */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.25 + impact * 0.35}}>
        <g transform={`translate(540 1000) rotate(${Math.floor(frame / 4) * 3})`}>
          {Array.from({length: 16}, (_, i) => (
            <path key={i} d="M0 0 L-90 -1300 L90 -1300 Z" fill="#f0a800" transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
      </svg>

      <Cutout x={540} y={1180 + envOpen * 260} seed="env3" frame={frame} style={{rotate: '6deg', opacity: 1 - ramp(frame, [T.it + 6, T.it + 10])}}>
        <Envelope width={360} open={envOpen} />
      </Cutout>

      {/* El vaso sale del sobre y se llena */}
      <Cutout
        x={540}
        y={interpolate(glassK, [0, 1], [1300, 990])}
        seed="glass3"
        frame={frame}
        style={{scale: interpolate(glassK, [0, 1], [0.3, 1]), rotate: `${interpolate(glassK, [0, 1], [-25, -3])}deg`}}
      >
        <PaperGlass width={480} fill={ramp(frame, [T.it + 6, T.alcohol + 16], [0.1, 0.85])} t={frame} />
      </Cutout>

      <Marker d={markerLoop(545, 990, 330, 380)} draw={ramp(frame, [T.alcohol, T.alcohol + 14])} width={16} />
      <Marker d={ARROW_L} draw={ramp(frame, [T.alcohol + 6, T.alcohol + 14])} width={13} color={V.ink} />
      <Marker d={ARROW_R} draw={ramp(frame, [T.alcohol + 10, T.alcohol + 18])} width={13} color={V.ink} />

      {/* El cerebro, sorprendido, abajo */}
      <Cutout x={540} y={interpolate(pop(frame, -6, fps, 10), [0, 1], [2300, 1700])} seed="brain3" frame={frame} jitter={2}>
        <PaperBrain
          width={640}
          lookY={-1}
          browY={frame >= T.alcohol ? -20 : -8}
          browTilt={frame >= T.alcohol ? 0 : 10}
          mouth={frame < T.alcohol ? 'o' : frame < T.alcohol + 10 ? 'wow' : 'grin'}
        />
      </Cutout>
    </AbsoluteFill>
  );
};
