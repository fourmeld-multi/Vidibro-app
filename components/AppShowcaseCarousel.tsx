"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const SHOWCASE_ITEMS = [
  {
    id: "video",
    emoji: "🎥",
    title: "Face-to-Face Video Calls",
    description: "Connect over HD video — no signup, no filters, just genuine conversations.",
    image:
      "https://images.unsplash.com/photo-1752650733337-cb0189176fb9?auto=format&fit=crop&w=800&q=80",
    cta: "Start Video Chat",
    href: "/video-chat",
    accent: "from-pink-500/80 to-purple-600/80",
  },
  {
    id: "text",
    emoji: "💬",
    title: "Anonymous Text Chat",
    description: "Prefer typing? Chat by text with strangers instantly — casual and private.",
    image:
      "https://images.unsplash.com/photo-1758874383881-cd90c326058e?auto=format&fit=crop&w=800&q=80",
    cta: "Start Text Chat",
    href: "/text-chat",
    accent: "from-cyan-500/80 to-blue-600/80",
  },
  {
    id: "audio",
    emoji: "🎧",
    title: "Voice-Only Audio Calls",
    description: "Skip the camera and just talk — a real voice conversation, anywhere.",
    image:
      "https://images.unsplash.com/photo-1555965435-f88618f05915?auto=format&fit=crop&w=800&q=80",
    cta: "Start Audio Chat",
    href: "/audio-chat",
    accent: "from-amber-500/80 to-orange-600/80",
  },
];

const COUNT = SHOWCASE_ITEMS.length;

export default function AppShowcaseCarousel() {
  const [index, setIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);

  useEffect(() => {
    if (!autoPlaying) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % COUNT);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlaying]);

  function goTo(next: number) {
    setAutoPlaying(false);
    setIndex((next + COUNT) % COUNT);
  }

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Three Ways to <span className="gradient-text">Connect</span>
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal">
          Real people, real conversations, zero cost.
        </p>
      </div>

      {/* Layered 3D deck: one focal card up front, the other two fanned out
          behind it — deliberately not a flat side-by-side grid, since this
          section sits right below Vidibro's 3D phone-mockup hero. */}
      <div className="relative h-[440px] sm:h-[480px] w-full max-w-md mx-auto" style={{ perspective: "1400px" }}>
        {SHOWCASE_ITEMS.map((item, idx) => {
          const diff = (idx - index + COUNT) % COUNT;
          const isFront = diff === 0;
          const isRight = diff === 1;

          const style = isFront
            ? { x: 0, rotate: 0, scale: 1, opacity: 1, zIndex: 30 }
            : isRight
              ? { x: 70, rotate: 9, scale: 0.86, opacity: 0.5, zIndex: 20 }
              : { x: -70, rotate: -9, scale: 0.86, opacity: 0.5, zIndex: 20 };

          return (
            <motion.button
              key={item.id}
              onClick={() => goTo(idx)}
              animate={style}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl text-left"
              style={{ transformOrigin: "center" }}
              aria-label={item.title}
              tabIndex={isFront ? 0 : -1}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.accent} mix-blend-multiply opacity-40`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {isFront && (
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 flex flex-col gap-2">
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xs">{item.description}</p>
                  <Link
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#12082e] shadow-lg transition hover:scale-105"
                  >
                    {item.cta} →
                  </Link>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Dot indicators — deliberately dots, not a linear progress bar */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {SHOWCASE_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => goTo(idx)}
            aria-label={`Show ${item.title}`}
            className={`h-2 rounded-full transition-all ${
              idx === index ? "w-7 bg-white" : "w-2 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
