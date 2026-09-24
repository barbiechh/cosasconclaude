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
 *
 * V2: no hay fotografías de personas. Las mujeres del anuncio son figuras
 * ilustradas en código (src/components/figures.tsx), no imágenes.
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
  {id: 'hook.orca', kind: 'cutout', file: 'images/hook/orca-cutout.png',
    description: 'Orca, recorte naturalista.'},

  {id: 'body.orcaLeaderPod', kind: 'photo', file: 'images/body/orca-leader-pod.png',
    description: 'Orca mayor al frente y su grupo detrás.'},
  // Las crías (orquitas bebé), tres recortes de la misma ilustración.
  {id: 'body.orcaCalfA', kind: 'cutout', file: 'images/body/orca-calf-a.png', description: 'Cría de orca nadando a la derecha.'},
  {id: 'body.orcaCalfB', kind: 'cutout', file: 'images/body/orca-calf-b.png', description: 'Cría de orca de frente.'},
  {id: 'body.orcaCalfC', kind: 'cutout', file: 'images/body/orca-calf-c.png', description: 'Cría de orca nadando a la izquierda.'},
  {id: 'body.fishSchool', kind: 'cutout', file: 'images/body/fish-school.png',
    description: 'Cardumen de salmones.'},

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
