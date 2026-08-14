"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Sticker as StickerIcon, Camera, ImageIcon, Plus, Send, Mic, Video } from "lucide-react";

type Status = "idle" | "searching" | "connected" | "disconnected";

interface ChatMessage {
  id: string;
  from: "me" | "stranger" | "system";
  text?: string;
  sticker?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  createdAt: Date;
}

interface HeartChatProps {
  fullScreen?: boolean;
  onBack?: () => void;
}

const HEART_STICKERS = [
  { id: "heart",   emoji: "💕", label: "Love" },
  { id: "rose",    emoji: "🌹", label: "Rose" },
  { id: "kiss",    emoji: "😘", label: "Kiss" },
  { id: "hug",     emoji: "🤗", label: "Hug" },
  { id: "blush",   emoji: "🥰", label: "Smitten" },
  { id: "cupid",   emoji: "💘", label: "Cupid" },
  { id: "letter",  emoji: "💌", label: "Love Letter" },
  { id: "hands",   emoji: "🫶", label: "Heart Hands" },
  { id: "sparkle", emoji: "✨", label: "Sparkle" },
  { id: "cherry",  emoji: "🍒", label: "Cherry" },
  { id: "confetti",emoji: "🎊", label: "Confetti" },
  { id: "rainbow", emoji: "🌈", label: "Rainbow" },
];

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
      { right:"6%",  top:"8%",  size:56, delay:"0s"   },
      { right:"14%", top:"28%", size:40, delay:"0.5s" },
      { left:"4%",   top:"52%", size:62, delay:"0.9s" },
      { left:"8%",   top:"70%", size:44, delay:"0.3s" },
      { right:"5%",  top:"63%", size:36, delay:"1.2s" },
    ].map((h, i) => (
      <div key={i} style={{ position:"absolute", ...(h.left ? {left:h.left} : {right:h.right}), top:h.top, animation:`hcFloat 4s ease-in-out ${h.delay} infinite alternate` }}>
        <div style={{ width:"1.5px", height:"22px", background:"rgba(255,255,255,0.4)", margin:"0 auto" }} />
        <svg width={h.size} height={h.size} viewBox="0 0 60 60">
          <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 C24,10 28,14 30,18 C32,14 36,10 40,8 C48,4 56,10 56,20 C56,36 30,52 30,52 Z" fill="#f093a8" />
          <path d="M30,52 C30,52 4,36 4,20 C4,10 12,4 20,8 L30,18 L30,52 Z" fill="#f4b8c8" opacity="0.9" />
        </svg>
      </div>
    ))}
    <style>{`
      @keyframes hcFloat  { from{transform:translateY(0) rotate(-3deg)} to{transform:translateY(12px) rotate(3deg)} }
      @keyframes hcPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      @keyframes hcDot1   { 0%,20%{opacity:0}  40%,100%{opacity:1} }
      @keyframes hcDot2   { 0%,40%{opacity:0}  60%,100%{opacity:1} }
      @keyframes hcDot3   { 0%,60%{opacity:0}  80%,100%{opacity:1} }
      @keyframes hcRing   { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
      @keyframes hcRing2  { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2.2);opacity:0} }
      @keyframes hcRing3  { 0%{transform:scale(1);opacity:0.25}100%{transform:scale(1.7);opacity:0} }
    `}</style>
  </div>
);

