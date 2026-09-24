import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SCENES} from '../data/scenes';
import {Orcas} from './scenes/Orcas';
import {Bridge} from './scenes/Bridge';
import {Fade} from './scenes/Fade';
import {Family} from './scenes/Family';
import {Brain} from './scenes/Brain';
import {Flicker} from './scenes/Flicker';
import {Answers} from './scenes/Answers';
import {Fix} from './scenes/Fix';
import {Recovery} from './scenes/Recovery';
import {Closing} from './scenes/Closing';

export interface BodyProps {
  usePlaceholder: boolean;
}

/**
 * Body: una escena por tramo del guion (orden y cortes en src/data/scenes.ts,
 * cues en src/data/timing.ts, palabras clave en src/data/keywords.ts).
 * No hay fotografías de personas: las mujeres son figuras ilustradas.
 */
export const Body: React.FC<BodyProps> = ({usePlaceholder: p}) => (
  <AbsoluteFill>
    <Orcas plan={SCENES.orcas} p={p} />
    <Bridge plan={SCENES.bridge} p={p} />
    <Fade plan={SCENES.fade} p={p} />
    <Family plan={SCENES.family} p={p} />
    <Brain plan={SCENES.brain} p={p} />
    <Flicker plan={SCENES.flicker} p={p} />
    <Answers plan={SCENES.answers} p={p} />
    <Fix plan={SCENES.fix} p={p} />
    <Recovery plan={SCENES.recovery} p={p} />
    <Closing plan={SCENES.closing} p={p} />
  </AbsoluteFill>
);
