import { ImageResponse } from "next/og";
import { ENTRIES, getEntry } from "@/lib/directory/entries";

/**
 * A share card per directory page, generated at build time from that entry's
 * own data — its name, the languages you'll actually hear, its real peak hours.
 *
 * Without this every directory page would share the one generic site card, so
 * 200 links posted to WhatsApp or X would look identical. Generating from the
 * entry means the card can never drift out of sync with the page either.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ slug: e.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);

  const heading = entry ? entry.title.split("—")[0].trim() : "Vidibro";
  const languages = entry ? entry.languages.slice(0, 4).join("  ·  ") : "";
  const peak = entry ? entry.peakHours : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 72px",
          background: "linear-gradient(135deg, #0e0828 0%, #1a0b3d 55%, #2a0f4a 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 8l4 4-4 4" />
            <path d="M20 8l-4 4 4 4" />
            <circle cx="12" cy="12" r="1.6" fill="#c084fc" stroke="none" />
          </svg>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#d8b4fe", letterSpacing: -0.5 }}>
            Vidibro
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, color: "white", letterSpacing: -2, lineHeight: 1.05 }}>
            {heading}
          </div>
          {languages && (
            <div style={{ display: "flex", fontSize: 30, color: "#c4b5fd", marginTop: 24 }}>{languages}</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {peak && <div style={{ display: "flex", fontSize: 25, color: "#a78bfa" }}>Busiest {peak}</div>}
          <div style={{ display: "flex", fontSize: 25, color: "#a78bfa" }}>No signup · Video · Voice · Text</div>
        </div>
      </div>
    ),
    size
  );
}
