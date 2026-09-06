import { AbsoluteFill, Sequence } from "remotion";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Columna } from "./scenes/Scene02Columna";
import { Scene03CompactTotal } from "./scenes35/Scene03CompactTotal";
import { Scene04Linea } from "./scenes/Scene04Linea";
import { Scene05CompactPetroleo } from "./scenes35/Scene05CompactPetroleo";
import { Scene06Revelacion } from "./scenes/Scene06Revelacion";
import { Scene07CompactPromesa } from "./scenes35/Scene07CompactPromesa";
import { Scene08CompactFlujo1 } from "./scenes35/Scene08CompactFlujo1";
import { Scene09CompactStat } from "./scenes35/Scene09CompactStat";
import { Scene10CompactMetodoFundadores } from "./scenes35/Scene10CompactMetodoFundadores";
import { Scene13CompactEscasez } from "./scenes35/Scene13CompactEscasez";
import { Scene14CTA } from "./scenes/Scene14CTA";

// TALLER 10x · LA COLUMNA DERECHA — 35s cut, 16:9.
// Not specified in the brief (which only details 60s/30s/15s) — built by
// extending the brief's own 30s compression logic (section 17: drop the
// second flow card to just its number, fold method pills + founders into
// one quick split beat) with a bit more breathing room throughout.
export const Ad35: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="01 · Hook" durationInFrames={60} layout="none">
        <Scene01Hook />
      </Sequence>
      <Sequence name="02 · La columna crece" from={60} durationInFrames={240} layout="none">
        <Scene02Columna />
      </Sequence>
      <Sequence name="03 · El total" from={300} durationInFrames={60} layout="none">
        <Scene03CompactTotal />
      </Sequence>
      <Sequence name="04 · La linea que duele" from={360} durationInFrames={60} layout="none">
        <Scene04Linea />
      </Sequence>
      <Sequence name="05 · Corte a petroleo" from={420} durationInFrames={150} layout="none">
        <Scene05CompactPetroleo />
      </Sequence>
      <Sequence name="06 · Revelacion del taller" from={570} durationInFrames={90} layout="none">
        <Scene06Revelacion />
      </Sequence>
      <Sequence name="07 · La promesa" from={660} durationInFrames={60} layout="none">
        <Scene07CompactPromesa />
      </Sequence>
      <Sequence name="08 · Flujo 1" from={720} durationInFrames={75} layout="none">
        <Scene08CompactFlujo1 />
      </Sequence>
      <Sequence name="09 · Flujo 2 (solo dato)" from={795} durationInFrames={45} layout="none">
        <Scene09CompactStat />
      </Sequence>
      <Sequence name="10 · Metodo + fundadores" from={840} durationInFrames={60} layout="none">
        <Scene10CompactMetodoFundadores />
      </Sequence>
      <Sequence name="11 · Escasez" from={900} durationInFrames={60} layout="none">
        <Scene13CompactEscasez />
      </Sequence>
      <Sequence name="12 · CTA" from={960} durationInFrames={90} layout="none">
        <Scene14CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
