"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { VibeUser } from "@/lib/vibe-room/types";
import type { MatchState, Stranger } from "@/hooks/useStranger";

interface Msg {
  id: string;
  author: string;
  text: string;
  ts: number;
}

interface Props {
  user: VibeUser | null;
  onAuthRequired: () => void;
  zone?: string;
  initialMessages?: { id: string; authorName: string; content: string; isBot?: boolean; createdAt: Date }[];
  matchState?: MatchState;
  stranger?: Stranger | null;
  elapsed?: number;
  onNext?: () => void;
  onClose?: () => void;
  noAuth?: boolean;
}

const STICKERS = ["😂","🔥","💀","😭","🫶","👀","💯","🤝","😤","🫠"];
const GREETINGS = ["hey 👋","gl hf 🎮","let's go 🔥","ready?","sup","gg in advance lol 😂"];
const COMMENTS  = ["nice move 👀","nah wait 💀","okay okay","ur actually good","lmaooo","rng diff","😭","bro really","that was clean","no way fr"];

export default function FloatingChat({
  user, onAuthRequired, zone = "game", initialMessages = [],
  matchState, stranger, elapsed = 0, onNext, onClose, noAuth = false,
}: Props) {
  const [open, setOpen]         = useState(false);
  const [unread, setUnread]     = useState(0);
  const [pos, setPos]           = useState({ x: 0, y: 0 });
  const [ready, setReady]       = useState(false);
  const [msgs, setMsgs]         = useState<Msg[]>(() =>
    initialMessages.map(m => ({ id: m.id, author: m.authorName, text: m.content, ts: m.createdAt.getTime() }))
  );
  const [input, setInput]       = useState("");
  const [showStickers, setShowStickers] = useState(false);

  const isDragging = useRef(false);
  const dragMoved  = useRef(false);
  const dragStart  = useRef({ px: 0, py: 0, ex: 0, ey: 0 });
  const bottomRef  = useRef<HTMLDivElement>(null);
  const openRef    = useRef(open);
  openRef.current  = open;

  useEffect(() => {
    setPos({ x: window.innerWidth - 72, y: window.innerHeight - 160 });
    setReady(true);
  }, []);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  // Stranger greeting on connect
  useEffect(() => {
    if (!stranger) return;
    const text = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    const t = setTimeout(() => {
      setMsgs(prev => [...prev, { id: "greet-" + Date.now(), author: stranger.username, text, ts: Date.now() }]);
      if (!openRef.current) setUnread(n => n + 1);
    }, 700);
    return () => clearTimeout(t);
  }, [stranger?.username]); // eslint-disable-line

  // Periodic comments from stranger during game
  useEffect(() => {
    if (matchState !== "connected" || !stranger) return;
    let t: ReturnType<typeof setTimeout>;
    function schedule() {
      t = setTimeout(() => {
        if (Math.random() < 0.55) {
          const text = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
          setMsgs(prev => [...prev, { id: "c-" + Date.now(), author: stranger!.username, text, ts: Date.now() }]);
          if (!openRef.current) setUnread(n => n + 1);
        }
        schedule();
      }, 35000 + Math.random() * 55000);
    }
    schedule();
    return () => clearTimeout(t);
  }, [matchState, stranger?.username]); // eslint-disable-line

  // ── Drag ────────────────────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    isDragging.current = true;
    dragMoved.current  = false;
    dragStart.current  = { px: e.clientX, py: e.clientY, ex: pos.x, ey: pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.px;
    const dy = e.clientY - dragStart.current.py;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragMoved.current = true;
    setPos({
      x: Math.max(28, Math.min(window.innerWidth  - 28, dragStart.current.ex + dx)),
      y: Math.max(28, Math.min(window.innerHeight - 28, dragStart.current.ey + dy)),
    });
  }
  function onPointerUp() {
    isDragging.current = false;
    if (!dragMoved.current) setOpen(o => !o);
  }

  // ── Send ─────────────────────────────────────────────────────────────────────
  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    if (!noAuth && !user) { onAuthRequired(); return; }
    const author = user?.username ?? "you";
    setMsgs(prev => [...prev, { id: Date.now().toString(), author, text, ts: Date.now() }]);
    setInput("");
    setShowStickers(false);
  }, [user, onAuthRequired, noAuth]);

  // ── Panel position ──────────────────────────────────────────────────────────
  const PANEL_W = 288, PANEL_H = 340;
  let panelLeft = pos.x - PANEL_W + 28;
  let panelTop  = pos.y - PANEL_H - 16;
  if (ready) {
    panelLeft = Math.max(8, Math.min(panelLeft, window.innerWidth - PANEL_W - 8));
    panelTop  = panelTop < 8 ? pos.y + 44 : panelTop;
  }

  // Header text based on match state
  const headerContent = () => {
    if (!matchState) return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Live Chat</span>
      </div>
    );
    if (matchState === "searching") return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", display: "inline-block", animation: "stranger-ping 1.2s ease-in-out infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>Finding stranger… {elapsed}s</span>
      </div>
    );
    if (matchState === "connected" && stranger) return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>@{stranger.username}</span>
      </div>
    );
    return (
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>— Disconnected</span>
    );
  };

  if (!ready) return null;

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", left: panelLeft, top: panelTop,
          width: PANEL_W, height: PANEL_H, zIndex: 9999,
          display: "flex", flexDirection: "column",
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18, boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", flexShrink: 0,
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            {headerContent()}
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 16, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {matchState === "searching" && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "auto 0" }}>
                Waiting for a stranger to connect…
              </p>
            )}
            {matchState === "closed" && msgs.length === 0 && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "auto 0" }}>
                — chat ended
              </p>
            )}
            {(!matchState || matchState !== "searching") && msgs.length === 0 && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", margin: "auto 0" }}>No messages yet 👋</p>
            )}
            {msgs.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                  color: (m.author === user?.username || m.author === "you") ? "#818cf8" : "rgba(255,255,255,0.4)",
                }}>
                  {(m.author === user?.username || m.author === "you") ? "you" : m.author}
                </span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", wordBreak: "break-word", minWidth: 0 }}>{m.text}</span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Sticker tray */}
          {showStickers && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
              {STICKERS.map(s => (
                <button key={s} onClick={() => send(s)}
                  style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input — disabled when not connected */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 12px", flexShrink: 0,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
            opacity: matchState && matchState !== "connected" ? 0.4 : 1,
            pointerEvents: matchState && matchState !== "connected" ? "none" : "auto",
          }}>
            <button onClick={() => { if (!noAuth && !user) { onAuthRequired(); return; } setShowStickers(v => !v); }}
              style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", opacity: showStickers ? 1 : 0.45, flexShrink: 0 }}>
              😊
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onFocus={() => { if (!noAuth && !user) onAuthRequired(); }}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(input); } }}
              placeholder="Say something…"
              maxLength={200}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 12, color: "rgba(255,255,255,0.9)" }}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || (!noAuth && !user)}
              style={{
                background: input.trim() && (noAuth || user) ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.06)",
                border: "none", borderRadius: 8, color: "white", fontSize: 11, fontWeight: 700,
                padding: "4px 10px", cursor: input.trim() && (noAuth || user) ? "pointer" : "default",
                opacity: input.trim() && (noAuth || user) ? 1 : 0.3, transition: "all 0.15s", flexShrink: 0,
              }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: "fixed",
          left: pos.x - 28, top: pos.y - 28,
          width: 56, height: 56, borderRadius: "50%",
          background: open
            ? "linear-gradient(135deg,#6366f1,#4f46e5)"
            : matchState === "closed"
              ? "rgba(30,41,59,0.5)"
              : "linear-gradient(135deg,#1e293b,#0f172a)",
          border: matchState === "searching"
            ? "2px solid rgba(245,158,11,0.5)"
            : "2px solid rgba(255,255,255,0.12)",
          boxShadow: open
            ? "0 4px 24px rgba(99,102,241,0.5)"
            : matchState === "connected"
              ? "0 4px 20px rgba(0,0,0,0.5), 0 0 0 0 rgba(52,211,153,0.4)"
              : "0 4px 20px rgba(0,0,0,0.5)",
          cursor: "grab", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, zIndex: 10000,
          transition: "background 0.2s, box-shadow 0.2s, border-color 0.2s",
          userSelect: "none", touchAction: "none",
        }}
      >
        💬
        {/* Unread badge */}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            minWidth: 18, height: 18, borderRadius: 9,
            background: "#ef4444", border: "2px solid #0f172a",
            fontSize: 10, fontWeight: 800, color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", lineHeight: 1,
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
        {/* Connected green dot (when no unread) */}
        {!open && matchState === "connected" && unread === 0 && (
          <span style={{
            position: "absolute", bottom: 1, right: 1,
            width: 11, height: 11, borderRadius: "50%",
            background: "#34d399", border: "2px solid #0f172a",
          }} />
        )}
        {/* Searching pulse ring */}
        {!open && matchState === "searching" && (
          <span style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            border: "2px solid rgba(245,158,11,0.4)",
            animation: "stranger-ping 1.4s ease-in-out infinite",
          }} />
        )}
      </button>

      <style>{`
        @keyframes stranger-ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}
