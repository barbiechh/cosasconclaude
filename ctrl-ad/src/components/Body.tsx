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
import {OVERLAP, SCENES, ScenePlan} from '../data/scenes';
import {BODY_KEYWORDS, BodyKeyword, cueFrame} from '../data/keywords';
import {hasAsset} from '../data/assets';

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
const Key: React.FC<{text: string; hi?: string; from: number; to?: number; size?: number; top?: number; width?: number}> = ({
  text, hi, from, to, size = 78, top = TOP, width,
}) => <TimedText text={text} highlight={hi === '' ? undefined : hi ?? text} enterAtFrame={from} exitAtFrame={to} top={top} fontSize={size} maxWidth={width} />;

/** Escena: Sequence + transición de entrada/salida + deriva de cámara. */
const Scene: React.FC<{plan: ScenePlan; punches?: number[]; children: React.ReactNode}> = ({plan, punches, children}) => (
  <Sequence from={plan.from} durationInFrames={plan.durationInFrames} name={plan.id}>
    <SceneShell durationInFrames={plan.durationInFrames} enter={plan.enter} exit={plan.exit} punches={punches}>
      {children}
      <SceneKeywords plan={plan} />
    </SceneShell>
  </Sequence>
);

/** Palabras clave (src/data/keywords.ts) que caen dentro de esta escena. */
const SceneKeywords: React.FC<{plan: ScenePlan}> = ({plan}) => {
  const end = plan.from + plan.durationInFrames - OVERLAP;
  return (
    <>
      {BODY_KEYWORDS.filter((k) => cueFrame(k.from) >= plan.from && cueFrame(k.from) < end).map((k) => {
        const from = cueFrame(k.from) - plan.from;
        const to = k.to ? cueFrame(k.to) - plan.from : undefined;
        return k.counter ? (
          <Counter key={k.text} k={k} from={from} to={to} />
        ) : (
          <Key key={k.text} text={k.text} hi={k.hi} from={from} to={to} size={k.size} top={k.top} width={k.width} />
        );
      })}
    </>
  );
};

