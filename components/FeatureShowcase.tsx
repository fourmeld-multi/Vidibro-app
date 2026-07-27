"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Video, MessageSquare, Mic, Volume2, Radio, Send, Shield } from "lucide-react";

const SCENES = [
  { id: "video-call", label: "Video Call", icon: Video, durationMs: 5000 },
  { id: "text-chat", label: "Text Chat", icon: MessageSquare, durationMs: 5000 },
  { id: "voice-room", label: "Voice Room", icon: Mic, durationMs: 5000 },
] as const;

type SceneId = (typeof SCENES)[number]["id"];

/* -------------------------------------------------------------------------- */
/* 5-SEC REAL VIDEO LOOP 1: Boy & Girl Video Calling & Talking                */
/* -------------------------------------------------------------------------- */
function VideoLoopCall() {
  const [seconds, setSeconds] = useState(1);
  const [speaker, setSpeaker] = useState<"girl" | "boy">("girl");

  // Video timer + alternating speaker state (Girl & Boy talking to each other)
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s >= 5 ? 1 : s + 1));
    }, 1000);

    const speakerTimer = setInterval(() => {
      setSpeaker((prev) => (prev === "girl" ? "boy" : "girl"));
    }, 2200);

    return () => {
      clearInterval(timer);
      clearInterval(speakerTimer);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#090518] p-3 sm:p-5 border border-purple-500/30 shadow-xl">
      {/* Top Video Player HUD Status Bar */}
      <div className="flex items-center justify-between mb-2.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] sm:text-xs z-20 relative">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold text-white uppercase tracking-wider font-mono">● LIVE STREAM</span>
          <span className="text-purple-300 font-mono">00:0{seconds} / 00:05</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-200">
          <Radio size={12} className="text-emerald-400 animate-pulse" />
          <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full font-mono">60 FPS • HD</span>
        </div>
      </div>

      {/* Dual Video Stream Grid (Boy & Girl Talking Live) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 h-[185px] sm:h-[220px]">
        {/* Girl Video Stream (Emma) */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-purple-400/30 shadow-md">
          <motion.div
            animate={{
              scale: speaker === "girl" ? [1, 1.06, 1.02, 1.05] : [1, 1.02, 1],
              x: speaker === "girl" ? [0, -3, 2, 0] : [0, 1, 0],
              y: speaker === "girl" ? [0, -2, 1, 0] : [0, 0, 0],
            }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src="/images/girl_call.png"
              alt="Girl talking on video call"
              fill
              className="object-cover object-center"
            />
          </motion.div>

          {/* Dynamic Light Reflection Flare */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-white border border-white/10">
            Emma (Stranger)
          </span>

          {speaker === "girl" ? (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-purple-900/80 px-2 py-0.5 rounded-md text-[9px] text-purple-200 border border-purple-400/30 backdrop-blur-xs">
              <Volume2 size={10} className="text-purple-300 animate-bounce" />
              <span>Talking to Alex…</span>
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 text-[9px] text-purple-300/70 font-mono bg-black/40 px-1.5 py-0.5 rounded">
              Listening…
            </div>
          )}
        </div>

        {/* Boy Video Stream (Alex) */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-indigo-400/30 shadow-md">
          <motion.div
            animate={{
              scale: speaker === "boy" ? [1, 1.06, 1.02, 1.05] : [1, 1.01, 1],
              x: speaker === "boy" ? [0, 3, -2, 0] : [0, 0, 0],
              y: speaker === "boy" ? [0, -2, 1, 0] : [0, 0, 0],
            }}
            transition={{ repeat: Infinity, duration: 3.1, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src="/images/boy_call.png"
              alt="Boy talking on video call"
              fill
              className="object-cover object-center"
            />
          </motion.div>

          {/* Dynamic Light Reflection Flare */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-purple-200 border border-white/10">
            Alex (You)
          </span>

          {speaker === "boy" ? (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-indigo-900/80 px-2 py-0.5 rounded-md text-[9px] text-cyan-200 border border-indigo-400/30 backdrop-blur-xs">
              <Volume2 size={10} className="text-cyan-300 animate-bounce" />
              <span>Talking to Emma…</span>
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 text-[9px] text-purple-300/70 font-mono bg-black/40 px-1.5 py-0.5 rounded">
              Listening…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5-SEC REAL VIDEO LOOP 2: One Person Holding Phone & Texting Live           */
/* -------------------------------------------------------------------------- */
function VideoLoopChat() {
  const initialMessages = [
    { id: 1, mine: false, text: "Hey! What's up? 👋" },
    { id: 2, mine: true, text: "Hey! Loving this fast chat app!" },
  ];

  const loopMessages = [
    { id: 3, mine: false, text: "Right? No signup needed is awesome! 🔥" },
    { id: 4, mine: true, text: "100%! Matching is instant." },
  ];

  const [messages, setMessages] = useState(initialMessages);

  // Auto-typing message loop simulation
  useEffect(() => {
    let step = 0;
    const timer = setInterval(() => {
      if (step < loopMessages.length) {
        const nextMsg = loopMessages[step];
        if (nextMsg) {
          setMessages((prev) => [...prev.filter(Boolean), nextMsg]);
        }
        step++;
      } else {
        setMessages(initialMessages);
        step = 0;
      }
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a0518] p-3 sm:p-5 border border-indigo-500/30 shadow-xl">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 h-full items-center">
        {/* Left: Person holding mobile in hand texting live */}
        <div className="relative sm:col-span-5 hidden sm:block overflow-hidden rounded-2xl border border-white/10 h-[210px]">
          <motion.div
            animate={{ scale: [1, 1.04, 1], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image src="/images/chat_person.png" alt="Person holding phone texting" fill className="object-cover" />
          </motion.div>
          
          {/* Animated screen glow reflection */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-purple-500/20 pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-indigo-500/40 px-2 py-0.5 rounded-full border border-indigo-400/30 backdrop-blur-xs">
            ● Person Texting Live
          </span>
        </div>

        {/* Right: Scrolling messages container */}
        <div className="relative sm:col-span-7 flex flex-col justify-between h-[210px] bg-[#120a28] rounded-xl sm:rounded-2xl p-3 border border-white/10">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] sm:text-xs">
            <span className="font-bold text-white">Stranger</span>
            <span className="text-emerald-400 font-mono animate-pulse">● Live Chat</span>
          </div>

          <div className="flex-1 overflow-y-auto my-2 space-y-1.5 pr-1">
            {messages.filter(Boolean).map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m?.mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-1.5 text-[11px] sm:text-xs ${
                    m?.mine ? "btn-gradient text-white" : "bg-white/10 text-purple-100 border border-white/10"
                  }`}
                >
                  {m?.text}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              readOnly
              value="Type a message to stranger…"
              className="w-full rounded-lg bg-white/5 border border-white/15 px-3 py-1.5 text-[10px] text-purple-300/60"
            />
            <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg btn-gradient text-white">
              <Send size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5-SEC REAL VIDEO LOOP 3: Two Persons Audio Chat                            */
/* -------------------------------------------------------------------------- */
function VideoLoopVoice() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#070414] p-3 sm:p-5 border border-cyan-500/30 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between bg-black/40 px-3 py-1 rounded-xl border border-white/10 text-[10px]">
        <div className="flex items-center gap-1.5">
          <Mic size={12} className="text-cyan-400 animate-pulse" />
          <span className="font-bold text-white">TWO PERSONS VOICE ROOM</span>
        </div>
        <span className="text-cyan-300 font-mono">Encrypted</span>
      </div>

      <div className="my-2 flex items-center justify-center gap-6 sm:gap-12 py-3">
        {/* Person 1 Avatar */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="absolute inset-0 rounded-full bg-cyan-400/40"
            />
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-cyan-400 shadow-md">
              <Image src="/images/girl_call.png" alt="Voice User 1" fill className="object-cover" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-white">Emma</span>
        </div>

        {/* Audio Spectrum */}
        <div className="flex items-end gap-1 h-12 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
          {[14, 28, 40, 18, 48, 30, 15, 38, 52, 24].map((h, i) => (
            <motion.span
              key={i}
              animate={{ height: [`${h * 0.3}px`, `${h * 0.8}px`, `${h * 0.3}px`] }}
              transition={{ repeat: Infinity, duration: 0.5 + (i % 4) * 0.1, ease: "easeInOut" }}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-purple-400"
            />
          ))}
        </div>

        {/* Person 2 Avatar */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <motion.span
              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="absolute inset-0 rounded-full bg-pink-400/40"
            />
            <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-pink-400 shadow-md">
              <Image src="/images/boy_call.png" alt="Voice User 2" fill className="object-cover" />
            </div>
          </div>
          <span className="text-[10px] font-bold text-white">Alex</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-purple-200">
        <Shield size={12} className="text-emerald-400" />
        <span>Voice Connected • High Definition Audio</span>
      </div>
    </div>
  );
}

const PREVIEWS: Record<SceneId, () => React.JSX.Element> = {
  "video-call": VideoLoopCall,
  "text-chat": VideoLoopChat,
  "voice-room": VideoLoopVoice,
};

export default function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentScene = SCENES[activeIndex];
  const ActiveComponent = PREVIEWS[currentScene.id];

  // Auto-advancing Carousel (Advances every 5s)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCENES.length);
    }, currentScene.durationMs);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused, currentScene.durationMs]);

  return (
    <section className="relative mx-auto w-full max-w-3xl px-3 sm:px-6 py-10 sm:py-16">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-[90%] rounded-full bg-purple-600/10 blur-[90px]" />

      {/* Clean Header */}
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Everything happens <span className="gradient-text">live, together</span>
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-purple-200/80">
          Auto-advancing 5-second previews of Video Call, Text Chat, and Voice Rooms.
        </p>
      </div>

      {/* Clean Short Tab Pills */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {SCENES.map((scene, index) => {
          const Icon = scene.icon;
          const isActive = activeIndex === index;

          return (
            <button
              key={scene.id}
              onClick={() => {
                setActiveIndex(index);
                setIsPaused(false);
              }}
              className={`relative overflow-hidden flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "btn-gradient text-white shadow-md scale-105"
                  : "glass-pill text-purple-200/70 hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{scene.label}</span>

              {/* Progress fill bar */}
              {isActive && !isPaused && (
                <motion.div
                  key={activeIndex}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: scene.durationMs / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 5-Sec Video Viewport Frame */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="mt-5 relative mx-auto w-full max-w-2xl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
