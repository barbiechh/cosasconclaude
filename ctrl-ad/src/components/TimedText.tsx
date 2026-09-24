import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY_HEADLINE} from '../styles/tokens';

export interface TimedTextProps {
  text: string;
  enterAtFrame: number;
  exitAtFrame?: number; // si no se pasa, se queda hasta el final de la escena
  top: number;
  fontSize?: number;
  color?: string;
  maxWidth?: number;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
}

/** Línea de titular/keyword con entrada y salida por fade, para no dejar texto pegado en pantalla sin razón. */
export const TimedText: React.FC<TimedTextProps> = ({
  text,
  enterAtFrame,
  exitAtFrame,
  top,
  fontSize = 48,
  color = COLORS.ink,
  maxWidth = 860,
  bold = true,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  if (frame < enterAtFrame) return null;
  if (exitAtFrame !== undefined && frame > exitAtFrame + 10) return null;

  const opacity = interpolate(
    frame,
    exitAtFrame !== undefined
      ? [enterAtFrame, enterAtFrame + 8, exitAtFrame, exitAtFrame + 10]
      : [enterAtFrame, enterAtFrame + 8],
    exitAtFrame !== undefined ? [0, 1, 1, 0] : [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const translateY = interpolate(frame, [enterAtFrame, enterAtFrame + 10], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        width: maxWidth,
        textAlign: align,
        opacity,
        fontFamily: FONT_FAMILY_HEADLINE,
        fontWeight: bold ? 800 : 500,
        fontSize,
        color,
        lineHeight: 1.15,
      }}
    >
      {text}
    </div>
  );
};
