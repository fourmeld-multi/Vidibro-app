"use client";

import { Video, PhoneCall, MessageSquare, ShieldCheck, Zap, Globe, HelpCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/directory/FaqAccordion";

const FEATURES = [
  { icon: Zap, label: "Instant match", desc: "No queue timer. Matched in seconds.", color: "text-yellow-400", bg: "bg-yellow-500/15" },
  { icon: ShieldCheck, label: "Zero signup", desc: "No email, no account, nothing.", color: "text-green-400", bg: "bg-green-500/15" },
  { icon: Globe, label: "180+ countries", desc: "Real people online 24 hours.", color: "text-sky-400", bg: "bg-sky-500/15" },
  { icon: ShieldCheck, label: "P2P encrypted", desc: "No video stored on our servers.", color: "text-rose-400", bg: "bg-rose-500/15" },
];

const MODES = [
  { icon: Video, label: "Video Chat", desc: "Face-to-face, instant random match. Camera on.", href: "/video-chat", color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/25" },
  { icon: PhoneCall, label: "Voice Chat", desc: "Audio only — camera stays off.", href: "/audio-chat", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/25" },
  { icon: MessageSquare, label: "Text Chat", desc: "No camera, no mic. Just type.", href: "/text-chat", color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/25" },
];

const PAID_FLAGS = [
  "Coin systems that run out mid-conversation",
  "\"Free\" tiers that gate gender or country filters",
  "Registration walls that appear after 30 seconds",
  "Ads that auto-play during a live call",
  "Premium unlocks for HD video quality",
  "Daily chat limits on the free plan",
];

const SECTIONS = [
  {
    heading: "What Is Free Video Chat with Strangers?",
    paragraphs: [
      "Free video chat with strangers is exactly what it sounds like: you open a site, press a button, and a live video connection opens with someone you have never met. No introduction, no profile, no mutual friends required. The person on the other side is equally anonymous — they just pressed the same button from somewhere else in the world.",
      "The format became mainstream with Omegle, which launched in 2009 and reached tens of millions of daily users before shutting down in November 2023. The appeal was always the same: a completely frictionless way to talk to someone outside your existing social circle. No curated feed, no algorithm, no follower count — just a random person in real time.",
      "In 2026, several platforms have filled that space. The best of them kept what worked (instant anonymous matching, no profiles) and fixed what did not (bots, no moderation, desktop-only). Vidibro is built on that updated model — free video chat that requires nothing from you except a browser and a willingness to talk.",
    ],
  },
  {
    heading: "Why 'Free' Matters — What to Watch Out For",
    paragraphs: [
      "Most sites that claim to offer free video chat are not fully free. The word 'free' in their headline usually means 'free to start' — and then something runs out.",
      "Chatroulette introduced a coin system. You earn coins by watching ads or buy them with real money. Run out of coins and your ability to skip or match is throttled. Emerald Chat's karma system limits new users. Several platforms lock gender and country filters behind a paid tier. Some show auto-playing ads mid-call. Others require registration after your first few minutes, at which point you have already seen enough to want to stay.",
      "None of those are truly free. Free means you can open the page right now, match with a stranger, talk for as long as you want, skip to the next person whenever you want, and close the tab — without spending anything, creating anything, or watching anything you did not choose to watch. That is the only standard worth calling free.",
    ],
  },
  {
    heading: "How Vidibro's Free Video Chat Works",
    paragraphs: [
      "Open the page. Press Start. Within a few seconds, a peer-to-peer WebRTC connection opens between your browser and a stranger's browser. The video feed goes directly between the two of you — no media passes through our servers, which means there is nothing for us to record, store, or review.",
      "AI moderation runs in real time during the call, scanning for content that violates the platform rules without adding any noticeable latency. A one-tap report button is available throughout every session. Pressing it ends the conversation immediately and sends a report to a moderation queue.",
      "When the conversation ends — by either party pressing Next or closing the tab — it is gone. No log, no replay, no contact details exchanged unless both people choose to share them voluntarily. The next match starts fresh.",
      "Video quality adapts to your connection. On strong wifi or 5G it runs at full quality. On 4G it scales the bitrate down so the call keeps going rather than freezing. The call softens rather than drops — which matters when most random video chat happens in conditions that are not ideal: in bed, in transit, in a library.",
    ],
  },
  {
    heading: "Free Video Chat on Any Device — No App Required",
    paragraphs: [
      "Vidibro runs in Safari on iPhone, Chrome on Android, Firefox on both, and any modern desktop browser. No app store visit. No installation. No storage used on your device.",
      "This is not a minor detail. A lot of platforms that offer 'free video chat' deliver it well on desktop and badly on mobile — or they require an app download, which adds friction and takes up space. Vidibro was built mobile-first from the start, using WebRTC which runs natively in the browser on all modern devices.",
      "The three modes — video, voice, and text — all work on mobile. If you switch from video to text mid-session, you stay in the same queue. If your internet connection drops to 3G, voice mode gives you a fallback. If you are in a shared space and cannot use audio or video at all, text mode works with nothing but the screen.",
    ],
  },
  {
    heading: "Is Free Video Chat with Strangers Safe?",
    paragraphs: [
      "The technical side on Vidibro is as secure as random chat can be. Calls run peer-to-peer — the only data our servers see is the signalling handshake that connects two browsers. The video and audio itself travel directly between users. There are no recordings, no conversation logs, and no database of who spoke to whom.",
      "AI moderation handles the content side in real time. The one-tap report button ends any session immediately, without requiring you to explain yourself or fill in a form. The person is gone and you get a new match.",
      "The user-side rules are the same as any anonymous public interaction: no real name, no address, no financial details, no links to personal social media. The other person is a stranger. Most conversations are ordinary. Some are interesting. A small number are not worth continuing — the Next button handles those.",
    ],
  },
];

const RELATED_LINKS = [
  { href: "/free-random-video-chat", label: "Free Random Video Chat" },
  { href: "/omegle-alternative", label: "Omegle Alternative" },
  { href: "/chatroulette-alternative", label: "Chatroulette Alternative" },
  { href: "/ometv-alternative", label: "OmeTV Alternative" },
  { href: "/random-text-chat", label: "Random Text Chat" },
  { href: "/audio-chat", label: "Voice Chat" },
  { href: "/directory/anonymous-text-chat", label: "Anonymous Text Chat" },
  { href: "/directory/random-video-chat", label: "Random Video Chat Sites" },
];

type Props = { faqs: Array<{ question: string; answer: string }> };

export default function FreeVideoChatContent({ faqs }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-12">

        {/* Hero */}
        <div className="text-center flex flex-col items-center gap-4 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-widest">
            <span>⚡ 100% Free — No Coins — 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Free Video Chat<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              with Strangers
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            No coins, no signup, no download. Instant random video matching with real people
            from 180+ countries — free forever, in any browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => router.push("/video-chat")}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-white text-base transition-all shadow-lg shadow-purple-900/40"
            >
              Start Free Video Chat
            </button>
            <button
              onClick={() => router.push("/text-chat")}
              className="px-8 py-3.5 rounded-xl bg-white/8 border border-white/15 hover:bg-white/12 font-semibold text-white text-base transition-all"
            >
              Text Chat — No Camera
            </button>
          </div>
        </div>

        {/* Feature chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEATURES.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/4 p-4">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon size={16} />
              </span>
              <div className="font-bold text-white text-xs">{label}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        {/* What's NOT on Vidibro */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
              <AlertCircle size={18} />
            </span>
            <h2 className="text-lg font-black tracking-tight text-white">
              What Vidibro Does Not Have
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PAID_FLAGS.map((flag) => (
              <div key={flag} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                {flag}
              </div>
            ))}
          </div>
        </div>

        {/* 3 Modes */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Three Modes — All Free, All Anonymous
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODES.map(({ icon: Icon, label, desc, href, color, bg, border }) => (
              <Link key={label} href={href} className={`flex flex-col gap-3 rounded-2xl border ${border} ${bg} p-5 hover:bg-white/8 transition-colors`}>
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
              <Link key={href} href={href} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 hover:text-white hover:border-purple-500/40 transition-colors">
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
