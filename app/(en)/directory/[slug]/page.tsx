import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Video, Mic, MessageSquare, Clock, Languages, Signal, ShieldCheck, Zap,
  Lock, Smartphone, MousePointerClick, Camera, Users, Compass, Scale, HelpCircle, Sunrise, Handshake, ArrowLeft,
  Plane, Snowflake, Gavel, Wallet, Sparkles, Wifi, Clock3,
  Sticker, CheckCheck, Globe2, Activity, Star,
} from "lucide-react";
import { ENTRIES, getEntry, resolvableRelated, hrefFor } from "@/lib/directory/entries";
import { assertEntryIsPublishable } from "@/lib/directory/types";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import { NATIVE_LINKS } from "@/lib/native-pages/directory-links";
import { formatPeakHours } from "@/lib/liveCount";
import JsonLd from "@/components/JsonLd";
import PeakHoursBar from "@/components/PeakHoursBar";
import LiveMarketStatus from "@/components/LiveMarketStatus";
import MatchingDiagram from "@/components/MatchingDiagram";
import { SpeakLocal, ConversationStarters } from "@/components/directory/LocalKnowledge";
import FaqAccordion from "@/components/directory/FaqAccordion";
import { SectionHead, StatTile, IconCard, StepCard, CompareTable, RelatedGroup } from "@/components/directory/Cards";

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  return generatePageSEO({
    title: entry.title,
    description: entry.description,
    slug: `/directory/${entry.slug}`,
    keywords: [entry.primaryKeyword, `${entry.name} video chat`, `talk to strangers ${entry.name}`],
    image: `${BASE_URL}/og-default.png`,
  });
}

/** Icon, colour and bg class per spotlight kind — used in the large SillyChat-style card grid. */
const SPOTLIGHT_STYLE = {
  diaspora: { icon: <Plane size={24} />, tone: "cyan" as const, bg: "bg-cyan-500/20 text-cyan-300" },
  seasonal: { icon: <Snowflake size={24} />, tone: "cyan" as const, bg: "bg-cyan-500/20 text-cyan-300" },
  legal: { icon: <Gavel size={24} />, tone: "amber" as const, bg: "bg-amber-500/20 text-amber-300" },
  cost: { icon: <Wallet size={24} />, tone: "emerald" as const, bg: "bg-emerald-500/20 text-emerald-300" },
  culture: { icon: <Sparkles size={24} />, tone: "pink" as const, bg: "bg-pink-500/20 text-pink-300" },
  infra: { icon: <Wifi size={24} />, tone: "purple" as const, bg: "bg-purple-500/20 text-purple-300" },
  time: { icon: <Clock3 size={24} />, tone: "amber" as const, bg: "bg-amber-500/20 text-amber-300" },
};

function whatIsHeading(kind: string, name: string) {
  if (kind === "language") return `What is ${name} video chat?`;
  return `What is random video chat in ${name}?`;
}

