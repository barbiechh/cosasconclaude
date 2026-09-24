/**
 * "So pushing harder was never the fix. The fix is giving the brain the thing
 * it builds dopamine from, an amino acid called tyrosine. A small company put
 * it together with a bit of B6 and two calming plants so it feels nothing like
 * a stimulant, and called it CTRL. Nothing hormonal, so it sits fine next to HRT."
 *
 * Cada ingrediente tiene un papel: tirosina = materia prima (bloques), B6 = el
 * engranaje que los convierte, plantas = la línea nerviosa que se calma.
 */
import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Layer, Pic, Pt, easeOut, mix, ramp, springAt} from '../kit';
import {Arrow, Blocks, Check, Cross, Flow, Gear, Rays} from '../mechanisms';
import {Scene, SceneProps} from './SceneFrame';

type At = SceneProps['plan']['at'];

export const CTRL_ASPECT = 690 / 1466;
const HRT_ASPECT = 844 / 1658;

export const Fix: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  return (
    <Scene plan={plan} punches={[at('neverTheFix'), at('tyrosine'), at('b6'), at('ctrl')]}>
      <Beat from={0} to={at('theFixIs')} enter="fade" exit="fade">
        <PushHarder p={p} at={at} />
      </Beat>
      <Beat from={at('theFixIs')} to={at('calledIt', 8)} enter="fade" exit="fade" outFrames={6}>
        <Factory p={p} at={at} />
      </Beat>
      <Beat from={at('calledIt')} to={plan.durationInFrames} enter="fade" exit="fade">
        <Reveal p={p} at={at} />
      </Beat>
    </Scene>
  );
};

const PushHarder: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const harder = ramp(frame, at('harder', -2), at('harder', 8));
  const amp = mix(40, 110, harder);
  const push = Math.abs(Math.sin(frame / 3)) * amp;
  const x = ramp(frame, at('neverTheFix', 2), at('neverTheFix', 16));
  return (
    <>
      <Pic id="body.brainDiagram" p={p} x={760} y={870} w={380} aspect={1.5} rot={Math.sin(frame / 1.5) * push * 0.02} />
      <Arrow a={[100, 870]} b={[430 + push, 870]} t={1} color={COLORS.red} width={mix(22, 34, harder)} />
      <Cross cx={500} cy={870} size={460} t={x} />
    </>
  );
};

const PATH: [Pt, Pt, Pt, Pt] = [[250, 1130], [560, 1180], [640, 760], [720, 690]];

const Factory: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brainIn = springAt(frame, fps, at('theFixIs', 2), 12);
  const glow = ramp(frame, at('givingTheBrain'), at('givingTheBrain', 10));
  const tyro = springAt(frame, fps, at('aminoAcid', 4), 11);
  const b6 = springAt(frame, fps, at('b6', -4), 11);
  const plants = springAt(frame, fps, at('calmingPlants', 2), 11);
  const flowing = frame >= at('buildsDopamine');
  const calm = ramp(frame, at('nothingLikeStimulant', 4), at('stimulantWord', 4));
  // los tres ingredientes se juntan al final
  const gather = ramp(frame, at('calledIt', -8), at('calledIt', 8), (t) => t * t);
  const g = (x: number, y: number): [number, number] => [mix(x, 540, gather), mix(y, 900, gather)];
  const [tx, ty] = g(230, 1130);
  const [bx, by] = g(560, 1100);
  const [px, py] = g(820, 1170);
  const shrink = 1 - gather * 0.7;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - gather}}>
        <Layer>
          <path d={`M ${PATH[0]} C ${PATH[1]} ${PATH[2]} ${PATH[3]}`} fill="none" stroke={COLORS.greyLight} strokeWidth={60} strokeLinecap="round" opacity={ramp(frame, at('buildsDopamine', -8), at('buildsDopamine'))} />
        </Layer>
        {flowing && <Blocks path={PATH} t={frame} count={7} speed={54} convertAt={b6 > 0.5 ? 0.45 : 2} />}
        {flowing && <Flow path={[[760, 560], [820, 480], [900, 470], [990, 420]]} t={frame} count={8} speed={34} seed="fx" />}
        <Rays cx={740} cy={620} r0={170} r1={230} t={glow * 0.6} n={12} spin={frame / 80} />
        <Pic id="body.brainDiagram" p={p} x={740} y={620} w={380} aspect={1.5} scale={brainIn} />
      </div>
      {tyro > 0 && <Pic id="body.tyrosine" p={p} x={tx} y={ty} w={320} aspect={1.5} scale={tyro * shrink} />}
      {b6 > 0 && (
        <>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - gather}}>
            <Gear cx={560} cy={960} r={60} angle={frame * 6} />
          </div>
          <Pic id="body.b6" p={p} x={bx} y={by} w={250} aspect={1.5} scale={b6 * shrink} />
        </>
      )}
      {plants > 0 && (
        <>
          <Pic id="body.calmingPlants" p={p} x={px} y={py} w={330} aspect={2} scale={plants * shrink} />
          <CalmWave cx={820} cy={1010} w={320} calm={calm} opacity={plants * (1 - gather)} frame={frame} />
        </>
      )}
    </>
  );
};

/** Línea nerviosa roja que se vuelve una onda verde tranquila. */
const CalmWave: React.FC<{cx: number; cy: number; w: number; calm: number; opacity: number; frame: number}> = ({cx, cy, w, calm, opacity, frame}) => {
  const d = Array.from({length: 40}, (_, i) => {
    const u = i / 39;
    const jag = (random(`cw-${i}-${Math.floor(frame / 2)}`) - 0.5) * 90 * (1 - calm);
    const wave = Math.sin(u * Math.PI * 3 + frame / 6) * 24 * calm;
    return `${i ? 'L' : 'M'} ${cx - w / 2 + u * w} ${cy + jag + wave}`;
  }).join(' ');
  return (
    <Layer opacity={opacity}>
      <path d={d} fill="none" stroke={calm > 0.5 ? COLORS.green : COLORS.red} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
    </Layer>
  );
};

const Reveal: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = springAt(frame, fps, at('ctrl', -2), 13, 150);
  const flash = Math.max(0, 1 - Math.abs(frame - at('ctrl')) / 6);
  const rays = ramp(frame, at('ctrl', -2), at('ctrl', 16), easeOut);
  const side = ramp(frame, at('sitsFine', -4), at('sitsFine', 12));
  const hrt = springAt(frame, fps, at('sitsFine', 2), 13);
  const ok = ramp(frame, at('nextToHrt'), at('nextToHrt', 12));
  const cx = mix(540, 370, side);
  const w = mix(360, 300, side);
  const h = w / CTRL_ASPECT;
  const baseY = 1250;
  return (
    <>
      {flash > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(255,253,244,${0.85 * flash})`}} />}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - side}}>
        <Rays cx={540} cy={860} r0={260} r1={440} t={rays} n={18} spin={frame / 90} />
      </div>
      <Pic id="product.ctrlBottle" p={p} x={cx} y={baseY - h / 2 + (1 - rise) * 500} w={w} aspect={CTRL_ASPECT} opacity={Math.min(1, rise * 2)} />
      {hrt > 0 && <Pic id="body.hrtBottle" p={p} x={mix(1300, 740, hrt)} y={baseY - 290} w={295} aspect={HRT_ASPECT} />}
      <Check cx={555} cy={640} size={130} t={ok} />
    </>
  );
};
