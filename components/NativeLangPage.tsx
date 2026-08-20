import Link from "next/link";
import {
  Video, Mic, MessageSquare, Clock, ShieldCheck, Zap,
  Lock, Smartphone, Sticker, CheckCheck, Globe2,
  MousePointerClick, Camera, Users, ArrowLeft, Sparkles,
  Scale, HelpCircle, Compass,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/directory/FaqAccordion";
import PeakHoursBar from "@/components/PeakHoursBar";
import {
  SectionHead,
  StatTile,
  IconCard,
  StepCard,
  CompareTable,
} from "@/components/directory/Cards";
import { BASE_URL } from "@/lib/seo";
import type { NativeLangData } from "@/lib/native-pages/types";
import { REVERSE_NATIVE_LINKS } from "@/lib/native-pages/directory-links";

export type { NativeLangData };

export default function NativeLangPage({ data }: { data: NativeLangData }) {
  const url = `${BASE_URL}${data.canonicalSlug}`;
  const dirLinks = REVERSE_NATIVE_LINKS[data.canonicalSlug] ?? [];

  return (
    <main className="w-full">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Vidibro", item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: data.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]}
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-6 py-10 sm:py-14">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-semibold text-purple-300 transition hover:text-purple-200"
          >
            <ArrowLeft size={15} /> Vidibro
          </Link>
        </nav>

        {/* English directory cross-links */}
        {dirLinks.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/[0.06] px-4 py-3 text-sm">
            <span className="text-purple-300/70 shrink-0">Read in English →</span>
            {dirLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 font-semibold text-purple-200 transition hover:border-purple-400/60 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        <article lang={data.lang} dir={data.dir ?? "ltr"}>
          <h1 className="max-w-4xl text-[2rem] leading-[1.1] sm:text-5xl sm:leading-[1.08] font-black tracking-tight text-white">
            {data.h1}
          </h1>
          <p className="mt-5 max-w-3xl text-lg sm:text-xl font-bold leading-snug text-purple-100">
            {data.tagline}
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/video-chat"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110 sm:w-auto"
            >
              <Video size={19} /> {data.btnVideo}
            </Link>
            <Link
              href="/audio-chat"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 sm:w-auto"
            >
              <Mic size={19} /> {data.btnVoice}
            </Link>
            <Link
              href="/text-chat"
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-4 text-base font-extrabold text-white shadow-lg shadow-pink-500/25 transition hover:brightness-110 sm:w-auto"
            >
              <MessageSquare size={19} /> {data.btnText}
            </Link>
          </div>

          {/* Intro paragraph */}
          <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-purple-100/80">
            {data.intro}
          </p>

          {/* Stats grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatTile tone="emerald" value="None" label="Signup required" />
            <StatTile tone="cyan" value={data.peakHoursDisplay} label="Busiest window" />
            <StatTile tone="purple" value={data.langCount} label="Languages you'll hear" />
            <StatTile tone="amber" value="180+" label="Countries" />
            <StatTile tone="pink" value="300k+" label="Daily matches" />
            <StatTile tone="emerald" value="99.9%" label="Uptime" />
          </div>

          {/* ── WHY VIDIBRO ── */}
          <section className="mt-14">
            <SectionHead
              tone="purple"
              icon={<Zap size={18} />}
              title={data.whyTitle}
              blurb={data.whyBlurb}
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <IconCard icon={<Lock size={16} />} title={data.whyCards[0].title} tone={data.whyCards[0].tone}>
                {data.whyCards[0].body}
              </IconCard>
              <IconCard icon={<Smartphone size={16} />} title={data.whyCards[1].title} tone={data.whyCards[1].tone}>
                {data.whyCards[1].body}
              </IconCard>
              <IconCard icon={<Sticker size={16} />} title={data.whyCards[2].title} tone={data.whyCards[2].tone}>
                {data.whyCards[2].body}
              </IconCard>
              <IconCard icon={<CheckCheck size={16} />} title={data.whyCards[3].title} tone={data.whyCards[3].tone}>
                {data.whyCards[3].body}
              </IconCard>
              <IconCard icon={<Globe2 size={16} />} title={data.whyCards[4].title} tone={data.whyCards[4].tone}>
                {data.whyCards[4].body}
              </IconCard>
              <IconCard icon={<MousePointerClick size={16} />} title={data.whyCards[5].title} tone={data.whyCards[5].tone}>
                {data.whyCards[5].body}
              </IconCard>
            </div>
          </section>

          {/* ── LOCAL KNOWLEDGE ── */}
          <section className="mt-14">
            <SectionHead
              tone="pink"
              icon={<Compass size={18} />}
              title={data.localTitle}
              blurb={data.connectivity}
            />

            <div className="grid gap-3 lg:grid-cols-2">
              {/* Peak hours card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <Clock size={15} />
                  </span>
                  <h3 className="text-base font-black text-white">Peak match hours</h3>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-black text-emerald-300">{data.peakHoursDisplay}</div>
                <p className="mt-2 text-sm leading-relaxed text-purple-100/80">{data.peakNote}</p>
                <PeakHoursBar peakHours={data.peakHoursDisplay} />
              </div>

              {/* Phrases card */}
              {data.phrases && data.phrases.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                      <MessageSquare size={15} />
                    </span>
                    <h3 className="text-base font-black text-white">Useful phrases</h3>
                  </div>
                  <ul className="space-y-3">
                    {data.phrases.map((p) => (
                      <li key={p.native} className="flex items-start gap-3">
                        <span className="text-lg font-bold leading-tight text-white">{p.native}</span>
                        <div className="text-sm leading-tight text-purple-100/70">
                          {p.romanized && <div className="italic">{p.romanized}</div>}
                          <div>{p.meaning}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conversation starters */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                    <Sparkles size={15} />
                  </span>
                  <h3 className="text-base font-black text-white">Conversation starters</h3>
                </div>
                <ul className="space-y-2">
                  {data.starters.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-purple-100/80">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400/60" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── FAMOUS FACTS ── */}
          <section className="mt-14">
            <SectionHead
              tone="amber"
              icon={<Sparkles size={18} />}
              title={data.famousTitle}
              blurb="Things unique to this language and culture — context that only matters here."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {data.famousFacts.map((f) => (
                <IconCard key={f.title} icon={<Sparkles size={16} />} title={f.title} tone={f.tone}>
                  {f.body}
                </IconCard>
              ))}
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section className="mt-14">
            <SectionHead tone="cyan" icon={<Zap size={18} />} title={data.howTitle} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StepCard step={1} icon={<MousePointerClick size={15} />} title={data.steps[0].title}>
                {data.steps[0].body}
              </StepCard>
              <StepCard step={2} icon={<Camera size={15} />} title={data.steps[1].title}>
                {data.steps[1].body}
              </StepCard>
              <StepCard step={3} icon={<Users size={15} />} title={data.steps[2].title}>
                {data.steps[2].body}
              </StepCard>
              <StepCard step={4} icon={<Zap size={15} />} title={data.steps[3].title}>
                {data.steps[3].body}
              </StepCard>
            </div>
          </section>

          {/* ── WHAT IS ── */}
          <section className="mt-14">
            <SectionHead tone="purple" icon={<HelpCircle size={18} />} title={data.whatIsTitle} />
            <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-purple-100/80">
              {data.whatIsBody}
            </p>
          </section>

          {/* ── CLONE COMPARISON ── */}
          <section className="mt-14">
            <SectionHead
              tone="amber"
              icon={<Scale size={18} />}
              title={data.cloneTitle}
              blurb={data.cloneBlurb}
            />
            <CompareTable rows={data.cloneRows} />
          </section>

          {/* ── STAYING SAFE ── */}
          <section className="mt-14">
            <SectionHead tone="emerald" icon={<ShieldCheck size={18} />} title={data.safetyTitle} />
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] p-5 sm:p-6">
              <p className="mb-3 text-base font-semibold leading-relaxed text-emerald-100">
                {data.safetyNote}
              </p>
              <p className="text-base leading-relaxed text-purple-100/85">{data.safetyBody}</p>
              <p className="mt-3 text-base leading-relaxed text-purple-100/85">
                A report button sits in the top bar throughout every call. It ends the conversation
                immediately and moves you on — use it early rather than sitting through something
                uncomfortable.
              </p>
              <Link
                href="/guidelines"
                className="mt-4 inline-block text-sm font-bold text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
              >
                {data.safetyLinkText}
              </Link>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="mt-14" id="faq">
            <SectionHead tone="amber" icon={<HelpCircle size={18} />} title={data.faqTitle} />
            <FaqAccordion items={data.faqs} />
          </section>

          {/* ── DATING CTA ── */}
          <section className="mt-14 rounded-3xl border border-pink-500/25 bg-pink-500/[0.06] p-7 text-center sm:p-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-300">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" /> Meet someone new
            </div>
            <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Looking to meet someone?
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-purple-200/70">
              Random video chat — real face-to-face connections, no fake profiles, no signup.
            </p>
            <Link
              href="/dating"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-3 text-sm font-extrabold text-white shadow-lg hover:opacity-90 transition"
            >
              Try video chat dating →
            </Link>
          </section>

          {/* ── FINAL CTA ── */}
          <section className="mt-14 rounded-3xl border border-purple-500/20 bg-purple-500/[0.07] p-7 text-center sm:p-10">
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              {data.ctaTitle}
            </h2>
            <p className="mx-auto mt-2.5 max-w-md text-sm text-purple-200/75">{data.ctaBody}</p>
            <Link
              href="/video-chat"
              className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-extrabold text-white shadow-lg"
            >
              <Video size={16} /> {data.btnVideo}
            </Link>
          </section>

        </article>
      </div>
    </main>
  );
}
