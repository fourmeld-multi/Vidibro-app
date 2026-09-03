import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

/**
 * Generates the social share card at build time.
 *
 * lib/seo.ts previously pointed every page's og:image at /og-image.webp, which
 * does not exist in public/ — so every share on WhatsApp, X, Facebook and
 * Slack rendered with a broken image. Generating it here means the file can
 * never drift out of sync with the brand again, and Next serves it to any route
 * that does not override it.
 */

export const alt = "Vidibro — anonymous video, voice and text chat with strangers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const iconData = readFileSync(path.join(process.cwd(), "public/icon.png"));

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
          background: "linear-gradient(135deg, #0e0828 0%, #1a0b3d 55%, #2a0f4a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginBottom: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${Buffer.from(iconData).toString("base64")}`}
            width={110}
            height={110}
            style={{ borderRadius: 24 }}
          />
          <div style={{ fontSize: 92, fontWeight: 800, color: "white", letterSpacing: -2 }}>
            Vidibro
          </div>
        </div>

        <div style={{ fontSize: 40, color: "#d8b4fe", fontWeight: 600 }}>
          Talk to a random stranger, instantly
        </div>

        <div style={{ fontSize: 27, color: "#a78bfa", marginTop: 26 }}>
          Video · Voice · Text — no signup, no history
        </div>
      </div>
    ),
    size
  );
}
