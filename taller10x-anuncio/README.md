# Taller 10x · "La columna derecha" — anuncio en video

Composición Remotion del master de 60 s (16:9, 1920x1080, 30fps) descrito en el
documento de dirección creativa. Motion graphics, con las fotos reales de los
fundadores y el logo de Espacio integrados; sin video de cámara.

## Estructura

- `src/theme.ts` — colores de marca y la fuente (Space Grotesk, autohospedada en `public/fonts/`).
- `src/components/` — piezas reutilizables: `MorphNumber` (el swap "4 h → 15 min"),
  `RollingNumber` (contadores), `GeometryLines` (la geometría de marca animada),
  `KineticWords` (texto palabra por palabra), `Card`, `Pill`, `TaskRow`, `PortraitCard`.
- `src/scenes/Scene01…Scene14` — una escena por archivo, en el orden y timing de la
  sección 3 del brief (storyboard del master de 60 s).
- `src/Ad.tsx` — ensambla las 14 escenas en `<Sequence>` con corte seco (el 80% de
  las transiciones pedidas en el brief).
- `src/scenes35/` — variantes comprimidas de algunas escenas para el corte de 35 s
  (ver más abajo). Las escenas que ya cabían enteras en menos tiempo (hook, columna,
  la línea que duele, revelación, CTA) se reutilizan directo desde `src/scenes/`.
- `src/Ad35.tsx` — ensambla el corte de 35 s.
- `src/Composition.tsx` — registra `Taller10x-Master-60s`, `Taller10x-35s`, y cada
  escena del master por separado bajo la carpeta `Taller10x-Scenes` para poder
  editarlas o previsualizarlas de forma aislada en Studio.

## El corte de 35 s

El brief solo detalla 60 s, 30 s y 15 s (sección 17), no 35 s. Este corte se armó
extendiendo la lógica de compresión que el propio brief usa para el de 30 s —
Flujo 2 se reduce a solo su número, y los pills de método + los fundadores se
funden en un beat rápido de 2 s — pero con más aire que el de 30 s en el resto de
los beats. Timing (1050f a 30fps):

| Beat | Frames | Duración |
|---|---|---|
| Hook | 0–60 | 2.0s |
| Columna crece | 60–300 | 8.0s |
| Total 16h | 300–360 | 2.0s |
| La línea que duele | 360–420 | 2.0s |
| Corte a petróleo | 420–570 | 5.0s |
| Revelación del taller | 570–660 | 3.0s |
| La promesa | 660–720 | 2.0s |
| Flujo 1 | 720–795 | 2.5s |
| Flujo 2 (solo dato) | 795–840 | 1.5s |
| Método + fundadores (split rápido) | 840–900 | 2.0s |
| Escasez | 900–960 | 2.0s |
| CTA | 960–1050 | 3.0s |

## Comandos

```console
npm i
npx remotion studio --no-open      # previsualizar
npx remotion render Taller10x-Master-60s out/taller10x-anuncio-master-60s.mp4
npx remotion render Taller10x-35s out/taller10x-anuncio-35s.mp4
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
3. **Sellos de Claude y ChatGPT.** La escena 10 usa wordmarks de texto plano en vez
   de los logos reales (no se generaron ni descargaron marcas de terceros).
4. **SVG real de la geometría de marca.** `GeometryLines.tsx` (usado como fondo
   animado en varias escenas) es una aproximación hecha a mano; sustituir por el
   SVG real de marca cuando esté disponible. Las fotos de los fundadores y el
   logo de Espacio ya usan los assets reales (`public/images/`).
5. **Cortes de 30 s y 15 s, y adaptaciones 4:5 / 9:16.** Este proyecto entrega el
   master de 60 s en 16:9 pedido. Las variantes de duración y de aspect ratio
   (sección 17 del brief) se arman a partir de las mismas escenas, pero no están
   incluidas todavía.

## Assets reales ya integrados

- `public/images/lalo-garcia.png`, `public/images/abraham-cobos.png` — fotos de
  los cofundadores (ya vienen con su bloque de marca y geometría incluidos).
- `public/images/espacio-logo.png` — el ícono de marca, usado en el CTA final.
