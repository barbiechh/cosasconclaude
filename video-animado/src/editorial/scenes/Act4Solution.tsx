import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Brain} from '../characters/Brain';
import {Person} from '../characters/Person';
import {Canvas, Ink, Label, mix, mixHex, Paper, Piece, useDrift} from '../kit';
import {Clock, Donut, Molecule, Moon, Phone, Sun, Tumbler} from '../objects/Objects';
import {Tank} from '../objects/Tank';
import {PathParticles} from '../../components/PathParticles';
import {E, MONO, SANS} from '../theme';
import {useScene} from '../useScene';

// 105.94 · "It's that your brain can't store dopamine at all. It has to build it fresh, every single day, from one raw material."
export const EdNoStorage: React.FC = () => {
  const {f, k, a, past} = useScene('NoStorage');
  const {scale} = useDrift(1.03, 1);
  const belt = past(324) ? (f - a(324)) * 4 : 0;
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={470} y={780} style={{opacity: k(312, 10, -4)}}>
        <Brain width={600} level={0.12} t={f} />
      </Piece>
      {/* "almacén" vacío y tachado */}
      <div
        style={{
          position: 'absolute',
          left: 880,
          top: 1040,
          translate: '-50% -50%',
          width: 230,
          height: 190,
          border: `5px dashed ${E.slate}`,
          borderRadius: 14,
          opacity: k(316, 10),
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 14,
          boxSizing: 'border-box',
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 3,
          color: E.slate,
        }}
      >
        STORAGE
      </div>
      <Canvas>
        <Ink d="M780 960 L980 1120" draw={k(317, 10)} color={E.brick} width={8} />
        <Ink d="M640 860 C760 880 840 920 870 940" draw={k(316, 10)} width={3} dash="2 12" />
        {/* cinta transportadora de días */}
        <path d="M60 1420 L1020 1420" stroke={E.ink} strokeWidth={6} opacity={k(324, 10)} />
        <PathParticles d="M460 980 C460 1100 440 1260 440 1380" start={a(324)} count={30} gap={8} speed={8} size={10} color={E.blue} glow={null} shine={false} />
        {/* materia prima -> cerebro */}
        <PathParticles d="M230 1640 C180 1400 240 1100 360 960" start={a(331)} count={20} gap={5} speed={12} size={10} color={E.sage} glow={null} shine={false} />
      </Canvas>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = ((i * 240 - belt) % 1200 + 1200) % 1200 - 60;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: 1330,
              width: 150,
              height: 80,
              translate: '-50% -50%',
              background: E.cream,
              filter: 'url(#ed-cut)',
              opacity: k(324, 10),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 4,
              color: E.ink,
            }}
          >
            DAY
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 230,
          top: 1700,
          translate: '-50% -50%',
          width: 230,
          height: 200,
          background: E.sage,
          borderRadius: '18px 18px 30px 30px',
          filter: 'url(#ed-cut)',
          opacity: k(331, 10),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 3,
          color: E.cream,
          textAlign: 'center',
        }}
      >
        RAW
        <br />
        MATERIAL
      </div>
      <Label text="Built fresh daily" x={720} y={1560} k={k(326, 12)} mono size={28} color={E.blueDeep} />
    </AbsoluteFill>
  );
};

// 113.12 · "an amino acid called tyrosine, and when that runs low, nothing tops you up for long. But give your brain enough tyrosine every day and everything changes."
export const EdTyrosine: React.FC = () => {
  const {f, k, a, past} = useScene('Tyrosine');
  const bump = (i: number) => (past(i) ? Math.exp(-(f - a(i)) / 14) * 0.18 : 0);
  const enough = k(354, 30);
  const change = k(359, 30);
  const dop = 0.08 + bump(345) + bump(347) + change * 0.7;
  return (
    <AbsoluteFill>
      <Paper tint={mixHex(E.paper, '#f7f1e2', change)} />
      <div style={{position: 'absolute', left: 540 - 700, top: 1300 - 700, width: 1400, height: 1400, borderRadius: '50%', background: `radial-gradient(circle, ${E.ochreLight} 0%, transparent 60%)`, opacity: change * 0.35}} />
      <Piece x={540} y={760}>
        <Molecule width={800} morph={0} draw={k(337, 26)} color={E.sageDeep} />
      </Piece>
      <Label text="Tyrosine · amino acid" x={540} y={1010} k={k(338, 12)} mono size={30} color={E.sageDeep} />
      <Piece x={300} y={1450} style={{opacity: k(339, 12)}}>
        <Tank width={270} level={mix(k(342, 18), 0.4, 0.06) + enough * 0.8} t={f} liquid={E.sage} label="TYROSINE" />
      </Piece>
      <Piece x={780} y={1450} style={{opacity: k(344, 12, -6)}}>
        <Tank width={270} level={dop} t={f} drip={past(345) && !past(356)} />
      </Piece>
      <Canvas>
        <PathParticles d="M380 1250 C480 1150 600 1150 700 1250" start={a(355)} count={30} gap={3} speed={12} size={10} color={E.sage} glow={null} shine={false} />
      </Canvas>
      <Label text="Every day" x={540} y={1830} k={k(356, 12)} mono size={28} color={E.sageDeep} />
    </AbsoluteFill>
  );
};

