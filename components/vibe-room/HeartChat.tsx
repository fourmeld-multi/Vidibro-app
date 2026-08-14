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

interface HeartChatProps {
  user: VibeUser | null;
  onAuthRequired: () => void;
  initialMessages?: ChatMessage[];
  fullScreen?: boolean;
}

const BOT_REPLIES = [
  "sending love 💕", "omg same 🥺", "ur not alone here", "felt that fr",
  "this space is safe ❤️", "we see you 🫶", "that's so real", "💌",
];

const HEART_STICKERS = ["💕", "💗", "💘", "💝", "🥰", "😍", "💌", "🫶", "❤️", "💓"];

export default function HeartChat({ user, onAuthRequired, initialMessages = [], fullScreen = false }: HeartChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addMessage(content: string) {
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

    if (Math.random() < 0.35) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-bot",
            authorName: "heart_bot",
            content: BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
            isBot: true,
            createdAt: new Date(),
          },
        ]);
      }, 900 + Math.random() * 700);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addMessage(input);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ position: "relative" }}>
      {/* Heart background */}
      <div style={{
        position: "absolute", inset: 0, background: "#c0184f", overflow: "hidden", zIndex: 0,
      }}>
        {/* Wavy layers */}
        <svg viewBox="0 0 400 600" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} preserveAspectRatio="xMidYMid slice">
          <path d="M0 120 Q100 80 200 120 Q300 160 400 120 L400 0 L0 0 Z" fill="#a0103f" />
          <path d="M0 580 Q100 540 200 580 Q300 620 400 580 L400 600 L0 600 Z" fill="#a0103f" />
          {/* Heart outlines scattered */}
          {[
            [60, 160], [180, 80], [320, 220], [80, 380], [250, 460],
            [140, 300], [350, 380], [30, 490], [300, 100], [200, 330],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx},${cy})`} opacity="0.4">
              <path d="M0,-14 C-8,-22 -20,-22 -20,-10 C-20,2 0,16 0,16 C0,16 20,2 20,-10 C20,-22 8,-22 0,-14 Z"
                fill="none" stroke="#e0305a" strokeWidth="1.5" />
            </g>
          ))}
          {/* Small solid hearts */}
          {[
            [120, 200], [280, 150], [50, 300], [330, 480], [170, 520],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx},${cy}) scale(0.5)`} opacity="0.5">
              <path d="M0,-14 C-8,-22 -20,-22 -20,-10 C-20,2 0,16 0,16 C0,16 20,2 20,-10 C20,-22 8,-22 0,-14 Z"
                fill="#a0103f" />
            </g>
          ))}
        </svg>

        {/* Floating paper hearts */}
        {[
          { left: "72%", top: "-4%", size: 52, delay: "0s" },
          { left: "76%", top: "18%", size: 40, delay: "0.4s" },
          { left: "8%",  top: "62%", size: 60, delay: "0.8s" },
          { left: "12%", top: "78%", size: 44, delay: "0.2s" },
        ].map((h, i) => (
          <div key={i} style={{
            position: "absolute", left: h.left, top: h.top,
            animation: `floatHeart 4s ease-in-out ${h.delay} infinite alternate`,
          }}>
            {/* String */}
            <div style={{ width: "1.5px", height: "28px", background: "rgba(255,255,255,0.6)", margin: "0 auto" }} />
            {/* Paper heart SVG */}
            <svg width={h.size} height={h.size} viewBox="0 0 60 60">
              <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 C24,10 28,14 30,18 C32,14 36,10 40,8 C48,4 56,10 56,20 C56,36 30,52 30,52 Z"
                fill="#f093a8" />
              <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 L30,18 L30,52 Z"
                fill="#f4b8c8" opacity="0.9" />
            </svg>
          </div>
        ))}

        <style>{`
          @keyframes floatHeart {
            from { transform: translateY(0px) rotate(-3deg); }
            to   { transform: translateY(10px) rotate(3deg); }
          }
        `}</style>
      </div>

      {/* Chat UI over background */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(0,0,0,0.2)",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b95", display: "inline-block", boxShadow: "0 0 6px #ff6b95" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Secret Chat</span>
        </div>

        {/* Messages */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 4,
          padding: "12px", height: fullScreen ? "calc(100vh - 220px)" : 200, overflowY: "auto",
          scrollbarWidth: "none",
        }}>
          {messages.length === 0 && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: "auto" }}>
              whisper something... 💕
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, flexShrink: 0,
                color: m.isBot ? "#ffb3c6" : "rgba(255,255,255,0.7)",
              }}>
                {m.authorName === user?.username ? "you" : m.authorName}
              </span>
              <span style={{ fontSize: 13, color: "#fff", wordBreak: "break-word", minWidth: 0 }}>
                {m.content}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Sticker tray */}
        {showStickers && (
          <div style={{
            display: "flex", gap: 6, padding: "8px 12px", flexWrap: "wrap",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(0,0,0,0.2)",
          }}>
            {HEART_STICKERS.map((s) => (
              <button key={s} onClick={() => addMessage(s)}
                style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", transition: "transform 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          display: "flex", gap: 8, padding: "8px 12px",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(0,0,0,0.25)",
        }}>
          <button
            type="button"
            onClick={() => { if (!user) { onAuthRequired(); return; } setShowStickers(v => !v); }}
            style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", opacity: showStickers ? 1 : 0.6, flexShrink: 0 }}
          >💕</button>
          <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => { if (!user) onAuthRequired(); }}
              placeholder={user ? "whisper something..." : "sign in to chat"}
              maxLength={200}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: 13, color: "#fff",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || !user}
              style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 20,
                background: "rgba(255,255,255,0.2)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
                opacity: (!input.trim() || !user) ? 0.3 : 1,
              }}
            >Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
