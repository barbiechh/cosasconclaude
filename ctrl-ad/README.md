# CTRL — anuncio vertical (Remotion)

Video 1080×1920, 30fps, ~1:56, construido con Hook1 + Body + EndCard como
módulos independientes. Todos los tiempos viven en `src/data/timing.ts`.
Todos los recursos visuales (reales o placeholder) viven en `src/data/assets.ts`.

## Instalar

```bash
cd ctrl-ad
npm install
```

## Previsualizar (Remotion Studio)

```bash
npm run start
```

Abre el Studio, elige la composición **CTRL-Preview** (siempre con placeholders,
para poder ajustar timing sin esperar fotos reales) o **CTRL-Final** (usa las
fotos reales de `public/images/...` si existen; si falta alguna, cae sola al
placeholder correspondiente, así nunca truena el render).

## Exportar

```bash
npm run build          # renderiza CTRL-Final -> out/ctrl-ad.mp4
npm run build:preview  # renderiza CTRL-Preview -> out/ctrl-ad-preview.mp4
```

## Sustituir el Hook por un Hook2 en el futuro

1. Duplica `src/components/Hook1.tsx` como `Hook2.tsx` y cambia su guion,
   sus cues visuales y su duración (`HOOK2_CUES` si hace falta uno nuevo en
   `timing.ts`).
2. En `src/compositions/MainVideo.tsx`, cambia `<Hook1 .../>` por
   `<Hook2 .../>` y `HOOK_AUDIO_SRC` por el archivo de audio del nuevo hook.
3. Actualiza `HOOK_BODY_CUT_SECONDS` en `timing.ts` si el nuevo hook dura
   distinto.
4. El `<Body>` y su audio (que arrancan siempre en `HOOK_BODY_CUT_FRAME`
   tomando el MP3 original vía `startFrom`) no se tocan.

## Estado de los tiempos

`src/data/timing.ts` marca cada tiempo con `confidence`:

- `confirmed`: verificado con detección de silencios/espectrograma sobre el
  MP3 real.
- `estimated`: calculado por ritmo de habla entre dos puntos confirmados. Se
  recomienda confirmar por oído antes de un render final para pauta.
- `pending`: no se pudo verificar ni estimar con confianza.

**Importante:** el corte exacto Hook→Body (`HOOK_BODY_CUT_SECONDS`, ~21.5s)
se estimó de forma acústica (silencedetect + espectrograma + verificación de
ritmo de habla), no con una transcripción automática palabra por palabra: el
entorno donde se construyó este proyecto bloquea la descarga de modelos de
reconocimiento de voz por política de red. Antes de dar el corte por
definitivo, escucha el MP3 entre 21.3s y 21.6s y ajusta `HOOK_BODY_CUT.seconds`
si hace falta — todo el Body se reacomoda solo.

## Recursos pendientes

Ver la lista completa y actualizada en `src/data/assets.ts`
(`MISSING_ASSET_CHECKLIST`). Resumen de lo que hace falta para pasar de
CTRL-Preview a un render 100% con recursos reales:

- `images/hook/woman-cutout.png` — recorte editorial de una mujer.
- `images/hook/orca-cutout.png` — recorte editorial de una orca.
- `images/body/orca-leader-pod.png` — lámina naturalista, orca líder + pod.
- `images/body/fish-school.png` — cardumen de peces.
- `images/body/woman-midlife-daily.png` — mujer de mediana edad, escena cotidiana.
- `images/body/brain-diagram.png` — diagrama simple de cerebro.
- `images/body/light-switch.png` — interruptor/foco para la metáfora del parpadeo.
- `images/body/tyrosine.png`, `images/body/b6.png`, `images/body/calming-plants.png` — ingredientes.
- `images/endcard/ctrl-bottle.png` — **foto real del frasco de CTRL** (obligatoria, nunca se inventa).
- `images/endcard/ctrl-logo.png` — **logo real de CTRL** (obligatorio).
- `images/paper-texture.jpg` — textura de papel (opcional, hay un fallback en CSS).

Todo lo demás (`hrtIcon`, `stimulantIcon`, `oceanRouteMap`, `womanFocusFade`)
es opcional: si no lo entregas, el placeholder se queda en el render final sin
romper nada.
