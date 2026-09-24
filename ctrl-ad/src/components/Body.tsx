import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {Cutout} from './Cutout';
import {TimedText} from './TimedText';
import {DrawnCircle} from './DrawnCircle';
import {COLORS, FONT_FAMILY, FONT_WEIGHT, LAYOUT} from '../styles/tokens';
import {BODY_FRAMES, BodyCueKey, WIDTH, bodyCueFrame} from '../data/timing';

export interface BodyProps {
  usePlaceholder: boolean;
}

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const {topText: TOP, bottomText: BOTTOM} = LAYOUT;

/**
 * Cada escena vive en su propia <Sequence>, delimitada por dos frases del
 * guion; al terminar, su contenido se desmonta y no tapa a la siguiente.
 * Dentro de la escena, `at(key)` da el frame local en que se dice esa frase.
 */
const scene = (from: BodyCueKey, to: BodyCueKey | null) => {
  const start = bodyCueFrame(from);
  const end = to ? bodyCueFrame(to) : BODY_FRAMES;
  return {
    from: start,
    durationInFrames: end - start,
    at: (key: BodyCueKey, offset = 0) => bodyCueFrame(key) - start + offset,
  };
};

export const Body: React.FC<BodyProps> = ({usePlaceholder}) => {
  const p = usePlaceholder;
  const orcas = scene('aroundForty', 'obviously');
  const bridge = scene('obviously', 'becauseForAWoman');
  const fade = scene('becauseForAWoman', 'nobodyTellsHer');
  const brain = scene('nobodyTellsHer', 'usualAnswers');
  const answers = scene('usualAnswers', 'pushingHarder');
  const fix = scene('pushingHarder', 'onceTheBrain');
  const recovery = scene('onceTheBrain', 'natureBuilt');
  const closing = scene('natureBuilt', null);

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* 1. ORCAS: lámina, líder, peces que desaparecen, ruta que recuerda */}
      <Sequence from={orcas.from} durationInFrames={orcas.durationInFrames} name="1 Orcas">
        {(() => {
          const at = orcas.at;
          return (
            <>
              <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('aroundForty')} exitAtFrame={at('fishDisappear')}
                width={860} height={600} top={560} left={110} label="LÁMINA — orca mayor con su grupo" />
              <TimedText text="Around 40, she stops having babies" highlight="stops having babies" enterAtFrame={at('aroundForty')} exitAtFrame={at('livesToNinety')} top={TOP} />
              <TimedText text="then lives to 90." highlight="90" enterAtFrame={at('livesToNinety')} exitAtFrame={at('thirtyYears')} top={TOP} fontSize={64} />
              <TimedText text="30 years" highlight="30 years" enterAtFrame={at('thirtyYears')} exitAtFrame={at('leaderOfPod')} top={TOP} fontSize={72} />
              <TimedText text="the leader of the whole pod" highlight="leader" enterAtFrame={at('leaderOfPod')} exitAtFrame={at('fishDisappear')} top={TOP} />
              <Cutout assetId="body.fishSchoolFading" usePlaceholder={p} enterAtFrame={at('fishDisappear')} exitAtFrame={at('everyWhaleFollows')}
                width={700} height={440} top={640} left={190} rotationDeg={-2} label="Cardumen de peces" />
              <TimedText text="the fish disappear" enterAtFrame={at('fishDisappear')} exitAtFrame={at('everyWhaleFollows')} top={TOP} />
              <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('everyWhaleFollows')} exitAtFrame={at('sheRemembers')}
                width={860} height={600} top={560} left={110} fromX={-200} fromY={0} label="LÁMINA — el grupo sigue a la orca mayor" />
              <TimedText text="every whale follows her" highlight="follows her" enterAtFrame={at('everyWhaleFollows')} exitAtFrame={at('sheRemembers')} top={TOP} />
              <Cutout assetId="body.oceanRouteMap" usePlaceholder={p} enterAtFrame={at('sheRemembers')}
                width={800} height={560} top={560} left={140} rotationDeg={2} label="Mapa antiguo con ruta punteada" />
              <TimedText text="she remembers where the food was" enterAtFrame={at('sheRemembers')} exitAtFrame={at('twentyYearsAgo')} top={TOP} />
              <TimedText text="20 years ago" highlight="20 years ago" enterAtFrame={at('twentyYearsAgo')} top={TOP} fontSize={72} />
            </>
          );
        })()}
      </Sequence>

      {/* 2. PUENTE A LA MUJER */}
      <Sequence from={bridge.from} durationInFrames={bridge.durationInFrames} name="2 Puente">
        {(() => {
          const at = bridge.at;
          return (
            <>
              <TimedText text="Obviously a woman isn't a whale." enterAtFrame={at('obviously')} exitAtFrame={at('butIfABrain')} top={TOP} />
              <Cutout assetId="body.womanMidlifeDaily" usePlaceholder={p} enterAtFrame={at('obviously', 12)}
                width={620} height={760} top={LAYOUT.imageTop} left={(WIDTH - 620) / 2} label="Mujer de mediana edad, escena cotidiana" />
              <TimedText text="built to be at its best" highlight="best" enterAtFrame={at('atItsBest')} exitAtFrame={at('worstVersion')} top={BOTTOM} />
              <TimedText text="the worst version of themselves?" highlight="worst" enterAtFrame={at('worstVersion')} top={BOTTOM} />
            </>
          );
        })()}
      </Sequence>

      {/* 3. SLOW FADE: la mujer se atenúa y se le desprenden foco, palabras, empuje */}
      <Sequence from={fade.from} durationInFrames={fade.durationInFrames} name="3 Slow fade">
        {(() => {
          const at = fade.at;
          return (
            <>
              <FadingPortrait startFrame={at('slowFade')} endFrame={at('thisIsJustWho')}>
                <Cutout assetId="body.womanFocusFade" usePlaceholder={p} enterAtFrame={0}
                  width={620} height={760} top={LAYOUT.imageTop} left={(WIDTH - 620) / 2} label="Mujer (misma persona), plano medio" />
              </FadingPortrait>
              <TimedText text="a slow fade" highlight="slow fade" enterAtFrame={at('slowFade')} exitAtFrame={at('snaps')} top={TOP} fontSize={72} />
              <FallingWord text="focus" enterAtFrame={at('focusGoes')} top={560} centerX={250} />
              <FallingWord text="words" enterAtFrame={at('wordsGo')} top={760} centerX={850} />
              <FallingWord text="drive" enterAtFrame={at('driveGoes')} top={980} centerX={240} />
              <TimedText text="she snaps at the people she loves most" enterAtFrame={at('snaps')} exitAtFrame={at('thisIsJustWho')} top={TOP} />
              <TimedText text="“this is just who she is now”" enterAtFrame={at('thisIsJustWho')} top={BOTTOM} />
            </>
          );
        })()}
      </Sequence>

      {/* 4. ESTRÓGENO Y DOPAMINA */}
      <Sequence from={brain.from} durationInFrames={brain.durationInFrames} name="4 Estrogeno-dopamina">
        {(() => {
          const at = brain.at;
          return (
            <>
              <TimedText text="Nobody tells her otherwise." enterAtFrame={at('nobodyTellsHer')} exitAtFrame={at('whatTheHormones')} top={TOP} />
              <TimedText text="what the hormones were doing for her brain" highlight="her brain" enterAtFrame={at('whatTheHormones')} exitAtFrame={at('estrogen')} top={TOP} />
              <Cutout assetId="body.brainDiagram" usePlaceholder={p} enterAtFrame={at('herBrain')}
                width={560} height={440} top={LAYOUT.imageTop} left={(WIDTH - 560) / 2} label="Grabado simple de un cerebro" />
              <TimedText text="Estrogen had a second job" highlight="second job" enterAtFrame={at('estrogen')} exitAtFrame={at('makeDopamine')} top={TOP} />
              <TimedText text="helping the brain make dopamine" highlight="dopamine" enterAtFrame={at('makeDopamine')} exitAtFrame={at('flickers')} top={TOP} />
              <TimedText text="focus · drive · follow through" enterAtFrame={at('behindFocus')} exitAtFrame={at('flickers')} top={960} fontSize={48} />
              <TimedText text="it flickers" highlight="flickers" enterAtFrame={at('flickers')} exitAtFrame={at('thatsTheFog')} top={TOP} fontSize={72} />
              <SwitchFlicker usePlaceholder={p} flickerAtFrame={at('flickers')} />
              <DopamineLine appearAtFrame={at('everyTimeItDips')} dipAtFrame={at('dopamineDips')} />
              <Fog fromFrame={at('thatsTheFog')} />
              <TimedText text="That's the fog." highlight="fog" enterAtFrame={at('thatsTheFog')} top={TOP} fontSize={72} />
            </>
          );
        })()}
      </Sequence>

      {/* 5. HRT / ESTIMULANTES — tramo explicativo breve, sin empaques */}
      <Sequence from={answers.from} durationInFrames={answers.durationInFrames} name="5 HRT-estimulantes">
        {(() => {
          const at = answers.at;
          return (
            <>
              <TimedText text="the usual answers don't reach it" enterAtFrame={at('usualAnswers')} exitAtFrame={at('hrtSorts')} top={TOP} />
              <Cutout assetId="body.hrtIcon" usePlaceholder={p} enterAtFrame={at('hrtSorts')}
                width={360} height={360} top={600} left={120} rotationDeg={-3} label="HRT (recorte genérico)" />
              <TimedText text="HRT" enterAtFrame={at('hrtSorts')} top={990} centerX={300} maxWidth={360} fontSize={52} />
              <TimedText text="sorts the sweats, leaves the fog" highlight="leaves the fog" enterAtFrame={at('hrtSorts')} exitAtFrame={at('stimulants')} top={TOP} />
              <Cutout assetId="body.stimulantIcon" usePlaceholder={p} enterAtFrame={at('stimulants')}
                width={360} height={360} top={600} left={WIDTH - 480} rotationDeg={3} label="Estimulantes (recorte genérico)" />
              <TimedText text="Stimulants" enterAtFrame={at('stimulants')} top={990} centerX={WIDTH - 300} maxWidth={380} fontSize={52} />
              <TimedText text="can only push out dopamine already made" enterAtFrame={at('canOnlyPush')} exitAtFrame={at('quietlyStop')} top={TOP} />
              <TimedText text="they quietly stop working" highlight="stop working" enterAtFrame={at('quietlyStop')} top={TOP} />
            </>
          );
        })()}
      </Sequence>

      {/* 6. EL FIX: tirosina, B6, plantas -> CTRL (solo foto real del frasco) */}
      <Sequence from={fix.from} durationInFrames={fix.durationInFrames} name="6 Ingredientes-CTRL">
        {(() => {
          const at = fix.at;
          const ctrl = at('ctrl');
          return (
            <>
              <TimedText text="Pushing harder was never the fix." enterAtFrame={at('pushingHarder')} exitAtFrame={at('theFixIs')} top={TOP} />
              <TimedText text="what the brain builds dopamine from" highlight="builds" enterAtFrame={at('theFixIs')} exitAtFrame={at('tyrosine')} top={TOP} />
              <Ingredient p={p} assetId="body.tyrosine" name="Tyrosine" enterAtFrame={at('tyrosine')} exitAtFrame={ctrl} centerX={250} />
              <TimedText text="an amino acid called tyrosine" highlight="tyrosine" enterAtFrame={at('tyrosine')} exitAtFrame={at('nothingLikeStimulant')} top={TOP} />
              <Ingredient p={p} assetId="body.b6" name="B6" enterAtFrame={at('b6')} exitAtFrame={ctrl} centerX={WIDTH / 2} />
              <Ingredient p={p} assetId="body.calmingPlants" name="2 calming plants" enterAtFrame={at('calmingPlants')} exitAtFrame={ctrl} centerX={WIDTH - 250} />
              <TimedText text="nothing like a stimulant" highlight="nothing" enterAtFrame={at('nothingLikeStimulant')} exitAtFrame={ctrl} top={TOP} />
              <Cutout assetId="product.ctrlBottle" usePlaceholder={p} enterAtFrame={ctrl}
                width={440} height={660} top={LAYOUT.imageTop} left={(WIDTH - 440) / 2} fromY={120} label="FRASCO REAL DE CTRL — PENDIENTE DE FOTO" />
              <DrawnCircle enterAtFrame={ctrl + 8} top={LAYOUT.imageTop - 40} left={(WIDTH - 560) / 2} size={560} />
              <TimedText text="CTRL" enterAtFrame={ctrl} top={TOP - 10} fontSize={110} />
              <TimedText text="Nothing hormonal. Sits fine next to HRT." highlight="Nothing hormonal." enterAtFrame={at('nothingHormonal')} top={BOTTOM} fontSize={50} />
            </>
          );
        })()}
      </Sequence>

      {/* 7. RECUPERACIÓN: la niebla se levanta y vuelve ella */}
      <Sequence from={recovery.from} durationInFrames={recovery.durationInFrames} name="7 Recuperacion">
        {(() => {
          const at = recovery.at;
          return (
            <>
              <Cutout assetId="body.brainDiagram" usePlaceholder={p} enterAtFrame={at('onceTheBrain')} exitAtFrame={at('driveComesBack')}
                width={560} height={440} top={LAYOUT.imageTop + 120} left={(WIDTH - 560) / 2} label="Grabado simple de un cerebro" />
              <Fog fromFrame={at('onceTheBrain')} liftAtFrame={at('fogLifts')} />
              <TimedText text="building dopamine again" highlight="again" enterAtFrame={at('onceTheBrain')} exitAtFrame={at('fogLifts')} top={TOP} />
              <TimedText text="the fog lifts" highlight="lifts" enterAtFrame={at('fogLifts')} exitAtFrame={at('driveComesBack')} top={TOP} fontSize={72} />
              <Cutout assetId="body.womanMidlifeDaily" usePlaceholder={p} enterAtFrame={at('driveComesBack')}
                width={620} height={760} top={LAYOUT.imageTop} left={(WIDTH - 620) / 2} label="La misma mujer, con energía y foco" />
              <TimedText text="the drive comes back" highlight="drive" enterAtFrame={at('driveComesBack')} exitAtFrame={at('feelsLikeHerself')} top={TOP} />
              <TimedText text="and so does the patience" highlight="patience" enterAtFrame={at('soDoesPatience')} exitAtFrame={at('feelsLikeHerself')} top={BOTTOM} />
              <TimedText text="She feels like herself again." highlight="herself" enterAtFrame={at('feelsLikeHerself')} top={TOP} />
            </>
          );
        })()}
      </Sequence>

      {/* 8. CIERRE: la líder y su grupo, ahora conectados con ella */}
      <Sequence from={closing.from} durationInFrames={closing.durationInFrames} name="8 Cierre">
        {(() => {
          const at = closing.at;
          return (
            <>
              <TimedText text="Nature built this stage of life" enterAtFrame={at('natureBuilt')} exitAtFrame={at('everybodyFollows')} top={TOP} />
              <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('natureBuilt')}
                width={560} height={390} top={LAYOUT.imageTop} left={WIDTH - 640} rotationDeg={2} fromX={200} fromY={0} label="LÁMINA — orca mayor y su grupo" />
              <FollowPath drawFrom={at('makeAWoman', 6)} />
              <Cutout assetId="body.womanMidlifeDaily" usePlaceholder={p} enterAtFrame={at('makeAWoman')}
                width={440} height={560} top={720} left={90} rotationDeg={-2} fromX={-200} fromY={0} label="La mujer, al frente" />
              <TimedText text="the one everybody follows" highlight="everybody follows" enterAtFrame={at('everybodyFollows')} top={TOP} />
            </>
          );
        })()}
      </Sequence>
    </AbsoluteFill>
  );
};

