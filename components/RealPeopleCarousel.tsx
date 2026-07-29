"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, Radio, Sparkles } from "lucide-react";

const REAL_CALLERS = [
  {
    id: "caller-1",
    name: "Emma",
    age: 22,
    location: "United States 🇺🇸",
    status: "Talking about music & travel…",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    tags: ["Music", "Travel"],
  },
  {
    id: "caller-2",
    name: "Alex",
    age: 24,
    location: "United Kingdom 🇬🇧",
    status: "Gaming & tech enthusiast",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    tags: ["Gaming", "Coding"],
  },
  {
    id: "caller-3",
    name: "Sophia",
    age: 21,
    location: "Canada 🇨🇦",
    status: "Exploring digital art & design",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    tags: ["Art", "Photography"],
  },
  {
    id: "caller-4",
    name: "Liam",
    age: 25,
    location: "Australia 🇦🇺",
    status: "Coffee, surfing & indie films",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    tags: ["Movies", "Surfing"],
  },
  {
    id: "caller-5",
    name: "Chloe",
    age: 23,
    location: "Germany 🇩🇪",
    status: "Sharing favorite playlists",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    tags: ["Fitness", "DJ"],
  },
  {
    id: "caller-6",
    name: "Daniel",
    age: 26,
    location: "Spain 🇪🇸",
    status: "Language exchange & culture",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80",
    tags: ["Languages", "Food"],
  },
];

export default function RealPeopleCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slider every 3.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REAL_CALLERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentCaller = REAL_CALLERS[currentIndex];

  function handlePrev() {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? REAL_CALLERS.length - 1 : prev - 1));
  }

  function handleNext() {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % REAL_CALLERS.length);
  }

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Glow Backdrop */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-cyan-500/30 blur-3xl pointer-events-none" />

      {/* Main Video Call Frame Container */}
      <div className="relative z-10 w-full overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-[#0c0620]/95 p-3 sm:p-5 shadow-2xl backdrop-blur-2xl">
        {/* Top Header Live Badge */}
        <div className="flex items-center justify-between mb-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-white font-mono uppercase tracking-wider text-[11px]">
              ● LIVE WEBRTC MATCH
            </span>
          </div>
          <div className="flex items-center gap-2 text-purple-200">
            <Radio size={13} className="text-cyan-400 animate-pulse" />
            <span className="text-[11px] bg-purple-500/20 px-2.5 py-0.5 rounded-full font-mono text-purple-200">
              60 FPS • HD 1080p
            </span>
          </div>
        </div>

        {/* Full-Width Real Human Video Call Stage */}
        <div className="relative h-[280px] sm:h-[340px] w-full overflow-hidden rounded-2xl border border-purple-400/30 shadow-xl bg-black">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentCaller.id}
              src={currentCaller.image}
              alt={currentCaller.name}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full w-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Gradient Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

          {/* Top-Left Stranger Name & Country Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white">
              {currentCaller.name}, {currentCaller.age}
            </span>
            <span className="text-[11px] text-purple-200">{currentCaller.location}</span>
          </div>

          {/* Top-Right Speaking Indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-purple-900/80 backdrop-blur-md px-2.5 py-1 border border-purple-400/40">
            <Volume2 size={12} className="text-pink-300 animate-bounce" />
            <span className="text-[10px] text-purple-200 font-mono font-bold">Talking…</span>
          </div>

          {/* Bottom Status & Interest Tags */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[280px]">
                "{currentCaller.status}"
              </span>
              <div className="flex items-center gap-1 mt-1">
                {currentCaller.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] sm:text-[10px] font-bold text-pink-300 bg-pink-950/70 px-2 py-0.5 rounded-full border border-pink-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Bar */}
        <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5">
            {REAL_CALLERS.map((caller, idx) => (
              <button
                key={caller.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-7 bg-pink-500 shadow-md" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                title={caller.name}
              />
            ))}
          </div>

          {/* Navigation Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/15"
              title="Previous Stranger"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handleNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/15"
              title="Next Stranger"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
