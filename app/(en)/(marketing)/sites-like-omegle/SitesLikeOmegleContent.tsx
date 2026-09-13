"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/directory/FaqAccordion";
import { ShieldCheck, Zap, Globe, HelpCircle, Star, CheckCircle2, XCircle, Trophy, AlertTriangle } from "lucide-react";

const STATS = [
  { label: "Sites Tested", value: "40+" },
  { label: "Hours Spent", value: "60+" },
  { label: "Best Picks", value: "10" },
  { label: "Updated", value: "Sep 2026" },
];

const COMPARISON = [
  { site: "Vidibro", cost: "Free", login: "No", video: true, voice: true, text: true, mobile: true, rating: 5 },
  { site: "OmeTV", cost: "Free", login: "Social", video: true, voice: false, text: false, mobile: true, rating: 3.5 },
  { site: "Chatroulette", cost: "Free", login: "No", video: true, voice: false, text: false, mobile: false, rating: 3 },
  { site: "Emerald Chat", cost: "Freemium", login: "No", video: true, voice: false, text: true, mobile: false, rating: 3 },
  { site: "Chatrandom", cost: "Freemium", login: "No", video: true, voice: false, text: false, mobile: true, rating: 2.5 },
  { site: "Shagle", cost: "Freemium", login: "No", video: true, voice: false, text: false, mobile: true, rating: 2.5 },
  { site: "Bazoocam", cost: "Free", login: "No", video: true, voice: false, text: false, mobile: false, rating: 2 },
  { site: "Camsurf", cost: "Free", login: "No", video: true, voice: false, text: false, mobile: true, rating: 2.5 },
  { site: "CooMeet", cost: "Paid", login: "Yes", video: true, voice: false, text: false, mobile: true, rating: 2 },
  { site: "Monkey", cost: "Free", login: "Social", video: true, voice: false, text: false, mobile: true, rating: 2 },
];

