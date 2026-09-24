import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../styles/tokens';
import {getAssetSlot} from '../data/assets';

export interface CutoutProps {
  assetId: string;
  usePlaceholder: boolean;
  /** frame relativo (0 = primer frame del componente dueño) en el que entra el recorte */
  enterAtFrame: number;
  width: number;
  height?: number;
  top: number;
  left: number;
  rotationDeg?: number;
  zIndex?: number;
  label?: string; // texto corto mostrado en el placeholder
}

/**
 * Recorte editorial (foto o placeholder) con entrada rápida: escala + rotación
 * ligera, resorte corto para que se sienta como un collage cayendo en su
 * lugar, no una animación continua sin propósito.
 */
export const Cutout: React.FC<CutoutProps> = ({
  assetId,
  usePlaceholder,
  enterAtFrame,
  width,
  height,
  top,
  left,
  rotationDeg = 0,
  zIndex = 1,
  label,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - enterAtFrame;

  if (localFrame < 0) return null;

  const entrance = spring({
    frame: localFrame,
    fps,
    config: {damping: 14, stiffness: 160, mass: 0.7},
  });

  const scale = interpolate(entrance, [0, 1], [0.6, 1]);
  const opacity = interpolate(localFrame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const rotation = interpolate(entrance, [0, 1], [rotationDeg - 8, rotationDeg]);

  const slot = getAssetSlot(assetId);
  const showPlaceholder = usePlaceholder || !slot.final;

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height: height ?? width,
        zIndex,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
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
            padding: 12,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.inkSoft,
              lineHeight: 1.3,
            }}
          >
            {label ?? slot.description}
          </span>
        </div>
      ) : (
        <Img
          src={staticFile(slot.final as string)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.25))',
          }}
        />
      )}
    </div>
  );
};