const FadingPortrait: React.FC<{startFrame: number; endFrame: number; children: React.ReactNode}> = ({
  startFrame,
  endFrame,
  children,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [startFrame, endFrame], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: 1 - t * 0.55, filter: `grayscale(${t}) blur(${t * 2}px)`}}>{children}</AbsoluteFill>
  );
};

/** Palabra que aparece al decirse y luego se desprende hacia abajo. */
const FallingWord: React.FC<{text: string; enterAtFrame: number; top: number; centerX: number}> = ({
  text,
  enterAtFrame,
  top,
  centerX,
}) => {
  const frame = useCurrentFrame();
  const local = frame - enterAtFrame;
  if (local < 0) return null;
  const opacity = interpolate(local, [0, 4, 18, 40], [0, 1, 1, 0], clamp);
  const drop = interpolate(local, [14, 40], [0, 160], clamp);
  const rotate = interpolate(local, [14, 40], [0, -14], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: top + drop,
        left: centerX,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        opacity,
        fontFamily: FONT_FAMILY,
        fontWeight: FONT_WEIGHT,
        fontSize: 64,
        color: COLORS.ink,
        backgroundColor: COLORS.yellow,
        padding: '4px 22px',
        borderRadius: 6,
      }}
    >
      {text}
    </div>
  );
};

