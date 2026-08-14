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
  onBack?: () => void;
}

const BOT_REPLIES = [
  "sending love 💕", "omg same 🥺", "ur not alone here", "felt that fr",
  "this space is safe ❤️", "we see you 🫶", "that's so real", "💌",
];

const HEART_STICKERS = ["💕", "💗", "💘", "💝", "🥰", "😍", "💌", "🫶", "❤️", "💓"];

const HeartBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <svg viewBox="0 0 800 900" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.22 }} preserveAspectRatio="xMidYMid slice">
      <path d="M0 180 Q200 120 400 180 Q600 240 800 180 L800 0 L0 0 Z" fill="#a0103f" />
      <path d="M0 850 Q200 790 400 850 Q600 910 800 850 L800 900 L0 900 Z" fill="#a0103f" />
      {[
        [80,200],[200,120],[380,280],[500,150],[650,300],
        [100,450],[300,520],[500,480],[700,420],[180,650],
        [400,700],[600,650],[250,800],[550,780],[750,700],
      ].map(([cx,cy],i) => (
        <g key={i} transform={`translate(${cx},${cy})`} opacity="0.4">
          <path d="M0,-18 C-10,-28 -26,-28 -26,-13 C-26,3 0,20 0,20 C0,20 26,3 26,-13 C26,-28 10,-28 0,-18 Z" fill="none" stroke="#e0305a" strokeWidth="1.5" />
        </g>
      ))}
      {[[150,350],[420,400],[680,350],[300,600],[580,560]].map(([cx,cy],i) => (
        <g key={i} transform={`translate(${cx},${cy}) scale(0.45)`} opacity="0.35">
          <path d="M0,-18 C-10,-28 -26,-28 -26,-13 C-26,3 0,20 0,20 C0,20 26,3 26,-13 C26,-28 10,-28 0,-18 Z" fill="#a0103f" />
        </g>
      ))}
    </svg>

    {[
      { right:"6%",  top:"3%",  size:64, delay:"0s"   },
      { right:"14%", top:"22%", size:46, delay:"0.5s" },
      { left:"4%",   top:"52%", size:70, delay:"0.9s" },
      { left:"8%",   top:"70%", size:50, delay:"0.3s" },
      { right:"5%",  top:"62%", size:42, delay:"1.2s" },
    ].map((h, i) => (
      <div key={i} style={{ position:"absolute", ...(h.left ? {left:h.left} : {right:h.right}), top:h.top, animation:`hcFloat 4s ease-in-out ${h.delay} infinite alternate` }}>
        <div style={{ width:"1.5px", height:"28px", background:"rgba(255,255,255,0.5)", margin:"0 auto" }} />
        <svg width={h.size} height={h.size} viewBox="0 0 60 60">
          <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 C24,10 28,14 30,18 C32,14 36,10 40,8 C48,4 56,10 56,20 C56,36 30,52 30,52 Z" fill="#f093a8" />
          <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 L30,18 L30,52 Z" fill="#f4b8c8" opacity="0.9" />
        </svg>
      </div>
    ))}

    <style>{`@keyframes hcFloat { from{transform:translateY(0) rotate(-3deg)} to{transform:translateY(12px) rotate(3deg)} }`}</style>
  </div>
);

