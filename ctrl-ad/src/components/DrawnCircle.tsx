import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../styles/tokens';

export interface DrawnCircleProps {
  enterAtFrame: number;
  top: number;
  left: number;
  size: number;
  color?: string;
  strokeWidth?: number;
  exitAtFrame?: number;
}

/** Círculo amarillo dibujado a mano alzada (SVG con stroke-dasharray animado). */
export const DrawnCircle: React.FC<DrawnCircleProps> = ({
  enterAtFrame,
  top,
  left,
  size,
  color = COLORS.yellow,
  strokeWidth = 10,
  exitAtFrame,
}) => {
  const frame = useCurrentFrame();
  const localFrame = frame - enterAtFrame;
  if (localFrame < 0) return null;
  if (exitAtFrame !== undefined && frame >= exitAtFrame) return null;

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
