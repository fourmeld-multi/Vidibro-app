"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Video as VideoIcon, PhoneOff, MessageSquare, Volume2, Sparkles, Shield, User, Globe, Flame } from "lucide-react";

export default function PhoneMockup() {
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [activeTab, setActiveTab] = useState<"video" | "audio">("video");

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking((prev) => !prev);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[270px] sm:max-w-[320px] items-center justify-center perspective-1000 py-3 sm:py-6 overflow-visible">
      {/* Background Neon Glow */}
      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-cyan-500/25 blur-3xl pointer-events-none animate-pulse" />

      {/* Main 3D Tilted Smartphone Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateY: -10, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateY: -6, rotateX: 3 }}
        whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative z-10 w-full preserve-3d phone-3d-shadow rounded-[2.5rem] sm:rounded-[3rem] border-[3px] border-purple-400/40 bg-[#0e0722]/95 p-3 sm:p-4 backdrop-blur-2xl"
      >
        {/* Shiny Edge Highlight */}
        <div className="absolute -inset-[1px] rounded-[2.5rem] sm:rounded-[3rem] border border-white/20 pointer-events-none" />

        {/* Dynamic Island Notch */}
        <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-30 flex h-3.5 sm:h-4 w-20 sm:w-24 items-center justify-between rounded-full bg-black px-2.5 shadow-inner border border-white/10">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-900" />
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="relative overflow-hidden rounded-[1.8rem] sm:rounded-[2.4rem] bg-[#070414] text-white">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 pt-3 pb-2 text-[10px] sm:text-[11px] font-medium z-20 relative border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight font-mono">Vidibro</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-1 text-purple-200">
              <Globe size={11} className="text-cyan-400" />
              <span className="text-[9px] font-mono text-purple-300">Instant HD</span>
            </div>
          </div>

          {/* Dual 50/50 Video Call Interface */}
          <div className="flex flex-col gap-2 p-2 sm:p-2.5">
            {/* Top Video Frame: Stranger */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1a0c36] via-[#110726] to-[#080315] shadow-lg">
              {/* Dynamic Animated Avatar Representation */}
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                {/* Background Ambient Wave */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-500/20 to-transparent"
                />

                {/* Avatar Icon Card */}
                <div className="relative flex flex-col items-center gap-1.5 z-10">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-xl shadow-purple-500/40 border-2 border-white/30">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#180d33]">
                      <User size={30} className="text-pink-300" />
                    </div>
                  </div>
                  <span className="text-xs font-black text-white tracking-wide">Stranger (Online)</span>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 border border-white/15">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-white">Match Connected</span>
              </div>

              {isSpeaking && (
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-pink-500/80 backdrop-blur-md px-2 py-0.5 border border-pink-300/40">
                  <Volume2 size={10} className="text-white animate-bounce" />
                  <span className="text-[9px] text-white font-mono font-bold">Speaking…</span>
                </div>
              )}
            </div>

            {/* Bottom Video Frame: You */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c1836] via-[#070e24] to-[#040817] shadow-lg">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-tr from-cyan-600/30 via-purple-500/20 to-transparent"
                />

                <div className="relative flex flex-col items-center gap-1.5 z-10">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/40 border-2 border-white/30">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0b122b]">
                      <User size={30} className="text-cyan-300" />
                    </div>
                  </div>
                  <span className="text-xs font-black text-white tracking-wide">You (Cam Active)</span>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 border border-white/15">
                <Mic size={10} className="text-emerald-400" />
                <span className="text-[10px] font-bold text-white">Mic On</span>
              </div>
            </div>
          </div>

          {/* Bottom Call Actions Bar */}
          <div className="flex items-center justify-around border-t border-white/10 bg-black/80 backdrop-blur-2xl p-2.5">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white border border-white/15">
              <Mic size={15} />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white border border-white/15">
              <VideoIcon size={15} />
            </button>
            <div className="btn-gradient px-4 py-1.5 rounded-full text-xs font-extrabold text-white shadow-lg uppercase tracking-wider">
              NEXT
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
              <PhoneOff size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
