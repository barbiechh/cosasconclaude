import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {Cutout} from './Cutout';
import {TimedText} from './TimedText';
import {DrawnCircle} from './DrawnCircle';
import {SceneShell} from './SceneShell';
import {
  Battery, CalendarFlip, CalmLine, DopamineParticles, EstrogenMolecule, FogLayer, HormoneChart,
  IconChip, JaggedBurst, LabReport, LightBulb, Meter, ScatterWord, Stamp,
} from './graphics';
import {COLORS, FONT_FAMILY, FONT_WEIGHT, LAYOUT} from '../styles/tokens';
import {WIDTH} from '../data/timing';
import {SCENES, ScenePlan} from '../data/scenes';

export interface BodyProps {
  usePlaceholder: boolean;
}

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TOP = LAYOUT.topText;

// Cajas con la proporción de cada imagen.
const POD = {width: 880, height: 523}; // foto 16:9 + borde
const WOMAN_PHOTO = {width: 860, height: 671}; // foto 4:3 + borde
const PH = {width: 720, height: 900}; // fotos nuevas 4:5 + borde

/** Palabra clave grande arriba (los captions de abajo llevan el texto completo). */
const Key: React.FC<{text: string; hi?: string; from: number; to?: number; size?: number; top?: number}> = ({
  text, hi, from, to, size = 78, top = TOP,
}) => <TimedText text={text} highlight={hi ?? text} enterAtFrame={from} exitAtFrame={to} top={top} fontSize={size} />;

/** Escena: Sequence + transición de entrada/salida + deriva de cámara. */
const Scene: React.FC<{plan: ScenePlan; punches?: number[]; children: React.ReactNode}> = ({plan, punches, children}) => (
  <Sequence from={plan.from} durationInFrames={plan.durationInFrames} name={plan.id}>
    <SceneShell durationInFrames={plan.durationInFrames} enter={plan.enter} exit={plan.exit} punches={punches}>
      {children}
    </SceneShell>
  </Sequence>
);

