"use client";

import { motion } from "framer-motion";
import { Zap, Lock, Globe, Smartphone, Mic, ShieldCheck } from "lucide-react";

const REASONS = [
  {
    icon: Zap,
    iconColor: "text-amber-400",
    title: "Sub-Second Matching",
    desc: "Experience instant peer-to-peer connections powered by high-speed global WebRTC nodes.",
  },
  {
    icon: Lock,
    iconColor: "text-emerald-400",
    title: "Complete Anonymity",
    desc: "Your personal details, IP, and location remain strictly private. No signups or tracking.",
  },
  {
    icon: Globe,
    iconColor: "text-cyan-400",
    title: "Worldwide Community",
    desc: "Discover and chat with real users from 180+ countries across every time zone.",
  },
  {
    icon: Smartphone,
    iconColor: "text-purple-400",
    title: "Flawless Mobile Experience",
    desc: "Fully optimized for smooth 60 FPS performance on iOS, Android, and desktop browsers.",
  },
  {
    icon: Mic,
    iconColor: "text-pink-400",
    title: "Studio-Quality Audio",
    desc: "Advanced P2P noise suppression delivers crystal-clear voice clarity during every call.",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-indigo-400",
    title: "24/7 AI Protection",
    desc: "Automated intelligent safety filters proactively shield the community from harmful behavior.",
  },
];

export default function WhyVidibro() {
  return (
    <section className="w-full py-14 sm:py-20 border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Why Millions Choose Vidibro
        </h2>
        <p className="text-sm sm:text-base text-purple-200/70 font-medium">
          The safest, fastest, and most enjoyable way to meet strangers online.
        </p>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {REASONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.45 }}
              className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 backdrop-blur-xl hover:border-purple-500/40 transition shadow-xl flex flex-col gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/10 group-hover:scale-110 transition">
                  <Icon size={20} className={item.iconColor} />
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed font-normal">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
