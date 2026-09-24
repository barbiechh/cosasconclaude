import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {Cutout} from './Cutout';
import {TimedText} from './TimedText';
import {COLORS, FONT_FAMILY, FONT_WEIGHT, LAYOUT} from '../styles/tokens';
import {WIDTH} from '../data/timing';
import {resolveAsset} from '../data/assets';

export interface EndCardProps {
  usePlaceholder: boolean;
  /** frames (relativos al inicio de la EndCard) en que se dicen estas frases */
  guaranteeAtFrame: number;
  yourSignAtFrame: number;
}

/** Frasco real de CTRL + garantía de 30 días. Entra en "CTRL just gives her brain...". */
export const EndCard: React.FC<EndCardProps> = ({usePlaceholder, guaranteeAtFrame, yourSignAtFrame}) => {
  const frame = useCurrentFrame();
  const box = interpolate(frame, [guaranteeAtFrame, guaranteeAtFrame + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logo = resolveAsset('product.ctrlLogo', usePlaceholder);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: LAYOUT.topText, left: (WIDTH - 480) / 2, width: 480, height: 130}}>
        {!logo ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              border: `3px dashed ${COLORS.placeholderBorder}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT,
              fontSize: 26,
              color: COLORS.inkSoft,
            }}
          >
            LOGO REAL DE CTRL — PENDIENTE
          </div>
        ) : (
          <Img src={logo.src} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        )}
      </div>

      <Cutout assetId="product.ctrlBottle" usePlaceholder={usePlaceholder} enterAtFrame={4}
        width={380} height={570} top={450} left={(WIDTH - 380) / 2} label="FRASCO REAL DE CTRL — PENDIENTE DE FOTO" />

      <div
        style={{
          position: 'absolute',
          top: 1060,
          left: (WIDTH - 800) / 2,
          width: 800,
          height: 260,
          border: `4px solid ${COLORS.ink}`,
          opacity: box,
          transform: `scale(${0.94 + box * 0.06})`,
        }}
      />
      <TimedText text="30-DAY GUARANTEE" highlight="30-DAY" enterAtFrame={guaranteeAtFrame} top={1095} fontSize={64} />
      <TimedText text="that's your sign." enterAtFrame={yourSignAtFrame} top={1200} fontSize={52} />
    </AbsoluteFill>
  );
};
