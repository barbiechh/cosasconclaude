import { AbsoluteFill, Sequence } from "remotion";
import { G01_Hook } from "./cards/G01_Hook";
import { G02_Acumulacion } from "./cards/G02_Acumulacion";
import { G03_Total } from "./cards/G03_Total";
import { G04_NingunaFueTuya } from "./cards/G04_NingunaFueTuya";
import { G05_NoEresLento } from "./cards/G05_NoEresLento";
import { G06_TareasRepetitivas } from "./cards/G06_TareasRepetitivas";
import { G07_Dirigir } from "./cards/G07_Dirigir";
import { G08_Ventaja } from "./cards/G08_Ventaja";
import { G09_Taller10x } from "./cards/G09_Taller10x";
import { G10_X10 } from "./cards/G10_X10";
import { G11_SalesConSistemas } from "./cards/G11_SalesConSistemas";
import { G12_FlujosNumero } from "./cards/G12_FlujosNumero";
import { G13_CeroCodigo } from "./cards/G13_CeroCodigo";
import { G14_Fundadores } from "./cards/G14_Fundadores";
import { G15_45Dias } from "./cards/G15_45Dias";
import { G16_DoceLugares } from "./cards/G16_DoceLugares";
import { G17_CTAPill } from "./cards/G17_CTAPill";
import { G18_URL } from "./cards/G18_URL";

// EL INVENTARIO — master 70.4s, 16:9. 33 tarjetas grouped into 18 scene
// components wherever a [T] transformation links them (so the persisting
// element actually persists, instead of a hard Sequence cut faking it).
// [C] hard cuts and [W] color wipes are plain Sequence boundaries — the
// wipe paints itself out inside the outgoing scene's last frames.
export const Ad70: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="G01 T01-T02 Hook" durationInFrames={102} layout="none">
        <G01_Hook />
      </Sequence>
      <Sequence name="G02 T03-T05 Acumulacion" from={102} durationInFrames={162} layout="none">
        <G02_Acumulacion />
      </Sequence>
      <Sequence name="G03 T06-T07 Total" from={264} durationInFrames={114} layout="none">
        <G03_Total />
      </Sequence>
      <Sequence name="G04 T08-T09 NingunaFueTuya" from={378} durationInFrames={120} layout="none">
        <G04_NingunaFueTuya />
      </Sequence>
      <Sequence name="G05 T10-T11 NoEresLento" from={498} durationInFrames={126} layout="none">
        <G05_NoEresLento />
      </Sequence>
      <Sequence name="G06 T12-T13 TareasRepetitivas" from={624} durationInFrames={150} layout="none">
        <G06_TareasRepetitivas />
      </Sequence>
      <Sequence name="G07 T14-T15 Dirigir" from={774} durationInFrames={150} layout="none">
        <G07_Dirigir />
      </Sequence>
      <Sequence name="G08 T16 Ventaja" from={924} durationInFrames={60} layout="none">
        <G08_Ventaja />
      </Sequence>
      <Sequence name="G09 T17-T18 Taller10x" from={984} durationInFrames={126} layout="none">
        <G09_Taller10x />
      </Sequence>
      <Sequence name="G10 T19-T20 X10" from={1110} durationInFrames={138} layout="none">
        <G10_X10 />
      </Sequence>
      <Sequence name="G11 T21 SalesConSistemas" from={1248} durationInFrames={72} layout="none">
        <G11_SalesConSistemas />
      </Sequence>
      <Sequence name="G12 T22-T23 FlujosNumero" from={1320} durationInFrames={150} layout="none">
        <G12_FlujosNumero />
      </Sequence>
      <Sequence name="G13 T24-T25 CeroCodigo" from={1470} durationInFrames={126} layout="none">
        <G13_CeroCodigo />
      </Sequence>
      <Sequence name="G14 T26-T27 Fundadores" from={1596} durationInFrames={138} layout="none">
        <G14_Fundadores />
      </Sequence>
      <Sequence name="G15 T28-T30 45Dias" from={1734} durationInFrames={174} layout="none">
        <G15_45Dias />
      </Sequence>
      <Sequence name="G16 T31 DoceLugares" from={1908} durationInFrames={78} layout="none">
        <G16_DoceLugares />
      </Sequence>
      <Sequence name="G17 T32 CTAPill" from={1986} durationInFrames={66} layout="none">
        <G17_CTAPill />
      </Sequence>
      <Sequence name="G18 T33 URL" from={2052} durationInFrames={60} layout="none">
        <G18_URL />
      </Sequence>
    </AbsoluteFill>
  );
};
