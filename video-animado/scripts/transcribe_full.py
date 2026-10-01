import sherpa_onnx, wave, numpy as np, json
w=wave.open("full.wav"); sr=16000
s=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
dur=len(s)/sr
mids=[ (float(a)+float(b))/2 for a,b in (l.split() for l in open("sil.txt"))]
# chunks <= 18s cut at silence midpoints
cuts=[0.0]
for m in mids:
    if m-cuts[-1]>=6: cuts.append(m)
cuts.append(dur)
P="sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8/"
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=P+"encoder.int8.onnx",decoder=P+"decoder.int8.onnx",joiner=P+"joiner.int8.onnx",tokens=P+"tokens.txt",model_type="nemo_transducer")
W="sherpa-onnx-whisper-small.en/small.en-"
rw=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=W+"encoder.int8.onnx",decoder=W+"decoder.int8.onnx",tokens=W+"tokens.txt",language="en",task="transcribe")
words=[]; segs=[]
for a,b in zip(cuts,cuts[1:]):
    chunk=s[int(a*sr):int(b*sr)]
    st=r.create_stream(); st.accept_waveform(sr,chunk); r.decode_stream(st); res=st.result
    sw=rw.create_stream(); sw.accept_waveform(sr,chunk); rw.decode_stream(sw)
    segs.append({"start":round(a,2),"end":round(b,2),"parakeet":res.text.strip(),"whisper":sw.result.text.strip()})
    cur=None
    for tok,t in zip(res.tokens,res.timestamps):
        if tok.startswith(" ") or cur is None:
            if cur: words.append(cur)
            cur={"text":tok.strip(),"start":round(a+t,3)}
        else: cur["text"]+=tok
    if cur: words.append(cur)
for i,wd in enumerate(words): wd["end"]=words[i+1]["start"] if i+1<len(words) else round(dur,2)
json.dump(words,open("words_full.json","w"),indent=1); json.dump(segs,open("segs_full.json","w"),indent=1)
for g in segs:
    flag = "" if g["parakeet"].lower().replace(",","").replace(".","")==g["whisper"].lower().replace(",","").replace(".","") else "  <<DIFF"
    print(f'[{g["start"]:.2f}-{g["end"]:.2f}] P: {g["parakeet"]}{flag}')
    if flag: print(f'                 W: {g["whisper"]}')
