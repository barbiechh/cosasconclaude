// Renderiza varios frames sueltos con un solo bundle (revisión rápida).
// Uso: node scripts/stills.mjs <carpeta-salida> <escala> <frame> [frame...]
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const [outDir, scale, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'CTRL-Final'});
for (const f of frames) {
  await renderStill({composition, serveUrl, frame: Number(f), output: path.join(outDir, `f_${String(f).padStart(4, '0')}.png`), scale: Number(scale)});
  process.stdout.write(`${f} `);
}
console.log();
