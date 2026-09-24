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

// Cajas con la proporción de cada imagen entregada.
const POD = {width: 880, height: 523}; // foto 16:9 + borde
const WOMAN_PHOTO = {width: 860, height: 671}; // foto 4:3 + borde

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

      {/* 1. ORCAS: la mayor y su grupo, los peces desaparecen, ella recuerda la ruta */}
      <Sequence from={orcas.from} durationInFrames={orcas.durationInFrames} name="1 Orcas">
        {(() => {
          const at = orcas.at;
          return (
            <>
              <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('aroundForty')} exitAtFrame={at('fishDisappear')}
                {...POD} top={600} left={100} rotationDeg={-1.5} label="Orca mayor y su grupo" />
              <TimedText text="Around 40, she stops having babies" highlight="stops having babies" enterAtFrame={at('aroundForty')} exitAtFrame={at('livesToNinety')} top={TOP} />
              <TimedText text="then lives to 90." highlight="90" enterAtFrame={at('livesToNinety')} exitAtFrame={at('thirtyYears')} top={TOP} fontSize={64} />
              <TimedText text="30 years" highlight="30 years" enterAtFrame={at('thirtyYears')} exitAtFrame={at('leaderOfPod')} top={TOP} fontSize={72} />
              <TimedText text="the leader of the whole pod" highlight="leader" enterAtFrame={at('leaderOfPod')} exitAtFrame={at('fishDisappear')} top={TOP} />
              <DisappearingFish p={p} enterAtFrame={at('fishDisappear')} goneAtFrame={at('everyWhaleFollows')} />
              <TimedText text="the fish disappear" enterAtFrame={at('fishDisappear')} exitAtFrame={at('everyWhaleFollows')} top={TOP} />
              <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('everyWhaleFollows')} exitAtFrame={at('sheRemembers')}
                {...POD} top={600} left={100} rotationDeg={1.5} fromX={-220} fromY={0} label="El grupo sigue a la orca mayor" />
              <TimedText text="every whale follows her" highlight="follows her" enterAtFrame={at('everyWhaleFollows')} exitAtFrame={at('sheRemembers')} top={TOP} />
              <RouteToFood p={p} startFrame={at('sheRemembers')} />
              <TimedText text="she remembers where the food was" enterAtFrame={at('sheRemembers')} exitAtFrame={at('twentyYearsAgo')} top={TOP} />
              <TimedText text="20 years ago" highlight="20 years ago" enterAtFrame={at('twentyYearsAgo')} top={TOP} fontSize={72} />
            </>
          );
        })()}
      </Sequence>

      {/* 2. PUENTE: de la naturaleza a una mujer en su día a día */}
      <Sequence from={bridge.from} durationInFrames={bridge.durationInFrames} name="2 Puente">
        {(() => {
          const at = bridge.at;
          return (
            <>
              <TimedText text="Obviously a woman isn't a whale." enterAtFrame={at('obviously')} exitAtFrame={at('butIfABrain')} top={TOP} />
              <Cutout assetId="body.womanMidlifeDaily" usePlaceholder={p} enterAtFrame={at('obviously', 10)}
                {...WOMAN_PHOTO} top={520} left={(WIDTH - WOMAN_PHOTO.width) / 2} rotationDeg={-1.5} label="Mujer en su día a día" />
              <TimedText text="built to be at its best" highlight="best" enterAtFrame={at('atItsBest')} exitAtFrame={at('worstVersion')} top={BOTTOM} />
              <TimedText text="the worst version of themselves?" highlight="worst" enterAtFrame={at('worstVersion')} top={BOTTOM} />
            </>
          );
        })()}
      </Sequence>

      {/* 3. SLOW FADE: ella se apaga y se le desprenden el foco, las palabras, el empuje */}
      <Sequence from={fade.from} durationInFrames={fade.durationInFrames} name="3 Slow fade">
        {(() => {
          const at = fade.at;
          return (
            <>
              <FadingPortrait startFrame={at('slowFade')} endFrame={at('thisIsJustWho')}>
                <Cutout assetId="body.womanFocusFade" usePlaceholder={p} enterAtFrame={0}
                  {...WOMAN_PHOTO} top={520} left={(WIDTH - WOMAN_PHOTO.width) / 2} rotationDeg={1} label="La misma mujer" />
              </FadingPortrait>
              <TimedText text="a slow fade" highlight="slow fade" enterAtFrame={at('slowFade')} exitAtFrame={at('snaps')} top={TOP} fontSize={72} />
              <FallingWord text="focus" enterAtFrame={at('focusGoes')} top={600} centerX={260} />
              <FallingWord text="words" enterAtFrame={at('wordsGo')} top={760} centerX={820} />
              <FallingWord text="drive" enterAtFrame={at('driveGoes')} top={960} centerX={300} />
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
                width={600} height={400} top={500} left={(WIDTH - 600) / 2} label="Grabado de un cerebro" />
              <TimedText text="Estrogen had a second job" highlight="second job" enterAtFrame={at('estrogen')} exitAtFrame={at('makeDopamine')} top={TOP} />
              <TimedText text="helping the brain make dopamine" highlight="dopamine" enterAtFrame={at('makeDopamine')} exitAtFrame={at('flickers')} top={TOP} />
              <TimedText text="focus · drive · follow through" enterAtFrame={at('behindFocus')} exitAtFrame={at('flickers')} top={980} fontSize={48} />
              <TimedText text="it flickers" highlight="flickers" enterAtFrame={at('flickers')} exitAtFrame={at('thatsTheFog')} top={TOP} fontSize={72} />
              <SwitchFlicker usePlaceholder={p} flickerAtFrame={at('flickers')} />
              <DopamineLine appearAtFrame={at('everyTimeItDips')} dipAtFrame={at('dopamineDips')} />
              <Fog fromFrame={at('thatsTheFog')} />
              <TimedText text="That's the fog." highlight="fog" enterAtFrame={at('thatsTheFog')} top={TOP} fontSize={72} />
            </>
          );
        })()}
      </Sequence>

      {/* 5. HRT / ESTIMULANTES: tarjetas tipográficas, sin empaques */}
      <Sequence from={answers.from} durationInFrames={answers.durationInFrames} name="5 HRT-estimulantes">
        {(() => {
          const at = answers.at;
          return (
            <>
              <TimedText text="the usual answers don't reach it" enterAtFrame={at('usualAnswers')} exitAtFrame={at('hrtSorts')} top={TOP} />
              <LabelCard title="HRT" enterAtFrame={at('hrtSorts')} left={90} top={640} rotationDeg={-2}
                lines={[
                  {text: 'sweats ✓', enterAtFrame: at('hrtSorts', 10)},
                  {text: 'fog ✗', enterAtFrame: at('leavesTheFog'), strike: true},
                ]} />
              <TimedText text="sorts the sweats, leaves the fog" highlight="leaves the fog" enterAtFrame={at('hrtSorts')} exitAtFrame={at('stimulants')} top={TOP} />
              <LabelCard title="Stimulants" enterAtFrame={at('stimulants')} left={560} top={700} rotationDeg={2}
                lines={[
                  {text: 'push out dopamine', enterAtFrame: at('canOnlyPush')},
                  {text: 'stop working ✗', enterAtFrame: at('quietlyStop'), strike: true},
                ]} />
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
              <TimedText text="an amino acid called tyrosine" highlight="tyrosine" enterAtFrame={at('tyrosine')} exitAtFrame={at('nothingLikeStimulant')} top={TOP} />
              <Ingredient p={p} assetId="body.tyrosine" name="Tyrosine" enterAtFrame={at('tyrosine')} exitAtFrame={ctrl}
                top={450} imageLeft={70} width={480} height={320} captionX={790} />
              <Ingredient p={p} assetId="body.b6" name="B6" enterAtFrame={at('b6')} exitAtFrame={ctrl}
                top={740} imageLeft={530} width={480} height={320} captionX={290} />
              <Ingredient p={p} assetId="body.calmingPlants" name="2 calming plants" enterAtFrame={at('calmingPlants')} exitAtFrame={ctrl}
                top={1020} imageLeft={70} width={540} height={270} captionX={800} />
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
                width={600} height={400} top={600} left={(WIDTH - 600) / 2} label="Grabado de un cerebro" />
              <Fog fromFrame={at('onceTheBrain')} liftAtFrame={at('fogLifts')} />
              <TimedText text="building dopamine again" highlight="again" enterAtFrame={at('onceTheBrain')} exitAtFrame={at('fogLifts')} top={TOP} />
              <TimedText text="the fog lifts" highlight="lifts" enterAtFrame={at('fogLifts')} exitAtFrame={at('driveComesBack')} top={TOP} fontSize={72} />
              <Cutout assetId="hook.woman" usePlaceholder={p} enterAtFrame={at('driveComesBack')}
                width={460} height={690} top={450} left={(WIDTH - 460) / 2} label="Ella, con energía" />
              <TimedText text="the drive comes back" highlight="drive" enterAtFrame={at('driveComesBack')} exitAtFrame={at('feelsLikeHerself')} top={TOP} />
              <TimedText text="and so does the patience" highlight="patience" enterAtFrame={at('soDoesPatience')} exitAtFrame={at('feelsLikeHerself')} top={1180} />
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
                width={560} height={333} top={470} left={WIDTH - 610} rotationDeg={3} fromX={200} fromY={0} label="Orca mayor y su grupo" />
              <FollowPath drawFrom={at('makeAWoman', 6)} />
              <Cutout assetId="hook.woman" usePlaceholder={p} enterAtFrame={at('makeAWoman')}
                width={420} height={630} top={640} left={90} rotationDeg={-2} fromX={-200} fromY={0} label="Ella, al frente" />
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
        boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
      }}
    >
      {text}
    </div>
  );
};