const SITES = [
  {
    rank: 1,
    name: "Vidibro",
    badge: "★ Editor's Choice 2026",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    tagline: "Best Overall — The True Omegle Successor",
    quote: "The only platform that is 100% free, no login, three chat modes, and zero bots.",
    pros: [
      "100% free — no coins, no credits, no premium tier",
      "No signup, no email, no phone number",
      "Three modes: video, voice (camera off), and text",
      "P2P WebRTC — calls never touch our servers",
      "Real-time AI moderation + one-tap report",
      "Mobile-first: works in any browser, no app needed",
      "Text chat with read receipts and emoji reactions",
    ],
    cons: ["So addictive you might lose track of time"],
    verdict: "Vidibro is what Omegle should have evolved into. Instant matching, zero registration, no paywalls, and three chat modes Omegle never had. If you only try one site on this list, make it Vidibro.",
    cta: "Start Free on Vidibro",
    ctaHref: "/",
    accentFrom: "from-purple-500",
    accentTo: "to-pink-500",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-500/8",
    isWinner: true,
  },
  {
    rank: 2,
    name: "OmeTV",
    badge: "#2",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "Most Similar to Original Omegle",
    quote: "The closest replica of old Omegle — but requires a social login.",
    pros: ["Huge global user base", "Localized country filters", "Very active at all hours"],
    cons: ["Requires Facebook or VK login — kills anonymity", "Frequent unexplainable auto-bans", "No voice or text mode"],
    verdict: "A solid fallback if Vidibro's queue is slow in your region. The social login requirement is a dealbreaker for users who want true anonymity.",
    accentFrom: "from-blue-500",
    accentTo: "to-cyan-500",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    isWinner: false,
  },
  {
    rank: 3,
    name: "Chatroulette",
    badge: "#3",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "The Original Pioneer",
    quote: "The platform that started it all — attempting a 2026 comeback.",
    pros: ["Iconic and nostalgic interface", "No registration required", "Better moderation than its 2009 era"],
    cons: ["Very small user base — long wait times", "Frequent empty rooms and disconnects", "Desktop-only experience"],
    verdict: "Fun for nostalgia, but you will spend most of your time clicking Next looking for a real person. It has never recovered its original user base.",
    accentFrom: "from-orange-500",
    accentTo: "to-red-500",
    borderColor: "border-orange-500/20",
    bgColor: "bg-orange-500/5",
    isWinner: false,
  },
  {
    rank: 4,
    name: "Emerald Chat",
    badge: "#4",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "Best for Text & Interest Matching",
    quote: "Interest-matching chat that prioritizes text over video.",
    pros: ["Good interest-matching tag system", "Active text-chat community"],
    cons: ["Video chat often buggy or slow", "Interface feels dated", "Pushes premium upgrades aggressively"],
    verdict: "Better for text-based conversations. If you want a true video-first experience, this falls short.",
    accentFrom: "from-emerald-500",
    accentTo: "to-green-500",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    isWinner: false,
  },
  {
    rank: 5,
    name: "Chatrandom",
    badge: "#5",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "Best for Filtering — Behind a Paywall",
    quote: "Feature-rich but frustratingly locked behind coins.",
    pros: ["Geographic location filters", "Multiple chat modes available"],
    cons: ["Gender filters locked behind paywall", "Cannot access most features without paying", "Free version feels deliberately crippled"],
    verdict: "Technically capable but the aggressive monetization ruins the experience. Most of what you want costs money.",
    accentFrom: "from-violet-500",
    accentTo: "to-purple-500",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/5",
    isWinner: false,
  },
  {
    rank: 6,
    name: "Shagle",
    badge: "#6",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "Fast Connections — But Bot-Heavy",
    quote: "Quick to connect, but most connections aren't real people.",
    pros: ["Very fast initial connection speeds", "Completely anonymous browsing"],
    cons: ["Extremely high percentage of bots and fake users", "Heavy advertising throughout", "Premium pushed constantly during sessions"],
    verdict: "The connection speed is impressive but the bot problem is severe. Most of your matches will not be real people.",
    accentFrom: "from-rose-500",
    accentTo: "to-pink-500",
    borderColor: "border-rose-500/20",
    bgColor: "bg-rose-500/5",
    isWinner: false,
  },
  {
    rank: 7,
    name: "Bazoocam",
    badge: "#7",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "The Retro Classic",
    quote: "The French chat platform from 2010 that never really evolved.",
    pros: ["Completely free to use", "Built-in retro mini-games like Tetris"],
    cons: ["UI looks like it was built in 2005", "Almost entirely Euro-centric user base", "No mobile optimization at all"],
    verdict: "Charming in a retro way but completely outdated. If you're not in Europe or don't have a desktop, skip it.",
    accentFrom: "from-amber-500",
    accentTo: "to-yellow-500",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
    isWinner: false,
  },
  {
    rank: 8,
    name: "Camsurf",
    badge: "#8",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "Best Mobile App — If You Like Apps",
    quote: "Family-friendly and mobile-first, but forces you to install their app.",
    pros: ["Clean well-designed mobile app", "Very strict content moderation"],
    cons: ["Web version aggressively pushes app downloads", "Over-moderation leads to frequent false bans", "No text or voice mode"],
    verdict: "Good if you want a very clean environment and don't mind installing an app. The web experience is intentionally degraded.",
    accentFrom: "from-teal-500",
    accentTo: "to-cyan-500",
    borderColor: "border-teal-500/20",
    bgColor: "bg-teal-500/5",
    isWinner: false,
  },
  {
    rank: 9,
    name: "CooMeet",
    badge: "#9",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "Premium Paid — Not a True Alternative",
    quote: "High-quality but extremely expensive and charges per minute.",
    pros: ["High-quality HD video streaming", "Guaranteed female match algorithm"],
    cons: ["Extremely expensive — charges per minute", "Not a true Omegle alternative — it's a paid dating service", "Zero free usage after trial"],
    verdict: "Only consider this if you want a paid video dating experience. It is the opposite of what Omegle users want — anonymous, free, and spontaneous.",
    accentFrom: "from-slate-400",
    accentTo: "to-gray-500",
    borderColor: "border-slate-500/20",
    bgColor: "bg-slate-500/5",
    isWinner: false,
  },
  {
    rank: 10,
    name: "Monkey",
    badge: "#10",
    badgeColor: "bg-white/10 text-gray-300 border-white/20",
    tagline: "Popular with Gen Z — But Requires Login",
    quote: "Social-first video chat popular on TikTok, but far from anonymous.",
    pros: ["Large Gen Z user base", "Active and growing community", "Clean modern interface"],
    cons: ["Requires social media login — no anonymity", "App required on mobile", "Too social-media-like for Omegle users"],
    verdict: "Popular with younger users but fundamentally different from Omegle. Requires login, social profiles, and an app download — the opposite of frictionless.",
    accentFrom: "from-pink-500",
    accentTo: "to-fuchsia-500",
    borderColor: "border-pink-500/20",
    bgColor: "bg-pink-500/5",
    isWinner: false,
  },
];