export const Body: React.FC<BodyProps> = ({usePlaceholder: p}) => {
  const {orcas, bridge, fade, brain, answers, fix, recovery, closing} = SCENES;

  return (
    <AbsoluteFill>
      {/* 1. ORCAS */}
      {(() => {
        const at = orcas.at;
        return (
          <Scene plan={orcas} punches={[at('leaderOfPod'), at('fishDisappear')]}>
            <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('aroundForty')} exitAtFrame={at('fishDisappear')}
              {...POD} top={560} left={100} rotationDeg={-1.5} label="Orca mayor y su grupo" />
            <Key text="AROUND 40" hi="40" from={at('aroundForty')} to={at('livesToNinety')} />
            <AgeCounter from={at('livesToNinety')} to={at('thirtyYears')} />
            <Key text="30 YEARS" from={at('thirtyYears')} to={at('leaderOfPod')} />
            <Stamp text="30 YEARS OF DATA" x={250} y={1150} at={at('thirtyYears', 4)} until={at('leaderOfPod')} rotate={-6} color={COLORS.ink} />
            <Key text="THE LEADER" hi="LEADER" from={at('leaderOfPod')} to={at('fishDisappear')} />
            <DrawnCircle enterAtFrame={at('leaderOfPod', 3)} exitAtFrame={at('fishDisappear')} top={715} left={455} size={330} />
            <DisappearingFish p={p} enterAtFrame={at('fishDisappear')} goneAtFrame={at('everyWhaleFollows')} />
            <Key text="THE FISH DISAPPEAR" hi="DISAPPEAR" from={at('fishDisappear')} to={at('everyWhaleFollows')} size={70} />
            <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('everyWhaleFollows')} exitAtFrame={at('sheRemembers')}
              {...POD} top={560} left={100} rotationDeg={1.5} fromX={-260} fromY={0} label="El grupo sigue a la orca mayor" />
            <FollowArrows from={at('everyWhaleFollows', 4)} to={at('sheRemembers')} />
            <Key text="FOLLOWS HER" hi="HER" from={at('everyWhaleFollows')} to={at('sheRemembers')} />
            <RouteToFood p={p} startFrame={at('sheRemembers')} />
            <Key text="SHE REMEMBERS" hi="REMEMBERS" from={at('sheRemembers')} to={at('twentyYearsAgo')} />
            <Key text="20 YEARS AGO" from={at('twentyYearsAgo')} />
          </Scene>
        );
      })()}

      {/* 2. PUENTE */}
      {(() => {
        const at = bridge.at;
        return (
          <Scene plan={bridge} punches={[at('worstVersion')]}>
            <Key text="WOMAN ≠ WHALE" hi="≠" from={at('obviously')} to={at('butIfABrain')} />
            <Desaturate from={at('worstVersion')} amount={0.75}>
              <Cutout assetId="body.womanMidlifeDaily" usePlaceholder={p} enterAtFrame={at('obviously', 6)}
                {...WOMAN_PHOTO} top={560} left={110} rotationDeg={-1.5} fromX={300} fromY={0} label="Mujer en su día a día" />
            </Desaturate>
            <Cutout assetId="hook.orca" usePlaceholder={p} enterAtFrame={at('obviously')} exitAtFrame={at('butIfABrain')}
              width={300} height={316} top={440} left={60} rotationDeg={-10} fromX={-200} label="Orca" />
            <Cutout assetId="body.brainDiagram" usePlaceholder={p} enterAtFrame={at('butIfABrain')} exitAtFrame={at('worstVersion')}
              width={360} height={240} top={450} left={640} rotationDeg={8} fromX={200} fromY={-100} label="Cerebro" />
            <Key text="AT ITS BEST" hi="BEST" from={at('atItsBest')} to={at('worstVersion')} />
            <Stamp text="PEAK" x={700} y={1150} at={at('atItsBest', 3)} until={at('worstVersion')} color={COLORS.green} />
            <Key text="THE WORST VERSION?" hi="WORST" from={at('worstVersion')} size={70} />
            <DrawnCircle enterAtFrame={at('worstVersion', 4)} top={610} left={318} size={300} color={COLORS.red} />
          </Scene>
        );
      })()}

      {/* 3. SLOW FADE: un plano por cada cosa que se va */}
      {(() => {
        const at = fade.at;
        return (
          <Scene plan={fade} punches={[at('snapsWord')]}>
            <Desaturate from={at('slowFade')} to={at('firstTheFocus')} amount={0.85} blurPx={2}>
              <Cutout assetId="body.womanFocusFade" usePlaceholder={p} enterAtFrame={0} exitAtFrame={at('firstTheFocus', 4)}
                {...PH} top={450} left={180} rotationDeg={1} label="La misma mujer" />
            </Desaturate>
            <Key text="A SLOW FADE" hi="FADE" from={at('slowFade')} to={at('firstTheFocus')} />

            <BlurOut from={at('focusGoes', 6)} to={at('wordsGo')}>
              <Cutout assetId="fade.focus" usePlaceholder={p} enterAtFrame={at('firstTheFocus')} exitAtFrame={at('wordsGo', 2)}
                {...PH} top={450} left={160} zoom={1.25} focus="40% 30%" rotationDeg={-2} fromX={500} fromY={0} label="Foco: frente a la laptop" />
            </BlurOut>
            <Key text="FOCUS" from={at('focusGoes')} to={at('wordsGo')} size={96} />
            <IconChip kind="focus" label="focus" x={60} y={960} enterAt={at('focusGoes')} flyOutAt={at('focusGoes', 16)} until={at('wordsGo')} fromX={-300} />

            <Cutout assetId="fade.words" usePlaceholder={p} enterAtFrame={at('wordsGo')} exitAtFrame={at('driveGoes', 2)}
              {...PH} top={470} left={200} zoom={1.1} focus="55% 35%" rotationDeg={2.5} fromX={-500} fromY={0} label="Palabras: a media conversación" />
            <ScatterWord text="words" x={300} y={960} enterAt={at('wordsGo')} scatterAt={at('wordsGo', 10)} until={at('driveGoes')} />
            <Key text="WORDS" from={at('wordsGo')} to={at('driveGoes')} size={96} />

            <Cutout assetId="fade.drive" usePlaceholder={p} enterAtFrame={at('driveGoes')} exitAtFrame={at('snaps', 2)}
              {...PH} top={450} left={170} zoom={1.35} focus="45% 60%" rotationDeg={-1.5} fromX={0} fromY={500} label="Empuje: sin energía" />
            <Battery x={560} y={1030} w={300} enterAt={at('driveGoes')} until={at('snaps', 14)} from={0.75} to={0.04} changeFrom={at('driveGoes', 2)} changeTo={at('snaps', 10)} />
            <Key text="DRIVE" from={at('driveGoes')} to={at('snaps')} size={96} />

            <Shake at={at('snapsWord')}>
              <Cutout assetId="fade.snaps" usePlaceholder={p} enterAtFrame={at('snaps')} exitAtFrame={at('creepsIn', 2)}
                {...PH} top={450} left={180} zoom={1.15} focus="45% 35%" rotationDeg={2} fromX={500} fromY={0} label="Estalla con los suyos" />
            </Shake>
            <JaggedBurst cx={540} cy={820} at={at('snapsWord')} radius={330} until={at('creepsIn')} />
            <Key text="SHE SNAPS" hi="SNAPS" from={at('snaps')} to={at('creepsIn')} />

            <CalendarFlip x={330} y={560} enterAt={at('creepsIn')} flipFrom={at('creepsIn', 4)} flipTo={at('sheStarts')} until={at('sheStarts', 4)} />
            <Key text="IT CREEPS IN" hi="CREEPS" from={at('creepsIn')} to={at('overAYear')} />
            <Key text="A YEAR OR TWO" from={at('overAYear')} to={at('sheStarts')} />

            <Cutout assetId="fade.mirror" usePlaceholder={p} enterAtFrame={at('sheStarts')}
              {...PH} top={450} left={180} zoom={1.05} focus="50% 30%" rotationDeg={-1} fromX={0} fromY={0} label="Frente al espejo" />
            <Key text="SHE STARTS TO BELIEVE" hi="BELIEVE" from={at('sheStarts')} to={at('thisIsJustWho')} size={66} />
            <Key text="“JUST WHO SHE IS NOW”" hi="NOW" from={at('thisIsJustWho')} size={64} />
          </Scene>
        );
      })()}

      {/* 4. ESTRÓGENO Y DOPAMINA */}
      {(() => {
        const at = brain.at;
        return (
          <Scene plan={brain} punches={[at('herBrain'), at('flickers'), at('dopamineDips')]}>
            <Cutout assetId="brain.doctor" usePlaceholder={p} enterAtFrame={at('nobodyTellsHer', 4)} exitAtFrame={at('everyoneLooking', 4)}
              {...PH} top={450} left={180} zoom={1.1} focus="50% 40%" rotationDeg={-1.5} label="Consulta médica" />
            <Key text="NOBODY TELLS HER" hi="NOBODY" from={at('nobodyTellsHer')} to={at('everyoneLooking')} />

            <LabReport x={160} y={500} enterAt={at('everyoneLooking')} sweepFrom={at('everyoneLooking', 8)} sweepTo={at('whatTheHormones')} until={at('whatTheHormones', 4)} />
            <Key text="THE HORMONES" hi="HORMONES" from={at('everyoneLooking')} to={at('whatTheHormones')} />

            <BrainTrack p={p} at={at} />
            <Key text="HER BRAIN" hi="BRAIN" from={at('whatTheHormones')} to={at('estrogen')} />

            <EstrogenMolecule x={60} y={560} drawFrom={at('estrogen')} until={at('focusWord')} />
            <Stamp text="2ND JOB" x={170} y={1000} at={at('estrogen', 21)} until={at('forFortyYears')} />
            <Key text="ESTROGEN" from={at('estrogen')} to={at('forFortyYears')} />

            <ConnectArrow drawFrom={at('helpedTheBrain')} until={at('focusWord')} />
            <Key text="40 YEARS" from={at('forFortyYears')} to={at('makeDopamine')} />
            <DopamineParticles cx={790} cy={610} from={at('makeDopamine')} until={at('inPerimenopause')} spread={380} />
            <Key text="DOPAMINE" from={at('makeDopamine')} to={at('focusWord')} size={90} />

            <IconChip kind="focus" label="focus" x={60} y={980} enterAt={at('focusWord')} flyOutAt={at('inPerimenopause')} until={at('inPerimenopause', 16)} fromY={300} />
            <IconChip kind="drive" label="drive" x={420} y={980} enterAt={at('driveWord')} flyOutAt={at('inPerimenopause', 3)} until={at('inPerimenopause', 18)} fromY={300} />
            <IconChip kind="follow" label="follow-through" x={780} y={980} enterAt={at('followThrough')} flyOutAt={at('inPerimenopause', 6)} until={at('inPerimenopause', 22)} fromY={300} />
            <Key text="FOCUS · DRIVE · FOLLOW-THROUGH" hi="FOCUS" from={at('focusWord')} to={at('inPerimenopause')} size={56} />

            <HormoneChart x={100} y={880} appearAt={at('inPerimenopause')} dropAt={at('justDrop')} flickerAt={at('flickers')}
              estrogenDipAt={at('itDips')} dopamineAt={at('everyTimeItDips')} dopamineDipAt={at('dopamineDips')} until={at('thatsTheFog', 2)} />
            <Key text="IT DOESN'T JUST DROP" hi="DROP" from={at('inPerimenopause')} to={at('flickers')} size={70} />
            <LightBulb x={150} y={430} size={250} enterAt={at('inPerimenopause', 6)} flickerAt={at('flickers')} until={at('thatsTheFog', 2)} />
            <SwitchFlicker p={p} enterAt={at('inPerimenopause', 10)} flickerAt={at('flickers')} until={at('thatsTheFog', 2)} />
            <Flash at={at('flickers')} />
            <Key text="IT FLICKERS" hi="FLICKERS" from={at('flickers')} to={at('everyTimeItDips')} />
            <Key text="EVERY TIME IT DIPS" hi="DIPS" from={at('everyTimeItDips')} to={at('dopamineDips')} size={70} />
            <Key text="DOPAMINE DIPS" hi="DIPS" from={at('dopamineDips')} to={at('thatsTheFog')} />

            <Cutout assetId="brain.foggy" usePlaceholder={p} enterAtFrame={at('thatsTheFog')}
              {...PH} top={450} left={180} zoom={1.1} focus="50% 35%" rotationDeg={1.5} fromX={0} fromY={400} label="Tras un vidrio empañado" />
            <FogLayer from={at('thatsTheFog', 2)} />
            <Key text="THE FOG" hi="FOG" from={at('thatsTheFog')} size={96} />
          </Scene>
        );
      })()}

      {/* 5. HRT / ESTIMULANTES */}
      {(() => {
        const at = answers.at;
        return (
          <Scene plan={answers} punches={[at('quietlyStop')]}>
            <Key text="THE USUAL ANSWERS" hi="USUAL" from={at('usualAnswers')} to={at('hrtSorts')} size={70} />
            <LabelCard title="HRT" enterAtFrame={at('hrtSorts')} left={90} top={560} rotationDeg={-3}
              lines={[
                {text: 'sweats ✓', enterAtFrame: at('hrtSorts', 10)},
                {text: 'fog ✗', enterAtFrame: at('leavesTheFog'), strike: true},
              ]} />
            <Key text="HRT" from={at('hrtSorts')} to={at('stimulants')} size={96} />
            <LabelCard title="Stimulants" enterAtFrame={at('stimulants')} left={560} top={760} rotationDeg={3}
              lines={[
                {text: 'push out dopamine', enterAtFrame: at('canOnlyPush')},
                {text: 'already made', enterAtFrame: at('canOnlyPush', 20)},
                {text: 'stop working ✗', enterAtFrame: at('quietlyStop'), strike: true},
              ]} />
            <Key text="STIMULANTS" from={at('stimulants')} to={at('quietlyStop')} />
            <DopamineParticles cx={775} cy={900} from={at('canOnlyPush')} until={at('quietlyStop')} count={12} spread={260} />
            <Key text="THEY STOP WORKING" hi="STOP" from={at('quietlyStop')} size={70} />
            <Stamp text="STOPS WORKING" x={130} y={1130} at={at('quietlyStop', 6)} />
          </Scene>
        );
      })()}

      {/* 6. EL FIX -> CTRL */}
      {(() => {
        const at = fix.at;
        const ctrl = at('ctrl');
        return (
          <Scene plan={fix} punches={[ctrl]}>
            <Key text="NEVER THE FIX" hi="NEVER" from={at('pushingHarder')} to={at('theFixIs')} />
            <Stamp text="PUSH HARDER ✗" x={220} y={760} at={at('pushingHarder', 8)} until={at('theFixIs')} />
            <Key text="THE FIX" hi="FIX" from={at('theFixIs')} to={at('nothingLikeStimulant')} size={90} />
            <DopamineParticles cx={540} cy={800} from={at('theFixIs', 6)} until={at('tyrosine')} count={18} spread={320} mode="in" />
            <Ingredient p={p} assetId="body.tyrosine" name="Tyrosine" enterAtFrame={at('tyrosine')} exitAtFrame={ctrl}
              top={450} imageLeft={70} width={480} height={320} captionX={790} />
            <Ingredient p={p} assetId="body.b6" name="B6" enterAtFrame={at('b6')} exitAtFrame={ctrl}
              top={740} imageLeft={530} width={480} height={320} captionX={290} />
            <Ingredient p={p} assetId="body.calmingPlants" name="2 calming plants" enterAtFrame={at('calmingPlants')} exitAtFrame={ctrl}
              top={1020} imageLeft={70} width={540} height={270} captionX={800} />
            <Key text="NOTHING LIKE A STIMULANT" hi="NOTHING" from={at('nothingLikeStimulant')} to={ctrl} size={60} />
            <DopamineParticles cx={540} cy={800} from={ctrl - 6} until={ctrl + 24} count={24} spread={520} mode="in" rate={1.6} />
            <Cutout assetId="product.ctrlBottle" usePlaceholder={p} enterAtFrame={ctrl}
              width={440} height={660} top={LAYOUT.imageTop} left={(WIDTH - 440) / 2} fromY={160} label="FRASCO REAL DE CTRL — PENDIENTE DE FOTO" />
            <DrawnCircle enterAtFrame={ctrl + 8} top={LAYOUT.imageTop - 40} left={(WIDTH - 560) / 2} size={560} />
            <TimedText text="CTRL" enterAtFrame={ctrl} top={TOP - 10} fontSize={110} />
            <Key text="NOTHING HORMONAL" hi="NOTHING" from={at('nothingHormonal')} top={1190} size={62} />
          </Scene>
        );
      })()}

      {/* 7. RECUPERACIÓN */}
      {(() => {
        const at = recovery.at;
        return (
          <Scene plan={recovery} punches={[at('fogLifts'), at('feelsLikeHerself')]}>
            <Cutout assetId="body.brainDiagram" usePlaceholder={p} enterAtFrame={at('onceTheBrain')} exitAtFrame={at('fogLifts', 2)}
              width={640} height={427} top={600} left={70} label="Cerebro" />
            <DopamineParticles cx={390} cy={810} from={at('onceTheBrain', 4)} until={at('fogLifts')} mode="in" count={30} spread={520} rate={1.3} />
            <Meter x={790} y={560} label="dopamine" enterAt={at('onceTheBrain', 2)} fillFrom={at('onceTheBrain', 6)} fillTo={at('fogLifts')} until={at('fogLifts', 4)} />
            <Key text="DOPAMINE AGAIN" hi="AGAIN" from={at('onceTheBrain')} to={at('fogLifts')} />

            <Cutout assetId="recovery.clear" usePlaceholder={p} enterAtFrame={at('fogLifts', -4)} exitAtFrame={at('driveComesBack', 2)}
              {...PH} top={450} left={180} zoom={1.05} rotationDeg={1} fromY={0} label="Luz clara" />
            <FogLayer from={at('fogLifts', -10)} liftAt={at('fogLifts', 2)} until={at('driveComesBack')} />
            <Key text="THE FOG LIFTS" hi="LIFTS" from={at('fogLifts')} to={at('driveComesBack')} />

            <Cutout assetId="recovery.drive" usePlaceholder={p} enterAtFrame={at('driveComesBack')} exitAtFrame={at('soDoesPatience', 2)}
              {...PH} top={450} left={120} zoom={1.1} rotationDeg={-2.5} fromX={-500} fromY={0} label="Con empuje" />
            <Battery x={600} y={1020} w={300} enterAt={at('driveComesBack', 2)} until={at('soDoesPatience')} from={0.08} to={1} changeFrom={at('driveComesBack', 4)} changeTo={at('soDoesPatience', -4)} />
            <Key text="DRIVE" from={at('driveComesBack')} to={at('soDoesPatience')} size={96} />

            <Cutout assetId="recovery.patience" usePlaceholder={p} enterAtFrame={at('soDoesPatience')} exitAtFrame={at('feelsLikeHerself', 2)}
              {...PH} top={450} left={240} zoom={1.08} rotationDeg={2} fromX={500} fromY={0} label="Riendo con los suyos" />
            <CalmLine x={110} y={1180} from={at('soDoesPatience')} calmAt={at('soDoesPatience', 6)} until={at('feelsLikeHerself')} />
            <Key text="PATIENCE" from={at('soDoesPatience')} to={at('feelsLikeHerself')} size={96} />

            <Cutout assetId="hook.woman" usePlaceholder={p} enterAtFrame={at('feelsLikeHerself')}
              width={440} height={660} top={470} left={(WIDTH - 440) / 2} fromY={200} label="Ella" />
            <IconChip kind="focus" label="focus" x={30} y={520} enterAt={at('feelsLikeHerself', 4)} checked={at('feelsLikeHerself', 10)} fromX={-500} />
            <IconChip kind="words" label="words" x={810} y={640} enterAt={at('feelsLikeHerself', 8)} checked={at('feelsLikeHerself', 14)} fromX={500} />
            <IconChip kind="drive" label="drive" x={40} y={900} enterAt={at('feelsLikeHerself', 12)} checked={at('feelsLikeHerself', 18)} fromX={-500} />
            <Key text="HERSELF AGAIN" hi="HERSELF" from={at('feelsLikeHerself')} />
          </Scene>
        );
      })()}

      {/* 8. CIERRE */}
      {(() => {
        const at = closing.at;
        return (
          <Scene plan={closing} punches={[at('everybodyFollows')]}>
            <Key text="NATURE BUILT THIS" hi="NATURE" from={at('natureBuilt')} to={at('everybodyFollows')} size={70} />
            <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('natureBuilt')}
              width={560} height={333} top={470} left={WIDTH - 610} rotationDeg={3} fromX={260} fromY={0} label="Orca mayor y su grupo" />
            <FollowPath drawFrom={at('makeAWoman', 6)} />
            <Cutout assetId="hook.woman" usePlaceholder={p} enterAtFrame={at('makeAWoman')}
              width={420} height={630} top={640} left={90} rotationDeg={-2} fromX={-260} fromY={0} label="Ella, al frente" />
            <Key text="EVERYBODY FOLLOWS" hi="FOLLOWS" from={at('everybodyFollows')} size={70} />
          </Scene>
        );
      })()}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

