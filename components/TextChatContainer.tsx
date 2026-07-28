"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  X,
  SkipForward,
  PhoneOff,
  Camera,
  Image as ImageIcon,
  Sticker as StickerIcon,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";
import LogoMark from "@/components/LogoMark";
import type { ChatPayload, MessageType } from "@/lib/protocol";

const BEAUTIFUL_STICKERS = [
  { id: "unicorn", emoji: "🦄", label: "Magic Unicorn" },
  { id: "rocket", emoji: "🚀", label: "Cosmic Rocket" },
  { id: "crown", emoji: "👑", label: "Royal Crown" },
  { id: "diamond", emoji: "💎", label: "Sparkle Diamond" },
  { id: "cat", emoji: "🐱", label: "Cyber Cat" },
  { id: "alien", emoji: "👽", label: "Space Alien" },
  { id: "party", emoji: "🎉", label: "Party Popper" },
  { id: "heart_glove", emoji: "💖", label: "Neon Heart" },
  { id: "bolt", emoji: "⚡", label: "Lightning Bolt" },
  { id: "rainbow", emoji: "🌈", label: "Rainbow Glow" },
  { id: "star_eyes", emoji: "🤩", label: "Star Eyes" },
  { id: "popcorn", emoji: "🍿", label: "Movie Night" },
];

type Props = {
  connectionState: "idle" | "waiting" | "connecting" | "connected" | "disconnected";
  dataChannelOpen: boolean;
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
  skipToNext: () => void;
  leaveMatch: () => void;
};

type ChatMessage = {
  id: string;
  text?: string;
  imageUrl?: string;
  sticker?: string;
  mine: boolean;
  time: string;
};