export default function HeartChat({ user, onAuthRequired, initialMessages = [], fullScreen = false, onBack }: HeartChatProps) {
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

  // Full screen: true chat app layout — edge to edge, header + messages + input
  if (fullScreen) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "#c0184f" }}>
        <HeartBackground />

        {/* Header */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "rgba(0,0,0,0.25)", borderBottom: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 13, padding: "4px 0", display: "flex", alignItems: "center", gap: 4 }}>
              ← Back
            </button>
          )}
          {onBack && <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>/</span>}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b95", boxShadow: "0 0 6px #ff6b95", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>💘 Find Your Crash</span>
          </div>
          {user && (
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>@{user.username}</span>
              <button onClick={() => {}} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>sign out</button>
            </div>
          )}
        </div>

        {/* Subtitle */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "10px 0 4px", flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>anonymous · no judgement · send love 💕</span>
        </div>

        {/* Messages */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", padding: "12px 20px", display: "flex", flexDirection: "column", gap: 6, scrollbarWidth: "none" }}>
          {messages.length === 0 && (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "auto" }}>
              whisper something... 💕
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, flexShrink: 0, color: m.isBot ? "#ffb3c6" : "rgba(255,255,255,0.65)" }}>
                {m.authorName === user?.username ? "you" : m.authorName}
              </span>
              <span style={{ fontSize: 14, color: "#fff", wordBreak: "break-word", minWidth: 0 }}>
                {m.content}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Sticker tray */}
        {showStickers && (
          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 8, padding: "10px 20px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
            {HEART_STICKERS.map((s) => (
              <button key={s} onClick={() => addMessage(s)}
                style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", transition: "transform 0.1s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 10, padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.3)", flexShrink: 0, alignItems: "center" }}>
          <button
            type="button"
            onClick={() => { if (!user) { onAuthRequired(); return; } setShowStickers(v => !v); }}
            style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", opacity: showStickers ? 1 : 0.6, flexShrink: 0 }}
          >💕</button>
          <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.1)", borderRadius: 24, padding: "8px 16px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => { if (!user) onAuthRequired(); }}
              placeholder={user ? "whisper something..." : "sign in to chat"}
              maxLength={200}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || !user}
              style={{ fontSize: 13, padding: "5px 16px", borderRadius: 20, background: "rgba(255,255,255,0.25)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", opacity: (!input.trim() || !user) ? 0.3 : 1, flexShrink: 0 }}
            >Send</button>
          </form>
        </div>
      </div>
    );
  }

  // Widget (non-full-screen) — compact card with own background
  return (
    <div className="rounded-2xl overflow-hidden" style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "#c0184f", overflow: "hidden", zIndex: 0 }}>
        <svg viewBox="0 0 400 600" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }} preserveAspectRatio="xMidYMid slice">
          {[[60,160],[180,80],[320,220],[80,380],[250,460],[140,300],[350,380],[30,490],[300,100],[200,330]].map(([cx,cy],i) => (
            <g key={i} transform={`translate(${cx},${cy})`} opacity="0.4">
              <path d="M0,-14 C-8,-22 -20,-22 -20,-10 C-20,2 0,16 0,16 C0,16 20,2 20,-10 C20,-22 8,-22 0,-14 Z" fill="none" stroke="#e0305a" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.2)" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6b95", display: "inline-block", boxShadow: "0 0 6px #ff6b95" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Secret Chat</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px", height: 200, overflowY: "auto", scrollbarWidth: "none" }}>
          {messages.length === 0 && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: "auto" }}>whisper something... 💕</p>
          )}
          {messages.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, flexShrink: 0, color: m.isBot ? "#ffb3c6" : "rgba(255,255,255,0.7)" }}>
                {m.authorName === user?.username ? "you" : m.authorName}
              </span>
              <span style={{ fontSize: 13, color: "#fff", wordBreak: "break-word", minWidth: 0 }}>{m.content}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {showStickers && (
          <div style={{ display: "flex", gap: 6, padding: "8px 12px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.2)" }}>
            {HEART_STICKERS.map((s) => (
              <button key={s} onClick={() => addMessage(s)} style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>{s}</button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)" }}>
          <button type="button" onClick={() => { if (!user) { onAuthRequired(); return; } setShowStickers(v => !v); }} style={{ fontSize: 18, background: "none", border: "none", cursor: "pointer", opacity: showStickers ? 1 : 0.6, flexShrink: 0 }}>💕</button>
          <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onFocus={() => { if (!user) onAuthRequired(); }} placeholder={user ? "whisper something..." : "sign in to chat"} maxLength={200} style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#fff" }} />
            <button type="submit" disabled={!input.trim() || !user} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", opacity: (!input.trim() || !user) ? 0.3 : 1 }}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
