import React from 'react';
import {staticFile} from 'remotion';
import {COLORS} from '../styles/tokens';

/**
 * Fondo de papel claro con textura muy sutil. Si existe la textura real
 * (public/images/paper-texture.jpg) la usa; si no, cae a un degradado +
 * ruido CSS que imita papel sin depender de ningún archivo.
 */
export const PaperBackground: React.FC<{useFinalTexture?: boolean}> = ({
  useFinalTexture = false,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLORS.paper,
        backgroundImage: useFinalTexture
          ? `url(${staticFile('images/paper-texture.jpg')})`
          : `radial-gradient(circle at 20% 10%, ${COLORS.paperShadow} 0%, transparent 45%),
             radial-gradient(circle at 80% 90%, ${COLORS.paperShadow} 0%, transparent 40%),
             repeating-linear-gradient(0deg, rgba(0,0,0,0.015) 0px, rgba(0,0,0,0.015) 1px, transparent 1px, transparent 3px)`,
        backgroundSize: useFinalTexture ? 'cover' : 'auto',
        backgroundBlendMode: 'multiply',
      }}
    />
  );
};
