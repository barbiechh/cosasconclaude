import {cancelRender, continueRender, delayRender} from 'remotion';
import {POPPINS_BOLD_WOFF2_BASE64} from './poppins-bold-woff2';

// La fuente va incrustada: pedirla por URL colgaba de vez en cuando alguna
// pestaña del render (timeout de delayRender a los 28 s).
const bytes = Uint8Array.from(atob(POPPINS_BOLD_WOFF2_BASE64), (c) => c.charCodeAt(0));
const face = new FontFace('Poppins', bytes, {weight: '700', style: 'normal'});
const handle = delayRender('Loading Poppins Bold');
face
  .load()
  .then(() => {
    document.fonts.add(face);
    continueRender(handle);
  })
  .catch((err) => cancelRender(err));
