import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Sparkles, Scale, Building2, Languages as LangIcon } from "lucide-react";
import { ENTRIES, hrefFor } from "@/lib/directory/entries";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import LinkAccordion, { PillLink } from "@/components/directory/LinkAccordion";

export const metadata: Metadata = generatePageSEO({
  title: "Chat Directory — Country, City and Language",
  description:
    "Browse Vidibro by country, city or language — who is online, what they speak, and when each market is busiest. Free video, voice or text chat.",
  slug: "/directory",
  keywords: ["chat directory", "random video chat by country", "video chat by city", "video chat by language"],
});

/**
 * Countries and Popular Features sit open as two columns; cities and languages
 * are +/- accordions.
 *
 * The reason for the split is length. Sixty countries is a page; three hundred
 * cities is a wall, and a wall of links is both unreadable and a weak signal —
 * it spreads the page's authority evenly across every link and says nothing
 * about how they relate. Collapsing them keeps the page scannable while leaving
 * every link in the HTML for a crawler to follow.
 */
/** Content pages, not the app screens — the app routes are noindex. */
const FEATURES = [
  { href: "/directory/random-video-chat", label: "random video chat" },
  { href: "/directory/random-voice-chat", label: "random voice chat" },
  { href: "/directory/anonymous-text-chat", label: "anonymous text chat" },
];

const COMPARE = [
  { href: "/omegle-alternative", label: "omegle alternative" },
  { href: "/chatroulette-alternative", label: "chatroulette alternative" },
  { href: "/ometv-alternative", label: "ometv alternative" },
  { href: "/emerald-chat-alternative", label: "emerald chat alternative" },
  { href: "/airtalk-alternative", label: "airtalk alternative" },
];

export default function DirectoryPage() {
  const countries = ENTRIES.filter((e) => e.kind === "country");
  const cities = ENTRIES.filter((e) => e.kind === "city");
  const languages = ENTRIES.filter((e) => e.kind === "language");

  // Cities are grouped under their country so the list reads as structure
  // rather than as three hundred unrelated links.
  const cityItems = countries.flatMap((c) =>
    cities
      .filter((city) => city.parent === c.name)
      .map((city) => ({ href: hrefFor(city.slug), label: `${city.name.toLowerCase()} video chat` }))
  );
  const orphanCities = cities
    .filter((city) => !countries.some((c) => c.name === city.parent))
    .map((city) => ({ href: hrefFor(city.slug), label: `${city.name.toLowerCase()} video chat` }));

  const languageItems = languages.map((l) => ({
    href: hrefFor(l.slug),
    label: `${l.name.toLowerCase()} video chat`,
  }));

  return (
    <main className="w-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Directory", item: `${BASE_URL}/directory` },
          ],
        }}
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-purple-300/70">
          <Link href="/" className="hover:text-purple-200">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-purple-200">Directory</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Chat <span className="gradient-text">Directory</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-purple-100/80">
          Vidibro does not let you filter who you match with — the queue is one shared pool, and
          that is deliberate. These pages tell you what to expect instead: which languages you are
          likely to hear in a market, the hours its queue is actually full, and what people there
          tend to talk about.
        </p>

        {/* Two columns: countries and features, both open by default. */}
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <section>
            <h2 className="flex items-center gap-3 border-b border-white/[0.08] pb-4 text-2xl font-black tracking-tight text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                <Globe size={18} />
              </span>
              By Country
            </h2>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {countries.map((c) => (
                <PillLink
                  key={c.slug}
                  href={hrefFor(c.slug)}
                  label={`random video chat ${c.name.replace(/^the /, "").toLowerCase()}`}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-3 border-b border-white/[0.08] pb-4 text-2xl font-black tracking-tight text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
                <Sparkles size={18} />
              </span>
              Popular Features
            </h2>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <PillLink key={`${f.href}-${i}`} {...f} />
              ))}
            </div>

            <h2 className="mt-10 flex items-center gap-3 border-b border-white/[0.08] pb-4 text-2xl font-black tracking-tight text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                <Scale size={18} />
              </span>
              Compare
            </h2>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {COMPARE.map((c) => (
                <PillLink key={c.href} {...c} />
              ))}
            </div>
          </section>
        </div>

        {/* Cities and languages collapse, because they are the long lists. */}
        <div className="mt-12 space-y-3">
          <LinkAccordion
            title="By City"
            subtitle="Local hours, local conversation — narrower than a country."
            items={[...cityItems, ...orphanCities]}
            previewCount={8}
          />
          <LinkAccordion
            title="By Language"
            subtitle="Languages that cross borders and so get their own page — Bengali spans India and Bangladesh, Tamil spans four countries."
            items={languageItems}
            previewCount={8}
          />
        </div>

        <section className="mt-12 rounded-3xl border border-purple-500/20 bg-purple-500/[0.06] p-6 sm:p-8">
          <h2 className="mb-2 text-lg sm:text-xl font-black text-white">
            Do not see the place you are looking for?
          </h2>
          <p className="text-base leading-relaxed text-purple-200/75">
            This directory is written one market at a time, and a page only goes up when there is
            something genuinely true to say about that market. Matching itself is global regardless —
            you can{" "}
            <Link href="/video-chat" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
              start a video chat
            </Link>{" "}
            and reach anyone online right now, listed here or not.
          </p>
        </section>
      </div>
    </main>
  );
}
