"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/vibe-room/AuthModal";
import ZoneChat from "@/components/vibe-room/ZoneChat";
import { NIGHT_OWL_PROMPTS } from "@/lib/vibe-room/mock-data";
import type { NightOwlMood, VibeUser } from "@/lib/vibe-room/types";

const MOODS: { key: NightOwlMood; label: string; emoji: string; color: string; ring: string; bg: string }[] = [
  { key: "chill",     label: "Chill",     emoji: "🌙", color: "text-blue-300",  ring: "border-blue-500/50",  bg: "bg-blue-950/30"  },
  { key: "flirt",     label: "Flirt",     emoji: "💘", color: "text-pink-300",  ring: "border-pink-500/50",  bg: "bg-pink-950/30"  },
  { key: "deep-talk", label: "Deep Talk", emoji: "🧠", color: "text-amber-300", ring: "border-amber-500/50", bg: "bg-amber-950/20" },
];

const MOOD_DOT: Record<NightOwlMood, string> = {
  chill: "bg-blue-400",
  flirt: "bg-pink-400",
  "deep-talk": "bg-amber-400",
};

const INITIAL_MESSAGES = [
  { id: "nc1", authorName: "neon_ghost",   content: "this chill mode is immaculate rn 🌙", isBot: false, createdAt: new Date(Date.now() - 60000 * 4) },
  { id: "nc2", authorName: "sleepy_panda", content: "someone bring up deep talk pls 🧠",    isBot: false, createdAt: new Date(Date.now() - 60000 * 1) },
];

export default function NightOwlPage() {
  const [mood, setMood] = useState<NightOwlMood>("chill");
  const [user, setUser] = useState<VibeUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [suggested, setSuggested] = useState("");

  const activeMood = MOODS.find((m) => m.key === mood)!;
  const prompts = NIGHT_OWL_PROMPTS.filter((p) => p.mood === mood);

  function handlePromptClick(text: string) {
    if (!user) { setShowAuth(true); return; }
    setSuggested(text);
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link href="/vibe-room" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Vibe Room
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-medium">🌙 Night Owl</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Night Owl</h1>
          <p className="text-zinc-500 text-sm">Late-night chill + flirt zone. Pick your mood.</p>
        </div>

        {/* Mood switcher */}
        <div className="flex gap-2 flex-wrap">
          {MOODS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                mood === m.key
                  ? `${m.bg} ${m.ring} ${m.color}`
                  : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}

          {user ? (
            <div className="ml-auto flex items-center gap-2 py-1.5 px-3 bg-zinc-900 border border-zinc-800 rounded-full">
              <div className={`w-2 h-2 rounded-full ${MOOD_DOT[mood]}`} />
              <span className="text-xs text-zinc-400">@{user.username}</span>
              <button onClick={() => setUser(null)} className="text-xs text-zinc-600 hover:text-zinc-400">sign out</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 rounded-full border border-zinc-800 hover:border-zinc-700"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Prompt cards — tap to use as chat starter */}
        <div>
          <p className="text-xs text-zinc-600 mb-2 uppercase tracking-wider font-medium">Tonight's prompts — tap to chat</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePromptClick(p.text)}
                className={`shrink-0 max-w-[220px] text-left px-4 py-3 rounded-2xl border text-sm leading-snug transition-all
                  ${activeMood.bg} ${activeMood.ring} ${activeMood.color} hover:brightness-125`}
              >
                {p.text}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <ZoneChat
          user={user}
          onAuthRequired={() => setShowAuth(true)}
          zone="default"
          initialMessages={INITIAL_MESSAGES}
          suggestedInput={suggested}
          onSuggestedInputConsumed={() => setSuggested("")}
        />

      </main>

      <Footer />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={(u) => { setUser({ ...u, createdAt: new Date() }); setShowAuth(false); }}
        />
      )}
    </div>
  );
}
