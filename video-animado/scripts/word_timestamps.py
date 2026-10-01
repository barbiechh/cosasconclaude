"""Transcripción con timestamps por palabra del voiceover (sin conexión).

Requisitos:  pip install sherpa-onnx numpy
Modelo (GitHub releases de k2-fsa/sherpa-onnx):
  sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2  (palabras + tiempos)
  sherpa-onnx-whisper-small.en.tar.bz2                (verificación del texto)

Uso:
  ffmpeg -i public/voiceover.mp3 -t 25 -ac 1 -ar 16000 a.wav
  python3 scripts/word_timestamps.py a.wav MODEL_DIR > src/data/words.json

El audio se decodifica por frases, cortando en las pausas detectadas con
`ffmpeg -af silencedetect=noise=-35dB:d=0.12`, para que el modelo no omita palabras.
"""
import json
import sys
import wave

import numpy as np
import sherpa_onnx

wav_path, model_dir = sys.argv[1], sys.argv[2].rstrip("/") + "/"
# Cortes (s) en las pausas > 0.4 s de los primeros 25 s del voiceover.
CUTS = [0, 2.3, 4.55, 9.68, 10.99, 15.8, 22.85, 25]

w = wave.open(wav_path)
sr = w.getframerate()
samples = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768

rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=model_dir + "encoder.int8.onnx",
    decoder=model_dir + "decoder.int8.onnx",
    joiner=model_dir + "joiner.int8.onnx",
    tokens=model_dir + "tokens.txt",
    model_type="nemo_transducer",
)

words = []
for a, b in zip(CUTS, CUTS[1:]):
    st = rec.create_stream()
    st.accept_waveform(sr, samples[int(a * sr): int(b * sr)])
    rec.decode_stream(st)
    cur = None
    for tok, t in zip(st.result.tokens, st.result.timestamps):
        if tok.startswith(" ") or cur is None:
            if cur:
                words.append(cur)
            cur = {"text": tok.strip(), "start": round(a + t, 3)}
        else:
            cur["text"] += tok
    if cur:
        words.append(cur)

for i, wd in enumerate(words):
    wd["end"] = words[i + 1]["start"] if i + 1 < len(words) else CUTS[-1]

json.dump(words, sys.stdout, indent=1)
