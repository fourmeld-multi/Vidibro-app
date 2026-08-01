import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Sparkles, Scale, Languages as LangIcon } from "lucide-react";
import { ENTRIES, hrefFor } from "@/lib/directory/entries";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import { formatPeakHours } from "@/lib/liveCount";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Chat Directory — Every Country, City and Language",
  description:
    "Browse Vidibro by country, city or language. See who is online where, what they speak and when each market is busiest, then start a free video, voice or text chat.",
  slug: "/directory",
  keywords: ["chat directory", "random video chat by country", "video chat by city", "video chat by language"],
});

/**
 * Countries are the organising unit — their cities appear *on the country card*
 * rather than in a separate wall of links.
 *
 * Two reasons that matters. A flat list of eighty cities is a link dump that
 * tells Google nothing about how Kolkata relates to India, and it dilutes the
 * page's authority evenly across every link. Grouping under the country builds a
 * topical cluster and concentrates signal on the country page, which is the
 * higher-volume term.
 *
 * Languages deliberately do NOT nest. Bengali belongs to India *and* Bangladesh;
 * Tamil to India, Sri Lanka, Singapore and Malaysia. Filing them under one
 * country would be factually wrong and would leave the other country unable to
 * link to them, so they get their own compact strip.
 */
const REGIONS: Record<string, string> = {
  "video-chat-india": "Asia",
  "video-chat-bangladesh": "Asia",
  "video-chat-pakistan": "Asia",
  "video-chat-philippines": "Asia",
};
const REGION_ORDER = ["Asia", "Middle East & Africa", "Europe", "Americas", "Oceania"];

/** Routes that exist outside the directory. */
const FEATURES = [
  { href: "/video-chat", label: "Random video chat" },
  { href: "/audio-chat", label: "Voice chat, camera off" },
  { href: "/text-chat", label: "Text chat with strangers" },
];

const COMPARE = [
  { href: "/omegle-alternative", label: "Omegle alternative" },
  { href: "/chatroulette-alternative", label: "Chatroulette alternative" },
  { href: "/ometv-alternative", label: "OmeTV alternative" },
  { href: "/emerald-chat-alternative", label: "Emerald Chat alternative" },
  { href: "/airtalk-alternative", label: "AirTalk alternative" },
];

export default function DirectoryPage() {
  const countries = ENTRIES.filter((e) => e.kind === "country");
  const cities = ENTRIES.filter((e) => e.kind === "city");
  const languages = ENTRIES.filter((e) => e.kind === "language");

  const byRegion = REGION_ORDER.map((region) => ({
    region,
    items: countries.filter((c) => (REGIONS[c.slug] ?? "Asia") === region),
  })).filter((g) => g.items.length > 0);

  const citiesOf = (countryName: string) => cities.filter((c) => c.parent === countryName);
  const citiesAZ = [...cities].sort((a, b) => a.name.localeCompare(b.name));

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

      <div className="mx-auto max-w-4xl px-5 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-purple-300/70">
          <Link href="/" className="hover:text-purple-200">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-purple-200">Directory</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Chat <span className="gradient-text">Directory</span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-3.5 text-sm sm:text-base leading-relaxed text-purple-100/85">
          <p>
            Vidibro does not let you filter who you match with — the queue is one shared pool, and
            that is deliberate. What these pages do instead is tell you what to expect: which
            languages you are likely to hear in a given market, the hours when its queue is actually
            full, and what people there tend to talk about.
          </p>
          <p>
            Useful if you are wondering why matching feels slow at three in the afternoon, or what
            to open with when you land on someone from a place you have never been.
          </p>
        </div>

        {/* 1 · BY COUNTRY — the organising unit, cities inline */}
        <section className="mt-14">
          <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white tracking-tight">
            <Globe size={18} className="text-purple-300" />
            By country
            <span className="text-sm font-bold text-purple-300/60">({countries.length})</span>
          </h2>
          <p className="mt-2 mb-6 text-sm sm:text-base text-purple-200/65">
            Who is online, when they are online, and what they speak.
          </p>

          {byRegion.map((group) => (
            <div key={group.region} className="mb-8">
              <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-purple-300/50">
                {group.region}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((c) => {
                  const kids = citiesOf(c.name);
                  return (
                    <div
                      key={c.slug}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-purple-400/25"
                    >
                      <Link href={hrefFor(c.slug)} className="text-lg font-bold text-white hover:text-purple-200 transition">
                        {c.name}
                      </Link>
                      <div className="mt-2 text-sm leading-relaxed text-purple-200/65">
                        {c.languages.slice(0, 3).join(" · ")}
                      </div>
                      <div className="mt-1.5 text-sm text-purple-300/55">Busiest {formatPeakHours(c.peakHours)}</div>

                      {/* Cities live here, on their country — not in a separate
                          80-link wall with no relationship to anything. */}
                      {kids.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 border-t border-white/[0.07] pt-3 text-sm">
                          {kids.map((k) => (
                            <Link
                              key={k.slug}
                              href={hrefFor(k.slug)}
                              className="text-purple-300/85 hover:text-purple-200 hover:underline underline-offset-2"
                            >
                              {k.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* 2 · POPULAR FEATURES */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white tracking-tight">
            <Sparkles size={18} className="text-purple-300" />
            Popular features
          </h2>
          <p className="mt-2 mb-4 text-sm sm:text-base text-purple-200/65">
            Ways of using Vidibro, rather than places.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {FEATURES.map((f) => (
              <Chip key={f.href} {...f} />
            ))}
          </div>
        </section>

        {/* 3 · COMPARE — commercial intent, kept apart from browsing */}
        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white tracking-tight">
            <Scale size={18} className="text-purple-300" />
            Compare
          </h2>
          <p className="mt-2 mb-4 text-sm sm:text-base text-purple-200/65">
            How Vidibro differs from the platforms people usually arrive from.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {COMPARE.map((c) => (
              <Chip key={c.href} {...c} />
            ))}
          </div>
        </section>

        {/* Language strip — separate because these cross borders */}
        {languages.length > 0 && (
          <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-purple-200">
              <LangIcon size={15} className="text-purple-300" />
              By language
            </h2>
            <p className="mt-2 mb-4 text-sm text-purple-200/65">
              These get their own pages because they cross borders — Bengali spans India and
              Bangladesh, Tamil spans four countries. A language spoken in only one country lives on
              that country&apos;s page instead.
            </p>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <Chip key={l.slug} href={hrefFor(l.slug)} label={l.name} />
              ))}
            </div>
          </section>
        )}

        {/* All cities A–Z — direct access without an 80-link wall up top */}
        {citiesAZ.length > 0 && (
          <section className="mt-10 border-t border-white/[0.07] pt-8">
            <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-purple-300/50">
              All cities A–Z
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              {citiesAZ.map((c) => (
                <Link
                  key={c.slug}
                  href={hrefFor(c.slug)}
                  className="text-purple-300/75 hover:text-purple-200 hover:underline underline-offset-2"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-black text-white mb-2">
            Do not see the place you are looking for?
          </h2>
          <p className="text-sm text-purple-200/75 leading-relaxed">
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

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm sm:text-base font-medium text-purple-100/85 transition hover:border-purple-400/30 hover:bg-white/[0.08] hover:text-white"
    >
      {label}
    </Link>
  );
}
