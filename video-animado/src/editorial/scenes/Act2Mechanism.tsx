import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {Brain} from '../characters/Brain';
import {Person} from '../characters/Person';
import {Canvas, Ink, Label, mix, Paper, Piece, useDrift} from '../kit';
import {Clock, Coffee, Donut, Moon, Phone, RxBottle, StudyPage, Sun, Tumbler, Week, Molecule} from '../objects/Objects';
import {Tank} from '../objects/Tank';
import {PathParticles} from '../../components/PathParticles';
import {E} from '../theme';
import {useScene} from '../useScene';

const FocusIcon = () => (
  <svg width={90} height={90} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={36} fill="none" stroke={E.ink} strokeWidth={6} />
    <circle cx={50} cy={50} r={10} fill={E.blueDeep} />
    <path d="M50 4 V24 M50 76 V96 M4 50 H24 M76 50 H96" stroke={E.ink} strokeWidth={6} strokeLinecap="round" />
  </svg>
);
const CalmIcon = () => (
  <svg width={90} height={90} viewBox="0 0 100 100">
    <path d="M6 50 C22 30 34 30 50 50 C66 70 78 70 94 50" fill="none" stroke={E.blueDeep} strokeWidth={8} strokeLinecap="round" />
  </svg>
);
const DriveIcon = () => (
  <svg width={90} height={90} viewBox="0 0 100 100">
    <path d="M50 92 V14 M20 42 L50 12 L80 42" fill="none" stroke={E.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Tarjeta de "función" con un medidor medio vacío.
const NeedCard: React.FC<{y: number; k: number; label: string; icon: React.ReactNode; gauge: number}> = ({y, k, label, icon, gauge}) => (
  <div
    style={{
      position: 'absolute',
      left: 160,
      top: y,
      width: 760,
      height: 150,
      translate: `${(1 - k) * 60}px -50%`,
      opacity: k,
      background: E.cream,
      filter: 'url(#ed-cut)',
      display: 'flex',
      alignItems: 'center',
      gap: 34,
      padding: '0 40px',
      boxSizing: 'border-box',
    }}
  >
    {icon}
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 14}}>
      <span style={{fontFamily: 'Inter', fontWeight: 700, fontSize: 40, letterSpacing: 8, color: E.ink}}>{label}</span>
      <div style={{height: 14, background: E.paperShade, borderRadius: 7, overflow: 'hidden'}}>
        <div style={{width: `${gauge * 100}%`, height: '100%', background: E.blue}} />
      </div>
    </div>
  </div>
);

// 15.80 · "An ADHD brain doesn't make enough of the one chemical that gives you focus, calm, and the drive…"
export const EdDeficit: React.FC = () => {
  const {f, k, s, a} = useScene('Deficit');
  const {scale} = useDrift(1.03, 1);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={540} y={mix(s(38), 820, 760)} style={{opacity: k(38, 10, -4)}}>
        <Brain width={720} level={mix(k(41, 20), 0.35, 0.12)} t={f} />
      </Piece>
      <Label text="Not enough" x={540} y={1000} k={k(43, 12)} color={E.brick} mono size={30} />
      <Canvas>
        <path d="M540 1040 L540 1700" stroke={E.ink} strokeWidth={3} strokeDasharray="4 14" opacity={k(47, 10) * 0.5} />
        <PathParticles d="M540 1040 L540 1720" start={a(47)} count={40} gap={14} speed={9} size={9} color={E.blue} glow={null} shine={false} />
      </Canvas>
      <NeedCard y={1220} k={k(51, 14)} label="Focus" icon={<FocusIcon />} gauge={0.22} />
      <NeedCard y={1420} k={k(52, 14)} label="Calm" icon={<CalmIcon />} gauge={0.18} />
      <NeedCard y={1620} k={k(55, 14)} label="Drive" icon={<DriveIcon />} gauge={0.15} />
    </AbsoluteFill>
  );
};

