import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY, FONT_WEIGHT, LAYOUT} from '../styles/tokens';

export interface TimedTextProps {
  text: string;
  enterAtFrame: number;
  /** si se omite, se queda hasta que termina su Sequence */
  exitAtFrame?: number;
  top: number;
  fontSize?: number;
  color?: string;
  maxWidth?: number;
  /** palabra (o fragmento) del texto que se subraya en amarillo al entrar */
  highlight?: string;
  /** centro horizontal del texto en px (por defecto, centro del cuadro) */
  centerX?: number;
}

const EXIT_FRAMES = 6;

/** Titular o keyword que entra con la palabra hablada y sale antes del siguiente. */
export const TimedText: React.FC<TimedTextProps> = ({
  text,
  enterAtFrame,
  exitAtFrame,
  top,
  fontSize = 56,
  color = COLORS.ink,
  maxWidth = LAYOUT.textWidth,
  highlight,
  centerX,
}) => {
  const frame = useCurrentFrame();
  if (frame < enterAtFrame) return null;
  if (exitAtFrame !== undefined && frame >= exitAtFrame) return null;

  const enter = interpolate(frame, [enterAtFrame, enterAtFrame + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exit =
    exitAtFrame === undefined
      ? 0
      : interpolate(frame, [exitAtFrame - EXIT_FRAMES, exitAtFrame], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const underline = interpolate(frame, [enterAtFrame + 4, enterAtFrame + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const parts = highlight ? text.split(highlight) : [text];

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: centerX ?? '50%',
        width: maxWidth,
        transform: `translateX(-50%) translateY(${(1 - enter) * 16 - exit * 12}px)`,
        opacity: enter * (1 - exit),
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        fontWeight: FONT_WEIGHT,
        fontSize,
        lineHeight: 1.18,
        letterSpacing: -0.5,
        color,
      }}
    >
      {highlight && parts.length === 2 ? (
        <>
          {parts[0]}
          <span style={{position: 'relative', display: 'inline-block'}}>
            <span
              style={{
                position: 'absolute',
                left: -6,
                right: -6,
                bottom: '0.08em',
                height: '0.36em',
                backgroundColor: COLORS.yellow,
                opacity: 0.85,
                transformOrigin: 'left center',
                transform: `scaleX(${underline})`,
                borderRadius: 6,
                zIndex: -1,
              }}
            />
            <span style={{position: 'relative'}}>{highlight}</span>
          </span>
          {parts[1]}
        </>
      ) : (
        text
      )}
    </div>
  );
};
