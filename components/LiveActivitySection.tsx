"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, MessageSquare, PhoneCall, Users, Globe2, Sparkles } from "lucide-react";

const ACTIVITY_EVENTS = [
  { icon: Video, text: "Video match connected", place: "Brazil 🇧🇷", color: "text-pink-400" },
  { icon: MessageSquare, text: "Text chat started", place: "Japan 🇯🇵", color: "text-cyan-400" },
  { icon: PhoneCall, text: "Voice call connected", place: "Germany 🇩🇪", color: "text-amber-400" },
  { icon: Video, text: "Video match connected", place: "India 🇮🇳", color: "text-pink-400" },
  { icon: MessageSquare, text: "Text chat started", place: "Canada 🇨🇦", color: "text-cyan-400" },
  { icon: PhoneCall, text: "Voice call connected", place: "Spain 🇪🇸", color: "text-amber-400" },
  { icon: Video, text: "Video match connected", place: "South Korea 🇰🇷", color: "text-pink-400" },
  { icon: MessageSquare, text: "Text chat started", place: "Mexico 🇲🇽", color: "text-cyan-400" },
];

const STATS = [
  { icon: Users, label: "Active Now", value: 24900, suffix: "+" },
  { icon: Sparkles, label: "Matches Today", value: 182000, suffix: "+" },
  { icon: Globe2, label: "Countries", value: 180, suffix: "+" },
];

function AnimatedCounter({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return <>{value.toLocaleString()}</>;
}

export default function LiveActivitySection() {
  return (
    <section className="w-full py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Happening <span className="gradient-text">Right Now</span>
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal">
          Real matches, live across the world — this second.
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mb-10 px-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="glass-pill flex flex-col items-center gap-1.5 rounded-2xl px-2 py-4 sm:py-5 border border-white/10"
          >
            <stat.icon size={18} className="text-pink-400" />
            <span className="text-lg sm:text-2xl font-black text-white tabular-nums">
              <AnimatedCounter target={stat.value} />
              {stat.suffix}
            </span>
            <span className="text-[10px] sm:text-xs text-purple-200/70 font-medium text-center">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Infinite scrolling ticker of live match events */}
      <div className="relative w-full overflow-hidden py-2">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#0a041c] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#0a041c] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-3 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {[...ACTIVITY_EVENTS, ...ACTIVITY_EVENTS].map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-2 flex-shrink-0 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs sm:text-sm font-medium text-purple-100 whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <event.icon size={14} className={event.color} />
              <span>{event.text}</span>
              <span className="text-purple-300/60">·</span>
              <span className="text-purple-200/70">{event.place}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
