# CTRL — anuncio vertical (Remotion)

1080×1920, 30 fps, 118.7 s (116.22 s de voz + 2.5 s de cierre). Hook1, Body y
EndCard son componentes separados. Todos los tiempos salen de la alineación
real del voiceover (`src/data/voiceover-words.json`) vía `src/data/timing.ts`.

## Instalar

```bash
cd ctrl-ad
npm install
```

## Previsualizar

```bash
npm run start
```

- **CTRL-Preview**: siempre con placeholders, para trabajar ritmo y layout.
- **CTRL-Final**: usa los recortes de `public/images/...` (orca, peces,
  cerebro, interruptor, ingredientes, frascos y el frasco real de CTRL).

## Exportar

```bash
npm run build          # CTRL-Final   -> out/ctrl-ad.mp4
npm run build:preview  # CTRL-Preview -> out/ctrl-ad-preview.mp4
node scripts/stills.mjs <carpeta> 0.5 300 900 1500   # frames sueltos para revisar
```

## Cómo se sincroniza con la voz

`scripts/align_voiceover.py` hace alineación forzada del MP3 contra el guion
(`script/hook1.txt` + `script/body.txt`) y guarda el inicio y fin de cada
palabra. Los cues de `timing.ts` se escriben como frases del guion
(`['it flickers', 1]` = la palabra "flickers"), no como segundos.

```bash
pip install pocketsphinx          # el modelo en inglés viene incluido
python3 scripts/align_voiceover.py --audio public/audio/voz-elegida.mp3 \
  --hook script/hook1.txt --body script/body.txt --out src/data/voiceover-words.json
```

Corte hook/body verificado: "woman" termina y "Around" empieza en **7.86 s**.

## Cambiar a Hook2

1. Guarda el texto en `script/hook2.txt` y el audio del hook en `public/audio/`.
2. Alinea ese audio con ese texto (mismo script, `--hook script/hook2.txt`).
3. En `timing.ts`, bloque `HOOK`: apunta `audioSrc`, `audioStartSeconds`,
   `durationSeconds` y `cues` al nuevo hook.
4. Crea `src/components/Hook2.tsx` (copia de Hook1) y úsalo en
   `src/compositions/MainVideo.tsx` en lugar de `<Hook1>`.

El Body sigue tocando el MP3 original desde 7.86 s; solo se desplaza en la
línea de tiempo según la duración del nuevo hook.

## Estilo

- Fondo: `public/images/paper-grid.jpg` (papel cuadriculado de 36 px, generado
  con `scripts/make_paper_texture.py`). Se puede sustituir por otra textura de
  1080×1920.
- Tipografía: Poppins Bold, incluida en `public/fonts/` (licencia OFL).
- Área segura: los textos viven entre y = 260 y y = 1560 y x = 90–950
  (`src/styles/tokens.ts`).

## Estructura (V2)

- `src/components/Hook1.tsx`: el hook, módulo independiente.
- `src/components/scenes/*.tsx`: una escena por tramo del guion (orcas, puente,
  slow fade, familia, cerebro, interruptor, respuestas, fix/CTRL,
  recuperación, cierre). Dentro, cada momento es un `<Beat>` que entra y sale
  antes del siguiente: una protagonista por momento, nada se acumula.
- `src/components/figures.tsx`: figuras ilustradas en papel recortado (la
  protagonista siempre con abrigo azul), la orca adulta y sus variantes (aleta,
  cola, orca vista desde arriba, las tres crías) y el anillo amarillo del líder.
- `src/components/mechanisms.tsx`: diana del foco, letras que se escriben y
  borran, engranaje, barra, foco, niebla, calendario de 30 días, etc.
- `src/components/EndCard.tsx`: frasco real, garantía y CTA.
- `src/data/timing.ts` (cues por frase), `scenes.ts` (cortes),
  `keywords.ts` (palabras de arriba), `sfx.ts` (diseño sonoro).

**No hay fotografías de personas.** Todas las mujeres son figuras ilustradas
dibujadas en código.

## Variedad de orcas (V3)

Del primer fotograma a "twenty years ago" nunca sale el mismo recorte como
protagonista dos momentos seguidos:

| Momento | Visual |
|---|---|
| Women and killer whales … perimenopause | orca adulta (recorte completo) |
| But what it does to a whale … to a woman | dos trayectorias desde el mismo punto: verde que sube (orca y grupo vistos desde arriba) y roja que cae (ella) |
| Around forty … lives to ninety | aleta dorsal recorriendo la línea de vida; las tres crías en "stops having babies" |
| until scientists followed … thirty years | fichas con fotos de la manada (recortes de `orca-leader-pod.png`) |
| After menopause, she becomes the leader | orca adulta en primer plano, enorme |
| of the whole pod … every whale follows her | el grupo visto desde arriba formando la V |
| because she remembers … twenty years ago | orca adulta en la ruta, el grupo como sombras |
| Obviously a woman isn't a whale | cola saliendo del agua |

Recortes: `public/images/body/calves/` (las tres crías, separadas de una sola
imagen con fondo transparente) y `public/images/hook/details/` (aleta y cola,
recortadas de `orca-cutout.png`).

## Captions

`src/components/Captions.tsx` subtitula TODAS las palabras del voiceover (ya
no se ocultan cuando hay un titular arriba). Cada cláusula se reparte en trozos
de ≤4 palabras y ≤18 caracteres (una sola línea, sin palabras sueltas); cada
trozo entra con su primera palabra y sale 1/3 s después de la última. Posición
fija: y = 1405, x = 130–950 (fuera de la franja inferior y de los iconos de
Reels/TikTok). Los titulares viven arriba (y = 290), así que nunca se tapan.

## Sonido

`scripts/make_sfx.py` sintetiza los efectos en `public/sfx/` (pop, whoosh,
whoosh_soft, tick, card, paper_slide, tap_soft, draw, fish, bubble1-3,
water_splash, water_swell, erase, click, buzz, gear_stop, latch, lock,
chime_soft, reveal, flip, stamp, snap, rise y dos fondos). `src/data/sfx.ts`
ata cada uno a un cue del guion con su volumen; la voz siempre queda por
encima. El "lock" (clics + campanita tipo check-in) suena solo dos veces:
"she feels like herself again" y la garantía.

## Recursos

`src/data/assets.ts` lista cada imagen. CTRL-Final usa el archivo si existe en
`public/`. El frasco de CTRL es la foto real (`images/endcard/ctrl-bottle.png`)
y nunca se sustituye; el logo (`images/endcard/ctrl-logo.png`) es opcional:
el frasco ya lleva la marca.