export default function TextChatContainer({
  connectionState,
  dataChannelOpen,
  sendMessage,
  subscribe,
  skipToNext,
  leaveMatch,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [stickersOpen, setStickersOpen] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const isConnected = connectionState === "connected" && dataChannelOpen;

  // Clear messages on new match
  useEffect(() => {
    if (connectionState === "waiting" || connectionState === "idle") {
      setMessages([]);
    }
  }, [connectionState]);

  // Listen for incoming messages
  useEffect(() => {
    return subscribe("chat", (msg) => {
      const payload = msg.payload as ChatPayload;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          text: payload.text,
          imageUrl: payload.imageUrl,
          sticker: payload.sticker,
          mine: false,
          time: timeStr,
        },
      ]);
    });
  }, [subscribe]);

  // Auto-scroll message list
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, stickersOpen]);

  // Send Text Message
  function handleSendText(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = draft.trim();
    if (!text || !isConnected) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    sendMessage<ChatPayload>("chat", { text });
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, mine: true, time: timeStr },
    ]);
    setDraft("");
  }

  // Send 3D Sticker
  function handleSendSticker(stickerEmoji: string) {
    if (!isConnected) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    sendMessage<ChatPayload>("chat", { sticker: stickerEmoji });
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, sticker: stickerEmoji, mine: true, time: timeStr },
    ]);
    setStickersOpen(false);
  }

  // Open Camera Stream Modal for Snapshot
  async function handleOpenCameraModal() {
    if (!isConnected) return;
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      cameraStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch {
      setShowCameraModal(false);
    }
  }

  function handleCloseCameraModal() {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setShowCameraModal(false);
  }

  // Capture Photo Snapshot from Camera Stream Modal
  function handleTakeCameraSnapshot() {
    if (!localVideoRef.current || !isConnected) return;
    try {
      const videoEl = localVideoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = videoEl.videoWidth || 640;
      canvas.height = videoEl.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.75);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      sendMessage<ChatPayload>("chat", { imageUrl: dataUrl, text: "📷 Camera Snap" });
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, imageUrl: dataUrl, text: "📷 Camera Snap", mine: true, time: timeStr },
      ]);
      handleCloseCameraModal();
    } catch {
      handleCloseCameraModal();
    }
  }

  // Upload Photo File from Device Gallery
  function handleSelectPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !isConnected) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedUrl = canvas.toDataURL("image/jpeg", 0.75);

          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          sendMessage<ChatPayload>("chat", { imageUrl: resizedUrl, text: "🖼️ Uploaded Photo" });
          setMessages((prev) => [
            ...prev,
            { id: `${Date.now()}-${Math.random()}`, imageUrl: resizedUrl, text: "🖼️ Uploaded Photo", mine: true, time: timeStr },
          ]);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="relative flex flex-col w-full h-[100dvh] max-w-4xl mx-auto overflow-hidden bg-[#070414] select-none shadow-2xl sm:rounded-3xl sm:my-auto border border-purple-500/20">
      {/* Hidden File Input for Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSelectPhoto}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header Bar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0c0622]/90 backdrop-blur-2xl px-4 py-3 z-30">
        <div className="flex items-center gap-3">
          <div className="btn-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-md">
            <LogoMark size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-white font-mono tracking-tight">Vidibro Chat</span>
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
            </div>
            <span className="text-[11px] text-purple-300/80 font-medium">
              {connectionState === "waiting" && "Looking for stranger…"}
              {connectionState === "connecting" && "Connecting encrypted chat…"}
              {connectionState === "connected" && "Matched with Stranger"}
              {connectionState === "disconnected" && "Stranger left chat"}
              {connectionState === "idle" && "Press Start"}
            </span>
          </div>
        </div>

        {/* Right Header Buttons */}
        <div className="flex items-center gap-2">
          {/* Centered NEXT Button */}
          <button
            onClick={skipToNext}
            className="btn-gradient flex items-center justify-center px-4 py-2 rounded-full text-xs font-extrabold text-white shadow-xl hover:scale-105 transition tracking-wider uppercase gap-1.5"
          >
            <SkipForward size={14} /> NEXT
          </button>

          {/* End Call / Leave Button */}
          <button
            onClick={leaveMatch}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition transform hover:scale-105 active:scale-95"
            title="End Chat"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="relative flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#090518] via-[#0c0722] to-[#070414]">
        
        {/* Waiting / Matching Radar Orb Screen */}
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-purple-600/20 border border-purple-400/30 mb-5">
              <motion.span
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-purple-500/30 border border-purple-400/40"
              />
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0.1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.7, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-pink-500/30"
              />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full btn-gradient shadow-xl shadow-purple-500/40">
                <Sparkles className="text-white animate-spin-slow" size={26} />
              </div>
            </div>

            <p className="text-base sm:text-lg font-black text-white tracking-wide">
              {connectionState === "waiting" && "Searching for someone to text chat with…"}
              {connectionState === "connecting" && "Establishing encrypted WebRTC text session…"}
              {connectionState === "disconnected" && "Stranger left the chat room."}
            </p>
            <p className="text-xs text-purple-200/70 mt-1 max-w-sm">
              Enjoy 100% private text chat, send 3D stickers, and share photos instantly!
            </p>
          </div>
        ) : (
          /* Messages Feed */
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 p-2.5 text-xs text-purple-200/90 mb-4 max-w-md mx-auto">
              <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
              <span>You are connected! Messages expire when chat ends.</span>
            </div>

            {messages.length === 0 && (
              <p className="pt-10 text-center text-xs text-purple-300/60 font-medium">
                Say hello 👋 or send a sticker to break the ice!
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1 text-[10px] text-purple-300/60 px-1 mb-0.5">
                  <span className="font-bold">{m.mine ? "You" : "Stranger"}</span>
                  <span>• {m.time}</span>
                </div>

                {/* Sticker Message */}
                {m.sticker ? (
                  <motion.div
                    initial={{ scale: 0.5, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-6xl p-2 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] cursor-default"
                  >
                    {m.sticker}
                  </motion.div>
                ) : m.imageUrl ? (
                  /* Photo Image Message */
                  <div className="max-w-[80%] sm:max-w-[60%] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/70 p-1.5">
                    <img
                      src={m.imageUrl}
                      alt="Shared Photo"
                      className="w-full max-h-64 object-cover rounded-xl"
                    />
                    {m.text && (
                      <p className="px-2 py-1.5 text-xs text-purple-100 font-medium">{m.text}</p>
                    )}
                  </div>
                ) : (
                  /* Standard Text Message Bubble */
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed break-words [word-break:break-word] overflow-hidden ${
                      m.mine
                        ? "btn-gradient text-white rounded-br-none font-medium shadow-lg shadow-purple-500/20"
                        : "bg-white/10 text-purple-100 rounded-bl-none border border-white/15 backdrop-blur-md shadow-md"
                    }`}
                  >
                    {m.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3D Animated Sticker Drawer Panel */}
        <AnimatePresence>
          {stickersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/10 bg-[#0a051d]/95 backdrop-blur-3xl p-3 grid grid-cols-6 gap-2 z-20"
            >
              {BEAUTIFUL_STICKERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSendSticker(s.emoji)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-purple-500/30 text-2xl sm:text-3xl transition transform hover:scale-125 active:scale-90 border border-white/10 shadow-md"
                  title={s.label}
                >
                  {s.emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Camera Stream Snapshot Modal */}
      <AnimatePresence>
        {showCameraModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <div className="relative w-full max-w-sm bg-[#120a2e] rounded-3xl overflow-hidden border border-white/20 p-4 flex flex-col items-center gap-4 shadow-2xl">
              <div className="flex items-center justify-between w-full border-b border-white/10 pb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Camera size={16} className="text-cyan-400" /> Camera Snapshot
                </span>
                <button
                  onClick={handleCloseCameraModal}
                  className="rounded-full p-1 text-purple-300 hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/15">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={handleTakeCameraSnapshot}
                className="btn-gradient flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold text-white shadow-xl hover:scale-105 transition"
              >
                <Camera size={16} /> Take & Send Snap
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <footer className="p-3 border-t border-white/10 bg-[#090518]/95 backdrop-blur-2xl z-30">
        <form onSubmit={handleSendText} className="flex items-center gap-2">
          {/* Open Camera Button */}
          <button
            type="button"
            onClick={handleOpenCameraModal}
            disabled={!isConnected}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-cyan-500/30 text-cyan-300 border border-white/15 transition disabled:opacity-40"
            title="Camera Photo"
          >
            <Camera size={18} />
          </button>

          {/* Upload Photo Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-pink-500/30 text-pink-300 border border-white/15 transition disabled:opacity-40"
            title="Upload Image"
          >
            <ImageIcon size={18} />
          </button>

          {/* Stickers Toggle Button */}
          <button
            type="button"
            onClick={() => setStickersOpen((v) => !v)}
            disabled={!isConnected}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 transition disabled:opacity-40 ${
              stickersOpen ? "bg-purple-600 text-white" : "bg-white/10 hover:bg-purple-500/30 text-purple-300"
            }`}
            title="3D Stickers"
          >
            <StickerIcon size={18} />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={isConnected ? "Send a message…" : "Waiting to match stranger…"}
            disabled={!isConnected}
            className="flex-1 rounded-full bg-white/10 border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!draft.trim() || !isConnected}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full btn-gradient text-white shadow-md disabled:opacity-40 hover:scale-105 transition"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </footer>
    </div>
  );
}
