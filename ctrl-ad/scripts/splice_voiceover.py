"""Reemplaza un tramo del voiceover por una toma nueva, sin tocar el resto.

Uso (desde ctrl-ad/):  python3 scripts/splice_voiceover.py
Entrada:  public/audio/voz-elegida.mp3 (voz original)
          audio-src/nature-built-ctrl.mp3 (toma nueva de "Nature built this
          stage ... get back there.")
Salida:   public/audio/voz-final.wav

El original se corta en silencios entre palabras (antes de "Nature" y antes
de "It comes") y no se procesa. La toma nueva entra entera, sin cambiar su
velocidad: solo se sube su volumen al de la voz original (-15.1 LUFS frente a
-22.3 LUFS) con un limitador suave para que no sature, y las uniones se
suavizan con fundidos de 8 ms. Después hay que actualizar los tiempos de palabra
(scripts/splice_words.py).
"""
import subprocess
import numpy as np

SR = 44100
ORIG = "public/audio/voz-elegida.mp3"
NEW = "audio-src/nature-built-ctrl.mp3"
OUT = "public/audio/voz-final.wav"
CUT_IN = 104.91   # fin de "again." 104.89 / inicio de "Nature" 104.94
CUT_OUT = 111.47  # fin de "there." 111.42 / inicio de "It" 111.52
NEW_FROM, NEW_TO = 0.03, 7.21  # voz de la toma nueva: 0.06 .. 7.18
FADE = int(0.008 * SR)


GAIN_DB = 7.2  # -22.3 LUFS -> -15.1 LUFS (voz original completa)


def load(path, af=None):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, *(["-af", af] if af else []), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def rms(x):
    return float(np.sqrt(np.mean(x ** 2)))


orig = load(ORIG)
new = load(NEW, f"volume={GAIN_DB}dB,alimiter=limit=0.89:attack=5:release=60:level=disabled")
a = orig[: int(CUT_IN * SR)]
b = new[int(NEW_FROM * SR): int(NEW_TO * SR)]
c = orig[int(CUT_OUT * SR):]

ramp = np.linspace(0, 1, FADE)[:, None]
a[-FADE:] *= ramp[::-1]
b[:FADE] *= ramp
b[-FADE:] *= ramp[::-1]
c[:FADE] *= ramp

out = np.concatenate([a, b, c])
pcm = (np.clip(out, -1, 1) * 32767).astype(np.int16)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", OUT], input=pcm.tobytes(), check=True)
print(f"{OUT}: {len(out) / SR:.3f} s (antes {len(orig) / SR:.3f} s)")
print(f"desplazamiento después del tramo: {(len(a) + len(b)) / SR - CUT_OUT:+.3f} s")
