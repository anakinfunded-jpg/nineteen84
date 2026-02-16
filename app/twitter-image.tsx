import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "1984 — AI, ki piše slovensko";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#171717",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(254,176,137,0.08) 0%, transparent 60%)",
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 120,
            fontFamily: "serif",
            fontWeight: 400,
            letterSpacing: "0.01em",
            background: "linear-gradient(90deg, #EFBC9F, #D797A6, #FF9ED1)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          1984
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(225,225,225,0.5)",
            marginTop: 16,
            display: "flex",
          }}
        >
          AI, ki piše slovensko
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(225,225,225,0.3)",
            marginTop: 24,
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          Prva slovenska AI platforma za ustvarjanje marketinških vsebin
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #FFB288, #FEB089, #EE94B0)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
