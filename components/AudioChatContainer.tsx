"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  MessageSquare,
  SkipForward,
  Music,
  Sparkles,
  ShieldCheck,
  Send,
  X,
  Flag,
  PartyPopper,
  Laugh,
  Flame,
  Drum,
  Zap,
  Radio,
  Lightbulb,
} from "lucide-react";
import LogoMark from "@/components/LogoMark";
import ReportModal from "@/components/ReportModal";
import ConfirmNextModal from "@/components/ConfirmNextModal";
import type { MessageType, ChatPayload } from "@/lib/protocol";

const ICEBREAKER_QUESTIONS = [
  "If you could travel anywhere in the world right now, where would you go? ✈️",
  "What is the most underrated movie or show you've watched recently? 🍿",
  "What is your secret superpower or talent? ⚡",
  "If you won $1,000,000 today, what is the first thing you would buy? 💰",
  "Are you a morning person or a night owl? 🦉",
  "Coffee, Tea, or Boba? ☕",
  "What's your dream job if money didn't matter? 🎨",
  "If you could have dinner with any famous person living or dead, who would it be? 👑",
  "What's the best song you listened to this week? 🎧",
  "Dogs or Cats? 🐶🐱",
];

const SOUNDBOARD_EFFECTS = [
  { id: "clap", label: "Applaud", emoji: "👏", icon: PartyPopper },
  { id: "laugh", label: "Laugh", emoji: "😂", icon: Laugh },
  { id: "hype", label: "Hype", emoji: "🔥", icon: Flame },
  { id: "drum", label: "Drumroll", emoji: "🥁", icon: Drum },
  { id: "party", label: "Party", emoji: "🎉", icon: Zap },
];

type Props = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: "idle" | "waiting" | "connecting" | "connected" | "disconnected";
  dataChannelOpen: boolean;
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
  skipToNext: () => void;
  leaveMatch: () => void;
  matchCountdown?: number;
};

type AudioChatMessage = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