const Ingredient: React.FC<{
  p: boolean;
  assetId: string;
  name: string;
  enterAtFrame: number;
  exitAtFrame: number;
  centerX: number;
}> = ({p, assetId, name, enterAtFrame, exitAtFrame, centerX}) => (
  <>
    <Cutout assetId={assetId} usePlaceholder={p} enterAtFrame={enterAtFrame} exitAtFrame={exitAtFrame}
      width={300} height={300} top={620} left={centerX - 150} label={name} />
    <TimedText text={name} enterAtFrame={enterAtFrame} exitAtFrame={exitAtFrame} top={950} centerX={centerX} maxWidth={320} fontSize={42} />
  </>
);

/** Interruptor: parpadea justo en "flickers" y se queda encendido a medias. */
const SwitchFlicker: React.FC<{usePlaceholder: boolean; flickerAtFrame: number}> = ({usePlaceholder, flickerAtFrame}) => {
  const frame = useCurrentFrame();
  const local = frame - flickerAtFrame;
  const pattern = [1, 0.15, 1, 0.1, 0.9, 0.2, 1, 0.3, 1];
  const opacity = local < 0 ? 1 : local < pattern.length * 2 ? pattern[Math.floor(local / 2)] : 1;
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Cutout assetId="body.lightSwitch" usePlaceholder={usePlaceholder} enterAtFrame={flickerAtFrame - 2}
        width={280} height={300} top={960} left={110} label="Interruptor de luz" />
    </div>
  );
};

