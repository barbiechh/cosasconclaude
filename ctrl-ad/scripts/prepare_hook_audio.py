"""Prepara el audio de un hook: mismo volumen que la voz del body, sin cambiar velocidad.

Uso (desde ctrl-ad/):  python3 scripts/prepare_hook_audio.py audio-src/hook2-original.mp3 public/audio/hook2.wav [silencio_final_s]
Sube el volumen hasta -15.1 LUFS (la voz del body) con un limitador suave y
añade fundidos de 10 ms en los extremos para que no haya clics.
"""
import json
import re
import subprocess
import sys

src, dst = sys.argv[1], sys.argv[2]
# silencio opcional al final (segundos), para que el paso al body respire
PAD = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
TARGET = -15.1
meas = subprocess.run(["ffmpeg", "-v", "info", "-i", src, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", meas)[-1])
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src], capture_output=True, text=True).stdout)
gain = TARGET - lufs
af = f"volume={gain:.1f}dB,alimiter=limit=0.89:attack=5:release=60:level=disabled,afade=t=in:d=0.01,afade=t=out:st={dur - 0.03:.3f}:d=0.03"
if PAD:
    af += f",apad=pad_dur={PAD}"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", af, "-ar", "44100", "-ac", "2", dst], check=True)
print(json.dumps({"source_lufs": lufs, "gain_db": round(gain, 1), "duration": dur}))
