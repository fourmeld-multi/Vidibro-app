import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Video, Mic, MessageSquare, ShieldCheck, Heart, Eye, Zap, Users } from "lucide-react";
import { BASE_URL } from "@/lib/seo";
import DatingReviews from "@/components/DatingReviews";

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

const whyCards = [
  {
    icon: <Eye size={20} />,
    title: "You see a real person immediately",
    body: "Dating apps let people hide behind carefully chosen photos. Video chat shows you who someone actually is in the first few seconds — no filters, no old pictures.",
  },
  {
    icon: <Heart size={20} />,
    title: "Chemistry is instant or it isn't",
    body: "You know within 30 seconds whether there is a spark. No wasted weeks of texting someone whose voice you have never heard.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "No fake profiles",
    body: "There are no profiles to create, so there are no profiles to fake. What you see is exactly who you are talking to, live.",
  },
  {
    icon: <Zap size={20} />,
    title: "Skip freely — no awkward ghosting",
    body: "If the conversation is not going anywhere, one tap moves you to the next person. No unmatching, no explanation, no bad feelings.",
  },
  {
    icon: <Users size={20} />,
    title: "Meet people you would never find otherwise",
    body: "Algorithms show you people similar to you. Random video chat connects you with people from different countries, backgrounds and cultures.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "No subscription, ever",
    body: "Dating apps charge for unlimited swipes, for seeing who liked you. Vidibro is free. All three modes — video, voice, text — at no cost.",
  },
];

const steps = [
  {
    n: 1,
    title: "Click Start Video Chat",
    body: "No account, no form. The site asks for camera and microphone permission — that is it.",
  },
  {
    n: 2,
    title: "Get matched instantly",
    body: "A countdown connects you with a random person. During peak hours this takes under 5 seconds.",
  },
  {
    n: 3,
    title: "Talk — or skip",
    body: "If you feel a connection, keep talking. If not, tap Next and you are immediately matched with someone new. No limit on skips.",
  },
  {
    n: 4,
    title: "Exchange contact details if you want",
    body: "Vidibro has no messaging system after the call ends. If you want to stay in touch, exchange Instagram, WhatsApp, or whatever you prefer during the call.",
  },
];

const faqs = [
  {
    q: "Is this a dating app?",
    a: "No — Vidibro is a random video chat platform, not a dating app. There are no profiles, no swipes, and no matches. You connect instantly with real strangers by video, voice, or text. Whether that leads to friendship or something more is entirely up to you.",
  },
  {
    q: "Is it free to use?",
    a: "Completely free. No subscription, no credit card, no premium tier. Video, voice, and text chat are all included at no cost.",
  },
  {
    q: "Can I meet someone from a specific country?",
    a: "There is no country filter. You are matched randomly with people from 180+ countries. The queue is busiest during evening hours across Asia, South America, and Europe.",
  },
  {
    q: "Is it safe?",
    a: "Conversations are peer-to-peer and not recorded. You control the camera — switch to voice-only at any point. A skip button is always available. Never share personal details like your phone number or address with someone you just met.",
  },
  {
    q: "Do I need to register?",
    a: "No account, no email, no phone number. Open the site and start talking within seconds.",
  },
  {
    q: "What is the best time to connect with people?",
    a: "The queue is busiest between 8 PM and midnight in your local time zone. Weekends see higher traffic throughout the day.",
  },
];

export default function DatingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 sm:px-6 py-10 sm:py-16">

        {/* Hero */}
        <div className="mb-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Random Video Chat Dating
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
            No profiles. No algorithms. No subscription. Just a live video call with a real stranger —
            and find out in the first 30 seconds if there is a connection.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/video-chat"
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500 transition"
            >
              <Video size={18} /> Start Video Chat
            </Link>
            <Link
              href="/audio-chat"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 font-semibold text-[var(--foreground)] hover:border-purple-400 transition"
            >
              <Mic size={18} /> Voice Only
            </Link>
            <Link
              href="/text-chat"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 font-semibold text-[var(--foreground)] hover:border-purple-400 transition"
            >
              <MessageSquare size={18} /> Text Chat
            </Link>
          </div>
        </div>

        {/* Why video chat */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6">Why video chat beats dating apps</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyCards.map((c) => (
              <div key={c.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex gap-4">
                <span className="mt-0.5 shrink-0 text-purple-400">{c.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-white mb-1">{c.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <DatingReviews />

        {/* How it works */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
          <ol className="space-y-4">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white text-sm font-bold">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-white mb-1">{s.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="font-semibold text-white mb-2">{f.q}</p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to meet someone?</h2>
          <p className="text-[var(--muted)] mb-6">
            No signup. No subscription. Just a real conversation with a real person.
          </p>
          <Link
            href="/video-chat"
            className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-8 py-3 font-semibold text-white hover:bg-purple-500 transition"
          >
            <Video size={18} /> Start Now — It&apos;s Free
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
