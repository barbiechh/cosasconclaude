import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {Cutout} from './Cutout';
import {TimedText} from './TimedText';
import {COLORS, FONT_FAMILY, FONT_WEIGHT, LAYOUT} from '../styles/tokens';
import {WIDTH} from '../data/timing';
import {getAssetSlot} from '../data/assets';

export interface EndCardProps {
  usePlaceholder: boolean;
  /** frames (relativos al inicio de la EndCard) en que se dicen estas frases */
  guaranteeAtFrame: number;
  yourSignAtFrame: number;
}

/** Frasco real de CTRL + garantía de 30 días. Entra en "CTRL just gives her brain...". */
export const EndCard: React.FC<EndCardProps> = ({usePlaceholder, guaranteeAtFrame, yourSignAtFrame}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const box = interpolate(frame, [guaranteeAtFrame, guaranteeAtFrame + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logo = getAssetSlot('product.ctrlLogo');
  const showLogoPlaceholder = usePlaceholder || !logo.final;

  return (
    <AbsoluteFill style={{opacity}}>
      <PaperBackground />

      <div style={{position: 'absolute', top: LAYOUT.topText, left: (WIDTH - 480) / 2, width: 480, height: 130}}>
        {showLogoPlaceholder ? (
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
          <Img src={staticFile(logo.final as string)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        )}
      </div>

      <Cutout assetId="product.ctrlBottle" usePlaceholder={usePlaceholder} enterAtFrame={4}
        width={440} height={660} top={470} left={(WIDTH - 440) / 2} label="FRASCO REAL DE CTRL — PENDIENTE DE FOTO" />

      <div
        style={{
          position: 'absolute',
          top: 1180,
          left: (WIDTH - 800) / 2,
          width: 800,
          height: 260,
          border: `4px solid ${COLORS.ink}`,
          opacity: box,
          transform: `scale(${0.94 + box * 0.06})`,
        }}
      />
      <TimedText text="30-day guarantee" highlight="30-day" enterAtFrame={guaranteeAtFrame} top={1215} fontSize={64} />
      <TimedText text="that's your sign." enterAtFrame={yourSignAtFrame} top={1320} fontSize={52} />
    </AbsoluteFill>
  );
};