const FAQS = [
  { question: "What is the closest site to Omegle in 2026?", answer: "Vidibro is the closest free alternative to Omegle in 2026 — same instant random matching with zero registration, but with voice-only mode, text chat with read receipts, AI moderation, and mobile-first design. Omegle shut down in November 2023 after 14 years." },
  { question: "Why did Omegle shut down?", answer: "Omegle shut down on November 8, 2023. Founder Leif K-Brooks cited mounting legal pressure over lack of content moderation and the personal stress of running the platform. After 14 years and millions of daily users, it closed permanently." },
  { question: "Are sites like Omegle safe in 2026?", answer: "Safety varies significantly between platforms. Vidibro uses real-time AI moderation, a one-tap report button that ends the call immediately, and P2P WebRTC connections that mean no video or audio passes through any server. Sites with no moderation (like Omegle was by the end) are genuinely risky." },
  { question: "Do I have to pay to use these Omegle alternatives?", answer: "Vidibro is 100% free with no coin system, no premium tier, and no credit card required. Several others on this list (Chatrandom, Shagle, CooMeet) lock their best features behind a paywall. CooMeet charges per minute." },
  { question: "Is there an Omegle alternative without registration?", answer: "Yes — Vidibro, Chatroulette, Bazoocam, Camsurf, and Shagle all work without registration. OmeTV and Monkey require a social media login. Vidibro requires nothing — open the page and you're matched in seconds." },
  { question: "Which Omegle alternative has the most users in 2026?", answer: "Vidibro and OmeTV have the largest active user bases among the true Omegle alternatives in 2026. Vidibro's no-login model attracts users from 180+ countries with 24-hour active queues." },
  { question: "Can I use an Omegle alternative on my phone?", answer: "Vidibro works in any mobile browser (Safari on iPhone, Chrome on Android) with no app download. Camsurf has a mobile app but degrades the web experience to force installs. Bazoocam has no mobile optimization at all." },
];

const RELATED = [
  { href: "/omegle-alternative", label: "Omegle Alternative" },
  { href: "/chatroulette-alternative", label: "Chatroulette Alternative" },
  { href: "/ometv-alternative", label: "OmeTV Alternative" },
  { href: "/emerald-chat-alternative", label: "Emerald Chat Alternative" },
  { href: "/camsurf-alternative", label: "Camsurf Alternative" },
  { href: "/free-video-chat", label: "Free Video Chat" },
  { href: "/free-random-video-chat", label: "Free Random Video Chat" },
  { href: "/random-text-chat", label: "Random Text Chat" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : i - 0.5 === rating ? "text-yellow-400 fill-yellow-400/50" : "text-gray-600"}
        />
      ))}
    </div>
  );
}

type Props = { faqs: Array<{ question: string; answer: string }> };

