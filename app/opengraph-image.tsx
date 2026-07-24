import { ImageResponse } from "next/og";

export const alt = "Hrijul Bhatnagar — Founding Engineer at Thesys";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0c0a",
          color: "#f0eee8",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8d887c",
          }}
        >
          <span>Founding Engineer at Thesys</span>
          <span style={{ color: "#2dd4bf" }}>aviusx.dev</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 1 }}>
            HRIJUL
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              margin: "12px 0",
            }}
          >
            <div style={{ height: 2, flexGrow: 1, background: "#33312d" }} />
            <div style={{ fontSize: 28, color: "#2dd4bf", fontStyle: "italic" }}>
              also known online as AviusX
            </div>
          </div>
          <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 1 }}>
            BHATNAGAR
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#8d887c",
          }}
        >
          <span>Generative UI · LLMs · React · TypeScript</span>
          <span>Bengaluru, IN</span>
        </div>
      </div>
    ),
    size
  );
}
