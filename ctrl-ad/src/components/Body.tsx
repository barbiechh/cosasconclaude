import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {Cutout} from './Cutout';
import {TimedText} from './TimedText';
import {DrawnCircle} from './DrawnUnderline';
import {COLORS} from '../styles/tokens';
import {bodyCueFrame, WIDTH, TOTAL_FRAMES, HOOK_BODY_CUT_FRAME, BodyCueKey} from '../data/timing';

export interface BodyProps {
  usePlaceholder: boolean;
}

const BODY_TOTAL_FRAMES = TOTAL_FRAMES - HOOK_BODY_CUT_FRAME;

/**
 * Cada escena numerada vive en su propia <Sequence>, delimitada por dos cues
 * de BODY_CUES. Esto es lo que evita que los recortes de una escena se queden
 * pegados encima de la siguiente: al terminar la Sequence, React desmonta su
 * contenido solo. Todos los tiempos siguen saliendo de BODY_CUES vía
 * bodyCueFrame(): no hay números sueltos.
 */
const sceneRange = (startKey: BodyCueKey, endKey: BodyCueKey | null) => {
  const start = bodyCueFrame(startKey);
  const end = endKey ? bodyCueFrame(endKey) : BODY_TOTAL_FRAMES;
  return {from: start, durationInFrames: Math.max(1, end - start)};
};

