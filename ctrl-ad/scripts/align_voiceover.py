"""Alineación forzada del voiceover contra el guion (tiempo real de cada palabra).

Uso (desde ctrl-ad/):
    pip install pocketsphinx
    python3 scripts/align_voiceover.py \
        --audio public/audio/voz-elegida.mp3 \
        --hook script/hook1.txt --body script/body.txt \
        --out src/data/voiceover-words.json

Requiere ffmpeg. El modelo acústico en inglés viene dentro del paquete de pip,
así que no se descarga nada más. Para un Hook2 con su propio audio, se corre
otra vez con ese audio y ese texto.
"""
import argparse
import json
import re
import subprocess
import tempfile
import wave

from pocketsphinx import Decoder

# Palabras que el diccionario no conoce: se alinean con su pronunciación.
SPOKEN = {"ctrl": "control", "hrt": "h r t", "b6": "b six"}
EXTRA_PRONUNCIATIONS = {
    "perimenopause": "P EH R IY M EH N AH P AO Z",
    "adderall": "AE D ER AO L",
    "tyrosine": "T AY R AH S IY N",
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", required=True)
    ap.add_argument("--hook", required=True)
    ap.add_argument("--body", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    hook_words = open(args.hook).read().split()
    body_words = open(args.body).read().split()
    words = hook_words + body_words

    tokens, owner = [], []
    for i, w in enumerate(words):
        clean = re.sub(r"[^a-z0-9']", "", w.lower())
        for part in SPOKEN.get(clean, clean).split():
            tokens.append(part)
            owner.append(i)

    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", args.audio, "-ac", "1", "-ar", "16000", tmp.name],
            check=True,
        )
        with wave.open(tmp.name, "rb") as wf:
            pcm = wf.readframes(wf.getnframes())

    dec = Decoder(samprate=16000, bestpath=False, loglevel="FATAL")
    for word, phones in EXTRA_PRONUNCIATIONS.items():
        dec.add_word(word, phones, True)
    dec.set_align_text(" ".join(tokens))
    dec.start_utt()
    dec.process_raw(pcm, full_utt=True)
    dec.end_utt()

    segs = [s for s in dec.seg() if s.word not in ("<s>", "</s>", "<sil>", "[NOISE]")]
    if len(segs) != len(tokens):
        raise SystemExit(f"Alineación incompleta: {len(segs)} de {len(tokens)} tokens")

    timed = {}
    for tok_i, seg in enumerate(segs):
        name = re.sub(r"\(\d+\)$", "", seg.word)
        if name != tokens[tok_i]:
            raise SystemExit(f"Desfase en token {tok_i}: {name} != {tokens[tok_i]}")
        i = owner[tok_i]
        start, end = seg.start_frame / 100, (seg.end_frame + 1) / 100
        if i in timed:
            timed[i]["end"] = round(end, 2)
        else:
            timed[i] = {
                "word": words[i],
                "section": "hook" if i < len(hook_words) else "body",
                "start": round(start, 2),
                "end": round(end, 2),
            }

    out = [timed[i] for i in range(len(words))]
    with open(args.out, "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write("\n")
    cut = next(w for w in out if w["section"] == "body")
    print(f"{len(out)} palabras alineadas. Corte hook/body: {cut['start']}s ({cut['word']})")


if __name__ == "__main__":
    main()
