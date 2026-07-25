import { ImageResponse } from "next/og";

export const alt = "देवो के देव — Devo ke Dev | God of All Gods";
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
          background:
            "radial-gradient(circle at 50% 42%, #241040 0%, #0d0618 45%, #060309 100%)",
          color: "#f3e9d2",
          padding: 64,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a3906f",
          }}
        >
          <span>God of All Gods</span>
          <span style={{ color: "#f0c24b" }}>devoke.dev</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 40, color: "#f0c24b", marginBottom: 8 }}>
            ॥ देवो के देव ॥
          </div>
          <div
            style={{
              fontSize: 130,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: 4,
              background:
                "linear-gradient(180deg, #ffedb0 0%, #f0c24b 45%, #b47416 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            DEVO KE DEV
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 18,
            }}
          >
            <div style={{ height: 2, width: 120, background: "#3d2a10" }} />
            <div style={{ fontSize: 26, color: "#a3906f", fontStyle: "italic" }}>
              the god mortals know as Hrijul “AviusX” Bhatnagar
            </div>
            <div style={{ height: 2, width: 120, background: "#3d2a10" }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#a3906f",
          }}
        >
          <span>Generative UI · LLMs · Divine Feats</span>
          <span style={{ color: "#ff7a1a" }}>power level: over 9000</span>
        </div>
      </div>
    ),
    size
  );
}
