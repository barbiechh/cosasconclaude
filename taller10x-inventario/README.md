# El Inventario — anuncio de tipografía cinética

Composición Remotion (16:9, 1920x1080, 30fps) descrito en el documento de
dirección creativa. 100% tipografía y line art vectorial — sin fotos de stock,
sin video, sin UI de producto. Duración actual: **55.4 s** (1661 frames),
después de tres rondas de feedback (dos que cortaron contenido y aceleraron
el ritmo, y una tercera que le devolvió aire a las escenas más densas de
texto) — el guion original describía un master de 70.4 s.

## Estructura

Las tarjetas del guion original están agrupadas en **componentes de escena**
(`src/cards/G01…G18`, con G08 eliminado — ver "Cambios sobre el guion original"),
uno por cada cadena de tarjetas unidas por transformación `[T]` — así el
elemento que "se queda" en pantalla entre una tarjeta y la siguiente de verdad
persiste, en vez de fingirlo con un corte de `<Sequence>`. Los cortes duros
`[C]` son límites de `<Sequence>` normales; los wipes `[W]` son un barrido de
color (`ColorWipe`) que pinta el fondo de la siguiente escena en los últimos
frames de la escena saliente, así el corte de `<Sequence>` queda perfectamente
cerrado.

- `src/theme.ts` — paleta (petróleo #003146, marfil #F5F4F0, carbón #111111,
  durazno #F3C7B1) y las reglas de pareja de color (`paletteFor`), más la
  fuente Space Grotesk autohospedada.
- `src/components/` — `Line` (texto con acento por palabra, subrayado/tachado
  animado, y un pop de entrada con leve overshoot de escala para que cada
  frase "aterrice" con energía), `RollDownNumber` (el rodillo de cifras
  "CIFRA_RUEDA"), `ColorWipe`, `StrokePath` (stroke-on genérico), `Pill`.
- `src/components/icons/` — line art del brief: `ClockIcon`, `TrayIcon`,
  `DocumentIcon`, `DayBlocks`, `LoopIcon` (repetición — ver más abajo),
  `DirectorHub` (el hub de "dirigir" — ver más abajo), `CollapseArrow`,
  `GridSquares`, `EspacioSymbol`, `ArcBehind`.
- `src/cards/G01…G18` — una escena por grupo de tarjetas.
- `src/Ad70.tsx` — ensambla los grupos en `<Sequence>`. Cada escena lleva
  además un empuje de cámara continuo y sutil (`scale` creciendo 2-3% a lo
  largo de su duración) para que nada quede completamente estático mientras
  está en pantalla.
- `src/Composition.tsx` — registra la composición `ElInventario`.

## Cambios sobre el guion original (tres rondas de feedback)

1. **"Ninguna fue tuya. Fue formato."** se reescribió como "Ninguna hora fue
   una decisión tuya." / "Fue el formato. No tú." — la versión corta dependía
   de un VO que no existe en este entregable mudo.
2. **El diagrama de nodos (T12/T13)** se reemplazó por `LoopIcon`, un ícono de
   dos arcos girando en direcciones opuestas — se lee de inmediato como
   "repetición", cosa que el diagrama de nodos no lograba.
3. **El ícono de "El trabajo nuevo" (T14/T15)** se reemplazó por `DirectorHub`
   (un punto con líneas a tareas) — la silueta original no se entendía.
4. **"Sales con sistemas" (T21)** perdió el line art de flechas por completo.
5. **"La ventaja es del primero" (T16, grupo G08) se eliminó del todo.**
6. **"×10" (T19) se eliminó**; el grupo pasa directo a "Llegas con
   pendientes." (T20).
7. **"45 días después" (T28) se eliminó**; el grupo pasa directo a las fechas
   agotadas (T29/T30).
8. **Fotos de Lalo y Abraham** (reales, no placeholder) y el **isotipo real de
   Espacio** (`public/images/espacio-logo.png`) están integrados — en la
   escena de fundadores (más grande que en la primera pasada) y en el CTA /
   cierre final.
9. **Ritmo general:** se retimó cada escena para un pase más rápido (duración
   total bajó de 70.4 s a 50.1 s) y se agregó el pop de entrada + el empuje de
   cámara continuo mencionados arriba para que se sienta menos estático.

### Tercera ronda: más aire donde hace falta, más motion en fundadores

La segunda ronda se pasó de rápida — el feedback fue "tampoco hagamos todo tan
rápido que no se lea". En vez de revertir los cortes o el ritmo general, se le
devolvió tiempo de lectura puntualmente a las escenas más densas de texto,
sin tocar las que ya se sentían bien (el tramo "trailer" de G09-G12 sigue
deliberadamente rápido, como pide el guion):

1. **G02 (acumulación de tareas), G04 ("Ninguna fue tuya"), G06 (tareas
   repetitivas) y G07 (dirigir)** — se espació el stagger de palabras/líneas y
   se corrió el wipe de salida más tarde, dándole más aire a cada frase antes
   del corte. Duraciones: G02 130→155f, G04 96→116f, G06 96→116f, G07 95→130f.
2. **G05 y G13 (las dos escenas "respiro" con el símbolo de Espacio
   dibujándose)** — se extendió el hold antes del wipe (105→120f y 92→108f)
   para que el respiro se sienta como tal.
3. **G07 ("dirigir")** ahora dice "dirigir" seguido de "agentes de IA." en una
   línea más chica debajo — la palabra sola no comunicaba a qué se refería.
4. **G14 (fundadores)** ganó motion real: las fotos entran deslizándose desde
   lados opuestos con una leve rotación que se asienta (Lalo desde la
   izquierda, Abraham desde la derecha), más un balanceo continuo en fase
   opuesta durante el hold, además del empuje de cámara que ya tenían las
   demás escenas. Antes la escena solo tenía fade-in. Duración 112→140f.

Duración total: 50.1 s → **55.4 s** (1502 → 1661 frames).

## Comandos

```console
npm i
npx remotion studio --no-open
npx remotion render ElInventario out/el-inventario.mp4
```

> Igual que en `taller10x-anuncio/`, este sandbox necesita
> `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
> porque la descarga del navegador propio de Remotion está bloqueada por política
> de red. Fuera de este entorno no debería hacer falta.

## Qué falta para producción real

1. **Locución, música y SFX.** El video se entrega mudo.
2. **Tipografía real de la landing.** Se usó Space Grotesk como sustituto.
3. **Line art de ilustrador real.** Los assets en `src/components/icons/` son
   aproximaciones geométricas simples (círculos, rects, paths) hechas en
   código. Sirven para timing y composición; la calidad final de trazo
   necesita un ilustrador o SVGs reales con Trim Paths desde AE/Illustrator.
4. **Sellos de Claude y ChatGPT.** En T25 son wordmarks de texto plano.
5. **SVG real del símbolo de Espacio** (las curvas, no el isotipo — ese ya es
   real). `EspacioSymbol.tsx` sigue siendo una aproximación hecha a mano.
6. **Cortes de 30 s y 15 s.** No están armados todavía como composiciones.
