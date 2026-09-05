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

/** Icon and colour per spotlight kind, so the cards read as one family. */
const SPOTLIGHT_STYLE = {
  diaspora: { icon: <Plane size={16} />, tone: "cyan" as const },
  seasonal: { icon: <Snowflake size={16} />, tone: "cyan" as const },
  legal: { icon: <Gavel size={16} />, tone: "amber" as const },
  cost: { icon: <Wallet size={16} />, tone: "emerald" as const },
  culture: { icon: <Sparkles size={16} />, tone: "pink" as const },
  infra: { icon: <Wifi size={16} />, tone: "purple" as const },
  time: { icon: <Clock3 size={16} />, tone: "amber" as const },
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
            { value: "1M+", label: "Active Users", tone: "purple" as const },
            { value: "180+", label: "Countries", tone: "cyan" as const },
            { value: "300k+", label: "Daily Matches", tone: "pink" as const },
            { value: "99.9%", label: "Uptime", tone: "emerald" as const },
          ].map((s) => (
            <StatTile key={s.label} tone={s.tone} value={s.value} label={s.label} />
          ))}
        </div>

        <section className="mt-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why us</p>
          <h2 className="mb-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Why Choose <span className="text-pink-400">Vidibro</span>?
          </h2>
          {entry.intro[1] && <p className="mb-8 text-base text-purple-200/70 max-w-xl mx-auto">{entry.intro[1]}</p>}
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

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <Clock size={15} />
                </span>
                <h3 className="text-base font-black text-white">Peak match hours</h3>
              </div>
              <div className="mt-3 text-2xl sm:text-3xl font-black text-emerald-300">{formatPeakHours(entry.peakHours!)}</div>
              <p className="mt-2 text-sm leading-relaxed text-purple-100/80">{entry.localNote}</p>
              <PeakHoursBar peakHours={entry.peakHours!} />
            </div>

            {entry.localPhrases?.length ? (
              <SpeakLocal name={entry.name} phrases={entry.localPhrases} />
            ) : (
              <IconCard icon={<Languages size={15} />} title="Languages you'll hear" tone="amber">
                {entry.languages.join(" · ")}
              </IconCard>
            )}

            {entry.starters?.length ? <ConversationStarters name={entry.name} starters={entry.starters} /> : null}

            <div className="grid gap-3">
              <IconCard icon={<Signal size={15} />} title="Connection and data" tone="cyan">
                {entry.connectivityNote}
              </IconCard>
              {entry.places && (
                <IconCard icon={<Users size={15} />} title="Where people are" tone="purple">
                  {entry.places.join(" · ")}
                </IconCard>
              )}
            </div>
          </div>
        </section>
        )}

        {entry.spotlights && entry.spotlights.length > 0 && (
          <section className="mt-14">
            <SectionHead
              tone="amber"
              icon={<Sparkles size={18} />}
              title={`What is different about ${entry.name}`}
              blurb="Things that are true here and not in most other markets."
            />
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
          </section>
        )}

        {entry.quickFacts && entry.quickFacts.length > 0 && (
          <section className="mt-14">
            <SectionHead
              tone="purple"
              icon={<Globe2 size={18} />}
              title={`${entry.name} — quick facts`}
              blurb="Stuff that is actually true here and genuinely surprising if you didn't know."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entry.quickFacts.map((fact) => (
                <div
                  key={fact.title}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-2"
                >
                  <span className="text-3xl leading-none">{fact.emoji}</span>
                  <p className="font-semibold text-sm text-[var(--foreground)]">{fact.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{fact.body}</p>
                </div>
              ))}
            </div>
          </section>
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

        <section className="mt-14">
          <SectionHead
            tone="amber"
            icon={<Scale size={18} />}
            title="How this differs from the clone sites"
            blurb="Most Omegle replacements monetise attention. These are the differences that matter on a phone."
          />
          <CompareTable
            rows={[
              { feature: "Account required", us: "No", them: "Often" },
              { feature: "Video, voice and text", us: true, them: "Usually video only" },
              { feature: "Peer-to-peer media", us: true, them: false },
              { feature: "Adaptive bitrate for mobile data", us: true, them: false },
              { feature: "Conversation history kept", us: "None", them: "Varies" },
              { feature: "Cost", us: "Free", them: "Free with ads, or paid tiers" },
            ]}
          />
        </section>

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

        {entry.reviews && entry.reviews.length > 0 && (
          <section className="mt-14 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Loved by users</p>
            <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
              What Users <span className="text-pink-400">Say</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
              {entry.reviews.map((r, i) => {
                const colors = ["bg-pink-500", "bg-cyan-500", "bg-amber-500", "bg-purple-500"];
                return (
                  <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex flex-col justify-between">
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

        <section className="mt-14 rounded-3xl border border-purple-500/20 bg-purple-500/[0.07] p-7 text-center sm:p-10">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            Ready to talk to someone in {entry.name}?
          </h2>
          <p className="mx-auto mt-2.5 max-w-md text-sm text-purple-200/75">
            No signup, no history. Just a conversation with someone you have not met.
          </p>
          <Link href="/video-chat" className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-extrabold text-white shadow-lg">
            <Video size={16} /> Start video chat
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
