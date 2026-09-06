import { fontFamily } from "../theme";

export const Card: React.FC<{
  children: React.ReactNode;
  width?: number | string;
  padding?: number;
  style?: React.CSSProperties;
}> = ({ children, width = "auto", padding = 40, style }) => {
  return (
    <div
      style={{
        width,
        padding,
        borderRadius: 32,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 12px 40px rgba(17,17,17,0.06)",
        fontFamily,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
