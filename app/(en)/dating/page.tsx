import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Video, Mic, MessageSquare, ShieldCheck, Heart, Eye, Zap,
  Users, Globe2, Lock, SkipForward, Star, Sparkles, Phone,
} from "lucide-react";
import { BASE_URL } from "@/lib/seo";
import DatingReviews from "@/components/DatingReviews";
import OnlineBadge from "@/components/OnlineBadge";

export const metadata: Metadata = {
  title: "Random Video Chat Dating — Meet Strangers Online Free",
  description: "Meet new people through random video chat. No signup, no fake profiles — just real face-to-face connections with strangers worldwide. Free video, voice, and text chat.",
  alternates: { canonical: `${BASE_URL}/dating` },
  openGraph: {
    title: "Random Video Chat Dating — Meet Strangers Online Free",
    description: "Meet new people through random video chat. No signup, no fake profiles — just real face-to-face connections.",
    url: `${BASE_URL}/dating`,
  },
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
    body: "Dating apps let people hide behind carefully chosen photos. Video chat shows you exactly who someone is — no filters, no old pictures, no catfishing.",
    tone: "purple",
  },
  {
    icon: <Heart size={22} />,
    title: "Chemistry is instant or it isn't",
    body: "You know within 30 seconds whether there is a spark. No wasted weeks texting someone whose voice you have never heard before.",
    tone: "pink",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "No fake profiles, ever",
    body: "There are no profiles to create — so there are no profiles to fake. The person on screen is exactly who you are talking to, live.",
    tone: "emerald",
  },
  {
    icon: <SkipForward size={22} />,
    title: "Skip freely, no awkwardness",
    body: "If the conversation is not going anywhere, one tap moves you on. No unmatching, no explanation, no bad feelings — just the next person.",
    tone: "cyan",
  },
  {
    icon: <Globe2 size={22} />,
    title: "Meet people you'd never find",
    body: "Algorithms show you people similar to you. Random video chat connects you with different countries, backgrounds, and cultures — conversations you didn't know you were looking for.",
    tone: "amber",
  },
  {
    icon: <Lock size={22} />,
    title: "Nothing is recorded",
    body: "Calls are peer-to-peer — your video never passes through our servers. When the call ends, it is gone. No history, no data, no trace.",
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
    body: "Face-to-face with a stranger. See their reactions, their space, their energy — in real time.",
    href: "/video-chat",
    cta: "Start Video Chat",
    tone: "purple",
  },
  {
    icon: <Phone size={28} />,
    title: "Voice Only",
    body: "Keep the camera off. Same live conversation — better for slow connections or when you prefer to stay off screen.",
    href: "/audio-chat",
    cta: "Start Voice Chat",
    tone: "cyan",
  },
  {
    icon: <MessageSquare size={28} />,
    title: "Text Chat",
    body: "No camera, no mic. Match with a stranger and talk by text — good for late nights or quiet places.",
    href: "/text-chat",
    cta: "Start Text Chat",
    tone: "pink",
  },
];

const whoCards = [
  { emoji: "🎓", title: "Students", body: "Meeting people from other countries, practising languages, or just breaking out of a closed social circle." },
  { emoji: "💔", title: "Singles", body: "Tired of swipe culture and fake profiles. Looking for real conversation first, everything else second." },
  { emoji: "🌍", title: "Curious people", body: "No specific agenda — just interested in who is out there and what they have to say." },
  { emoji: "🗣️", title: "Language learners", body: "The fastest way to improve is talking to a real native speaker. Vidibro connects you with one instantly." },
];

const steps = [
  { n: 1, title: "Open the site", body: "No account, no download, no form. Just open Vidibro in your browser — phone or desktop." },
  { n: 2, title: "Choose a mode", body: "Video, voice, or text. Allow camera and mic when prompted. Text chat needs nothing." },
  { n: 3, title: "Get matched", body: "A short countdown connects you with a random person from 180+ countries. During peak hours it takes under 5 seconds." },
  { n: 4, title: "Talk or skip", body: "Feel a connection? Keep talking. Not feeling it? Tap Next. There is no limit on skips and no explanation needed." },
  { n: 5, title: "Exchange contact if you want", body: "Vidibro has no messaging system after the call. If you want to stay in touch, exchange Instagram or WhatsApp during the call." },
];

const faqs = [
  {
    q: "Is this a dating app?",
    a: "No — Vidibro is a random video chat platform. There are no profiles, no swipes, no matches. You connect instantly with real strangers. Whether that leads to friendship, a language exchange, or something more is entirely up to you.",
  },
  {
    q: "Is it free?",
    a: "Completely free. No subscription, no credit card, no premium tier. All three modes — video, voice, text — at zero cost.",
  },
  {
    q: "Can I meet someone from my country?",
    a: "There is no country filter. You are matched randomly with people from 180+ countries. The queue is busiest during evenings across Asia, South America, and Europe.",
  },
  {
    q: "Is it safe?",
    a: "Calls are peer-to-peer and not recorded. You control the camera — switch to voice-only at any point. A skip button is always available. Never share personal details like your phone number or address with someone you just met.",
  },
  {
    q: "Do I need to register?",
    a: "No account, no email, no phone number. Open the site and start talking within seconds.",
  },
  {
    q: "What is the best time to meet people?",
    a: "The queue is busiest between 8 PM and midnight in your local time. Weekends see higher traffic throughout the day. South Korea, India, Brazil, and Turkey make up the largest shares of daily users.",
  },
  {
    q: "Can I use it on mobile?",
    a: "Yes — Chrome and Safari on Android and iPhone both work. No app download needed. The video quality adjusts automatically for your connection speed.",
  },
];

export default function DatingPage() {
  return (
    <>
      <Navbar />
      <main className="w-full">

        {/* ── HERO ── */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
          <div className="mx-auto max-w-4xl px-5 sm:px-6 pt-14 pb-10 text-center relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300 mb-6">
              <Sparkles size={14} /> Random Video Chat · Meet Real People
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
              Meet Strangers Online<br className="hidden sm:block" /> Through Video Chat
            </h1>
            <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
              No profiles. No algorithms. No subscription. Just a live video call with a real person —
              and find out in the first 30 seconds if there is a connection.
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Why video chat beats dating apps</h2>
              <p className="text-[var(--muted)]">Everything dating apps promise — Vidibro actually delivers.</p>
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

          {/* ── REVIEWS ── */}
          <section className="-mx-5 sm:-mx-6">
            <div className="px-5 sm:px-6 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">What people are saying</h2>
              <p className="text-[var(--muted)]">Real conversations, real connections.</p>
            </div>
            <DatingReviews />
          </section>

          {/* ── THREE MODES ── */}
          <section>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Three ways to connect</h2>
              <p className="text-[var(--muted)]">Start the way that feels comfortable. Switch anytime.</p>
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
                    {m.cta} →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── WHO CONNECTS ── */}
          <section>
            <div className="mb-8">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">How it works</h2>
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

          {/* ── FAQ ── */}
          <section>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Frequently asked questions</h2>
            </div>
            <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] overflow-hidden">
              {faqs.map((f) => (
                <div key={f.q} className="bg-[var(--surface)] px-6 py-5">
                  <p className="font-semibold text-white mb-2">{f.q}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
                </div>
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
              No signup. No subscription. Just open the site and start talking.
              The next conversation is one click away.
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