export const Body: React.FC<BodyProps> = ({usePlaceholder}) => {
  const orcas = sceneRange('aroundForty', 'obviouslyNotAWhale');
  const bridge = sceneRange('obviouslyNotAWhale', 'slowFadeIntro');
  const slowFade = sceneRange('slowFadeIntro', 'nobodyTellsHer');
  const estrogen = sceneRange('nobodyTellsHer', 'usualAnswersDontReach');
  const hrtAdderall = sceneRange('usualAnswersDontReach', 'pushingHarderNeverFix');
  const ctrlReveal = sceneRange('pushingHarderNeverFix', 'brainBuildingDopamineAgain');
  const recovery = sceneRange('brainBuildingDopamineAgain', 'natureBuiltThisStage');
  const closing = sceneRange('natureBuiltThisStage', null);

  // offset relativo: cue absoluto (en frames de Body) menos el inicio de la escena.
  const rel = (sceneFrom: number, key: BodyCueKey, extra = 0) => bodyCueFrame(key) - sceneFrom + extra;

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* ===== 1. HISTORIA DE LAS ORCAS ===== */}
      <Sequence from={orcas.from} durationInFrames={orcas.durationInFrames} name="Orcas">
        <Cutout
          assetId="body.orcaLeaderPod"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(orcas.from, 'aroundForty')}
          width={760}
          height={520}
          top={420}
          left={(WIDTH - 760) / 2}
          label="LÁMINA — orca líder + pod siguiéndola"
        />
        <TimedText
          text="Around 40, she stops having babies."
          enterAtFrame={rel(orcas.from, 'aroundForty')}
          exitAtFrame={rel(orcas.from, 'livesToNinety') - 2}
          top={220}
          fontSize={46}
        />
        <TimedText
          text="Then lives to 90."
          enterAtFrame={rel(orcas.from, 'livesToNinety')}
          exitAtFrame={rel(orcas.from, 'nobodyCouldWorkOutWhy') - 2}
          top={220}
          fontSize={46}
        />
        <TimedText
          text="30 years of research."
          enterAtFrame={rel(orcas.from, 'followedFamilies30Years')}
          exitAtFrame={rel(orcas.from, 'becomesLeaderOfPod') - 2}
          top={980}
          fontSize={40}
        />
        <TimedText
          text="She becomes the leader of the pod."
          enterAtFrame={rel(orcas.from, 'becomesLeaderOfPod')}
          exitAtFrame={rel(orcas.from, 'whenFishDisappear') - 2}
          top={220}
          fontSize={44}
        />
        <Cutout
          assetId="body.fishSchoolFading"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(orcas.from, 'whenFishDisappear')}
          width={560}
          height={360}
          top={520}
          left={(WIDTH - 560) / 2}
          label="Cardumen de peces desapareciendo"
        />
        <TimedText
          text="Every whale follows her."
          enterAtFrame={rel(orcas.from, 'everyWhaleFollowsHer')}
          exitAtFrame={rel(orcas.from, 'remembersFoodTwentyYearsAgo') - 2}
          top={980}
          fontSize={44}
        />
        <Cutout
          assetId="body.oceanRouteMap"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(orcas.from, 'remembersFoodTwentyYearsAgo')}
          width={640}
          height={420}
          top={480}
          left={(WIDTH - 640) / 2}
          label="Mapa de ruta — recuerda dónde estaba la comida"
        />
      </Sequence>

      {/* ===== 2. PUENTE A LA MUJER ===== */}
      <Sequence from={bridge.from} durationInFrames={bridge.durationInFrames} name="Puente">
        <TimedText
          text="Obviously a woman isn't a whale."
          enterAtFrame={rel(bridge.from, 'obviouslyNotAWhale')}
          exitAtFrame={rel(bridge.from, 'brainAtBestQuestion') - 2}
          top={200}
          fontSize={46}
        />
        <Cutout
          assetId="body.womanMidlifeDaily"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(bridge.from, 'brainAtBestQuestion')}
          width={700}
          height={820}
          top={420}
          left={(WIDTH - 700) / 2}
          label="Mujer de mediana edad — escena cotidiana"
        />
        <TimedText
          text="Why the worst version of herself?"
          enterAtFrame={rel(bridge.from, 'worstVersionOfThemselves')}
          top={1300}
          fontSize={44}
        />
      </Sequence>

      {/* ===== 3. SLOW FADE ===== */}
      <Sequence from={slowFade.from} durationInFrames={slowFade.durationInFrames} name="Slow fade">
        <Cutout
          assetId="body.womanFocusFade"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(slowFade.from, 'slowFadeIntro')}
          width={700}
          height={820}
          top={420}
          left={(WIDTH - 700) / 2}
          label="Mujer con elementos de foco/palabras desprendiéndose"
        />
        <FadingWord text="focus" enterAtFrame={rel(slowFade.from, 'focusGoes')} top={300} left={140} />
        <FadingWord text="words" enterAtFrame={rel(slowFade.from, 'wordsGo')} top={360} left={WIDTH - 380} />
        <FadingWord text="drive" enterAtFrame={rel(slowFade.from, 'driveGoes')} top={1500} left={160} />
        <TimedText
          text='"Just who she is now."'
          enterAtFrame={rel(slowFade.from, 'creepsInOverYear')}
          top={1650}
          fontSize={42}
        />
      </Sequence>

      {/* ===== 4. ESTRÓGENO Y DOPAMINA ===== */}
      <Sequence from={estrogen.from} durationInFrames={estrogen.durationInFrames} name="Estrogeno-dopamina">
        <TimedText
          text="Nobody is looking at what the hormones did for her brain."
          enterAtFrame={rel(estrogen.from, 'nobodyTellsHer')}
          exitAtFrame={rel(estrogen.from, 'estrogenSecondJob') - 2}
          top={180}
          fontSize={40}
          maxWidth={880}
        />
        <Cutout
          assetId="body.brainDiagram"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(estrogen.from, 'estrogenSecondJob')}
          width={520}
          height={520}
          top={460}
          left={(WIDTH - 520) / 2}
          label="Diagrama simple de cerebro"
        />
        <TimedText
          text="Estrogen's second job: helping the brain make dopamine."
          enterAtFrame={rel(estrogen.from, 'fortyYearsDopamine')}
          exitAtFrame={rel(estrogen.from, 'itFlickers') - 2}
          top={1020}
          fontSize={38}
          maxWidth={860}
        />
        <LightSwitchFlicker
          usePlaceholder={usePlaceholder}
          flickerAtFrame={rel(estrogen.from, 'itFlickers')}
        />
        <DopamineDipChart dipAtFrame={rel(estrogen.from, 'dopamineDipsWithIt')} />
        <TimedText
          text="That's the fog."
          enterAtFrame={rel(estrogen.from, 'thatsTheFog')}
          top={1650}
          fontSize={52}
        />
      </Sequence>

      {/* ===== 5. HRT / ADDERALL ===== */}
      <Sequence from={hrtAdderall.from} durationInFrames={hrtAdderall.durationInFrames} name="HRT-Adderall">
        <TimedText
          text="HRT sorts the sweats. Not the fog."
          enterAtFrame={rel(hrtAdderall.from, 'usualAnswersDontReach')}
          exitAtFrame={rel(hrtAdderall.from, 'adderallPushOutDopamine') - 2}
          top={260}
          fontSize={42}
        />
        <Cutout
          assetId="body.hrtIcon"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(hrtAdderall.from, 'hrtSortsSweats')}
          width={280}
          height={280}
          top={520}
          left={140}
          label="HRT (icono genérico)"
        />
        <Cutout
          assetId="body.stimulantIcon"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(hrtAdderall.from, 'adderallPushOutDopamine')}
          width={280}
          height={280}
          top={520}
          left={WIDTH - 420}
          label="Estimulantes (icono genérico)"
        />
        <TimedText
          text="Stimulants stop working at this age."
          enterAtFrame={rel(hrtAdderall.from, 'stopWorkingThisAge')}
          top={900}
          fontSize={40}
        />
      </Sequence>

      {/* ===== 6. TIROSINA / B6 / PLANTAS -> CTRL ===== */}
      <Sequence from={ctrlReveal.from} durationInFrames={ctrlReveal.durationInFrames} name="CTRL reveal">
        <TimedText
          text="Pushing harder was never the fix."
          enterAtFrame={rel(ctrlReveal.from, 'pushingHarderNeverFix')}
          exitAtFrame={rel(ctrlReveal.from, 'tyrosineReveal') - 2}
          top={220}
          fontSize={44}
        />
        <Cutout
          assetId="body.tyrosine"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(ctrlReveal.from, 'tyrosineReveal')}
          width={320}
          height={320}
          top={340}
          left={100}
          label="Tirosina"
        />
        <Cutout
          assetId="body.b6"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(ctrlReveal.from, 'b6AndPlants')}
          width={280}
          height={280}
          top={360}
          left={(WIDTH - 280) / 2}
          label="Vitamina B6"
        />
        <Cutout
          assetId="body.calmingPlants"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(ctrlReveal.from, 'b6AndPlants', 8)}
          width={320}
          height={320}
          top={340}
          left={WIDTH - 420}
          label="2 plantas calmantes"
        />
        <TimedText
          text="Nothing like a stimulant."
          enterAtFrame={rel(ctrlReveal.from, 'feelsNothingLikeStimulant')}
          exitAtFrame={rel(ctrlReveal.from, 'calledItCtrl') - 2}
          top={720}
          fontSize={40}
        />

        {/* Revelación de producto: SOLO con foto real; si no existe, placeholder explícito. */}
        <Cutout
          assetId="product.ctrlBottle"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(ctrlReveal.from, 'calledItCtrl')}
          width={420}
          height={620}
          top={820}
          left={(WIDTH - 420) / 2}
          label="FRASCO REAL DE CTRL — PENDIENTE DE FOTO"
        />
        <DrawnCircle
          enterAtFrame={rel(ctrlReveal.from, 'calledItCtrl', 10)}
          top={800}
          left={(WIDTH - 460) / 2}
          size={460}
        />
        <TimedText
          text="CTRL"
          enterAtFrame={rel(ctrlReveal.from, 'calledItCtrl', 4)}
          exitAtFrame={rel(ctrlReveal.from, 'nothingHormonal') - 2}
          top={1480}
          fontSize={64}
        />
        <TimedText
          text="Nothing hormonal. Sits fine next to HRT."
          enterAtFrame={rel(ctrlReveal.from, 'nothingHormonal')}
          top={1620}
          fontSize={34}
          maxWidth={780}
        />
      </Sequence>

      {/* ===== 7. RECUPERACIÓN ===== */}
      <Sequence from={recovery.from} durationInFrames={recovery.durationInFrames} name="Recuperacion">
        <TimedText
          text="The fog lifts."
          enterAtFrame={rel(recovery.from, 'brainBuildingDopamineAgain')}
          exitAtFrame={rel(recovery.from, 'driveAndPatienceBack') - 2}
          top={260}
          fontSize={50}
        />
        <TimedText
          text="The drive comes back. So does the patience."
          enterAtFrame={rel(recovery.from, 'driveAndPatienceBack')}
          exitAtFrame={rel(recovery.from, 'feelsLikeHerselfAgain') - 2}
          top={900}
          fontSize={40}
        />
        <Cutout
          assetId="body.womanMidlifeDaily"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(recovery.from, 'feelsLikeHerselfAgain')}
          width={700}
          height={820}
          top={420}
          left={(WIDTH - 700) / 2}
          label="Mujer — versión con foco y energía recuperados"
        />
      </Sequence>

      {/* ===== 8. CIERRE: LÍDER + GRUPO CONECTADO CON LA MUJER ===== */}
      <Sequence from={closing.from} durationInFrames={closing.durationInFrames} name="Cierre">
        <TimedText
          text="Nature built her to be the one everybody follows."
          enterAtFrame={rel(closing.from, 'natureBuiltThisStage')}
          exitAtFrame={rel(closing.from, 'ctrlGivesBrainWhatItNeeds') - 2}
          top={200}
          fontSize={38}
          maxWidth={880}
        />
        <Cutout
          assetId="body.orcaLeaderPod"
          usePlaceholder={usePlaceholder}
          enterAtFrame={rel(closing.from, 'ctrlGivesBrainWhatItNeeds')}
          width={640}
          height={440}
          top={1180}
          left={(WIDTH - 640) / 2}
          label="LÁMINA — motivo del líder, conectado con la mujer"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const FadingWord: React.FC<{text: string; enterAtFrame: number; top: number; left: number}> = ({
  text,
  enterAtFrame,
  top,
  left,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterAtFrame;
  if (localFrame < 0) return null;
  const opacity = interpolate(localFrame, [0, 10, 40, 55], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rotate = interpolate(localFrame, [0, 55], [0, -12]);
  const translateY = interpolate(localFrame, [0, 55], [0, 40]);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        opacity,
        transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
        fontFamily: '"Georgia", serif',
        fontStyle: 'italic',
        fontSize: 40,
        color: COLORS.inkSoft,
        textDecoration: 'line-through',
      }}
    >
      {text}
    </div>
  );
};

