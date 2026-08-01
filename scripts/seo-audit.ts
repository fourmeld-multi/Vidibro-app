/**
 * SEO audit. Run against a running server:
 *
 *   npm run build && npm start &
 *   npx tsx --tsconfig tsconfig.json scripts/seo-audit.ts http://localhost:3000
 *
 * Two kinds of check, and the second is the reason this exists.
 *
 * The structural checks (titles, canonicals, H1s, schema, thin pages) catch
 * regressions a template change can cause across every page at once.
 *
 * The **near-duplicate check** catches the thing no other tool here can: two
 * pages that say the same thing in different words. That is the specific
 * failure mode of a programmatic directory — writing Mumbai by lightly editing
 * Delhi — and it is invisible to a human reviewing page 40 of 200. It compares
 * every page against every other using word shingles, which is roughly how
 * search engines detect duplication in the first place.
 *
 * Exits non-zero if anything fails, so it can gate a deploy.
 */

const BASE = process.argv[2] ?? "http://localhost:3000";

// Two pages sharing more than this fraction of their 5-word sequences are
// almost certainly one page rewritten. Our template contributes a shared
// baseline, so this sits above that but well below "rewritten twin".
const SIMILARITY_LIMIT = 0.5;
const MIN_WORDS = 600;
const SHINGLE = 5;

type Page = {
  url: string;
  status: number;
  title: string;
  description: string;
  canonical: string;
  h1s: string[];
  words: number;
  text: string;
  schemaTypes: string[];
  imagesMissingAlt: number;
  internalLinks: string[];
};

const strip = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const one = (html: string, re: RegExp) => html.match(re)?.[1]?.trim() ?? "";
const all = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => m[1].trim());

async function fetchPage(url: string): Promise<Page> {
  const res = await fetch(url);
  const html = await res.text();
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  const text = strip(main);

  const schemaTypes = [...html.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]);

  return {
    url,
    status: res.status,
    title: one(html, /<title>([^<]*)<\/title>/i),
    description: one(html, /<meta name="description" content="([^"]*)"/i),
    canonical: one(html, /<link rel="canonical" href="([^"]*)"/i),
    h1s: all(main, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map(strip),
    words: text ? text.split(/\s+/).length : 0,
    text,
    schemaTypes: [...new Set(schemaTypes)],
    imagesMissingAlt: [...main.matchAll(/<img\b[^>]*>/gi)].filter((m) => !/\balt=/.test(m[0])).length,
    // Deliberately the whole document, not just <main>: nav and footer links
    // are real internal links. Reading only <main> reported every
    // footer-linked page as an orphan.
    internalLinks: [...new Set(all(html, /href="(\/[^"#?]*)"/g))],
  };
}

/** Word shingles — the unit search engines use to spot rewritten pages. */
function shingles(text: string): Set<string> {
  const w = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + SHINGLE <= w.length; i++) out.add(w.slice(i, i + SHINGLE).join(" "));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const s of a) if (b.has(s)) shared++;
  return shared / (a.size + b.size - shared);
}

async function main() {
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, BASE));

  console.log(`Auditing ${urls.length} URLs from the sitemap\n`);

  const pages: Page[] = [];
  for (const u of urls) {
    try {
      pages.push(await fetchPage(u));
    } catch (e) {
      console.log(`  FETCH FAILED  ${u}  ${(e as Error).message}`);
    }
  }

  const fail: string[] = [];
  const warn: string[] = [];
  const path = (u: string) => u.replace(BASE, "") || "/";

  // --- structural ---------------------------------------------------------
  const byTitle = new Map<string, string[]>();
  for (const p of pages) {
    if (p.status !== 200) fail.push(`${path(p.url)} returned ${p.status}`);
    if (!p.title) fail.push(`${path(p.url)} has no <title>`);
    if (!p.description) fail.push(`${path(p.url)} has no meta description`);
    if (!p.canonical) fail.push(`${path(p.url)} has no canonical`);
    if (p.h1s.length === 0) warn.push(`${path(p.url)} has no <h1>`);
    if (p.h1s.length > 1) fail.push(`${path(p.url)} has ${p.h1s.length} <h1> tags`);
    if (p.words < MIN_WORDS) warn.push(`${path(p.url)} is thin — ${p.words} words`);
    if (p.imagesMissingAlt) warn.push(`${path(p.url)} has ${p.imagesMissingAlt} image(s) without alt`);
    if (p.title) byTitle.set(p.title, [...(byTitle.get(p.title) ?? []), path(p.url)]);
  }

  for (const [title, where] of byTitle) {
    if (where.length > 1) fail.push(`duplicate title "${title}" on ${where.join(", ")}`);
  }

  // Orphans: in the sitemap, but nothing links to them.
  const linkedTo = new Set(pages.flatMap((p) => p.internalLinks));
  for (const p of pages) {
    const rel = path(p.url);
    if (rel !== "/" && !linkedTo.has(rel)) warn.push(`${rel} is an orphan — no internal links point to it`);
  }

  // --- near-duplicate content --------------------------------------------
  const shingled = pages.filter((p) => p.words >= 200).map((p) => ({ p, s: shingles(p.text) }));
  const pairs: Array<{ a: string; b: string; score: number }> = [];
  for (let i = 0; i < shingled.length; i++) {
    for (let j = i + 1; j < shingled.length; j++) {
      const score = jaccard(shingled[i].s, shingled[j].s);
      if (score >= SIMILARITY_LIMIT * 0.7) {
        pairs.push({ a: path(shingled[i].p.url), b: path(shingled[j].p.url), score });
      }
    }
  }
  pairs.sort((x, y) => y.score - x.score);
  for (const pr of pairs) {
    const line = `${(pr.score * 100).toFixed(0)}% similar — ${pr.a}  vs  ${pr.b}`;
    if (pr.score >= SIMILARITY_LIMIT) fail.push(line);
    else warn.push(line);
  }

  // --- report -------------------------------------------------------------
  const worst = pairs[0];
  console.log(`pages ................ ${pages.length}`);
  console.log(`median words ......... ${pages.map((p) => p.words).sort((a, b) => a - b)[Math.floor(pages.length / 2)]}`);
  console.log(`highest similarity ... ${worst ? `${(worst.score * 100).toFixed(0)}% (${worst.a} vs ${worst.b})` : "below reporting threshold"}`);
  console.log(`schema coverage ...... ${pages.filter((p) => p.schemaTypes.length).length}/${pages.length}\n`);

  if (warn.length) {
    console.log(`WARNINGS (${warn.length})`);
    warn.forEach((w) => console.log(`  · ${w}`));
    console.log();
  }
  if (fail.length) {
    console.log(`FAILURES (${fail.length})`);
    fail.forEach((f) => console.log(`  ✗ ${f}`));
    process.exitCode = 1;
  } else {
    console.log("No failures.");
  }
}

main();
