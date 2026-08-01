/**
 * The directory's data model.
 *
 * The shape here is deliberately opinionated: every field that exists is a field
 * that must differ between pages. A template whose only variable is a place name
 * produces 240 near-identical pages, which is what Google's scaled-content-abuse
 * policy targets and what "Crawled – currently not indexed" is for.
 *
 * So the required fields below are the ones that carry genuine local specifics:
 * real languages, real peak hours in local time, real places, real conversation
 * material. If a new entry cannot fill them with something true, the page should
 * not be published.
 */

export type DirectoryKind = "country" | "city" | "language" | "topic";

export type FAQ = { question: string; answer: string };

/** A contextual in-content link. See LINKING_RULES for the required minimums. */
export type RelatedLink = {
  slug: string;
  label: string;
  /** Why this link exists, so the template can phrase it in a sentence. */
  relation: "city" | "language" | "mode" | "competitor" | "sibling" | "topic";
};

export type DirectoryEntry = {
  /** URL segment. One page per market — alternates 301 here (see redirects.ts). */
  slug: string;
  kind: DirectoryKind;

  /** Display name, e.g. "India", "Kolkata", "Bengali". */
  name: string;
  /** For cities: the country it belongs to, for breadcrumbs and linking. */
  parent?: string;

  // --- Search metadata -----------------------------------------------------
  /** The one query this page exists to answer. Must be unique across entries. */
  primaryKeyword: string;
  title: string;
  description: string;

  // --- Locally true data — the anti-duplicate payload ----------------------
  /** Languages genuinely spoken, native script first: ["বাংলা (Bengali)", …] */
  languages: string[];
  /** Real local-time window, e.g. "21:00 – 01:00 IST". */
  peakHours: string;
  /** IANA zone, so the template can show "busy right now" honestly. */
  timezone: string;
  /** Named places within this market — cities for a country, areas for a city. */
  places: string[];
  /**
   * Conversation material that is actually true here. This is the field that
   * most stops a page reading as generated, so it is required, not optional.
   */
  talkingPoints: string[];
  /** Network reality — shapes genuinely useful video-quality advice. */
  connectivityNote: string;
  /** Anything about safety or etiquette that genuinely differs in this market. */
  localNote: string;

  // --- Body ----------------------------------------------------------------
  /** Opening paragraphs. Lead with substance; no "In today's digital world". */
  intro: string[];
  /** Market-specific questions, not the same five with a name swapped. */
  faqs: FAQ[];

  // --- Linking -------------------------------------------------------------
  related: RelatedLink[];
};

/**
 * Minimum contextual links per page, derived from silly.chat/video-chat-india,
 * which carries 38 unique internal links and uses them to form a per-market
 * hub-and-spoke. That linking — not word count — is what gets the long tail
 * crawled without any external links pointing at it.
 */
export const LINKING_RULES: Record<RelatedLink["relation"], number> = {
  city: 3,
  language: 2,
  mode: 2,
  competitor: 1,
  sibling: 2,
  topic: 0,
};

/** Throws at build time rather than shipping a page that breaks the rules. */
export function assertEntryIsPublishable(e: DirectoryEntry): void {
  const problems: string[] = [];

  if (e.languages.length === 0) problems.push("no languages");
  if (e.places.length < 3) problems.push("fewer than 3 named places");
  if (e.talkingPoints.length < 3) problems.push("fewer than 3 talking points");
  if (e.faqs.length < 5) problems.push("fewer than 5 FAQs");
  if (e.intro.join(" ").split(/\s+/).length < 120) problems.push("intro under 120 words");

  for (const [relation, min] of Object.entries(LINKING_RULES)) {
    if (min === 0) continue;
    const count = e.related.filter((r) => r.relation === relation).length;
    if (count < min) problems.push(`${count}/${min} ${relation} links`);
  }

  if (problems.length) {
    throw new Error(`Directory entry "${e.slug}" is not publishable: ${problems.join("; ")}`);
  }
}
