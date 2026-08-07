import { ImageResponse } from "next/og";

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
            gap: 28,
            marginBottom: 28,
          }}
        >
          {/* Same mark as LogoMark: two chevrons meeting at a centre dot. */}
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 8l4 4-4 4" />
            <path d="M20 8l-4 4 4 4" />
            <circle cx="12" cy="12" r="1.6" fill="#c084fc" stroke="none" />
          </svg>
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
