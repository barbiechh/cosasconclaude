import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Camera, Layer} from '../camera';
import {HOOK, useCues} from '../cues';
import {Mark, MarkArrow, MarkLayer, smooth} from '../marks';
import {ease, lerp, place, quick, stick} from '../motion';
import {At, Cutout, PaperBg, Tape, TornPaper} from '../paper';
import {HeadProfile, PaperBrain, Photo} from '../pieces';
import {Headline, LabelStrip} from '../text';
import {K} from '../theme';

// 11,00–15,80 · "It sounds backwards, but once you understand why, it makes complete sense."
export const S05Backwards: React.FC = () => {
  const {f, fps, c} = useCues(HOOK.backwards.from);
  // La cámara entra siguiendo la flecha de la escena anterior (de arriba abajo).
  const follow = ease(f, 0, 22);
  const cam = {x: 0, y: lerp(follow, -700, 0) + interpolate(f, [22, 144], [0, 30]), s: interpolate(f, [22, 144], [1, 1.04]), oy: 1100};
  const strip = place(f, c(28), fps, 12);
  const flip = quick(f, c(32), c(32) + 10); // espejo -> lectura correcta
  const head = place(f, 6, fps, 14);
  const glow = ease(f, c(36), c(37) + 6);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Camera cam={cam}>
        <Layer depth={0.35}>
          <div style={{position: 'absolute', left: 660, top: 230, rotate: '5deg'}}>
            <TornPaper w={460} h={560} color={K.yellow} seed="s5-y" rough={[10, 4, 10, 10]} />
          </div>
          <div style={{position: 'absolute', left: 620, top: 1380, rotate: '-4deg', opacity: ease(f, c(35) - 4, c(35) + 6)}}>
            <TornPaper w={520} h={520} color={K.green} seed="s5-g" rough={[10, 4, 10, 10]} />
          </div>
        </Layer>

        <Layer depth={0.95}>
          <At x={860} y={520} style={{rotate: '7deg'}}>
            <Cutout>
              <Photo id="liquorGlass" width={330} />
            </Cutout>
          </At>
          <Tape x={860} y={300} rot={-10} w={140} />
        </Layer>

        {/* cabeza con el cerebro, entra desde abajo a la izquierda */}
        <Layer depth={1.05}>
          <div style={{position: 'absolute', left: lerp(head, -800, -130), top: 900}}>
            <Cutout>
              <HeadProfile width={900}>
                <div style={{position: 'absolute', left: 210, top: 176, rotate: '-4deg'}}>
                  <Cutout thin>
                    <PaperBrain width={570} glow={glow} />
                  </Cutout>
                </div>
              </HeadProfile>
            </Cutout>
          </div>
        </Layer>

        {/* BACKWARDS en espejo que se endereza al "understand" */}
        <Layer depth={1.12}>
          <div style={{position: 'absolute', left: 40, top: lerp(strip, -400, 780), rotate: '-3deg', opacity: strip > 0 ? 1 : 0}}>
            <TornPaper w={1000} h={270} color={K.blue} seed="s5-b" rough={[6, 10, 6, 10]}>
              <div style={{scale: `${interpolate(flip, [0, 0.5, 1], [-1, 0, 1])} 1`}}>
                <Headline text="BACKWARDS" size={215} color={K.white} />
              </div>
            </TornPaper>
          </div>
          <LabelStrip text="Why?" x={230} y={560} k={stick(f, c(33), fps)} rot={-7} bg={K.yellow} color={K.ink} size={130} seed="s5-why" />
          <LabelStrip text="Makes sense" x={690} y={1780} k={stick(f, c(35), fps)} rot={-3} bg={K.ink} size={110} seed="s5-sense" />
        </Layer>

        <Layer depth={1.15}>
          <MarkLayer>
            <MarkArrow pts={[[880, -520], [950, -200], [880, 120], [870, 300]]} draw={ease(f, 0, 18)} width={13} />
            <MarkArrow pts={[[720, 700], [960, 900], [880, 1130], [600, 1220]]} draw={ease(f, c(33), c(33) + 20)} width={13} />
            <Mark d={smooth([[650, 1450], [770, 1590], [1000, 1280]])} draw={ease(f, c(36), c(36) + 14)} color={K.ink} width={40} />
            <Mark d={smooth([[650, 1450], [770, 1590], [1000, 1280]])} draw={ease(f, c(36) + 2, c(36) + 16)} color={K.white} width={18} />
          </MarkLayer>
        </Layer>
      </Camera>
    </AbsoluteFill>
  );
};
