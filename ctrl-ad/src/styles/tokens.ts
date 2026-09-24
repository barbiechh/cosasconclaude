export const COLORS = {
  paper: '#f1f1ef',
  ink: '#161412',
  inkSoft: '#3a352c',
  yellow: '#f4c93a',
  red: '#b23a2e',
  green: '#3f7d4e',
  card: '#fbfaf6',
  /** abrigo de la protagonista ilustrada (mismo azul en todo el video) */
  blue: '#4f79a3',
  skin: '#dcaa86',
  /** figuras secundarias (familia, seguidores) */
  grey: '#8f897e',
  greyLight: '#bdb7ab',
  /** la ruta "de hace veinte años" */
  sepia: '#9a7650',
  placeholderBg: '#d8d2c2',
  placeholderBorder: '#9c9482',
};

export const FONT_FAMILY = 'Poppins, sans-serif';
export const FONT_WEIGHT = 700;

/**
 * Área segura para Reels/TikTok en 1080x1920: arriba queda la barra de la
 * app, abajo el caption y los botones, a la derecha los iconos de acciones.
 * Todo texto importante vive entre TEXT_TOP y TEXT_BOTTOM.
 */
export const SAFE = {
  top: 260,
  bottom: 1560,
  left: 90,
  right: 950,
};

/** Filas de layout reutilizadas por todas las escenas. */
export const LAYOUT = {
  topText: 290,
  imageTop: 470,
  imageBottom: 1250,
  bottomText: 1310,
  textWidth: 820,
};

/** Escenario central: la acción de cada momento vive aquí. */
export const STAGE = {
  top: 470,
  bottom: 1290,
  centerY: 870,
  left: 90,
  right: 990,
};

/** Jerarquía de tamaños de las palabras clave. */
export const TYPE = {
  hero: 104,
  key: 84,
  long: 66,
};
