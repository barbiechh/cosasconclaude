/**
 * "Because for a woman, this stage arrives as a slow fade. First the focus
 * goes, then the words, then the drive..."
 * Cada pérdida es un mecanismo que intenta funcionar y falla.
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../styles/tokens';
import {Beat, easeOut, mix, ramp, springAt} from '../kit';
import {Figure} from '../figures';
import {Bar, Gear, Target, TypeLine} from '../mechanisms';
import {Scene, SceneProps} from './SceneFrame';

type At = SceneProps['plan']['at'];

export const Fade: React.FC<SceneProps> = ({plan, p}) => {
  const at = plan.at;
  return (
    <Scene plan={plan} punches={[at('focusGoes'), at('driveGoes', 12)]}>
      <Beat from={0} to={at('firstTheFocus')} enter="fade" exit="fade">
        <SlowFade at={at} />
      </Beat>
      <Beat from={at('firstTheFocus')} to={at('wordsGo', -10)} enter="pop" exit="left">
        <FocusDrifts at={at} />
      </Beat>
      <Beat from={at('wordsGo', -10)} to={at('driveGoes', -12)} enter="right" exit="left">
        <WordsErase at={at} />
      </Beat>
      <Beat from={at('driveGoes', -12)} to={plan.durationInFrames} enter="right" exit="fade">
        <DriveStalls at={at} />
      </Beat>
    </Scene>
  );
};

const SlowFade: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const fade = ramp(frame, at('slowFade', -6), at('firstTheFocus'), (t) => t);
  const items = [[220, 700], [540, 500], [860, 700]].map(([x, y], i) => ({x: x + Math.sin(frame / 14 + i * 2) * 10, y: y + Math.cos(frame / 12 + i) * 10}));
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - fade * 0.65}}>
        <Target cx={items[0].x} cy={items[0].y} r={80} cursor={[0, 0]} lock={1} grey={fade > 0.6 ? 1 : 0} />
        <Gear cx={items[1].x} cy={items[1].y} r={80} angle={frame * 4 * (1 - fade)} grey={fade > 0.6} />
        <TypeLine cx={items[2].x} cy={items[2].y} w={260} text="WORDS" shown={5} caret={false} size={60} color={fade > 0.6 ? COLORS.grey : COLORS.ink} />
      </div>
      <Figure x={540} y={1280} h={700} grey={fade * 0.85} opacity={1 - fade * 0.35} slump={fade * 0.3} />
    </>
  );
};

const FocusDrifts: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const s = at('firstTheFocus');
  const near = ramp(frame, s + 2, at('focusGoes', 6), easeOut);
  const drift = ramp(frame, at('focusGoes', 10), at('wordsGo', -10), (t) => t);
  const wob = Math.sin(frame / 2.3) * 16 + Math.cos(frame / 3.7) * 10;
  const cursor: [number, number] = [
    mix(-420, 26, near) + drift * 300 + wob * drift,
    mix(360, -18, near) + drift * 230 + Math.cos(frame / 2.9) * 14 * drift,
  ];
  // casi se fija: un destello que no llega a cerrar
  const almost = near > 0.95 && drift < 0.1 ? 0.35 : 0;
  return <Target cx={540} cy={870} r={290} cursor={cursor} lock={almost} cursorOpacity={1 - drift * 0.4} />;
};

const WordsErase: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const s = at('wordsGo', -10);
  const w = at('wordsGo');
  const typed = ramp(frame, s + 3, w + 3, (t) => t) * 3.99;
  const erase1 = ramp(frame, w + 5, w + 12, (t) => t);
  const retype = ramp(frame, w + 14, w + 20, (t) => t) * 2.99;
  const erase2 = ramp(frame, w + 22, w + 27, (t) => t);
  const shown = frame < w + 14 ? typed * (1 - erase1) : retype * (1 - erase2);
  const smudge = Math.max(ramp(frame, w + 5, w + 9) - ramp(frame, w + 12, w + 16), ramp(frame, w + 22, w + 25) - ramp(frame, w + 27, w + 30));
  return <TypeLine cx={540} cy={860} w={900} text="WORDS" shown={shown} caret={Math.floor(frame / 6) % 2 === 0} smudge={smudge} size={180} />;
};

const DriveStalls: React.FC<{at: At}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = at('driveGoes', -12);
  const stop = at('driveGoes', 12);
  // velocidad que cae hasta cero; al trabarse, un tirón hacia atrás
  const speed = (f: number) => (f < stop ? mix(14, 0, ramp(f, s + 4, stop, (t) => t * t)) : 0);
  let angle = 0;
  for (let f = s; f < frame; f++) angle += speed(f);
  const jolt = frame >= stop ? -6 * Math.exp(-(frame - stop) / 4) * Math.cos((frame - stop) * 1.4) : 0;
  const stalled = frame >= stop;
  const k = springAt(frame, fps, stop, 8);
  const progress = mix(0.05, 0.36, ramp(frame, s, stop, easeOut));
  return (
    <>
      <Gear cx={540} cy={800} r={230} angle={angle + jolt} teeth={12} grey={stalled} />
      <Bar cx={540} cy={1170} w={760} h={80} value={progress} color={stalled ? COLORS.red : COLORS.yellow} />
      {stalled && (
        <div style={{position: 'absolute', left: 540 + 760 / 2 * (progress * 2 - 1) - 8, top: 1100, width: 16, height: 140, background: COLORS.ink, borderRadius: 8, transform: `scaleY(${k})`}} />
      )}
    </>
  );
};
