"""Genera (una sola vez) las texturas de papel en public/assets/textures. Determinista (seed fija)."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

rng = np.random.default_rng(7)
W, H = 1080, 1920


def noise(scale):
    small = rng.random((H // scale + 2, W // scale + 2)).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return np.asarray(im, dtype=np.float32) / 255


blotch = noise(260) * 0.5 + noise(90) * 0.3 + noise(28) * 0.2
grain = rng.normal(0, 1, (H, W)).astype(np.float32)
fine = np.asarray(Image.fromarray(((grain * 0.5 + 0.5).clip(0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.55)), dtype=np.float32) / 255 - 0.5
fib = Image.new('L', (W, H), 128)
d = ImageDraw.Draw(fib)
for _ in range(9000):
    x, y = rng.integers(0, W), rng.integers(0, H)
    a = rng.random() * np.pi
    l = rng.integers(6, 30)
    c = int(128 + rng.choice([-1, 1]) * rng.integers(14, 44))
    d.line([(x, y), (x + np.cos(a) * l, y + np.sin(a) * l)], fill=c, width=1)
fib = np.asarray(fib.filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32) / 255 - 0.5
specks = (rng.random((H, W)) > 0.9993).astype(np.float32)
specks = np.asarray(Image.fromarray((specks * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32) / 255
tone = 1 + (blotch - 0.5) * 0.11 + fine * 0.13 + fib * 0.17 - specks * 0.5

cream = np.array([238, 229, 208], np.float32)
Image.fromarray((cream[None, None, :] * tone[..., None]).clip(0, 255).astype(np.uint8)).save('public/assets/textures/paper-cream.jpg', quality=92)
# Textura neutra para multiplicar sobre papeles de color.
Image.fromarray((np.full((H, W), 242, np.float32) * tone).clip(0, 255).astype(np.uint8)).convert('RGB').save('public/assets/textures/paper-grain.jpg', quality=92)
