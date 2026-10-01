import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Camera, Layer} from '../camera';
import {HOOK, useCues} from '../cues';
import {handCircle, Mark, MarkLayer, smooth} from '../marks';
import {ease, lerp, place, stick} from '../motion';
import {At, Cutout, PaperBg, Tape, TornPaper} from '../paper';
import {HeadProfile, PaperBrain} from '../pieces';
import {Headline, LabelStrip} from '../text';
import {K} from '../theme';

// 0,00–2,45 · "What works better for an ADHD brain?"
// Una cabeza enorme en silueta; en "brain" el cerebro de papel se coloca dentro.
export const S01Question: React.FC = () => {
  const {f, fps, c} = useCues(HOOK.question.from);
  const head = place(f, 2, fps, 14);
  const brain = place(f, c(6), fps, 11);
  const cam = {x: 0, y: interpolate(f, [0, 73], [20, -20]), s: interpolate(f, [0, 73], [1, 1.06]), oy: 900};
  return (
    <AbsoluteFill>
      <PaperBg />
      <Camera cam={cam}>
        {/* fondo: bloque amarillo y recortes de color */}
        <Layer depth={0.35}>
          <div style={{position: 'absolute', left: lerp(ease(f, 0, 14), 1200, 420), top: 300, rotate: '-4deg'}}>
            <TornPaper w={760} h={640} color={K.yellow} seed="s1-yellow" rough={[8, 4, 10, 12]} />
          </div>
          <div style={{position: 'absolute', left: 820, top: 1380, rotate: '9deg', opacity: ease(f, 6, 16)}}>
            <TornPaper w={330} h={90} color={K.blue} seed="s1-blue" rough={[4, 10, 4, 10]} />
          </div>
          <div style={{position: 'absolute', left: 700, top: 1520, rotate: '-14deg', opacity: ease(f, 8, 18)}}>
            <TornPaper w={150} h={150} color={K.green} seed="s1-green" rough={[10, 10, 10, 10]} />
          </div>
        </Layer>

        {/* plano medio: cabeza en silueta con el cerebro */}
        <Layer depth={1}>
          <div style={{position: 'absolute', left: lerp(head, -900, -200), top: 560}}>
            <Cutout>
              <HeadProfile width={1150}>
                <div
                  style={{
                    position: 'absolute',
                    left: 268,
                    top: 224,
                    scale: lerp(Math.max(0, brain), 0.2, 1),
                    rotate: `${lerp(Math.max(0, brain), -25, -4)}deg`,
                    opacity: f >= c(6) - 1 ? 1 : 0,
                  }}
                >
                  <Cutout thin>
                    <PaperBrain width={728} />
                  </Cutout>
                </div>
              </HeadProfile>
            </Cutout>
          </div>
        </Layer>

        {/* titulares */}
        <Layer depth={1.1}>
          <LabelStrip text="What works better?" x={700} y={210} k={stick(f, 3, fps)} rot={-3} size={70} seed="s1-what" />
          <At x={760} y={420} style={{rotate: '-4deg'}}>
            <Headline text="ADHD" size={230} k={stick(f, c(5), fps)} />
          </At>
          <At x={760} y={630} style={{rotate: '-4deg'}}>
            <Headline text="BRAIN?" size={210} k={stick(f, c(6), fps)} />
          </At>
          {f >= c(5) ? <Tape x={500} y={300} rot={-30} /> : null}
        </Layer>

        {/* marcas a mano */}
        <Layer depth={1.15}>
          <MarkLayer>
            <Mark d={smooth([[520, 748], [660, 738], [820, 752], [1010, 730]])} draw={ease(f, c(6) + 2, c(6) + 12)} width={13} />
            <Mark d={handCircle(432, 1040, 420, 300, 's1c')} draw={ease(f, c(6) + 4, c(6) + 18)} width={12} />
          </MarkLayer>
        </Layer>

        {/* primer plano: trama de semitono que sale del borde */}
        <Layer depth={1.4}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: ease(f, 4, 16)}}>
            <defs>
              <pattern id="s1-dots" width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
                <circle cx={11} cy={11} r={6} fill={K.red} />
              </pattern>
            </defs>
            <circle cx={1040} cy={1820} r={260} fill="url(#s1-dots)" />
          </svg>
        </Layer>
      </Camera>
    </AbsoluteFill>
  );
};
