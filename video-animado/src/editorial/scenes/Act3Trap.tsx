import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Person} from '../characters/Person';
import {Canvas, Ink, Label, mix, Paper, Piece, useDrift} from '../kit';
import {CapsuleArt, RxBottle, Sun, Tumbler} from '../objects/Objects';
import {Tank} from '../objects/Tank';
import {E, SERIF} from '../theme';
import {useScene} from '../useScene';

// 79.12 · "A stimulant like Adderall or Vyvanse doesn't add any dopamine at all. It just grabs the little you have and shoves it to the front."
export const EdStimulant: React.FC = () => {
  const {f, k, s} = useScene('Stimulant');
  const {scale} = useDrift(1.03, 1);
  const push = k(238, 40);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={mix(s(225), 1200, 760)} y={700} cut style={{rotate: `${-25 + f * 0.1}deg`, opacity: k(225, 10)}}>
        <CapsuleArt width={300} />
      </Piece>
      <Label text="Stimulant" x={760} y={860} k={k(225, 12, 4)} mono size={28} color={E.brick} />
      <Piece x={540} y={1280} style={{opacity: k(224, 12, -4)}}>
        <Tank width={400} level={0.24} t={f} shove={push} />
      </Piece>
      {/* "+ dopamina" tachado */}
      <div style={{position: 'absolute', left: 230, top: 700, translate: '-50% -50%', fontFamily: SERIF, fontSize: 150, color: E.blueDeep, opacity: k(231, 10)}}>+</div>
      <Canvas>
        <Ink d="M160 780 L300 620" draw={k(234, 10)} color={E.brick} width={10} />
        <Ink d="M800 1560 L300 1560 M350 1520 L296 1560 L350 1600" draw={k(244, 18)} color={E.brick} width={8} />
      </Canvas>
      <Label text="No new dopamine" x={230} y={880} k={k(233, 12)} mono size={26} color={E.brick} />
      <Label text="Pushed to the front" x={540} y={1650} k={k(246, 12)} mono size={28} color={E.brick} />
    </AbsoluteFill>
  );
};

// 86.63 · "Sharp for the morning, then it wears off, the tank runs dry, and by the afternoon you're right back where you started."
export const EdAfternoon: React.FC = () => {
  const {f, k, past} = useScene('Afternoon');
  const day = k(249, 20) * 0.3 + k(255, 20) * 0.3 + k(264, 24) * 0.4;
  const sunX = mix(day, 170, 910);
  const sunY = 760 - Math.sin(day * Math.PI) * 220;
  return (
    <AbsoluteFill>
      <Paper />
      <Canvas>
        <path d="M120 780 Q540 320 960 780" fill="none" stroke={E.mist} strokeWidth={3} strokeDasharray="6 14" />
      </Canvas>
      <Piece x={sunX} y={sunY}>
        <Sun width={130} t={f} />
      </Piece>
      <Label text="Morning" x={170} y={830} k={k(249, 12)} mono size={24} />
      <Label text="Afternoon" x={910} y={830} k={k(263, 12)} mono size={24} />
      <Piece x={540} y={1060} style={{opacity: k(249, 10, -4)}}>
        <Tank width={300} level={mix(k(257, 26), 0.24, 0.02)} t={f} shove={1 - k(254, 20)} drip={past(257)} />
      </Piece>
      <Piece x={540} y={1640} style={{opacity: k(249, 10, -4)}}>
        <Person width={500} shirt={E.blue} expr={!past(253) ? 'focused' : !past(266) ? 'neutral' : 'tired'} tilt={past(266) ? -5 : 0} />
      </Piece>
    </AbsoluteFill>
  );
};

// 93.00 · "And that's the trap with both of them. Neither one ever adds any dopamine back. One floods the tank."
export const EdTrap: React.FC = () => {
  const {f, k, s} = useScene('Trap');
  const flood = k(287, 22);
  return (
    <AbsoluteFill>
      <Paper />
      <Canvas>
        <Ink d="M540 600 C860 600 940 760 940 860 C940 1000 820 1110 540 1110 C260 1110 140 1000 140 860 C140 720 260 600 520 600" draw={k(274, 24)} color={E.brick} width={5} />
        <Ink d="M500 570 L540 600 L500 632" draw={k(274, 10, 20)} color={E.brick} width={5} />
      </Canvas>
      <Label text="The loop" x={540} y={1150} k={k(274, 12, 10)} mono size={26} color={E.brick} />
      <Piece x={330} y={mix(s(276), 900, 860)} cut style={{opacity: k(272, 10), rotate: `${-flood * 24}deg`}}>
        <Tumbler width={230} fill={0.75 - flood * 0.4} t={f} />
      </Piece>
      <Piece x={760} y={mix(s(276, 3), 900, 860)} cut style={{opacity: k(272, 10, 3)}}>
        <RxBottle width={190} />
      </Piece>
      <Label text="+0" x={330} y={1030} k={k(282, 10)} color={E.brick} size={44} />
      <Label text="+0" x={760} y={1030} k={k(283, 10)} color={E.brick} size={44} />
      <Canvas>
        {flood > 0 ? <path d={`M380 960 C440 1080 520 1200 540 ${mix(flood, 1280, 1420)}`} fill="none" stroke={E.ochre} strokeWidth={16} strokeLinecap="round" /> : null}
      </Canvas>
      <Piece x={540} y={mix(s(286), 1700, 1560)} style={{opacity: k(286, 10)}}>
        <Tank width={300} level={mix(flood, 0.12, 1.0)} t={f} flood={flood} />
      </Piece>
    </AbsoluteFill>
  );
};

// 99.16 · "The other just shoves it around, and either way, it keeps draining. Because the real problem was never which one you pick."
export const EdDraining: React.FC = () => {
  const {f, k, past} = useScene('Draining');
  const drain = k(300, 50);
  const flipA = k(307, 12);
  const flipB = k(307, 12, 4);
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={300} y={1000}>
        <Tank width={300} level={mix(drain, 0.95, 0.06)} t={f} drip={past(299)} flood={0.3 * (1 - drain)} />
      </Piece>
      <Piece x={780} y={1000}>
        <Tank width={300} level={mix(drain, 0.25, 0.04)} t={f} shove={0.5 + 0.5 * Math.sin(f * 0.18)} drip={past(299)} />
      </Piece>
      <Label text="Keeps draining" x={540} y={1390} k={k(300, 12)} mono size={28} color={E.brick} />
      <Piece x={300} y={1620} cut style={{scale: `${1 - flipA} 1`, opacity: 1 - flipA * 0.2}}>
        <Tumbler width={170} fill={0.7} t={f} />
      </Piece>
      <Piece x={780} y={1620} cut style={{scale: `${1 - flipB} 1`, opacity: 1 - flipB * 0.2}}>
        <RxBottle width={140} />
      </Piece>
      <div style={{position: 'absolute', left: 540, top: 1620, translate: '-50% -50%', fontFamily: SERIF, fontStyle: 'italic', fontSize: 90, color: E.slate, opacity: k(302, 10) * (1 - flipA)}}>or</div>
    </AbsoluteFill>
  );
};