/** "LIVES TO 90": el número corre. */
const Counter: React.FC<{k: BodyKeyword; from: number; to?: number}> = ({k, from, to}) => {
  const frame = useCurrentFrame();
  const c = k.counter!;
  const n = Math.round(interpolate(frame, [from, from + 18], [c.from, c.to], clamp));
  return <TimedText text={`${c.prefix}${n}`} highlight={String(n)} enterAtFrame={from} exitAtFrame={to} top={k.top ?? TOP} fontSize={k.size ?? 78} />;
};

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
            <Stamp text="30 YEARS OF DATA" x={250} y={1150} at={at('thirtyYears', 4)} until={at('leaderOfPod')} rotate={-6} color={COLORS.ink} />
            <DrawnCircle enterAtFrame={at('leaderOfPod', 3)} exitAtFrame={at('fishDisappear')} top={715} left={455} size={330} />
            <DisappearingFish p={p} enterAtFrame={at('fishDisappear')} goneAtFrame={at('everyWhaleFollows')} />
            <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('everyWhaleFollows')} exitAtFrame={at('sheRemembers')}
              {...POD} top={560} left={100} rotationDeg={1.5} fromX={-260} fromY={0} label="El grupo sigue a la orca mayor" />
            <FollowArrows from={at('everyWhaleFollows', 4)} to={at('sheRemembers')} />
            <RouteToFood p={p} startFrame={at('sheRemembers')} />
          </Scene>
        );
      })()}

      {/* 2. PUENTE */}
      {(() => {
        const at = bridge.at;
        return (
          <Scene plan={bridge} punches={[at('worstVersion')]}>
            <Desaturate from={at('worstVersion')} amount={0.75}>
              <Cutout assetId="body.womanMidlifeDaily" usePlaceholder={p} enterAtFrame={at('obviously', 6)}
                {...WOMAN_PHOTO} top={560} left={110} rotationDeg={-1.5} fromX={300} fromY={0} label="Mujer en su día a día" />
            </Desaturate>
            <Cutout assetId="hook.orca" usePlaceholder={p} enterAtFrame={at('obviously')} exitAtFrame={at('butIfABrain')}
              width={300} height={316} top={440} left={60} rotationDeg={-10} fromX={-200} label="Orca" />
            <Cutout assetId="body.brainDiagram" usePlaceholder={p} enterAtFrame={at('butIfABrain')} exitAtFrame={at('worstVersion')}
              width={360} height={240} top={450} left={640} rotationDeg={8} fromX={200} fromY={-100} label="Cerebro" />
            <Stamp text="PEAK" x={700} y={1150} at={at('atItsBest', 3)} until={at('worstVersion')} color={COLORS.green} />
            <DrawnCircle enterAtFrame={at('worstVersion', 4)} top={610} left={318} size={300} color={COLORS.red} />
          </Scene>
        );
      })()}

      {/* 3. SLOW FADE: un plano por cada cosa que se va (foto si existe; si no, el gráfico en grande) */}
      {(() => {
        const at = fade.at;
        const has = (id: string) => hasAsset(id, p);
        return (
          <Scene plan={fade} punches={[at('snapsWord')]}>
            <Desaturate from={at('slowFade')} to={at('firstTheFocus')} amount={0.85} blurPx={2}>
              <Cutout assetId="body.womanFocusFade" usePlaceholder={p} enterAtFrame={0} exitAtFrame={at('firstTheFocus', 4)}
                {...PH} top={450} left={180} rotationDeg={1} label="Mujer en su día a día" />
            </Desaturate>

            <BlurOut from={at('focusGoes', 6)} to={at('wordsGo')}>
              <Cutout assetId="lost.focus" usePlaceholder={p} enterAtFrame={at('firstTheFocus')} exitAtFrame={at('wordsGo', 2)}
                {...PH} top={450} left={160} rotationDeg={-2} fromX={500} fromY={0} label="Pierde el foco" />
              <Center on={!has('lost.focus')} cx={180} cy={1085} scale={2}>
                <IconChip kind="focus" label="focus" x={60} y={960} enterAt={at('focusGoes')} flyOutAt={at('focusGoes', 16)} until={at('wordsGo')} fromX={-300} />
              </Center>
            </BlurOut>

            <Cutout assetId="lost.words" usePlaceholder={p} enterAtFrame={at('wordsGo')} exitAtFrame={at('driveGoes', 2)}
              {...PH} top={470} left={200} rotationDeg={2.5} fromX={-500} fromY={0} label="Se le van las palabras" />
            <Center on={!has('lost.words')} cx={560} cy={1110} scale={1.5}>
              <ScatterWord text="words" x={300} y={960} enterAt={at('wordsGo')} scatterAt={at('wordsGo', 10)} until={at('driveGoes')} />
            </Center>

            <Cutout assetId="lost.drive" usePlaceholder={p} enterAtFrame={at('driveGoes')} exitAtFrame={at('snaps', 2)}
              {...PH} top={450} left={170} rotationDeg={-1.5} fromX={0} fromY={500} label="Sin empuje" />
            <Center on={!has('lost.drive')} cx={725} cy={1135} scale={1.8}>
              <Battery x={560} y={1030} w={300} enterAt={at('driveGoes')} until={at('snaps', 14)} from={0.75} to={0.04} changeFrom={at('driveGoes', 2)} changeTo={at('snaps', 10)} />
            </Center>

            <Shake at={at('snapsWord')}>
              <Cutout assetId="lost.patience" usePlaceholder={p} enterAtFrame={at('snaps')} exitAtFrame={at('creepsIn', 2)}
                {...PH} top={450} left={180} rotationDeg={2} fromX={500} fromY={0} label="Pierde la paciencia" />
              {!has('lost.patience') && (
                <Center on cx={480} cy={770} scale={2.2}>
                  <Stamp text="SNAP!" x={330} y={720} at={at('snapsWord')} until={at('creepsIn')} rotate={-8} />
                </Center>
              )}
            </Shake>
            <JaggedBurst cx={540} cy={820} at={at('snapsWord')} radius={330} until={at('creepsIn')} />

            <CalendarFlip x={330} y={560} enterAt={at('creepsIn')} flipFrom={at('creepsIn', 4)} flipTo={at('sheStarts')} until={at('sheStarts', 4)} />

            <Cutout assetId="lost.mirror" usePlaceholder={p} enterAtFrame={at('sheStarts')}
              {...PH} top={450} left={180} rotationDeg={-1} fromX={0} fromY={0} label="No se reconoce en el espejo" />
            {!has('lost.mirror') && <MirrorFrame enterAt={at('sheStarts')} />}
          </Scene>
        );
      })()}

      {/* 4. ESTRÓGENO Y DOPAMINA */}
      {(() => {
        const at = brain.at;
        return (
          <Scene plan={brain} punches={[at('herBrain'), at('flickers'), at('dopamineDips')]}>
            {/* Sin foto del médico, la hoja de análisis entra desde "Nobody tells her". Sin foto de la niebla, la niebla cubre la gráfica. */}
            <Cutout assetId="brain.doctor" usePlaceholder={p} enterAtFrame={at('nobodyTellsHer', 4)} exitAtFrame={at('everyoneLooking', 4)}
              {...PH} top={450} left={180} zoom={1.1} focus="50% 40%" rotationDeg={-1.5} label="Consulta médica" />

            <LabReport x={160} y={500} enterAt={hasAsset('brain.doctor', p) ? at('everyoneLooking') : at('nobodyTellsHer', 4)} sweepFrom={at('everyoneLooking', 8)} sweepTo={at('whatTheHormones')} until={at('whatTheHormones', 4)} />

            <BrainTrack p={p} at={at} />

            <EstrogenMolecule x={60} y={560} drawFrom={at('estrogen')} until={at('focusWord')} />
            <Stamp text="2ND JOB" x={170} y={1000} at={at('estrogen', 21)} until={at('forFortyYears')} />

            <ConnectArrow drawFrom={at('helpedTheBrain')} until={at('focusWord')} />
            <DopamineParticles cx={790} cy={610} from={at('makeDopamine')} until={at('inPerimenopause')} spread={380} />

            <IconChip kind="focus" label="focus" x={60} y={980} enterAt={at('focusWord')} flyOutAt={at('inPerimenopause')} until={at('inPerimenopause', 16)} fromY={300} />
            <IconChip kind="drive" label="drive" x={420} y={980} enterAt={at('driveWord')} flyOutAt={at('inPerimenopause', 3)} until={at('inPerimenopause', 18)} fromY={300} />
            <IconChip kind="follow" label="follow-through" x={780} y={980} enterAt={at('followThrough')} flyOutAt={at('inPerimenopause', 6)} until={at('inPerimenopause', 22)} fromY={300} />

            <HormoneChart x={100} y={880} appearAt={at('inPerimenopause')} dropAt={at('justDrop')} flickerAt={at('flickers')}
              estrogenDipAt={at('itDips')} dopamineAt={at('everyTimeItDips')} dopamineDipAt={at('dopamineDips')} until={hasAsset('brain.foggy', p) ? at('thatsTheFog', 2) : undefined} />
            <LightBulb x={150} y={430} size={250} enterAt={at('inPerimenopause', 6)} flickerAt={at('flickers')} until={hasAsset('brain.foggy', p) ? at('thatsTheFog', 2) : undefined} />
            <SwitchFlicker p={p} enterAt={at('inPerimenopause', 10)} flickerAt={at('flickers')} until={hasAsset('brain.foggy', p) ? at('thatsTheFog', 2) : undefined} />
            <Flash at={at('flickers')} />

            <Cutout assetId="brain.foggy" usePlaceholder={p} enterAtFrame={at('thatsTheFog')}
              {...PH} top={450} left={180} zoom={1.1} focus="50% 35%" rotationDeg={1.5} fromX={0} fromY={400} label="Tras un vidrio empañado" />
            <FogLayer from={at('thatsTheFog', 2)} />
          </Scene>
        );
      })()}

      {/* 5. HRT / ESTIMULANTES */}
      {(() => {
        const at = answers.at;
        return (
          <Scene plan={answers} punches={[at('quietlyStop')]}>
            <LabelCard title="HRT" enterAtFrame={at('hrtSorts')} left={90} top={560} rotationDeg={-3}
              lines={[
                {text: 'sweats ✓', enterAtFrame: at('hrtSorts', 10)},
                {text: 'fog ✗', enterAtFrame: at('leavesTheFog'), strike: true},
              ]} />
            <LabelCard title="Stimulants" enterAtFrame={at('stimulants')} left={560} top={760} rotationDeg={3}
              lines={[
                {text: 'push out dopamine', enterAtFrame: at('canOnlyPush')},
                {text: 'already made', enterAtFrame: at('canOnlyPush', 20)},
                {text: 'stop working ✗', enterAtFrame: at('quietlyStop'), strike: true},
              ]} />
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
            <Stamp text="PUSH HARDER ✗" x={220} y={760} at={at('pushingHarder', 8)} until={at('theFixIs')} />
            <DopamineParticles cx={540} cy={800} from={at('theFixIs', 6)} until={at('tyrosine')} count={18} spread={320} mode="in" />
            <Ingredient p={p} assetId="body.tyrosine" name="Tyrosine" enterAtFrame={at('tyrosine')} exitAtFrame={ctrl}
              top={450} imageLeft={70} width={480} height={320} captionX={790} />
            <Ingredient p={p} assetId="body.b6" name="B6" enterAtFrame={at('b6')} exitAtFrame={ctrl}
              top={740} imageLeft={530} width={480} height={320} captionX={290} />
            <Ingredient p={p} assetId="body.calmingPlants" name="2 calming plants" enterAtFrame={at('calmingPlants')} exitAtFrame={ctrl}
              top={1020} imageLeft={70} width={540} height={270} captionX={800} />
            <DopamineParticles cx={540} cy={800} from={ctrl - 6} until={ctrl + 24} count={24} spread={520} mode="in" rate={1.6} />
            <Cutout assetId="product.ctrlBottle" usePlaceholder={p} enterAtFrame={ctrl}
              width={440} height={660} top={LAYOUT.imageTop} left={(WIDTH - 440) / 2} fromY={160} label="FRASCO REAL DE CTRL — PENDIENTE DE FOTO" />
            <DrawnCircle enterAtFrame={ctrl + 8} top={LAYOUT.imageTop - 40} left={(WIDTH - 560) / 2} size={560} />
          </Scene>
        );
      })()}

      {/* 7. RECUPERACIÓN: lo que se fue vuelve (foto si existe; si no, el gráfico en grande) */}
      {(() => {
        const at = recovery.at;
        const has = (id: string) => hasAsset(id, p);
        const herself = at('feelsLikeHerself');
        const withPhoto = has('back.herself');
        return (
          <Scene plan={recovery} punches={[at('fogLifts'), herself]}>
            <Cutout assetId="body.brainDiagram" usePlaceholder={p} enterAtFrame={at('onceTheBrain')} exitAtFrame={at('fogLifts', 2)}
              width={640} height={427} top={600} left={70} label="Cerebro" />
            <DopamineParticles cx={390} cy={810} from={at('onceTheBrain', 4)} until={at('fogLifts')} mode="in" count={30} spread={520} rate={1.3} />
            <Meter x={790} y={560} label="dopamine" enterAt={at('onceTheBrain', 2)} fillFrom={at('onceTheBrain', 6)} fillTo={at('fogLifts')} until={at('fogLifts', 4)} />

            <Cutout assetId="back.focus" usePlaceholder={p} enterAtFrame={at('fogLifts', -4)} exitAtFrame={at('driveComesBack', 2)}
              {...PH} top={450} left={180} rotationDeg={1} fromY={0} label="Recupera el foco" />
            {!has('back.focus') && (
              <Center on cx={540} cy={680} scale={2}>
                <IconChip kind="focus" label="focus" x={420} y={560} enterAt={at('fogLifts', -4)} checked={at('fogLifts', 8)} until={at('driveComesBack')} />
              </Center>
            )}
            <FogLayer from={at('fogLifts', -10)} liftAt={at('fogLifts', 2)} until={at('driveComesBack')} />

            <Cutout assetId="back.drive" usePlaceholder={p} enterAtFrame={at('driveComesBack')} exitAtFrame={at('soDoesPatience', 2)}
              {...PH} top={450} left={120} rotationDeg={-2.5} fromX={-500} fromY={0} label="Recupera el empuje" />
            <Center on={!has('back.drive')} cx={765} cy={1125} scale={1.8}>
              <Battery x={600} y={1020} w={300} enterAt={at('driveComesBack', 2)} until={at('soDoesPatience')} from={0.08} to={1} changeFrom={at('driveComesBack', 4)} changeTo={at('soDoesPatience', -4)} />
            </Center>

            <Cutout assetId="back.patience" usePlaceholder={p} enterAtFrame={at('soDoesPatience')} exitAtFrame={at('feelsLikeHerself', 2)}
              {...PH} top={450} left={240} rotationDeg={2} fromX={500} fromY={0} label="Recupera la paciencia" />
            <Center on={!has('back.patience')} cx={540} cy={1270} scale={1.15}>
              <CalmLine x={110} y={1180} from={at('soDoesPatience')} calmAt={at('soDoesPatience', 6)} until={at('feelsLikeHerself')} />
            </Center>

            <Cutout assetId="back.herself" usePlaceholder={p} enterAtFrame={herself}
              width={600} height={750} top={460} left={240} fromY={200} label="Vuelve a ser ella" />
            <Recovered p={p} id="back.focus" kind="focus" label="focus" x={withPhoto ? 20 : 60} y={withPhoto ? 520 : 640} enterAt={herself + 4} fromX={-500} />
            <Recovered p={p} id="back.words" kind="words" label="words" x={withPhoto ? 800 : 420} y={withPhoto ? 640 : 640} enterAt={herself + 8} fromX={500} />
            <Recovered p={p} id="back.drive" kind="drive" label="drive" x={withPhoto ? 30 : 780} y={withPhoto ? 920 : 640} enterAt={herself + 12} fromX={withPhoto ? -500 : 500} />
          </Scene>
        );
      })()}

      {/* 8. CIERRE */}
      {(() => {
        const at = closing.at;
        return (
          <Scene plan={closing} punches={[at('everybodyFollows')]}>
            <Cutout assetId="body.orcaLeaderPod" usePlaceholder={p} enterAtFrame={at('natureBuilt')}
              width={560} height={333} top={470} left={WIDTH - 610} rotationDeg={3} fromX={260} fromY={0} label="Orca mayor y su grupo" />
            <FollowPath drawFrom={at('makeAWoman', 6)} />
            <Cutout assetId="hook.woman" usePlaceholder={p} enterAtFrame={at('makeAWoman')}
              width={420} height={630} top={640} left={90} rotationDeg={-2} fromX={-260} fromY={0} label="Ella, al frente" />
          </Scene>
        );
      })()}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

