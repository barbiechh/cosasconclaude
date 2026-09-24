# Imágenes nuevas para más acción

Mientras no existan, el video usa una foto de respaldo (ya se ve completo).
Al dejarlas en `public/images/body/` con estos nombres exactos, `npm run build`
las usa sin tocar código.

**Formato de todas:** PNG o JPG, **vertical 4:5 (1080×1350)**, foto documental
natural, luz real, sin texto ni logos. **Misma mujer en todas**: usa
`public/images/hook/woman-cutout.png` como referencia de personaje (unos 50 años,
cabello castaño claro recogido). Así el video se lee como una sola historia.

## Slow fade ("First the focus goes, then the words, then the drive…")

| Archivo | Se ve en | Prompt |
| --- | --- | --- |
| `fade-focus.png` | "First the focus goes" | Mujer de ~50 años sentada frente a una laptop en una mesa de cocina, mirada perdida más allá de la pantalla, mano en la sien, luz de tarde gris, foto documental, vertical 4:5 |
| `fade-words.png` | "then the words" | La misma mujer a media conversación con una amiga en un café, boca entreabierta buscando una palabra, gesto frustrado con la mano, foto documental natural, vertical 4:5 |
| `fade-drive.png` | "then the drive" | La misma mujer hundida en el sofá con ropa deportiva, bolsa del gimnasio sin abrir a sus pies, lista de pendientes en la mesa, luz apagada, vertical 4:5 |
| `fade-snaps.png` | "until she snaps at the people she loves most" | La misma mujer en la cocina levantando la voz a su hija adolescente, gesto tenso, la hija se aleja, foto documental, emoción real, vertical 4:5 |
| `fade-mirror.png` | "she starts to believe this is just who she is now" | La misma mujer frente al espejo del baño, mirándose con cansancio, reflejo en primer plano, luz fría, vertical 4:5 |

## Estrógeno y dopamina ("Nobody tells her otherwise…")

| Archivo | Se ve en | Prompt |
| --- | --- | --- |
| `doctor-visit.png` | "Nobody tells her otherwise" | La misma mujer sentada en un consultorio; el médico mira un expediente/tablet en vez de mirarla a ella, ella con expresión de no ser escuchada, foto documental, vertical 4:5 |
| `woman-foggy.png` | "That's the fog" | La misma mujer detrás de una ventana empañada por la lluvia, rostro difuso y pensativo, tonos grises fríos, vertical 4:5 |

(El resto de ese tramo —análisis hormonal con lupa, molécula de estrógeno,
partículas de dopamina, foco que parpadea, gráfica que cae— ya está animado en
código y no necesita imágenes.)

## Recuperación ("And once the brain is building dopamine again…")

| Archivo | Se ve en | Prompt |
| --- | --- | --- |
| `recovery-clear.png` | "the fog lifts" | La misma mujer junto a una ventana muy luminosa, abriendo la cortina, mirada clara y serena, luz cálida de mañana, vertical 4:5 |
| `recovery-drive.png` | "The drive comes back" | La misma mujer caminando rápido por la calle con ropa deportiva y audífonos, decidida, sonrisa leve, luz de mañana, foto documental con leve movimiento, vertical 4:5 |
| `recovery-patience.png` | "and so does the patience" | La misma mujer riendo con su hija adolescente en la cocina mientras preparan comida, momento cálido y relajado, vertical 4:5 |

## Opcional

| Archivo | Se ve en | Prompt |
| --- | --- | --- |
| `woman-focus-fade.png` | "this stage arrives as a slow fade" | La misma mujer en su día a día, plano medio, cansada, vertical 4:5 |

## Siguen pendientes (marca real, no se generan)

- `public/images/endcard/ctrl-bottle.png` — foto real del frasco, PNG transparente.
- `public/images/endcard/ctrl-logo.png` — logo real, PNG transparente.
