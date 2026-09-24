"""Genera public/images/paper-grid.jpg: papel cuadriculado claro, 1080x1920, repetible en horizontal.

Uso (desde ctrl-ad/):  pip install numpy pillow && python3 scripts/make_paper_texture.py
Determinista (semilla fija): siempre produce la misma imagen.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

TILE_W, H = 1080, 1920
BLEND = 180  # franja extra para que la textura se repita sin costura en horizontal
W = TILE_W + BLEND
CELL = 36  # medido sobre la referencia: 12.2px a 372px de ancho = 35.5px a 1080
rng = np.random.default_rng(11)


def smooth_noise(scale):
    small = rng.random((H // scale + 2, W // scale + 2)).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize(
        ((W // scale + 2) * scale, (H // scale + 2) * scale), Image.BICUBIC
    )
    return np.asarray(img, dtype=np.float32)[:H, :W] / 255.0


# Relieve de papel arrugado: ruido "ridged" en varias escalas -> pliegues finos.
height = np.zeros((H, W), np.float32)
for scale, weight in [(520, 1.0), (240, 0.6), (110, 0.3)]:
    n = smooth_noise(scale)
    height += weight * (1 - np.abs(n * 2 - 1)) ** 3
gy, gx = np.gradient(height)
shade = 1 + 1.6 * (gx * -0.6 + gy * -0.8)  # luz desde arriba-izquierda
shade = np.clip(shade, 0.993, 1.006)

paper = np.array([241, 241, 239], np.float32)
img = paper[None, None, :] * shade[..., None]

# Variación de tono muy suave (zonas levemente más cálidas).
tone = smooth_noise(600) * 0.6 + smooth_noise(24) * 0.4
img += (tone[..., None] - 0.5) * np.array([5, 5, 2], np.float32)

# Grano fino.
img += rng.normal(0, 2.2, (H, W, 1)).astype(np.float32)

# Cuadrícula: líneas cálidas y suaves de ~2px.
grid = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(grid)
for x in range(0, W, CELL):
    d.line([(x, 0), (x, H)], fill=255, width=2)
for y in range(0, H, CELL):
    d.line([(0, y), (W, y)], fill=255, width=2)
grid = np.asarray(grid.filter(ImageFilter.GaussianBlur(0.7)), np.float32)[..., None] / 255.0
line_color = np.array([206, 192, 168], np.float32)
img = img * (1 - grid * 0.5) + line_color * grid * 0.5

# Rayones claros y pliegues oscuros finos.
marks = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dm = ImageDraw.Draw(marks)
for i in range(55):
    x, y = rng.random() * W, rng.random() * H
    ang = rng.random() * np.pi
    pts = []
    for _ in range(int(3 + rng.random() * 6)):
        pts.append((x, y))
        step = 12 + rng.random() * 40
        ang += (rng.random() - 0.5) * 0.6
        x, y = x + np.cos(ang) * step, y + np.sin(ang) * step
    light = i % 3 != 0
    dm.line(pts, fill=(255, 255, 255, 95) if light else (180, 160, 125, 45), width=1 + int(light))
marks = marks.filter(ImageFilter.GaussianBlur(0.6))

# Manchas pequeñas de suciedad, más densas en los bordes.
for _ in range(45):
    x, y = rng.random() * W, rng.random() * H
    r = 0.8 + rng.random() * 2.2
    dm2 = ImageDraw.Draw(marks)
    dm2.ellipse([x - r, y - r, x + r, y + r], fill=(140, 125, 95, int(25 + rng.random() * 40)))

base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")
base.paste(marks, (0, 0), marks)

# Repetible en horizontal: el borde izquierdo se funde con la franja extra de la
# derecha (misma fase de cuadrícula, porque TILE_W es múltiplo de CELL).
arr = np.asarray(base, np.float32)
ramp = np.linspace(0, 1, BLEND, dtype=np.float32)[None, :, None]
tile = arr[:, :TILE_W].copy()
tile[:, :BLEND] = arr[:, TILE_W:TILE_W + BLEND] * (1 - ramp) + arr[:, :BLEND] * ramp
Image.fromarray(np.clip(tile, 0, 255).astype(np.uint8), "RGB").save("public/images/paper-grid.jpg", quality=92)
print("public/images/paper-grid.jpg")
