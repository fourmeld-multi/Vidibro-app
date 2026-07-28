"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  SkipForward,
  MessageSquare,
  Sparkles,
  Send,
  X,
  ShieldAlert,
  Volume2,
  VolumeX,
  SwitchCamera,
} from "lucide-react";
import LogoMark from "@/components/LogoMark";
import type { MessageType, ReactionId, ReactionPayload, ChatPayload, SubtitlePayload } from "@/lib/protocol";

const EMOJI_REACTIONS: { id: ReactionId; emoji: string; label: string }[] = [
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "heart", emoji: "❤️", label: "Heart" },
  { id: "boom", emoji: "💥", label: "Boom" },
  { id: "wow", emoji: "🤩", label: "Star Eyes" },
  { id: "lol", emoji: "😂", label: "LOL" },
];

type Props = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: "idle" | "waiting" | "connecting" | "connected" | "disconnected";
  dataChannelOpen: boolean;
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
  replaceOutgoingVideoTrack?: (track: MediaStreamTrack | null) => Promise<void>;
  skipToNext: () => void;
  leaveMatch: () => void;
  isHost?: boolean;
};

type ChatMessage = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

type FloatingParticle = {
  id: string;
  emoji: string;
  x: number;
};

export default function VideoContainer({
  localStream,
  remoteStream,
  connectionState,
  dataChannelOpen,
  sendMessage,
  subscribe,
  replaceOutgoingVideoTrack,
  skipToNext,
  leaveMatch,
}: Props) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);

  // Audio/Video/Speaker controls
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [remoteSubtitle, setRemoteSubtitle] = useState("");

  // Google Meet Auto-Hiding Controls Bar state
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Chat & Reactions popups state
  const [chatOpen, setChatOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);

  // Attach media streams to video elements
  useEffect(() => {
    if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.muted = !speakerEnabled;
    }
  }, [remoteStream, speakerEnabled]);

  // Auto-hide controls timer
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (!chatOpen && !reactionsOpen) {
        setShowControls(false);
      }
    }, 4500);
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [chatOpen, reactionsOpen]);

  // Listen for incoming chat messages over WebRTC data channel
  useEffect(() => {
    const unsub = subscribe("chat", (msg) => {
      const payload = msg.payload as ChatPayload;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text: payload.text, mine: false, time: timeStr },
      ]);
      if (!chatOpen) setUnreadCount((count) => count + 1);
    });
    return unsub;
  }, [subscribe, chatOpen]);

  // Listen for incoming emoji reactions over WebRTC data channel
  useEffect(() => {
    const unsub = subscribe("reaction", (msg) => {
      const payload = msg.payload as ReactionPayload;
      const meta = EMOJI_REACTIONS.find((r) => r.id === payload.reactionId);
      const emojiSymbol = meta ? meta.emoji : "🔥";
      
      const newParticle: FloatingParticle = {
        id: `${Date.now()}-${Math.random()}`,
        emoji: emojiSymbol,
        x: 20 + Math.random() * 60,
      };

      setFloatingParticles((prev) => [...prev.slice(-10), newParticle]);
      setTimeout(() => {
        setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 2500);
    });
    return unsub;
  }, [subscribe]);

  // Listen for speech subtitles
  useEffect(() => {
    const unsub = subscribe("subtitle", (msg) => {
      const payload = msg.payload as SubtitlePayload;
      setRemoteSubtitle(payload.text);
      if (payload.isFinal) {
        window.setTimeout(() => setRemoteSubtitle((cur) => (cur === payload.text ? "" : cur)), 3500);
      }
    });
    return unsub;
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

  function toggleCam() {
    const next = !camEnabled;
    localStream?.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamEnabled(next);
  }

  function toggleSpeaker() {
    const next = !speakerEnabled;
    setSpeakerEnabled(next);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !next;
    }
  }

  async function flipCamera() {
    const nextFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextFacingMode);
    try {
      const constraints = { video: { facingMode: nextFacingMode } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newTrack = newStream.getVideoTracks()[0];
      if (replaceOutgoingVideoTrack && newTrack) {
        await replaceOutgoingVideoTrack(newTrack);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }
    } catch {
      // Ignore if device single camera
    }
  }

  function sendChatMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = chatDraft.trim();
    if (!text || connectionState !== "connected") return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    sendMessage<ChatPayload>("chat", { text });
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, mine: true, time: timeStr },
    ]);
    setChatDraft("");
  }

  function sendReaction(reactionId: ReactionId) {
    sendMessage<ReactionPayload>("reaction", { reactionId });
    const meta = EMOJI_REACTIONS.find((r) => r.id === reactionId);
    const emojiSymbol = meta ? meta.emoji : "🔥";

    const newParticle: FloatingParticle = {
      id: `${Date.now()}-${Math.random()}`,
      emoji: emojiSymbol,
      x: 25 + Math.random() * 50,
    };

    setFloatingParticles((prev) => [...prev.slice(-12), newParticle]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2500);

    // Keep reaction panel open continuously until explicit user tap!
  }

  const isConnected = connectionState === "connected";

  return (
    <div
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      onClick={resetControlsTimer}
      className="relative flex flex-col w-full h-[100dvh] overflow-hidden bg-[#070414] select-none"
    >
      {/* Dynamic Viewport Container */}
      <div className={`relative flex-1 w-full overflow-hidden flex ${chatOpen ? "flex-col sm:flex-row" : ""}`}>
        
        {/* Main Video Screen (Stranger's Video taking main stage) */}
        <div className={`relative flex-1 h-full w-full bg-black overflow-hidden ${chatOpen ? "h-[45%] sm:h-full" : "h-full"}`}>
          {isConnected && remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover object-center"
            />
          ) : (
            /* Radar Orb Matching Indicator */
            <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center bg-gradient-to-b from-[#140b2e] via-[#0d0722] to-[#070414]">
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
                {connectionState === "waiting" && "Looking for someone to chat with…"}
                {connectionState === "connecting" && "Establishing encrypted WebRTC connection…"}
                {connectionState === "disconnected" && "Stranger left the match."}
                {connectionState === "idle" && "Press Start to match with a stranger."}
              </p>
              <p className="text-xs text-purple-200/70 mt-1 max-w-sm">
                Vidibro matches you instantly with online strangers in HD video & encrypted audio.
              </p>
            </div>
          )}

          {/* Static Top-Left Vidibro Logo Badge (Overlapping video screen) */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex items-center gap-2 bg-black/65 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/15 shadow-xl">
            <div className="btn-gradient flex h-7 w-7 items-center justify-center rounded-xl shadow-md">
              <LogoMark size={14} className="text-white" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-white font-mono tracking-tight">Vidibro</span>
            <span className="h-3 w-px bg-white/20 mx-0.5" />
            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
            <span className="text-[10px] sm:text-xs font-medium text-purple-200">{isConnected ? "Stranger" : "Matching…"}</span>
          </div>

          {/* Floating Speech Subtitles */}
          {remoteSubtitle && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-[85%] z-20 rounded-2xl bg-black/80 backdrop-blur-md px-4 py-2 text-center text-xs sm:text-sm font-medium text-white border border-white/15">
              {remoteSubtitle}
            </div>
          )}

          {/* Floating 3D Animated Emoji Particles Burst */}
          {floatingParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 300, scale: 0.5, rotate: -15 }}
              animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.8, 1.5, 1.2], rotate: 15 }}
              transition={{ duration: 2.3, ease: "easeOut" }}
              className="pointer-events-none absolute bottom-16 z-40 text-5xl sm:text-6xl drop-shadow-[0_0_20px_rgba(236,72,153,0.9)]"
              style={{ left: `${particle.x}%` }}
            >
              {particle.emoji}
            </motion.div>
          ))}

          {/* Small Floating "You" PIP Card (Overlapping Top-Right Corner) */}
          <motion.div
            drag
            dragConstraints={{ top: 10, left: 10, right: 300, bottom: 400 }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-28 sm:w-44 aspect-video rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/20 bg-black shadow-2xl group cursor-grab active:cursor-grabbing"
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`h-full w-full object-cover ${!camEnabled ? "hidden" : ""}`}
            />
            {!camEnabled && (
              <div className="flex h-full w-full items-center justify-center bg-gray-900 text-xs text-gray-400 font-medium">
                Cam Off
              </div>
            )}

            {/* Flip Camera Button on Your PIP Video Box! */}
            <button
              onClick={flipCamera}
              className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-cyan-300 backdrop-blur-md border border-white/20 z-40 shadow-md transition transform hover:scale-110"
              aria-label="Flip Camera"
              title="Flip Camera"
            >
              <SwitchCamera size={12} />
            </button>

            {/* Persistent GMeet Mic Status Indicator on PIP Card */}
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-white border border-white/10">
              {micEnabled ? (
                <Mic size={10} className="text-emerald-400" />
              ) : (
                <MicOff size={10} className="text-red-400" />
              )}
              <span>You</span>
            </div>
          </motion.div>

          {/* Google Meet Floating Controls Bar (Perfectly aligned on all devices!) */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 bg-black/80 backdrop-blur-2xl px-4 py-2.5 rounded-full border border-white/15 shadow-2xl max-w-[95vw]"
              >
                {/* 1. Mute / Unmute Mic */}
                <button
                  onClick={toggleMic}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    micEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  }`}
                  aria-label="Toggle mic"
                  title={micEnabled ? "Mute Mic" : "Unmute Mic"}
                >
                  {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                {/* 2. Camera On / Off */}
                <button
                  onClick={toggleCam}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    camEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  }`}
                  aria-label="Toggle camera"
                  title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
                >
                  {camEnabled ? <VideoIcon size={18} /> : <VideoOff size={18} />}
                </button>

                {/* 3. Speaker Sound On / Off */}
                <button
                  onClick={toggleSpeaker}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    speakerEnabled ? "bg-white/15 hover:bg-white/25 text-purple-300" : "bg-red-500 text-white shadow-lg"
                  }`}
                  aria-label="Toggle speaker sound"
                  title={speakerEnabled ? "Mute Speaker Sound" : "Unmute Speaker Sound"}
                >
                  {speakerEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>

                {/* 4. 3D Emoji Reactions Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReactionsOpen((v) => !v);
                  }}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    reactionsOpen ? "bg-pink-500 text-white" : "bg-white/15 hover:bg-white/25 text-pink-300"
                  }`}
                  aria-label="Send reaction"
                  title="3D Emojis"
                >
                  <Sparkles size={18} />
                </button>

                {/* 5. Transparent Chat Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatOpen((v) => !v);
                    setUnreadCount(0);
                  }}
                  className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    chatOpen ? "bg-purple-600 text-white" : "bg-white/15 hover:bg-white/25 text-cyan-300"
                  }`}
                  aria-label="Toggle chat"
                  title="Chat"
                >
                  <MessageSquare size={18} />
                  {unreadCount > 0 && !chatOpen && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* 6. Next Person */}
                <button
                  onClick={skipToNext}
                  className="btn-gradient flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg hover:scale-105 transition"
                >
                  <SkipForward size={16} />
                  <span className="hidden sm:inline">Next</span>
                </button>

                {/* 7. End Call (RED CIRCLE ICON - NO TEXT!) */}
                <button
                  onClick={leaveMatch}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition transform hover:scale-105 active:scale-95"
                  aria-label="End call"
                  title="End call"
                >
                  <PhoneOff size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Animated Emoji Picker (Stays open for continuous tapping!) */}
          <AnimatePresence>
            {reactionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-black/90 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/20 shadow-2xl"
              >
                {EMOJI_REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => sendReaction(r.id)}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/25 text-2xl sm:text-3xl transition transform hover:scale-125 active:scale-90 shadow-md"
                    title={r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Google Meet Mobile & Desktop Transparent Chat Window */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              className={`z-30 flex flex-col bg-[#090518]/90 backdrop-blur-2xl border-purple-500/20 ${
                "w-full sm:w-80 lg:w-96 border-t sm:border-t-0 sm:border-l h-[55%] sm:h-full"
              }`}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-cyan-400" />
                  <span className="text-sm font-bold text-white">In-call messages</span>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="rounded-full p-1 text-purple-300 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Notice Banner */}
              <div className="mx-3 mt-3 flex items-center gap-2.5 rounded-2xl bg-white/5 border border-white/10 p-3 text-xs text-purple-200/90">
                <ShieldAlert size={16} className="text-cyan-400 shrink-0" />
                <span>Messages won't be saved when the call ends</span>
              </div>

              {/* Scrollable Messages Feed */}
              <div ref={chatListRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[140px]">
                {messages.length === 0 && (
                  <p className="pt-8 text-center text-xs text-purple-300/60">
                    {isConnected ? "Everyone will see your message" : "Waiting to match with a stranger…"}
                  </p>
                )}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-purple-300/60 px-1 mb-0.5">
                      <span>{m.mine ? "You" : "Stranger"}</span>
                      <span>• {m.time}</span>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        m.mine
                          ? "btn-gradient text-white rounded-br-none font-medium shadow-md"
                          : "bg-white/10 text-purple-100 rounded-bl-none border border-white/10 backdrop-blur-md"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Transparent Chat Input Bar */}
              <form onSubmit={sendChatMessage} className="p-3 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder={isConnected ? "Send message…" : "Waiting to connect…"}
                  disabled={!isConnected}
                  className="flex-1 rounded-full bg-white/5 border border-white/15 px-4 py-2 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!chatDraft.trim() || !isConnected}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full btn-gradient text-white shadow-md disabled:opacity-40 hover:scale-105 transition"
                  aria-label="Send"
                >
                  <Send size={14} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
