import {continueRender, delayRender} from 'remotion';
import {MONTSERRAT_BOLD_WOFF2_BASE64} from './montserrat-bold-woff2';
import {POPPINS_BOLD_WOFF2_BASE64} from './poppins-bold-woff2';

// Fuentes incrustadas (sin petición de red) y registradas al instante. No se
// espera a face.load(): en alguna pestaña del render esa promesa no resolvía
// y el render caía por timeout. Se sondea el estado con un tope de 2 s.
// Montserrat Bold es la tipografía del video; Poppins queda como respaldo
// para símbolos que Montserrat latin no trae.
const decode = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const faces = [
  new FontFace('Montserrat', decode(MONTSERRAT_BOLD_WOFF2_BASE64), {weight: '700', style: 'normal'}),
  new FontFace('Poppins', decode(POPPINS_BOLD_WOFF2_BASE64), {weight: '700', style: 'normal'}),
];
faces.forEach((face) => document.fonts.add(face));

const handle = delayRender('Parsing fonts');
const startedAt = Date.now();
const check = () => {
  const done = faces.every((face) => face.status === 'loaded' || face.status === 'error');
  if (done || Date.now() - startedAt > 2000) {
    continueRender(handle);
  } else {
    setTimeout(check, 20);
  }
};
check();
