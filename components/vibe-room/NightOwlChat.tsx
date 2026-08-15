"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";

type ChatStatus = "mood-pick" | "searching" | "connected" | "disconnected";
type Mood = "sad" | "boring" | "romantic" | "chill" | "flirty";

interface ChatMessage {
  id: string;
  from: "me" | "stranger" | "system";
  text?: string;
  sticker?: string;
  createdAt: Date;
}

interface NightOwlChatProps {
  fullScreen?: boolean;
  onBack?: () => void;
}

const MOODS: Array<{ id: Mood; emoji: string; label: string; hint: string; color: string; bg: string }> = [
  { id: "sad",      emoji: "😢", label: "Sad",      hint: "someone who gets it",     color: "#818cf8", bg: "rgba(99,102,241,0.15)"  },
  { id: "boring",   emoji: "😴", label: "Boring",   hint: "let's kill the boredom",  color: "#a78bfa", bg: "rgba(139,92,246,0.15)"  },
  { id: "romantic", emoji: "🌹", label: "Romantic", hint: "a night to remember",      color: "#f472b6", bg: "rgba(236,72,153,0.15)"  },
  { id: "chill",    emoji: "😎", label: "Chill",    hint: "low-key good vibes",       color: "#2dd4bf", bg: "rgba(20,184,166,0.15)"  },
  { id: "flirty",   emoji: "😏", label: "Flirty",   hint: "let's be bold tonight",    color: "#c084fc", bg: "rgba(168,85,247,0.15)"  },
];

const MOOD_CONFIG: Record<Mood, {
  searchText: string;
  connectMsg: string;
  starterMsg: string;
  placeholder: string;
  replies: string[];
}> = {
  sad: {
    searchText: "Finding someone who gets it",
    connectMsg: "Partner is having a low night 🌙 be their comfort",
    starterMsg: "Hey, not doing so great tonight. Just needed someone to talk to...",
    placeholder: "share what's on your mind...",
    replies: ["same here 🌙", "felt that", "you're not alone 💙", "here for u", "tell me more", "i feel u fr"],
  },
  boring: {
    searchText: "Finding someone to vibe with",
    connectMsg: "Partner is bored tonight 😴 make their night interesting!",
    starterMsg: "Honestly so bored rn, what's good? 😴",
    placeholder: "say something random...",
    replies: ["lol same 😴", "so bored omg", "tell me something weird", "let's talk nonsense 💀", "plot twist: same energy"],
  },
  romantic: {
    searchText: "Finding your romantic match",
    connectMsg: "Partner is in a romantic mood 🌹 make it magical",
    starterMsg: "The night is so beautiful... glad I'm not alone tonight 🌹",
    placeholder: "whisper something sweet...",
    replies: ["omg same 🌹", "the night is perfect ✨", "tell me more...", "💘", "you're sweet", "stargazing tonight?"],
  },
  chill: {
    searchText: "Finding a chill night owl",
    connectMsg: "Partner wants to chill 😎 just vibe together",
    starterMsg: "Just chilling with good music, what about you? 😎🌙",
    placeholder: "just vibe...",
    replies: ["good vibes 🌙", "same fr", "just vibing", "no rush at all", "😎 chill night", "this is nice"],
  },
  flirty: {
    searchText: "Finding a flirty night owl",
    connectMsg: "Partner is feeling flirty 😏 your move!",
    starterMsg: "Heyy night owl... what are you up to? 😏",
    placeholder: "be bold...",
    replies: ["😏 oh really", "haha okay then", "you're fun ngl", "tell me more 😉", "🔥", "cute for that"],
  },
};

const STICKERS = [
  { id: "moon",  emoji: "🌙" }, { id: "stars", emoji: "✨" }, { id: "owl",   emoji: "🦉" },
  { id: "night", emoji: "🌃" }, { id: "coffee",emoji: "☕" }, { id: "fire",  emoji: "🔥" },
  { id: "music", emoji: "🎵" }, { id: "cozy",  emoji: "🛋️"  }, { id: "wink",  emoji: "😉" },
  { id: "smirk", emoji: "😏" }, { id: "blush", emoji: "🥰" }, { id: "chill", emoji: "😎" },
];