const LightSwitchFlicker: React.FC<{
  usePlaceholder: boolean;
  flickerAtFrame: number;
}> = ({usePlaceholder, flickerAtFrame}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - flickerAtFrame;
  if (localFrame < 0) return null;

  // Parpadeo rápido de golpes justo en "it flickers", luego se queda encendido.
  const flickerWindow = 20;
  const opacity = localFrame < flickerWindow ? (Math.round(localFrame / 3) % 2 === 0 ? 1 : 0.15) : 1;

  return (
    <div style={{position: 'absolute', top: 1020, left: (WIDTH - 260) / 2, opacity}}>
      <Cutout
        assetId="body.lightSwitch"
        usePlaceholder={usePlaceholder}
        enterAtFrame={flickerAtFrame}
        width={260}
        height={260}
        top={0}
        left={0}
        label="Interruptor / foco parpadeando"
      />
    </div>
  );
};

const DopamineDipChart: React.FC<{dipAtFrame: number}> = ({dipAtFrame}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - dipAtFrame;
  if (localFrame < -20) return null;

  // Línea que va bajando y cae justo en dipAtFrame (localFrame = 0).
  const dipProgress = interpolate(localFrame, [-20, 0, 20], [0, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chartWidth = 700;
  const chartHeight = 220;
  const baseY = 60;
  const dipY = baseY + dipProgress * 120;

  const path = `M 0 ${baseY} L ${chartWidth * 0.4} ${baseY} L ${chartWidth * 0.55} ${dipY} L ${chartWidth} ${dipY}`;

  return (
    <svg
      width={chartWidth}
      height={chartHeight}
      style={{position: 'absolute', top: 1300, left: (WIDTH - chartWidth) / 2}}
    >
      <path d={path} stroke={COLORS.red} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
