import Link from "next/link";
import {
  Video, Mic, MessageSquare, Clock, ShieldCheck, Zap,
  Lock, Globe2, Languages, Signal, Activity,
  MousePointerClick, Camera, Users, ArrowLeft, Sparkles,
  Scale, HelpCircle, Compass, Star,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/directory/FaqAccordion";
import PeakHoursBar from "@/components/PeakHoursBar";
import {
  SectionHead,
  StatTile,
  StepCard,
  CompareTable,
} from "@/components/directory/Cards";
import { BASE_URL } from "@/lib/seo";
import type { NativeLangData } from "@/lib/native-pages/types";
import { REVERSE_NATIVE_LINKS } from "@/lib/native-pages/directory-links";
import type { Tone } from "@/components/directory/Cards";
import type { ReactNode } from "react";

export type { NativeLangData };

const TONE_BG: Record<Tone, string> = {
  purple: "bg-purple-500/20 text-purple-300",
  cyan: "bg-cyan-500/20 text-cyan-300",
  emerald: "bg-emerald-500/20 text-emerald-300",
  amber: "bg-amber-500/20 text-amber-300",
  pink: "bg-pink-500/20 text-pink-300",
};

const TONE_ICON: Record<Tone, ReactNode> = {
  purple: <Zap size={24} />,
  cyan: <Globe2 size={24} />,
  emerald: <Lock size={24} />,
  amber: <Languages size={24} />,
  pink: <Star size={24} />,
};

const PHRASE_ACCENTS = [
  "border-l-amber-400 bg-amber-500/[0.07]",
  "border-l-cyan-400 bg-cyan-500/[0.07]",
  "border-l-pink-400 bg-pink-500/[0.07]",
  "border-l-purple-400 bg-purple-500/[0.07]",
];

const STARTER_COLORS = [
  { dot: "bg-pink-400", text: "text-pink-300", border: "border-pink-400/40", bg: "bg-pink-500/10" },
  { dot: "bg-cyan-400", text: "text-cyan-300", border: "border-cyan-400/40", bg: "bg-cyan-500/10" },
  { dot: "bg-amber-400", text: "text-amber-300", border: "border-amber-400/40", bg: "bg-amber-500/10" },
  { dot: "bg-purple-400", text: "text-purple-300", border: "border-purple-400/40", bg: "bg-purple-500/10" },
];

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
              href="/random-voice-chat"
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

          {/* Stats — 4 tiles with icons */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "1M+",   label: "Active Users",  tone: "purple"  as Tone, icon: <Users size={24} /> },
              { value: "180+",  label: "Countries",     tone: "cyan"    as Tone, icon: <Globe2 size={24} /> },
              { value: "300k+", label: "Daily Matches", tone: "pink"    as Tone, icon: <Activity size={24} /> },
              { value: "99.9%", label: "Uptime",        tone: "emerald" as Tone, icon: <Zap size={24} /> },
            ].map((s) => (
              <StatTile key={s.label} tone={s.tone} value={s.value} label={s.label} icon={s.icon} />
            ))}
          </div>

          {/* ── WHY VIDIBRO — SillyChat-style 3-column big cards ── */}
          <section className="mt-14 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Why us</p>
            <h2 className="mb-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
              Why Choose <span className="text-pink-400">Vidibro</span>?
            </h2>
            {data.whyBlurb && (
              <p className="mb-8 text-base text-purple-200/70 max-w-xl mx-auto">{data.whyBlurb}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {data.whyCards.slice(0, 3).map((card) => (
                <div key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${TONE_BG[card.tone]}`}>
                    {TONE_ICON[card.tone]}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/75">{card.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── LOCAL KNOWLEDGE ── */}
          <section className="mt-14">
            <SectionHead
              tone="pink"
              icon={<Compass size={18} />}
              title={data.localTitle}
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
                <div className="text-3xl sm:text-4xl font-black text-emerald-300">{data.peakHoursDisplay}</div>
                <p className="mt-2 text-sm leading-relaxed text-purple-100/75">{data.peakNote}</p>
                <PeakHoursBar peakHours={data.peakHoursDisplay} />
              </div>

              {/* Works on Your Network */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Signal size={18} />
                  </span>
                  <h3 className="text-base font-black text-white">Works on Your Network</h3>
                </div>
                <p className="text-sm leading-relaxed text-purple-100/75">{data.connectivity}</p>
              </div>

              {/* Phrases */}
              {data.phrases && data.phrases.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
                      <Languages size={20} />
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-white">Speak Local</h3>
                      <p className="text-xs text-purple-300/60">Phrases that open conversations</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {data.phrases.map((p, i) => (
                      <div key={p.native} className={`rounded-xl border-l-4 px-4 py-3 ${PHRASE_ACCENTS[i % PHRASE_ACCENTS.length]}`}>
                        <div className="text-xl font-black text-white">{p.native}</div>
                        {p.romanized && <div className="mt-0.5 text-xs italic text-purple-300/55">{p.romanized}</div>}
                        <div className="mt-1 text-sm font-semibold text-purple-100/85">{p.meaning}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation starters */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-300">
                    <MessageSquare size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-white">Conversation Starters</h3>
                    <p className="text-xs text-purple-300/60">Copy and use mid-call</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {data.starters.map((s, i) => {
                    const c = STARTER_COLORS[i % STARTER_COLORS.length];
                    return (
                      <div key={s} className={`rounded-xl border ${c.border} ${c.bg} px-4 py-3`}>
                        <div className={`mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${c.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                          Starter
                        </div>
                        <p className="text-sm font-semibold text-white">&ldquo;{s}&rdquo;</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── FAMOUS FACTS — SillyChat big cards ── */}
          <section className="mt-14">
            <SectionHead
              tone="amber"
              icon={<Sparkles size={18} />}
              title={data.famousTitle}
              blurb="Things unique to this language and culture — context that only matters here."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {data.famousFacts.map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${TONE_BG[f.tone]}`}>
                    {TONE_ICON[f.tone]}
                  </div>
                  <h3 className="mb-2 text-lg font-black text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-purple-100/75">{f.body}</p>
                </div>
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

          {/* ── BRAZIL EXTRA: 4-card + prose (pt-br only) ── */}
          {data.showBrazilExtra && (
            <>
              <section className="mt-14">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-400">Por que o Brasil</p>
                <h2 className="mb-8 text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Vídeo Chat Brasileiro — <span className="text-pink-400">O que o Torna Diferente</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { emoji: "🇧🇷", title: "Maior Pool da América Latina", body: "O Brasil tem mais usuários online ao mesmo tempo do que qualquer vizinho. Combinações chegam rápido, mesmo fora do horário de pico — raramente mais de alguns segundos." },
                    { emoji: "🗣️", title: "Português, Não Espanhol", body: "O Brasil é o único país da região que fala português. Diga 'oi' e 'tudo bem' — mesmo uma tentativa simples gera uma reação calorosa na maioria das vezes." },
                    { emoji: "🎲", title: "Uma Pessoa por Vez", body: "Sem filtros de busca, sem grades de perfil. O próximo vídeo chat do Brasil é quem a fila parear com você — aleatório por design, e esse é o ponto." },
                    { emoji: "⚡", title: "Grátis — Sem Conta, Nunca", body: "Uma videochamada no Brasil não custa nada e não pede nada. Sem e-mail, sem telefone, sem app store. Abra a página e você já está dentro." },
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
                  Vídeo Chat Aleatório no Brasil — Sem Espera, Sem Conta
                </h2>
                <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                  O Brasil é o único país desta região que fala português em vez de espanhol — e é de longe o maior pool da América Latina, o que significa que um vídeo chat no Brasil raramente te faz esperar. Uma pessoa por vez, câmera ou texto, sem cadastro, sem instalar nada.
                </p>
                <p className="mb-4 text-base leading-relaxed text-purple-100/80">
                  As buscas chegam a esta página de várias formas — vídeo chat Brasil, videochat brasileiro, chat video Brasil, videochamada aleatória Brasil — e todas resultam na mesma coisa: uma combinação ao vivo em segundos, em qualquer dispositivo, pela Vivo, Claro ou TIM. O pool se concentra em São Paulo, Rio e Belo Horizonte, mas cobre todos os estados.
                </p>
                <p className="text-base leading-relaxed text-purple-100/80">
                  Se a conversa não render, um toque te leva para outra — sem despedida estranha, sem limite de quantas vezes você pode fazer isso. Se render, o Brasil costuma se alongar. Os brasileiros estão entre os usuários mais comunicativos em qualquer plataforma, e isso aparece já na primeira troca.
                </p>
              </section>
            </>
          )}

          {/* ── WHAT IS ── */}
          <section className="mt-14">
            <SectionHead tone="purple" icon={<HelpCircle size={18} />} title={data.whatIsTitle} />
            <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-purple-100/80">
              {data.whatIsBody}
            </p>
          </section>

          {/* ── CLONE COMPARISON ── */}
          {!data.hideCloneSection && (
          <section className="mt-14">
            <SectionHead
              tone="amber"
              icon={<Scale size={18} />}
              title={data.cloneTitle}
              blurb={data.cloneBlurb}
            />
            <CompareTable rows={data.cloneRows} />
          </section>
          )}

          {/* ── STAYING SAFE ── */}
          <section className="mt-14">
            <SectionHead tone="emerald" icon={<ShieldCheck size={18} />} title={data.safetyTitle} />
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.07] p-5 sm:p-6">
              <p className="mb-3 text-base font-semibold leading-relaxed text-emerald-100">
                {data.safetyNote}
              </p>
              <p className="text-base leading-relaxed text-purple-100/85">{data.safetyBody}</p>
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