/** "LIVES TO 90": el número corre de 40 a 90. */
const AgeCounter: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [from, from + 18], [40, 90], clamp));
  return <TimedText text={`LIVES TO ${n}`} highlight={String(n)} enterAtFrame={from} exitAtFrame={to} top={TOP} fontSize={78} />;
};

/** Desatura (y opcionalmente desenfoca) lo que envuelve a partir de `from`. */
const Desaturate: React.FC<{from: number; to?: number; amount: number; blurPx?: number; children: React.ReactNode}> = ({
  from, to, amount, blurPx = 0, children,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, to ?? from + 20], [0, 1], clamp);
  return (
    <AbsoluteFill style={{filter: `grayscale(${t * amount}) blur(${t * blurPx}px)`, opacity: 1 - t * amount * 0.25}}>{children}</AbsoluteFill>
  );
};

/** Pierde el foco: desenfoque que va y viene. */
const BlurOut: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [from, to], [0, 1], clamp);
  const b = t * (6 + Math.sin(frame / 2.5) * 3);
  return <AbsoluteFill style={{filter: `blur(${b}px)`}}>{children}</AbsoluteFill>;
};

/** Sacudida corta en `at`. */
const Shake: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame - at, [0, 16], [1, 0], clamp) * (frame >= at ? 1 : 0);
  const x = Math.sin(frame * 3.1) * 22 * k;
  const r = Math.sin(frame * 2.3) * 2 * k;
  return <AbsoluteFill style={{transform: `translateX(${x}px) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

/** Destello blanco que parpadea con el foco. */
const Flash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const local = frame - at;
  if (local < 0 || local > 22) return null;
  const pattern = [0.35, 0, 0.28, 0, 0.1, 0.3, 0, 0.18, 0, 0.12, 0];
  return <AbsoluteFill style={{background: 'white', opacity: pattern[Math.floor(local / 2)] ?? 0}} />;
};

/** Cardumen que entra y se desvanece poco a poco antes del siguiente cue. */
const DisappearingFish: React.FC<{p: boolean; enterAtFrame: number; goneAtFrame: number}> = ({p, enterAtFrame, goneAtFrame}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [enterAtFrame + 10, goneAtFrame], [1, 0], clamp);
  const drift = interpolate(frame, [enterAtFrame, goneAtFrame], [0, 140], clamp);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: fade, transform: `translateX(${drift}px)`}}>
      <Cutout assetId="body.fishSchool" usePlaceholder={p} enterAtFrame={enterAtFrame}
        width={900} height={300} top={720} left={90} fromX={-200} fromY={0} label="Cardumen" />
    </div>
  );
};

/** Flechas que avanzan: el grupo sigue a la orca mayor. */
const FollowArrows: React.FC<{from: number; to: number}> = ({from, to}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const local = frame - from;
  return (
    <svg width={WIDTH} height={200} style={{position: 'absolute', left: 0, top: 1130}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = ((local * 9 + i * 200) % 1100) - 60;
        return (
          <path key={i} d={`M ${x} 60 L ${x + 50} 100 L ${x} 140`} fill="none" stroke={COLORS.ink} strokeWidth={12}
            strokeLinecap="round" strokeLinejoin="round" opacity={0.25 + 0.15 * i} />
        );
      })}
    </svg>
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

/**
 * El cerebro de la escena 4: entra grande en "her brain", se hace a un lado
 * para la molécula en "Estrogen" y sale cuando empieza la gráfica.
 */
const BrainTrack: React.FC<{p: boolean; at: ScenePlan['at']}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const enter = at('whatTheHormones');
  const side = at('estrogen');
  const exit = at('inPerimenopause');
  if (frame < enter || frame >= exit) return null;
  const move = interpolate(frame, [side, side + 12], [0, 1], clamp);
  const zoomIn = interpolate(frame, [enter, enter + 10], [0.35, 1], clamp);
  const out = interpolate(frame, [exit - 8, exit], [1, 0], clamp);
  const x = interpolate(move, [0, 1], [180, 590]);
  const y = interpolate(move, [0, 1], [520, 470]);
  const s = interpolate(move, [0, 1], [1, 0.58]) * zoomIn;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 720, height: 480, transform: `scale(${s})`, transformOrigin: 'top left', opacity: out}}>
      <Cutout assetId="body.brainDiagram" usePlaceholder={p} enterAtFrame={enter} width={720} height={480} top={0} left={0} fromY={0} label="Cerebro" />
    </div>
  );
};

/** Flecha que conecta la molécula de estrógeno con el cerebro ("it helped the brain"). */
const ConnectArrow: React.FC<{drawFrom: number; until: number}> = ({drawFrom, until}) => {
  const frame = useCurrentFrame();
  if (frame < drawFrom || frame >= until) return null;
  const draw = interpolate(frame, [drawFrom, drawFrom + 12], [0, 1], clamp);
  const d = 'M 400 700 C 500 640, 560 640, 640 620';
  return (
    <svg width={WIDTH} height={1200} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={d} fill="none" stroke={COLORS.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <path d="M 616 596 L 644 620 L 610 636" fill="none" stroke={COLORS.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={draw > 0.9 ? 1 : 0} />
    </svg>
  );
};

/** Ingrediente con su nombre al lado; la imagen y el nombre salen juntos. */
const Ingredient: React.FC<{
  p: boolean; assetId: string; name: string; enterAtFrame: number; exitAtFrame: number;
  top: number; imageLeft: number; width: number; height: number; captionX: number;
}> = ({p, assetId, name, enterAtFrame, exitAtFrame, top, imageLeft, width, height, captionX}) => {
  const frame = useCurrentFrame();
  // Al revelarse CTRL, cada ingrediente vuela hacia el centro (hacia el frasco).
  const suck = interpolate(frame, [exitAtFrame - 10, exitAtFrame], [0, 1], clamp);
  const cx = imageLeft + width / 2;
  const cy = top + height / 2;
  const dx = (540 - cx) * suck * suck;
  const dy = (800 - cy) * suck * suck;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translate(${dx}px, ${dy}px)`}}>
      <Cutout assetId={assetId} usePlaceholder={p} enterAtFrame={enterAtFrame} exitAtFrame={exitAtFrame}
        width={width} height={height} top={top} left={imageLeft} fromX={imageLeft < WIDTH / 2 ? -160 : 160} fromY={0} label={name} />
      <TimedText text={name} highlight={name} enterAtFrame={enterAtFrame + 4} exitAtFrame={exitAtFrame} top={top + height / 2 - 34}
        centerX={captionX} maxWidth={400} fontSize={name.length > 8 ? 44 : 60} />
    </div>
  );
};

