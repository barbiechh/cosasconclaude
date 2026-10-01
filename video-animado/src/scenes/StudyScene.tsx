import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bean} from '../characters/Bean';
import {Burner, Flask} from '../objects/Flask';
import {Glass} from '../objects/Glass';
import {AnswerCard} from '../objects/Symbols';
import {Glow, Motes, Place} from '../components/Stage';
import {PathParticles} from '../components/PathParticles';
import {anticipate, clamp, pop, ramp, wobble} from '../components/anim';
import {C} from '../components/palette';
import {cue} from '../data/timeline';

// 4.57–9.67 s · "Scientists actually ran the study, and the answer wasn't the one anyone wanted."
const T = {
  scientists: cue(4.71, 'study'),
  ran: cue(5.83, 'study'),
  study: cue(6.39, 'study'),
  answer: cue(7.35, 'study'),
  wasnt: cue(7.83, 'study'),
  anyone: cue(8.71, 'study'),
  wanted: cue(9.11, 'study'),
  end: cue(9.67, 'study'),
};

// Serpentín de destilación: baja en zigzag del matraz al vaso de precipitados.
const COIL =
  'M584 172 C700 150 944 160 944 300 C944 420 770 420 770 520 C770 620 944 620 944 720 C944 820 770 820 770 920 C770 1000 820 1010 820 1095';

export const StudyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const beanIn = anticipate(frame, T.scientists, fps);
  const flaskIn = pop(frame, 0, fps, 12);
  const boil = ramp(frame, [T.ran, T.study], [0.15, 1]);
  const coilDraw = ramp(frame, [2, 30], [0, 1]);
  const cardK = pop(frame, T.answer, fps, 10);
  const shock = pop(frame, T.wasnt, fps, 9);
  const shocked = frame >= T.wasnt;

  // Mirada: aparato -> tarjeta -> niega con la cabeza.
  const lookX = frame < T.answer ? 0.7 : frame < T.anyone ? 0.75 : Math.sin((frame - T.anyone) * 0.55) * 0.8;
  const lookY = frame < T.answer ? -0.55 : -0.85;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        scale: interpolate(frame, [0, 20, T.wasnt, T.wasnt + 18], [1.08, 1, 1, 1.1], clamp),
        transformOrigin: '320px 1250px',
        translate: `${frame >= T.wanted && frame < T.wanted + 10 ? wobble(frame, 3.1, 8) : 0}px 0px`,
      }}
    >
      <Motes seed="s" />
      <Glow x={540} y={480} size={1000} opacity={0.3 + boil * 0.25} />
      <Glow x={820} y={1250} size={700} opacity={0.35 * ramp(frame, [T.study, T.answer], [0.2, 1])} />

      {/* Mechero + matraz */}
      <Place x={540} y={760} style={{scale: flaskIn}}>
        <Burner width={240} power={boil} t={frame} />
      </Place>
      <Place
        x={540}
        y={400}
        style={{
          translate: `-50% calc(-50% + ${interpolate(flaskIn, [0, 1], [-500, 0])}px)`,
          rotate: `${wobble(frame, 0.9, boil * 1.4)}deg`,
        }}
      >
        <Flask width={420} fill={0.55} boil={boil} t={frame} />
      </Place>

      {/* Serpentín y gotas que bajan */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <path d={COIL} fill="none" stroke={C.ink} strokeWidth={40} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - coilDraw} />
        <path d={COIL} fill="none" stroke={C.glassEdge} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - coilDraw} />
        <path d={COIL} fill="none" stroke="#24180f" strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - coilDraw} />
        <PathParticles d={COIL} start={T.ran} stop={T.wasnt} count={20} speed={26} gap={4} size={9} />
      </svg>

      {/* Vaso de precipitados que se llena */}
      <Place x={820} y={1290} style={{scale: pop(frame, 8, fps, 11)}}>
        <Glass width={290} shape="beaker" fill={ramp(frame, [T.ran + 30, T.answer + 4], [0, 0.72])} t={frame} />
      </Place>

      {/* La respuesta sale del vaso */}
      <Place
        x={interpolate(cardK, [0, 1], [820, 565])}
        y={interpolate(cardK, [0, 1], [1150, 830])}
        style={{
          scale: interpolate(cardK, [0, 1], [0.2, 1]),
          rotate: `${interpolate(cardK, [0, 1], [-160, 8]) + (shocked ? wobble(frame, 0.9, 5) : wobble(frame, 0.15, 3))}deg`,
          opacity: frame >= T.answer ? 1 : 0,
        }}
      >
        <AnswerCard width={230} />
      </Place>

      {/* Científico en primer plano */}
      <Place
        x={300}
        y={1480}
        style={{
          translate: `calc(-50% + ${interpolate(shock, [0, 1], [0, -26])}px) calc(-50% + ${interpolate(beanIn, [-0.12, 0, 1], [800, 800, 0], {extrapolateLeft: 'clamp'})}px)`,
          rotate: `${interpolate(shock, [0, 1], [0, -6])}deg`,
          transformOrigin: '50% 100%',
        }}
      >
        <Bean
          width={640}
          coat
          goggles
          clipboard
          lookX={lookX}
          lookY={lookY}
          blink={interpolate(frame, [T.study, T.study + 2, T.study + 5], [0, 1, 0], clamp)}
          browY={shocked ? interpolate(shock, [0, 1], [-6, -24]) : frame >= T.answer ? -8 : 0}
          browTilt={shocked ? 14 : 0}
          mouth={frame < T.answer ? 'smile' : frame < T.wasnt ? 'o' : frame < T.wanted ? 'wow' : 'frown'}
          mouthScale={shocked ? 1.1 : 1}
          armR={
            frame < T.ran
              ? interpolate(frame, [T.scientists + 6, T.scientists + 14], [0, -125], clamp) + wobble(frame, 0.5, 14)
              : frame < T.wasnt
                ? ramp(frame, [T.ran, T.ran + 8], [-125, -100])
                : interpolate(shock, [0, 1], [-100, -30])
          }
          armL={shocked ? interpolate(shock, [0, 1], [0, 25]) : 0}
          sweat={ramp(frame, [T.wasnt + 10, T.wasnt + 20], [0, 1])}
        />
      </Place>
    </AbsoluteFill>
  );
};
