"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/vibe-room/PostCard";
import NewDropForm from "@/components/vibe-room/NewDropForm";
import AuthModal from "@/components/vibe-room/AuthModal";
import ZoneChat from "@/components/vibe-room/ZoneChat";
import HeartChat from "@/components/vibe-room/HeartChat";
import { MOCK_DROPS } from "@/lib/vibe-room/mock-data";
import type { SecretDrop, VibeUser } from "@/lib/vibe-room/types";

type Mode = null | "drop" | "crash";

export default function SecretDropPage() {
  const [mode, setMode] = useState<Mode>(null);
  const [drops, setDrops] = useState<SecretDrop[]>(MOCK_DROPS);
  const [user, setUser] = useState<VibeUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [replyDropId, setReplyDropId] = useState<string | null>(null);

  function handleAuthSuccess(u: { id: string; username: string; email: string }) {
    setUser({ ...u, createdAt: new Date() });
    setShowAuth(false);
  }

  function handleNewDrop(content: string) {
    const newDrop: SecretDrop = {
      id: Date.now().toString(),
      content,
      authorId: user?.id ?? null,
      redFlags: 0,
      greenFlags: 0,
      replyCount: 0,
      createdAt: new Date(),
    };
    setDrops((prev) => [newDrop, ...prev]);
  }

  // Full screen Secret Msg Drop
  if (mode === "drop") {
    return (
      <div className="fixed inset-0 bg-black text-white z-50 flex flex-col overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setMode(null)} className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              ← Back
            </button>
            <span className="text-zinc-700">/</span>
            <span className="text-sm text-white font-medium">💌 Secret Msg Drop</span>
            {user && (
              <div className="ml-auto flex items-center gap-2 py-1 px-3 bg-zinc-900 border border-zinc-800 rounded-full">
                <div className="w-4 h-4 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-xs text-zinc-400">@{user.username}</span>
                <button onClick={() => setUser(null)} className="text-xs text-zinc-600 hover:text-zinc-400">sign out</button>
              </div>
            )}
          </div>

          <div className="mb-1">
            <h1 className="text-2xl font-bold mb-1">Secret Msg Drop</h1>
            <p className="text-zinc-500 text-sm">Anonymous. Honest. No judgement.</p>
          </div>

          <div className="mb-6 mt-4">
            <NewDropForm isLoggedIn={!!user} onAuthRequired={() => setShowAuth(true)} onSubmit={handleNewDrop} />
          </div>

          {!user && (
            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 h-px bg-zinc-800" />
              <button onClick={() => setShowAuth(true)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">
                Sign in to post or reply →
              </button>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
          )}

          <div className="flex flex-col gap-3 mb-6">
            {drops.map((drop) => (
              <PostCard key={drop.id} drop={drop} isLoggedIn={!!user} onReply={setReplyDropId} onAuthRequired={() => setShowAuth(true)} />
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4 mb-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">Live Chat</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
          <ZoneChat
            user={user}
            onAuthRequired={() => setShowAuth(true)}
            zone="default"
            initialMessages={[
              { id: "c1", authorName: "amber_static", content: "the one about Spotify 💀 too real", isBot: false, createdAt: new Date(Date.now() - 60000 * 5) },
              { id: "c2", authorName: "quiet_moth", content: "fr who is saving seats with no explanation 😭", isBot: false, createdAt: new Date(Date.now() - 60000 * 2) },
            ]}
          />
        </div>

        {replyDropId && (
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 z-40">
            <div className="max-w-2xl mx-auto flex gap-2">
              <input autoFocus placeholder="Write a reply..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500" />
              <button onClick={() => setReplyDropId(null)} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-black hover:bg-zinc-100 transition-colors">Send</button>
              <button onClick={() => setReplyDropId(null)} className="px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-300 transition-colors">×</button>
            </div>
          </div>
        )}

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      </div>
    );
  }

  // Full screen Find Your Crash
  if (mode === "crash") {
    return (
      <>
        <HeartChat
          user={user}
          onAuthRequired={() => setShowAuth(true)}
          initialMessages={[
            { id:"h1", authorName:"rose_phantom", content:"finally a place that feels safe 💕", isBot:false, createdAt: new Date(Date.now() - 60000*6) },
            { id:"h2", authorName:"velvet_note",  content:"sending love to whoever needs it 🫶", isBot:false, createdAt: new Date(Date.now() - 60000*2) },
          ]}
          fullScreen
          onBack={() => setMode(null)}
        />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      </>
    );
  }

  // Hub — two option cards
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/vibe-room" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Vibe Room
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-medium">💌 Secret Drop</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Secret Drop</h1>
          <p className="text-zinc-500 text-sm">Pick your vibe. Stay anonymous.</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Secret Msg Drop card */}
          <button
            onClick={() => setMode("drop")}
            className="group w-full text-left rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-all overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💌</span>
                    <h2 className="text-lg font-semibold text-white">Secret Msg Drop</h2>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Drop an anonymous secret. React to others. No names, no shame.
                  </p>
                  <div className="flex gap-2 mt-3">
                    {["anonymous","text chat","reactions"].map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">{t}</span>
                    ))}
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-300 transition-colors text-xl mt-1">→</span>
              </div>
            </div>
          </button>

          {/* Find Your Crash card */}
          <button
            onClick={() => setMode("crash")}
            className="group w-full text-left rounded-2xl overflow-hidden transition-all"
            style={{ background: "linear-gradient(135deg, #c0184f 0%, #8a0f37 100%)", border: "1px solid rgba(255,100,150,0.3)" }}
          >
            <div className="p-6" style={{ position: "relative" }}>
              {/* Mini hearts decoration */}
              <div style={{ position:"absolute", right:20, top:10, opacity:0.35, fontSize:28, lineHeight:1 }}>💕</div>
              <div style={{ position:"absolute", right:50, bottom:12, opacity:0.25, fontSize:18, lineHeight:1 }}>💗</div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">💘</span>
                    <h2 className="text-lg font-semibold text-white">Find Your Crash</h2>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color:"rgba(255,255,255,0.7)" }}>
                    Anonymous heart-to-heart chat. Confess, connect, feel seen.
                  </p>
                  <div className="flex gap-2 mt-3">
                    {["anonymous","live chat","heart vibes"].map(t => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background:"rgba(0,0,0,0.25)", color:"rgba(255,255,255,0.6)" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xl mt-1 transition-colors" style={{ color:"rgba(255,255,255,0.5)" }}>→</span>
              </div>
            </div>
          </button>
        </div>
      </main>
      <Footer />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
    </div>
  );
}