/** Lleva un gráfico al centro del cuadro y lo agranda (cuando falta la foto de ese plano). */
const Center: React.FC<{on: boolean; cx: number; cy: number; scale: number; children: React.ReactNode}> = ({on, cx, cy, scale, children}) =>
  on ? (
    <AbsoluteFill style={{transform: `translate(${WIDTH / 2 - cx}px, ${780 - cy}px) scale(${scale})`, transformOrigin: `${cx}px ${cy}px`}}>
      {children}
    </AbsoluteFill>
  ) : (
    <>{children}</>
  );

/** Lo que vuelve: la foto de "recupera X" con su palomita, o la ficha si esa foto no existe. */
const Recovered: React.FC<{p: boolean; id: string; kind: 'focus' | 'words' | 'drive'; label: string; x: number; y: number; enterAt: number; fromX: number}> = ({
  p, id, kind, label, x, y, enterAt, fromX,
}) => {
  const frame = useCurrentFrame();
  if (!hasAsset(id, p)) return <IconChip kind={kind} label={label} x={x} y={y} enterAt={enterAt} checked={enterAt + 6} fromX={fromX} />;
  const check = interpolate(frame, [enterAt + 6, enterAt + 12], [0, 1], clamp);
  return (
    <>
      <Cutout assetId={id} usePlaceholder={p} enterAtFrame={enterAt} width={260} height={325} top={y} left={x} rotationDeg={fromX < 0 ? -5 : 5} fromX={fromX} fromY={0} label={label} />
      {frame >= enterAt + 6 && (
        <div style={{position: 'absolute', left: x + 200, top: y - 20, width: 80, height: 80, borderRadius: '50%', background: COLORS.green,
          transform: `scale(${check})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT, fontSize: 50}}>✓</div>
      )}
    </>
  );
};

/** Espejo ovalado vacío con un "?" que aparece: no se reconoce. */
const MirrorFrame: React.FC<{enterAt: number}> = ({enterAt}) => {
  const frame = useCurrentFrame();
  if (frame < enterAt) return null;
  const k = interpolate(frame, [enterAt, enterAt + 10], [0, 1], clamp);
  const q = interpolate(frame, [enterAt + 12, enterAt + 30], [0, 1], clamp);
  const shimmer = interpolate((frame - enterAt) % 60, [0, 60], [-200, 700]);
  return (
    <div style={{position: 'absolute', left: 290, top: 470, width: 500, height: 680, transform: `scale(${0.8 + 0.2 * k})`, opacity: k}}>
      <svg width={500} height={680}>
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9eef0" />
            <stop offset="1" stopColor="#c9d2d6" />
          </linearGradient>
          <clipPath id="oval"><ellipse cx={250} cy={340} rx={210} ry={290} /></clipPath>
        </defs>
        <ellipse cx={250} cy={340} rx={235} ry={315} fill={COLORS.card} stroke={COLORS.ink} strokeWidth={10} />
        <ellipse cx={250} cy={340} rx={210} ry={290} fill="url(#glass)" stroke={COLORS.inkSoft} strokeWidth={4} />
        <rect x={shimmer} y={0} width={70} height={680} fill="rgba(255,255,255,0.55)" transform="skewX(-20)" clipPath="url(#oval)" />
        <text x={250} y={420} textAnchor="middle" fontFamily={FONT_FAMILY} fontWeight={FONT_WEIGHT} fontSize={260} fill={COLORS.inkSoft} opacity={0.5 * q}>?</text>
      </svg>
    </div>
  );
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
const SwitchFlicker: React.FC<{p: boolean; enterAt: number; flickerAt: number; until?: number}> = ({p, enterAt, flickerAt, until}) => {
  const frame = useCurrentFrame();
  if (until !== undefined && frame >= until) return null;
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
