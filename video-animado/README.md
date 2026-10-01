# Video explicativo animado (Remotion) · prueba de 15 s

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

Cada escena también está registrada como composición propia (carpeta "Escenas" en Studio).
