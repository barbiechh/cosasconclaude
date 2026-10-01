import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Brain} from '../characters/Brain';
import {Person} from '../characters/Person';
import {Canvas, Ink, Label, mix, Paper, Piece, useDrift} from '../kit';
import {Breakfast, Capsule, CapsuleArt, Coffee, Donut, Molecule, Phone, Product, Rhodiola, Seal, TeaLeaf, Tile, Tumbler} from '../objects/Objects';
import {Tank} from '../objects/Tank';
import {PathParticles} from '../../components/PathParticles';
import {E, SANS, SERIF} from '../theme';
import {useScene} from '../useScene';

// Halo azul detrás del producto.
const Halo: React.FC<{x: number; y: number; size: number; o: number}> = ({x, y, size, o}) => (
  <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', background: `radial-gradient(circle, ${E.blue} 0%, transparent 62%)`, opacity: o}} />
);

// 140.49 · "So a small team set out to build the first all natural formula that doesn't flood your dopamine or shove around what's already there like the rest,"
export const EdTeam: React.FC = () => {
  const {f, k, s, a} = useScene('Team');
  const {scale} = useDrift(1.03, 1);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      {[
        {x: 250, hair: 'short' as const, shirt: E.blueDeep, skin: E.skin, d: 0},
        {x: 540, hair: 'bun' as const, shirt: E.slate, skin: '#c99272', d: 3},
        {x: 830, hair: 'long' as const, shirt: E.blue, skin: '#e8bea0', d: 6},
      ].map((p) => (
        <Piece key={p.x} x={p.x} y={mix(s(421, p.d), 1000, 860)} style={{opacity: k(421, 10, p.d)}}>
          <Person width={280} coat glasses={p.x === 540} hair={p.hair} hairColor={p.x === 830 ? '#5a3b2e' : E.hair} shirt={p.shirt} skin={p.skin} expr="focused" lookY={0.6} />
        </Piece>
      ))}
      <Canvas>
        <PathParticles d="M200 1120 C300 1200 420 1240 520 1260" start={a(429)} count={8} gap={4} speed={10} size={10} color={E.sage} glow={null} shine={false} />
        <PathParticles d="M880 1120 C780 1200 660 1240 560 1260" start={a(430)} count={8} gap={4} speed={10} size={10} color={E.sage} glow={null} shine={false} />
      </Canvas>
      <Piece x={200} y={1100} style={{opacity: k(429, 10), scale: 0.55}}>
        <TeaLeaf width={260} />
      </Piece>
      <Piece x={880} y={1090} style={{opacity: k(430, 10), scale: 0.5}}>
        <Rhodiola width={260} />
      </Piece>
      <Piece x={540} y={1270} cut style={{opacity: k(431, 12), scale: mix(s(431), 0.6, 1)}}>
        <CapsuleArt width={300} color={E.blueDeep} rot={-20} />
      </Piece>
      <Label text="All-natural formula" x={540} y={1420} k={k(431, 12, 6)} mono size={28} color={E.blueDeep} />
      {[
        {x: 300, word: 434, label: 'Flood', el: <Tank width={150} level={0.95} t={f} flood={1} label="" />},
        {x: 780, word: 438, label: 'Shove', el: <Tank width={150} level={0.3} t={f} shove={1} label="" />},
      ].map((c) => (
        <React.Fragment key={c.x}>
          <Piece x={c.x} y={1660} style={{opacity: k(c.word, 10) * 0.75}}>
            {c.el}
          </Piece>
          <Label text={c.label} x={c.x} y={1830} k={k(c.word, 10)} mono size={24} color={E.brick} />
          <Canvas>
            <Ink d={`M${c.x - 110} 1560 L${c.x + 110} 1780 M${c.x + 110} 1560 L${c.x - 110} 1780`} draw={k(c.word, 12, 6)} color={E.brick} width={8} />
          </Canvas>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

// 148.52 · "but actually helps your brain make more of its own and hold it steady, with no crash and nothing to come down from."
export const EdSteady: React.FC = () => {
  const {f, k, a} = useScene('Steady');
  const {scale} = useDrift(1.03, 1);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={540} y={820}>
        <Brain width={660} level={mix(k(451, 50), 0.2, 0.68)} t={f} />
      </Piece>
      <Canvas>
        {[0, 1, 2, 3].map((i) => (
          <PathParticles key={i} d={`M${380 + i * 90} 1010 C${400 + i * 80} 940 ${420 + i * 70} 880 ${430 + i * 60} 820`} start={a(451) + i * 4} count={8} gap={9} speed={6} size={8} color={E.cream} glow={null} shine={false} />
        ))}
        <path d="M120 1240 L120 1680 L960 1680" fill="none" stroke={E.ink} strokeWidth={4} opacity={k(457, 10)} />
        <path d="M150 1420 C300 1420 340 1240 420 1240 C500 1240 520 1640 620 1640 C700 1640 760 1420 960 1420" fill="none" stroke={E.brick} strokeWidth={4} strokeDasharray="8 12" opacity={k(461, 10) * (1 - k(464, 30)) * 0.8} />
        <Ink d="M150 1420 L960 1420" draw={k(457, 30)} color={E.blueDeep} width={9} />
      </Canvas>
      <Label text="Steady" x={960} y={1380} k={k(459, 12)} align="right" mono size={28} color={E.blueDeep} />
      <Label text="No crash · no comedown" x={540} y={1760} k={k(462, 12)} mono size={26} color={E.slate} />
    </AbsoluteFill>
  );
};

// 155.23 · "They started with tyrosine, the raw material dopamine is built from, added the vitamin B6 your brain uses to turn it into dopamine."
export const EdIngredients: React.FC = () => {
  const {k, s} = useScene('Ingredients');
  const morph = k(488, 20);
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={540} y={780}>
        <Molecule width={820} morph={morph} draw={k(470, 26)} color={morph > 0.5 ? E.blueDeep : E.sageDeep} />
      </Piece>
      <Label text="Tyrosine" x={540} y={1040} k={k(472, 12) * (1 - morph)} mono size={32} color={E.sageDeep} />
      <Label text="Dopamine" x={540} y={1040} k={morph} mono size={32} color={E.blueDeep} />
      <Piece x={540} y={mix(s(482), 1550, 1430)} cut style={{opacity: k(482, 10)}}>
        <Tile width={250} symbol="B6" name="VITAMIN" />
      </Piece>
      <Canvas>
        <Ink d="M540 1260 L540 1110 M505 1150 L540 1106 L575 1150" draw={k(486, 14)} color={E.sageDeep} width={8} />
      </Canvas>
      <Label text="Converts it" x={760} y={1190} k={k(486, 12)} align="left" mono size={24} color={E.slate} />
    </AbsoluteFill>
  );
};

// 163.33 · "And rhodiola and theanine to keep you calm instead of wired."
export const EdCalm: React.FC = () => {
  const {k, s} = useScene('Calm');
  const calm = k(499, 18);
  let d = 'M100 1500';
  for (let x = 100; x <= 980; x += 20) {
    const zig = ((x / 20) % 2 ? -1 : 1) * 70;
    const wave = Math.sin((x - 100) / 70) * 50;
    d += ` L${x} ${1500 + mix(calm, zig, wave)}`;
  }
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={300} y={mix(s(493), 920, 860)} cut style={{opacity: k(493, 10)}}>
        <Rhodiola width={320} />
      </Piece>
      <Label text="Rhodiola" x={300} y={1120} k={k(493, 12, 4)} mono size={28} color={E.sageDeep} />
      <Piece x={780} y={mix(s(495), 900, 840)} cut style={{opacity: k(495, 10)}}>
        <TeaLeaf width={300} />
      </Piece>
      <Label text="L-Theanine" x={780} y={1120} k={k(495, 12, 4)} mono size={28} color={E.sageDeep} />
      <Canvas>
        <path d={d} fill="none" stroke={calm > 0.5 ? E.blueDeep : E.brick} strokeWidth={8} strokeLinejoin="round" opacity={k(497, 10)} />
      </Canvas>
      <Label text="Wired" x={110} y={1660} k={k(497, 10) * (1 - calm)} align="left" mono size={28} color={E.brick} />
      <Label text="Calm" x={110} y={1660} k={calm} align="left" mono size={28} color={E.blueDeep} />
    </AbsoluteFill>
  );
};

// 167.33 · "They called it control because when your brain finally has what it runs on,"
export const EdControl: React.FC = () => {
  const {f, k, s} = useScene('Control');
  return (
    <AbsoluteFill>
      <Paper dark />
      <Halo x={540} y={1180} size={1300} o={0.45 * k(503, 30)} />
      <Piece x={540} y={mix(s(504, 0, 20), 1300, 1180)} soft style={{opacity: k(503, 16), scale: mix(k(503, 200), 0.96, 1.02)}}>
        <Product width={480} />
      </Piece>
      <Piece x={880} y={1650} style={{opacity: k(511, 14)}}>
        <Brain width={240} level={mix(k(511, 30), 0.3, 0.9)} t={f} />
      </Piece>
    </AbsoluteFill>
  );
};

// 171.73 · "the control comes back over the drink, over the cravings, over the impulses that used to run your evenings."
export const EdControlBack: React.FC = () => {
  const {f, k, s} = useScene('ControlBack');
  const rows = [
    {y: 800, word: 523, el: <Tumbler width={170} fill={0.7} t={f} dark />, label: 'The drink'},
    {y: 1180, word: 526, el: <Donut width={160} />, label: 'The cravings'},
    {y: 1560, word: 529, el: <Phone width={110} scroll={f * 3} />, label: 'The impulses'},
  ];
  return (
    <AbsoluteFill>
      <Paper dark />
      <Halo x={300} y={1180} size={900} o={0.35} />
      <Piece x={300} y={1180} soft>
        <Product width={360} />
      </Piece>
      {rows.map((r) => (
        <React.Fragment key={r.y}>
          <Canvas>
            <Ink d={`M480 ${1180 + (r.y - 1180) * 0.3} C560 ${r.y} 620 ${r.y} 660 ${r.y}`} draw={k(r.word, 14)} color={E.blue} width={4} />
            <circle cx={800} cy={r.y} r={130} fill="none" stroke={E.blue} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(r.word, 16, 4)} />
          </Canvas>
          <Piece x={800} y={r.y} style={{opacity: k(r.word, 10), scale: mix(s(r.word), 0.8, 1), filter: `saturate(${1 - k(r.word, 20, 10) * 0.7})`}}>
            {r.el}
          </Piece>
          <Label text={r.label} x={800} y={r.y + 170} k={k(r.word, 12, 4)} mono size={24} color={E.mist} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

// 179.21 · "Two capsules with breakfast. That's the whole thing."
export const EdRoutine: React.FC = () => {
  const {f, k, s} = useScene('Routine');
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={260} y={1000} soft style={{opacity: k(536, 12, -4)}}>
        <Product width={300} />
      </Piece>
      <Piece x={680} y={1500} cut style={{opacity: k(538, 12)}}>
        <Breakfast width={600} />
      </Piece>
      <Piece x={880} y={1180} cut style={{opacity: k(538, 12, 4)}}>
        <Coffee width={200} t={f} />
      </Piece>
      <Canvas>
        <g opacity={k(536, 8)}>
          <Capsule x={640} y={mix(s(536, 0, 12), 700, 1300)} rot={-30 + f * 0.2} size={1.3} color={E.blueDeep} />
          <Capsule x={740} y={mix(s(537, 2, 12), 700, 1330)} rot={20 - f * 0.2} size={1.3} color={E.blueDeep} />
        </g>
      </Canvas>
      <Label text="2 capsules · with breakfast" x={540} y={1790} k={k(538, 12)} mono size={30} color={E.blueDeep} />
    </AbsoluteFill>
  );
};

// 182.25 · "It comes with a thirty-day guarantee. Try it, and if your brain doesn't feel like your own again, you pay nothing."
export const EdGuarantee: React.FC = () => {
  const {f, k, s} = useScene('Guarantee');
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={540} y={900} soft style={{scale: mix(s(548, 0, 12), 1.4, 1), opacity: k(548, 8)}}>
        <Seal width={500} t={f} />
      </Piece>
      <Piece x={540} y={1430} style={{opacity: k(554, 12)}}>
        <Brain width={420} level={mix(k(555, 30), 0.3, 0.8)} t={f} />
      </Piece>
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1720,
          translate: '-50% -50%',
          fontFamily: SERIF,
          fontSize: 140,
          color: E.blueDeep,
          opacity: k(562, 12),
          scale: mix(s(562), 0.85, 1),
        }}
      >
        $0
      </div>
    </AbsoluteFill>
  );
};

// 188.90 · "But once it does, you'll never want to go back."
export const EdOutro: React.FC = () => {
  const {k, s} = useScene('Outro');
  return (
    <AbsoluteFill>
      <Paper dark />
      <Halo x={540} y={1100} size={1300} o={0.5} />
      <Piece x={540} y={mix(s(565, 0, 20), 1180, 1080)} soft style={{opacity: k(565, 14, -4)}}>
        <Product width={470} />
      </Piece>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1680,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 10,
          color: E.cream,
          opacity: k(569, 16),
        }}
      >
        YOUR BRAIN · YOUR RULES
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1740, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 40, color: E.blue, opacity: k(571, 16)}}>
        The daily dopamine reset
      </div>
    </AbsoluteFill>
  );
};
