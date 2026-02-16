import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            fontFamily: "serif",
            letterSpacing: "0.01em",
            background: "linear-gradient(135deg, #EFBC9F, #D797A6, #FF9ED1)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          1984
        </div>
      </div>
    ),
    { ...size }
  );
}
