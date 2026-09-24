import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Poppins Bold empaquetada en /public para no depender de la red al renderizar.
loadFont({
  family: 'Poppins',
  url: staticFile('fonts/poppins-latin-700-normal.woff2'),
  weight: '700',
  style: 'normal',
});
