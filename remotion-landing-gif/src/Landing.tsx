import React from "react";
import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

export const FPS = 20;
export const WIDTH = 1080;
export const HEIGHT = 1080;

const SCENE_A = 34; // intro / badge
const SCENE_B = 40; // headline
const SCENE_C = 36; // subhead
const SCENE_D = 48; // time calculator
const SCENE_E = 30; // trust logos
const SCENE_F = 42; // price / cta

export const DURATION_IN_FRAMES =
  SCENE_A + SCENE_B + SCENE_C + SCENE_D + SCENE_E + SCENE_F;

const COLORS = {
  bg: "#f1efe9",
  black: "#111111",
  gray: "#7c7a74",
  grayLight: "#a4a29b",
  peachBg: "#f6d9bc",
  peachText: "#8a5124",
  cardBg: "#ffffff",
  cardBorder: "#e4e1d8",
};

const FONT =
  "'Helvetica Neue', Helvetica, Arial, -apple-system, sans-serif";

const fadeInOut = (frame: number, duration: number, edge = 9) => {
  return interpolate(
    frame,
    [0, edge, duration - edge, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
};

const riseIn = (frame: number, delay = 0) => {
  const f = Math.max(0, frame - delay);
  const y = interpolate(f, [0, 14], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const o = interpolate(f, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { transform: `translateY(${y}px)`, opacity: o };
};

const Scene: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, duration);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily: FONT,
        opacity,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Logo: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: COLORS.black,
      }}
    />
    <span
      style={{
        fontSize: size * 0.85,
        fontWeight: 700,
        color: COLORS.black,
        letterSpacing: -0.5,
      }}
    >
      Espacio
    </span>
  </div>
);

const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  border?: string;
  style?: React.CSSProperties;
}> = ({ children, bg = COLORS.black, color = "#fff", border, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "16px 34px",
      borderRadius: 999,
      background: bg,
      color,
      fontSize: 24,
      fontWeight: 700,
      border: border ? `1.5px solid ${border}` : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------- Scene A: intro / badge ----------
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={SCENE_A}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={riseIn(frame, 0)}>
          <Logo size={54} />
        </div>
        <div
          style={{
            ...riseIn(frame, 8),
            background: COLORS.peachBg,
            color: COLORS.peachText,
            padding: "14px 30px",
            borderRadius: 999,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          Taller 10x · CDMX · 25 de septiembre, 2026
        </div>
      </div>
    </Scene>
  );
};

// ---------- Scene B: headline ----------
const HeadlineScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={SCENE_B}>
      <div style={{ textAlign: "center", padding: "0 70px" }}>
        <div
          style={{
            ...riseIn(frame, 0),
            fontSize: 92,
            fontWeight: 800,
            color: COLORS.black,
            letterSpacing: -2,
            lineHeight: 1.02,
          }}
        >
          Multiplícate <span style={{ fontStyle: "normal" }}>×10</span>
        </div>
        <div
          style={{
            ...riseIn(frame, 10),
            fontSize: 92,
            fontWeight: 800,
            color: COLORS.grayLight,
            letterSpacing: -2,
            lineHeight: 1.02,
            marginTop: 4,
          }}
        >
          en un solo día.
        </div>
      </div>
    </Scene>
  );
};

// ---------- Scene C: subhead ----------
const SubheadScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={SCENE_C}>
      <div style={{ textAlign: "center", padding: "0 90px" }}>
        <div
          style={{
            ...riseIn(frame, 0),
            fontSize: 30,
            color: COLORS.gray,
            lineHeight: 1.4,
            marginBottom: 26,
          }}
        >
          El taller presencial para ejecutivos y equipos que quieren hacer
          sus tareas repetitivas hasta diez veces más rápido con IA.
        </div>
        <div
          style={{
            ...riseIn(frame, 12),
            fontSize: 34,
            fontWeight: 700,
            color: COLORS.black,
            lineHeight: 1.35,
          }}
        >
          Llegas con tu lista de pendientes.
          <br />
          Sales con sistemas que la trabajan por ti.
        </div>
      </div>
    </Scene>
  );
};

// ---------- Scene D: time calculator ----------
const TASKS = [
  { label: "Generación de reportes", hours: 3 },
  { label: "Generación y envío de correos", hours: 3 },
  { label: "Prospección y seguimiento de clientes", hours: 4 },
];

const CalculatorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const totalDelay = 16;
  const total = TASKS.reduce((a, t) => a + t.hours, 0);
  const counter = Math.round(
    interpolate(
      Math.max(0, frame - totalDelay - TASKS.length * 8),
      [0, 16],
      [0, total],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  return (
    <Scene duration={SCENE_D}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 780 }}>
        <div
          style={{
            ...riseIn(frame, 0),
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.black,
            letterSpacing: 0.5,
            marginBottom: 22,
            textTransform: "uppercase",
          }}
        >
          ¿Cuánto vale tu tiempo?
        </div>
        <div
          style={{
            background: COLORS.cardBg,
            border: `1.5px solid ${COLORS.cardBorder}`,
            borderRadius: 24,
            padding: "32px 40px",
            width: "100%",
            boxShadow: "0 20px 40px -24px rgba(0,0,0,0.15)",
          }}
        >
          {TASKS.map((t, i) => (
            <div
              key={t.label}
              style={{
                ...riseIn(frame, 8 + i * 8),
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom:
                  i < TASKS.length - 1 ? `1px solid ${COLORS.cardBorder}` : "none",
              }}
            >
              <span style={{ fontSize: 24, color: COLORS.black }}>
                {t.label}
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.black }}>
                {t.hours} h
              </span>
            </div>
          ))}
          <div
            style={{
              ...riseIn(frame, totalDelay + TASKS.length * 8),
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              paddingTop: 20,
              borderTop: `1.5px solid ${COLORS.black}`,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.black }}>
              Total a la semana
            </span>
            <span style={{ fontSize: 40, fontWeight: 800, color: COLORS.black }}>
              {counter} h
            </span>
          </div>
        </div>
      </div>
    </Scene>
  );
};

// ---------- Scene E: trust logos ----------
const LOGOS: { name: string; color: string; weight?: number; italic?: boolean }[] = [
  { name: "Red Bull", color: "#d40000", weight: 800 },
  { name: "Johnson & Johnson", color: "#d00000", italic: true, weight: 600 },
  { name: "Santander", color: "#ec0000", weight: 700 },
  { name: "Stripe", color: "#635bff", weight: 700 },
  { name: "Bitso", color: "#111111", weight: 800 },
  { name: "Coca-Cola", color: "#e30613", italic: true, weight: 700 },
];

const LogosScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={SCENE_E}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 860 }}>
        <div
          style={{
            ...riseIn(frame, 0),
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.gray,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginBottom: 40,
            textAlign: "center",
          }}
        >
          Empresas que han confiado en nosotros
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "38px 50px",
          }}
        >
          {LOGOS.map((l, i) => (
            <div
              key={l.name}
              style={{
                ...riseIn(frame, 6 + i * 5),
                fontSize: 36,
                fontWeight: l.weight ?? 700,
                fontStyle: l.italic ? "italic" : "normal",
                color: l.color,
              }}
            >
              {l.name}
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

// ---------- Scene F: price / cta ----------
const BULLETS = [
  "Un día completo, presencial y práctico",
  "Trabajas sobre los casos reales de tu empresa",
  "45 días de seguimiento y taller de actualización",
];

const PriceScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={SCENE_F}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 760 }}>
        <div
          style={{
            ...riseIn(frame, 0),
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.gray,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Taller 10x · Presencial · Un día
        </div>
        <div
          style={{
            ...riseIn(frame, 6),
            fontSize: 96,
            fontWeight: 800,
            color: COLORS.black,
            letterSpacing: -2,
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          $19,900
          <span style={{ fontSize: 26, fontWeight: 600, color: COLORS.gray, marginBottom: 14 }}>
            MXN / persona
          </span>
        </div>
        <div style={{ marginTop: 28, marginBottom: 36 }}>
          {BULLETS.map((b, i) => (
            <div
              key={b}
              style={{
                ...riseIn(frame, 14 + i * 6),
                fontSize: 24,
                color: COLORS.black,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {b}
            </div>
          ))}
        </div>
        <div style={riseIn(frame, 32)}>
          <Pill style={{ fontSize: 26, padding: "20px 42px" }}>
            Inscríbete al Taller 10x
          </Pill>
        </div>
      </div>
    </Scene>
  );
};

export const Landing: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_A}>
        <IntroScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_B}>
        <HeadlineScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_C}>
        <SubheadScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_D}>
        <CalculatorScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_E}>
        <LogosScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_F}>
        <PriceScene />
      </Series.Sequence>
    </Series>
  );
};