// 23.01 · "That chemical is dopamine, and when you're low on it, your brain runs on an empty tank all day."
export const EdDopamine: React.FC = () => {
  const {f, k, s} = useScene('Dopamine');
  const {scale} = useDrift(1.03, 1);
  const up = k(67, 18);
  return (
    <AbsoluteFill style={{scale}}>
      <Paper />
      <Piece x={540} y={mix(up, 900, 640)} style={{scale: mix(up, 1, 0.62)}}>
        <Molecule width={860} morph={1} draw={k(62, 26)} color={E.blueDeep} />
      </Piece>
      <Label text="Dopamine · C₈H₁₁NO₂" x={540} y={mix(up, 1190, 840)} k={k(63, 12)} mono size={32} color={E.blueDeep} />
      <Piece x={470} y={mix(s(67), 1500, 1340)} style={{opacity: up}}>
        <Tank width={380} level={mix(k(74, 20), 0.22, 0.07)} t={f} />
      </Piece>
      <Piece x={830} y={1250} style={{opacity: k(77, 10)}}>
        <Clock width={190} hours={mix(k(77, 30), 8, 21)} />
      </Piece>
      <Label text="All day" x={830} y={1400} k={k(77, 10)} mono size={28} />
    </AbsoluteFill>
  );
};

// 29.16 · "hunting for anything that fills it back up. A coffee, something sweet, endless scrolling. But nothing fills that tank faster than a drink."
export const EdHunting: React.FC = () => {
  const {f, k, s, a, past} = useScene('Hunting');
  const bump = (i: number) => (past(i, 6) ? Math.exp(-(f - a(i) - 6) / 18) * 0.07 : 0);
  const pour = k(101, 30, 2);
  const level = 0.08 + bump(88) + bump(90) + bump(92) + pour * 0.75;
  return (
    <AbsoluteFill style={{scale: mix(k(79, 40), 1.03, 1)}}>
      <Paper />
      <Piece x={540} y={1180} style={{opacity: k(79, 12, -4)}}>
        <Tank width={340} level={level} t={f} flood={pour * 0.6} />
      </Piece>
      <Canvas>
        <PathParticles d="M250 860 C320 900 420 860 480 900" start={a(88) + 6} count={3} gap={4} speed={10} size={9} color={E.blue} glow={null} shine={false} />
        <PathParticles d="M830 860 C760 900 660 860 600 900" start={a(90) + 6} count={3} gap={4} speed={10} size={9} color={E.blue} glow={null} shine={false} />
        <PathParticles d="M260 1460 C300 1300 380 1060 470 920" start={a(92) + 6} count={3} gap={4} speed={14} size={9} color={E.blue} glow={null} shine={false} />
        {past(101, 2) ? (
          <path d={`M780 1420 C700 1300 640 1000 600 ${mix(pour, 920, 1100)}`} fill="none" stroke={E.ochre} strokeWidth={18 * (1 - k(101, 40, 34))} strokeLinecap="round" opacity={0.9} />
        ) : null}
      </Canvas>
      <Piece x={240} y={mix(s(88), 820, 760)} cut style={{opacity: k(88, 10), rotate: '-6deg'}}>
        <Coffee width={240} t={f} />
      </Piece>
      <Label text="Coffee" x={240} y={920} k={k(88, 10, 4)} mono size={26} />
      <Piece x={840} y={mix(s(90), 820, 760)} cut style={{opacity: k(90, 10), rotate: '8deg'}}>
        <Donut width={220} />
      </Piece>
      <Label text="Sugar" x={840} y={920} k={k(90, 10, 4)} mono size={26} />
      <Piece x={240} y={mix(s(91), 1620, 1560)} cut style={{opacity: k(91, 10), rotate: '-4deg'}}>
        <Phone width={180} scroll={past(91) ? (f - a(91)) * 9 : 0} />
      </Piece>
      <Label text="Scrolling" x={240} y={1790} k={k(91, 10, 4)} mono size={26} />
      <Piece x={840} y={mix(s(100), 1620, 1520)} cut style={{opacity: k(100, 10), rotate: `${-8 - k(101, 12) * 30}deg`}}>
        <Tumbler width={240} fill={0.75 - pour * 0.45} t={f} />
      </Piece>
      <Label text="A drink" x={840} y={1740} k={k(101, 10)} mono size={26} color={E.ochre} />
    </AbsoluteFill>
  );
};

