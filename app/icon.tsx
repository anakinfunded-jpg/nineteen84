import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "serif",
            background: "linear-gradient(135deg, #EFBC9F, #FF9ED1)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          84
        </div>
      </div>
    ),
    { ...size }
  );
}
