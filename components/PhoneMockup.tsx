"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mic, Video as VideoIcon, PhoneOff, MessageSquare, Volume2, Sparkles, Radio } from "lucide-react";

/**
 * 3D Smartphone Mockup with 60 FPS dynamic video stream movement.
 */
export default function PhoneMockup() {
  const [isGirlSpeaking, setIsGirlSpeaking] = useState(true);

  // Alternate speaking status between Girl and Boy to simulate real conversation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGirlSpeaking((prev) => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[250px] sm:max-w-[300px] items-center justify-center perspective-1000 py-3 sm:py-6 overflow-visible">
      {/* Background glow */}
      <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600/25 via-pink-500/20 to-indigo-600/25 blur-2xl pointer-events-none" />

      {/* Main 3D Tilted Smartphone Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateY: -10, rotateX: 6 }}
        animate={{ opacity: 1, y: 0, rotateY: -8, rotateX: 4 }}
        whileHover={{ rotateY: -2, rotateX: 2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-10 w-full preserve-3d phone-3d-shadow rounded-[2.2rem] sm:rounded-[2.8rem] border-[2px] sm:border-[3px] border-purple-400/30 bg-[#160c2c]/95 p-2.5 sm:p-3.5 backdrop-blur-2xl"
      >
        {/* Shiny border highlight */}
        <div className="absolute -inset-[1px] rounded-[2.2rem] sm:rounded-[2.8rem] border border-white/15 pointer-events-none" />

        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-30 flex h-3 sm:h-3.5 w-16 sm:w-20 items-center justify-between rounded-full bg-black px-2 shadow-inner">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-900" />
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="relative overflow-hidden rounded-[1.7rem] sm:rounded-[2.2rem] bg-[#0c071e] text-white">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between px-3 sm:px-5 pt-2.5 pb-1 text-[9px] sm:text-[10px] font-medium opacity-80 z-20 relative">
            <span className="font-semibold tracking-tight">Vidibro Live</span>
            <div className="flex items-center gap-1 text-purple-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px]">Connected</span>
            </div>
          </div>

          {/* Dual Video Call Interface (Live Talking Movement) */}
          <div className="flex flex-col gap-1.5 p-1.5 sm:p-2">
            {/* Girl Video Frame (Emma) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-purple-500/20">
              {/* Dynamic Video Pan & Zoom Camera Shake */}
              <motion.div
                animate={{
                  scale: isGirlSpeaking ? [1, 1.06, 1.02, 1.05] : [1, 1.02, 1],
                  x: isGirlSpeaking ? [0, -2, 2, 0] : [0, 1, 0],
                  y: isGirlSpeaking ? [0, -1, 1, 0] : [0, 0, 0],
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src="/images/girl_call.png"
                  alt="Girl talking on video call"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </motion.div>

              {/* Dynamic Video Lighting Reflection Sweep */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] sm:text-[10px] font-medium text-white">Emma</span>
              </div>

              {/* Speaking Indicator */}
              {isGirlSpeaking && (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-purple-900/80 backdrop-blur-md px-1.5 py-0.5 border border-purple-400/30">
                  <Volume2 size={10} className="text-purple-300 animate-bounce" />
                  <span className="text-[8px] text-purple-200 font-mono">Talking…</span>
                </div>
              )}
            </div>

            {/* Boy Video Frame (Alex - You) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-indigo-500/20">
              {/* Dynamic Video Camera Shake */}
              <motion.div
                animate={{
                  scale: !isGirlSpeaking ? [1, 1.05, 1.02, 1.04] : [1, 1.01, 1],
                  x: !isGirlSpeaking ? [0, 2, -1, 0] : [0, 0, 0],
                  y: !isGirlSpeaking ? [0, -1, 1, 0] : [0, 0, 0],
                }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src="/images/boy_call.png"
                  alt="Boy talking on video call"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </motion.div>

              {/* Dynamic Video Lighting Reflection Sweep */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 border border-white/10">
                <span className="text-[9px] sm:text-[10px] font-medium text-purple-200">You</span>
              </div>

              {!isGirlSpeaking ? (
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-indigo-900/80 backdrop-blur-md px-1.5 py-0.5 border border-indigo-400/30">
                  <Volume2 size={10} className="text-cyan-300 animate-bounce" />
                  <span className="text-[8px] text-cyan-200 font-mono">Talking…</span>
                </div>
              ) : (
                <div className="absolute right-2 bottom-1.5 flex items-center gap-1 rounded-full bg-purple-500/30 backdrop-blur-md px-1.5 py-0.5 text-[8px] text-white">
                  <Sparkles size={9} className="text-yellow-300" />
                  <span>Live</span>
                </div>
              )}
            </div>
          </div>

          {/* Call Controls Toolbar */}
          <div className="flex items-center justify-around py-2.5 px-3 bg-gradient-to-t from-[#100727] to-[#140d2d]">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 text-white">
              <Mic size={13} />
            </div>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 text-white">
              <VideoIcon size={13} />
            </div>
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
              <PhoneOff size={14} />
            </div>
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <MessageSquare size={13} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-3 sm:-left-6 top-6 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-purple-600/80 p-1.5 shadow-lg backdrop-blur-md border border-purple-300/30"
      >
        <span className="text-xl sm:text-2xl">🎲</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute -right-2 sm:-right-6 top-1/3 z-20 flex items-center gap-1.5 rounded-2xl bg-pink-600/80 px-2.5 py-1.5 shadow-lg backdrop-blur-md border border-pink-300/30 text-white"
      >
        <span className="text-lg sm:text-xl animate-bounce">👻</span>
        <span className="text-[9px] sm:text-[10px] font-bold hidden xs:inline">Instant Match</span>
      </motion.div>
    </div>
  );
}
