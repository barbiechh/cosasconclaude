import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY_HEADLINE} from '../styles/tokens';

export interface HeadlineProps {
  text: string;
  enterAtFrame: number;
  top: number;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  color?: string;
  maxWidth?: number;
  weight?: number;
}

/** Titular que entra con un pequeño desplazamiento + fade, sincronizado a una frase del VO. */
export const Headline: React.FC<HeadlineProps> = ({
  text,
  enterAtFrame,
  top,
  fontSize = 64,
  align = 'center',
  color = COLORS.ink,
  maxWidth = 900,
  weight = 800,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterAtFrame;
  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const translateY = interpolate(localFrame, [0, 10], [24, 0], {extrapolateRight: 'clamp'});

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
        fontWeight: weight,
        fontSize,
        color,
        lineHeight: 1.1,
        letterSpacing: -0.5,
      }}
    >
      {text}
    </div>
  );
};
