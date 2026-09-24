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

## Recursos pendientes

La lista completa está en `src/data/assets.ts`. Todos son PNG con fondo
transparente, salvo que se indique otra cosa:

| Archivo | Qué es |
| --- | --- |
| `images/hook/woman-cutout.png` | Mujer, recorte editorial grande (vertical) |
| `images/hook/orca-cutout.png` | Orca, recorte o grabado naturalista |
| `images/body/orca-leader-pod.png` | Lámina: orca mayor al frente y su grupo detrás (horizontal) |
| `images/body/fish-school.png` | Grabado de un cardumen |
| `images/body/ocean-route-map.png` | Mapa antiguo con una ruta punteada |
| `images/body/woman-midlife-daily.png` | Mujer de 45–55 años en una escena cotidiana |
| `images/body/woman-focus-fade.png` | La misma mujer, plano medio, gesto cansado o distraído |
| `images/body/brain-diagram.png` | Grabado simple de un cerebro |
| `images/body/light-switch.png` | Interruptor de pared antiguo |
| `images/body/tyrosine.png` | Ilustración para tirosina (p. ej. molécula o alimento fuente) |
| `images/body/b6.png` | Ilustración para vitamina B6 |
| `images/body/calming-plants.png` | Las dos plantas calmantes de la fórmula |
| `images/body/hrt-icon.png`, `images/body/stimulant-icon.png` | Opcionales, genéricos, sin marca |
| `images/endcard/ctrl-bottle.png` | **Foto real del frasco de CTRL** |
| `images/endcard/ctrl-logo.png` | **Logo real de CTRL** |
