import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Video, Mic, MessageSquare, ShieldCheck, Heart, Eye, Zap,
  Users, Globe2, Lock, SkipForward, Star, Sparkles, Phone,
  CheckCheck, X, ArrowRight,
} from "lucide-react";
import { BASE_URL } from "@/lib/seo";
import DatingReviews from "@/components/DatingReviews";
import OnlineBadge from "@/components/OnlineBadge";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/directory/FaqAccordion";

export const metadata: Metadata = {
  title: "Free Video Chat Dating — Meet Strangers Online, No Signup",
  description: "Free video chat dating in 2026 — no signup, no fake profiles. Meet real people live by video, not filtered photos. No account needed, works instantly on any browser.",
  alternates: { canonical: `${BASE_URL}/dating` },
  openGraph: {
    title: "Free Video Chat Dating — Meet Strangers Online, No Signup | Vidibro",
    description: "Free video chat dating in 2026 — no signup, no fake profiles. Meet real people live by video, not filtered photos. No account needed, works instantly on any browser.",
    url: `${BASE_URL}/dating`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Vidibro — Free Video Chat Dating",
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is video chat dating?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Video chat dating is a way to meet potential romantic partners through live, face-to-face video calls rather than text messages or dating app profiles. Instead of swiping through photos, you connect with a real stranger by video and know within seconds whether there is chemistry. Sites like Vidibro offer free video chat dating with no signup required.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best free video chat dating site in 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vidibro is one of the best free video chat dating sites in 2026 — no account, no subscription, no fake profiles. You connect live with a real stranger by video, voice, or text in under 10 seconds. Other popular options include Camloo, OmeTV, and Chatroulette, but most require accounts or have ads between calls.",
      },
    },
    {
      "@type": "Question",
      name: "Is Vidibro a dating app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vidibro is a free random video chat platform, not a dating app. There are no profiles, no swipes, no matches. You connect live with real strangers. Whether that leads to friendship, romance, or a language exchange is entirely up to you.",
      },
    },
    {
      "@type": "Question",
      name: "Is video chat dating free on Vidibro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completely free. No subscription, no credit card, no premium tier. Video chat, voice chat, and text chat — all three at zero cost, forever.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to register or create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No account, no email, no phone number. Open the site and start talking within seconds — nothing to fill in.",
      },
    },
    {
      "@type": "Question",
      name: "Is it safe to video chat with strangers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Calls are peer-to-peer and never recorded. You control the camera — switch to voice-only at any point. A skip button is always available. Never share personal details like your address or phone number with someone you just met.",
      },
    },
    {
      "@type": "Question",
      name: "Can I meet someone from my country?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is no country filter — you are matched randomly with people from 180+ countries. The queue is busiest during evenings across Asia, South America, and Europe.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best time to meet people on Vidibro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The queue is busiest between 8 PM and midnight in your local time. Weekends see higher traffic throughout the day. South Korea, India, Brazil, and Turkey make up the largest shares of daily users.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use Vidibro on mobile for video chat dating?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Chrome and Safari on Android and iPhone both work. No app download needed. Video quality adjusts automatically for your connection speed.",
      },
    },
    {
      "@type": "Question",
      name: "How is Vidibro different from Tinder or Bumble?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tinder and Bumble require profiles, photos, and often subscriptions. Vidibro requires nothing — open the site and you are live on camera with a real person in seconds. No swiping, no ghosting, no fake photos.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a Vidibro app to download?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No app needed — Vidibro runs in your browser on any device. Open the site on your phone or desktop and start instantly.",
      },
    },
    {
      "@type": "Question",
      name: "How do I stay in touch after a video chat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vidibro has no messaging system after the call ends. If you want to stay in touch, exchange Instagram, WhatsApp, or another contact during the call.",
      },
    },
  ],
};

const stats = [
  { value: "180+", label: "Countries" },
  { value: "24,000+", label: "Online now" },
  { value: "0", label: "Profiles required" },
  { value: "100%", label: "Free forever" },
];