// 122.43 · "That empty tank that had you reaching for the alcohol, the sugar, the scroll fills right back up and the cravings go quiet all at once."
export const EdRefill: React.FC = () => {
  const {f, k, s} = useScene('Refill');
  const fill = k(375, 40);
  const quiet = k(381, 30);
  const item = (i: number, x: number, y: number, el: React.ReactNode, lineD: string) => (
    <>
      <Canvas>
        <Ink d={lineD} draw={k(i, 12) * (1 - quiet)} width={3} dash="2 12" />
      </Canvas>
      <Piece x={x + (x < 540 ? -1 : 1) * quiet * 60} y={y} cut style={{opacity: k(i, 10) * (1 - quiet * 0.75), filter: `url(#ed-cut) saturate(${1 - quiet})`, scale: mix(s(i), 0.9, 1)}}>
        {el}
      </Piece>
    </>
  );
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={540} y={1180} style={{opacity: k(361, 10, -4)}}>
        <Tank width={400} level={mix(fill, 0.06, 0.88)} t={f} />
      </Piece>
      {item(370, 230, 760, <Tumbler width={200} fill={0.7} t={f} />, 'M300 860 C380 920 420 940 460 980')}
      {item(372, 850, 760, <Donut width={190} />, 'M780 860 C700 920 660 940 620 980')}
      {item(374, 230, 1620, <Phone width={150} scroll={f * 4} />, 'M300 1500 C360 1420 400 1380 440 1340')}
      <Label text="Cravings: quiet" x={830} y={1620} k={quiet} mono size={28} color={E.blueDeep} />
    </AbsoluteFill>
  );
};

// 130.66 · "You wake up clear. The thing you'd been dreading gets done before lunch. The afternoon crash never comes."
export const EdClearDay: React.FC = () => {
  const {f, k, past} = useScene('ClearDay');
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={540} y={mix(k(388, 30), 760, 600)} style={{opacity: k(388, 20)}}>
        <Sun width={200} t={f} />
      </Piece>
      <Piece x={540} y={1010}>
        <Person width={470} shirt={E.blue} expr={!past(390) ? 'neutral' : !past(397) ? 'calm' : 'happy'} lookY={past(392) && !past(399) ? 0.6 : 0} />
      </Piece>
      {/* lista de tareas */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 1330,
          width: 470,
          padding: '34px 36px',
          boxSizing: 'border-box',
          background: E.cream,
          filter: 'url(#ed-cut)',
          opacity: k(392, 12),
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <svg width={44} height={44} viewBox="0 0 44 44">
              <rect x={3} y={3} width={38} height={38} rx={6} fill="none" stroke={E.ink} strokeWidth={4} />
              {i === 0 ? <path d="M10 22 L19 31 L35 11" fill="none" stroke={E.blueDeep} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(397, 10)} /> : null}
            </svg>
            <div style={{height: 14, width: [300, 240, 270][i], background: i === 0 ? E.ink : E.mist, opacity: i === 0 ? 0.8 : 0.6, borderRadius: 7}} />
          </div>
        ))}
      </div>
      <Piece x={800} y={1450} style={{opacity: k(398, 12)}}>
        <Clock width={220} hours={mix(k(398, 20), 9, 11.5)} />
      </Piece>
      <Label text="Before lunch" x={800} y={1610} k={k(398, 12, 6)} mono size={26} />
      <Canvas>
        <path d="M120 1790 L960 1790" stroke={E.brick} strokeWidth={4} strokeDasharray="8 12" opacity={k(400, 10) * (1 - k(403, 16)) * 0.7} />
        <path d="M520 1790 C580 1790 600 1880 660 1880 C720 1880 740 1790 800 1790" fill="none" stroke={E.brick} strokeWidth={4} strokeDasharray="8 12" opacity={k(401, 10) * (1 - k(403, 16)) * 0.8} />
        <Ink d="M120 1760 L960 1760" draw={k(401, 30)} color={E.blueDeep} width={7} />
      </Canvas>
      <Label text="No afternoon crash" x={540} y={1700} k={k(403, 12)} mono size={26} color={E.blueDeep} />
    </AbsoluteFill>
  );
};

// 136.97 · "and you reach the evening with real energy left for the people who matter."
export const EdEvening: React.FC = () => {
  const {f, k, s} = useScene('Evening');
  return (
    <AbsoluteFill>
      <Paper tint="#efe6d4" />
      <div style={{position: 'absolute', left: -200, top: 500, width: 1480, height: 1480, borderRadius: '50%', background: `radial-gradient(circle, ${E.ochreLight} 0%, transparent 62%)`, opacity: 0.4}} />
      <Piece x={880} y={620} style={{opacity: k(409, 14)}}>
        <Moon width={130} />
      </Piece>
      <Piece x={220} y={760} style={{opacity: k(411, 12)}}>
        <Tank width={170} level={0.78} t={f} label="ENERGY" />
      </Piece>
      <Piece x={mix(s(416), 1300, 790)} y={1430}>
        <Person width={480} hair="long" hairColor="#5a3b2e" shirt={E.rose} skin="#e8bea0" expr="happy" lookX={-0.8} />
      </Piece>
      <Piece x={400} y={1340}>
        <Person width={560} shirt={E.blue} expr={f > 20 ? 'happy' : 'calm'} lookX={0.8} tilt={3} />
      </Piece>
    </AbsoluteFill>
  );
};