export default function HeartChat({ fullScreen = false, onBack }: HeartChatProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [stickersOpen, setStickersOpen] = useState(false);
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [audioRecording, setAudioRecording] = useState(false);
  const [videoRecording, setVideoRecording] = useState(false);
  const [videoSeconds, setVideoSeconds] = useState(0);

  const bottomRef    = useRef<HTMLDivElement>(null);
  const listRef      = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const searchTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streamRef    = useRef<MediaStream | null>(null);
  const mediaRecRef  = useRef<MediaRecorder | null>(null);
  const recChunks    = useRef<Blob[]>([]);
  const videoTimer   = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => { if (searchTimer.current) clearTimeout(searchTimer.current); }, []);

  function startSearch() {
    setStatus("searching");
    setMessages([]);
    searchTimer.current = setTimeout(() => {
      setStatus("connected");
      setMessages([{ id: "sys-conn", from: "system", text: "crush found 💘 say hi!", createdAt: new Date() }]);
    }, 2000 + Math.random() * 2000);
  }

  function cancelSearch() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setStatus("idle");
  }

  function endChat() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setStatus("disconnected");
    setMessages(prev => [...prev, { id: "sys-disc", from: "system", text: "crush disconnected 💔", createdAt: new Date() }]);
  }

  function sendText(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || status !== "connected") return;
    addOutgoing({ text: draft.trim() });
    setDraft("");
  }

  function sendSticker(emoji: string) {
    if (status !== "connected") return;
    addOutgoing({ sticker: emoji });
    setStickersOpen(false);
  }

  // ── Audio recording (hold to record) ──────────────────────────────
  async function startAudio() {
    if (status !== "connected") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recChunks.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) recChunks.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(recChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        addOutgoing({ audioUrl: url });
      };
      mr.start();
      mediaRecRef.current = mr;
      setAudioRecording(true);
    } catch { alert("Microphone access denied"); }
  }

  function stopAudio() {
    mediaRecRef.current?.stop();
    mediaRecRef.current = null;
    setAudioRecording(false);
  }

  // ── 30-sec video recording ─────────────────────────────────────────
  async function startVideoRec() {
    if (status !== "connected") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: true });
      streamRef.current = stream;
      if (liveVideoRef.current) liveVideoRef.current.srcObject = stream;
      recChunks.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) recChunks.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        const blob = new Blob(recChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        addOutgoing({ videoUrl: url });
        setVideoRecording(false);
        setVideoSeconds(0);
        if (videoTimer.current) clearInterval(videoTimer.current);
      };
      mr.start();
      mediaRecRef.current = mr;
      setVideoRecording(true);
      setVideoSeconds(0);
      let s = 0;
      videoTimer.current = setInterval(() => {
        s += 1;
        setVideoSeconds(s);
        if (s >= 30) stopVideoRec();
      }, 1000);
    } catch { alert("Camera/mic access denied"); }
  }

  function stopVideoRec() {
    if (videoTimer.current) clearInterval(videoTimer.current);
    mediaRecRef.current?.stop();
    mediaRecRef.current = null;
  }

  function addOutgoing(payload: { text?: string; sticker?: string; imageUrl?: string; audioUrl?: string; videoUrl?: string }) {
    const msg: ChatMessage = { id: Date.now().toString(), from: "me", ...payload, createdAt: new Date() };
    setMessages(prev => [...prev, msg]);
    if (Math.random() < 0.5) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + "-s",
          from: "stranger",
          text: STRANGER_REPLIES[Math.floor(Math.random() * STRANGER_REPLIES.length)],
          createdAt: new Date(),
        }]);
      }, 800 + Math.random() * 1200);
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) addOutgoing({ imageUrl: ev.target.result as string }); };
    reader.readAsDataURL(file);
    setAttachmentOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function openCamera() {
    setAttachmentOpen(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch { alert("Could not access camera"); }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    addOutgoing({ imageUrl: dataUrl });
    closeCamera();
  }

  const canChat = status === "connected";

  const header = (
    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "linear-gradient(90deg,#9b1239,#c0184f,#e91e63)", borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1, padding: "0 4px 0 0" }}>←</button>
        )}
        {/* Logo */}
        <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.35)", flexShrink: 0 }}>
          <Image src="/icon.png" alt="Vidibro" width={40} height={40} style={{ objectFit: "cover" }} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>Vidibro Chat</span>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: status === "connected" ? "#4ade80" : status === "searching" ? "#fbbf24" : "rgba(255,255,255,0.35)", display: "inline-block", flexShrink: 0 }} />
          </div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
            {status === "idle" && "Press Find to start"}
            {status === "searching" && "Finding your crush..."}
            {status === "connected" && "Crush connected 💘"}
            {status === "disconnected" && "Crush left 💔"}
          </span>
        </div>
      </div>
      {/* Right action */}
      {status === "searching" && (
        <button onClick={cancelSearch} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      )}
      {status === "connected" && (
        <button onClick={endChat} title="End chat" style={{ width: 36, height: 36, borderRadius: "50%", background: "#e53e3e", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(229,62,62,0.55)", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.5 11.5 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" transform="rotate(135 12 12)"/>
          </svg>
        </button>
      )}
    </div>
  );

  const searchingView = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 32, position: "relative", zIndex: 1 }}>
      <div style={{ position: "relative", width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)", animation: "hcRing 2s ease-out 0s infinite" }} />
        <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.35)", animation: "hcRing2 2s ease-out 0.6s infinite" }} />
        <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", animation: "hcRing3 2s ease-out 1.2s infinite" }} />
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", animation: "hcPulse 2s ease-in-out infinite", zIndex: 1 }}>
          <span style={{ fontSize: 28 }}>💘</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Finding your crush
          <span style={{ animation: "hcDot1 1.2s ease-in-out infinite", opacity: 0 }}>.</span>
          <span style={{ animation: "hcDot2 1.2s ease-in-out infinite", opacity: 0 }}>.</span>
          <span style={{ animation: "hcDot3 1.2s ease-in-out infinite", opacity: 0 }}>.</span>
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>anonymous · no judgement · send love 💕</p>
      </div>
    </div>
  );

  const idleView = (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 32, position: "relative", zIndex: 1 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32 }}>💘</span>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6 }}>Find Your Crush</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>anonymous · no judgement · send love 💕</p>
      </div>
    </div>
  );

  const messagesView = (
    <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "none", position: "relative", zIndex: 1 }}>
      {messages.map((m) => {
        if (m.from === "system") return (
          <div key={m.id} style={{ textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.2)", padding: "3px 14px", borderRadius: 20 }}>{m.text}</span>
          </div>
        );
        const isMe = m.from === "me";
        return (
          <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
            {m.sticker ? (
              <span style={{ fontSize: 52, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}>{m.sticker}</span>
            ) : m.imageUrl ? (
              <div style={{ maxWidth: "72%", borderRadius: 16, overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.2)" }}>
                <img src={m.imageUrl} alt="Shared" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
              </div>
            ) : m.audioUrl ? (
              <div style={{ background: isMe ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.25)", borderRadius: 16, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Mic size={14} color="rgba(255,255,255,0.7)" />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Voice message</span>
                </div>
                <audio src={m.audioUrl} controls style={{ height: 32, width: 200, accentColor: "#ec4899" }} />
              </div>
            ) : m.videoUrl ? (
              <div style={{ maxWidth: "75%", borderRadius: 16, overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)" }}>
                <video src={m.videoUrl} controls style={{ width: "100%", maxHeight: 280, display: "block", background: "#000" }} />
                <div style={{ background: "rgba(0,0,0,0.4)", padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Video size={12} color="rgba(255,255,255,0.6)" />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>30s video</span>
                </div>
              </div>
            ) : (
              <div style={{
                maxWidth: "75%", padding: "9px 14px", fontSize: 14, color: "#fff", wordBreak: "break-word",
                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: isMe ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)",
                border: isMe ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.1)",
              }}>{m.text}</div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );

  // Find New Crush bar (disconnected / idle)
  const findBar = (status === "idle" || status === "disconnected") && (
    <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", flexShrink: 0 }}>
      <button onClick={startSearch} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 32px", borderRadius: 28, background: "linear-gradient(90deg,#ec4899,#d946ef)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 2px 12px rgba(236,72,153,0.45)" }}>
        <span style={{ fontSize: 16 }}>💘</span>
        {status === "disconnected" ? "Find New Crush" : "Find Your Crush"}
      </button>
    </div>
  );

  // Sticker drawer
  const stickerDrawer = stickersOpen && canChat && (
    <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", flexShrink: 0 }}>
      {HEART_STICKERS.map(s => (
        <button key={s.id} onClick={() => sendSticker(s.emoji)} title={s.label}
          style={{ fontSize: 26, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: 6, cursor: "pointer", transition: "transform 0.1s" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.25)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >{s.emoji}</button>
      ))}
    </div>
  );

  // Attachment popup — Gallery, Voice, Video (camera is in the bar directly)
  const attachPopup = attachmentOpen && canChat && (
    <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 12, zIndex: 20, background: "rgba(20,5,15,0.96)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 2, backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <button onClick={() => { setAttachmentOpen(false); fileInputRef.current?.click(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        onMouseLeave={e => (e.currentTarget.style.background = "none")}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ImageIcon size={15} color="#fff" />
        </span>
        Gallery
      </button>
      <button onClick={() => { setAttachmentOpen(false); startVideoRec(); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 12, background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
        onMouseLeave={e => (e.currentTarget.style.background = "none")}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(251,146,60,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Video size={15} color="#fff" />
        </span>
        30s Video
      </button>
    </div>
  );

  // Input bar — WhatsApp style: mic when empty, send when typing; camera icon in bar
  const inputBar = (
    <div style={{ position: "relative", zIndex: 1, padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.3)", flexShrink: 0 }} onClick={() => setAttachmentOpen(false)}>
      {attachPopup}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
      <form onSubmit={sendText} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Sticker */}
        <button type="button" onClick={e => { e.stopPropagation(); if (!canChat) return; setAttachmentOpen(false); setStickersOpen(v => !v); }} disabled={!canChat} title="Stickers"
          style={{ width: 38, height: 38, borderRadius: "50%", background: stickersOpen ? "#ec4899" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: canChat ? 1 : 0.4 }}>
          <StickerIcon size={18} color="#fff" />
        </button>
        {/* + Attachment */}
        <button type="button" onClick={e => { e.stopPropagation(); if (!canChat) return; setStickersOpen(false); setAttachmentOpen(v => !v); }} disabled={!canChat} title="Attach"
          style={{ width: 38, height: 38, borderRadius: "50%", background: attachmentOpen ? "#a855f7" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: canChat ? 1 : 0.4, transition: "transform 0.2s", transform: attachmentOpen ? "rotate(45deg)" : "none" }}>
          <Plus size={18} color="#fff" />
        </button>
        {/* Text input */}
        <input value={draft} onChange={e => setDraft(e.target.value)} disabled={!canChat} onFocus={() => { setAttachmentOpen(false); setStickersOpen(false); }}
          placeholder={status === "searching" ? "Finding your crush..." : canChat ? "whisper something..." : "press Find to connect"}
          maxLength={300}
          style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 24, padding: "9px 16px", fontSize: 14, color: "#fff", outline: "none", opacity: canChat ? 1 : 0.5 }} />
        {/* Camera — always visible when no draft */}
        {!draft.trim() && (
          <button type="button" onClick={e => { e.stopPropagation(); if (!canChat) return; setAttachmentOpen(false); openCamera(); }} disabled={!canChat} title="Camera"
            style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: canChat ? 1 : 0.4 }}>
            <Camera size={18} color="#fff" />
          </button>
        )}
        {/* Mic (no draft) → Send (has draft) */}
        {draft.trim() ? (
          <button type="submit" disabled={!canChat} title="Send"
            style={{ width: 38, height: 38, borderRadius: "50%", background: "#ec4899", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
            <Send size={16} color="#fff" />
          </button>
        ) : (
          <button type="button"
            onPointerDown={e => { e.stopPropagation(); if (!canChat) return; audioRecording ? stopAudio() : startAudio(); }}
            disabled={!canChat} title={audioRecording ? "Stop & send" : "Hold to record"}
            style={{ width: 38, height: 38, borderRadius: "50%", background: audioRecording ? "#e53e3e" : "#ec4899", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: audioRecording ? "hcPulse 1s infinite" : undefined, transition: "background 0.15s" }}>
            <Mic size={18} color="#fff" />
          </button>
        )}
      </form>
    </div>
  );

  // Camera modal
  const cameraModal = showCamera && (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", maxWidth: 400, borderRadius: 16, background: "#000" }} />
      <div style={{ display: "flex", gap: 16 }}>
        <button onClick={capturePhoto} style={{ padding: "12px 28px", borderRadius: 28, background: "#ec4899", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>📸 Capture</button>
        <button onClick={closeCamera} style={{ padding: "12px 28px", borderRadius: 28, background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );

  const content = (
    <>
      {header}
      {status === "idle"       && idleView}
      {status === "searching"  && searchingView}
      {(status === "connected" || status === "disconnected") && messagesView}
      {findBar}
      {stickerDrawer}
      {inputBar}
      {cameraModal}
      {/* Live video recording overlay */}
      {videoRecording && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ color: "#fff", fontSize: 13, opacity: 0.7, letterSpacing: 1 }}>RECORDING</div>
          <video ref={liveVideoRef} autoPlay playsInline muted style={{ width: "100%", maxWidth: 360, borderRadius: 16, background: "#111", display: "block" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#e53e3e", animation: "hcPulse 1s infinite" }} />
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{30 - videoSeconds}s</span>
            </div>
            <button onClick={stopVideoRec} style={{ padding: "10px 28px", borderRadius: 28, background: "#e53e3e", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>Stop &amp; Send</button>
          </div>
        </div>
      )}
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
    <div style={{ position: "relative", display: "flex", flexDirection: "column", background: "#c0184f", borderRadius: "1rem", overflow: "hidden" }}>
      <HeartBackground />
      {content}
    </div>
  );
}
