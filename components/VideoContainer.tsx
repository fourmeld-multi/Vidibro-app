"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MessageSquare,
  SkipForward,
  Smile,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  SwitchCamera,
  Send,
  ShieldAlert,
} from "lucide-react";
import LogoMark from "@/components/LogoMark";
import type { MessageType, ChatPayload } from "@/lib/protocol";

const EMOJI_REACTIONS = [
  { id: "heart", emoji: "❤️", label: "Heart" },
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "laugh", emoji: "😂", label: "Laugh" },
  { id: "clap", emoji: "👏", label: "Clap" },
  { id: "party", emoji: "🎉", label: "Party" },
  { id: "star", emoji: "🤩", label: "Star" },
] as const;

type ReactionId = (typeof EMOJI_REACTIONS)[number]["id"];

type Props = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: "idle" | "waiting" | "connecting" | "connected" | "disconnected";
  dataChannelOpen: boolean;
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
  skipToNext: () => void;
  leaveMatch: () => void;
  isHost: boolean;
  replaceOutgoingVideoTrack?: (newTrack: MediaStreamTrack) => Promise<void>;
};

type ChatMessage = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

type ReactionPayload = {
  reactionId: ReactionId;
};

type SubtitlePayload = {
  text: string;
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
  skipToNext,
  leaveMatch,
  replaceOutgoingVideoTrack,
}: Props) {
  // Mobile Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Desktop Equal Split Grid Refs
  const desktopLocalVideoRef = useRef<HTMLVideoElement | null>(null);
  const desktopRemoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const chatListRef = useRef<HTMLDivElement | null>(null);
  const videoScreenRef = useRef<HTMLDivElement | null>(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);
  const [remoteSubtitle, setRemoteSubtitle] = useState<string | null>(null);

  // Camera Facing Mode Toggle (User / Front vs Environment / Back)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Controls Visibility (Auto-hides on tap)
  const [showControls, setShowControls] = useState(true);

  // Real-Time Audio Level Detection for Speaking Visualizer
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Web Audio API Voice Speech Detector
  useEffect(() => {
    if (!localStream || !micEnabled) return;

    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack || !audioTrack.enabled) return;

    let audioContext: AudioContext | null = null;
    let animationId: number | null = null;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      const source = audioContext.createMediaStreamSource(localStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Sensitivity threshold for detecting user speech
        setIsSpeaking(average > 10);
        animationId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch {
      // Ignore if Web Audio API unavailable
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
      setIsSpeaking(false);
    };
  }, [localStream, micEnabled]);

  // Attach Streams to Mobile & Desktop Video Elements
  useEffect(() => {
    if (localStream) {
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (desktopLocalVideoRef.current) desktopLocalVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Browsers block autoplay of unmuted media without a fresh user gesture —
  // start every remote element muted (always allowed) so playback actually
  // begins, then unmute once it's confirmed playing. Muting/unmuting an
  // already-playing element doesn't need a new gesture, unlike starting one.
  useEffect(() => {
    if (!remoteStream) return;
    for (const el of [remoteVideoRef.current, desktopRemoteVideoRef.current]) {
      if (!el) continue;
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
    }
    // Only (re)attach the stream itself here — speakerEnabled is handled by
    // the effect below so toggling it doesn't restart playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteStream]);

  useEffect(() => {
    if (remoteVideoRef.current) remoteVideoRef.current.muted = !speakerEnabled;
    if (desktopRemoteVideoRef.current) desktopRemoteVideoRef.current.muted = !speakerEnabled;
  }, [speakerEnabled]);

  // Listen for incoming chat messages over WebRTC
  useEffect(() => {
    const unsub = subscribe("chat", (msg) => {
      const payload = msg.payload as ChatPayload;
      const textStr = payload.text || "";
      if (!textStr) return;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, text: textStr, mine: false, time: timeStr },
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

      const t = setTimeout(() => setRemoteSubtitle(null), 4000);
      return () => clearTimeout(t);
    });
    return unsub;
  }, [subscribe]);

  // Auto-scroll chat message feed
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
    if (remoteVideoRef.current) remoteVideoRef.current.muted = !next;
    if (desktopRemoteVideoRef.current) desktopRemoteVideoRef.current.muted = !next;
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
      if (localVideoRef.current) localVideoRef.current.srcObject = newStream;
      if (desktopLocalVideoRef.current) desktopLocalVideoRef.current.srcObject = newStream;
    } catch {
      // Ignore if single camera device
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

    // sendReaction only ever runs from the emoji button's onClick — never
    // during render — so the randomized horizontal drift here is safe
    // despite the purity rule's static (render-agnostic) heuristic.
    /* eslint-disable react-hooks/purity */
    const newParticle: FloatingParticle = {
      id: crypto.randomUUID(),
      emoji: emojiSymbol,
      x: 25 + Math.random() * 50,
    };
    /* eslint-enable react-hooks/purity */

    setFloatingParticles((prev) => [...prev.slice(-12), newParticle]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2500);
  }

  const isConnected = connectionState === "connected";

  return (
    <div className="relative flex flex-col w-full h-[100dvh] overflow-hidden bg-[#070414] select-none">
      {/* Viewport Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-row">
        
        {/* Main Video Viewport Wrapper */}
        <div className="relative flex-1 h-full w-full overflow-hidden flex flex-col">
          
          {/* ========================================================================= */}
          {/* 1. DESKTOP VIEW: Dual Equal 50/50 Side-by-Side Video Grid (md:grid)      */}
          {/* ========================================================================= */}
          <div
            onClick={() => setShowControls((prev) => !prev)}
            className="hidden md:grid grid-cols-2 gap-4 p-4 w-full h-full bg-[#070414] overflow-hidden cursor-pointer"
          >
            {/* Left Box (50% Equal Width): Stranger's Video */}
            <div className="relative h-full w-full rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
              {isConnected && remoteStream ? (
                <video
                  ref={desktopRemoteVideoRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover object-center pointer-events-none"
                />
              ) : (
                /* Radar Orb Matching Indicator */
                <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center bg-gradient-to-b from-[#140b2e] via-[#0d0722] to-[#070414] pointer-events-none">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-purple-600/20 border border-purple-400/30 mb-4">
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
                      <Sparkles className="text-white animate-spin-slow" size={24} />
                    </div>
                  </div>
                  <p className="text-xl font-black text-white tracking-wide">
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

              {/* Top-Left Stranger Name Badge */}
              <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/65 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/15 shadow-xl">
                <span className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
                <span className="text-xs font-bold text-white">Stranger</span>
              </div>

              {/* Top-Right Speaker Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSpeaker();
                }}
                className={`absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full transition border border-white/20 shadow-2xl backdrop-blur-xl ${
                  speakerEnabled ? "bg-black/75 hover:bg-black/90 text-purple-300" : "bg-red-500 text-white"
                }`}
                title={speakerEnabled ? "Mute Speaker" : "Unmute Speaker"}
              >
                {speakerEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>

            {/* Right Box (50% Equal Width): Your Video */}
            <div className="relative h-full w-full rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
              <video
                ref={desktopLocalVideoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover pointer-events-none ${!camEnabled ? "hidden" : ""}`}
              />
              {!camEnabled && (
                <div className="flex flex-col items-center justify-center h-full w-full bg-gray-950 text-purple-300/60 font-medium">
                  <VideoOff size={36} className="mb-2 text-purple-400/40" />
                  <span>Camera Turned Off</span>
                </div>
              )}

              {/* Top-Left You Badge on Your Video Screen */}
              <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/65 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/15 shadow-xl">
                {micEnabled ? (
                  <Mic size={14} className="text-emerald-400" />
                ) : (
                  <MicOff size={14} className="text-red-400" />
                )}
                <span className="text-xs font-bold text-white">You</span>
                
                {/* Real-time speaking animated audio sound waves on your video screen */}
                {isSpeaking && micEnabled && (
                  <div className="flex items-end gap-0.5 h-3 ml-1">
                    <span className="w-0.5 h-full bg-emerald-400 animate-bounce rounded-full" />
                    <span className="w-0.5 h-2/3 bg-emerald-400 animate-pulse rounded-full" />
                    <span className="w-0.5 h-full bg-emerald-400 animate-bounce rounded-full" />
                  </div>
                )}
              </div>

              {/* Top-Right Flip Camera Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  flipCamera();
                }}
                className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 hover:bg-black/95 text-cyan-300 backdrop-blur-xl border border-white/20 shadow-2xl transition transform hover:scale-110"
                title="Flip Camera"
              >
                <SwitchCamera size={18} />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. MOBILE VIEW: Full-stage Stranger Video + Draggable PIP (md:hidden)    */}
          {/* ========================================================================= */}
          <div ref={videoScreenRef} className="md:hidden relative flex-1 h-full w-full bg-black overflow-hidden">
            {isConnected && remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover object-center pointer-events-none"
              />
            ) : (
              /* Radar Orb Matching Indicator */
              <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center bg-gradient-to-b from-[#140b2e] via-[#0d0722] to-[#070414] pointer-events-none">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20 border border-purple-400/30 mb-3">
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
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full btn-gradient shadow-xl shadow-purple-500/40">
                    <Sparkles className="text-white animate-spin-slow" size={22} />
                  </div>
                </div>

                <p className="text-sm font-black text-white tracking-wide">
                  {connectionState === "waiting" && "Looking for someone to chat with…"}
                  {connectionState === "connecting" && "Establishing encrypted WebRTC connection…"}
                  {connectionState === "disconnected" && "Stranger left the match."}
                  {connectionState === "idle" && "Press Start to match with a stranger."}
                </p>
                <p className="text-[11px] text-purple-200/70 mt-1 max-w-sm">
                  Vidibro matches you instantly with online strangers in HD video & encrypted audio.
                </p>
              </div>
            )}

            {/* Clean Screen Tap Overlay */}
            <div
              onClick={() => setShowControls((prev) => !prev)}
              className="absolute inset-0 z-10 cursor-pointer"
            />

            {/* Static Top-Left Vidibro Logo Badge */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-black/65 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/15 shadow-xl pointer-events-none">
              <div className="btn-gradient flex h-7 w-7 items-center justify-center rounded-xl shadow-md">
                <LogoMark size={14} className="text-white" />
              </div>
              <span className="text-xs font-bold text-white font-mono tracking-tight">Vidibro</span>
              <span className="h-3 w-px bg-white/20 mx-0.5" />
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`} />
              <span className="text-[10px] font-medium text-purple-200">{isConnected ? "Stranger" : "Matching…"}</span>
            </div>

            {/* SPEAKER SOUND TOGGLE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSpeaker();
              }}
              className={`absolute top-3 right-3 z-50 flex h-10 w-10 items-center justify-center rounded-full transition border border-white/20 shadow-2xl backdrop-blur-xl ${
                speakerEnabled ? "bg-black/75 hover:bg-black/90 text-purple-300" : "bg-red-500 text-white"
              }`}
              title={speakerEnabled ? "Mute Speaker" : "Unmute Speaker"}
            >
              {speakerEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Floating Speech Subtitles */}
            {remoteSubtitle && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-[85%] z-20 rounded-2xl bg-black/80 backdrop-blur-md px-4 py-2 text-center text-xs font-medium text-white border border-white/15 pointer-events-none">
                {remoteSubtitle}
              </div>
            )}

            {/* DRAGGABLE "YOU" PIP CARD (MOBILE) */}
            <motion.div
              drag
              dragConstraints={videoScreenRef}
              dragElastic={0.05}
              dragMomentum={false}
              className="absolute top-16 right-3 z-30 w-36 aspect-video rounded-xl overflow-hidden border-2 border-white/20 bg-black shadow-2xl group cursor-grab active:cursor-grabbing"
            >
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`h-full w-full object-cover pointer-events-none ${!camEnabled ? "hidden" : ""}`}
              />
              {!camEnabled && (
                <div className="flex h-full w-full items-center justify-center bg-gray-900 text-xs text-gray-400 font-medium pointer-events-none">
                  Cam Off
                </div>
              )}

              {/* Flip Camera Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  flipCamera();
                }}
                className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-cyan-300 backdrop-blur-md border border-white/20 z-40 shadow-md"
                title="Flip Camera"
              >
                <SwitchCamera size={11} />
              </button>

              {/* Mic Indicator on Mobile PIP Screen */}
              <div className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[8px] font-bold text-white border border-white/10 pointer-events-none">
                {micEnabled ? <Mic size={9} className="text-emerald-400" /> : <MicOff size={9} className="text-red-400" />}
                <span>You</span>
                {isSpeaking && micEnabled && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce ml-0.5" />}
              </div>
            </motion.div>
          </div>

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

          {/* Floating Controls Bar (Standard Mic Button - No Green Pulse!) */}
          <AnimatePresence>
            {showControls && !chatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 bg-black/80 backdrop-blur-2xl px-4 py-2.5 rounded-full border border-white/15 shadow-2xl max-w-[95vw]"
              >
                {/* 1. Mic Mute / Unmute (Standard Clean Styling) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMic();
                  }}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    micEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500 text-white shadow-lg"
                  }`}
                  title={micEnabled ? "Mute Mic" : "Unmute Mic"}
                >
                  {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                {/* 2. Cam On / Off */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCam();
                  }}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    camEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500 text-white shadow-lg"
                  }`}
                  title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
                >
                  {camEnabled ? <VideoIcon size={18} /> : <VideoOff size={18} />}
                </button>

                {/* 3. Centered NEXT Text Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipToNext();
                  }}
                  className="btn-gradient flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold text-white shadow-xl hover:scale-105 transition tracking-wider uppercase gap-1.5"
                >
                  <SkipForward size={14} /> NEXT
                </button>

                {/* 4. Emoji Reaction Picker Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReactionsOpen((v) => !v);
                  }}
                  className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    reactionsOpen ? "bg-pink-500 text-white" : "bg-white/15 hover:bg-white/25 text-pink-300"
                  }`}
                  title="Send Emoji Reaction"
                >
                  <Smile size={18} />
                </button>

                {/* 5. In-Call Chat Drawer Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatOpen((v) => !v);
                    setUnreadCount(0);
                  }}
                  className={`relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition ${
                    chatOpen ? "bg-purple-600 text-white" : "bg-white/15 hover:bg-white/25 text-cyan-300"
                  }`}
                  title="In-call Chat"
                >
                  <MessageSquare size={18} />
                  {unreadCount > 0 && !chatOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* 6. End Call Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    leaveMatch();
                  }}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition transform hover:scale-105 active:scale-95"
                  title="Leave Call"
                >
                  <PhoneOff size={18} className="rotate-[135deg]" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emoji Reactions Tray Popup */}
          <AnimatePresence>
            {reactionsOpen && showControls && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.9 }}
                className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/85 backdrop-blur-2xl px-4 py-2.5 rounded-full border border-white/20 shadow-2xl"
              >
                {EMOJI_REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      sendReaction(r.id);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/25 text-2xl transition transform hover:scale-125 active:scale-90"
                    title={r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Flex Panel / Mobile Floating Drawer */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto md:w-80 lg:w-96 h-[60%] md:h-full z-40 flex flex-col bg-[#090518]/95 backdrop-blur-3xl border-t md:border-t-0 md:border-l border-white/15 shadow-2xl flex-shrink-0"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-cyan-400" />
                  <span className="text-sm font-bold text-white">In-call messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={skipToNext}
                    className="btn-gradient px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-md flex items-center gap-1"
                  >
                    <SkipForward size={12} /> NEXT
                  </button>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="rounded-full p-1 text-purple-300 hover:bg-white/10 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="mx-3 mt-3 flex items-center gap-2.5 rounded-2xl bg-white/5 border border-white/10 p-3 text-xs text-purple-200/90">
                <ShieldAlert size={16} className="text-cyan-400 shrink-0" />
                <span>Messages won&apos;t be saved when the call ends</span>
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