/** Tarjeta tipográfica (en lugar de un empaque médico). */
const LabelCard: React.FC<{
  title: string; enterAtFrame: number; left: number; top: number; rotationDeg: number;
  lines: {text: string; enterAtFrame: number; strike?: boolean}[];
}> = ({title, enterAtFrame, left, top, rotationDeg, lines}) => {
  const frame = useCurrentFrame();
  if (frame < enterAtFrame) return null;
  const enter = interpolate(frame, [enterAtFrame, enterAtFrame + 8], [0, 1], clamp);
  const fromX = left < WIDTH / 2 ? -500 : 500;
  return (
    <div
      style={{
        position: 'absolute', left, top, width: 430, padding: '28px 30px', boxSizing: 'border-box',
        backgroundColor: COLORS.card, border: `4px solid ${COLORS.ink}`, boxShadow: '0 12px 26px rgba(0,0,0,0.18)',
        transform: `translateX(${(1 - enter) * fromX}px) rotate(${rotationDeg + (1 - enter) * 12}deg)`,
        opacity: enter, fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT, color: COLORS.ink,
      }}
    >
      <div style={{fontSize: 64, lineHeight: 1.1, marginBottom: 14}}>{title}</div>
      {lines.map((l) => {
        const op = interpolate(frame, [l.enterAtFrame, l.enterAtFrame + 6], [0, 1], clamp);
        return (
          <div key={l.text} style={{fontSize: 40, lineHeight: 1.35, opacity: op, color: l.strike ? COLORS.red : COLORS.ink,
            transform: `translateX(${(1 - op) * 30}px)`}}>
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** Interruptor: aparece y parpadea justo en "flickers". */
const SwitchFlicker: React.FC<{p: boolean; enterAt: number; flickerAt: number; until: number}> = ({p, enterAt, flickerAt, until}) => {
  const frame = useCurrentFrame();
  if (frame >= until) return null;
  const local = frame - flickerAt;
  const pattern = [1, 0.15, 1, 0.1, 0.9, 0.2, 1, 0.3, 1];
  const opacity = local < 0 ? 1 : local < pattern.length * 2 ? pattern[Math.floor(local / 2)] : 1;
  const flipR = local >= 0 && local < pattern.length * 2 ? (Math.floor(local / 2) % 2 ? 6 : -6) : 0;
  return (
    <div style={{position: 'absolute', inset: 0, opacity}}>
      <Cutout assetId="body.lightSwitch" usePlaceholder={p} enterAtFrame={enterAt}
        width={280} height={264} top={470} left={690} rotationDeg={3 + flipR} fromX={300} fromY={0} label="Interruptor" />
    </div>
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
