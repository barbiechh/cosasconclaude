/**
 * "It's also why the usual answers don't reach it. HRT sorts the sweats and
 * leaves the fog. Stimulants like Adderall can only push out dopamine the
 * brain has already made, which is why they quietly stop working at this age."
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, Pic, easeOut, mix, ramp, springAt} from '../kit';
import {Arrow, Check, Drops, Flow, Fog, Tank} from '../mechanisms';
import {Scene, SceneProps} from './SceneFrame';

type At = SceneProps['plan']['at'];

const HRT_ASPECT = 844 / 1658;
const PILLS_ASPECT = 669 / 417;

export const Answers: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  return (
    <Scene plan={plan} punches={[at('dontReach'), at('sortsWord'), at('stopWord')]}>
      <Beat from={0} to={at('hrtSorts')} enter="fade" exit="fade">
        <DontReach p={p} at={at} />
      </Beat>
      <Beat from={at('hrtSorts')} to={at('stimulants')} enter="left" exit="left">
        <Hrt p={p} at={at} />
      </Beat>
      <Beat from={at('stimulants')} to={plan.durationInFrames} enter="right" exit="fade">
        <Stimulants p={p} at={at} />
      </Beat>
    </Scene>
  );
};

const DontReach: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b1 = springAt(frame, fps, at('usualWord', -4), 12);
  const b2 = springAt(frame, fps, at('usualWord', 2), 12);
  // suben... y se quedan cortas antes de la niebla
  const up = ramp(frame, at('usualWord', 6), at('dontReach'), easeOut);
  const back = ramp(frame, at('dontReach'), at('dontReach', 10));
  const t = up * 0.85 - back * 0.2;
  return (
    <>
      <Pic id="body.brainDiagram" p={p} x={540} y={620} w={400} aspect={1.5} />
      <Fog x={200} y={420} w={680} h={450} amount={0.9} t={frame} />
      <Arrow a={[330, 1000]} b={[470, 800]} t={t} width={14} color={COLORS.inkSoft} />
      <Arrow a={[760, 1030]} b={[610, 800]} t={t} width={14} color={COLORS.inkSoft} />
      {b1 > 0 && <Pic id="body.hrtBottle" p={p} x={320} y={1150} w={170} aspect={HRT_ASPECT} scale={b1} />}
      {b2 > 0 && <Pic id="body.stimulantBottle" p={p} x={770} y={1170} w={300} aspect={PILLS_ASPECT} scale={b2} />}
    </>
  );
};

const Hrt: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drops = springAt(frame, fps, at('hrtSorts', 8), 12);
  const sorted = ramp(frame, at('sortsWord', 4), at('sortsWord', 14));
  const brain = springAt(frame, fps, at('leavesTheFog', -6), 12);
  return (
    <>
      <Pic id="body.hrtBottle" p={p} x={300} y={900} w={330} aspect={HRT_ASPECT} rot={-3} />
      {drops > 0 && <Drops cx={760} cy={650} size={170 * drops} opacity={1 - sorted * 0.7} />}
      <Check cx={840} cy={590} size={120} t={sorted} />
      {brain > 0 && (
        <>
          <Pic id="body.brainDiagram" p={p} x={760} y={1060} w={320} aspect={1.5} scale={brain} />
          <Fog x={560} y={900} w={420} h={320} amount={brain * 0.9} t={frame} />
        </>
      )}
    </>
  );
};

const Stimulants: React.FC<{p: boolean; at: At}> = ({p, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tank = springAt(frame, fps, at('adderall', -6), 12);
  const push1 = frame >= at('pushOut', -6) && frame < at('alreadyMade', 14);
  const push2 = frame >= at('quietlyStop') && frame < at('stopWord', 10);
  const stalled = ramp(frame, at('stopWord'), at('stopWord', 16));
  const amp = push2 ? mix(1, 0.15, stalled) : 1;
  const ram = push1 || push2 ? Math.abs(Math.sin((frame - at('pushOut')) / 3.2)) * 70 * amp : 0;
  const level = mix(0.5, 0.06, ramp(frame, at('pushOut'), at('alreadyMade', 12), (t) => t));
  const out = push1 ? 1 : 0;
  const grey = stalled;
  return (
    <>
      <div style={{position: 'absolute', inset: 0, filter: grey > 0 ? `grayscale(${grey})` : undefined}}>
        <Pic id="body.stimulantBottle" p={p} x={280} y={1010} w={400} aspect={PILLS_ASPECT} />
        {/* el émbolo empuja hacia el depósito */}
        <div style={{position: 'absolute', left: 400 + ram, top: 830, width: 150, height: 56, borderRadius: 12, background: COLORS.red, border: `7px solid ${COLORS.ink}`}} />
        <div style={{position: 'absolute', left: 330, top: 848, width: 80 + ram, height: 20, background: COLORS.ink, borderRadius: 10}} />
      </div>
      {tank > 0 && (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${tank})`, transformOrigin: '760px 900px'}}>
          <Tank cx={760} cy={900} w={260} h={420} level={level} />
        </div>
      )}
      {out > 0 && <Flow path={[[760, 690], [760, 560], [860, 520], [960, 470]]} t={frame} count={8} speed={30} opacity={Math.min(1, level * 3)} seed="st" />}
    </>
  );
};