export default function AudioChatContainer({
  localStream,
  remoteStream,
  connectionState,
  dataChannelOpen,
  sendMessage,
  subscribe,
  skipToNext,
  leaveMatch,
  matchCountdown = 0,
}: Props) {
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [nextConfirmOpen, setNextConfirmOpen] = useState(false);
  const [icebreakerIndex, setIcebreakerIndex] = useState(0);
  const [activeSoundFX, setActiveSoundFX] = useState<string | null>(null);
  const [soundboardOpen, setSoundboardOpen] = useState(false);

  // Optional Text Chat Popover in Audio Call
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<AudioChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const isConnected = connectionState === "connected";

  // Browsers block autoplay of unmuted media without a fresh user gesture —
  // start muted (always allowed) so playback actually begins, then unmute
  // once confirmed playing. Muting/unmuting an already-playing element
  // doesn't need a new gesture, unlike starting one.
  useEffect(() => {
    const el = remoteAudioRef.current;
    if (!el || !remoteStream) return;
    el.srcObject = remoteStream;
    el.muted = true;
    el.play()
      .then(() => {
        el.muted = !speakerEnabled;
      })
      .catch(() => {
        // Still blocked even muted (rare) — leave muted; the speaker
        // toggle button lets the user retry with a real gesture.
      });
    // Only (re)attach the stream here — speakerEnabled is handled below so
    // toggling it doesn't restart playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteStream]);

  useEffect(() => {
    if (remoteAudioRef.current) remoteAudioRef.current.muted = !speakerEnabled;
  }, [speakerEnabled]);

  // Clear messages on new match
  useEffect(() => {
    if (connectionState === "waiting" || connectionState === "idle") {
      setMessages([]);
      setUnreadCount(0);
    }
  }, [connectionState]);

  // Listen for incoming chat messages over WebRTC
  useEffect(() => {
    return subscribe("chat", (msg) => {
      const payload = msg.payload as ChatPayload;
      const textStr = payload.text || "";
      if (textStr) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-${Math.random()}`, text: textStr, mine: false, time: timeStr },
        ]);
        if (!chatOpen) setUnreadCount((count) => count + 1);
      }
    });
  }, [subscribe, chatOpen]);

  // Listen for Soundboard FX from stranger
  useEffect(() => {
    return subscribe("reaction", (msg) => {
      const payload = msg.payload as { reactionId?: string; soundFx?: string };
      const fx = payload.soundFx || payload.reactionId;
      if (fx) {
        setActiveSoundFX(fx);
        setTimeout(() => setActiveSoundFX(null), 2500);
      }
    });
  }, [subscribe]);

  // Auto-scroll chat list
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]);

  function toggleMic() {
    const next = !micEnabled;
    localStream?.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicEnabled(next);
  }

  function toggleSpeaker() {
    const next = !speakerEnabled;
    setSpeakerEnabled(next);
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !next;
    }
  }

  function handleTriggerSoundFX(effectId: string) {
    if (!isConnected) return;
    sendMessage("reaction", { soundFx: effectId });
    setActiveSoundFX(effectId);
    setTimeout(() => setActiveSoundFX(null), 2500);
  }

  function handleNextIcebreaker() {
    setIcebreakerIndex((prev) => (prev + 1) % ICEBREAKER_QUESTIONS.length);
  }

  function sendChatMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = chatDraft.trim();
    if (!text || !isConnected) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    sendMessage<ChatPayload>("chat", { text });
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, mine: true, time: timeStr },
    ]);
    setChatDraft("");
  }

  return (
    <div className="relative flex flex-col w-full h-[100dvh] max-w-4xl mx-auto overflow-hidden bg-[#070414] select-none shadow-2xl sm:rounded-3xl sm:my-auto border border-purple-500/20">
      {/* Hidden Audio Element for Remote Stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Top Header Bar */}
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0c0622]/90 backdrop-blur-2xl px-4 py-3 z-30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-md">
            <LogoMark size={36} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-white font-mono tracking-tight">Vidibro Voice</span>
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
            </div>
            <span className="text-[11px] text-purple-300/80 font-medium">
              {connectionState === "waiting" && (matchCountdown > 0 ? `Matching in ${matchCountdown}…` : "Searching for stranger…")}
              {connectionState === "connecting" && "Connecting encrypted audio…"}
              {connectionState === "connected" && "Voice Match Connected"}
              {connectionState === "disconnected" && "Stranger disconnected"}
            </span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {/* Only meaningful once there's an actual stranger to report */}
          {isConnected && (
            <button
              onClick={() => setReportOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/25 hover:bg-red-600/50 text-white transition border-2 border-red-500 shadow-md shadow-red-500/30 hover:scale-105 active:scale-95"
              title="Report User"
            >
              <Flag size={15} className="text-white fill-red-500/30" />
            </button>
          )}
        </div>
      </header>

      {/* Main Center Stage: 3D Voice Orb Visualizer & Icebreaker Card */}
      <main className="relative flex-1 flex flex-col items-center justify-between p-4 sm:p-6 text-center bg-gradient-to-b from-[#140a32] via-[#0b061d] to-[#070414] overflow-hidden">
        
        {/* Floating Sound FX Popup Banner */}
        <AnimatePresence>
          {activeSoundFX && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1.1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="absolute top-4 z-40 bg-pink-500/90 backdrop-blur-2xl text-white px-5 py-2 rounded-full text-sm font-extrabold shadow-2xl flex items-center gap-2 border border-pink-300/30"
            >
              <Sparkles size={16} />
              <span>Sound Effect Played!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Glowing Audio Orb */}
        <div className="relative flex flex-col items-center justify-center my-auto">
          {/* Animated Waveform Rings */}
          <div className="relative flex h-32 w-32 sm:h-44 sm:w-44 items-center justify-center">
            {isConnected && (
              <>
                <span
                  className="vidibro-pulse-ring absolute inset-0 rounded-full bg-purple-500/30 border border-purple-400/40"
                  style={{ "--ring-scale": 2.2, "--ring-max": 0.6, "--ring-min": 0.1, "--ring-duration": "2.5s" } as React.CSSProperties}
                />
                <span
                  className="vidibro-pulse-ring absolute inset-0 rounded-full bg-pink-500/30 border border-pink-400/40"
                  style={{ "--ring-scale": 1.7, "--ring-max": 0.8, "--ring-min": 0.2, "--ring-duration": "1.8s" } as React.CSSProperties}
                />
              </>
            )}

            {/* Center Avatar Orb */}
            <div className="relative flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-full btn-gradient shadow-2xl shadow-purple-500/50 border-4 border-white/20">
              {isConnected ? (
                <Radio className="text-white animate-pulse" size={40} />
              ) : (
                <Sparkles className="text-white animate-spin-slow" size={36} />
              )}
            </div>
          </div>

          <p className="text-base sm:text-xl font-black text-white mt-4 tracking-wide">
            {connectionState === "waiting" && (matchCountdown > 0 ? `Finding your next partner in ${matchCountdown}…` : "Searching for Voice Stranger…")}
            {connectionState === "connecting" && "Establishing Encrypted Audio…"}
            {connectionState === "connected" && "Voice Call Connected 🎙️"}
            {connectionState === "disconnected" && "Stranger Disconnected"}
          </p>
        </div>

        {/* Icebreaker Questions Card */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 mb-3 shadow-2xl flex flex-col items-center gap-2 z-30"
          >
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-pink-300">
              <Lightbulb size={15} className="text-yellow-400 animate-pulse" />
              <span>Icebreaker Card</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
              &quot;{ICEBREAKER_QUESTIONS[icebreakerIndex]}&quot;
            </p>
            <button
              onClick={handleNextIcebreaker}
              className="text-[11px] font-bold text-purple-300 hover:text-white transition bg-white/10 px-3 py-1 rounded-full border border-white/10 mt-1"
            >
              🎲 Next Icebreaker
            </button>
          </motion.div>
        )}

        {/* Interactive Soundboard FX Buttons Panel */}
        <AnimatePresence>
          {soundboardOpen && isConnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-md bg-black/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 mb-3 flex items-center justify-around gap-2"
            >
              {SOUNDBOARD_EFFECTS.map((fx) => (
                <button
                  key={fx.id}
                  onClick={() => handleTriggerSoundFX(fx.id)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/10 hover:bg-purple-500/30 text-white transition transform hover:scale-110 active:scale-90 border border-white/10"
                  title={fx.label}
                >
                  <span className="text-xl">{fx.emoji}</span>
                  <span className="text-[10px] font-bold text-purple-200">{fx.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Optional Transparent Text Overlay Drawer for Audio Mode */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-20 z-40 w-full max-w-md bg-[#090518]/95 backdrop-blur-3xl border border-purple-500/30 rounded-3xl p-3 shadow-2xl flex flex-col h-72 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 px-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-cyan-400" /> Voice Chat Overlay
                </span>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-purple-300 hover:text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages list */}
              <div ref={chatListRef} className="flex-1 overflow-y-auto space-y-2 p-1 text-xs">
                {messages.length === 0 && (
                  <p className="pt-6 text-center text-purple-300/50 text-[11px]">
                    Share links or type text notes during call...
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1 text-[9px] text-purple-300/60 mb-0.5">
                      <span>{m.mine ? "You" : "Stranger"}</span>
                      <span>• {m.time}</span>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-1.5 text-xs break-words [word-break:break-word] overflow-hidden ${
                        m.mine ? "btn-gradient text-white" : "bg-white/10 text-purple-100 border border-white/10"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={sendChatMessage} className="p-3 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder="Type message or share link..."
                  disabled={!isConnected}
                  className="flex-1 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!chatDraft.trim() || !isConnected}
                  className="flex h-8 w-8 items-center justify-center rounded-full btn-gradient text-white shadow-md disabled:opacity-40"
                >
                  <Send size={13} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Audio Action Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3 bg-black/80 backdrop-blur-2xl px-4 sm:px-5 py-3 rounded-full border border-white/15 shadow-2xl z-30 max-w-[95vw]">
          {/* 1. Mute / Unmute Mic */}
          <button
            onClick={toggleMic}
            className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition shadow-lg ${
              micEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500 text-white shadow-red-500/40"
            }`}
            title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micEnabled ? <Mic size={19} /> : <MicOff size={19} />}
          </button>

          {/* 2. Speaker Mute / Unmute */}
          <button
            onClick={toggleSpeaker}
            className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition shadow-lg ${
              speakerEnabled ? "bg-white/15 hover:bg-white/25 text-purple-300" : "bg-red-500 text-white shadow-red-500/40"
            }`}
            title={speakerEnabled ? "Mute Speaker" : "Unmute Speaker"}
          >
            {speakerEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>

          {/* 3. Centered NEXT Button */}
          <button
            onClick={() => setNextConfirmOpen(true)}
            className="btn-gradient flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold text-white shadow-xl hover:scale-105 transition tracking-wider uppercase"
          >
            NEXT
          </button>

          {/* 4. Optional Text Chat Overlay Button */}
          <button
            onClick={() => {
              setChatOpen((v) => !v);
              setUnreadCount(0);
            }}
            disabled={!isConnected}
            className={`relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full transition shadow-lg ${
              chatOpen ? "bg-purple-600 text-white" : "bg-white/15 hover:bg-white/25 text-cyan-300"
            }`}
            title="Text Chat Overlay"
          >
            <MessageSquare size={19} />
            {unreadCount > 0 && !chatOpen && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 5. End Call */}
          <button
            onClick={leaveMatch}
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition transform hover:scale-105 active:scale-95"
            title="End Audio Call"
          >
            <PhoneOff size={19} />
          </button>
        </div>
      </main>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        onReportSubmitted={() => {
          skipToNext();
        }}
      />

      <ConfirmNextModal
        isOpen={nextConfirmOpen}
        onCancel={() => setNextConfirmOpen(false)}
        onConfirm={() => {
          setNextConfirmOpen(false);
          skipToNext();
        }}
      />
    </div>
  );
}