// 37.88 · "One sip and dopamine comes flooding in. The noise goes quiet, the restlessness melts… you feel normal."
export const EdFlood: React.FC = () => {
  const {f, k, a, past} = useScene('Flood');
  const quiet = k(110, 24);
  const melt = k(114, 24);
  const step = Math.floor(f / 3);
  return (
    <AbsoluteFill>
      <Paper dark />
      <Canvas>
        {Array.from({length: 18}, (_, i) => {
          const ang = (i / 18) * Math.PI * 2;
          const r0 = 250 + random(`r${i}`) * 60;
          const cx = 540 + Math.cos(ang) * r0;
          const cy = 1180 + Math.sin(ang) * r0 * 1.1;
          const amp = 22 * (1 - quiet);
          const pts = Array.from({length: 6}, (_, j) => {
            const tx = -40 + j * 16;
            const ty = (j % 2 ? 1 : -1) * amp * (0.6 + random(`z${i}-${j}-${step}`) * 0.6);
            const rx = cx + tx * Math.cos(ang + Math.PI / 2) - ty * Math.cos(ang);
            const ry = cy + tx * Math.sin(ang + Math.PI / 2) - ty * Math.sin(ang);
            return `${rx.toFixed(1)} ${ry.toFixed(1)}`;
          });
          return <path key={i} d={`M${pts.join(' L')}`} fill="none" stroke={E.mist} strokeWidth={4} strokeLinecap="round" opacity={(1 - quiet) * 0.8} />;
        })}
      </Canvas>
      <Piece x={540 + (1 - melt) * (random(`jx${step}`) - 0.5) * 8} y={1310}>
        <Person width={720} shirt={E.slate} expr={!past(110) ? 'irritated' : !past(123) ? 'neutral' : 'calm'} lookY={past(110) ? 0 : -0.3} />
      </Piece>
      <Canvas>
        {[0, 1, 2, 3, 4].map((i) => (
          <PathParticles
            key={i}
            d={`M${820 + i * 30} 620 C${760 - i * 40} 760 ${640 - i * 30} 860 ${520 + i * 20} 1040`}
            start={a(105) + i * 3}
            stop={a(112)}
            count={18}
            gap={4}
            speed={16}
            size={9}
            color={E.blue}
            glow={E.blue}
            shine={false}
          />
        ))}
      </Canvas>
      <Piece x={850} y={600} cut style={{opacity: k(102, 10, -4) * (1 - k(112, 16)), rotate: `${-k(103, 12) * 28}deg`}}>
        <Tumbler width={200} fill={0.7 - k(103, 20) * 0.3} t={f} dark />
      </Piece>
      <Piece x={220} y={680} style={{opacity: k(105, 10)}}>
        <Tank width={170} level={mix(k(105, 30), 0.08, 0.9)} t={f} flood={0.5} dark label="" />
      </Piece>
      <Label text="Normal" x={540} y={1800} k={k(124, 12)} color={E.blue} mono size={30} />
    </AbsoluteFill>
  );
};

