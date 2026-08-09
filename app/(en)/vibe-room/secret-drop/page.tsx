"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/vibe-room/PostCard";
import NewDropForm from "@/components/vibe-room/NewDropForm";
import AuthModal from "@/components/vibe-room/AuthModal";
import ZoneChat from "@/components/vibe-room/ZoneChat";
import { MOCK_DROPS } from "@/lib/vibe-room/mock-data";
import type { SecretDrop, VibeUser } from "@/lib/vibe-room/types";

export default function SecretDropPage() {
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

  function handleReply(dropId: string) {
    setReplyDropId(dropId);
  }

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

        <div className="mb-2">
          <h1 className="text-2xl font-bold mb-1">Secret Drop</h1>
          <p className="text-zinc-500 text-sm">Anonymous. Honest. No judgement.</p>
        </div>

        {user && (
          <div className="flex items-center gap-2 mb-4 py-2 px-3 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
            <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-xs">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-xs text-zinc-400">@{user.username}</span>
            <button onClick={() => setUser(null)} className="text-xs text-zinc-600 hover:text-zinc-400 ml-1">
              sign out
            </button>
          </div>
        )}

        <div className="mb-6">
          <NewDropForm
            isLoggedIn={!!user}
            onAuthRequired={() => setShowAuth(true)}
            onSubmit={handleNewDrop}
          />
        </div>

        {!user && (
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <button
              onClick={() => setShowAuth(true)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap"
            >
              Sign in to post or reply →
            </button>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {drops.map((drop) => (
            <PostCard
              key={drop.id}
              drop={drop}
              isLoggedIn={!!user}
              onReply={handleReply}
              onAuthRequired={() => setShowAuth(true)}
            />
          ))}
        </div>

        {/* Divider between Posts and Chat */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">Live Chat</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Zone chat — separate from drops */}
        <div className="mb-24">
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
              <input
                autoFocus
                placeholder="Write a reply..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              <button
                onClick={() => setReplyDropId(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white text-black hover:bg-zinc-100 transition-colors"
              >
                Send
              </button>
              <button
                onClick={() => setReplyDropId(null)}
                className="px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
