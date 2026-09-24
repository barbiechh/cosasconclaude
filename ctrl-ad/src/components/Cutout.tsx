import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_WEIGHT} from '../styles/tokens';
import {getAssetSlot} from '../data/assets';

export interface CutoutProps {
  assetId: string;
  usePlaceholder: boolean;
  /** frame relativo (dentro de su Sequence) en que entra el recorte */
  enterAtFrame: number;
  /** frame en que empieza a salir; si se omite, se queda hasta que termina su Sequence */
  exitAtFrame?: number;
  width: number;
  height: number;
  top: number;
  left: number;
  rotationDeg?: number;
  /** dirección desde la que entra, en px (desplazamiento inicial) */
  fromX?: number;
  fromY?: number;
  label?: string;
}

const EXIT_FRAMES = 8;

/**
 * Recorte editorial que cae en su lugar con un resorte corto (escala +
 * rotación + desplazamiento) y sale con un fade rápido cuando otro elemento
 * necesita su espacio.
 */
export const Cutout: React.FC<CutoutProps> = ({
  assetId,
  usePlaceholder,
  enterAtFrame,
  exitAtFrame,
  width,
  height,
  top,
  left,
  rotationDeg = 0,
  fromX = 0,
  fromY = 60,
  label,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - enterAtFrame;
  if (local < 0) return null;
  if (exitAtFrame !== undefined && frame >= exitAtFrame) return null;

  const enter = spring({frame: local, fps, config: {damping: 15, stiffness: 190, mass: 0.6}});
  const exit =
    exitAtFrame === undefined
      ? 0
      : interpolate(frame, [exitAtFrame - EXIT_FRAMES, exitAtFrame], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  const scale = interpolate(enter, [0, 1], [0.82, 1]) * (1 - exit * 0.06);
  const rotation = interpolate(enter, [0, 1], [rotationDeg - 7, rotationDeg]);
  const tx = interpolate(enter, [0, 1], [fromX, 0]);
  const ty = interpolate(enter, [0, 1], [fromY, 0]) - exit * 30;
  const opacity = Math.min(1, local / 4) * (1 - exit);

  const slot = getAssetSlot(assetId);
  const showPlaceholder = usePlaceholder || !slot.final;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        opacity,
        transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rotation}deg)`,
      }}
    >
      {showPlaceholder ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: COLORS.placeholderBg,
            border: `3px dashed ${COLORS.placeholderBorder}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 20,
            boxSizing: 'border-box',
            fontFamily: FONT_FAMILY,
            fontWeight: FONT_WEIGHT,
            fontSize: 24,
            lineHeight: 1.3,
            color: COLORS.inkSoft,
          }}
        >
          {label ?? slot.description}
        </div>
      ) : (
        <Img
          src={staticFile(slot.final as string)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 16px rgba(0,0,0,0.22))',
          }}
        />
      )}
    </div>
  );
};
