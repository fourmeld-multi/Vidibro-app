"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, MessageSquare, Mic, Volume2, ShieldCheck, Zap, Lock, Globe, Sparkles, Send, User } from "lucide-react";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

const SCENES = [
  { id: "video-call", label: "HD Video Match", icon: Video },
  { id: "text-chat", label: "Instant Text Chat", icon: MessageSquare },
  { id: "voice-room", label: "Encrypted Voice Call", icon: Mic },
] as const;

type SceneId = (typeof SCENES)[number]["id"];

function RealVideoMatchShowcase() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#080415] p-3 sm:p-5 border border-purple-500/30 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">● 1-on-1 WebRTC Live</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-200">
          <Sparkles size={13} className="text-pink-400" />
          <span className="text-[11px] bg-purple-500/20 px-2 py-0.5 rounded-full font-mono text-purple-200">60 FPS • Encrypted</span>
        </div>
      </div>

      {/* Dual Video Match Preview */}
      <div className="grid grid-cols-2 gap-3 h-[200px] sm:h-[220px]">
        {/* Stranger Screen */}
        <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1a0b36] via-[#100624] to-[#070314] shadow-md flex items-center justify-center p-3 text-center">
          <div className="relative flex flex-col items-center gap-2 z-10">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5 shadow-xl shadow-purple-500/30">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#180c33]">
                <User size={28} className="text-pink-300" />
              </div>
            </div>
            <span className="text-xs font-black text-white">Stranger</span>
            <span className="text-[10px] text-purple-300/80 bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-400/30">
              🎙️ Video & Audio Active
            </span>
          </div>
        </div>

        {/* Your Screen */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c1836] via-[#070e24] to-[#040817] shadow-md flex items-center justify-center p-3 text-center">
          <div className="relative flex flex-col items-center gap-2 z-10">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/30">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0b122b]">
                <User size={28} className="text-cyan-300" />
              </div>
            </div>
            <span className="text-xs font-black text-white">You</span>
            <span className="text-[10px] text-cyan-300/80 bg-cyan-900/60 px-2 py-0.5 rounded-full border border-cyan-400/30">
              📹 Local Camera Ready
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs">
        <span className="text-purple-200 font-medium">⚡ Instant Peer-to-Peer Connection</span>
        <span className="btn-gradient px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase">NEXT STRANGER</span>
      </div>
    </div>
  );
}

function RealTextChatShowcase() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#090518] p-4 border border-cyan-500/30 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-cyan-400" />
          <span className="text-xs font-bold text-white">Encrypted Text Chat</span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
          🟢 Stranger Connected
        </span>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 space-y-2.5 overflow-hidden py-1 text-xs">
        <div className="flex flex-col items-start">
          <span className="text-[9px] text-purple-300/60 px-1 mb-0.5">Stranger • 10:14 AM</span>
          <div className="rounded-2xl rounded-bl-none bg-white/10 border border-white/15 px-3.5 py-2 text-purple-100 max-w-[80%] shadow-md">
            Hey there! Where are you connecting from? 🌍
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] text-purple-300/60 px-1 mb-0.5">You • 10:14 AM</span>
          <div className="rounded-2xl rounded-br-none btn-gradient px-3.5 py-2 text-white font-medium max-w-[80%] shadow-md">
            Hey! Connecting from New York. How is your day going? ✨
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[9px] text-purple-300/60 px-1 mb-0.5">Stranger • 10:15 AM</span>
          <div className="text-4xl p-1 animate-bounce">
            🦄 🚀 💖
          </div>
        </div>
      </div>

      {/* Input mockup */}
      <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2.5">
        <input
          type="text"
          readOnly
          value="Type a message or send 3D stickers…"
          className="flex-1 rounded-full bg-white/5 border border-white/15 px-4 py-2 text-xs text-purple-300/60 outline-none cursor-default"
        />
        <div className="flex h-8 w-8 items-center justify-center rounded-full btn-gradient text-white shadow-md">
          <Send size={13} />
        </div>
      </div>
    </div>
  );
}

function RealVoiceRoomShowcase() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#070414] p-4 border border-pink-500/30 shadow-xl flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Mic size={16} className="text-pink-400" />
          <span className="text-xs font-bold text-white">Vidibro Voice Chat</span>
        </div>
        <span className="text-[10px] text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-500/30 font-mono">
          HD Audio • Low Latency
        </span>
      </div>

      {/* Voice Orb Central Visualizer */}
      <div className="flex flex-col items-center justify-center my-auto py-4 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full btn-gradient shadow-2xl shadow-pink-500/40 border-4 border-white/20 mb-3">
          <motion.span
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-pink-500/30 border border-pink-400/40"
          />
          <Volume2 size={32} className="text-white animate-pulse" />
        </div>
        <span className="text-sm font-black text-white tracking-wide">Voice Call Connected</span>
        <span className="text-[11px] text-purple-300/80 mt-0.5">Crystal-clear encrypted audio stream</span>
      </div>

      {/* Soundboard FX Row */}
      <div className="flex items-center justify-around border-t border-white/10 pt-2 text-xs">
        <span className="text-purple-200/80 text-[11px] font-medium">Interactive Sound FX:</span>
        <div className="flex gap-2">
          <span className="bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-sm">👏</span>
          <span className="bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-sm">😂</span>
          <span className="bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-sm">🔥</span>
          <span className="bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-sm">🎉</span>
        </div>
      </div>
    </div>
  );
}

export default function FeatureShowcase({ currentLang }: { currentLang: LanguageCode }) {
  const [activeScene, setActiveScene] = useState<SceneId>("video-call");
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  const FEATURES = [
    {
      icon: ShieldCheck,
      title: "100% Free & No Registration",
      desc: "Connect instantly without creating an account or sharing email address.",
    },
    {
      icon: Zap,
      title: "Instant 1-on-1 Matching",
      desc: "Smart WebRTC matching connects you with live strangers in under 1 second.",
    },
    {
      icon: Lock,
      title: "End-to-End Encrypted",
      desc: "Peer-to-peer encrypted video and audio streams ensure maximum privacy.",
    },
    {
      icon: Globe,
      title: "Global Community",
      desc: "Meet online people from all around the world in HD video, audio, or text.",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-20 border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Built for <span className="gradient-text">Authentic</span> Connections
        </h2>
        <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed">
          Vidibro delivers high-speed, peer-to-peer encrypted video, audio, and text chat with zero signup.
        </p>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {SCENES.map((scene) => {
            const Icon = scene.icon;
            const isActive = activeScene === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
                  isActive
                    ? "btn-gradient text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10"
                }`}
              >
                <Icon size={14} />
                <span>{scene.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        {/* Left Side: Live Scene Demo */}
        <div className="lg:col-span-7 h-[360px] sm:h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              {activeScene === "video-call" && <RealVideoMatchShowcase />}
              {activeScene === "text-chat" && <RealTextChatShowcase />}
              {activeScene === "voice-room" && <RealVoiceRoomShowcase />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Feature Grid */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition backdrop-blur-md"
            >
              <div className="btn-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md">
                <f.icon size={18} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-white mb-0.5">{f.title}</h3>
                <p className="text-xs text-purple-200/70 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
