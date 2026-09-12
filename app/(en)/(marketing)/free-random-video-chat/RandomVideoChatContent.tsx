"use client";

import { Video, PhoneCall, MessageSquare, ShieldCheck, Zap, Globe, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/directory/FaqAccordion";

const MODES = [
  {
    icon: Video,
    label: "Video Chat",
    desc: "Face-to-face with a random stranger. Camera on, instant match.",
    href: "/video-chat",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/25",
  },
  {
    icon: PhoneCall,
    label: "Voice Chat",
    desc: "Audio only — camera stays off. Real conversation, no performance.",
    href: "/audio-chat",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/25",
  },
  {
    icon: MessageSquare,
    label: "Text Chat",
    desc: "No camera, no mic. Just type — double-tick read receipts included.",
    href: "/text-chat",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/25",
  },
];

const FEATURES = [
  { icon: Zap, label: "Instant match", desc: "No waiting room. Matched in seconds.", color: "text-yellow-400", bg: "bg-yellow-500/15" },
  { icon: ShieldCheck, label: "Zero signup", desc: "No email, no account, no login.", color: "text-green-400", bg: "bg-green-500/15" },
  { icon: Globe, label: "180+ countries", desc: "Real people worldwide, 24 hours.", color: "text-sky-400", bg: "bg-sky-500/15" },
  { icon: ShieldCheck, label: "P2P encrypted", desc: "No video passes through our servers.", color: "text-rose-400", bg: "bg-rose-500/15" },
];

const SECTIONS = [
  {
    heading: "What Is Random Video Chat?",
    content: [
      "Random video chat connects you instantly with a stranger you have never met — no algorithm, no curated feed, no mutual friends required. You click a button and someone from anywhere in the world appears. If the conversation does not go where you want it to, you click Next and someone new appears. That is the entire model.",
      "The format was popularised by Omegle, which launched in 2009 and ran until November 2023. At its peak, tens of millions of people used it daily — for language practice, late-night conversation, sheer curiosity about the world outside their city. Omegle shut down due to moderation failures, but the demand it created did not go away. In 2026, random video chat is bigger than ever, spread across a generation of successors that have fixed the problems the original site left unsolved.",
      "Vidibro is built on the same core idea: instant, anonymous, zero-friction matching with real strangers. No account. No social graph. No history that follows you. You talk, you leave, nothing is saved.",
    ],
  },
  {
    heading: "How Random Video Chat Works in 2026 — No Signup, Instant Match",
    content: [
      "The mechanics are simpler than they look. When you open Vidibro and press Start, your browser connects to a matchmaking queue. Within a few seconds, another person who pressed Start at roughly the same time is randomly selected from that queue. A peer-to-peer WebRTC connection is opened directly between your two browsers — no video or audio routes through our servers. You see each other, you talk.",
      "The no-signup model is not just a convenience feature — it is structural. Because there are no accounts, there is no social graph, no identity that can be tracked or revealed. You are a connection endpoint. The person you match with is another connection endpoint. The conversation happens and then it is gone.",
      "Matching takes a few seconds at peak hours — typically evening in your local timezone, when students, remote workers, and people in late-night study sessions all pile into the queue at once. At quieter times it takes a little longer. There is no waiting room with a timer counting down. The counter runs until someone appears, and then you are in.",
      "After each conversation, you decide: press Next to get a new stranger, or close the tab. There is no 'add friend' button. No way to find the same person again. That is by design — the randomness is the feature, not a limitation.",
    ],
  },
  {
    heading: "Three Modes — Video, Voice, and Text",
    content: [
      "Most random video chat sites offer one mode: video. Vidibro offers three, and each fills a genuinely different use case.",
      "Video chat is the classic experience — face to face with a stranger, camera and mic both on. This is what Omegle made famous. It is direct, immediate, and the closest thing to being in the same room with someone on the other side of the planet.",
      "Voice chat is audio only, camera completely off. This is the mode for people who are tired, in a shared space, or simply do not want to be on video. The conversation is every bit as real — you can hear tone, pace, hesitation — but without the pressure of being watched. It is also the best mode for language practice, where listening without visual context forces you to pay attention to every word.",
      "Text chat needs no camera and no mic. It is pure typing — double-tick read receipts tell you when your message has been seen, emoji stickers work across any language barrier, and nothing is stored when you close the tab. Text mode is the mode for people who are completely new to random chat and not ready to be on camera, or who are in an environment where audio and video are not possible.",
      "All three modes are free. There is no 'premium tier' that unlocks video. No coin system that gates voice mode. No registration required for any of them.",
    ],
  },
  {
    heading: "Random Video Chat on Mobile — No App Required",
    content: [
      "Vidibro is built for mobile from the ground up, using WebRTC — the same technology that powers Google Meet, WhatsApp Web calls, and FaceTime on the web. It runs directly in Safari on iPhone and Chrome on Android. No app store visit. No installation. No storage used on your phone. Open the browser, open the site, start chatting.",
      "Video quality adapts automatically to your connection. On a strong wifi or 5G signal you get full quality. On 4G the bitrate scales down so the call keeps running rather than freezing. On a weak signal the video softens and the audio stays stable — the connection degrades gracefully instead of breaking.",
      "This matters because a large portion of random video chat happens on mobile, and it happens in exactly the conditions where connection quality is unpredictable: in bed, on transit, in a library. A site that only works well on a fast desktop connection misses most of its audience.",
    ],
  },
  {
    heading: "Is Random Video Chat Safe?",
    content: [
      "The honest answer is: it depends on the platform, and it depends on you.",
      "On Vidibro, the technical side is as safe as it can be. Calls run peer-to-peer via WebRTC — no video or audio passes through our servers, so we cannot record or store what happens. There are no chat logs. There is no database of your conversations tied to your IP address.",
      "AI moderation runs in real time during video calls, scanning for content that violates the platform rules. A one-tap report button is available throughout every call and ends the conversation immediately — you do not have to watch anything for longer than it takes to tap once. Reports go to a moderation queue. Accounts that accumulate reports are restricted.",
      "The user-side rules are straightforward: no real name, no address, no financial details, no phone number. The other person is a stranger — treat them like one until they have earned more. The same rules you apply to any public interaction online apply here, and probably more strictly, because the matching is genuinely random.",
      "Random video chat is not a background check. It is a conversation with an unknown person. Most of those conversations are completely ordinary. Some are memorable. A small number are not worth continuing. The Next button exists for that reason.",
    ],
  },
];

const RELATED_LINKS = [
  { href: "/free-video-chat", label: "Free Video Chat" },
  { href: "/random-text-chat", label: "Random Text Chat" },
  { href: "/omegle-alternative", label: "Omegle Alternative" },
  { href: "/chatroulette-alternative", label: "Chatroulette Alternative" },
  { href: "/ometv-alternative", label: "OmeTV Alternative" },
  { href: "/emerald-chat-alternative", label: "Emerald Chat Alternative" },
  { href: "/video-chat", label: "Start Video Chat" },
  { href: "/audio-chat", label: "Start Voice Chat" },
  { href: "/text-chat", label: "Start Text Chat" },
  { href: "/directory/anonymous-text-chat", label: "Anonymous Text Chat" },
  { href: "/directory/random-video-chat", label: "Random Video Chat Sites" },
];

type Props = {
  faqs: Array<{ question: string; answer: string }>;
};

export default function RandomVideoChatContent({ faqs }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-12">

        {/* Hero */}
        <div className="text-center flex flex-col items-center gap-4 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-widest">
            <span>⚡ Free — No Signup — 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Random Video Chat<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              with Strangers
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Instant random matching with real people from 180+ countries.
            No signup, no download, no coins. Video, voice, or text — your choice, all free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => router.push("/video-chat")}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-white text-base transition-all shadow-lg shadow-purple-900/40"
            >
              Start Random Video Chat
            </button>
            <button
              onClick={() => router.push("/text-chat")}
              className="px-8 py-3.5 rounded-xl bg-white/8 border border-white/15 hover:bg-white/12 font-semibold text-white text-base transition-all"
            >
              Text Chat — No Camera
            </button>
          </div>
        </div>

        {/* 3 Modes */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Three Ways to Connect — All Free
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODES.map(({ icon: Icon, label, desc, href, color, bg, border }) => (
              <Link
                key={label}
                href={href}
                className={`flex flex-col gap-3 rounded-2xl border ${border} ${bg} p-5 hover:bg-white/8 transition-colors`}
              >
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

        {/* 4 feature chips */}
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

        {/* Content sections */}
        {SECTIONS.map(({ heading, content }) => (
          <div key={heading} className="flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{heading}</h2>
            <div className="flex flex-col gap-3">
              {content.map((para, i) => (
                <p key={i} className="text-gray-300 leading-relaxed text-[15px]">{para}</p>
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
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 hover:text-white hover:border-purple-500/40 transition-colors"
              >
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
