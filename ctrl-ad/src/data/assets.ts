/**
 * Manifiesto de recursos visuales.
 *
 * Cada entrada representa UN recorte/foto que el video necesita. `placeholder`
 * siempre existe (se genera con CSS/SVG, no depende de ningún archivo). `final`
 * apunta a un archivo dentro de /public/images/... que tú debes proporcionar.
 *
 * La composición "CTRL-Preview" siempre usa `placeholder`.
 * La composición "CTRL-Final" usa `final` si existe el archivo, y cae a
 * `placeholder` si no lo encuentra (para que nunca truene el render mientras
 * vas entregando fotos poco a poco).
 *
 * Para reemplazar un recorte: coloca el archivo en la ruta indicada en `final`
 * y vuelve a renderizar CTRL-Final. No hay que tocar ningún componente.
 */

export type AssetSlot = {
  id: string;
  description: string;
  final: string | null; // ruta relativa a /public, o null si aún no se define
  required: boolean;
};

export const ASSET_MANIFEST: AssetSlot[] = [
  // ---- HOOK ----
  {
    id: 'hook.woman',
    description: 'Recorte editorial de una mujer (foto o grabado), estilo collage, fondo removido.',
    final: 'images/hook/woman-cutout.png',
    required: true,
  },
  {
    id: 'hook.orca',
    description: 'Recorte editorial de una orca (foto o grabado naturalista), fondo removido.',
    final: 'images/hook/orca-cutout.png',
    required: true,
  },
  {
    id: 'hook.paperTexture',
    description: 'Textura de papel claro, muy sutil, para el fondo (tileable).',
    final: 'images/paper-texture.jpg',
    required: false,
  },

  // ---- BODY: orcas ----
  {
    id: 'body.orcaLeaderPod',
    description: 'Lámina naturalista: orca mayor liderando un grupo/pod.',
    final: 'images/body/orca-leader-pod.png',
    required: true,
  },
  {
    id: 'body.fishSchoolFading',
    description: 'Grabado de cardumen de peces, para la idea de "los peces desaparecen".',
    final: 'images/body/fish-school.png',
    required: true,
  },
  {
    id: 'body.oceanRouteMap',
    description: 'Ilustración tipo mapa/ruta punteada en el océano ("recuerda dónde estaba la comida").',
    final: 'images/body/ocean-route-map.png',
    required: false,
  },

  // ---- BODY: mujer cotidiana ----
  {
    id: 'body.womanMidlifeDaily',
    description: 'Recorte de mujer de mediana edad en escena cotidiana (trabajo/casa), estilo collage.',
    final: 'images/body/woman-midlife-daily.png',
    required: true,
  },
  {
    id: 'body.womanFocusFade',
    description: 'Recorte de mujer con elementos gráficos que se atenúan/desprenden (foco, palabras).',
    final: 'images/body/woman-focus-fade.png',
    required: false,
  },

  // ---- BODY: ciencia / estrógeno-dopamina ----
  {
    id: 'body.brainDiagram',
    description: 'Ilustración lineal simple de un cerebro, estilo grabado editorial.',
    final: 'images/body/brain-diagram.png',
    required: true,
  },
  {
    id: 'body.lightSwitch',
    description: 'Ilustración de un interruptor de luz / foco, para la metáfora "like a light on a bad switch".',
    final: 'images/body/light-switch.png',
    required: true,
  },

  // ---- BODY: HRT / Adderall (tramo explicativo, sin empaques inventados) ----
  {
    id: 'body.hrtIcon',
    description: 'Icono/recorte editorial genérico para HRT (sin nombre de marca ni empaque real).',
    final: 'images/body/hrt-icon.png',
    required: false,
  },
  {
    id: 'body.stimulantIcon',
    description: 'Icono/recorte editorial genérico para estimulantes (sin nombre de marca ni empaque real).',
    final: 'images/body/stimulant-icon.png',
    required: false,
  },

  // ---- BODY: ingredientes ----
  {
    id: 'body.tyrosine',
    description: 'Recorte editorial del ingrediente tirosina (ilustración o foto de referencia genérica).',
    final: 'images/body/tyrosine.png',
    required: true,
  },
  {
    id: 'body.b6',
    description: 'Recorte editorial de vitamina B6.',
    final: 'images/body/b6.png',
    required: true,
  },
  {
    id: 'body.calmingPlants',
    description: 'Recorte editorial de las dos plantas calmantes (genérico, sin nombre de marca).',
    final: 'images/body/calming-plants.png',
    required: true,
  },

  // ---- CTRL (producto real, NUNCA inventar) ----
  {
    id: 'product.ctrlBottle',
    description:
      'FOTO REAL del frasco de CTRL. Obligatoria. Mientras no exista, se usa un placeholder ' +
      'explícito de "FRASCO CTRL — PENDIENTE" y NUNCA una etiqueta o frasco inventado.',
    final: 'images/endcard/ctrl-bottle.png',
    required: true,
  },
  {
    id: 'product.ctrlLogo',
    description: 'Logo real de CTRL en negro o blanco, fondo transparente. Obligatorio para el titular final.',
    final: 'images/endcard/ctrl-logo.png',
    required: true,
  },

  // ---- Texturas generales ----
  {
    id: 'global.paperBg',
    description: 'Textura de papel/cuaderno claro para todo el fondo del video (muy sutil).',
    final: 'images/paper-texture.jpg',
    required: false,
  },
];

export const getAssetSlot = (id: string): AssetSlot => {
  const slot = ASSET_MANIFEST.find((a) => a.id === id);
  if (!slot) {
    throw new Error(`Asset slot "${id}" no existe en el manifiesto.`);
  }
  return slot;
};

/**
 * Lista de archivos que el usuario debe proporcionar para el render final,
 * en el orden en que aparecen en pantalla. Útil para generar la lista de
 * pendientes al final del proyecto.
 */
export const MISSING_ASSET_CHECKLIST = ASSET_MANIFEST.filter((a) => a.required).map(
  (a) => `${a.final}  ->  ${a.description}`
);
