import {continueRender, delayRender} from 'remotion';
import {GOOGLE_SANS_600_ITALIC_WOFF2_BASE64} from './google-sans-600-italic-woff2';
import {MONTSERRAT_BOLD_WOFF2_BASE64} from './montserrat-bold-woff2';
import {POPPINS_BOLD_WOFF2_BASE64} from './poppins-bold-woff2';

// Fuentes incrustadas (sin petición de red) y registradas al instante. No se
// espera a face.load(): en alguna pestaña del render esa promesa no resolvía
// y el render caía por timeout. Se sondea el estado con un tope de 2 s.
// La tipografía del video es Google Sans SemiBold 600 Italic. Se registra como
// estilo 'normal' con todo el rango de pesos: así cualquier texto del video usa
// esa cursiva de 600 sin que el navegador la engrose o la incline de más.
// Montserrat y Poppins quedan de respaldo para símbolos que no trae.
const decode = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const faces = [
  new FontFace('Google Sans', decode(GOOGLE_SANS_600_ITALIC_WOFF2_BASE64), {weight: '100 900', style: 'normal'}),
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