/** Cardumen que entra y se desvanece poco a poco antes del siguiente cue. */
const DisappearingFish: React.FC<{p: boolean; enterAtFrame: number; goneAtFrame: number}> = ({p, enterAtFrame, goneAtFrame}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [enterAtFrame + 10, goneAtFrame], [1, 0], clamp);
  const drift = interpolate(frame, [enterAtFrame, goneAtFrame], [0, 90], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: fade, transform: `translateX(${drift}px)`}}>
      <Cutout assetId="body.fishSchool" usePlaceholder={p} enterAtFrame={enterAtFrame}
        width={900} height={300} top={720} left={90} fromX={-160} fromY={0} label="Cardumen" />
    </div>
  );
};

/** Ruta punteada que se dibuja; la orca la recorre hasta donde estaba la comida. */
const RouteToFood: React.FC<{p: boolean; startFrame: number}> = ({p, startFrame}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const t = interpolate(frame, [startFrame, startFrame + 45], [0, 1], clamp);
  const ease = 1 - Math.pow(1 - t, 2);
  const P0 = [140, 1220];
  const P1 = [280, 600];
  const P2 = [850, 740];
  const bez = (k: number, u: number) => (1 - u) * (1 - u) * P0[k] + 2 * (1 - u) * u * P1[k] + u * u * P2[k];
  // La orca se detiene antes del final para no tapar la comida.
  const x = bez(0, ease * 0.72);
  const y = bez(1, ease * 0.72);
  const d = `M ${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`;
  const fishIn = interpolate(frame, [startFrame + 30, startFrame + 42], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <svg width={WIDTH} height={1400} style={{position: 'absolute', top: 0, left: 0}}>
        <defs>
          <mask id="route-reveal">
            <path d={d} stroke="white" strokeWidth={30} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease} />
          </mask>
        </defs>
        <path d={d} stroke={COLORS.yellow} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="2 26" mask="url(#route-reveal)" />
        <ellipse cx={P2[0]} cy={P2[1]} rx={190} ry={80} fill="none" stroke={COLORS.ink} strokeWidth={5} opacity={fishIn} strokeDasharray="10 10" />
      </svg>
      <div style={{position: 'absolute', inset: 0, opacity: fishIn}}>
        <Cutout assetId="body.fishSchool" usePlaceholder={p} enterAtFrame={startFrame + 30}
          width={330} height={110} top={P2[1] - 55} left={P2[0] - 165} fromY={0} label="Peces" />
      </div>
      <div style={{position: 'absolute', left: x - 150, top: y - 140, width: 300, height: 280}}>
        <Cutout assetId="hook.orca" usePlaceholder={p} enterAtFrame={startFrame} width={300} height={280} top={0} left={0}
          rotationDeg={-8} fromY={0} label="Orca" />
      </div>
    </AbsoluteFill>
  );
};

