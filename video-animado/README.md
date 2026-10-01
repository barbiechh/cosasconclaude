# Video explicativo animado (Remotion) · CTRL.

Vertical 9:16 (1080×1920, 30 fps). Voiceover original en `public/voiceover.mp3`.

## Comandos

```bash
npm i
npm run dev                      # Remotion Studio (vista previa)
npx remotion render Explainer-Preview15s out/preview-15s.mp4
```

Si Remotion no puede descargar Chrome Headless Shell, apunta a un Chromium local:
`REMOTION_BROWSER=/ruta/a/headless_shell npx remotion render ...`

## Estructura

- `src/Explainer.tsx`: composición principal (escenas en `<Series>`, subtítulos y audio).
- `src/scenes/`: una escena por frase del guion.
  - `QuestionScene`: 0.00–4.57 s, "What works better for an ADHD brain? Alcohol or stimulants?"
  - `StudyScene`: 4.57–9.67 s, "Scientists actually ran the study…"
  - `RevealScene`: 9.67–10.99 s, "It was alcohol."
  - `BackwardsScene`: 10.99–15.80 s, "It sounds backwards… complete sense."
- `src/characters/`: `Bean` (personaje principal) y `BrainBuddy` (cerebro). Ojos, cejas,
  boca, brazos y accesorios en grupos SVG separados y controlados por props.
- `src/objects/`: vaso o vaso de precipitados que se llena, frasco de pastillas, matraz con mechero,
  bombilla, flecha, check y signos.
- `src/components/`: helpers de animación, partículas sobre trazados, subtítulos, fondo.
- `src/data/transcript.ts`: palabras con timestamps reales (ver `scripts/word_timestamps.py`).
- `src/data/timeline.ts`: cortes de escena y conversión de segundos a frames.

## Versión estilo Vox (`Vox-Preview15s`)

`src/vox/` contiene una segunda versión de los mismos 15 s, con los mismos tiempos:
collage de papel recortado con borde blanco de pegatina y sombra dura, tramas de semitono,
fondo de papel con grano, cuadrícula y viñeta, titulares en Oswald que se construyen palabra a palabra
con marcador amarillo y subrayado de rotulador rojo, etiquetas de máquina de escribir (Special Elite),
cinta adhesiva, garabatos a rotulador y animación "a dos" (12 fps aparentes) con temblor de papel.

- `src/vox/style.tsx`: kit de estilo (papel, pegatina, semitono, cinta, rotulador, etiquetas).
- `src/vox/characters/`: `PaperDoll` y `PaperBrain` (las mismas siluetas, recortadas en papel).
- `src/vox/objects/PaperProps.tsx`: vaso, frasco, cápsula, estudio, sobre, bombilla, flecha y lupa.
- `src/vox/scenes/`: las cuatro escenas.
- Render: `renders/vox-preview-15s.mp4`.

Cada escena también está registrada como composición propia (carpeta "Escenas" en Studio).

## Versión final editorial (`CTRL-Editorial`, video completo de 191 s)

Una línea más sobria y elegante del estilo Vox para todo el voiceover: papel cálido y azul marino
(tomado del envase CTRL.), titulares en DM Serif Display alineados a la izquierda que aparecen palabra por palabra,
etiqueta de capítulo en IBM Plex Mono, recortes con borde fino y sombra suave, semitono discreto y movimiento fluido.

Código de color constante: azul = dopamina y CTRL., ocre = alcohol, ladrillo = estimulante o alerta,
salvia = tirosina e ingredientes, rosa = cerebro.

- `src/editorial/timeline.ts`: 30 escenas; cada corte se ancla al índice de una palabra del voiceover.
- `src/data/transcriptFull.ts`: transcripción completa con tiempos por palabra (`scripts/transcribe_full.py`).
- `src/editorial/Headline.tsx`: frases automáticas a partir de la transcripción y palabras clave en cursiva de color.
- `src/editorial/characters/`: `Brain` (vista lateral, con nivel de dopamina) y `Person` (busto con expresiones).
- `src/editorial/objects/`: `Tank` (el "tanque de dopamina", metáfora central) y el resto de objetos.
- `src/editorial/scenes/Act1Hook … Act5Product`: las escenas por acto.
- `public/img/ctrl-product.png`: foto del producto recortada.
- Render: `renders/ctrl-editorial-full.mp4`.
