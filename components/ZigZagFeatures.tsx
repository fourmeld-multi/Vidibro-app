"use client";

import { motion } from "framer-motion";
import { Sparkles, Tag, ShieldCheck, Globe, SlidersHorizontal, Flame, Heart, Smile } from "lucide-react";

export default function ZigZagFeatures() {
  return (
    <section className="w-full py-16 sm:py-24 border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Random Chat, <span className="gradient-text">Done Better</span>
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal leading-relaxed">
          Vidibro is random chat done right. Connect over shared hobbies, meet people from around the world, and skip the awkwardness with automated moderation built in.
        </p>
      </div>

      <div className="space-y-20 max-w-5xl mx-auto">
        {/* Feature 1: Shared Interests (Text Left, UI Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
              <Tag size={13} /> Shared Interests
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Talk to Strangers Who Share Your Interests
            </h3>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
              Select your favorite interests and get matched with strangers who share them. Vidibro lets you connect over common passions instead of awkward small talk!
            </p>
          </div>

          <div className="lg:col-span-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-[#0d0724]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-4 border-b border-white/10 pb-3">
                <Sparkles size={16} className="text-pink-400" />
                <span>INTEREST MATCHING</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1.5 bg-purple-600/40 border border-purple-400/40 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow">
                  gaming <span className="text-purple-300 hover:text-white cursor-pointer">✕</span>
                </span>
                <span className="flex items-center gap-1.5 bg-purple-600/40 border border-purple-400/40 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow">
                  programming <span className="text-purple-300 hover:text-white cursor-pointer">✕</span>
                </span>
                <span className="flex items-center gap-1.5 bg-purple-600/40 border border-purple-400/40 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow">
                  music <span className="text-purple-300 hover:text-white cursor-pointer">✕</span>
                </span>
                <span className="flex items-center gap-1.5 bg-purple-600/40 border border-purple-400/40 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow">
                  series <span className="text-purple-300 hover:text-white cursor-pointer">✕</span>
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-purple-300/50">
                <span>Add interest...</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature 2: Safe Reactions & Media (UI Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 w-full order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#09061a]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-xs font-bold text-white">Interactive Reactions Tray</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                  🛡️ AI Safe Chat
                </span>
              </div>

              <div className="flex items-center justify-around py-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex flex-col items-center gap-1 text-2xl hover:scale-125 transition cursor-pointer">
                  🔥
                  <span className="text-[9px] text-purple-300 font-bold">Fire</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-2xl hover:scale-125 transition cursor-pointer">
                  ❤️
                  <span className="text-[9px] text-purple-300 font-bold">Love</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-2xl hover:scale-125 transition cursor-pointer">
                  😂
                  <span className="text-[9px] text-purple-300 font-bold">Lol</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-2xl hover:scale-125 transition cursor-pointer">
                  🎉
                  <span className="text-[9px] text-purple-300 font-bold">Party</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-3 order-1 lg:order-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={13} /> Safe Reactions & Sharing
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Share Reactions & Media Safely in Every Chat
            </h3>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
              Send text messages and share 3D floating reactions while chatting. Automated 24/7 moderation blocks inappropriate content to keep conversations safe and enjoyable.
            </p>
          </div>
        </div>

        {/* Feature 3: Global Connections (Text Left, UI Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
              <Globe size={13} /> Global Connections
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Make International Friends Across 180+ Countries
            </h3>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
              Select specific regions or countries you want to connect with. Our platform lets you explore new cultures, meet diverse people, and practice language skills in real-time!
            </p>
          </div>

          <div className="lg:col-span-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-[#0d0724]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-xs font-bold text-white">COUNTRY SELECTOR</span>
                <Globe size={16} className="text-cyan-400" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-white">
                  <span>United States 🇺🇸</span>
                  <span className="text-emerald-400 text-[10px] font-bold">🟢 Active</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-white">
                  <span>Australia 🇦🇺</span>
                  <span className="text-emerald-400 text-[10px] font-bold">🟢 Active</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-white">
                  <span>Canada 🇨🇦</span>
                  <span className="text-emerald-400 text-[10px] font-bold">🟢 Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature 4: Tailored Match (UI Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 w-full order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-[#0c0620]/90 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-xs font-bold text-white">GENDER PREFERENCE</span>
                <SlidersHorizontal size={16} className="text-pink-400" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-600/40 border border-purple-400/40 text-xs font-bold text-white shadow">
                  <span>Both 👥</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-purple-200 hover:bg-white/10">
                  <span>Female 👩</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-purple-200 hover:bg-white/10">
                  <span>Male 👨</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-3 order-1 lg:order-2">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal size={13} /> Tailored Matching
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Find Your Best Match to Connect With
            </h3>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
              Target matches by preferred gender or interest filters for high-quality, tailored 1-on-1 conversations every time you click match.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