const STARS = [
  { left: "8%",  top: "12%", s: 2, d: "0s",   t: "3s"   },
  { left: "22%", top: "5%",  s: 1, d: "0.5s", t: "2.5s" },
  { left: "45%", top: "8%",  s: 2, d: "1s",   t: "4s"   },
  { left: "70%", top: "3%",  s: 2, d: "0.3s", t: "3.5s" },
  { left: "88%", top: "15%", s: 2, d: "1.5s", t: "2.8s" },
  { left: "5%",  top: "35%", s: 1, d: "0.8s", t: "3.2s" },
  { left: "92%", top: "40%", s: 2, d: "0.2s", t: "4.5s" },
  { left: "15%", top: "60%", s: 1, d: "1.2s", t: "3s"   },
  { left: "55%", top: "55%", s: 2, d: "0.6s", t: "2.7s" },
  { left: "80%", top: "65%", s: 2, d: "0.9s", t: "3.8s" },
  { left: "30%", top: "80%", s: 1, d: "1.4s", t: "3.3s" },
  { left: "65%", top: "85%", s: 2, d: "0.4s", t: "4.2s" },
  { left: "10%", top: "90%", s: 1, d: "1.8s", t: "2.6s" },
  { left: "75%", top: "20%", s: 1, d: "0.7s", t: "3.9s" },
  { left: "40%", top: "30%", s: 2, d: "1.6s", t: "2.4s" },
];

const NightBackground = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
    {STARS.map((s, i) => (
      <div key={i} style={{
        position: "absolute", left: s.left, top: s.top,
        width: s.s * 2, height: s.s * 2, borderRadius: "50%",
        background: "#ffffff",
        animation: `owlStar ${s.t} ease-in-out ${s.d} infinite alternate`,
        opacity: 0.4,
      }} />
    ))}
    <div style={{ position: "absolute", right: "6%", top: "4%", fontSize: 32, opacity: 0.1 }}>🌙</div>
    <div style={{ position: "absolute", left: "4%", top: "22%", fontSize: 20, opacity: 0.08 }}>🌟</div>
    <div style={{ position: "absolute", right: "10%", top: "48%", fontSize: 16, opacity: 0.07 }}>✨</div>
    <div style={{ position: "absolute", left: "7%", top: "72%", fontSize: 18, opacity: 0.07 }}>🌙</div>
    <style>{`
      @keyframes owlStar  { from{opacity:0.1} to{opacity:0.75} }
      @keyframes owlPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
      @keyframes owlDot1  { 0%,20%{opacity:0} 40%,100%{opacity:1} }
      @keyframes owlDot2  { 0%,40%{opacity:0} 60%,100%{opacity:1} }
      @keyframes owlDot3  { 0%,60%{opacity:0} 80%,100%{opacity:1} }
      @keyframes owlRing  { 0%{transform:scale(1);opacity:0.55} 100%{transform:scale(2.8);opacity:0} }
      @keyframes owlRing2 { 0%{transform:scale(1);opacity:0.3}  100%{transform:scale(2.2);opacity:0} }
    `}</style>
  </div>
);

