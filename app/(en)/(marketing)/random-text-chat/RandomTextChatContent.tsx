"use client";

import { MessageSquare, Video, PhoneCall, ShieldCheck, Zap, Eye, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/directory/FaqAccordion";

const ADVANTAGES = [
  { icon: Eye, label: "No face required", desc: "Camera off entirely. Your appearance is never part of the conversation.", color: "text-purple-400", bg: "bg-purple-500/15" },
  { icon: Zap, label: "No permissions", desc: "No camera or mic prompts. Works from any device, any context.", color: "text-yellow-400", bg: "bg-yellow-500/15" },
  { icon: ShieldCheck, label: "Think before you type", desc: "More considered replies. Less pressure than live video.", color: "text-green-400", bg: "bg-green-500/15" },
  { icon: ShieldCheck, label: "Nothing saved", desc: "Close the tab — the conversation is gone. No logs, no history.", color: "text-rose-400", bg: "bg-rose-500/15" },
];

const SECTIONS = [
  {
    heading: "What Is Random Text Chat?",
    paragraphs: [
      "Random text chat connects you with a stranger you have never met through a simple text interface — no video, no audio, just typing. You are matched instantly with someone else who pressed the same button at the same moment. If the conversation does not go anywhere, you move on. If it does, you talk for as long as you want.",
      "The format existed before video chat and outlasted most predictions that it would be replaced by it. Omegle had both a video section and a text section, and the text section consistently had longer average session times — people stayed in text conversations longer than video ones. The reason is simple: text gives you time to think. Video puts you on the spot. Both have their place, and they attract different moments in a person's day.",
      "In 2026, random text chat has a large and active user base — students who cannot use audio in shared spaces, people who prefer anonymity without even showing their face, language learners who need time to compose sentences, and anyone who finds video chat more performance than conversation.",
    ],
  },
  {
    heading: "Why Choose Text Chat Over Video?",
    paragraphs: [
      "Video chat is immediate and direct — you see the other person's face, hear their voice, and respond in real time. That immediacy is exactly what makes it work for some people and exactly what makes it uncomfortable for others.",
      "Text removes the performance element. You are not being watched. Your surroundings are not visible. If you are in bed at 1 AM with the lights off, in a library, on public transit, or simply somewhere that video is not appropriate — text works when video does not.",
      "It also removes the hardware requirement entirely. Text chat on Vidibro needs no camera permission, no microphone permission, no hardware check. If you are on a work laptop with the webcam covered, a tablet without a good microphone, or an older phone with a slow camera — text mode works perfectly on any of these.",
      "Language learners specifically prefer text: you can take a moment to construct a sentence, check a word, and respond without the awkward pause that happens on video when you stop talking for ten seconds to think. The other person can see that you are typing. That is enough.",
    ],
  },
  {
    heading: "How Random Text Chat Works on Vidibro",
    paragraphs: [
      "Open Vidibro, select text mode, press Start. The matchmaking system finds another person who selected text mode at roughly the same time and opens a conversation. No camera prompt, no mic prompt, no setup.",
      "The text interface shows double-tick read receipts: one tick when your message is sent, two ticks when the other person has read it. You always know the state of your message — not just whether it went through, but whether it was actually seen. Emoji stickers work across any language barrier. Full-screen reactions appear on both sides simultaneously.",
      "Nothing is stored. When either person closes the tab or presses Next, the conversation ends and is gone — no log, no archive, no history. There is no account to check, no inbox to look through. The conversation existed while it was happening and nowhere else.",
      "The matching pool for text mode includes users from 180+ countries. At peak hours — typically late evening in your timezone — matching takes a few seconds. At quieter times, slightly longer. There is no indicator of the other person's country or language until they write something, which is part of what makes it interesting.",
    ],
  },
  {
    heading: "Random Text Chat vs Anonymous Text Chat — What Is the Difference?",
    paragraphs: [
      "The terms are often used interchangeably, but they describe slightly different things.",
      "Random text chat emphasises the matching model: you are connected with someone chosen at random from the pool, with no algorithm deciding who you see based on your past behaviour, interests, or profile. The randomness is the feature — you have no idea who is on the other side until they start typing.",
      "Anonymous text chat emphasises the identity model: your name, email, social accounts, and personal details are never required or revealed. You are a text cursor and the other person is a text cursor. The conversation is the only thing that exists.",
      "On Vidibro, text chat is both: fully random matching and fully anonymous. No registration means no profile. No profile means no identity trail. No stored logs means even the conversation itself disappears when you leave. Random and anonymous are not features added on top of a normal chat platform — they are the architecture.",
    ],
  },
  {
    heading: "Is Random Text Chat Safe?",
    paragraphs: [
      "Text chat carries different risks than video chat, and some lower ones. There is no video to screenshot, no face to identify, no background to reveal your location. The conversation exists only as text, which is inherently less exposing than live video.",
      "Vidibro runs AI moderation across text chat in real time, scanning for content that violates the platform rules. A one-tap report button ends the conversation immediately and sends a report to a moderation queue. The person is gone before you have to see anything else.",
      "The standard rules apply: no real name, no address, no financial details, no links to personal accounts you want to keep private. The other person is a stranger. Most text chat conversations are completely ordinary. The Next button handles the ones that are not.",
    ],
  },
];

const RELATED_LINKS = [
  { href: "/text-chat", label: "Start Text Chat Now" },
  { href: "/free-video-chat", label: "Free Video Chat" },
  { href: "/free-random-video-chat", label: "Free Random Video Chat" },
  { href: "/directory/anonymous-text-chat", label: "Anonymous Text Chat" },
  { href: "/omegle-alternative", label: "Omegle Alternative" },
  { href: "/audio-chat", label: "Voice Chat — No Camera" },
  { href: "/directory/random-video-chat", label: "Random Video Chat Sites" },
];

type Props = { faqs: Array<{ question: string; answer: string }> };

export default function RandomTextChatContent({ faqs }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-12">

        {/* Hero */}
        <div className="text-center flex flex-col items-center gap-4 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 text-xs font-extrabold text-blue-300 uppercase tracking-widest">
            <span>💬 No Camera — No Signup — 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Random Text Chat<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              with Strangers
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Anonymous text matching with real people worldwide. No camera, no mic, no signup.
            Double-tick read receipts. Nothing saved when you leave.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => router.push("/text-chat")}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-bold text-white text-base transition-all shadow-lg shadow-blue-900/40"
            >
              Start Text Chat — No Camera
            </button>
            <button
              onClick={() => router.push("/video-chat")}
              className="px-8 py-3.5 rounded-xl bg-white/8 border border-white/15 hover:bg-white/12 font-semibold text-white text-base transition-all"
            >
              Switch to Video Chat
            </button>
          </div>
        </div>

        {/* Advantages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ADVANTAGES.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/4 p-4">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon size={16} />
              </span>
              <div className="font-bold text-white text-xs">{label}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        {/* Mode comparison */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            All Three Modes — Pick What Fits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: MessageSquare, label: "Text Chat", desc: "No camera. No mic. Just type.", href: "/text-chat", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/25", badge: "You are here" },
              { icon: PhoneCall, label: "Voice Chat", desc: "Audio only, camera stays off.", href: "/audio-chat", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/25", badge: null },
              { icon: Video, label: "Video Chat", desc: "Face-to-face, instant match.", href: "/video-chat", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/25", badge: null },
            ].map(({ icon: Icon, label, desc, href, color, bg, border, badge }) => (
              <Link key={label} href={href} className={`relative flex flex-col gap-3 rounded-2xl border ${border} ${bg} p-5 hover:bg-white/8 transition-colors`}>
                {badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full">{badge}</span>
                )}
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
                  <Icon size={20} />
                </span>
                <div>
                  <div className="font-bold text-white text-sm">{label}</div>
                  <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Content sections */}
        {SECTIONS.map(({ heading, paragraphs }) => (
          <div key={heading} className="flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{heading}</h2>
            <div className="flex flex-col gap-3">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-gray-300 leading-relaxed text-[15px]">{p}</p>
              ))}
            </div>
          </div>
        ))}

        {/* FAQ */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
              <HelpCircle size={18} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>

        {/* Related links */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-400 uppercase tracking-widest">Related</h2>
          <div className="flex flex-wrap gap-2">
            {RELATED_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 hover:text-white hover:border-blue-500/40 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