/** Línea de dopamina: aparece plana y cae exactamente en "dopamine dips". */
const DopamineLine: React.FC<{appearAtFrame: number; dipAtFrame: number}> = ({appearAtFrame, dipAtFrame}) => {
  const frame = useCurrentFrame();
  if (frame < appearAtFrame) return null;
  const draw = interpolate(frame, [appearAtFrame, appearAtFrame + 12], [0, 1], clamp);
  const dip = interpolate(frame, [dipAtFrame, dipAtFrame + 8], [0, 1], clamp);
  const w = 560;
  const h = 300;
  const base = 70;
  const low = base + dip * 170;
  const d = `M 0 ${base} L ${w * 0.35} ${base} C ${w * 0.45} ${base} ${w * 0.45} ${low} ${w * 0.55} ${low} L ${w} ${low}`;
  return (
    <svg width={w} height={h} style={{position: 'absolute', top: 960, left: 440, opacity: draw}}>
      <path d={d} stroke={COLORS.red} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1}
        strokeDasharray={1} strokeDashoffset={1 - draw} />
      <text x={0} y={40} fontFamily={FONT_FAMILY} fontWeight={FONT_WEIGHT} fontSize={36} fill={COLORS.ink}>dopamine</text>
    </svg>
  );
};

/** Niebla blanca sobre el área de imagen; si hay liftAtFrame, se disipa ahí. */
const Fog: React.FC<{fromFrame: number; liftAtFrame?: number}> = ({fromFrame, liftAtFrame}) => {
  const frame = useCurrentFrame();
  if (frame < fromFrame) return null;
  const inOp = interpolate(frame, [fromFrame, fromFrame + 10], [0, 0.75], clamp);
  const outOp = liftAtFrame === undefined ? 1 : interpolate(frame, [liftAtFrame, liftAtFrame + 20], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: LAYOUT.imageTop - 60,
        left: 0,
        width: WIDTH,
        height: LAYOUT.imageBottom - LAYOUT.imageTop + 120,
        background: 'radial-gradient(ellipse at center, rgba(250,250,248,0.95) 0%, rgba(250,250,248,0.6) 45%, rgba(250,250,248,0) 75%)',
        opacity: inOp * outOp,
      }}
    />
  );
};

/** Ruta punteada que une a la orca mayor con la mujer (el grupo la sigue). */
const FollowPath: React.FC<{drawFrom: number}> = ({drawFrom}) => {
  const frame = useCurrentFrame();
  if (frame < drawFrom) return null;
  const draw = interpolate(frame, [drawFrom, drawFrom + 18], [0, 1], clamp);
  return (
    <svg width={WIDTH} height={1300} style={{position: 'absolute', top: 0, left: 0}}>
      <path d="M 700 880 C 640 1000, 600 1040, 520 1060" pathLength={1} stroke={COLORS.yellow} strokeWidth={12}
        fill="none" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - draw} />
    </svg>
  );
};
