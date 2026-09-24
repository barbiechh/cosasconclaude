import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {Cutout} from './Cutout';
import {Headline} from './Headline';
import {DrawnUnderline} from './DrawnUnderline';
import {COLORS} from '../styles/tokens';
import {HOOK_CUES, secToFrame} from '../data/timing';
import {WIDTH, HEIGHT} from '../data/timing';

export interface HookProps {
  usePlaceholder: boolean;
}

/**
 * HOOK 1 — módulo autocontenido y sustituible.
 *
 * Vive siempre en frame 0..duración propia dentro de su propia Sequence
 * (ver Root.tsx / CTRLFinal.tsx), con sus tiempos definidos en HOOK_CUES
 * (relativos a sí mismo). Para crear un Hook2 basta con duplicar este
 * archivo, cambiar el guion/tiempos/audio y apuntar la Sequence del hook
 * al nuevo componente + nuevo archivo de audio: el Body no se toca.
 */
export const Hook1: React.FC<HookProps> = ({usePlaceholder}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const f = {
    women: secToFrame(HOOK_CUES.women.seconds),
    orca: secToFrame(HOOK_CUES.killerWhales.seconds),
    label: secToFrame(HOOK_CUES.perimenopauseLabel.seconds),
    whale: secToFrame(HOOK_CUES.butWhatItDoesToAWhale.seconds),
    opposite: secToFrame(HOOK_CUES.completeOpposite.seconds),
    split: secToFrame(HOOK_CUES.splitComposition.seconds),
    woman: secToFrame(HOOK_CUES.toAWoman.seconds),
  };

  // Separación fuerte de la composición en "complete opposite".
  const splitLocal = frame - f.split;
  const splitProgress = interpolate(splitLocal, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const womanOffsetX = splitProgress * 140; // se va a la derecha
  const orcaOffsetX = -splitProgress * 140; // se va a la izquierda

  // Zoom dramático sobre "woman" al cierre del hook.
  const womanZoomLocal = frame - f.woman;
  const womanZoomScale = interpolate(womanZoomLocal, [0, 25], [1, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dividerOpacity = interpolate(splitLocal, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <PaperBackground />

      {/* Orca — entra a la izquierda, luego se separa más a la izquierda */}
      <div style={{transform: `translateX(${orcaOffsetX}px)`}}>
        <Cutout
          assetId="hook.orca"
          usePlaceholder={usePlaceholder}
          enterAtFrame={f.orca}
          width={520}
          height={420}
          top={520}
          left={60}
          rotationDeg={-4}
          zIndex={2}
          label="ORCA — recorte editorial grande"
        />
      </div>

      {/* Mujer — entra a la derecha, luego se separa más a la derecha, con zoom final */}
      <div
        style={{
          transform: `translateX(${womanOffsetX}px) scale(${womanZoomScale})`,
          transformOrigin: '75% 50%',
        }}
      >
        <Cutout
          assetId="hook.woman"
          usePlaceholder={usePlaceholder}
          enterAtFrame={f.women}
          width={520}
          height={720}
          top={340}
          left={WIDTH - 580}
          rotationDeg={3}
          zIndex={3}
          label="MUJER — recorte editorial grande"
        />
      </div>

      {/* Titular PERIMENOPAUSE */}
      <Headline
        text="PERIMENOPAUSE"
        enterAtFrame={f.label}
        top={140}
        fontSize={84}
        color={COLORS.ink}
      />
      <DrawnUnderline enterAtFrame={f.label + 6} top={236} left={140} width={800} />

      {/* Keyword de apoyo, no subtítulo completo */}
      <Headline
        text="the complete opposite"
        enterAtFrame={f.opposite}
        top={1120}
        fontSize={52}
        color={COLORS.ink}
        maxWidth={820}
      />

      {/* Línea divisoria dura al separar la composición */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: WIDTH / 2 - 3,
          width: 6,
          height: HEIGHT,
          backgroundColor: COLORS.ink,
          opacity: dividerOpacity * 0.85,
          zIndex: 5,
        }}
      />

      {/* Preparación de corte: fundido suave a negro en los últimos frames del hook */}
      <FadeToCut totalFrames={secToFrame(HOOK_CUES.durationSeconds)} fps={fps} />
    </AbsoluteFill>
  );
};

const FadeToCut: React.FC<{totalFrames: number; fps: number}> = ({totalFrames}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [totalFrames - 6, totalFrames], [0, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink, opacity, zIndex: 10, pointerEvents: 'none'}} />
  );
};
