import type { Metadata } from "next";
import Link from "next/link";
import { Globe, Building2, Languages, Sparkles } from "lucide-react";
import { ENTRIES, hrefFor } from "@/lib/directory/entries";
import type { DirectoryKind } from "@/lib/directory/types";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Chat Directory — Every Country, City and Language",
  description:
    "Browse Vidibro by country, city, language or chat type. Find where people are online right now and what they speak, then start a free video, voice or text chat.",
  slug: "/directory",
  keywords: ["chat directory", "random video chat by country", "video chat by city", "video chat by language"],
});

const GROUPS: Array<{ kind: DirectoryKind; heading: string; blurb: string; icon: React.ReactNode }> = [
  {
    kind: "country",
    heading: "By country",
    blurb: "Who is online, when they are online, and what they speak.",
    icon: <Globe size={16} />,
  },
  {
    kind: "city",
    heading: "By city",
    blurb: "Narrower than a country — local hours, local conversation.",
    icon: <Building2 size={16} />,
  },
  {
    kind: "language",
    heading: "By language",
    blurb: "What to expect if you want to talk in a particular language.",
    icon: <Languages size={16} />,
  },
  {
    kind: "topic",
    heading: "By chat type",
    blurb: "Ways of using Vidibro, rather than places.",
    icon: <Sparkles size={16} />,
  },
];

export default function DirectoryPage() {
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
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-purple-300/70">
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

        {GROUPS.map((group) => {
          const items = ENTRIES.filter((e) => e.kind === group.kind);
          if (items.length === 0) return null;
          return (
            <section key={group.kind} className="mt-12">
              <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-white tracking-tight">
                <span className="text-purple-300">{group.icon}</span>
                {group.heading}
                <span className="text-sm font-bold text-purple-300/60">({items.length})</span>
              </h2>
              <p className="mt-1.5 mb-5 text-xs sm:text-sm text-purple-200/65">{group.blurb}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((e) => (
                  <Link
                    key={e.slug}
                    href={hrefFor(e.slug)}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-purple-400/30 hover:bg-white/[0.06]"
                  >
                    <div className="font-bold text-white group-hover:text-purple-200 transition">
                      {e.name}
                    </div>
                    {/* Each row carries its own data rather than being a bare link,
                        so the hub is a page worth reading, not a sitemap in disguise. */}
                    <div className="mt-1.5 text-xs text-purple-200/65 leading-relaxed">
                      {e.languages.slice(0, 3).join(" · ")}
                    </div>
                    <div className="mt-1 text-xs text-purple-300/55">
                      Busiest {e.peakHours}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-14 rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-black text-white mb-2">
            Do not see the place you are looking for?
          </h2>
          <p className="text-sm text-purple-200/75 leading-relaxed">
            This directory is being written one market at a time, and a page only goes up when
            there is something genuinely true to say about that market. Matching itself is global
            regardless — you can{" "}
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
