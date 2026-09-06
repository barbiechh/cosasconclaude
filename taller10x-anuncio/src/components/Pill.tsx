import { fontFamily, COLORS } from "../theme";

export const Pill: React.FC<{
  children: React.ReactNode;
  variant?: "black" | "beige" | "outline";
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, variant = "beige", fontSize = 24, style }) => {
  const background =
    variant === "black" ? COLORS.textPrimary : variant === "beige" ? COLORS.pillBg : "transparent";
  const color = variant === "black" ? COLORS.white : COLORS.textPrimary;
  const border = variant === "outline" ? `1.5px solid ${COLORS.textSecondary}` : "none";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "16px 36px",
        borderRadius: 999,
        backgroundColor: background,
        color,
        border,
        fontFamily,
        fontWeight: 500,
        fontSize,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
