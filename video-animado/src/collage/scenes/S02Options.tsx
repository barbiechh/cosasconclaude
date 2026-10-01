import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Camera, Layer} from '../camera';
import {HOOK, useCues} from '../cues';
import {handCircle, Mark, MarkArrow, MarkLayer} from '../marks';
import {ease, lerp, place, stick} from '../motion';
import {At, Cutout, PaperBg, Tape, TornPaper} from '../paper';
import {PaperBrain, Photo} from '../pieces';
import {Headline, LabelStrip} from '../text';
import {K} from '../theme';

// 2,45–4,70 · "Alcohol or stimulants?"
// Dos opciones apiladas: arriba alcohol (papel amarillo), abajo estimulantes (papel azul).
export const S02Options: React.FC = () => {
  const {f, fps, c} = useCues(HOOK.options.from);
  const glass = place(f, c(7), fps, 12);
  const pills = place(f, c(9), fps, 12);
  const toPills = ease(f, c(9) - 4, c(9) + 10);
  const cam = {x: 0, y: lerp(toPills, -40, 60), s: interpolate(f, [0, 68], [1.04, 1]), oy: 960};
  return (
    <AbsoluteFill>
      <PaperBg />
      <Camera cam={cam}>
        <Layer depth={0.3}>
          <div style={{position: 'absolute', left: -60, top: -80}}>
            <TornPaper w={1200} h={1080} color={K.yellow} seed="s2-top" rough={[4, 4, 20, 4]} />
          </div>
          <div style={{position: 'absolute', left: -60, top: 960}}>
            <TornPaper w={1200} h={1100} color={K.blue} seed="s2-bottom" rough={[22, 4, 4, 4]} />
          </div>
        </Layer>

        {/* alcohol */}
        <Layer depth={1}>
          <At x={560} y={lerp(glass, -700, 500)} style={{rotate: `${lerp(glass, 10, -3)}deg`}}>
            <Cutout>
              <Photo id="liquorGlass" width={540} />
            </Cutout>
          </At>
          {f >= c(7) + 4 ? <Tape x={560} y={150} rot={6} w={170} /> : null}
          <LabelStrip text="Alcohol" x={560} y={800} k={stick(f, c(7) + 5, fps)} rot={4} size={120} seed="s2-alc" />
        </Layer>

        {/* estimulantes */}
        <Layer depth={1}>
          <At x={540} y={lerp(pills, 2500, 1420)} style={{rotate: `${lerp(pills, -10, 3)}deg`}}>
            <Cutout>
              <Photo id="pills" width={540} />
            </Cutout>
          </At>
          <LabelStrip text="Stimulants?" x={600} y={1800} k={stick(f, c(9) + 4, fps)} rot={-3} bg={K.yellow} color={K.ink} size={110} seed="s2-sti" />
        </Layer>

        {/* "or" y el cerebro que mira a ambas opciones */}
        <Layer depth={1.15}>
          <At x={900} y={975} style={{rotate: '-6deg'}}>
            <Headline text="OR" size={150} color={K.white} k={stick(f, c(8), fps)} style={{textShadow: '3px 5px 0 rgba(0,0,0,0.25)'}} />
          </At>
          <At x={160} y={980} style={{rotate: '-8deg', opacity: ease(f, 0, 8), scale: lerp(place(f, 2, fps), 0.6, 1)}}>
            <Cutout thin>
              <PaperBrain width={290} />
            </Cutout>
          </At>
          <MarkLayer>
            <Mark d={handCircle(902, 985, 130, 120, 's2or')} draw={ease(f, c(8), c(8) + 12)} width={11} />
            <MarkArrow pts={[[170, 880], [200, 720], [270, 560]]} draw={ease(f, c(7) + 6, c(7) + 18)} width={10} color={K.ink} />
            <MarkArrow pts={[[170, 1080], [200, 1220], [260, 1360]]} draw={ease(f, c(9) + 6, c(9) + 18)} width={10} color={K.white} />
          </MarkLayer>
        </Layer>
      </Camera>
    </AbsoluteFill>
  );
};
