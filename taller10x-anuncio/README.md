# Taller 10x · "La columna derecha" — anuncio en video

Composición Remotion del master de 60 s (16:9, 1920x1080, 30fps) descrito en el
documento de dirección creativa. Motion graphics 100%, sin video ni fotografía real.

## Estructura

- `src/theme.ts` — colores de marca y la fuente (Space Grotesk, autohospedada en `public/fonts/`).
- `src/components/` — piezas reutilizables: `MorphNumber` (el swap "4 h → 15 min"),
  `RollingNumber` (contadores), `GeometryLines` (la geometría de marca animada),
  `KineticWords` (texto palabra por palabra), `Card`, `Pill`, `TaskRow`, `PortraitCard`.
- `src/scenes/Scene01…Scene14` — una escena por archivo, en el orden y timing de la
  sección 3 del brief (storyboard del master de 60 s).
- `src/Ad.tsx` — ensambla las 14 escenas en `<Sequence>` con corte seco (el 80% de
  las transiciones pedidas en el brief).
- `src/Composition.tsx` — registra `Taller10x-Master-60s` (la pieza completa) y cada
  escena por separado bajo la carpeta `Taller10x-Scenes` para poder editarlas o
  previsualizarlas de forma aislada en Studio.

## Comandos

```console
npm i
npx remotion studio --no-open      # previsualizar
npx remotion render Taller10x-Master-60s out/taller10x-anuncio-master-60s.mp4
```

> En este entorno de desarrollo (sandbox), la descarga del navegador propio de
> Remotion está bloqueada por política de red, así que el estudio y el render se
> corrieron con `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
> (el Chromium que ya trae Playwright preinstalado). Fuera de este sandbox eso no
> debería hacer falta.

## Qué falta para producción real (no generable por este agente)

1. **Locución (VO), música y SFX.** El video se entrega mudo. Todo el copy en
   pantalla ya está puesto según la sección 6 del brief, así que se lee completo
   sin sonido — pero la mezcla final de audio (VO grabada, pista musical con
   licencia, SFX) hay que producirla aparte.
2. **Tipografía real de la landing.** Se usó Space Grotesk (Google Fonts) como
   sustituto de la grotesca real. Sustituir en `src/theme.ts` en cuanto el equipo
   de web entregue el archivo.
3. **Retratos de Lalo y Abraham.** La escena 11 usa un monograma placeholder sobre
   bloque de color. Reemplazar en `src/components/PortraitCard.tsx` por
   `<CanvasImage>` con las fotos reales.
4. **Sellos de Claude y ChatGPT.** La escena 10 usa wordmarks de texto plano en vez
   de los logos reales (no se generaron ni descargaron marcas de terceros).
5. **SVG real de la geometría de marca.** `GeometryLines.tsx` es una aproximación
   (arco + horizontales) hecha a mano; sustituir por el SVG real de marca cuando
   esté disponible.
6. **Cortes de 30 s y 15 s, y adaptaciones 4:5 / 9:16.** Este proyecto entrega el
   master de 60 s en 16:9 pedido. Las variantes de duración y de aspect ratio
   (sección 17 del brief) se arman a partir de las mismas escenas, pero no están
   incluidas todavía.
