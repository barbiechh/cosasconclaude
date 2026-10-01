import {staticFile} from 'remotion';

// Registro de recursos fotográficos con su procedencia.
// `src: null` = fotografía pendiente: se muestra un sustituto PROVISIONAL claramente marcado.
// Para usar la foto real: copia el archivo a public/assets/photos/ y rellena src, source y license.
export type PhotoAsset = {
  readonly id: string;
  readonly description: string; // qué debe mostrar la foto
  readonly src: string | null;
  readonly source: string | null; // URL o autor
  readonly license: string | null;
};

export const PHOTOS = {
  product: {
    id: 'product',
    description: 'Envase CTRL. (foto del producto)',
    src: staticFile('assets/photos/ctrl-product.png'),
    source: 'Proporcionada por la clienta (imagen 1.webp), fondo recortado',
    license: 'Material propio de la marca',
  },
  liquorGlass: {
    id: 'liquorGlass',
    description: 'Vaso bajo con licor ámbar y hielo, recortado, a color',
    src: null,
    source: null,
    license: null,
  },
  pills: {
    id: 'pills',
    description: 'Frasco de pastillas con cápsulas sueltas, recortado, a color',
    src: null,
    source: null,
    license: null,
  },
  scientist: {
    id: 'scientist',
    description: 'Investigador/a con bata de laboratorio, plano medio, en blanco y negro',
    src: null,
    source: null,
    license: null,
  },
} as const satisfies Record<string, PhotoAsset>;

export type PhotoId = keyof typeof PHOTOS;

// Muestra las etiquetas "PROVISIONAL" sobre los sustitutos.
export const SHOW_PLACEHOLDER_TAGS = true;
