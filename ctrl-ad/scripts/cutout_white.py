"""Quita el fondo de una foto de producto y guarda un PNG transparente recortado.

Uso:  pip install numpy pillow scipy
      python3 scripts/cutout_white.py entrada salida.png [umbral=246]   # fondo blanco
      python3 scripts/cutout_white.py entrada salida.png --checker      # "transparencia" falsa en cuadros

Solo elimina el fondo conectado con el borde de la imagen, así que los
brillos blancos dentro del producto se conservan. `--checker` es para PNG que
traen el patrón de cuadros gris/blanco dibujado dentro de la imagen.
"""
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

src, dst = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else '246'

im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
gray = (a.max(axis=2) - a.min(axis=2)) <= 14

if mode == '--checker':
    g = a[..., 0]
    light, dark = int(g.max()), int(np.percentile(g[:40, :].flatten(), 10))
    # Tamaño y fase del cuadro a partir de la primera fila.
    changes = np.where(np.diff((g[2] > (light + dark) / 2).astype(int)) != 0)[0]
    size = int(np.median(np.diff(changes)))
    ox = (changes[0] + 1) % size
    col_changes = np.where(np.diff((g[:, 2] > (light + dark) / 2).astype(int)) != 0)[0]
    oy = (col_changes[0] + 1) % size
    yy, xx = np.mgrid[0:g.shape[0], 0:g.shape[1]]
    corner_light = g[oy, ox] > (light + dark) / 2
    parity = (((xx - ox) // size) + ((yy - oy) // size)) % 2
    expected = np.where((parity == 0) == corner_light, light, dark)
    candidate = (np.abs(g - expected) <= 3) & gray
else:
    threshold = int(mode)
    candidate = (a.min(axis=2) >= threshold) & gray

labels, _ = ndimage.label(candidate)
edge = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
background = np.isin(labels, edge[edge > 0])
background = ndimage.binary_opening(background, iterations=1)

h, w = background.shape
alpha = Image.fromarray(np.where(background, 0, 255).astype(np.uint8), "L")
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))

out = im.convert("RGBA")
out.putalpha(alpha)
bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
pad = 12
out = out.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad)))
out.save(dst, optimize=True)
print(dst, out.size)
