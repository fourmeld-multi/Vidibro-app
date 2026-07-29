"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SHOWCASE_ITEMS = [
  {
    id: "video",
    emoji: "🎥",
    title: "Face-to-Face Video Calls",
    description:
      "Connect instantly with real people over HD video. No signup, no filters — just genuine face-to-face conversations with strangers worldwide.",
    image:
      "https://images.unsplash.com/photo-1752650733337-cb0189176fb9?auto=format&fit=crop&w=800&q=80",
    cta: "Start Video Chat",
    href: "/video-chat",
  },
  {
    id: "text",
    emoji: "💬",
    title: "Anonymous Text Chat",
    description:
      "Prefer typing over talking? Chat by text with strangers instantly — casual, private, and completely free.",
    image:
      "https://images.unsplash.com/photo-1758874383881-cd90c326058e?auto=format&fit=crop&w=800&q=80",
    cta: "Start Text Chat",
    href: "/text-chat",
  },
  {
    id: "audio",
    emoji: "🎧",
    title: "Voice-Only Audio Calls",
    description:
      "Just want to talk? Skip the camera and have a real voice conversation with someone new, anywhere in the world.",
    image:
      "https://images.unsplash.com/photo-1555965435-f88618f05915?auto=format&fit=crop&w=800&q=80",
    cta: "Start Audio Chat",
    href: "/audio-chat",
  },
];

export default function AppShowcaseCarousel() {
  const [index, setIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);

  useEffect(() => {
    if (!autoPlaying) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlaying]);

  function goTo(next: number) {
    setAutoPlaying(false);
    setIndex((next + SHOWCASE_ITEMS.length) % SHOWCASE_ITEMS.length);
  }

  const visible = [SHOWCASE_ITEMS[index], SHOWCASE_ITEMS[(index + 1) % SHOWCASE_ITEMS.length]];

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          See What <span className="gradient-text">Vidibro</span> Can Do
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal">
          Three ways to connect. Real people, real conversations, zero cost.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-3xl border border-purple-500/20 bg-[#0d0724]/90 shadow-2xl"
            >
              <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="p-6 flex flex-col gap-2.5">
                <span className="text-2xl">{item.emoji}</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">{item.title}</h3>
                <p className="text-sm text-purple-200/75 leading-relaxed">{item.description}</p>
                <Link
                  href={item.href}
                  className="text-sm font-bold text-pink-400 hover:text-pink-300 transition pt-1"
                >
                  {item.cta} →
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Slider navigation: prev/next + progress bar, matching the auto-advancing carousel pattern */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={() => goTo(index - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/80 hover:bg-purple-600 text-white transition shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative h-1 w-40 rounded-full bg-white/15 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-purple-500"
            animate={{ width: `${((index + 1) / SHOWCASE_ITEMS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <button
          onClick={() => goTo(index + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/80 hover:bg-purple-600 text-white transition shadow-lg"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
