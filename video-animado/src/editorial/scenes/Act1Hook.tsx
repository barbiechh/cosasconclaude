import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Brain} from '../characters/Brain';
import {Person} from '../characters/Person';
import {Canvas, Ink, Label, mix, Paper, Piece, useDrift} from '../kit';
import {Arrow, Magnifier, RxBottle, StudyPage, Tumbler} from '../objects/Objects';
import {E, SERIF} from '../theme';
import {useScene} from '../useScene';

// 0.00 · "What works better for an ADHD brain? Alcohol or stimulants?"
export const EdQuestion: React.FC = () => {
  const {f, k, s} = useScene('Question');
  const {scale} = useDrift(1.04, 1);
  const room = k(7, 16, -6);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={540} y={mix(room, 1020, 820)} style={{opacity: Math.min(1, f / 10), scale: mix(room, 1.15, 0.78) * mix(s(0), 0.92, 1)}}>
        <Brain width={820} level={0.16} t={f} />
      </Piece>
      <Canvas>
        <Ink d="M680 700 L760 610" draw={k(5, 10)} width={3} />
      </Canvas>
      <Label text="ADHD brain" x={770} y={585} k={k(5, 12)} align="left" size={30} mono />

      <Canvas>
        <Ink d="M470 1000 C420 1100 330 1150 300 1220" draw={k(7, 16)} width={4} dash="2 14" />
        <Ink d="M610 1000 C660 1100 750 1150 790 1210" draw={k(9, 16)} width={4} dash="2 14" />
      </Canvas>
      <Piece x={300} y={mix(s(7), 1560, 1450)} cut style={{opacity: k(7, 10)}}>
        <Tumbler width={300} fill={k(7, 24, 4) * 0.7} t={f} />
      </Piece>
      <Label text="Alcohol" x={300} y={1720} k={k(7, 12, 6)} color={E.ochre} />
      <div style={{position: 'absolute', left: 545, top: 1450, translate: '-50% -50%', fontFamily: SERIF, fontStyle: 'italic', fontSize: 110, color: E.slate, opacity: k(8, 10)}}>or</div>
      <Piece x={790} y={mix(s(9), 1560, 1440)} cut style={{opacity: k(9, 10)}}>
        <RxBottle width={250} />
      </Piece>
      <Label text="Stimulants" x={790} y={1720} k={k(9, 12, 6)} color={E.brick} />
    </AbsoluteFill>
  );
};

// 4.80 · "Scientists actually ran the study, and the answer wasn't the one anyone wanted."
export const EdStudy: React.FC = () => {
  const {k, s, past} = useScene('Study');
  const {scale} = useDrift(1.03, 1);
  const mag = k(16, 22);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={640} y={mix(s(10), 980, 900)} cut style={{rotate: '-3deg', opacity: k(10, 12, -4)}}>
        <StudyPage width={560} draw={k(12, 40)} mark={k(14, 14)} winner={k(17, 10)} />
      </Piece>
      <Piece
        x={mix(mag, 520, 560)}
        y={mix(mag, 1260, 1240) - Math.sin(mag * Math.PI) * 60}
        style={{opacity: k(16, 8) * (1 - k(20, 10)), rotate: '-12deg'}}
      >
        <Magnifier width={240} />
      </Piece>
      <Piece x={290} y={mix(s(10, 4), 1900, 1580)}>
        <Person
          width={560}
          coat
          glasses
          hair="bun"
          shirt={E.blueDeep}
          expr={!past(17) ? 'focused' : !past(18) ? 'neutral' : !past(21) ? 'surprised' : 'sad'}
          lookX={past(17) ? 0.9 : 0.6}
          lookY={-0.6}
          tilt={past(18) ? -3 : 2}
        />
      </Piece>
    </AbsoluteFill>
  );
};

// 9.68 · "It was alcohol."
export const EdReveal: React.FC = () => {
  const {f, k, s} = useScene('Reveal');
  return (
    <AbsoluteFill style={{scale: mix(s(25, 0, 12), 1.06, 1)}}>
      <Paper />
      <Piece x={540} y={1040} cut style={{scale: mix(s(23, 0, 14), 0.8, 1), opacity: k(23, 8, -4)}}>
        <Tumbler width={520} fill={0.15 + k(24, 26) * 0.7} t={f} />
      </Piece>
      <Canvas>
        <Ink d="M540 640 C790 630 880 860 860 1080 C840 1330 600 1420 400 1360 C200 1290 180 1010 260 840 C320 720 420 650 560 650" draw={k(25, 18)} color={E.ochre} width={6} />
      </Canvas>
      <Label text="Alcohol" x={540} y={1530} k={k(25, 12)} color={E.ochre} size={40} />
    </AbsoluteFill>
  );
};

// 11.12 · "It sounds backwards, but once you understand why, it makes complete sense."
export const EdBackwards: React.FC = () => {
  const {f, k, s, past} = useScene('Backwards');
  const {scale} = useDrift(1.03, 1);
  const flip = k(28, 14) - k(32, 16);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={250} y={840} cut style={{opacity: k(26, 12, -4)}}>
        <Tumbler width={220} fill={0.7} t={f} />
      </Piece>
      <Piece x={545} y={840} style={{rotate: `${flip * 180}deg`, opacity: k(26, 12)}}>
        <Arrow width={200} color={past(36) ? E.blueDeep : E.ink} />
      </Piece>
      <Piece x={810} y={840} style={{opacity: k(26, 12, 2)}}>
        <Brain width={360} level={mix(k(32, 30), 0.15, 0.6)} t={f} />
      </Piece>
      <Label text="?" x={545} y={720} k={k(28, 8) * (1 - k(32, 8))} size={60} color={E.ochre} />
      <Canvas>
        <Ink d="M650 700 C700 640 940 640 980 760 C1010 880 920 980 800 990 C680 990 620 900 640 790" draw={k(32, 18)} color={E.blueDeep} width={4} dash="2 12" />
      </Canvas>
      <Piece x={540} y={mix(s(26, 2), 1950, 1590)}>
        <Person width={560} expr={!past(28) ? 'neutral' : !past(32) ? 'irritated' : !past(36) ? 'focused' : 'calm'} lookX={past(32) && !past(36) ? 0.6 : 0} lookY={-0.7} tilt={past(28) && !past(32) ? 5 : 0} />
      </Piece>
      <Canvas>
        <Ink d="M820 1240 L870 1290 L960 1180" draw={k(36, 12)} color={E.blueDeep} width={10} />
      </Canvas>
    </AbsoluteFill>
  );
};