export default async function DirectoryEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();
  assertEntryIsPublishable(entry);

  const related = resolvableRelated(entry);
  const group = (rel: string) =>
    related.filter((r) => r.relation === rel).map((r) => ({ href: hrefFor(r.slug), label: r.label }));
  const nativeLinks = NATIVE_LINKS[slug] ?? [];

  const url = `${BASE_URL}/directory/${entry.slug}`;
  const heading = entry.title.split("—")[0].trim();
  const newDesign = entry.slug === "video-chat-nepal" || entry.slug === "video-chat-south-korea" || entry.slug === "video-chat-bangladesh" || entry.slug === "video-chat-turkey" || entry.slug === "video-chat-brazil" || entry.slug === "video-chat-tokyo";

  return (
    <main className="w-full">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Directory", item: `${BASE_URL}/directory` },
              { "@type": "ListItem", position: 3, name: entry.name, item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: entry.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]}
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-6 py-10 sm:py-14">
        {/* Up-navigation rather than "back". Most readers arrive here from
            search, where there is no history to go back to, but the parent is
            still the right place to send them. Both links stay so the
            BreadcrumbList schema above matches something visible. */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-4 text-sm">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 font-semibold text-purple-300 transition hover:text-purple-200"
          >
            <ArrowLeft size={15} /> Directory
          </Link>
          <span className="text-purple-300/25">|</span>
          <Link href="/" className="text-purple-300/70 transition hover:text-purple-200">
            Home
          </Link>
        </nav>

        {/* ---------- HERO ---------- */}
        <h1 className="max-w-4xl text-[2rem] leading-[1.1] sm:text-5xl sm:leading-[1.08] font-black tracking-tight text-white">
          {entry.title.replace(/\s*\|\s*Vidibro$/, "")}
        </h1>

        {/* Bold lead line. Deliberately a <p>: the competitor repeats its H1 as
            an H2 here, which spends a heading on a duplicate string. */}
        {entry.tagline && (
          <p className="mt-5 max-w-3xl text-lg sm:text-xl font-bold leading-snug text-purple-100">
            {entry.tagline}
          </p>
        )}

        {/* Full width and stacked on mobile — three pills wrapping onto ragged
            lines reads as an accident. Each mode gets its own gradient so none
            of them looks like the secondary option. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/video-chat"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110 sm:w-auto"
          >
            <Video size={19} /> Video chat
          </Link>
          <Link
            href="/audio-chat"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 sm:w-auto"
          >
            <Mic size={19} /> Voice chat
          </Link>
          <Link
            href="/text-chat"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-pink-500/25 transition hover:brightness-110 sm:w-auto"
          >
            <MessageSquare size={19} /> Text chat
          </Link>
        </div>

        {/* Native language cross-links */}
        {nativeLinks.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/[0.06] px-4 py-3 text-sm">
            <span className="text-purple-300/70 shrink-0">Also available in →</span>
            {nativeLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 font-semibold text-purple-200 transition hover:border-purple-400/60 hover:text-white"
              >
                <span lang={l.href.replace("/", "")}>{l.label}</span>
                <span className="ml-1 text-purple-300/60">({l.lang})</span>
              </Link>
            ))}
          </div>
        )}

        {entry.timezone && entry.peakHours && (
          <LiveMarketStatus
            slug={entry.slug} name={entry.name} timezone={entry.timezone}
            peakHours={entry.peakHours} weight={entry.weight}
          />
        )}

        {/* Checkable facts only. Nothing here should be unverifiable. */}
        {/* Below the buttons on purpose. This paragraph is ~250px on a phone,
            and above the CTAs it pushed all three toward the fold. Source order
            relative to the H1 is unchanged, so a crawler reads it exactly where
            it did before — only the visual order moved. */}
        <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-purple-100/80">
          {entry.intro[0]}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "1M+",   label: "Active Users",  tone: "purple"  as const, icon: <Users size={24} /> },
            { value: "180+",  label: "Countries",     tone: "cyan"    as const, icon: <Globe2 size={24} /> },
            { value: "300k+", label: "Daily Matches", tone: "pink"    as const, icon: <Activity size={24} /> },
            { value: "99.9%", label: "Uptime",        tone: "emerald" as const, icon: <Zap size={24} /> },
          ].map((s) => (
            <StatTile key={s.label} tone={s.tone} value={s.value} label={s.label} icon={s.icon} />
          ))}
        </div>

        <section className="mt-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why us</p>
          <h2 className="mb-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Why Choose <span className="text-pink-400">Vidibro</span>?
          </h2>
          {entry.intro[1] && <p className="mb-8 text-base text-purple-200/70 max-w-xl mx-auto">{entry.intro[1]}</p>}
          {entry.slug === "anonymous-text-chat" ? (
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {[
                {
                  icon: <MessageSquare size={24} />,
                  bg: "bg-cyan-500/20 text-cyan-300",
                  title: "No Camera, No Pressure",
                  body: "No permission prompts. No video, no mic. Just open the page and type — works anywhere, any device.",
                },
                {
                  icon: <CheckCheck size={24} />,
                  bg: "bg-emerald-500/20 text-emerald-300",
                  title: "Double-Tick Read Receipts",
                  body: "Know the moment your message is read, not just sent. No more wondering if they saw it.",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  bg: "bg-purple-500/20 text-purple-300",
                  title: "Gone When You Close",
                  body: "No history, no account, no trace. The conversation ends when the tab does.",
                },
              ].map((card) => (
                <div key={card.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/75">{card.body}</p>
                </div>
              ))}
            </div>
          ) : entry.slug === "video-chat-brazil" ? (
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {[
                {
                  icon: <Globe2 size={24} />,
                  bg: "bg-amber-500/20 text-amber-300",
                  title: "Futebol, Carnival & More",
                  body: "Brazil is the most socially online country in South America. Club rivalries, Carnival culture, regional pride — every conversation goes somewhere unexpected.",
                },
                {
                  icon: <MessageSquare size={24} />,
                  bg: "bg-cyan-500/20 text-cyan-300",
                  title: "Say 'Oi' Not 'Hola'",
                  body: "Brazil speaks Portuguese — even a few words changes the temperature of the conversation completely. 'Oi, tudo bem?' takes ten seconds and opens everything.",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  bg: "bg-emerald-500/20 text-emerald-300",
                  title: "No Account, No Trace",
                  body: "Calls run peer-to-peer on Vivo, Claro or TIM. Nothing is recorded or stored. Leave any time — no history, no account, nothing left behind.",
                },
              ].map((card) => (
                <div key={card.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/75">{card.body}</p>
                </div>
              ))}
            </div>
          ) : entry.slug === "video-chat-tokyo" ? (
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {[
                {
                  icon: <Zap size={24} />,
                  bg: "bg-cyan-500/20 text-cyan-300",
                  title: "World's Fastest Networks",
                  body: "NTT Docomo, SoftBank and au give Tokyo some of the best mobile coverage on Earth. Video calls here hold full quality — no drops, no softening.",
                },
                {
                  icon: <Globe2 size={24} />,
                  bg: "bg-amber-500/20 text-amber-300",
                  title: "Night Owl City",
                  body: "Tokyo's queue runs well past midnight. Last trains stop at midnight — so conversations start late and run long. Best hours: 22:30 to 02:30 JST.",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  bg: "bg-emerald-500/20 text-emerald-300",
                  title: "No Account, No Trace",
                  body: "Calls run browser-to-browser. Nothing is recorded or stored on our side. Leave any time — no history, no account, nothing left behind.",
                },
              ].map((card) => (
                <div key={card.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/75">{card.body}</p>
                </div>
              ))}
            </div>
          ) : entry.slug === "video-chat-turkey" ? (
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {[
                {
                  icon: <Globe2 size={24} />,
                  bg: "bg-amber-500/20 text-amber-300",
                  title: "Istanbul Never Sleeps",
                  body: "Turkey's queue runs from 21:00 well past midnight. Late-night çay hours are the best time — and the most interesting conversations.",
                },
                {
                  icon: <Zap size={24} />,
                  bg: "bg-cyan-500/20 text-cyan-300",
                  title: "Europe Meets Asia",
                  body: "Turkish conversations cross two continents worth of culture — ask about football, dizi, or food and get an answer unlike any other market.",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  bg: "bg-emerald-500/20 text-emerald-300",
                  title: "No Account, No Trace",
                  body: "Talk freely. Calls run browser-to-browser — nothing is recorded or stored on our side. Leave any time, no history left behind.",
                },
              ].map((card) => (
                <div key={card.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/75">{card.body}</p>
                </div>
              ))}
            </div>
          ) : newDesign ? (
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {[
                {
                  icon: <Zap size={24} />,
                  bg: "bg-amber-500/20 text-amber-300",
                  title: "Instant Connections",
                  body: "No waiting rooms. Our algorithm matches you in seconds — at peak hours it's near-instant.",
                },
                {
                  icon: <Globe2 size={24} />,
                  bg: "bg-cyan-500/20 text-cyan-300",
                  title: "Global Community",
                  body: `Meet people from 180+ countries. No language filter — whoever is online is who you get.`,
                },
                {
                  icon: <ShieldCheck size={24} />,
                  bg: "bg-emerald-500/20 text-emerald-300",
                  title: "Privacy First",
                  body: "No account, no stored video. Calls run browser-to-browser. Leave any time with one tap.",
                },
              ].map((card) => (
                <div key={card.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/75">{card.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-left">
              <IconCard icon={<Lock size={16} />} title="Nothing is stored" tone="emerald">
                Calls run browser to browser. There is no account, so there is no profile for a
                conversation to attach to and nothing for us to keep.
              </IconCard>
              <IconCard icon={<Smartphone size={16} />} title="Built for mobile data" tone="cyan">
                {entry.connectivityNote
                  ? entry.connectivityNote.split(".").slice(0, 2).join(".") + "."
                  : "Video is capped near 600 kbps and adapts downward, so a call softens on a weak signal instead of freezing or dropping."}
              </IconCard>
              <IconCard icon={<Sticker size={16} />} title="Stickers and reactions" tone="pink">
                Send emoji stickers and full-screen reactions mid-call — the fastest way to say
                something when you do not share a language.
              </IconCard>
              <IconCard icon={<CheckCheck size={16} />} title="Double-tick receipts" tone="purple">
                Text chat shows when your message has actually been read, so you are never guessing
                whether the other person saw it.
              </IconCard>
              <IconCard icon={<Globe2 size={16} />} title={`Languages in ${entry.name}`} tone="amber">
                {entry.languages.join(" · ")} — and no language filter, so which one you get is
                genuinely down to who is online.
              </IconCard>
              <IconCard icon={<MousePointerClick size={16} />} title="One tap to leave" tone="emerald">
                Next moves you on instantly, and the report button ends a conversation the moment you
                want out of it.
              </IconCard>
            </div>
          )}
        </section>

        {/* The per-market payload — the part that is only true here. Topic
            pages have no market, so the whole section is skipped rather than
            filled with invented values. */}
        {entry.kind !== "topic" && (
        <section className="mt-14">
          <SectionHead
            tone="pink"
            icon={<Compass size={18} />}
            title={`Local knowledge for ${entry.name}`}
            blurb="The part of this page that is only true here."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Best Time to Chat */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Clock size={18} />
                </span>
                <h3 className="text-base font-black text-white">Best Time to Chat</h3>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300">{formatPeakHours(entry.peakHours!)}</div>
              <p className="mt-2 text-sm leading-relaxed text-purple-100/75">{entry.localNote}</p>
              <PeakHoursBar peakHours={entry.peakHours!} />
            </div>

            {/* Works on Your Network */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Signal size={18} />
                </span>
                <h3 className="text-base font-black text-white">Works on Your Network</h3>
              </div>
              {entry.providers && entry.providers.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {entry.providers.map((p) => (
                    <span key={p} className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-xs font-semibold text-white/80">
                      {p}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed text-purple-100/75">{entry.connectivityNote}</p>
            </div>

            {entry.localPhrases?.length ? (
              <SpeakLocal name={entry.name} phrases={entry.localPhrases} />
            ) : (
              <IconCard icon={<Languages size={15} />} title="Languages you'll hear" tone="amber">
                {entry.languages.join(" · ")}
              </IconCard>
            )}

            {entry.starters?.length ? <ConversationStarters name={entry.name} starters={entry.starters} /> : null}

            {entry.places && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
                    <Users size={18} />
                  </span>
                  <h3 className="text-base font-black text-white">Where people are</h3>
                </div>
                <p className="text-sm leading-relaxed text-purple-100/75">{entry.places.join(" · ")}</p>
              </div>
            )}
          </div>
        </section>
        )}

        {entry.spotlights && entry.spotlights.length > 0 && (
          <section className="mt-14">
            {newDesign ? (
              <SectionHead
                tone="amber"
                icon={<Sparkles size={18} />}
                title={`What makes ${entry.name} unique`}
                blurb={`Specific things that shape every conversation with someone from ${entry.name} — context most visitors don't know.`}
              />
            ) : (
              <SectionHead
                tone="amber"
                icon={<Sparkles size={18} />}
                title={`What is different about ${entry.name}`}
                blurb="Things that are true here and not in most other markets."
              />
            )}
            {newDesign ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {entry.spotlights.map((sp) => {
                  const style = SPOTLIGHT_STYLE[sp.kind];
                  return (
                    <div key={sp.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/20">
                      <div className="mb-4 flex items-center gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.bg}`}>
                          {style.icon}
                        </div>
                        <h3 className="text-base font-black text-white">{sp.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-purple-100/70">{sp.body}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {entry.spotlights.map((sp) => {
                  const style = SPOTLIGHT_STYLE[sp.kind];
                  return (
                    <IconCard key={sp.title} icon={style.icon} title={sp.title} tone={style.tone}>
                      {sp.body}
                    </IconCard>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {entry.quickFacts && entry.quickFacts.length > 0 && (
          <section className="mt-14">
            <SectionHead
              tone="purple"
              icon={<Globe2 size={18} />}
              title={`${entry.name} — quick facts`}
              blurb="Things that are genuinely true here and worth knowing before you connect."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entry.quickFacts.map((fact) => (
                <div
                  key={fact.title}
                  className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/30 flex flex-col gap-3"
                >
                  <span className="text-4xl leading-none">{fact.emoji}</span>
                  <p className="text-base font-black text-white">{fact.title}</p>
                  <p className="text-sm text-purple-100/75 leading-relaxed">{fact.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FEATURES OF VIDIBRO ── */}
        {(entry.slug === "video-chat-nepal" || entry.slug === "video-chat-bangladesh" || entry.slug === "video-chat-brazil") && <section className="mt-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Features</p>
          <h2 className="mb-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Features of <span className="text-pink-400">Vidibro</span>
          </h2>
          <p className="mb-6 text-base text-purple-200/70 max-w-2xl">
            Our core mission is providing the ultimate{" "}
            <strong className="text-white">Random Video Chat {entry.name}</strong> experience.
            Here is what makes our community great:
          </p>
          <div className="flex flex-col gap-3">
            {[
              { title: "Instant Video Chat", body: "Global pairing in seconds — no waiting rooms, no queues." },
              { title: "No Signup Required", body: "Zero personal information needed. Open the site and start immediately." },
              { title: "Mobile Friendly", body: "Responsive across all iPhones, Android devices and desktops — no app install required." },
              { title: "Global Connections", body: "Meet people from 180+ countries at any time of day." },
              { title: "Fast Matching", body: "WebRTC peer-to-peer architecture — no server relay, lowest possible lag." },
              { title: "Private by Default", body: "No conversation history kept. No video or audio ever passes through our servers." },
            ].map((f) => (
              <div
                key={f.title}
                className="dir-card flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-lg shadow-black/25"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCheck size={15} />
                </span>
                <div>
                  <p className="font-black text-white">{f.title}</p>
                  <p className="mt-0.5 text-sm text-purple-100/70">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>}

        {/* ── FEATURES OF VIDIBRO (TEXT CHAT) ── */}
        {entry.slug === "anonymous-text-chat" && <section className="mt-14">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Features</p>
          <h2 className="mb-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Features of <span className="text-pink-400">Vidibro</span> Text Chat
          </h2>
          <p className="mb-6 text-base text-purple-200/70 max-w-2xl">
            Anonymous text chat built for real conversations — no camera, no account, nothing stored.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { title: "Zero Camera Setup", body: "No permission prompts, no video, no mic. Open the page and start typing — works on any device, any browser." },
              { title: "Double-Tick Read Receipts", body: "Know exactly when your message is read, not just sent. One tick = delivered. Two ticks = read." },
              { title: "Emoji Stickers & Full-Screen Reactions", body: "Send emoji stickers and full-screen reactions during chat — the fastest way to communicate without a shared language." },
              { title: "Private by Default", body: "No account, no history, no stored messages. Close the tab and the conversation is gone — for both of you." },
            ].map((f) => (
              <div
                key={f.title}
                className="dir-card flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-lg shadow-black/25"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <CheckCheck size={15} />
                </span>
                <div>
                  <p className="font-black text-white">{f.title}</p>
                  <p className="mt-0.5 text-sm text-purple-100/70">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>}

        <section className="mt-14">
          <SectionHead tone="cyan" icon={<Zap size={18} />} title="How it works" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard step={1} icon={<MousePointerClick size={15} />} title="Pick a mode">
              Video, voice with the camera off, or text only.
            </StepCard>
            <StepCard step={2} icon={<Camera size={15} />} title="Allow access">
              Only for video and voice. Text chat needs neither camera nor microphone.
            </StepCard>
            <StepCard step={3} icon={<Users size={15} />} title="Get matched">
              A short countdown, then someone new. At peak it is a few seconds.
            </StepCard>
            <StepCard step={4} icon={<Zap size={15} />} title="Next, any time">
              One tap moves you to a different conversation. No explanation needed.
            </StepCard>
          </div>
        </section>

        {entry.slug === "video-chat-brazil" && (
          <>
            {/* ── BRAZIL: 4-card differentiator grid ── */}
            <section className="mt-14">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why Brazil</p>
              <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
                Brazilian Video Chat — <span className="text-pink-400">What Makes It Different</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { emoji: "🇧🇷", title: "Largest Pool in Latin America", body: "Brazil has more people online at once than any of its neighbours. Matches arrive fast even outside peak hours — rarely more than a few seconds." },
                  { emoji: "🗣️", title: "Portuguese, Not Spanish", body: "Brazil is the only Portuguese-speaking country in the region. Say 'oi' and 'tudo bem' — even a rough attempt gets a warm reaction every time." },
                  { emoji: "🎲", title: "One Person at a Time", body: "No search filters, no profile grids. The next Brazil video chat is whoever the queue pairs you with — random by design, which is the whole point." },
                  { emoji: "⚡", title: "Free — No Account Ever", body: "A Brazil video call costs nothing and asks for nothing. No email, no phone number, no app store detour. Open the page and you are already in." },
                ].map((c) => (
                  <div key={c.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center flex flex-col items-center">
                    <div className="mb-4 text-4xl">{c.emoji}</div>
                    <h3 className="mb-2 text-base font-black text-white">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-purple-100/70">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── BRAZIL: SEO prose section ── */}
            <section className="mt-14 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-7 sm:p-8">
              <h2 className="mb-4 text-xl sm:text-2xl font-black tracking-tight text-white">
                Random Video Chat in Brazil — No Waiting, No Account
              </h2>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Brazil is the one country in this region that speaks Portuguese rather than Spanish — and it is by far the largest pool in Latin America, which is why a Brazil video chat rarely keeps you waiting. One person at a time, camera or text, no account required, nothing to install.
              </p>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Searches reach this page under a dozen names — Brazilian video chat, videochat Brazil, chat video Brazil, Brazil random video call — and every one of them lands the same result: a live match in seconds, on any device, over Vivo, Claro or TIM. The pool concentrates in São Paulo, Rio and Belo Horizonte but covers every state.
              </p>
              <p className="text-base leading-relaxed text-purple-100/80">
                If the conversation goes nowhere, one tap moves you on — no awkward goodbye, no limit on how many times you do it. If it does go somewhere, Brazil tends to go long. Brazilians are among the most conversational users on any platform anywhere, and it shows from the first exchange.
              </p>
            </section>
          </>
        )}

        {!entry.hideWhatIs && (
          <section className="mt-14">
            <SectionHead tone="purple" icon={<HelpCircle size={18} />} title={whatIsHeading(entry.kind, entry.name)} />
            {entry.intro[2] && (
              <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-purple-100/80">
                {entry.intro[2]}
              </p>
            )}
            <MatchingDiagram />
          </section>
        )}

        {entry.slug !== "video-chat-turkey" && entry.slug !== "video-chat-brazil" && <section className="mt-14">
          <SectionHead
            tone="amber"
            icon={<Scale size={18} />}
            title="How this differs from the clone sites"
            blurb="Most Omegle replacements monetise attention. These are the differences that matter on a phone."
          />
          <CompareTable
            rows={entry.slug === "anonymous-text-chat" ? [
              { feature: "Account required", us: "No", them: "Often" },
              { feature: "Camera or microphone needed", us: "Never", them: "Sometimes forced" },
              { feature: "Read receipts (double-tick)", us: true, them: false },
              { feature: "Conversation stored", us: "None", them: "Often stored" },
              { feature: "Emoji stickers & reactions", us: true, them: false },
              { feature: "Cost", us: "Free", them: "Free with ads, or paid tiers" },
            ] : newDesign ? [
              { feature: "Account required", us: "No", them: "Often" },
              { feature: "No app install needed", us: true, them: "Usually required" },
              { feature: "Peer-to-peer (no server relay)", us: true, them: false },
              { feature: "Adaptive quality for mobile data", us: true, them: false },
              { feature: "Conversation history stored", us: "Never", them: "Often" },
              { feature: "Cost", us: "Free forever", them: "Free with ads or paid tiers" },
            ] : [
              { feature: "Account required", us: "No", them: "Often" },
              { feature: "Video, voice and text", us: true, them: "Usually video only" },
              { feature: "Peer-to-peer media", us: true, them: false },
              { feature: "Adaptive bitrate for mobile data", us: true, them: false },
              { feature: "Conversation history kept", us: "None", them: "Varies" },
              { feature: "Cost", us: "Free", them: "Free with ads, or paid tiers" },
            ]}
          />
        </section>}

        <section className="mt-14">
          <SectionHead tone="emerald" icon={<ShieldCheck size={18} />} title="Staying safe" />
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] p-5 sm:p-6">
            {entry.safetyNote && (
              <p className="mb-3 text-base font-semibold leading-relaxed text-emerald-100">
                {entry.safetyNote}
              </p>
            )}
            <p className="text-base leading-relaxed text-purple-100/85">
              Peer-to-peer means we never hold your video. That is a privacy property, not a
              guarantee about who you meet. The rules that actually protect you are ordinary ones:
              no full name, no address, no workplace, no financial details, nothing you would not
              want a stranger to keep.
            </p>
            <p className="mt-3 text-base leading-relaxed text-purple-100/85">
              A report button sits in the top bar throughout every call. It ends the conversation
              immediately and moves you on — use it early rather than sitting through something
              uncomfortable.
            </p>
            <Link href="/guidelines" className="mt-4 inline-block text-sm font-bold text-emerald-300 underline underline-offset-2 hover:text-emerald-200">
              Read the community guidelines →
            </Link>
          </div>
        </section>

        <section className="mt-14">
          <SectionHead tone="cyan" icon={<Compass size={18} />} title="Explore related topics" />
          <RelatedGroup label="Cities" items={group("city")} />
          <RelatedGroup label="Languages" items={group("language")} />
          <RelatedGroup label="Other ways to chat" items={group("mode")} />
          <RelatedGroup label="Nearby" items={group("sibling")} />
          <RelatedGroup label="Compare" items={group("competitor")} />
        </section>

        <section className="mt-14">
          <SectionHead tone="amber" icon={<HelpCircle size={18} />} title="Frequently asked questions" />
          <FaqAccordion items={entry.faqs} />
        </section>

      </div>

      {entry.reviews && entry.reviews.length > 0 && (
        <section className="mt-14 w-full bg-white/[0.025] py-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Loved by users</p>
          <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
            What Users <span className="text-pink-400">Say</span>
          </h2>
          <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:px-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {entry.reviews.map((r, i) => {
              const colors = ["bg-pink-500", "bg-cyan-500", "bg-amber-500", "bg-purple-500"];
              return (
                <div key={i} className="dir-card rounded-2xl border border-white/10 bg-white/[0.05] p-5 flex flex-col justify-between aspect-square">
                  <div>
                    <div className="mb-3 flex gap-0.5 text-amber-400 text-sm">{"★★★★★"}</div>
                    <p className="text-sm leading-relaxed text-purple-100/85 italic">&ldquo;{r.text}&rdquo;</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${colors[i % colors.length]}`}>
                      {r.flag}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{r.name}</p>
                      <p className="text-xs text-purple-300/70">{r.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-4xl px-5 sm:px-6 pb-14">
        <section className="mt-14 rounded-3xl border border-purple-500/20 bg-purple-500/[0.07] p-7 text-center sm:p-10">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Ready to talk to someone in {entry.name}?
          </h2>
          <p className="mx-auto mt-2.5 max-w-md text-sm text-purple-200/75">
            No signup, no history. Just a conversation with someone you have not met.
          </p>
          <Link href={entry.slug === "anonymous-text-chat" ? "/text-chat" : "/video-chat"} className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-extrabold text-white shadow-lg">
            {entry.slug === "anonymous-text-chat" ? <><MessageSquare size={16} /> Start text chat</> : <><Video size={16} /> Start video chat</>}
          </Link>
          {entry.peakHours && (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-purple-300/55">
              <Sunrise size={13} /> Busiest {formatPeakHours(entry.peakHours)}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
