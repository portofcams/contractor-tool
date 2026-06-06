import { ImageResponse } from "next/og";

export const alt = "ProBuildCalc — LiDAR room scans and material takeoffs for contractors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default Open Graph / social image for the whole site (Next file convention).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1220 0%, #1d4ed8 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 36, letterSpacing: -1, opacity: 0.85 }}>ProBuildCalc</div>
        <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>
          LiDAR scans to material takeoffs
        </div>
        <div style={{ fontSize: 30, opacity: 0.9, marginTop: 28 }}>
          Square footage, quotes and blueprints — built for contractors
        </div>
      </div>
    ),
    { ...size }
  );
}
