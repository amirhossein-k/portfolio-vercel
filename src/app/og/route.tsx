import { ImageResponse } from "next/og";

export const runtime = "edge";

// تصویر پیش‌نمایش لینک (تلگرام، لینکدین، واتساپ، گوگل). متن انگلیسی است تا به فونت فارسی نیاز نباشد.
export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0e130f", color: "#f4f1ea" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#f5b942" }}>
          <div style={{ display: "flex", padding: "8px 16px", borderRadius: 12, background: "#f5b942", color: "#0e130f", fontWeight: 800 }}>{"</>"}</div>
          Full-Stack Web Developer
        </div>
        <div style={{ marginTop: 28, fontSize: 84, fontWeight: 900, lineHeight: 1.05 }}>Amirhossein Karimi</div>
        <div style={{ marginTop: 24, fontSize: 38, color: "#b9b4a8" }}>Personal Websites · E-commerce · Admin Dashboards</div>
        <div style={{ marginTop: 48, fontSize: 28, color: "#7d8a7f" }}>Next.js · React · TypeScript · Telegram Bots</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
