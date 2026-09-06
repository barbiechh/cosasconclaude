import { Composition, Folder } from "remotion";
import { Ad } from "./Ad";
import { Ad35 } from "./Ad35";
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

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const MyComposition = () => {
  return (
    <>
      <Composition
        id="Taller10x-Master-60s"
        component={Ad}
        durationInFrames={1800}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Taller10x-35s"
        component={Ad35}
        durationInFrames={1050}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Folder name="Taller10x-Scenes">
        <Composition id="Scene01Hook" component={Scene01Hook} durationInFrames={60} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene02Columna" component={Scene02Columna} durationInFrames={210} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene03Total" component={Scene03Total} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene04Linea" component={Scene04Linea} durationInFrames={90} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene05Petroleo" component={Scene05Petroleo} durationInFrames={180} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene06Revelacion" component={Scene06Revelacion} durationInFrames={150} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene07Promesa" component={Scene07Promesa} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene08Flujo1" component={Scene08Flujo1} durationInFrames={150} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene09Flujo2" component={Scene09Flujo2} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene10Metodo" component={Scene10Metodo} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene11Fundadores" component={Scene11Fundadores} durationInFrames={150} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene12Acompanamiento" component={Scene12Acompanamiento} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene13Escasez" component={Scene13Escasez} durationInFrames={120} fps={FPS} width={WIDTH} height={HEIGHT} />
        <Composition id="Scene14CTA" component={Scene14CTA} durationInFrames={90} fps={FPS} width={WIDTH} height={HEIGHT} />
      </Folder>
    </>
  );
};