// 46.85 · "So the drinking was never really about the drink. It was an empty brain grabbing the fastest thing it could find."
export const EdGrab: React.FC = () => {
  const {f, k, s} = useScene('Grab');
  const ghost = k(130, 18);
  const grab = k(140, 20);
  const items = [
    {x: 200, y: 1630, el: <Coffee width={170} t={f} />},
    {x: 880, y: 1640, el: <Donut width={160} />},
    {x: 880, y: 1050, el: <Phone width={120} />},
  ];
  return (
    <AbsoluteFill>
      <Paper dark />
      <Piece x={540} y={1300} style={{opacity: k(137, 12)}}>
        <Brain width={640} level={0.02} dim={0.6} t={f} />
      </Piece>
      <Label text="Empty" x={540} y={1560} k={k(138, 12)} color={E.mist} mono size={28} />
      {items.map((it, i) => (
        <Piece key={i} x={it.x} y={it.y} style={{opacity: k(141, 12, i * 3) * 0.35, scale: 0.9}}>
          {it.el}
        </Piece>
      ))}
      <Canvas>
        <Ink d="M470 1180 C380 1060 400 900 520 820" draw={grab} color={E.ochreLight} width={6} />
        {[0, 1, 2].map((i) => (
          <Ink key={i} d={`M${700 + i * 26} ${700 + i * 40} L${800 + i * 26} ${660 + i * 40}`} draw={k(142, 8, i * 2) * (1 - k(146, 10))} color={E.ochreLight} width={4} />
        ))}
      </Canvas>
      <Piece x={mix(grab, 560, 540)} y={mix(grab, 760, 1000)} cut style={{opacity: k(126, 10, -4), scale: mix(s(140), 1, 0.7)}}>
        <div style={{opacity: 1 - ghost * 0.7}}>
          <Tumbler width={300} fill={0.7} t={f} dark />
        </div>
      </Piece>
      <Label text="Not about the drink" x={540} y={560} k={ghost * (1 - k(137, 10))} color={E.ochreLight} mono size={28} />
      <Label text="The fastest fix" x={540} y={560} k={k(142, 12)} color={E.ochreLight} mono size={28} />
    </AbsoluteFill>
  );
};

// 53.23 · "And for a few hours it genuinely works. But that's exactly where it turns on you… drains out even lower tomorrow."
export const EdRebound: React.FC = () => {
  const {f, k} = useScene('Rebound');
  const draw = mix(k(148, 26), 0, 0.42) + mix(k(160, 20), 0, 0.2) + mix(k(165, 40), 0, 0.38);
  const lvl = draw < 0.42 ? mix(draw / 0.42, 0.25, 0.92) : draw < 0.62 ? 0.92 : mix((draw - 0.62) / 0.38, 0.9, 0.06);
  const LINE = 'M120 1080 L250 1080 C300 1080 300 760 350 740 C420 720 520 740 600 770 C680 820 720 1180 800 1200 C860 1210 920 1205 960 1200';
  return (
    <AbsoluteFill>
      <Paper dark />
      <Canvas>
        <path d="M120 640 L120 1260 L960 1260" fill="none" stroke={E.mist} strokeWidth={4} opacity={0.7} />
        <path d="M120 1080 L960 1080" stroke={E.mist} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />
        <path d="M700 1080 C730 1150 760 1196 800 1200 C860 1210 920 1205 960 1200 L960 1080 Z" fill={E.brick} opacity={k(168, 16) * 0.45} />
        <Ink d={LINE} draw={draw} color={E.blue} width={9} />
      </Canvas>
      <Label text="Baseline" x={140} y={1050} k={k(147, 12)} align="left" mono size={24} color={E.mist} />
      <Label text="Tonight" x={340} y={1310} k={k(147, 12)} mono size={26} color={E.ochreLight} />
      <Label text="Tomorrow" x={860} y={1310} k={k(172, 10, -8)} mono size={26} color={E.mist} />
      <Piece x={340} y={590} style={{opacity: k(147, 12)}}>
        <Moon width={110} />
      </Piece>
      <Piece x={860} y={mix(k(171, 14), 680, 600)} style={{opacity: k(171, 14)}}>
        <Sun width={130} t={f} />
      </Piece>
      <Label text="Lower" x={860} y={1150} k={k(171, 10)} color="#e08a72" mono size={28} />
      <Piece x={540} y={1620} style={{opacity: k(147, 12)}}>
        <Tank width={220} level={lvl} t={f} baseline={0.25} drip={draw > 0.62} dark label="" />
      </Piece>
    </AbsoluteFill>
  );
};

