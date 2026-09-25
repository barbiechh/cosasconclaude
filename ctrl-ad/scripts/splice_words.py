"""Actualiza src/data/voiceover-words.json tras scripts/splice_voiceover.py.

Uso (desde ctrl-ad/):  python3 scripts/splice_words.py
- Palabras antes del tramo: mismos tiempos.
- Palabras del tramo ("Nature" .. "there."): alineación forzada de la toma nueva.
- Palabras después: se desplazan lo que cambió la duración del tramo.
"""
import json
import re
import subprocess
import tempfile
import wave

from pocketsphinx import Decoder

WORDS = "src/data/voiceover-words.json"
NEW = "audio-src/nature-built-ctrl.mp3"
CUT_IN, CUT_OUT = 104.91, 111.47
NEW_FROM, NEW_TO = 0.03, 7.21
SR = 44100
FIRST, LAST = "Nature", "there."
SPOKEN = {"ctrl": "control"}

words = json.load(open(WORDS))
body = [i for i, w in enumerate(words) if w["section"] == "body"]
i0 = next(i for i in body if words[i]["word"] == FIRST and words[i]["start"] > 100)
i1 = next(i for i in body if i > i0 and words[i]["word"] == LAST)
seg_words = [w["word"] for w in words[i0:i1 + 1]]

tokens, owner = [], []
for k, w in enumerate(seg_words):
    for part in SPOKEN.get(re.sub(r"[^a-z0-9']", "", w.lower()), re.sub(r"[^a-z0-9']", "", w.lower())).split():
        tokens.append(part)
        owner.append(k)

with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", NEW, "-ac", "1", "-ar", "16000", tmp.name], check=True)
    with wave.open(tmp.name, "rb") as wf:
        pcm = wf.readframes(wf.getnframes())
dec = Decoder(samprate=16000, bestpath=False, loglevel="FATAL")
dec.set_align_text(" ".join(tokens))
dec.start_utt()
dec.process_raw(pcm, full_utt=True)
dec.end_utt()
segs = [s for s in dec.seg() if s.word not in ("<s>", "</s>", "<sil>", "[NOISE]")]
assert len(segs) == len(tokens), (len(segs), len(tokens))

# posición en el archivo final: la toma empieza en CUT_IN (desde NEW_FROM)
base = CUT_IN - NEW_FROM
new_times = {}
for t, s in zip(owner, segs):
    st, en = s.start_frame / 100 + base, (s.end_frame + 1) / 100 + base
    if t in new_times:
        new_times[t][1] = en
    else:
        new_times[t] = [st, en]

shift = (round(CUT_IN * SR) + round(NEW_TO * SR) - round(NEW_FROM * SR)) / SR - CUT_OUT
for k in range(i0, i1 + 1):
    st, en = new_times[k - i0]
    words[k]["start"], words[k]["end"] = round(st, 2), round(en, 2)
for w in words[i1 + 1:]:
    w["start"] = round(w["start"] + shift, 2)
    w["end"] = round(w["end"] + shift, 2)

with open(WORDS, "w") as f:
    json.dump(words, f, indent=1, ensure_ascii=False)
    f.write("\n")
print(f"tramo {seg_words[0]}..{seg_words[-1]}: {words[i0]['start']}-{words[i1]['end']} s; desplazamiento {shift:+.3f} s")
