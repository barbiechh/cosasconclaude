import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Camera, Layer} from '../camera';
import {HOOK, useCues} from '../cues';
import {handCircle, Mark, MarkArrow, MarkLayer} from '../marks';
import {ease, lerp, place, stick} from '../motion';
import {At, Cutout, PaperBg, TornPaper} from '../paper';
import {Envelope, Photo} from '../pieces';
import {Headline} from '../text';
import {K} from '../theme';

// Estallido de papel rasgado (estrella irregular).
const burst = (cx: number, cy: number, r: number) => {
  const pts = Array.from({length: 24}, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const rr = i % 2 ? r * 0.72 : r;
    return `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
  });
  return `M${pts.join(' L')} Z`;
};

// 9,60–11,00 · "It was alcohol."  El sobre se rasga y sale el vaso.
export const S04Reveal: React.FC = () => {
  const {f, fps, c} = useCues(HOOK.reveal.from);
  const tear = ease(f, c(23), c(23) + 10);
  const rise = place(f, c(24) - 2, fps, 11);
  const hit = stick(f, c(25), fps);
  const cam = {x: 0, y: 0, s: interpolate(hit, [0, 1], [1.06, 1]), oy: 900};
  return (
    <AbsoluteFill>
      <PaperBg />
      <Camera cam={cam}>
        <Layer depth={0.4}>
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: 'drop-shadow(3px 7px 5px rgba(20,14,6,0.3))'}}>
            <g transform={`translate(540 760) scale(${Math.max(0, hit)}) translate(-540 -760)`}>
              <path d={burst(540, 760, 620)} fill={K.white} />
              <path d={burst(540, 760, 600)} fill={K.yellow} />
            </g>
          </svg>
        </Layer>
        <Layer depth={1}>
          <At x={540} y={lerp(rise, 1250, 720)} style={{rotate: `${lerp(rise, 6, -4)}deg`, scale: lerp(rise, 0.7, 1)}}>
            <Cutout>
              <Photo id="liquorGlass" width={600} />
            </Cutout>
          </At>
          <At x={540} y={lerp(ease(f, c(24), c(24) + 14), 1060, 1500)} style={{opacity: 1 - ease(f, c(25) + 4, c(25) + 14)}}>
            <Cutout>
              <Envelope width={860} tear={tear} open={ease(f, c(23) + 6, c(23) + 14)} />
            </Cutout>
          </At>
        </Layer>
        <Layer depth={1.1}>
          <div style={{position: 'absolute', left: 60, top: 1420, rotate: '-3deg', opacity: hit > 0.02 ? 1 : 0, scale: lerp(hit, 1.3, 1)}}>
            <TornPaper w={960} h={300} color={K.white} seed="s4-strip" rough={[6, 8, 6, 8]}>
              <Headline text="ALCOHOL." size={270} />
            </TornPaper>
          </div>
          <MarkLayer>
            <Mark d={handCircle(540, 720, 380, 460, 's4c')} draw={ease(f, c(25) + 3, c(25) + 16)} width={13} />
            <MarkArrow pts={[[860, 1000], [990, 1260], [960, 1760], [880, 2080]]} draw={ease(f, 32, 42)} width={13} />
          </MarkLayer>
        </Layer>
      </Camera>
    </AbsoluteFill>
  );
};
