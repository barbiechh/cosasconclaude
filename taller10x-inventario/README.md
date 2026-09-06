# El Inventario — anuncio de tipografía cinética

Composición Remotion del master de 70.4 s (16:9, 1920x1080, 30fps) descrito en el
documento de dirección creativa. 100% tipografía y line art vectorial — sin fotos,
sin video, sin UI de producto.

## Estructura

Las 33 "tarjetas" del guion están agrupadas en **18 componentes de escena**
(`src/cards/G01…G18`), uno por cada cadena de tarjetas unidas por transformación
`[T]` — así el elemento que "se queda" en pantalla entre una tarjeta y la
siguiente de verdad persiste, en vez de fingirlo con un corte de `<Sequence>`.
Los cortes duros `[C]` son límites de `<Sequence>` normales; los wipes `[W]`
son un barrido de color (`ColorWipe`) que pinta el fondo de la siguiente escena
en los últimos frames de la escena saliente, así el corte de `<Sequence>`
queda perfectamente cerrado.

- `src/theme.ts` — paleta (petróleo #003146, marfil #F5F4F0, carbón #111111,
  durazno #F3C7B1) y las reglas de pareja de color (`paletteFor`), más la
  fuente Space Grotesk autohospedada.
- `src/components/` — `Line` (texto con acento por palabra + subrayado/tachado
  a mano animado), `RollDownNumber` (el rodillo de cifras "CIFRA_RUEDA"),
  `ColorWipe`, `StrokePath` (stroke-on genérico), `Pill`.
- `src/components/icons/` — los 9 assets de line art del brief: `ClockIcon`,
  `TrayIcon`, `DocumentIcon`, `DayBlocks`, `NodesDiagram`, `SilhouetteIcon` +
  `RadiatingArrows`, `CollapseArrow`, `GridSquares`, `EspacioSymbol`,
  `ArcBehind`.
- `src/cards/G01…G18` — una escena por grupo de tarjetas.
- `src/Ad70.tsx` — ensambla los 18 grupos en `<Sequence>`.
- `src/Composition.tsx` — registra `ElInventario-70s`.

## Mapeo tarjetas → grupos

| Grupo | Tarjetas | Fondo | Frames | Sale |
|---|---|---|---|---|
| G01 | T01–T02 | Carbón | 0–102 | [C] |
| G02 | T03–T05 | Marfil | 102–264 | [C] |
| G03 | T06–T07 | Petróleo | 264–378 | [C] |
| G04 | T08–T09 | Carbón | 378–498 | [W] vertical → marfil |
| G05 | T10–T11 | Marfil | 498–624 | [C] |
| G06 | T12–T13 | Petróleo | 624–774 | [C] |
| G07 | T14–T15 | Carbón | 774–924 | [C] |
| G08 | T16 | Marfil | 924–984 | [W] horizontal → petróleo |
| G09 | T17–T18 | Petróleo | 984–1110 | [C] |
| G10 | T19–T20 | Marfil | 1110–1248 | [C] |
| G11 | T21 | Carbón | 1248–1320 | [W] vertical → petróleo |
| G12 | T22–T23 | Petróleo | 1320–1470 | [C] |
| G13 | T24–T25 | Marfil | 1470–1596 | [C] |
| G14 | T26–T27 | Carbón | 1596–1734 | [C] |
| G15 | T28–T30 | Marfil | 1734–1908 | [C] |
| G16 | T31 | Petróleo | 1908–1986 | [W] horizontal → marfil |
| G17 | T32 | Marfil | 1986–2052 | [C] |
| G18 | T33 | Carbón | 2052–2112 | final |

## Comandos

```console
npm i
npx remotion studio --no-open
npx remotion render ElInventario-70s out/el-inventario-70s.mp4
```

> Igual que en `taller10x-anuncio/`, este sandbox necesita
> `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
> porque la descarga del navegador propio de Remotion está bloqueada por política
> de red. Fuera de este entorno no debería hacer falta.

## Qué falta para producción real

1. **Locución, música y SFX.** El video se entrega mudo. Todo el copy en pantalla
   ya está puesto según la sección 5 del brief, pero la mezcla final (VO grabada,
   pista con licencia, SFX de trazo/detent/sub grave) hay que producirla aparte.
2. **Tipografía real de la landing.** Se usó Space Grotesk como sustituto.
3. **Line art de ilustrador real.** Los 9 assets (`src/components/icons/`) son
   aproximaciones geométricas simples (círculos, rects, paths) hechas en código,
   no el trazo "dibujo rápido con esquinas redondeadas" que pide el brief.
   Sirven para timing y composición; la calidad final de trazo necesita un
   ilustrador o exportar SVGs reales con Trim Paths desde After Effects/Illustrator.
4. **Sellos de Claude y ChatGPT.** En T25 son wordmarks de texto plano, no los
   logos reales.
5. **SVG real del símbolo de Espacio.** `EspacioSymbol.tsx` es la misma
   aproximación de arco + horizontales usada en el proyecto `taller10x-anuncio`.
6. **Cortes de 30 s y 15 s.** El brief los detalla en la sección 16 (listas de
   qué tarjetas usar); no están armados todavía como composiciones — se pueden
   pedir como siguiente paso, igual que se hizo con el corte de 35 s del otro
   proyecto.