export default function NightOwlChat({ fullScreen = false, onBack }: NightOwlChatProps) {
  const [chatStatus, setChatStatus]   = useState<ChatStatus>("mood-pick");
  const [mood, setMood]               = useState<Mood | null>(null);
  const [messages, setMessages]       = useState<ChatMessage[]>([]);
  const [draft, setDraft]             = useState("");
  const [stickersOpen, setStickersOpen] = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => () => { if (searchTimer.current) clearTimeout(searchTimer.current); }, []);

  const moodData = mood ? MOODS.find(m => m.id === mood)! : null;
  const moodCfg  = mood ? MOOD_CONFIG[mood] : null;
  const accent   = moodData?.color ?? "#a78bfa";

  function selectMood(m: Mood) {
    setMood(m);
    setMessages([]);
    setChatStatus("searching");
    setStickersOpen(false);
    const cfg = MOOD_CONFIG[m];
    searchTimer.current = setTimeout(() => {
      setChatStatus("connected");
      setMessages([
        { id: "sys-conn",  from: "system",   text: cfg.connectMsg, createdAt: new Date() },
        { id: "sys-start", from: "stranger", text: cfg.starterMsg, createdAt: new Date() },
      ]);
    }, 1800 + Math.random() * 2000);
  }

  function endChat() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setChatStatus("disconnected");
    setMessages([]);
  }

  function cancelSearch() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setChatStatus("mood-pick");
    setMood(null);
  }

  function findSameMood() {
    if (mood) selectMood(mood);
  }

  function changeMood() {
    setChatStatus("mood-pick");
    setMood(null);
    setMessages([]);
  }

  function sendText(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || chatStatus !== "connected") return;
    addMsg({ from: "me", text: draft.trim() });
    setDraft("");
  }

  function sendSticker(emoji: string) {
    if (chatStatus !== "connected") return;
    addMsg({ from: "me", sticker: emoji });
    setStickersOpen(false);
  }

  function addMsg(payload: { from: "me" | "stranger" | "system"; text?: string; sticker?: string }) {
    const msg: ChatMessage = { id: Date.now().toString(), ...payload, createdAt: new Date() };
    setMessages(prev => [...prev, msg]);
    if (payload.from === "me" && mood && Math.random() < 0.65) {
      const replies = MOOD_CONFIG[mood].replies;
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + "-r",
          from: "stranger",
          text: replies[Math.floor(Math.random() * replies.length)],
          createdAt: new Date(),
        }]);
      }, 900 + Math.random() * 1400);
    }
  }

  const bgGrad = moodData
    ? `linear-gradient(160deg, #080820 0%, #0d0828 55%, ${moodData.bg.replace("0.15", "0.09")} 100%)`
    : "linear-gradient(160deg, #080820 0%, #0d0828 100%)";

  // ── Header ─────────────────────────────────────────────────────────────
  const header = (
    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "rgba(0,0,0,0.45)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={chatStatus === "connected" ? onBack : chatStatus === "searching" ? cancelSearch : chatStatus === "disconnected" ? changeMood : onBack}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.55)", fontSize: 18, lineHeight: 1, padding: "0 4px 0 0" }}
        >←</button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🦉</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Night Owl</span>
            {moodData && (
              <span style={{ fontSize: 11, padding: "1px 8px", borderRadius: 12, background: `${moodData.color}25`, color: moodData.color, border: `1px solid ${moodData.color}45`, fontWeight: 600 }}>
                {moodData.emoji} {moodData.label}
              </span>
            )}
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {chatStatus === "mood-pick"     && "pick your vibe"}
            {chatStatus === "searching"     && "finding your match..."}
            {chatStatus === "connected"     && "night owl connected 🌙"}
            {chatStatus === "disconnected"  && "owl flew away"}
          </span>
        </div>
      </div>
      {chatStatus === "searching" && (
        <button onClick={cancelSearch} style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      )}
      {chatStatus === "connected" && (
        <button onClick={endChat} style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>End</button>
      )}
    </div>
  );

  // ── Mood Picker ─────────────────────────────────────────────────────────
  const moodPicker = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", gap: 20, position: "relative", zIndex: 1, overflowY: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🦉</div>
        <p style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 6 }}>What&apos;s your mood tonight?</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>we&apos;ll match you with someone who feels the same</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 340 }}>
        {MOODS.map(m => (
          <button
            key={m.id}
            onClick={() => selectMood(m.id)}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 16, border: `1px solid ${m.color}35`, background: m.bg, cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = m.color + "80"; (e.currentTarget as HTMLElement).style.transform = "scale(1.01)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = m.color + "35"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            <span style={{ fontSize: 28, flexShrink: 0 }}>{m.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{m.hint}</div>
            </div>
            <span style={{ color: m.color, fontSize: 16, flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Searching ───────────────────────────────────────────────────────────
  const searchingView = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 32, position: "relative", zIndex: 1 }}>
      <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${accent}70`, animation: "owlRing 2s ease-out 0s infinite" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${accent}38`, animation: "owlRing2 2s ease-out 0.7s infinite" }} />
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${accent}18`, border: `2px solid ${accent}55`, display: "flex", alignItems: "center", justifyContent: "center", animation: "owlPulse 2s ease-in-out infinite", zIndex: 1 }}>
          <span style={{ fontSize: 28 }}>{moodData?.emoji ?? "🦉"}</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {moodCfg?.searchText ?? "Searching"}
          <span style={{ animation: "owlDot1 1.2s ease-in-out infinite", opacity: 0 }}>.</span>
          <span style={{ animation: "owlDot2 1.2s ease-in-out infinite", opacity: 0 }}>.</span>
          <span style={{ animation: "owlDot3 1.2s ease-in-out infinite", opacity: 0 }}>.</span>
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          anonymous · {moodData?.label.toLowerCase() ?? "night"} vibes · owls only
        </p>
      </div>
    </div>
  );

  // ── Messages ────────────────────────────────────────────────────────────
  const messagesView = (
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "none", position: "relative", zIndex: 1 }}>
      {messages.map(m => {
        if (m.from === "system") return (
          <div key={m.id} style={{ textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "rgba(0,0,0,0.3)", padding: "3px 14px", borderRadius: 20 }}>{m.text}</span>
          </div>
        );
        const isMe = m.from === "me";
        return (
          <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
            {m.sticker ? (
              <span style={{ fontSize: 46, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>{m.sticker}</span>
            ) : (
              <div style={{
                maxWidth: "75%", padding: "9px 14px", fontSize: 14, color: "#fff", wordBreak: "break-word",
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: isMe ? `${accent}28` : "rgba(255,255,255,0.07)",
                border: isMe ? `1px solid ${accent}45` : "1px solid rgba(255,255,255,0.08)",
              }}>{m.text}</div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );

  // ── Disconnected ────────────────────────────────────────────────────────
  const disconnectedView = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "32px 20px", position: "relative", zIndex: 1 }}>
      <span style={{ fontSize: 44 }}>🌙</span>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 4 }}>Owl flew away 👋</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>the night&apos;s not over though</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280, marginTop: 8 }}>
        {moodData && (
          <button onClick={findSameMood} style={{ padding: "12px 24px", borderRadius: 28, background: accent, color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: `0 4px 14px ${accent}40` }}>
            {moodData.emoji} Same mood again
          </button>
        )}
        <button onClick={changeMood} style={{ padding: "11px 24px", borderRadius: 28, background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
          Change mood
        </button>
      </div>
    </div>
  );

  // ── Sticker drawer ──────────────────────────────────────────────────────
  const stickerDrawer = stickersOpen && chatStatus === "connected" && (
    <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.45)", flexShrink: 0 }}>
      {STICKERS.map(s => (
        <button key={s.id} onClick={() => sendSticker(s.emoji)}
          style={{ fontSize: 24, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 6, cursor: "pointer" }}
        >{s.emoji}</button>
      ))}
    </div>
  );

  // ── Input bar ───────────────────────────────────────────────────────────
  const canChat = chatStatus === "connected";
  const inputBar = chatStatus !== "mood-pick" && chatStatus !== "disconnected" && (
    <div style={{ position: "relative", zIndex: 1, padding: "10px 12px", paddingBottom: "max(10px, env(safe-area-inset-bottom, 0px))", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
      <form onSubmit={sendText} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          type="button"
          onClick={() => { if (!canChat) return; setStickersOpen(v => !v); }}
          disabled={!canChat}
          style={{ width: 38, height: 38, borderRadius: "50%", background: stickersOpen ? accent : "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", cursor: canChat ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: canChat ? 1 : 0.35, fontSize: 18 }}
        >🎭</button>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          disabled={!canChat}
          onFocus={() => setStickersOpen(false)}
          placeholder={canChat ? (moodCfg?.placeholder ?? "say something...") : "finding your match..."}
          maxLength={300}
          style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: `1px solid ${canChat ? accent + "30" : "rgba(255,255,255,0.1)"}`, borderRadius: 24, padding: "9px 16px", fontSize: 14, color: "#fff", outline: "none", opacity: canChat ? 1 : 0.45 }}
        />
        {draft.trim() ? (
          <button type="submit" disabled={!canChat} style={{ width: 38, height: 38, borderRadius: "50%", background: accent, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Send size={16} color="#fff" />
          </button>
        ) : (
          <button type="button" disabled={!canChat} style={{ width: 38, height: 38, borderRadius: "50%", background: accent, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: canChat ? 1 : 0.35 }}>
            <Mic size={16} color="#fff" />
          </button>
        )}
      </form>
    </div>
  );

  const content = (
    <>
      {header}
      {chatStatus === "mood-pick"    && moodPicker}
      {chatStatus === "searching"    && searchingView}
      {chatStatus === "connected"    && messagesView}
      {chatStatus === "disconnected" && disconnectedView}
      {stickerDrawer}
      {inputBar}
    </>
  );

  if (fullScreen) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", background: bgGrad, paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <NightBackground />
        {content}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", background: bgGrad, height: "100%", overflow: "hidden" }}>
      <NightBackground />
      {content}
    </div>
  );
}