const whyCards = [
  {
    icon: <Eye size={22} />,
    title: "Real person, first second",
    body: "Dating apps let people hide behind carefully curated photos taken years ago. Video chat shows exactly who someone is — live, unfiltered, no catfishing possible.",
    tone: "purple",
  },
  {
    icon: <Heart size={22} />,
    title: "Chemistry is instant or it isn't",
    body: "You know within 30 seconds whether there is a spark. No weeks of texting someone whose voice, energy, and presence you have never experienced.",
    tone: "pink",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "No fake profiles, ever",
    body: "There are no profiles to create — so there are no profiles to fake. The person on screen is exactly who you are talking to, in real time.",
    tone: "emerald",
  },
  {
    icon: <SkipForward size={22} />,
    title: "Skip freely, no awkwardness",
    body: "If the conversation is not going anywhere, one tap moves you on. No unmatching, no ghosting, no explanation needed — just the next person.",
    tone: "cyan",
  },
  {
    icon: <Globe2 size={22} />,
    title: "Meet people you'd never find",
    body: "Algorithms show you people similar to you. Random video chat connects you with different countries, backgrounds, and stories — conversations you didn't know you were looking for.",
    tone: "amber",
  },
  {
    icon: <Lock size={22} />,
    title: "Nothing is recorded",
    body: "Calls are peer-to-peer — your video never passes through our servers. When the call ends, it is gone. No history, no logs, no trace.",
    tone: "purple",
  },
];

const toneClasses: Record<string, string> = {
  purple: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  pink:   "text-pink-400 border-pink-500/30 bg-pink-500/10",
  emerald:"text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  cyan:   "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  amber:  "text-amber-400 border-amber-500/30 bg-amber-500/10",
};

const modes = [
  {
    icon: <Video size={28} />,
    title: "Video Chat",
    body: "Face-to-face with a stranger. See their reactions, their energy, their personality — in real time. The closest thing to meeting someone in person.",
    href: "/video-chat",
    cta: "Start Video Chat",
    tone: "purple",
  },
  {
    icon: <Phone size={28} />,
    title: "Voice Only",
    body: "Keep the camera off. Same live conversation — better for slow connections or when you prefer to stay off screen at first.",
    href: "/audio-chat",
    cta: "Start Voice Chat",
    tone: "cyan",
  },
  {
    icon: <MessageSquare size={28} />,
    title: "Text Chat",
    body: "No camera, no mic. Match with a stranger and talk by text — good for late nights, quiet places, or easing into it.",
    href: "/text-chat",
    cta: "Start Text Chat",
    tone: "pink",
  },
];

const whoCards = [
  { emoji: "💔", title: "Tired of dating apps", body: "Swipe fatigue is real. No more curated profiles, paid subscriptions, or weeks of texting before you even hear someone's voice." },
  { emoji: "🎓", title: "Students abroad", body: "Meeting people from other countries, practising languages, or breaking out of a closed social circle — all in one conversation." },
  { emoji: "🌍", title: "Curious people", body: "No specific agenda — just genuinely interested in who is out there and what they have to say. The best conversations start here." },
  { emoji: "🗣️", title: "Language learners", body: "The fastest way to improve is talking to a real native speaker. Vidibro connects you with one instantly — no scheduling, no lessons." },
];

const compareRows = [
  { feature: "Account required", vidibro: "Never", apps: "Always" },
  { feature: "Monthly subscription", vidibro: "Free", apps: "Paid tiers" },
  { feature: "See the real person immediately", vidibro: true, apps: false },
  { feature: "Fake profiles possible", vidibro: false, apps: true },
  { feature: "App download required", vidibro: false, apps: true },
  { feature: "Conversations recorded/stored", vidibro: "Never", apps: "Often" },
  { feature: "Skip without awkwardness", vidibro: true, apps: false },
  { feature: "Works on any browser", vidibro: true, apps: false },
];

const steps = [
  { n: 1, title: "Open the site", body: "No account, no download, no form. Open Vidibro in your browser — phone or desktop. Takes three seconds." },
  { n: 2, title: "Choose a mode", body: "Video, voice, or text. Allow camera and mic when prompted. Text chat needs nothing at all." },
  { n: 3, title: "Get matched", body: "A short countdown connects you with a random person from 180+ countries. At peak hours it takes under 5 seconds." },
  { n: 4, title: "Talk or skip", body: "Feel a connection? Keep talking. Not feeling it? Tap Next. No limit on skips, no explanation required." },
  { n: 5, title: "Exchange contact if you want", body: "Vidibro has no messaging after the call. If you want to stay in touch, share Instagram or WhatsApp during the conversation." },
];

