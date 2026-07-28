"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Video, MessageSquare, Mic, Volume2, Radio, Send, Shield, Zap, Lock, Globe, Smartphone } from "lucide-react";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

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
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#090518] p-3 sm:p-5 border border-purple-500/30 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[10px] sm:text-xs z-20 relative">
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

      <div className="grid grid-cols-2 gap-2 sm:gap-3 h-[180px] sm:h-[200px]">
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
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a0518] p-3 sm:p-5 border border-indigo-500/30 shadow-xl flex flex-col justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 h-[225px] sm:h-[235px] items-center">
        <div className="relative sm:col-span-5 hidden sm:block overflow-hidden rounded-2xl border border-white/10 h-full">
          <motion.div
            animate={{ scale: [1, 1.04, 1], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image src="/images/chat_person.png" alt="Person holding phone texting" fill className="object-cover" />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-indigo-500/40 px-2 py-0.5 rounded-full border border-indigo-400/30 backdrop-blur-xs">
            ● Person Texting Live
          </span>
        </div>

        <div className="relative sm:col-span-7 flex flex-col justify-between h-full bg-[#120a28] rounded-xl sm:rounded-2xl p-3 border border-white/10">
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

      <div className="my-auto flex items-center justify-center gap-6 sm:gap-12 py-3">
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

type Props = {
  currentLang?: LanguageCode;
};

export default function FeatureShowcase({ currentLang = "EN" }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const currentScene = SCENES[activeIndex];
  const ActiveComponent = PREVIEWS[currentScene.id];

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCENES.length);
    }, currentScene.durationMs);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused, currentScene.durationMs]);

  return (
    <section className="relative mx-auto w-full max-w-5xl px-3 sm:px-6 py-10 sm:py-16 space-y-16">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-[90%] rounded-full bg-purple-600/10 blur-[90px]" />

      {/* 1. Carousel Feature Preview */}
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.featureTitle1} <span className="gradient-text">{t.featureTitle2}</span>
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-purple-200/80">
          {t.featureSubtitle}
        </p>

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

        {/* FIXED HEIGHT CONTAINER (h-[265px] sm:h-[300px]) so switching tabs NEVER pushes content down! */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-5 relative mx-auto w-full max-w-2xl h-[265px] sm:h-[300px] flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 2. WHY VIDIBRO IS THE BEST FREE TOOL (Dynamic Language Translation) */}
      <div className="w-full pt-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
          {t.whyTitle1} <span className="gradient-text">{t.whyTitle2}</span>
        </h2>
        <p className="text-sm text-purple-200/80 max-w-md mx-auto mb-8 font-medium">
          {t.whySubtitle}
        </p>

        {/* 4 Feature Cards with Dynamic Language Translation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          {/* Card 1: Instant Processing */}
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-start hover:scale-[1.02] transition min-h-[170px]">
            <div className="h-10 w-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 mb-4 shadow-md">
              <Zap size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">{t.card1Title}</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              {t.card1Desc}
            </p>
          </div>

          {/* Card 2: Private & Secure */}
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-start hover:scale-[1.02] transition min-h-[170px]">
            <div className="h-10 w-10 rounded-2xl bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center text-emerald-300 mb-4 shadow-md">
              <Lock size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">{t.card2Title}</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              {t.card2Desc}
            </p>
          </div>

          {/* Card 3: 2.5 Million+ Users */}
          <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-start hover:scale-[1.02] transition min-h-[170px]">
            <div className="h-10 w-10 rounded-2xl bg-cyan-400/20 border border-cyan-300/40 flex items-center justify-center text-cyan-300 mb-4 shadow-md">
              <Globe size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">{t.card3Title}</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              {t.card3Desc}
            </p>
          </div>

          {/* Card 4: Works on Any Device */}
          <div className="bg-pink-500/10 border border-pink-400/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-start hover:scale-[1.02] transition min-h-[170px]">
            <div className="h-10 w-10 rounded-2xl bg-pink-400/20 border border-pink-300/40 flex items-center justify-center text-pink-300 mb-4 shadow-md">
              <Smartphone size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">{t.card4Title}</h3>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              {t.card4Desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
