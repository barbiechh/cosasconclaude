import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PaperBackground} from './PaperBackground';
import {Cutout} from './Cutout';
import {COLORS, FONT_FAMILY_HEADLINE} from '../styles/tokens';
import {WIDTH} from '../data/timing';
import {getAssetSlot} from '../data/assets';

export interface EndCardProps {
  usePlaceholder: boolean;
}

/**
 * ENDCARD — motivo del líder/pod conectado con la mujer, frasco real de CTRL
 * y garantía de 30 días. Vive en su propia <Sequence> al final del timeline.
 */
export const EndCard: React.FC<EndCardProps> = ({usePlaceholder}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  const logoSlot = getAssetSlot('product.ctrlLogo');
  const showLogoPlaceholder = usePlaceholder || !logoSlot.final;

  return (
    <AbsoluteFill style={{opacity}}>
      <PaperBackground />

      {showLogoPlaceholder ? (
        <div
          style={{
            position: 'absolute',
            top: 220,
            left: (WIDTH - 480) / 2,
            width: 480,
            height: 120,
            border: `3px dashed ${COLORS.placeholderBorder}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY_HEADLINE,
            fontWeight: 800,
            fontSize: 28,
            color: COLORS.inkSoft,
          }}
        >
          LOGO REAL DE CTRL — PENDIENTE
        </div>
      ) : (
        <Img
          src={staticFile(logoSlot.final as string)}
          style={{
            position: 'absolute',
            top: 220,
            left: (WIDTH - 480) / 2,
            width: 480,
            objectFit: 'contain',
          }}
        />
      )}

      <Cutout
        assetId="product.ctrlBottle"
        usePlaceholder={usePlaceholder}
        enterAtFrame={10}
        width={440}
        height={640}
        top={520}
        left={(WIDTH - 440) / 2}
        label="FRASCO REAL DE CTRL — PENDIENTE DE FOTO"
      />

      <div
        style={{
          position: 'absolute',
          top: 1280,
          left: (WIDTH - 760) / 2,
          width: 760,
          padding: '32px 40px',
          border: `3px solid ${COLORS.ink}`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY_HEADLINE,
            fontWeight: 800,
            fontSize: 40,
            color: COLORS.ink,
            lineHeight: 1.3,
          }}
        >
          30-day guarantee.
          <br />
          If it's in stock, that's your sign.
        </div>
      </div>
    </AbsoluteFill>
  );
};
