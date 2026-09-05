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

/** Optional per-market cultural fact cards — rendered as a visual strip on the page.
 *  Only add where the facts are genuinely specific to the market. */
export type QuickFact = { emoji: string; title: string; body: string };

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
  /** Bold lead line under the H1. Rendered as a <p>, not a second heading —
   *  repeating the H1 as an H2 (as the competitor does) wastes a heading. */
  tagline?: string;

  // --- Locally true data — the anti-duplicate payload ----------------------
  /** Languages genuinely spoken, native script first: ["বাংলা (Bengali)", …] */
  languages: string[];
  /** Real local-time window, e.g. "21:00 – 01:00 IST". Places only. */
  peakHours?: string;
  /** IANA zone. Drives the live local-time and peak/quiet state. Places only. */
  timezone?: string;
  /**
   * Relative market size, used only to scale the presentation "online now"
   * figure so India does not show the same number as a small market. 1 is a
   * mid-sized country. Not a measurement of anything.
   */
  weight?: number;
  /** Named places within this market — cities for a country, areas for a city. */
  places?: string[];
  /**
   * Conversation material that is actually true here. This is the field that
   * most stops a page reading as generated, so it is required, not optional.
   */
  talkingPoints: string[];
  /** Network reality — shapes genuinely useful video-quality advice. */
  connectivityNote?: string;
  /** Anything about safety or etiquette that genuinely differs in this market. */
  localNote?: string;
  /**
   * A safety or etiquette point true of this market specifically.
   *
   * Exists to break up boilerplate as much as to inform. Measured across the
   * first 15 pages, ~48% of each page's text was identical to every other
   * page — the shared safety section being one of the largest blocks. Every
   * field like this one moves that ratio in the right direction, and a shared
   * block that never varies is what makes a programmatic page look generated.
   */
  safetyNote?: string;
  /** How people here open and close conversations, and what lands badly. */
  etiquette?: string;

  /**
   * Market-specific cards that only appear where they are true.
   *
   * The strongest defence against boilerplate is not varying the words inside a
   * fixed set of sections — it is having different sections. A page about Russia
   * carrying a card on winter and one on what not to discuss, where the Brazil
   * page instead carries Carnival and "Portuguese, not Spanish", produces pages
   * with genuinely different shapes rather than the same shape refilled.
   *
   * Only add one where there is something real to say. An empty spotlight is
   * worse than none.
   */
  spotlights?: Array<{
    title: string;
    body: string;
    /** Drives the icon and colour, so the cards read as a consistent family. */
    kind: "diaspora" | "seasonal" | "legal" | "cost" | "culture" | "infra" | "time";
  }>;

  /**
   * Phrases a visitor can actually use, with meaning and rough pronunciation.
   * The single most useful thing a page like this can carry — it turns the page
   * from something you read into something you use during a call.
   */
  localPhrases?: Array<{ phrase: string; meaning: string; say: string }>;

  /**
   * Openers, as something copyable rather than a bullet. A specific question
   * beats a topic: "which pandal are you doing this year?" gets a reply,
   * "festivals" does not.
   */
  starters?: Array<{ topic: string; ask: string; why: string }>;

  // --- Body ----------------------------------------------------------------
  /** Opening paragraphs. Lead with substance; no "In today's digital world". */
  intro: string[];
  /** Market-specific questions, not the same five with a name swapped. */
  faqs: FAQ[];

  /** Cultural fact cards — shown as a visual strip. Only populate where facts are
   *  genuinely specific and surprising about this market. */
  quickFacts?: QuickFact[];

  /** Override the "Why use Vidibro in {name}?" heading with a shorter local name. */
  whyName?: string;

  /** Hide the "What is random video chat in X?" section. */
  hideWhatIs?: boolean;

  /** User reviews shown in a "What Users Say" section. */
  reviews?: Array<{ name: string; flag: string; text: string; role: string }>;

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

/**
 * Throws at build time rather than shipping a page that breaks the rules.
 *
 * Place pages and topic pages are held to different standards because they are
 * different things. A country page without local peak hours or named cities is
 * a thin page pretending to be about a market. A topic page has neither by
 * definition, so requiring them would only produce invented values — which is
 * worse than not having the field.
 */
export function assertEntryIsPublishable(e: DirectoryEntry): void {
  const problems: string[] = [];
  const isPlace = e.kind !== "topic";

  if (e.languages.length === 0) problems.push("no languages");
  if (e.faqs.length < 5) problems.push("fewer than 5 FAQs");
  if (e.intro.join(" ").split(/\s+/).length < 120) problems.push("intro under 120 words");

  if (isPlace) {
    if (!e.peakHours) problems.push("no peak hours");
    if (!e.timezone) problems.push("no timezone");
    if (!e.places || e.places.length < 3) problems.push("fewer than 3 named places");
    if (!e.connectivityNote) problems.push("no connectivity note");
    if (!e.localNote) problems.push("no local note");
    if (e.talkingPoints.length < 3) problems.push("fewer than 3 talking points");
  }

  // Topic pages have no cities or siblings of their own, so they are held to
  // the link rules that actually apply to them.
  const rules = isPlace ? LINKING_RULES : { city: 0, language: 0, mode: 2, competitor: 1, sibling: 0, topic: 0 };
  for (const [relation, min] of Object.entries(rules)) {
    if (min === 0) continue;
    const count = e.related.filter((r) => r.relation === relation).length;
    if (count < min) problems.push(`${count}/${min} ${relation} links`);
  }

  if (problems.length) {
    throw new Error(`Directory entry "${e.slug}" is not publishable: ${problems.join("; ")}`);
  }
}
