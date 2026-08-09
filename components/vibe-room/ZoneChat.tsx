"use client";

import { useState, useRef, useEffect } from "react";
import type { VibeUser } from "@/lib/vibe-room/types";

interface ChatMessage {
  id: string;
  authorName: string;
  content: string;
  isBot?: boolean;
  createdAt: Date;
}

interface ZoneChatProps {
  user: VibeUser | null;
  onAuthRequired: () => void;
  zone: string;
  initialMessages?: ChatMessage[];
  suggestedInput?: string;
  onSuggestedInputConsumed?: () => void;
}

const STICKERS = ["😂", "🔥", "💀", "😭", "🫶", "👀", "💯", "🤝", "😤", "🫠"];

const BOT_REACTIONS: Record<string, string[]> = {
  game: ["gg wp 🤝", "no way 💀", "that was clean fr", "bot diff 🤖", "rematch??"],
  default: ["facts 💯", "lmaooo 😂", "fr fr", "no cap", "vibe check passed 🔥"],
};

export default function ZoneChat({ user, onAuthRequired, zone, initialMessages = [], suggestedInput, onSuggestedInputConsumed }: ZoneChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (suggestedInput) {
      if (!user) { onAuthRequired(); return; }
      setInput(suggestedInput);
      onSuggestedInputConsumed?.();
    }
  }, [suggestedInput]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addMessage(content: string, isSticker = false) {
    if (!user) { onAuthRequired(); return; }
    if (!content.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      authorName: user.username,
      content,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setShowStickers(false);

    // Occasional bot reaction (30% chance)
    if (Math.random() < 0.3) {
      const pool = zone === "game" ? BOT_REACTIONS.game : BOT_REACTIONS.default;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-bot",
            authorName: "night_bot",
            content: pool[Math.floor(Math.random() * pool.length)],
            isBot: true,
            createdAt: new Date(),
          },
        ]);
      }, 900 + Math.random() * 800);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMessage(input);
  }

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-zinc-500 font-medium">Live Chat</span>
      </div>

      {/* Message list */}
      <div className="flex flex-col gap-1 px-3 py-3 h-48 overflow-y-auto scrollbar-none">
        {messages.length === 0 && (
          <p className="text-xs text-zinc-700 text-center mt-auto">No messages yet. Say something 👋</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="flex items-baseline gap-1.5 min-w-0">
            <span className={`text-[11px] font-semibold shrink-0 ${m.isBot ? "text-violet-400" : "text-zinc-400"}`}>
              {m.authorName === user?.username ? "you" : m.authorName}
            </span>
            <span className="text-[13px] text-zinc-200 break-words min-w-0">{m.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Sticker tray */}
      {showStickers && (
        <div className="flex gap-1.5 px-3 pb-2 flex-wrap border-t border-zinc-800 pt-2">
          {STICKERS.map((s) => (
            <button
              key={s}
              onClick={() => addMessage(s, true)}
              className="text-xl hover:scale-125 transition-transform"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 px-3 py-2 flex gap-2">
        <button
          type="button"
          onClick={() => {
            if (!user) { onAuthRequired(); return; }
            setShowStickers((v) => !v);
          }}
          className={`text-lg shrink-0 transition-transform hover:scale-110 ${showStickers ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
          title="Stickers"
        >
          😊
        </button>
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { if (!user) onAuthRequired(); }}
            placeholder={user ? "Say something..." : "Sign in to chat"}
            maxLength={200}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none min-w-0"
          />
          <button
            type="submit"
            disabled={!input.trim() || !user}
            className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-30"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
