import { AbsoluteFill, Sequence } from "remotion";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Columna } from "./scenes/Scene02Columna";
import { Scene03Total } from "./scenes/Scene03Total";
import { Scene04Linea } from "./scenes/Scene04Linea";
import { Scene05Petroleo } from "./scenes/Scene05Petroleo";
import { Scene06Revelacion } from "./scenes/Scene06Revelacion";
import { Scene07Promesa } from "./scenes/Scene07Promesa";
import { Scene08Flujo1 } from "./scenes/Scene08Flujo1";
import { Scene09Flujo2 } from "./scenes/Scene09Flujo2";
import { Scene10Metodo } from "./scenes/Scene10Metodo";
import { Scene11Fundadores } from "./scenes/Scene11Fundadores";
import { Scene12Acompanamiento } from "./scenes/Scene12Acompanamiento";
import { Scene13Escasez } from "./scenes/Scene13Escasez";
import { Scene14CTA } from "./scenes/Scene14CTA";

// TALLER 10x · LA COLUMNA DERECHA — master 60s, 16:9.
// Scenes are hard cuts (the brief's own rule: "el 80% de las transiciones").
// Timings mirror section 3 of the creative brief, converted to frames at 30fps.
export const Ad: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="01 · Hook" durationInFrames={60} layout="none">
        <Scene01Hook />
      </Sequence>
      <Sequence name="02 · La columna crece" from={60} durationInFrames={210} layout="none">
        <Scene02Columna />
      </Sequence>
      <Sequence name="03 · El total" from={270} durationInFrames={120} layout="none">
        <Scene03Total />
      </Sequence>
      <Sequence name="04 · La linea que duele" from={390} durationInFrames={90} layout="none">
        <Scene04Linea />
      </Sequence>
      <Sequence name="05 · Corte a petroleo" from={480} durationInFrames={180} layout="none">
        <Scene05Petroleo />
      </Sequence>
      <Sequence name="06 · Revelacion del taller" from={660} durationInFrames={150} layout="none">
        <Scene06Revelacion />
      </Sequence>
      <Sequence name="07 · La promesa" from={810} durationInFrames={120} layout="none">
        <Scene07Promesa />
      </Sequence>
      <Sequence name="08 · Flujo 1" from={930} durationInFrames={150} layout="none">
        <Scene08Flujo1 />
      </Sequence>
      <Sequence name="09 · Flujo 2" from={1080} durationInFrames={120} layout="none">
        <Scene09Flujo2 />
      </Sequence>
      <Sequence name="10 · Como se hace" from={1200} durationInFrames={120} layout="none">
        <Scene10Metodo />
      </Sequence>
      <Sequence name="11 · Quien lo da" from={1320} durationInFrames={150} layout="none">
        <Scene11Fundadores />
      </Sequence>
      <Sequence name="12 · Los 45 dias" from={1470} durationInFrames={120} layout="none">
        <Scene12Acompanamiento />
      </Sequence>
      <Sequence name="13 · Escasez" from={1590} durationInFrames={120} layout="none">
        <Scene13Escasez />
      </Sequence>
      <Sequence name="14 · CTA" from={1710} durationInFrames={90} layout="none">
        <Scene14CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
