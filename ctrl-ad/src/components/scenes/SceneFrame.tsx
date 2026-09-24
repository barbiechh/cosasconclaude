import React from 'react';
import {Sequence, interpolate, useCurrentFrame} from 'remotion';
import {SceneShell} from '../SceneShell';
import {TimedText} from '../TimedText';
import {LAYOUT, TYPE} from '../../styles/tokens';
import {OVERLAP, ScenePlan} from '../../data/scenes';
import {BODY_KEYWORDS, BodyKeyword, cueFrame} from '../../data/keywords';
import {clamp} from '../kit';

export type SceneProps = {plan: ScenePlan; p: boolean};

/** Palabra clave grande arriba (los captions de abajo llevan el texto completo). */
export const Key: React.FC<{text: string; hi?: string; from: number; to?: number; size?: number; top?: number}> = ({
  text, hi, from, to, size = TYPE.key, top = LAYOUT.topText,
}) => <TimedText text={text} highlight={hi === '' ? undefined : hi ?? text} enterAtFrame={from} exitAtFrame={to} top={top} fontSize={size} maxWidth={900} />;

/** Escena: Sequence + transición de entrada/salida + deriva de cámara + sus palabras clave encima. */
export const Scene: React.FC<{plan: ScenePlan; punches?: number[]; drift?: number; children: React.ReactNode}> = ({plan, punches, drift, children}) => (
  <Sequence from={plan.from} durationInFrames={plan.durationInFrames} name={plan.id}>
    <SceneShell durationInFrames={plan.durationInFrames} enter={plan.enter} exit={plan.exit} punches={punches} drift={drift ?? 0.02}>
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
      {BODY_KEYWORDS.filter((k) => cueFrame(k.from) >= plan.from && cueFrame(k.from) < end).map((k, i) => {
        const from = cueFrame(k.from) - plan.from;
        const to = k.to ? cueFrame(k.to) - plan.from : undefined;
        return k.counter ? (
          <Counter key={i} k={k} from={from} to={to} until={cueFrame(k.counter.until) - plan.from} />
        ) : (
          <Key key={i} text={k.text} hi={k.hi} from={from} to={to} size={k.size} top={k.top} />
        );
      })}
    </>
  );
};

/** Número que corre hasta que se dice (p. ej. LIVES TO 40 -> 90). */
const Counter: React.FC<{k: BodyKeyword; from: number; to?: number; until: number}> = ({k, from, to, until}) => {
  const frame = useCurrentFrame();
  const c = k.counter!;
  const n = Math.round(interpolate(frame, [from, until], [c.from, c.to], clamp));
  return (
    <TimedText text={`${c.prefix ?? ''}${n}${c.suffix ?? ''}`} highlight={String(n)} enterAtFrame={from} exitAtFrame={to}
      top={k.top ?? LAYOUT.topText} fontSize={k.size ?? TYPE.key} maxWidth={900} />
  );
};
