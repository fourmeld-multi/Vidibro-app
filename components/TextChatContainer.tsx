"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  X,
  RefreshCw,
  PhoneOff,
  Camera,
  Image as ImageIcon,
  Sticker as StickerIcon,
  Sparkles,
  Lock,
  User,
  Check,
  CheckCheck,
  Settings,
  Flag,
  Paperclip,
  Plus,
} from "lucide-react";
import ReportModal from "@/components/ReportModal";
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
  status: "sent" | "read";
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
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

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

  // Listen for incoming messages and read receipt acknowledgments
  useEffect(() => {
    return subscribe("chat", (msg) => {
      const payload = msg.payload as ChatPayload;

      // Handle WhatsApp Read Receipt Acknowledgment
      if (payload.ackId) {
        setMessages((prev) =>
          prev.map((m) => (m.id === payload.ackId ? { ...m, status: "read" } : m))
        );
        return;
      }

      // Handle Regular Message
      if (payload.text || payload.imageUrl || payload.sticker) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Send Read Receipt Acknowledgment immediately back to peer over WebRTC
        if (payload.msgId) {
          sendMessage<ChatPayload>("chat", { ackId: payload.msgId });
        }

        setMessages((prev) => [
          ...prev,
          {
            id: payload.msgId || `${Date.now()}-${Math.random()}`,
            text: payload.text,
            imageUrl: payload.imageUrl,
            sticker: payload.sticker,
            mine: false,
            time: timeStr,
            status: "read",
          },
        ]);
      }
    });
  }, [subscribe, sendMessage]);

  // Auto scroll message feed
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Opening the mobile keyboard shrinks the visual viewport but doesn't add a
  // message, so the effect above never re-runs and the newest message ends up
  // hidden above the keyboard — forcing the user to scroll back down by hand.
  // visualViewport fires on the keyboard show/hide, so re-pin to the bottom.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const pinToBottom = () => {
      const el = listRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    };
    vv.addEventListener("resize", pinToBottom);
    return () => vv.removeEventListener("resize", pinToBottom);
  }, []);

  function handleSendText(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const clean = draft.trim();
    if (!clean || !isConnected) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgId = `${Date.now()}-${Math.random()}`;

    sendMessage<ChatPayload>("chat", { msgId, text: clean });

    setMessages((prev) => [
      ...prev,
      {
        id: msgId,
        text: clean,
        mine: true,
        time: timeStr,
        status: "sent", // Single tick until read ack received
      },
    ]);

    setDraft("");
  }

  function handleSendSticker(emoji: string) {
    if (!isConnected) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msgId = `${Date.now()}-${Math.random()}`;

    sendMessage<ChatPayload>("chat", { msgId, sticker: emoji });

    setMessages((prev) => [
      ...prev,
      {
        id: msgId,
        sticker: emoji,
        mine: true,
        time: timeStr,
        status: "sent",
      },
    ]);

    setStickersOpen(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !isConnected) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const msgId = `${Date.now()}-${Math.random()}`;

      sendMessage<ChatPayload>("chat", { msgId, imageUrl: dataUrl });

      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          imageUrl: dataUrl,
          mine: true,
          time: timeStr,
          status: "sent",
        },
      ]);
    };
    reader.readAsDataURL(file);
  }

  async function openLiveCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 } },
      });
      cameraStreamRef.current = stream;
      setShowCameraModal(true);
      setTimeout(() => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }, 100);
    } catch {
      alert("Could not access camera for photo capture");
    }
  }

  function closeLiveCamera() {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    setShowCameraModal(false);
  }

  function captureAndSendPhoto() {
    if (!localVideoRef.current || !isConnected) return;
    const video = localVideoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const msgId = `${Date.now()}-${Math.random()}`;

      sendMessage<ChatPayload>("chat", { msgId, imageUrl: dataUrl });

      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          imageUrl: dataUrl,
          mine: true,
          time: timeStr,
          status: "sent",
        },
      ]);
    }
    closeLiveCamera();
  }

  return (
    <div
      onClick={() => {
        setAttachmentOpen(false);
        setStickersOpen(false);
      }}
      className="relative flex flex-col h-full w-full bg-[#f6f2ff] text-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-200"
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Reference Image Styled Header Bar */}
      <header className="flex items-center justify-between bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899] px-5 py-3.5 z-30 shadow-md text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 border-2 border-white/40 shadow-inner overflow-hidden">
            <User size={24} className="text-white" />
            <span className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-purple-600 ${isConnected ? "bg-emerald-400" : "bg-amber-400"}`} />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-white tracking-wide">
                Vidibro Chat
              </span>
              <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-400 animate-ping" : "bg-amber-300"}`} />
            </div>
            <span className="text-xs text-white/90 font-medium flex items-center gap-1.5">
              <Lock size={11} />
              <span>
                {connectionState === "waiting" && "Looking for stranger…"}
                {connectionState === "connecting" && "Connecting encrypted chat…"}
                {connectionState === "connected" && "Matched with Stranger"}
                {connectionState === "disconnected" && "Stranger left chat"}
                {connectionState === "idle" && "Press Start"}
              </span>
            </span>
          </div>
        </div>

        {/* Right Header Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/25 hover:bg-red-600/50 text-white transition border-2 border-red-500 shadow-md shadow-red-500/30 hover:scale-105 active:scale-95"
            title="Report Stranger"
          >
            <Flag size={15} className="text-white fill-red-500/30" />
          </button>
          <button
            onClick={leaveMatch}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition border border-white/20"
            title="Leave Match"
          >
            <PhoneOff size={16} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="relative flex-1 flex flex-col overflow-hidden bg-[#f4efff]">
        
        {/* Security & Privacy Notice Card (Matching Reference Screenshot) */}
        <div className="mt-3 mx-auto flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-full text-xs font-semibold text-emerald-700 shadow-sm z-10">
          <Lock size={14} className="text-emerald-600 shrink-0" />
          <span>Your messages are secured and private. Safety first!</span>
        </div>

        {/* Searching / Connecting Screen */}
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-purple-100 border-2 border-purple-300 mb-4 shadow-xl">
              <motion.span
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-pink-400/30 border border-pink-400/40"
              />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#6366f1] to-[#ec4899] text-white shadow-lg">
                <Sparkles className="animate-spin-slow" size={26} />
              </div>
            </div>

            <p className="text-base sm:text-lg font-black text-gray-800 tracking-wide">
              {connectionState === "waiting" && "Searching for someone to text chat with…"}
              {connectionState === "connecting" && "Establishing encrypted WebRTC connection…"}
              {connectionState === "disconnected" && "Stranger left the chat."}
            </p>
            <p className="text-xs sm:text-sm text-purple-700/80 mt-1 max-w-sm font-medium">
              Enjoy 100% private text chat, send 3D stickers, and share photos instantly!
            </p>
          </div>
        ) : (
          /* Active Messages Feed (Reference Screenshot Styled Bubbles) */
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {messages.length === 0 && (
              <p className="pt-10 text-center text-xs text-purple-600 font-semibold">
                Say hello 👋 or send a sticker to start talking!
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}
              >
                {/* Sticker Message */}
                {m.sticker ? (
                  <motion.div
                    initial={{ scale: 0.5, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-6xl p-2 drop-shadow-md cursor-default"
                  >
                    {m.sticker}
                  </motion.div>
                ) : m.imageUrl ? (
                  /* Photo Image Message */
                  <div className="max-w-[80%] sm:max-w-[60%] rounded-2xl overflow-hidden border border-purple-200 shadow-xl bg-white p-1.5">
                    <img
                      src={m.imageUrl}
                      alt="Shared Photo"
                      className="w-full max-h-72 object-cover rounded-xl"
                    />
                    {m.text && (
                      <p className="px-2 py-1.5 text-xs text-gray-800 font-medium">{m.text}</p>
                    )}
                  </div>
                ) : (
                  /* Standard Text Message Bubble (Reference Image Styling) */
                  <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed break-words [word-break:break-word] overflow-hidden shadow-md font-medium ${
                        m.mine
                          ? "bg-gradient-to-r from-[#5a3bfa] to-[#7c3aed] text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none border border-purple-100/90"
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Timestamp & WhatsApp Ticks Row */}
                    <div
                      className={`flex items-center gap-1 mt-0.5 px-1 text-[10px] ${
                        m.mine ? "justify-end text-purple-700/80" : "justify-start text-gray-500"
                      }`}
                    >
                      <span>{m.time}</span>
                      {m.mine && (
                        <span>
                          {m.status === "read" ? (
                            <span title="Read"><CheckCheck size={14} className="text-[#38bdf8] stroke-[2.5]" /></span>
                          ) : (
                            <span title="Sent"><Check size={14} className="text-gray-400 stroke-[2]" /></span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3D Animated Sticker Drawer */}
        <AnimatePresence>
          {stickersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-purple-200 bg-white/95 p-4 grid grid-cols-6 gap-3 z-20 shadow-xl"
            >
              {BEAUTIFUL_STICKERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSendSticker(s.emoji)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 hover:bg-purple-100 text-2xl sm:text-3xl transition transform hover:scale-125 border border-purple-100 shadow-sm mx-auto"
                  title={s.label}
                >
                  {s.emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Centered "Find New Partner" Pill Button Bar (Matching Reference Image) */}
        <div className="flex items-center justify-center py-2.5 bg-white/60 border-t border-purple-100 z-20">
          <button
            onClick={skipToNext}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#ec4899] to-[#d946ef] hover:from-[#db2777] hover:to-[#c026d3] text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg shadow-pink-500/25 transition transform hover:scale-105 active:scale-95 tracking-wide"
          >
            <RefreshCw size={15} className="animate-spin-slow" />
            <span>Find New Partner</span>
          </button>
        </div>
      </main>

      {/* Bottom Message Input Bar */}
      <footer
        className="relative border-t border-purple-200 bg-white p-2.5 sm:p-4 z-30 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Attachment Sub-Options Popup Menu */}
        <AnimatePresence>
          {attachmentOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 left-12 z-50 flex flex-col gap-1.5 bg-white border border-purple-200 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => {
                  setAttachmentOpen(false);
                  openLiveCamera();
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-purple-50 text-gray-800 text-xs font-semibold transition text-left"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                  <Camera size={15} />
                </div>
                <span>Take Camera Photo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAttachmentOpen(false);
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-purple-50 text-gray-800 text-xs font-semibold transition text-left"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <ImageIcon size={15} />
                </div>
                <span>Upload Gallery Image</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSendText} className="flex items-center gap-2 max-w-4xl mx-auto w-full">
          {/* Sticker Tray Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAttachmentOpen(false);
              setStickersOpen((v) => !v);
            }}
            disabled={!isConnected}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition shrink-0 disabled:opacity-40 ${
              stickersOpen ? "bg-pink-500 text-white border-pink-400" : "bg-purple-50 hover:bg-purple-100 text-pink-500 border-purple-200"
            }`}
            title="Stickers"
          >
            <StickerIcon size={18} />
          </button>

          {/* Combined Attachment Plus Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setStickersOpen(false);
              setAttachmentOpen((v) => !v);
            }}
            disabled={!isConnected}
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition shrink-0 disabled:opacity-40 ${
              attachmentOpen ? "bg-purple-600 text-white border-purple-500 rotate-45" : "bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
            }`}
            title="Add Attachment"
          >
            <Plus size={18} className="transition-transform duration-200" />
          </button>

          {/* Type Message Input Field */}
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => {
              setAttachmentOpen(false);
              setStickersOpen(false);
              // Keyboard animation takes a moment; re-pin once it has settled
              // so the latest message stays visible above it.
              setTimeout(() => {
                const el = listRef.current;
                if (el) el.scrollTop = el.scrollHeight;
              }, 300);
            }}
            disabled={!isConnected}
            placeholder={isConnected ? "Type a message..." : "Waiting to match partner..."}
            className="flex-1 min-w-0 rounded-full bg-gray-50 border border-purple-200 px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-800 outline-none focus:border-purple-500 focus:bg-white transition font-medium disabled:opacity-50"
          />

          {/* Send Button (Fully visible on all mobile screens!) */}
          <button
            type="submit"
            disabled={!isConnected || !draft.trim()}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#5a3bfa] to-[#7c3aed] text-white shadow-md transition transform hover:scale-105 active:scale-95 shrink-0 disabled:opacity-40"
            title="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </footer>

      {/* Live Camera Modal */}
      <AnimatePresence>
        {showCameraModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-purple-200 p-5 shadow-2xl flex flex-col items-center gap-4 text-gray-900"
            >
              <div className="flex w-full items-center justify-between border-b border-purple-100 pb-3">
                <span className="text-sm font-bold text-gray-800">Take Photo to Share</span>
                <button
                  onClick={closeLiveCamera}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-purple-100">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  onClick={closeLiveCamera}
                  className="flex-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 text-xs transition"
                >
                  Cancel
                </button>

                <button
                  onClick={captureAndSendPhoto}
                  className="flex-1 bg-gradient-to-r from-[#5a3bfa] to-[#7c3aed] text-white font-extrabold py-2.5 text-xs rounded-full shadow-lg transition hover:scale-105"
                >
                  Snap & Send 📸
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        onReportSubmitted={() => {
          skipToNext();
        }}
      />
    </div>
  );
}