export default function SitesLikeOmegleContent({ faqs }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-14">

        {/* Hero */}
        <div className="text-center flex flex-col items-center gap-5 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 px-4 py-1.5 text-xs font-extrabold text-yellow-300 uppercase tracking-widest">
            <Trophy size={12} /> Reviewed & Ranked — September 2026
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Top 10 Sites Like Omegle<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              in 2026 — Ranked & Reviewed
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
            Omegle is gone forever. We tested 40+ random chat sites so you don't have to.
            Here are the only 10 worth your time — and one clear winner.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-1">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-white text-base transition-all shadow-lg shadow-purple-900/40"
            >
              Try Vidibro — #1 Pick, Free
            </button>
            <button
              onClick={() => router.push("/free-video-chat")}
              className="px-8 py-3.5 rounded-xl bg-white/8 border border-white/15 hover:bg-white/12 font-semibold text-white text-base transition-all"
            >
              Free Video Chat
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-2xl border border-white/8 bg-white/4 py-4 px-3">
              <span className="text-2xl font-black text-white">{value}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        {/* Why trust us */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <ShieldCheck size={18} />
            </span>
            <h2 className="text-lg font-black text-white">Why Trust This Review?</h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Since Omegle shut down in November 2023, hundreds of copycat sites flooded the internet — many filled with bots, paywalls, or malware. We personally tested 40+ random video chat platforms in 2026 and evaluated each on three criteria: <strong className="text-white">Connection Speed</strong>, <strong className="text-white">User Safety</strong>, and <strong className="text-white">Genuinely Free Features</strong>. Only 10 passed all three.
          </p>
        </div>

        {/* Comparison table */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-white">Quick Comparison Table</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/4">
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Rank</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Site</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Cost</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Login</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-semibold">Video</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-semibold">Voice</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-semibold">Text</th>
                  <th className="text-center px-3 py-3 text-gray-400 font-semibold">Mobile</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.site} className={`border-b border-white/5 ${i === 0 ? "bg-purple-500/10" : "hover:bg-white/3"} transition-colors`}>
                    <td className="px-4 py-3 font-bold text-gray-400">
                      {i === 0 ? <span className="text-yellow-400">★ #1</span> : `#${i + 1}`}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">{row.site}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.cost === "Free" ? "bg-emerald-500/15 text-emerald-400" : row.cost === "Paid" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>
                        {row.cost}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{row.login}</td>
                    <td className="px-3 py-3 text-center">{row.video ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-gray-600 mx-auto" />}</td>
                    <td className="px-3 py-3 text-center">{row.voice ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-gray-600 mx-auto" />}</td>
                    <td className="px-3 py-3 text-center">{row.text ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-gray-600 mx-auto" />}</td>
                    <td className="px-3 py-3 text-center">{row.mobile ? <CheckCircle2 size={14} className="text-emerald-400 mx-auto" /> : <XCircle size={14} className="text-gray-600 mx-auto" />}</td>
                    <td className="px-4 py-3"><Stars rating={row.rating} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full reviews */}
        <div className="flex flex-col gap-5">
          <h2 className="text-xl sm:text-2xl font-black text-white">The Full Top 10 Reviews</h2>
          {SITES.map((site) => (
            <div
              key={site.name}
              className={`rounded-2xl border ${site.borderColor} ${site.bgColor} p-6 flex flex-col gap-5 ${site.isWinner ? "ring-1 ring-purple-500/30" : ""}`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {site.badge && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${site.badgeColor}`}>
                        {site.badge}
                      </span>
                    )}
                    {site.isWinner && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 flex items-center gap-1">
                        <Trophy size={10} /> Editor's Choice 2026
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white">{site.name}</h3>
                  <p className="text-sm text-gray-400 font-medium">{site.tagline}</p>
                </div>
                <Stars rating={COMPARISON[site.rank - 1].rating} />
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-300 italic border-l-2 border-white/20 pl-4">"{site.quote}"</p>

              {/* Pros/Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pros</p>
                  {site.pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      {p}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Cons</p>
                  {site.cons.map((c) => (
                    <div key={c} className="flex items-start gap-2 text-sm text-gray-300">
                      <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verdict */}
              <div className="rounded-xl bg-white/5 border border-white/8 px-4 py-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Our Verdict</p>
                <p className="text-sm text-gray-300 leading-relaxed">{site.verdict}</p>
              </div>

              {/* CTA for #1 only */}
              {site.isWinner && (
                <button
                  onClick={() => router.push(site.ctaHref!)}
                  className={`w-full sm:w-auto self-start px-6 py-3 rounded-xl bg-gradient-to-r ${site.accentFrom} ${site.accentTo} hover:opacity-90 font-bold text-white text-sm transition-all shadow-lg`}
                >
                  {site.cta} →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Final verdict banner */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-8 flex flex-col items-center gap-4 text-center">
          <Trophy size={32} className="text-yellow-400" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">The Verdict Is Clear</h2>
          <p className="text-gray-300 max-w-xl leading-relaxed">
            After testing all 10 sites, <strong className="text-white">Vidibro is the only platform</strong> that is 100% free, requires no login, has three chat modes, zero bots, and works on any device without an app. Don't waste time — start chatting in seconds.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold text-white text-base transition-all shadow-lg shadow-purple-900/40"
          >
            Start Free on Vidibro — No Signup
          </button>
        </div>

        {/* FAQ */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
              <HelpCircle size={18} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Frequently Asked Questions</h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>

        {/* Related links */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-400 uppercase tracking-widest">Also Explore</h2>
          <div className="flex flex-wrap gap-2">
            {RELATED.map(({ href, label }) => (
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