const faqs = [
  { q: "What is video chat dating?", a: "Video chat dating is a way to meet potential romantic partners through live, face-to-face video calls rather than text messages or dating app profiles. Instead of swiping through photos, you connect with a real stranger by video and know within seconds whether there is chemistry. Sites like Vidibro offer free video chat dating with no signup required." },
  { q: "What is the best free video chat dating site in 2026?", a: "Vidibro is one of the best free video chat dating sites in 2026 — no account, no subscription, no fake profiles. You connect live with a real stranger by video, voice, or text in under 10 seconds. Other popular options include Camloo, OmeTV, and Chatroulette, but most require accounts or have ads between calls." },
  { q: "Is this a dating app?", a: "No — Vidibro is a random video chat platform. There are no profiles, no swipes, no matches. You connect instantly with real strangers by live video. Whether that leads to friendship, romance, or a great conversation is entirely up to you." },
  { q: "Is video chat dating on Vidibro free?", a: "Completely free. No subscription, no credit card, no premium tier. Video chat, voice chat, and text chat — all three at zero cost, forever." },
  { q: "Do I need to register or create an account?", a: "No account, no email, no phone number. Open the site and start talking within seconds — nothing to fill in." },
  { q: "How is Vidibro different from Tinder or Bumble?", a: "Tinder and Bumble require profiles, photos, and often subscriptions before you see or hear anyone. On Vidibro you are live on camera with a real person in seconds, with nothing to create. No swiping, no ghosting, no edited photos — just a real face." },
  { q: "Is it safe to meet strangers by video chat?", a: "Calls are peer-to-peer and never recorded or stored. You control the camera — switch to voice-only at any point. A skip button is always available. Never share personal details like your address or phone number with someone you just met." },
  { q: "Can I meet someone from my country?", a: "There is no country filter — you are matched randomly with people from 180+ countries. The queue is busiest during evenings across Asia, South America, and Europe." },
  { q: "What is the best time to meet people?", a: "The queue is busiest between 8 PM and midnight in your local time. Weekends see higher traffic throughout the day. South Korea, India, Brazil, and Turkey make up the largest shares of daily users." },
  { q: "Can I use Vidibro on my phone?", a: "Yes — Chrome and Safari on Android and iPhone both work. No app download needed. Video quality adjusts automatically for your connection speed." },
  { q: "Is there a Vidibro app to download?", a: "No app needed. Vidibro runs in your browser on any device. Open the site on your phone or desktop and start instantly — the browser is the app." },
  { q: "How do I stay in touch after a video chat?", a: "Vidibro has no built-in messaging after the call ends. If you want to stay in touch, exchange Instagram, WhatsApp, or another contact during the call itself." },
];