/** Ingrediente con su nombre al lado; la imagen y el nombre salen juntos. */
const Ingredient: React.FC<{
  p: boolean;
  assetId: string;
  name: string;
  enterAtFrame: number;
  exitAtFrame: number;
  top: number;
  imageLeft: number;
  width: number;
  height: number;
  captionX: number;
}> = ({p, assetId, name, enterAtFrame, exitAtFrame, top, imageLeft, width, height, captionX}) => (
  <>
    <Cutout assetId={assetId} usePlaceholder={p} enterAtFrame={enterAtFrame} exitAtFrame={exitAtFrame}
      width={width} height={height} top={top} left={imageLeft} fromX={imageLeft < WIDTH / 2 ? -120 : 120} fromY={0} label={name} />
    <TimedText text={name} highlight={name} enterAtFrame={enterAtFrame + 4} exitAtFrame={exitAtFrame} top={top + height / 2 - 34}
      centerX={captionX} maxWidth={400} fontSize={name.length > 8 ? 44 : 60} />
  </>
);

/** Tarjeta tipográfica (en lugar de un empaque médico). */
const LabelCard: React.FC<{
  title: string;
  enterAtFrame: number;
  left: number;
  top: number;
  rotationDeg: number;
  lines: {text: string; enterAtFrame: number; strike?: boolean}[];
}> = ({title, enterAtFrame, left, top, rotationDeg, lines}) => {
  const frame = useCurrentFrame();
  if (frame < enterAtFrame) return null;
  const enter = interpolate(frame, [enterAtFrame, enterAtFrame + 8], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: 430,
        padding: '28px 30px',
        boxSizing: 'border-box',
        backgroundColor: '#fbfaf6',
        border: `4px solid ${COLORS.ink}`,
        boxShadow: '0 12px 26px rgba(0,0,0,0.18)',
        transform: `rotate(${rotationDeg}deg) translateY(${(1 - enter) * 50}px) scale(${0.9 + enter * 0.1})`,
        opacity: enter,
        fontFamily: FONT_FAMILY,
        fontWeight: FONT_WEIGHT,
        color: COLORS.ink,
      }}
    >
      <div style={{fontSize: 64, lineHeight: 1.1, marginBottom: 14}}>{title}</div>
      {lines.map((l) => {
        const op = interpolate(frame, [l.enterAtFrame, l.enterAtFrame + 6], [0, 1], clamp);
        return (
          <div key={l.text} style={{fontSize: 40, lineHeight: 1.35, opacity: op, color: l.strike ? COLORS.red : COLORS.ink}}>
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** Interruptor: parpadea justo en "flickers" y se queda encendido. */
const SwitchFlicker: React.FC<{usePlaceholder: boolean; flickerAtFrame: number}> = ({usePlaceholder, flickerAtFrame}) => {
  const frame = useCurrentFrame();
  const local = frame - flickerAtFrame;
  const pattern = [1, 0.15, 1, 0.1, 0.9, 0.2, 1, 0.3, 1];
  const opacity = local < 0 ? 1 : local < pattern.length * 2 ? pattern[Math.floor(local / 2)] : 1;
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Cutout assetId="body.lightSwitch" usePlaceholder={usePlaceholder} enterAtFrame={flickerAtFrame - 2}
        width={300} height={282} top={960} left={90} rotationDeg={-3} label="Interruptor de luz" />
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

/** Ruta punteada de la orca mayor hacia la mujer: el grupo la sigue a ella. */
const FollowPath: React.FC<{drawFrom: number}> = ({drawFrom}) => {
  const frame = useCurrentFrame();
  if (frame < drawFrom) return null;
  const draw = interpolate(frame, [drawFrom, drawFrom + 18], [0, 1], clamp);
  const d = 'M 640 800 C 600 880, 560 920, 470 930';
  return (
    <svg width={WIDTH} height={1300} style={{position: 'absolute', top: 0, left: 0}}>
      <defs>
        <mask id="follow-reveal">
          <path d={d} stroke="white" strokeWidth={30} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </mask>
      </defs>
      <path d={d} stroke={COLORS.yellow} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="2 24" mask="url(#follow-reveal)" />
    </svg>
  );
};
