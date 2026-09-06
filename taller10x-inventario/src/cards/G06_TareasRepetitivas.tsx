import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Line } from "../components/Line";
import { LoopIcon } from "../components/icons/LoopIcon";

// T12 (0-56) + T13 (56-116) — petróleo. A spinning loop reads instantly as
// "repetition" — replaces the earlier node-web, which read as noise.
export const G06_TareasRepetitivas: React.FC = () => {
  const frame = useCurrentFrame();

  const loopOpacity = interpolate(frame, [56, 68], [0.55, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const push = interpolate(frame, [0, 116], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.petroleo, justifyContent: "center", alignItems: "center", scale: `${push}` }}>
      <div style={{ position: "absolute", translate: "0px 260px", opacity: loopOpacity }}>
        <LoopIcon color={COLORS.durazno} size={280} startFrame={4} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <Line enterFrame={0} fontSize={68} color={COLORS.marfil} weight={400} segments={[{ text: "Las tareas repetitivas" }]} />
        <Line
          enterFrame={56}
          fontSize={68}
          color={COLORS.marfil}
          weight={400}
          segments={[
            { text: "ya no son de " },
            { text: "personas.", color: COLORS.durazno, decoration: "underline", decorationFrame: 68 },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};
