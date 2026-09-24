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
- **CTRL-Final**: usa las fotos de `public/images/...` que existan; si falta
  alguna, cae al placeholder de ese recorte.

## Exportar

```bash
npm run build          # CTRL-Final   -> out/ctrl-ad.mp4
npm run build:preview  # CTRL-Preview -> out/ctrl-ad-preview.mp4
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

## Recursos

`src/data/assets.ts` lista cada imagen. CTRL-Final usa el archivo si existe en
`public/`; si falta, usa su respaldo (si tiene) o un placeholder visible.

Ya integrados: `images/hook/woman-cutout.png`, `images/hook/orca-cutout.png`,
`images/body/orca-leader-pod.png`, `fish-school.png`, `woman-midlife-daily.png`,
`brain-diagram.png`, `light-switch.png`, `tyrosine.png`, `b6.png`,
`calming-plants.png`.

**Pendientes (obligatorios, no se inventan):**

| Archivo | Qué es |
| --- | --- |
| `images/endcard/ctrl-bottle.png` | Foto real del frasco de CTRL, PNG con fondo transparente, vertical (~2:3) |
| `images/endcard/ctrl-logo.png` | Logo real de CTRL, PNG con fondo transparente |

Opcional: `images/body/woman-focus-fade.png` (la misma mujer, cansada o
distraída, 4:3). Si no está, el tramo "slow fade" usa `woman-midlife-daily.png`.