// 62.77 · "So you wake up flatter, foggier, shorter with the people you love, and by evening… another drink."
export const EdMorning: React.FC = () => {
  const {f, k, s, past} = useScene('Morning');
  const fog = k(178, 20);
  const evening = k(186, 30);
  return (
    <AbsoluteFill>
      <Paper />
      <Piece x={860} y={620} style={{opacity: k(174, 12) * (1 - evening)}}>
        <Sun width={150} t={f} />
      </Piece>
      <Piece x={620} y={1290} style={{filter: `saturate(${1 - k(177, 16) * 0.6})`}}>
        <Person width={640} shirt={E.blue} expr={past(179) && !past(186) ? 'irritated' : 'tired'} lookX={past(179) ? -0.8 : past(196) ? 0.9 : 0} tilt={past(177) ? -4 : 0} />
      </Piece>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 260 + i * 140 + Math.sin(f * 0.02 + i) * 40,
            top: 930 + (i % 2) * 120,
            width: 420,
            height: 200,
            borderRadius: '50%',
            background: E.cream,
            filter: 'blur(30px)',
            opacity: fog * 0.75 * (1 - evening * 0.5),
          }}
        />
      ))}
      <Piece x={mix(s(179), -100, 200)} y={1640} style={{opacity: k(179, 12)}}>
        <Person width={400} hair="long" hairColor="#5a3b2e" shirt={E.rose} skin="#e8bea0" expr="sad" lookX={0.9} />
      </Piece>
      <Canvas>
        <Ink d="M330 1180 L370 1150 L350 1130 L400 1100 L380 1080 L430 1050" draw={k(179, 10)} color={E.brick} width={6} opacity={1 - evening} />
      </Canvas>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #2c3d52 0%, #c9a77a 100%)', mixBlendMode: 'multiply', opacity: evening * 0.6, pointerEvents: 'none'}} />
      <Piece x={860} y={620} style={{opacity: evening}}>
        <Moon width={120} />
      </Piece>
      <Piece x={880} y={mix(s(196), 1750, 1600)} cut style={{opacity: k(196, 10)}}>
        <Tumbler width={220} fill={0.75} t={f} />
      </Piece>
    </AbsoluteFill>
  );
};

// 70.70 · "Alcohol wins the night and quietly loses you the whole week. And the pill they prescribed… did even worse."
export const EdWeek: React.FC = () => {
  const {k, s} = useScene('Week');
  const crosses = [1, 2, 3, 4, 5, 6].map((d) => k(203, 10, d * 4));
  return (
    <AbsoluteFill style={{scale: mix(k(198, 60), 1.02, 1)}}>
      <Paper />
      <Piece x={540} y={mix(s(198), 820, 760)} cut style={{opacity: k(198, 10, -4)}}>
        <Week width={940} state={[1, 2, 2, 2, 2, 2, 2]} k={[k(199, 12), ...crosses]} />
      </Piece>
      <Label text="One good night" x={130} y={1000} k={k(201, 12)} align="left" mono size={26} color={E.ochre} />
      <Label text="Six lost days" x={950} y={1000} k={k(207, 12)} align="right" mono size={26} color={E.brick} />
      <Piece x={300} y={mix(s(211), 1500, 1400)} cut style={{opacity: k(211, 10)}}>
        <RxBottle width={260} />
      </Piece>
      <Label text="Prescribed" x={300} y={1660} k={k(213, 12)} mono size={26} color={E.brick} />
      <Piece x={760} y={mix(s(218), 1520, 1420)} cut style={{opacity: k(218, 10), rotate: '3deg'}}>
        <StudyPage width={380} draw={1} />
      </Piece>
      <Canvas>
        <Ink d="M960 1300 L960 1560 M920 1520 L960 1566 L1000 1520" draw={k(222, 14)} color={E.brick} width={9} />
      </Canvas>
    </AbsoluteFill>
  );
};
