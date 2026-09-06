import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { fontFamily, COLORS } from "../theme";
import { Card } from "../components/Card";

const ROWS: { date: string; status: string; strike?: boolean; strikeFrame?: number }[] = [
  { date: "11 de septiembre", status: "agotado", strike: true, strikeFrame: 10 },
  { date: "18 de septiembre", status: "agotado", strike: true, strikeFrame: 24 },
  { date: "25 de septiembre", status: "12 lugares" },
];

// 35s cut — compressed version of Scene13Escasez (60f instead of 120f).
export const Scene13CompactEscasez: React.FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardScale = interpolate(frame, [0, 10], [0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  const highlightFrame = 40;
  const highlightScale = interpolate(frame, [highlightFrame, highlightFrame + 4, highlightFrame + 10], [1, 1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.marfil,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ opacity: cardOpacity, scale: `${cardScale}` }}>
        <Card width={1000} padding={56}>
          {ROWS.map((row, i) => {
            const dim = row.strike
              ? interpolate(frame, [row.strikeFrame!, row.strikeFrame! + 10], [1, 0.3], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 1;
            const strikeWidth = row.strike
              ? interpolate(frame, [row.strikeFrame!, row.strikeFrame! + 9], [0, 100], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })
              : 0;
            return (
              <div
                key={row.date}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: 880,
                  padding: "22px 0",
                  borderBottom: i < ROWS.length - 1 ? "1px solid #EDEBE4" : "none",
                  opacity: dim,
                }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ fontFamily, fontSize: 36, fontWeight: 400, color: COLORS.textPrimary }}>
                    {row.date}
                  </span>
                  {row.strike ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        width: `${strikeWidth}%`,
                        height: 2,
                        backgroundColor: COLORS.textPrimary,
                      }}
                    />
                  ) : null}
                </div>
                <span
                  style={{
                    fontFamily,
                    fontSize: 36,
                    fontWeight: row.strike ? 400 : 700,
                    color: COLORS.textPrimary,
                    scale: row.strike ? "1" : `${highlightScale}`,
                  }}
                >
                  {row.status}
                </span>
              </div>
            );
          })}
        </Card>
      </div>
    </AbsoluteFill>
  );
};
