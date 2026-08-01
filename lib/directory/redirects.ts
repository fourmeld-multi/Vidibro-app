import { ENTRIES } from "./entries";

/**
 * Alternate keyword slugs that 301 into a canonical directory page.
 *
 * The rule: **one page per market**. People search both "video chat india" and
 * "random video chat india", and the tempting move is to build a page for each.
 * That produces two URLs competing for one intent, which splits any authority
 * they earn and is a textbook duplicate-content problem.
 *
 * silly.chat handles this correctly — /random-video-chat-india 301s to
 * /video-chat-india — and it is worth copying exactly. A permanent redirect
 * passes the signal to the canonical page instead of splitting it.
 *
 * Generated from the entries themselves so a new page automatically gets its
 * alternates, rather than relying on someone remembering to add them.
 */

/** Prefix variants people actually search, mapped onto our canonical pattern. */
const COUNTRY_CITY_PREFIXES = ["random-video-chat", "video-call", "random-chat"];
const LANGUAGE_SUFFIX_ALTERNATES = ["chat-online", "video-call"];

export type Redirect = { source: string; destination: string; permanent: true };

export function directoryRedirects(): Redirect[] {
  const out: Redirect[] = [];

  for (const entry of ENTRIES) {
    const canonical = `/directory/${entry.slug}`;

    // The bare slug at the root, e.g. /video-chat-india -> /directory/video-chat-india.
    // Worth having because it is the shorter, more linkable form people guess at.
    out.push({ source: `/${entry.slug}`, destination: canonical, permanent: true });

    if (entry.kind === "country" || entry.kind === "city") {
      // "video-chat-india" -> "india"
      const place = entry.slug.replace(/^video-chat-/, "");
      for (const prefix of COUNTRY_CITY_PREFIXES) {
        out.push({ source: `/${prefix}-${place}`, destination: canonical, permanent: true });
        out.push({ source: `/directory/${prefix}-${place}`, destination: canonical, permanent: true });
      }
    }

    if (entry.kind === "language") {
      // "bengali-video-chat" -> "bengali"
      const lang = entry.slug.replace(/-video-chat$/, "");
      for (const suffix of LANGUAGE_SUFFIX_ALTERNATES) {
        out.push({ source: `/${lang}-${suffix}`, destination: canonical, permanent: true });
        out.push({ source: `/directory/${lang}-${suffix}`, destination: canonical, permanent: true });
      }
    }
  }

  // A redirect whose source is also a real page would shadow that page.
  const realPages = new Set(ENTRIES.map((e) => `/directory/${e.slug}`));
  return out.filter((r) => !realPages.has(r.source) && r.source !== r.destination);
}
