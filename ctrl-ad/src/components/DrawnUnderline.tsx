import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../styles/tokens';

export interface DrawnUnderlineProps {
  enterAtFrame: number;
  top: number;
  left: number;
  width: number;
  color?: string;
  thickness?: number;
}

/** Subrayado amarillo que se "dibuja" de izquierda a derecha, tipo marcador. */
export const DrawnUnderline: React.FC<DrawnUnderlineProps> = ({
  enterAtFrame,
  top,
  left,
  width,
  color = COLORS.yellow,
  thickness = 14,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterAtFrame;
  if (localFrame < 0) return null;

  const progress = interpolate(localFrame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        height: thickness,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: thickness / 2,
          opacity: 0.85,
        }}
      />
    </div>
  );
};

export interface DrawnCircleProps {
  enterAtFrame: number;
  top: number;
  left: number;
  size: number;
  color?: string;
  strokeWidth?: number;
}

/** Círculo amarillo dibujado a mano alzada (SVG con stroke-dasharray animado). */
export const DrawnCircle: React.FC<DrawnCircleProps> = ({
  enterAtFrame,
  top,
  left,
  size,
  color = COLORS.yellow,
  strokeWidth = 10,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterAtFrame;
  if (localFrame < 0) return null;

  const progress = interpolate(localFrame, [0, 18], [0, 1], {extrapolateRight: 'clamp'});
  const circumference = Math.PI * size;

  return (
    <svg
      width={size + strokeWidth * 2}
      height={size + strokeWidth * 2}
      style={{position: 'absolute', top: top - strokeWidth, left: left - strokeWidth}}
    >
      <ellipse
        cx={(size + strokeWidth * 2) / 2}
        cy={(size + strokeWidth * 2) / 2}
        rx={size / 2}
        ry={size / 2.3}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        transform={`rotate(-8 ${(size + strokeWidth * 2) / 2} ${(size + strokeWidth * 2) / 2})`}
      />
    </svg>
  );
};
