"""Genera los efectos de sonido del anuncio (public/sfx/*.wav) por síntesis.

Uso (desde ctrl-ad/):  pip install numpy && python3 scripts/make_sfx.py
Determinista. Todos son cortos, suaves y sin agudos agresivos: la voz manda.
"""
import os
import wave

import numpy as np

SR = 44100
OUT = "public/sfx"
rng = np.random.default_rng(3)
os.makedirs(OUT, exist_ok=True)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, attack=0.004, decay=0.08):
    x = np.arange(n) / SR
    a = np.clip(x / attack, 0, 1) if attack > 0 else np.ones(n)
    return a * np.exp(-x / decay)


def lowpass(x, cutoff):
    # Un polo; cutoff puede ser escalar o curva por muestra.
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        k = 1 - np.exp(-2 * np.pi * cutoff[i] / SR)
        acc += k * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def noise(sec):
    return rng.standard_normal(int(SR * sec))


def save(name, x, peak=0.5):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    fade = min(len(x), int(0.004 * SR))
    x[-fade:] *= np.linspace(1, 0, fade)
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(name, f"{len(x) / SR:.2f}s")


def place(total, *parts):
    out = np.zeros(int(SR * total))
    for start, sig in parts:
        i = int(start * SR)
        out[i:i + len(sig)] += sig[: len(out) - i]
    return out


# Recorte de papel que cae en su lugar.
x = t(0.09)
pop = np.sin(2 * np.pi * (700 - 3500 * x) * x) * env(len(x), 0.002, 0.03)
pop += lowpass(noise(0.09), 2500) * env(len(x), 0.001, 0.012) * 0.6
save("pop", pop, 0.45)

# Paso de escena: soplo de aire filtrado.
d = 0.42
x = t(d)
sweep = 300 + 2600 * np.sin(np.pi * x / d)
save("whoosh", lowpass(noise(d), sweep) * np.sin(np.pi * x / d) ** 2, 0.4)

# Tic de madera (años, fichas).
x = t(0.05)
tick = (np.sin(2 * np.pi * 1850 * x) + 0.5 * np.sin(2 * np.pi * 3100 * x)) * env(len(x), 0.0005, 0.008)
save("tick", tick, 0.4)

# Ficha de papel apoyada.
x = t(0.12)
card = lowpass(noise(0.12), 1800) * env(len(x), 0.001, 0.02) + np.sin(2 * np.pi * 140 * x) * env(len(x), 0.002, 0.03) * 0.8
save("card", card, 0.45)

# Trazo de marcador (ruta que se dibuja).
d = 0.9
x = t(d)
scr = highpass(lowpass(noise(d), 5200), 1800) * (0.55 + 0.45 * np.sin(2 * np.pi * 7 * x)) * np.sin(np.pi * x / d)
save("draw", scr, 0.3)

# Peces que se van: burbujas que suben y se alejan.
parts = []
for i in range(9):
    s = i * 0.05 + rng.random() * 0.03
    xx = t(0.06)
    f0 = 500 + rng.random() * 500
    parts.append((s, np.sin(2 * np.pi * (f0 + 2500 * xx) * xx) * env(len(xx), 0.002, 0.02) * (1 - i / 11)))
save("fish", place(0.6, *parts), 0.35)

# Goma borrando.
d = 0.5
x = t(d)
er = lowpass(noise(d), 1400) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 11 * x))) * np.sin(np.pi * x / d)
save("erase", er, 0.35)

# Clic de interruptor.
x = t(0.06)
cl = highpass(noise(0.06), 3000) * env(len(x), 0.0003, 0.004) + np.sin(2 * np.pi * 180 * x) * env(len(x), 0.001, 0.015) * 0.7
save("click", cl, 0.5)

# Zumbido eléctrico breve (el foco que falla).
d = 0.35
x = t(d)
hum = sum(np.sin(2 * np.pi * 120 * k * x) / k for k in (1, 2, 3, 5))
gate = (rng.random(int(d * 60)) > 0.35).repeat(int(SR / 60) + 1)[: len(x)]
save("buzz", hum * gate * np.sin(np.pi * x / d), 0.18)

# Mecanismo que se traba y se detiene: trinquete cada vez más lento + golpe sordo.
parts, s = [], 0.0
for i in range(7):
    xx = t(0.03)
    parts.append((s, np.sin(2 * np.pi * 1300 * xx) * env(len(xx), 0.0005, 0.006)))
    s += 0.05 + i * 0.03
xx = t(0.2)
parts.append((s, np.sin(2 * np.pi * 90 * xx) * env(len(xx), 0.002, 0.05) * 1.4))
save("gear_stop", place(s + 0.25, *parts), 0.4)

# Mecanismo que encaja: tres tics rápidos + campanita clara.
parts = []
for i in range(3):
    xx = t(0.03)
    parts.append((i * 0.045, np.sin(2 * np.pi * 1500 * xx) * env(len(xx), 0.0005, 0.006)))
xx = t(0.5)
parts.append((0.15, (np.sin(2 * np.pi * 1318.5 * xx) + 0.3 * np.sin(2 * np.pi * 2637 * xx)) * env(len(xx), 0.002, 0.16) * 0.7))
save("lock", place(0.65, *parts), 0.4)

# Revelación de CTRL: acorde suave de campanas.
d = 2.2
x = t(d)
bell = sum(np.sin(2 * np.pi * f * x) * env(len(x), 0.01 + i * 0.03, 0.9 - i * 0.1) for i, f in enumerate((523.25, 659.25, 783.99, 1046.5)))
save("reveal", bell, 0.35)

# Hoja de calendario.
x = t(0.08)
flip = highpass(noise(0.08), 1500) * env(len(x), 0.002, 0.018)
save("flip", flip, 0.35)

# Sello sobre papel.
x = t(0.2)
thud = np.sin(2 * np.pi * 85 * x) * env(len(x), 0.002, 0.05) + lowpass(noise(0.2), 900) * env(len(x), 0.001, 0.02) * 0.5
save("stamp", thud, 0.45)

# Ruptura (dos figuras que se separan): golpe corto y seco, sin estridencia.
x = t(0.25)
snap = highpass(noise(0.25), 2000) * env(len(x), 0.0005, 0.01) + np.sin(2 * np.pi * (520 - 1400 * x) * x) * env(len(x), 0.001, 0.07)
save("snap", snap, 0.4)

# Subida suave (la niebla se levanta).
d = 1.3
x = t(d)
rise = lowpass(noise(d), 400 + 3000 * (x / d) ** 2) * (x / d) ** 1.5 + 0.3 * np.sin(2 * np.pi * (220 + 220 * x / d) * x) * (x / d)
save("rise", rise, 0.25)

# Fondos (muy bajos en la mezcla): tensión en la explicación, calidez desde CTRL.
d = 8.0
x = t(d)
lfo = 0.6 + 0.4 * np.sin(2 * np.pi * x / d)
tense = (np.sin(2 * np.pi * 110 * x) + np.sin(2 * np.pi * 116.5 * x) + 0.4 * np.sin(2 * np.pi * 164.8 * x)) * lfo
save("pad_tense", lowpass(tense, 700) * np.minimum(1, np.minimum(x, d - x) / 0.5), 0.3)
warm = sum(np.sin(2 * np.pi * f * x) for f in (130.8, 164.8, 196.0, 246.9)) * lfo
save("pad_warm", lowpass(warm, 1200) * np.minimum(1, np.minimum(x, d - x) / 0.5), 0.3)
