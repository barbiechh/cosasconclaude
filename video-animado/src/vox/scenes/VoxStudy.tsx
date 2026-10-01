import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {clamp, pop, ramp} from '../../components/anim';
import {PathParticles} from '../../components/PathParticles';
import {cue} from '../../data/timeline';
import {PaperDoll} from '../characters/PaperDoll';
import {Envelope, Magnifier, StudyDoc} from '../objects/PaperProps';
import {boil, Cutout, Marker, PaperBackground, Tape, useStepFrame, V} from '../style';

// 4.57–9.67 s · "Scientists actually ran the study, and the answer wasn't the one anyone wanted."
const T = {
  scientists: cue(4.71, 'study'),
  ran: cue(5.83, 'study'),
  study: cue(6.39, 'study'),
  and: cue(6.95, 'study'),
  answer: cue(7.35, 'study'),
  wasnt: cue(7.83, 'study'),
  anyone: cue(8.71, 'study'),
  wanted: cue(9.11, 'study'),
};

// Los datos de la gráfica viajan hasta el sobre del resultado.
const DATA_PATH = 'M770 1060 C900 1120 960 1220 900 1330 C870 1380 820 1400 800 1430';
const QMARK = 'M760 1440 C760 1400 830 1400 830 1440 C830 1474 796 1474 796 1508 M796 1540 L797 1546';

export const VoxStudy: React.FC = () => {
  const frame = useStepFrame(2);
  const {fps} = useVideoConfig();

  const docK = pop(frame, 0, fps, 12);
  const sciK = pop(frame, T.scientists, fps, 11);
  const magK = ramp(frame, [T.ran, T.and]);
  const envK = pop(frame, T.answer, fps, 11);
  const shock = frame >= T.wasnt;

  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, 16, T.wasnt, T.wasnt + 10], [1.05, 1, 1, 1.05], clamp),
        transformOrigin: '300px 1400px',
      }}
    >
      <PaperBackground />

      {/* El estudio */}
      <Cutout
        x={560}
        y={interpolate(docK, [0, 1], [-500, 980])}
        seed="doc"
        frame={frame}
        sticker={false}
        style={{rotate: `${interpolate(docK, [0, 1], [-20, -4])}deg`}}
      >
        <StudyDoc width={600} chart={ramp(frame, [T.ran, T.study + 8])} highlight={ramp(frame, [T.study, T.and + 6])} />
      </Cutout>
      {docK > 0.9 ? <Tape x={330} y={600} rot={-28} /> : null}
      {docK > 0.9 ? <Tape x={800} y={575} rot={22} /> : null}

      {/* Lupa que recorre la hoja */}
      <Cutout
        x={interpolate(magK, [0, 1], [380, 700])}
        y={interpolate(magK, [0, 1], [820, 1120]) + Math.sin(magK * Math.PI * 3) * 30}
        seed="mag"
        frame={frame}
        sticker={false}
        style={{opacity: frame >= T.ran && frame < T.answer + 4 ? 1 : 0, rotate: '-10deg'}}
      >
        <Magnifier width={260} />
      </Cutout>

      {/* Datos -> sobre del resultado */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d={DATA_PATH} fill="none" stroke={V.ink} strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" opacity={frame >= T.and ? 0.6 : 0} />
        <PathParticles d={DATA_PATH} start={T.and} stop={T.wasnt} count={12} speed={20} gap={3} size={11} color={V.navy} glow={null} shine={false} />
      </svg>
      <Cutout
        x={interpolate(envK, [0, 1], [1300, 790])}
        y={1500}
        seed="env"
        frame={frame}
        style={{rotate: `${interpolate(envK, [0, 1], [30, 6]) + (shock ? boil(frame, 'envshake', 4, 2) : 0)}deg`}}
      >
        <Envelope width={360} />
      </Cutout>
      <Marker d={QMARK} draw={ramp(frame, [T.answer + 6, T.answer + 16])} width={15} />

      {/* Científica/o en primer plano */}
      <Cutout
        x={240 + (shock ? -20 : 0)}
        y={interpolate(sciK, [0, 1], [2400, 1560])}
        seed="sci"
        frame={frame}
        style={{rotate: `${shock ? -6 : 0}deg`, transformOrigin: '50% 100%'}}
      >
        <PaperDoll
          width={540}
          coat
          glasses
          lookX={frame < T.answer ? 0.8 : shock && frame >= T.anyone ? (Math.floor(frame / 4) % 2 ? 0.8 : -0.4) : 0.9}
          lookY={frame < T.answer ? -0.7 : 0.4}
          blink={frame >= T.study && frame < T.study + 4 ? 1 : 0}
          browY={shock ? -22 : 0}
          browTilt={shock ? 14 : 0}
          mouth={frame < T.answer ? 'smile' : !shock ? 'o' : frame < T.wanted ? 'wow' : 'frown'}
          armR={frame < T.ran ? interpolate(frame, [T.scientists + 4, T.scientists + 10], [0, -130], clamp) + (Math.floor(frame / 4) % 2 ? 12 : -12) : shock ? -40 : -105}
          armL={shock ? 30 : 0}
          sweat={shock ? 1 : 0}
        />
      </Cutout>

      {/* "...anyone wanted": dos personas más reaccionan desde abajo */}
      {[
        {x: 700, d: 0, shirt: V.navy, skin: '#c98b62'},
        {x: 950, d: 4, shirt: V.yellow, skin: '#f0c49e'},
      ].map((p, i) => {
        const k = pop(frame, T.anyone + p.d, fps, 10);
        return (
          <Cutout key={i} x={p.x} y={interpolate(k, [0, 1], [2300, 1920])} seed={`by${i}`} frame={frame}>
            <PaperDoll
              width={300}
              shirt={p.shirt}
              skin={p.skin}
              lookX={Math.floor(frame / 4 + i) % 2 ? 0.7 : -0.7}
              browTilt={10}
              browY={-6}
              mouth="frown"
            />
          </Cutout>
        );
      })}
    </AbsoluteFill>
  );
};
