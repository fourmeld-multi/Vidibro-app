"use client";

import { useState, useRef, useEffect } from "react";

type Status = "idle" | "searching" | "connected" | "disconnected";

interface ChatMessage {
  id: string;
  from: "me" | "stranger" | "system";
  content: string;
  createdAt: Date;
}

interface HeartChatProps {
  fullScreen?: boolean;
  onBack?: () => void;
}

const HEART_STICKERS = ["💕", "💗", "💘", "💝", "🥰", "😍", "💌", "🫶", "❤️", "💓"];

const STRANGER_REPLIES = [
  "omg same 🥺", "sending love 💕", "ur not alone here", "felt that fr",
  "this space feels safe ❤️", "we see you 🫶", "that's so real", "💌",
  "honestly same", "i feel u", "🥹", "no cap fr",
];

const HeartBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    <svg viewBox="0 0 800 900" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} preserveAspectRatio="xMidYMid slice">
      {[
        [80,200],[200,120],[380,280],[500,150],[650,300],
        [100,450],[300,520],[500,480],[700,420],[180,650],
        [400,700],[600,650],[250,800],[550,780],[750,700],
      ].map(([cx,cy],i) => (
        <g key={i} transform={`translate(${cx},${cy})`} opacity="0.45">
          <path d="M0,-18 C-10,-28 -26,-28 -26,-13 C-26,3 0,20 0,20 C0,20 26,3 26,-13 C26,-28 10,-28 0,-18 Z" fill="none" stroke="#f4a0b8" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
    {[
      { right:"6%",  top:"3%",  size:60, delay:"0s"   },
      { right:"14%", top:"24%", size:42, delay:"0.5s" },
      { left:"4%",   top:"52%", size:66, delay:"0.9s" },
      { left:"8%",   top:"70%", size:46, delay:"0.3s" },
      { right:"5%",  top:"63%", size:38, delay:"1.2s" },
    ].map((h, i) => (
      <div key={i} style={{ position:"absolute", ...(h.left ? {left:h.left} : {right:h.right}), top:h.top, animation:`hcFloat 4s ease-in-out ${h.delay} infinite alternate` }}>
        <div style={{ width:"1.5px", height:"24px", background:"rgba(255,255,255,0.45)", margin:"0 auto" }} />
        <svg width={h.size} height={h.size} viewBox="0 0 60 60">
          <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 C24,10 28,14 30,18 C32,14 36,10 40,8 C48,4 56,10 56,20 C56,36 30,52 30,52 Z" fill="#f093a8" />
          <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 L30,18 L30,52 Z" fill="#f4b8c8" opacity="0.9" />
        </svg>
      </div>
    ))}
    <style>{`
      @keyframes hcFloat { from{transform:translateY(0) rotate(-3deg)} to{transform:translateY(12px) rotate(3deg)} }
      @keyframes hcPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      @keyframes hcSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    `}</style>
  </div>
);

export default function HeartChat({ fullScreen = false, onBack }: HeartChatProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showStickers, setShowStickers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); }, []);

  function startSearch() {
    setStatus("searching");
    setMessages([]);
    searchTimerRef.current = setTimeout(() => {
      setStatus("connected");
      setMessages([{ id: "sys-conn", from: "system", content: "crush found 💘 say something", createdAt: new Date() }]);
    }, 2000 + Math.random() * 2000);
  }

  function disconnect() {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setStatus("disconnected");
    setMessages(prev => [...prev, { id: "sys-disc", from: "system", content: "crush disconnected", createdAt: new Date() }]);
  }

  function sendMessage(content: string) {
    if (!content.trim() || status !== "connected") return;
    setMessages(prev => [...prev, { id: Date.now().toString(), from: "me", content, createdAt: new Date() }]);
    setInput("");
    setShowStickers(false);
    if (Math.random() < 0.5) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "-s",
          from: "stranger",
          content: STRANGER_REPLIES[Math.floor(Math.random() * STRANGER_REPLIES.length)],
          createdAt: new Date(),
        }]);
      }, 800 + Math.random() * 1200);
    }
  }

  const canChat = status === "connected";

  const searchingBlock = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", animation: "hcPulse 2s ease-in-out infinite" }}>
        <span style={{ fontSize: 32 }}>💘</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 600, fontSize: 15, color: "#fff", marginBottom: 4 }}>Finding your crush...</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>anonymous · no judgement · send love 💕</p>
      </div>
    </div>
  );

  const idleBlock = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32 }}>💘</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 600, fontSize: 15, color: "#fff", marginBottom: 4 }}>Find Your Crush</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>anonymous · no judgement · send love 💕</p>
      </div>
    </div>
  );

  const content = (
    <>
      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "rgba(0,0,0,0.28)", borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: 13, display: "flex", alignItems: "center", gap: 4, padding: 0 }}>
            ← Back
          </button>
        )}
        {onBack && <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: status === "connected" ? "#4ade80" : status === "searching" ? "#fbbf24" : "#6b7280", boxShadow: status === "connected" ? "0 0 6px #4ade80" : undefined, flexShrink: 0 }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#fff" }}>
            {status === "searching" ? "Finding your crush..." : status === "connected" ? "Crush connected 💘" : status === "disconnected" ? "Crush left 💔" : "Find Your Crush"}
          </span>
        </div>
        {status === "connected" && (
          <button onClick={disconnect} style={{ marginLeft: "auto", fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>
            Skip
          </button>
        )}
      </div>

      {/* Messages or idle/searching */}
      {(status === "idle") && <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>{idleBlock}</div>}
      {(status === "searching") && <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>{searchingBlock}</div>}
      {(status === "connected" || status === "disconnected") && (
        <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "none" }}>
          {messages.map((m) => {
            if (m.from === "system") return (
              <div key={m.id} style={{ textAlign: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", background: "rgba(0,0,0,0.2)", padding: "3px 12px", borderRadius: 20 }}>{m.content}</span>
              </div>
            );
            const isMe = m.from === "me";
            return (
              <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "72%", padding: "9px 14px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: isMe ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)",
                  border: isMe ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  fontSize: 14, color: "#fff", wordBreak: "break-word",
                }}>
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Find New Crush button */}
      {(status === "idle" || status === "disconnected") && (
        <div style={{ position: "relative", zIndex: 1, padding: "12px 20px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <button onClick={startSearch} style={{ padding: "12px 36px", borderRadius: 28, background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            💘 {status === "disconnected" ? "Find New Crush" : "Find Your Crush"}
          </button>
        </div>
      )}

      {/* Sticker tray */}
      {showStickers && canChat && (
        <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 8, padding: "10px 20px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
          {HEART_STICKERS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)}
              style={{ fontSize: 22, background: "none", border: "none", cursor: "pointer", transition: "transform 0.1s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 10, padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", flexShrink: 0, alignItems: "center" }}>
        <button type="button" onClick={() => canChat && setShowStickers(v => !v)}
          style={{ fontSize: 20, background: "none", border: "none", cursor: canChat ? "pointer" : "default", opacity: canChat ? (showStickers ? 1 : 0.6) : 0.3, flexShrink: 0 }}>
          💕
        </button>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{ flex: 1, display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.1)", borderRadius: 24, padding: "8px 16px", border: "1px solid rgba(255,255,255,0.15)" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!canChat}
            placeholder={status === "searching" ? "Finding your crush..." : status === "connected" ? "whisper something..." : "press Find to connect"}
            maxLength={200}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#fff", opacity: canChat ? 1 : 0.5 }}
          />
          <button type="submit" disabled={!input.trim() || !canChat}
            style={{ fontSize: 13, padding: "5px 16px", borderRadius: 20, background: "rgba(255,255,255,0.25)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", opacity: (!input.trim() || !canChat) ? 0.3 : 1, flexShrink: 0 }}>
            Send
          </button>
        </form>
      </div>
    </>
  );

  if (fullScreen) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", background: "#c0184f" }}>
        <HeartBackground />
        {content}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", borderRadius: "1rem", overflow: "hidden", display: "flex", flexDirection: "column", background: "#c0184f" }}>
      <HeartBackground />
      {content}
    </div>
  );
}
