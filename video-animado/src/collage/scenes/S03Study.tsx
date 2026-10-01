import React, {useMemo} from 'react';
import {getLength, getPointAtLength} from '@remotion/paths';
import {AbsoluteFill, interpolate} from 'remotion';
import {Camera, Layer} from '../camera';
import {HOOK, useCues} from '../cues';
import {Mark, MarkLayer, smooth} from '../marks';
import {ease, lerp, place, quick, stick} from '../motion';
import {At, Cutout, PaperBg, Tape, TornPaper} from '../paper';
import {BustSilhouette, Envelope, MagnifierSil, Photo} from '../pieces';
import {LabelStrip} from '../text';
import {K} from '../theme';

// Recorrido de la lupa sobre el bloque verde.
const TRAIL = smooth([[900, 1240], [760, 1120], [900, 980], [760, 820], [860, 660]]);
const QMARK = smooth([[780, 900], [800, 870], [850, 872], [858, 910], [822, 940], [818, 975]]);

// 4,70–9,60 · "Scientists actually ran the study, and the answer wasn't the one anyone wanted."
export const S03Study: React.FC = () => {
  const {f, fps, c} = useCues(HOOK.study.from);
  const len = useMemo(() => getLength(TRAIL), []);
  const sci = place(f, c(10), fps, 14);
  const mag = ease(f, c(12), c(14) + 18);
  const magP = getPointAtLength(TRAIL, mag * len) ?? {x: 900, y: 1240};
  const env = place(f, c(17), fps, 11);
  const shock = ease(f, c(18), c(18) + 10);
  const zoom = quick(f, 136, 147);
  const cam = {x: lerp(zoom, 0, 280), y: lerp(zoom, 0, 40), s: interpolate(f, [0, 136], [1, 1.04]) + zoom * 1.1, ox: 820, oy: 960};
  return (
    <AbsoluteFill>
      <PaperBg />
      <Camera cam={cam}>
        <Layer depth={0.35}>
          <div style={{position: 'absolute', left: lerp(ease(f, 0, 10), 760, 600), top: 300, rotate: '3deg'}}>
            <TornPaper w={540} h={1260} color={K.green} seed="s3-green" rough={[10, 4, 10, 10]} />
          </div>
          <div style={{position: 'absolute', left: 60, top: 300, rotate: '-6deg', opacity: ease(f, 0, 6)}}>
            <TornPaper w={420} h={120} color={K.red} seed="s3-red" rough={[4, 10, 4, 10]} />
          </div>
        </Layer>

        {/* rastro punteado de la lupa */}
        <Layer depth={0.9}>
          <MarkLayer>
            {Array.from({length: 26}, (_, i) => {
              const t = i / 25;
              if (t > mag) return null;
              const p = getPointAtLength(TRAIL, t * len);
              return p ? <circle key={i} cx={p.x} cy={p.y} r={7} fill={K.ink} opacity={0.7} /> : null;
            })}
          </MarkLayer>
          <At x={magP.x + 40} y={magP.y + 40} style={{opacity: ease(f, c(12) - 4, c(12) + 2), rotate: '-14deg'}}>
            <Cutout thin>
              <MagnifierSil width={240} />
            </Cutout>
          </At>
        </Layer>

        {/* investigador/a en primer plano, sale por el borde */}
        <Layer depth={1.05}>
          <At x={lerp(shock, 330, 300)} y={lerp(sci, 2600, 1440)} style={{rotate: `${lerp(shock, -2, -5)}deg`}}>
            <Cutout>
              <Photo id="scientist" width={820} bw tagX={58} tagW={62} />
            </Cutout>
          </At>
        </Layer>

        {/* el resultado llega en un sobre cerrado */}
        <Layer depth={1}>
          <At x={820} y={lerp(env, -600, 960)} style={{rotate: `${lerp(env, -20, 6) + (f > c(18) ? Math.sin(f * 0.9) * 2 * (1 - ease(f, c(18) + 10, c(18) + 30)) : 0)}deg`}}>
            <Cutout>
              <Envelope width={400} />
            </Cutout>
          </At>
          {f >= c(17) + 6 ? <Tape x={820} y={800} rot={-8} w={130} /> : null}
          <MarkLayer>
            <Mark d={QMARK} draw={ease(f, c(17) + 6, c(17) + 18)} width={12} />
            <circle cx={818} cy={1000} r={9} fill={K.red} opacity={f >= c(17) + 18 ? 1 : 0} />
          </MarkLayer>
        </Layer>

        <Layer depth={1.12}>
          <LabelStrip text="The study" x={770} y={420} k={stick(f, c(14), fps)} rot={-4} size={110} seed="s3-study" />
          {[600, 790, 980].map((x, i) => (
            <At key={x} x={x} y={lerp(place(f, c(21) + i * 3, fps), 2300, 1840)}>
              <Cutout thin>
                <BustSilhouette width={240} />
              </Cutout>
            </At>
          ))}
          <MarkLayer>
            {[600, 790, 980].map((x, i) => (
              <Mark key={x} d={`M${x - 70} ${1700} L${x + 70} ${1840} M${x + 70} ${1700} L${x - 70} ${1840}`} draw={ease(f, c(22) + i * 3, c(22) + i * 3 + 8)} width={14} />
            ))}
          </MarkLayer>
          <LabelStrip text="Unwanted" x={820} y={1290} k={stick(f, c(22) + 2, fps)} rot={3} bg={K.red} size={110} seed="s3-unw" />
        </Layer>
      </Camera>
    </AbsoluteFill>
  );
};
