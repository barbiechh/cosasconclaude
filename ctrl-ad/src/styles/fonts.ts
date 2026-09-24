import {continueRender, delayRender} from 'remotion';
import {POPPINS_BOLD_WOFF2_BASE64} from './poppins-bold-woff2';

// Fuente incrustada (sin petición de red) y registrada al instante. No se
// espera a face.load(): en alguna pestaña del render esa promesa no resolvía
// y el render caía por timeout. Se sondea el estado con un tope de 2 s.
const bytes = Uint8Array.from(atob(POPPINS_BOLD_WOFF2_BASE64), (c) => c.charCodeAt(0));
const face = new FontFace('Poppins', bytes, {weight: '700', style: 'normal'});
document.fonts.add(face);

const handle = delayRender('Parsing Poppins Bold');
const startedAt = Date.now();
const check = () => {
  if (face.status === 'loaded' || face.status === 'error' || Date.now() - startedAt > 2000) {
    continueRender(handle);
  } else {
    setTimeout(check, 20);
  }
};
check();