export default function DatingPage() {
  return (
    <>
      <JsonLd data={[faqSchema]} />
      <Navbar />
      <main className="w-full">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/25 via-transparent to-transparent pointer-events-none" />
          <div className="mx-auto max-w-4xl px-5 sm:px-6 pt-14 pb-10 text-center relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 mb-6">
              <Sparkles size={14} /> Free Video Chat Dating · No Signup · No Fake Profiles
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
              Free Video Chat Dating —<br className="hidden sm:block" /> Meet Real Strangers Online
            </h1>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
              No profiles. No algorithms. No subscription. Just a live video call with a real person —
              know in the first 30 seconds if there is a connection. Better than any dating app.
            </p>

            {/* Star rating */}
            <div className="flex items-center justify-center gap-1.5 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="text-sm text-[var(--muted)] ml-2">Loved by users in 180+ countries</span>
            </div>

            <div className="flex justify-center mb-6">
              <OnlineBadge />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/video-chat"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-7 py-3.5 font-semibold text-white hover:bg-purple-500 transition text-base"
              >
                <Video size={18} /> Start Video Chat — Free
              </Link>
              <Link
                href="/audio-chat"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-7 py-3.5 font-semibold text-[var(--foreground)] hover:border-purple-400 transition text-base"
              >
                <Mic size={18} /> Voice Only
              </Link>
            </div>
          </div>
        </div>

        {/* ── DEFINITION ── */}
        <div className="mx-auto max-w-4xl px-5 sm:px-6 py-8">
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">What is video chat dating?</h2>
            <p className="text-base leading-relaxed text-purple-100/80">
              Video chat dating is a way to meet potential romantic partners through live, face-to-face video calls rather than text messages or dating app profiles. Instead of swiping through photos, you connect with a real stranger by video and know within seconds whether there is chemistry — no curated bios, no filtered photos, no weeks of texting before you hear someone's voice. Vidibro offers free video chat dating with no signup required, connecting you with strangers from 180+ countries instantly.
            </p>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="border-y border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-4xl px-5 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-5 sm:px-6 py-12 space-y-16">

          {/* ── WHY VIDEO CHAT ── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Why it works</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Why video chat dating beats dating apps</h2>
              <p className="text-[var(--muted)]">Everything dating apps promise — Vidibro actually delivers, instantly and for free.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {whyCards.map((c) => (
                <div
                  key={c.title}
                  className={`rounded-xl border p-5 flex flex-col gap-3 ${toneClasses[c.tone]}`}
                >
                  <span className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5">
                    {c.icon}
                  </span>
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SEO PROSE ── */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Free Video Chat Dating — No Account, No Fake Profiles
            </h2>
            <p className="text-base leading-relaxed text-purple-100/80 mb-4">
              Most dating sites ask you to build a profile before you see a single real person. Vidibro skips that entirely — open the site and you are live on camera with a stranger in under 10 seconds. No email, no phone number, no subscription. It is the fastest way to meet someone online in 2026, and it costs nothing.
            </p>
            <p className="text-base leading-relaxed text-purple-100/80 mb-4">
              Searches reach this page from a lot of directions — free video chat dating, random video call dating, meet strangers online free, cam chat dating, online dating no signup, Omegle alternative dating, video date free. Every one of them describes the same thing: a live 1-on-1 video call with a real person, no profile required, completely free. That is exactly what Vidibro is.
            </p>
            <p className="text-base leading-relaxed text-purple-100/80">
              The pool includes users from 180+ countries and is most active between 8 PM and midnight across time zones. South Korea, India, Brazil, and Turkey are consistently the busiest markets. Video, voice, and text modes are all available — start with whatever feels right, switch at any point, skip whenever you want.
            </p>
          </section>

          {/* ── COMPARE TABLE ── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Comparison</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Vidibro vs Tinder, Bumble & dating apps</h2>
              <p className="text-[var(--muted)]">Why people are switching from swipe apps to live video chat.</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-white/[0.03]">
                    <th className="text-left px-5 py-3 text-[var(--muted)] font-semibold">Feature</th>
                    <th className="px-5 py-3 text-purple-400 font-bold text-center">Vidibro</th>
                    <th className="px-5 py-3 text-[var(--muted)] font-semibold text-center">Dating Apps</th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((r, i) => (
                    <tr key={r.feature} className={`border-b border-[var(--border)] last:border-0 ${i % 2 === 0 ? "bg-[var(--surface)]" : ""}`}>
                      <td className="px-5 py-3.5 text-[var(--muted)]">{r.feature}</td>
                      <td className="px-5 py-3.5 text-center">
                        {typeof r.vidibro === "boolean" ? (
                          r.vidibro
                            ? <CheckCheck size={16} className="text-emerald-400 mx-auto" />
                            : <X size={16} className="text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-emerald-400 font-semibold">{r.vidibro}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {typeof r.apps === "boolean" ? (
                          r.apps
                            ? <CheckCheck size={16} className="text-[var(--muted)] mx-auto" />
                            : <X size={16} className="text-red-400 mx-auto" />
                        ) : (
                          <span className="text-red-400/80 font-semibold">{r.apps}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── REVIEWS ── */}
          <section className="-mx-5 sm:-mx-6">
            <div className="px-5 sm:px-6 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">What people say about video chat dating</h2>
              <p className="text-[var(--muted)]">Real conversations, real connections — from users in 180+ countries.</p>
            </div>
            <DatingReviews />
          </section>

          {/* ── THREE MODES ── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">How to connect</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Three ways to meet strangers online free</h2>
              <p className="text-[var(--muted)]">Start the way that feels comfortable. Switch anytime, no limit.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {modes.map((m) => (
                <div
                  key={m.title}
                  className={`rounded-xl border p-6 flex flex-col gap-4 ${toneClasses[m.tone]}`}
                >
                  <span>{m.icon}</span>
                  <div>
                    <p className="font-bold text-white text-lg mb-1">{m.title}</p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{m.body}</p>
                  </div>
                  <Link
                    href={m.href}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition"
                  >
                    {m.cta} <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── WHO CONNECTS ── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Who uses Vidibro</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Who connects on Vidibro</h2>
              <p className="text-[var(--muted)]">No single type of person. That is the point.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whoCards.map((c) => (
                <div key={c.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-3">
                  <span className="text-3xl">{c.emoji}</span>
                  <p className="font-semibold text-white">{c.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Getting started</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">How to start a free video chat date</h2>
              <p className="text-[var(--muted)]">Five steps. The first takes about 3 seconds.</p>
            </div>
            <div className="space-y-3">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white text-sm font-bold">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-semibold text-white mb-1">{s.title}</p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECOND SEO PROSE ── */}
          <section className="rounded-2xl border border-pink-500/20 bg-pink-500/[0.04] p-7 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Random Video Chat Dating — The Omegle Alternative in 2026
            </h2>
            <p className="text-base leading-relaxed text-purple-100/80 mb-4">
              After Omegle shut down, millions of people moved to random video chat sites looking for the same experience — a real stranger, no profile, no friction. Vidibro is the Omegle alternative built for 2026: peer-to-peer video with no account, no ads between calls, and no server recording your conversations.
            </p>
            <p className="text-base leading-relaxed text-purple-100/80 mb-4">
              The dating angle is simple. When you can see and hear someone within the first 10 seconds, you know immediately whether there is chemistry. No filtered photos, no rehearsed bios, no curated highlight reel. Just the actual person — their laugh, their energy, their sense of humour — before you have invested more than 30 seconds.
            </p>
            <p className="text-base leading-relaxed text-purple-100/80">
              If the connection is there, stay as long as you want. If it is not, one tap moves you forward. There is no unmatching, no awkward goodbye message, no ghost. Just the next conversation — which could be the one that matters.
            </p>
          </section>

          {/* ── FAQ ── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">FAQ</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Frequently asked questions</h2>
              <p className="text-[var(--muted)]">Everything you need to know about free video chat dating on Vidibro.</p>
            </div>
            <FaqAccordion items={faqs.map((f) => ({ question: f.q, answer: f.a }))} />
          </section>

          {/* ── RELATED LINKS ── */}
          <section>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Explore more</p>
              <h2 className="text-xl font-bold text-white">More ways to meet people on Vidibro</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { href: "/video-chat", label: "Random Video Chat" },
                { href: "/audio-chat", label: "Voice Chat — Camera Off" },
                { href: "/text-chat", label: "Anonymous Text Chat" },
                { href: "/directory/video-chat-india", label: "Video Chat India" },
                { href: "/directory/video-chat-brazil", label: "Video Chat Brazil" },
                { href: "/directory/video-chat-south-korea", label: "Video Chat South Korea" },
                { href: "/directory/video-chat-japan", label: "Video Chat Japan" },
                { href: "/directory/video-chat-turkey", label: "Video Chat Turkey" },
                { href: "/omegle-alternative", label: "Omegle Alternative" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] hover:border-purple-400 hover:text-white transition"
                >
                  <ArrowRight size={14} className="text-purple-400 shrink-0" />
                  {l.label}
                </Link>
              ))}
            </div>
          </section>

          {/* ── FINAL CTA ── */}
          <section className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-10 text-center">
            <div className="flex justify-center mb-4">
              <span className="text-5xl">💬</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to meet someone real?</h2>
            <p className="text-[var(--muted)] max-w-md mx-auto mb-8 leading-relaxed">
              No signup. No subscription. No fake profiles. Open the site and start your free video chat date right now.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/video-chat"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-8 py-3.5 font-semibold text-white hover:bg-purple-500 transition"
              >
                <Video size={18} /> Start Video Chat — Free
              </Link>
              <Link
                href="/text-chat"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-8 py-3.5 font-semibold text-[var(--foreground)] hover:border-purple-400 transition"
              >
                <MessageSquare size={18} /> Try Text Chat
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
