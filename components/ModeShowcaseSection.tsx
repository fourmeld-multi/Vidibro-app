"use client";

import { motion } from "framer-motion";
import { Mic, MessageSquare, PhoneOff, MicOff, UserPlus, ShieldAlert, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ModeShowcaseSection() {
  return (
    <section className="w-full py-16 sm:py-24 border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Experience Chat <span className="gradient-text">Without Limits</span>
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal">
          Whether you want live HD video, voice calls, or text messaging, Vidibro gives you complete freedom to connect.
        </p>
      </div>

      <div className="space-y-16 max-w-5xl mx-auto">
        {/* Showcase 1: Voice & Video Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left UI Card: Voice/Video Room Mockup */}
          <div className="lg:col-span-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-[#0d0724]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl"
            >
              {/* Central Voice Orb Spectrum */}
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-1 shadow-2xl shadow-purple-500/40 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-pink-500/30 border border-pink-400/40"
                  />
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#12082e]">
                    <Mic size={36} className="text-pink-300 animate-pulse" />
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 mb-1">
                  00:42 • Encrypted Voice Stream
                </span>
                <span className="text-sm font-bold text-white">Alex (Stranger connected)</span>
              </div>

              {/* In-Call Action Control Bar */}
              <div className="flex items-center justify-around border-t border-white/10 pt-4 mt-2">
                <button className="flex flex-col items-center gap-1 text-[10px] text-purple-200">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md">
                    <PhoneOff size={16} />
                  </div>
                  <span>End Call</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-[10px] text-purple-200">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white">
                    <MicOff size={16} />
                  </div>
                  <span>Mute</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-[10px] text-purple-200">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-emerald-400">
                    <UserPlus size={16} />
                  </div>
                  <span>Add Friend</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-[10px] text-purple-200">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/15 text-red-400">
                    <ShieldAlert size={16} />
                  </div>
                  <span>Report</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Text Description */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">
              HD VIDEO & VOICE MATCHING
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Face-to-Face & Faceless Voice Calls
            </h3>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
              Connect instantly with real people across HD video or crystal-clear audio. No profile setups, no friend lists—just spontaneous, genuine human interactions at your fingertips.
            </p>
            <p className="text-xs sm:text-sm text-purple-300/70 leading-relaxed">
              Enjoy low-latency peer-to-peer streaming with built-in noise cancellation. Chat for seconds or hours, and skip seamlessly whenever you want.
            </p>

            <Link
              href="/audio-chat"
              className="flex items-center gap-2 text-sm font-bold text-pink-400 hover:text-pink-300 transition pt-2"
            >
              <span>Start Voice Chat</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Showcase 2: Text Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Description */}
          <div className="lg:col-span-6 flex flex-col gap-3 order-2 lg:order-1">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              INSTANT TEXT CHAT
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Fast, Anonymous Text Messaging
            </h3>
            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
              Prefer typing? Dive into instant random text chat. Send messages, emojis, and stickers in a clean, high-performance feed designed for smooth conversations.
            </p>
            <p className="text-xs sm:text-sm text-purple-300/70 leading-relaxed">
              Keep it 100% private. No logs are saved, and you can switch between text, voice, or video with a single tap.
            </p>

            <Link
              href="/text-chat"
              className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition pt-2"
            >
              <span>Start Text Chat</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right UI Card: Text Chat Feed Mockup */}
          <div className="lg:col-span-6 w-full order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#09061a]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">Live Stranger Match</span>
                </div>
                <button className="text-[11px] font-bold text-purple-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                  + Add Friend
                </button>
              </div>

              {/* Chat Feed Messages */}
              <div className="space-y-3 py-2 text-xs">
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-purple-300/60 mb-0.5">Stranger • 9:41 PM</span>
                  <div className="rounded-2xl rounded-bl-none bg-white/10 border border-white/15 px-3.5 py-2 text-purple-100 max-w-[85%]">
                    Hey! Favorite movie genre? 🍿
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-purple-300/60 mb-0.5">You • 9:41 PM</span>
                  <div className="rounded-2xl rounded-br-none btn-gradient px-3.5 py-2 text-white font-medium max-w-[85%]">
                    Sci-fi and thriller movies for sure! 🚀
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-purple-300/60 mb-0.5">Stranger • 9:42 PM</span>
                  <div className="rounded-2xl rounded-bl-none bg-white/10 border border-white/15 px-3.5 py-2 text-purple-100 max-w-[85%]">
                    Awesome taste! 🎬
                  </div>
                </div>
              </div>

              {/* Input Row */}
              <div className="flex items-center gap-2 border-t border-white/10 pt-3 mt-3">
                <div className="btn-gradient px-3 py-1.5 rounded-full text-[10px] font-bold text-white">
                  NEXT
                </div>
                <input
                  type="text"
                  readOnly
                  value="Type a message..."
                  className="flex-1 rounded-full bg-white/5 border border-white/15 px-4 py-1.5 text-xs text-purple-300/60 outline-none cursor-default"
                />
                <div className="flex h-8 w-8 items-center justify-center rounded-full btn-gradient text-white">
                  <Send size={13} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
