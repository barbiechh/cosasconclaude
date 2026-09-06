import { AbsoluteFill, Sequence } from "remotion";
import { G01_Hook } from "./cards/G01_Hook";
import { G02_Acumulacion } from "./cards/G02_Acumulacion";
import { G03_Total } from "./cards/G03_Total";
import { G04_NingunaFueTuya } from "./cards/G04_NingunaFueTuya";
import { G05_NoEresLento } from "./cards/G05_NoEresLento";
import { G06_TareasRepetitivas } from "./cards/G06_TareasRepetitivas";
import { G07_Dirigir } from "./cards/G07_Dirigir";
import { G09_Taller10x } from "./cards/G09_Taller10x";
import { G10_Pendientes } from "./cards/G10_Pendientes";
import { G11_SalesConSistemas } from "./cards/G11_SalesConSistemas";
import { G12_FlujosNumero } from "./cards/G12_FlujosNumero";
import { G13_CeroCodigo } from "./cards/G13_CeroCodigo";
import { G14_Fundadores } from "./cards/G14_Fundadores";
import { G15_Fechas } from "./cards/G15_Fechas";
import { G16_DoceLugares } from "./cards/G16_DoceLugares";
import { G17_CTAPill } from "./cards/G17_CTAPill";
import { G18_URL } from "./cards/G18_URL";

// EL INVENTARIO — third pass. Second round over-corrected on speed, so the
// text-heavy scenes (G02, G04, G05, G06, G07, G13) got their reading time
// back, and G07 ("dirigir") now clarifies with "agentes de IA." underneath
// the hero word instead of standing alone. G14 (fundadores) gained real
// entrance motion (slide + rotate settle + a continuous bob) on top of the
// bigger photos from the previous round.
export const Ad70: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence name="G01 Hook" durationInFrames={88} layout="none">
        <G01_Hook />
      </Sequence>
      <Sequence name="G02 Acumulacion" from={88} durationInFrames={155} layout="none">
        <G02_Acumulacion />
      </Sequence>
      <Sequence name="G03 Total" from={243} durationInFrames={95} layout="none">
        <G03_Total />
      </Sequence>
      <Sequence name="G04 NingunaFueTuya" from={338} durationInFrames={116} layout="none">
        <G04_NingunaFueTuya />
      </Sequence>
      <Sequence name="G05 NoEresLento" from={454} durationInFrames={120} layout="none">
        <G05_NoEresLento />
      </Sequence>
      <Sequence name="G06 TareasRepetitivas" from={574} durationInFrames={116} layout="none">
        <G06_TareasRepetitivas />
      </Sequence>
      <Sequence name="G07 Dirigir" from={690} durationInFrames={130} layout="none">
        <G07_Dirigir />
      </Sequence>
      <Sequence name="G09 Taller10x" from={820} durationInFrames={90} layout="none">
        <G09_Taller10x />
      </Sequence>
      <Sequence name="G10 Pendientes" from={910} durationInFrames={70} layout="none">
        <G10_Pendientes />
      </Sequence>
      <Sequence name="G11 SalesConSistemas" from={980} durationInFrames={56} layout="none">
        <G11_SalesConSistemas />
      </Sequence>
      <Sequence name="G12 FlujosNumero" from={1036} durationInFrames={112} layout="none">
        <G12_FlujosNumero />
      </Sequence>
      <Sequence name="G13 CeroCodigo" from={1148} durationInFrames={108} layout="none">
        <G13_CeroCodigo />
      </Sequence>
      <Sequence name="G14 Fundadores" from={1256} durationInFrames={140} layout="none">
        <G14_Fundadores />
      </Sequence>
      <Sequence name="G15 Fechas" from={1396} durationInFrames={85} layout="none">
        <G15_Fechas />
      </Sequence>
      <Sequence name="G16 DoceLugares" from={1481} durationInFrames={60} layout="none">
        <G16_DoceLugares />
      </Sequence>
      <Sequence name="G17 CTAPill" from={1541} durationInFrames={60} layout="none">
        <G17_CTAPill />
      </Sequence>
      <Sequence name="G18 URL" from={1601} durationInFrames={60} layout="none">
        <G18_URL />
      </Sequence>
    </AbsoluteFill>
  );
};
