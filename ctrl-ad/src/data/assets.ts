import {getStaticFiles, staticFile} from 'remotion';

/**
 * Manifiesto de recursos visuales. Cada entrada es un recorte o foto que el
 * video usa. CTRL-Preview siempre muestra placeholders; CTRL-Final usa el
 * archivo de `file` si EXISTE en /public (se comprueba con getStaticFiles),
 * si no, prueba `fallback`, y si tampoco hay, muestra el placeholder.
 * Para añadir o cambiar una imagen basta con dejar el archivo en su ruta.
 *
 * kind: 'cutout' = PNG con fondo transparente (sombra sobre la silueta);
 *       'photo'  = foto rectangular (se pega como foto impresa con borde).
 */
export type AssetKind = 'cutout' | 'photo';

export type AssetSlot = {
  id: string;
  description: string;
  file: string;
  kind: AssetKind;
  fallback?: string;
  /** nunca se sustituye por otra imagen: si falta, placeholder explícito */
  brand?: boolean;
};

export const ASSET_MANIFEST: AssetSlot[] = [
  {id: 'hook.woman', kind: 'cutout', file: 'images/hook/woman-cutout.png',
    description: 'Mujer de mediana edad, recorte editorial vertical.'},
  {id: 'hook.orca', kind: 'cutout', file: 'images/hook/orca-cutout.png',
    description: 'Orca, recorte naturalista.'},

  {id: 'body.orcaLeaderPod', kind: 'photo', file: 'images/body/orca-leader-pod.png',
    description: 'Orca mayor al frente y su grupo detrás.'},
  {id: 'body.fishSchool', kind: 'cutout', file: 'images/body/fish-school.png',
    description: 'Cardumen de salmones.'},

  {id: 'body.womanMidlifeDaily', kind: 'photo', file: 'images/body/woman-midlife-daily.png',
    description: 'Mujer de mediana edad en una escena cotidiana, pensativa.'},
  {id: 'body.womanFocusFade', kind: 'photo', file: 'images/body/woman-focus-fade.png',
    fallback: 'body.womanMidlifeDaily',
    description: 'Opcional: la misma mujer, cansada o distraída (si falta, se usa la escena cotidiana).'},

  {id: 'body.brainDiagram', kind: 'cutout', file: 'images/body/brain-diagram.png',
    description: 'Grabado de un cerebro.'},
  {id: 'body.lightSwitch', kind: 'cutout', file: 'images/body/light-switch.png',
    description: 'Interruptor de pared antiguo.'},

  {id: 'body.tyrosine', kind: 'cutout', file: 'images/body/tyrosine.png',
    description: 'Tirosina: polvo y alimentos fuente.'},
  {id: 'body.b6', kind: 'cutout', file: 'images/body/b6.png',
    description: 'Vitamina B6: garbanzos y tableta.'},
  {id: 'body.calmingPlants', kind: 'cutout', file: 'images/body/calming-plants.png',
    description: 'Las dos plantas calmantes.'},

  // Fotos por frase (4:5 vertical, personas distintas). Opcionales: si faltan,
  // el plano se sostiene con su gráfico animado.
  {id: 'lost.focus', kind: 'photo', file: 'images/body/focus-lost.png', description: 'Pierde el foco.'},
  {id: 'lost.words', kind: 'photo', file: 'images/body/words-lost.png', description: 'Se le van las palabras.'},
  {id: 'lost.drive', kind: 'photo', file: 'images/body/drive-lost.png', description: 'Sin empuje.'},
  {id: 'lost.patience', kind: 'photo', file: 'images/body/patience-lost.png', description: 'Pierde la paciencia con los suyos.'},
  {id: 'lost.mirror', kind: 'photo', file: 'images/body/mirror.png', description: 'No se reconoce en el espejo.'},
  {id: 'brain.doctor', kind: 'photo', file: 'images/body/doctor-visit.png', description: 'El médico mira el expediente, no a ella.'},
  {id: 'brain.foggy', kind: 'photo', file: 'images/body/woman-foggy.png', description: 'Tras un vidrio empañado.'},
  {id: 'back.focus', kind: 'photo', file: 'images/body/focus-back.png', description: 'Recupera el foco.'},
  {id: 'back.words', kind: 'photo', file: 'images/body/words-back.png', description: 'Recupera las palabras.'},
  {id: 'back.drive', kind: 'photo', file: 'images/body/drive-back.png', description: 'Recupera el empuje.'},
  {id: 'back.patience', kind: 'photo', file: 'images/body/patience-back.png', description: 'Recupera la paciencia.'},
  {id: 'back.herself', kind: 'photo', file: 'images/body/herself-again.png', description: 'Vuelve a ser ella.'},

  // Tramo "the usual answers": frascos de HRT y de pastillas (recortes).
  {id: 'body.hrtBottle', kind: 'cutout', file: 'images/body/hrt-bottle.png', description: 'Frasco de HRT.'},
  {id: 'body.stimulantBottle', kind: 'cutout', file: 'images/body/stimulant-bottle.png', description: 'Frascos de pastillas.'},

  {id: 'product.ctrlBottle', kind: 'cutout', file: 'images/endcard/ctrl-bottle.png', brand: true,
    description: 'FOTO REAL del frasco de CTRL, fondo transparente. Nunca se inventa.'},
  {id: 'product.ctrlLogo', kind: 'cutout', file: 'images/endcard/ctrl-logo.png', brand: true,
    description: 'Logo real de CTRL, fondo transparente. Nunca se inventa.'},
];

export const getAssetSlot = (id: string): AssetSlot => {
  const slot = ASSET_MANIFEST.find((a) => a.id === id);
  if (!slot) throw new Error(`Asset slot "${id}" no existe en el manifiesto.`);
  return slot;
};

const exists = (file: string) => getStaticFiles().some((f) => f.name === file);

/** ¿Se mostrará algo en este slot? (en Preview siempre: placeholder). */
export const hasAsset = (id: string, usePlaceholder: boolean) => usePlaceholder || resolveAsset(id, false) !== null;

/** Imagen a mostrar para un slot, o null si toca placeholder. */
export const resolveAsset = (
  id: string,
  usePlaceholder: boolean
): {src: string; kind: AssetKind} | null => {
  if (usePlaceholder) return null;
  let slot: AssetSlot | undefined = getAssetSlot(id);
  while (slot) {
    if (exists(slot.file)) return {src: staticFile(slot.file), kind: slot.kind};
    if (slot.brand) return null;
    slot = slot.fallback ? getAssetSlot(slot.fallback) : undefined;
  }
  return null;
};
