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
  const newDesign = entry.slug === "video-chat-nepal" || entry.slug === "video-chat-south-korea" || entry.slug === "video-chat-bangladesh" || entry.slug === "video-chat-turkey" || entry.slug === "video-chat-brazil" || entry.slug === "video-chat-tokyo" || entry.slug === "video-chat-japan" || entry.slug === "tamil-video-chat";
  const ARAB_REDESIGN = new Set(["video-chat-congo", "video-chat-tunisia", "video-chat-algeria", "video-chat-egypt", "video-chat-syria"]);
  const isRedesign = ARAB_REDESIGN.has(entry.slug);

  const SPOTLIGHT_CARD_THEME: Record<string, { bg: string; m1: string; m2: string; glow: string; accent: string }> = {
    diaspora: { bg: "linear-gradient(170deg,#1a0533 0%,#3b1060 55%,#6d28d9 100%)", m1: "rgba(109,40,217,0.45)", m2: "rgba(26,5,51,0.85)", glow: "#c4b5fd", accent: "#a78bfa" },
    seasonal:  { bg: "linear-gradient(170deg,#0a2540 0%,#0369a1 55%,#38bdf8 100%)", m1: "rgba(3,105,161,0.50)", m2: "rgba(10,37,64,0.85)", glow: "#bae6fd", accent: "#38bdf8" },
    legal:     { bg: "linear-gradient(170deg,#422006 0%,#92400e 55%,#d97706 100%)", m1: "rgba(146,64,14,0.50)", m2: "rgba(66,32,6,0.85)", glow: "#fef08a", accent: "#fbbf24" },
    cost:      { bg: "linear-gradient(170deg,#052e16 0%,#065f46 55%,#10b981 100%)", m1: "rgba(6,95,70,0.50)", m2: "rgba(5,46,22,0.85)", glow: "#6ee7b7", accent: "#34d399" },
    culture:   { bg: "linear-gradient(170deg,#4a044e 0%,#9d174d 55%,#ec4899 100%)", m1: "rgba(157,23,77,0.50)", m2: "rgba(74,4,78,0.85)", glow: "#fbcfe8", accent: "#f9a8d4" },
    infra:     { bg: "linear-gradient(170deg,#0f0a2e 0%,#1e40af 55%,#6366f1 100%)", m1: "rgba(30,64,175,0.50)", m2: "rgba(15,10,46,0.85)", glow: "#c7d2fe", accent: "#818cf8" },
    time:      { bg: "linear-gradient(170deg,#431407 0%,#c2410c 55%,#fb923c 100%)", m1: "rgba(194,65,12,0.50)", m2: "rgba(67,20,7,0.85)", glow: "#fed7aa", accent: "#fdba74" },
  };

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

      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-14">
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

        {/* ---------- HERO — unified for all pages ---------- */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-12">
          {/* Left: text + CTAs */}
          <div className="flex-1 min-w-0 lg:max-w-[520px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/[0.08] px-4 py-1.5 text-sm font-semibold text-purple-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Free &middot; No Signup &middot; No Account
            </div>

            <h1 className="text-[2rem] leading-[1.08] sm:text-5xl font-black tracking-tight text-white">
              {entry.title.replace(/\s*\|\s*Vidibro$/, "")}
            </h1>

            {entry.tagline && (
              <p className="mt-4 text-base sm:text-lg font-medium leading-relaxed text-purple-100/75">
                {entry.tagline}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/video-chat"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-5 text-lg font-extrabold text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110 sm:w-auto"
              >
                <Video size={22} /> Start Video Chat
              </Link>
              <Link
                href="/text-chat"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-pink-500/40 bg-pink-500/10 px-8 py-5 text-lg font-extrabold text-pink-200 transition hover:border-pink-400/60 hover:text-white sm:w-auto"
              >
                <MessageSquare size={22} /> Text Chat
              </Link>
              <Link
                href="/audio-chat"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/[0.08] px-8 py-5 text-lg font-extrabold text-cyan-200 transition hover:border-cyan-400/50 hover:text-white sm:w-auto"
              >
                <Mic size={22} /> Voice Chat
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-purple-300/55">
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> No account required</span>
              <span className="flex items-center gap-1.5"><Smartphone size={13} /> Works on any device</span>
              <span className="flex items-center gap-1.5"><Lock size={13} /> Nothing stored</span>
            </div>
          </div>

          {/* Right: illustration — desktop only */}
          <div className="hidden lg:block shrink-0 w-[380px] xl:w-[420px] select-none">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-violet-600/25 blur-2xl scale-110" />
              <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/25 to-transparent pointer-events-none" />
              <img
                src="/video-chat-illustration.jpg"
                alt="Video chat illustration"
                className="w-full h-auto rounded-3xl relative block"
              />
              {/* Bubble 1 — girl side (left), floating — phrase from entry data */}
              {entry.localPhrases?.[0] ? (
                <div className="absolute left-[12%] bottom-[32%] animate-float">
                  <span className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-xl shadow-violet-900/60 whitespace-nowrap">
                    💬 {entry.localPhrases[0].phrase}
                  </span>
                </div>
              ) : (
                <div className="absolute left-[12%] bottom-[32%] animate-float">
                  <span className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-xl shadow-violet-900/60 whitespace-nowrap">
                    💬 Hello! 👋
                  </span>
                </div>
              )}
              {/* Bubble 2 — boy side (right), typing animation — phrase from entry data */}
              <div className="absolute right-[8%] top-[48%] flex flex-col items-end gap-1">
                {entry.localPhrases?.[1] && (
                  <span className="inline-flex items-center gap-1.5 rounded-2xl rounded-br-none bg-fuchsia-600 px-3 py-1.5 text-xs font-bold text-white shadow-xl shadow-fuchsia-900/60 whitespace-nowrap">
                    💬 {entry.localPhrases[1].phrase}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-2xl rounded-br-none bg-fuchsia-700/80 px-3 py-2 shadow-lg dot-bounce text-fuchsia-200">
                  <span /><span /><span />
                </span>
              </div>
            </div>
          </div>
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
      </div>{/* end max-w-6xl hero/intro */}

      {/* ── SECTION CARD: Why Choose → FAQ ── */}
      <div className="mx-auto max-w-4xl px-5 sm:px-6 mt-14">
        <div className="relative rounded-3xl border border-white/[0.08] bg-[#0A0720] overflow-hidden px-6 py-12 sm:px-10">
          {/* subtle inner glow top */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          {/* dot grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle, rgba(139,92,246,0.25) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
          {/* corner glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-violet-600/10 blur-3xl" />

        <section className="pb-0 text-center relative">
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
          ) : entry.slug === "video-chat-japan" ? (
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {[
                {
                  icon: <Wifi size={24} />,
                  bg: "bg-purple-500/20 text-purple-300",
                  title: "World-Class Networks",
                  body: "NTT Docomo, SoftBank and au run some of the densest, fastest 4G and 5G coverage on Earth. Video calls from Japan hold full quality — in Tokyo's subways and beyond.",
                },
                {
                  icon: <Globe2 size={24} />,
                  bg: "bg-pink-500/20 text-pink-300",
                  title: "Anime, Konbini & Last Trains",
                  body: "Anime is mainstream, not niche. Konbini culture is a genuine daily ritual. And a missed last train at midnight means staying out until 5am — ask about any of these and you're in.",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  bg: "bg-emerald-500/20 text-emerald-300",
                  title: "No Account, No Trace",
                  body: "Calls run peer-to-peer on NTT Docomo, SoftBank or au. Nothing is recorded or stored on our side. Leave any time — no history, no account, nothing left behind.",
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
          ) : isRedesign ? (
            <div className="grid gap-5 sm:grid-cols-3 text-left">
              {[
                {
                  icon: <ShieldCheck size={26} />,
                  iconColor: "text-violet-400",
                  accent: "bg-violet-500",
                  title: "No Account Needed",
                  body: "Jump straight in. No sign-up, no email, no profile — nothing stored on our end after the call ends.",
                },
                {
                  icon: <Video size={26} />,
                  iconColor: "text-fuchsia-400",
                  accent: "bg-fuchsia-500",
                  title: "Video & Text Chat",
                  body: `Meet people from ${entry.name} over video or stick to text. Both modes work instantly, camera-optional.`,
                },
                {
                  icon: <Smartphone size={26} />,
                  iconColor: "text-purple-400",
                  accent: "bg-purple-500",
                  title: "Works on Any Device",
                  body: "Open the page on your phone, tablet, or laptop — no download, no app install, no permissions beyond your camera.",
                },
              ].map((card) => (
                <div key={card.title} className="relative overflow-hidden rounded-2xl bg-[#0C0920] border border-white/8 p-6 hover:border-purple-500/30 transition-colors">
                  <div className={`absolute inset-x-0 top-0 h-[3px] ${card.accent}`}/>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] ${card.iconColor}`}>
                    {card.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/65">{card.body}</p>
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
            <div className={isRedesign ? "relative overflow-hidden rounded-2xl bg-[#0C0920] border border-white/8 p-6" : "rounded-2xl border border-white/10 bg-white/[0.07] p-6"}>
              {isRedesign && <div className="absolute inset-x-0 top-0 h-[3px] bg-emerald-400"/>}
              <div className="mb-3 flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isRedesign ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-500/20 text-emerald-300"}`}>
                  <Clock size={18} />
                </span>
                <h3 className="text-base font-black text-white">Best Time to Chat</h3>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">{formatPeakHours(entry.peakHours!)}</div>
              <p className="mt-2 text-sm leading-relaxed text-purple-100/65">{entry.localNote}</p>
              {!isRedesign && <PeakHoursBar peakHours={entry.peakHours!} />}
            </div>

            {/* Works on Your Network */}
            <div className={isRedesign ? "relative overflow-hidden rounded-2xl bg-[#0C0920] border border-white/8 p-6" : "rounded-2xl border border-white/10 bg-white/[0.07] p-6"}>
              {isRedesign && <div className="absolute inset-x-0 top-0 h-[3px] bg-cyan-400"/>}
              <div className="mb-3 flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isRedesign ? "bg-cyan-500/15 text-cyan-400" : "bg-cyan-500/20 text-cyan-300"}`}>
                  <Signal size={18} />
                </span>
                <h3 className="text-base font-black text-white">Works on Your Network</h3>
              </div>
              {entry.providers && entry.providers.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {entry.providers.map((p) => (
                    <span key={p} className={`rounded-full px-3 py-1 text-xs font-semibold ${isRedesign ? "bg-white/[0.08] border border-white/10 text-cyan-300" : "border border-white/15 bg-white/[0.07] text-white/80"}`}>
                      {p}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed text-purple-100/65">{entry.connectivityNote}</p>
            </div>

            {entry.localPhrases?.length ? (
              <SpeakLocal name={entry.name} phrases={isRedesign ? entry.localPhrases.slice(0, 2) : entry.localPhrases} />
            ) : (
              <IconCard icon={<Languages size={15} />} title="Languages you'll hear" tone="amber">
                {entry.languages.join(" · ")}
              </IconCard>
            )}

            {entry.starters?.length ? <ConversationStarters name={entry.name} starters={isRedesign ? entry.starters.slice(0, 2) : entry.starters} /> : null}

            {entry.places && (
              <div className={isRedesign ? "relative overflow-hidden rounded-2xl bg-[#0C0920] border border-white/8 p-6" : "rounded-2xl border border-white/10 bg-white/[0.07] p-6"}>
                {isRedesign && <div className="absolute inset-x-0 top-0 h-[3px] bg-violet-400"/>}
                <div className="mb-3 flex items-center gap-2.5">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isRedesign ? "bg-violet-500/15 text-violet-400" : "bg-purple-500/20 text-purple-300"}`}>
                    <Users size={18} />
                  </span>
                  <h3 className="text-base font-black text-white">Where people are</h3>
                </div>
                <p className="text-sm leading-relaxed text-purple-100/65">{entry.places.join(" · ")}</p>
              </div>
            )}
          </div>
        </section>
        )}

        {entry.spotlights && entry.spotlights.length > 0 && (
          <section className="mt-14">
            <SectionHead
              tone="amber"
              icon={<Sparkles size={18} />}
              title={isRedesign || newDesign ? `What makes ${entry.name} unique` : `What is different about ${entry.name}`}
              blurb={isRedesign || newDesign
                ? `Specific things that shape every conversation with someone from ${entry.name} — context most visitors don't know.`
                : "Things that are true here and not in most other markets."}
            />
            {isRedesign ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {entry.spotlights.map((sp) => {
                  const style = SPOTLIGHT_STYLE[sp.kind];
                  const theme = SPOTLIGHT_CARD_THEME[sp.kind] ?? SPOTLIGHT_CARD_THEME.infra;
                  return (
                    <div key={sp.title} className="relative overflow-hidden rounded-2xl" style={{ background: theme.bg, minHeight: "200px" }}>
                      <div className="absolute top-5 right-5 h-14 w-14 rounded-full opacity-70 pointer-events-none" style={{ background: theme.glow, filter: "blur(16px)" }} />
                      <svg viewBox="0 0 400 110" className="absolute bottom-0 left-0 w-full pointer-events-none" preserveAspectRatio="none" aria-hidden="true">
                        <polygon points="0,110 70,52 145,82 240,22 320,62 400,12 400,110" fill={theme.m1}/>
                        <polygon points="0,110 55,80 125,104 205,58 285,88 365,52 400,68 400,110" fill={theme.m2}/>
                      </svg>
                      <div className="relative z-10 p-6 pb-20">
                        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "rgba(255,255,255,0.13)", color: theme.accent }}>
                          {style.icon}
                        </div>
                        <h3 className="mb-2 text-lg font-black text-white leading-tight">{sp.title}</h3>
                        <p className="text-sm leading-relaxed text-white/70">{sp.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : newDesign ? (
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
              {entry.quickFacts.map((fact) => {
                return (
                  <div
                    key={fact.title}
                    className={isRedesign
                      ? "relative overflow-hidden rounded-2xl bg-[#0C0920] border border-white/8 p-6 flex flex-col gap-3 hover:border-purple-500/30 transition-colors"
                      : "dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/30 flex flex-col gap-3"}
                  >
                    {isRedesign && <div className="absolute inset-x-0 top-0 h-[2px] bg-purple-400/60"/>}
                    <span className="text-4xl leading-none">{fact.emoji}</span>
                    <p className="text-base font-black text-white">{fact.title}</p>
                    <p className="text-sm text-purple-100/75 leading-relaxed">{fact.body}</p>
                  </div>
                );
              })}
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
            Anonymous text chat built for real conversations — no camera, no login, nothing stored.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { title: "Zero Camera Setup", body: "No permission prompts, no video, no mic. Open the page and start typing — works on any device, any browser." },
              { title: "Double-Tick Read Receipts", body: "Know exactly when your message is read, not just sent. One tick = delivered. Two ticks = read." },
              { title: "Emoji Stickers & Full-Screen Reactions", body: "Send emoji stickers and full-screen reactions during chat — the fastest way to communicate without a shared language." },
              { title: "Private by Default", body: "No login, no history, no stored messages. Close the tab and the conversation is gone — for both of you." },
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

        {/* ── ANONYMOUS TEXT CHAT: SEO prose + 4-card grid ── */}
        {entry.slug === "anonymous-text-chat" && (
          <>
            <section className="mt-14">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why text chat</p>
              <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
                Anonymous Text Chat — <span className="text-pink-400">What Makes It Different</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { emoji: "🙈", title: "No Face, No Pressure", body: "No camera means no performance anxiety. You can be tired, unshowered, or in a loud house and nobody knows. The conversation is all there is." },
                  { emoji: "💬", title: "Think Before You Send", body: "Unlike voice, text lets you compose. People practising a language, people who are shy, people who just had a long day — text chat gives everyone a breath before they reply." },
                  { emoji: "🔒", title: "Nothing Left Behind", body: "No login, no account, no message log. When you close the tab, both sides of the conversation are gone — not archived somewhere, just gone." },
                  { emoji: "⚡", title: "Instant Random Match", body: "Open the page and you are matched with a stranger in seconds. No waiting room, no filters, no profile to fill in. One person at a time." },
                ].map((c) => (
                  <div key={c.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center flex flex-col items-center">
                    <div className="mb-4 text-4xl">{c.emoji}</div>
                    <h3 className="mb-2 text-base font-black text-white">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-purple-100/70">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-7 sm:p-8">
              <h2 className="mb-4 text-xl sm:text-2xl font-black tracking-tight text-white">
                The Best Omegle Text Chat Alternative — No Login, No Camera
              </h2>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                When Omegle shut down, millions of users lost their go-to anonymous text chat. Most of the replacements that appeared require a camera, push paid tiers, or collect an email address before you can say a word. Vidibro&apos;s text mode is the closest thing to what Omegle&apos;s text section actually was: open the page, get matched with a random stranger in seconds, type, and leave whenever you want. No login. No registration. Nothing saved.
              </p>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                The differences that matter: read receipts tell you the moment your message is seen — not just delivered, but actually read. Emoji stickers and full-screen reactions mean a language gap is never a conversation stopper. And unlike most alternatives, text chat on Vidibro never requests camera or microphone permissions, not even once. There is nothing to accidentally turn on.
              </p>
              <p className="text-base leading-relaxed text-purple-100/80">
                Searches reach this page under a range of terms — anonymous chat with strangers, text chat no login, free random text chat, chat with strangers no account — and they all land the same thing. One person at a time, matched at random, from 180+ countries, on any device. If the conversation goes nowhere, one tap moves you to the next person. If it does go somewhere, nothing has to end it but you.
              </p>
            </section>
          </>
        )}

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

        {entry.slug === "video-chat-tokyo" && (
          <>
            {/* ── TOKYO: 4-card differentiator grid ── */}
            <section className="mt-14">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why Tokyo</p>
              <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
                Tokyo Video Chat — <span className="text-pink-400">What Makes It Different</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { emoji: "🗼", title: "23 Wards, 23 Personalities", body: "Shibuya, Akihabara, Asakusa and Shinjuku are all Tokyo but feel like entirely different cities. Ask which ward someone lives in and you already know something real about them." },
                  { emoji: "🌃", title: "Active After Midnight", body: "Last trains stop at midnight — so people either head home or stay out until 5am. The Tokyo queue runs later than almost any other city. Best window: 22:30 to 02:30 JST." },
                  { emoji: "🗣️", title: "Language Exchange Scene", body: "Tokyo has one of Asia's strongest English-practice communities. Many users here are actively looking for English conversation — mention it upfront and the call opens immediately." },
                  { emoji: "⚡", title: "Free — No Account, No App", body: "A Tokyo video call costs nothing and requires nothing. No email, no phone number, no download. Works directly on NTT Docomo, SoftBank or au — open the page and you're in." },
                ].map((c) => (
                  <div key={c.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center flex flex-col items-center">
                    <div className="mb-4 text-4xl">{c.emoji}</div>
                    <h3 className="mb-2 text-base font-black text-white">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-purple-100/70">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── TOKYO: SEO prose section ── */}
            <section className="mt-14 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-7 sm:p-8">
              <h2 className="mb-4 text-xl sm:text-2xl font-black tracking-tight text-white">
                Tokyo Video Chat — No Account, No Waiting
              </h2>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Tokyo is not a city that sleeps at midnight — it just moves indoors. After the last trains stop, people stay out in karaoke rooms, ramen shops and izakayas until the first morning trains run at 5am. That gap is exactly when the Tokyo chat queue fills up, which is why 22:30 to 02:30 JST is consistently the most active window on Vidibro for this city.
              </p>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Searches reach this page under a range of terms — Tokyo video chat, Tokyo random video call, chat with strangers Tokyo, Tokyo cam chat — and every one lands the same result: a live match in seconds, on any device, across NTT Docomo, SoftBank and au (KDDI). The pool covers all 23 wards: Shibuya, Shinjuku, Akihabara, Ikebukuro, Asakusa, Ginza and everywhere in between.
              </p>
              <p className="text-base leading-relaxed text-purple-100/80">
                Tokyo users skew toward language exchange more than the Japanese national average — many are actively practising English and will stay in a call much longer once they know you are a native or fluent speaker. Mention it in the first sentence and the conversation shifts immediately. If the call goes nowhere, one tap moves you to the next person — no limit, no goodbye required.
              </p>
            </section>
          </>
        )}

        {entry.slug === "video-chat-japan" && (
          <>
            {/* ── JAPAN: 4-card differentiator grid ── */}
            <section className="mt-14">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why Japan</p>
              <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
                Japan Video Chat — <span className="text-pink-400">What Makes It Different</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { emoji: "🎌", title: "Three Writing Systems at Once", body: "Hiragana, katakana and kanji — used together in a single sentence. Even typing a few Japanese words into chat earns genuine warmth and often a patient correction." },
                  { emoji: "🌸", title: "Seasonal Culture Is Real", body: "Hanami (cherry blossoms), summer festivals, onsen trips — Japan's seasons shape real daily plans. Ask what someone is doing this season and you get a real answer, not a generic one." },
                  { emoji: "🎲", title: "One Person at a Time", body: "No profile grids, no search filters. The next Japan video chat is whoever the queue pairs you with — completely random, which is what makes it work." },
                  { emoji: "⚡", title: "Free — No Account Ever", body: "A Japan video call costs nothing and asks for nothing. No email, no phone number, no app. Open the page on NTT Docomo, SoftBank or au and you are already in." },
                ].map((c) => (
                  <div key={c.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center flex flex-col items-center">
                    <div className="mb-4 text-4xl">{c.emoji}</div>
                    <h3 className="mb-2 text-base font-black text-white">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-purple-100/70">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── JAPAN: SEO prose section ── */}
            <section className="mt-14 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-7 sm:p-8">
              <h2 className="mb-4 text-xl sm:text-2xl font-black tracking-tight text-white">
                Random Video Chat in Japan — No Waiting, No Account
              </h2>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Japan has some of the most reliable mobile infrastructure on Earth — NTT Docomo, SoftBank and au run dense 4G and 5G coverage that makes dropped calls genuinely uncommon. That reliability translates directly to video call quality: what you get here is consistent, wherever the person on the other side happens to be sitting.
              </p>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Searches reach this page under a dozen names — Japan video chat, Japanese video call, video chat Japan free, random video call Japan — and every one of them lands the same thing: a live match in seconds, on any device, no account created, nothing stored. The pool concentrates in Tokyo, Osaka and Yokohama but covers every prefecture.
              </p>
              <p className="text-base leading-relaxed text-purple-100/80">
                Pacing is different here than in most markets. Comfortable silence is not awkward — it is normal. A slower build to personal topics goes further than blunt directness. And if there is a language gap, text mode is a gentler opening than voice. Patience tends to be rewarded here in a way it is not everywhere else.
              </p>
            </section>
          </>
        )}

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

        {entry.slug === "tamil-video-chat" && (
          <>
            {/* ── TAMIL: 4-card differentiator grid ── */}
            <section className="mt-14">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why Tamil</p>
              <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
                Tamil Video Chat — <span className="text-pink-400">What Makes It Different</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { emoji: "🌏", title: "Four-Country Language", body: "Tamil is official in India, Sri Lanka and Singapore, with a large established community in Malaysia. One conversation can reach Chennai, Jaffna, Kuala Lumpur or Singapore — no filter, no restriction." },
                  { emoji: "🎬", title: "Kollywood Has No Bollywood", body: "Rajini, Kamal, Vijay, Ajith — Kollywood has its own stars, its own rivalries and its own box-office records, entirely independent of Hindi cinema. No neutrals exist. Asking which side they are on opens the conversation immediately." },
                  { emoji: "🎲", title: "One Person at a Time", body: "No profile grids, no language filters. The next Tamil video chat is whoever the queue pairs you with — random by design, and that is exactly the point." },
                  { emoji: "⚡", title: "Free — No Account, No App", body: "Tamil video chat on Vidibro costs nothing and requires nothing. No email, no phone number, no download. Works directly on Jio, Airtel, Dialog and SingTel — open the page and you are in." },
                ].map((c) => (
                  <div key={c.title} className="dir-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center flex flex-col items-center">
                    <div className="mb-4 text-4xl">{c.emoji}</div>
                    <h3 className="mb-2 text-base font-black text-white">{c.title}</h3>
                    <p className="text-sm leading-relaxed text-purple-100/70">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── TAMIL: SEO prose section ── */}
            <section className="mt-14 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-7 sm:p-8">
              <h2 className="mb-4 text-xl sm:text-2xl font-black tracking-tight text-white">
                Tamil Video Chat Online — No Waiting, No Account
              </h2>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Tamil is one of the world&apos;s oldest living languages and the only one with official status in three separate countries — India, Sri Lanka and Singapore. That distribution matters for a chat platform: a Tamil conversation on Vidibro is as likely to reach Jaffna or Kuala Lumpur as Chennai or Coimbatore, and the regional varieties are distinct enough that people usually place each other within a sentence or two.
              </p>
              <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                Searches reach this page under several names — Tamil video chat, Tamil chat strangers, Tamil random video call, Tamil video call free — and every one lands the same result: a live match in seconds, on any device, with no account created and nothing stored. The pool covers Tamil Nadu, Sri Lanka, Malaysia and the Gulf, with a strong peak between 21:00 and 00:30 IST when Indian and Sri Lankan users overlap.
              </p>
              <p className="text-base leading-relaxed text-purple-100/80">
                Tanglish is fully accepted here — Tamil words in English letters, the way most people type on a phone keyboard without a Tamil layout installed. Nobody is going to correct you for it. If you want to practise proper Tamil script, most speakers are patient with learners who make a genuine effort. Voice chat suits language practice well: camera off, lower pressure, the conversation stays natural.
              </p>
            </section>
          </>
        )}

        {!entry.hideWhatIs && !isRedesign && (
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

        {entry.slug !== "video-chat-turkey" && entry.slug !== "video-chat-brazil" && entry.slug !== "video-chat-japan" && entry.slug !== "video-chat-tokyo" && entry.slug !== "tamil-video-chat" && entry.slug !== "video-chat-united-states" && entry.slug !== "video-chat-canada" && entry.slug !== "video-chat-delhi" && entry.slug !== "video-chat-uk" && entry.slug !== "video-chat-france" && entry.slug !== "video-chat-spain" && entry.slug !== "video-chat-russia" && !isRedesign && <section className="mt-14">
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

        </div>{/* end section card inner */}
      </div>{/* end section card wrapper */}

      {entry.reviews && entry.reviews.length > 0 && (
        <section className="mt-14 py-14">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-widest text-purple-400">Loved by users</p>
          <h2 className="mb-10 text-center text-2xl sm:text-3xl font-black tracking-tight text-white">
            What Users <span className="text-pink-400">Say</span>
          </h2>
          <div className="mx-auto grid max-w-7xl items-stretch gap-5 px-5 sm:px-8 sm:grid-cols-2 lg:grid-cols-4">
            {entry.reviews.map((r, i) => {
              const REVIEW_BG = [
                "linear-gradient(135deg,#ff7b7b,#e53535)",
                "linear-gradient(135deg,#ff85c2,#d4178a)",
                "linear-gradient(135deg,#c87eff,#8020e0)",
                "linear-gradient(135deg,#7bc4ff,#1a6fff)",
              ];
              const ACCENT_COLOR = ["#e53535", "#d4178a", "#8020e0", "#1a6fff"];
              const bg = REVIEW_BG[i % REVIEW_BG.length];
              const accent = ACCENT_COLOR[i % ACCENT_COLOR.length];
              return (
                <div key={i} className="flex flex-col overflow-hidden rounded-2xl shadow-xl shadow-black/40">
                  {/* Colored top — grows so all cards match height */}
                  <div className="relative flex flex-1 flex-col px-5 pt-5 pb-10" style={{ background: bg }}>
                    <span className="text-5xl font-bold leading-none text-white/80 select-none" style={{ fontFamily: "Georgia,serif" }}>&ldquo;</span>
                    <p className="mt-0.5 mb-3 flex-1 text-sm leading-relaxed text-white font-medium">{r.text}</p>
                    <div className="text-base text-yellow-200 tracking-wider">{"★★★★★"}</div>
                    {/* Wave into white section */}
                    <svg viewBox="0 0 400 38" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M0,38 Q80,4 200,22 Q320,38 400,8 L400,38 Z" fill="white"/>
                    </svg>
                  </div>
                  {/* White bottom — fixed height */}
                  <div className="flex items-center justify-between bg-white px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base" style={{ background: bg }}>{r.flag}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.role}</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold leading-none select-none" style={{ fontFamily: "Georgia,serif", color: accent }}>&rdquo;</span>
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
