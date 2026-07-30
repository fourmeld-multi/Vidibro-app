"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Globe2, Users, Video, PhoneCall, MessageSquare, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppShowcaseCarousel from "@/components/AppShowcaseCarousel";
import PrivacyFlowSection from "@/components/PrivacyFlowSection";
import HowItWorks from "@/components/HowItWorks";
import WhyVidibro from "@/components/WhyVidibro";
import FAQAccordion from "@/components/FAQAccordion";
import FinalCTASection from "@/components/FinalCTASection";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<LanguageCode>("EN");
  const [onlineCount, setOnlineCount] = useState(24910);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  // Realistic subtle fluctuating live online user counter
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = Math.floor(Math.random() * 11) - 5;
      setOnlineCount((prev) => Math.max(18000, prev + delta));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-1 flex-col font-sans bg-gradient-to-b from-[#0e0526] via-[#140836] via-[#1b0840] to-[#0a041c] text-white overflow-hidden">
      {/* Thin flowing background lines, purely decorative */}
      <svg
        className="absolute inset-x-0 top-0 h-[700px] w-full pointer-events-none opacity-40"
        viewBox="0 0 1400 700"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroLine1" x1="0" y1="0" x2="1400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroLine2" x1="0" y1="0" x2="1400" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-100,140 C 250,40 500,220 750,120 S 1250,60 1500,160"
          stroke="url(#heroLine1)"
          strokeWidth="1.5"
        />
        <path
          d="M-100,260 C 300,340 600,180 850,260 S 1300,320 1500,240"
          stroke="url(#heroLine2)"
          strokeWidth="1.5"
        />
        <path
          d="M-100,40 C 350,120 650,10 950,90 S 1350,140 1500,60"
          stroke="url(#heroLine1)"
          strokeWidth="1"
        />
      </svg>

      {/* Background Ambient Aurora Mesh Light Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-pink-500/25 via-purple-600/20 to-transparent blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-pink-500/20 to-transparent blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-purple-600/25 via-indigo-500/20 to-transparent blur-[130px] pointer-events-none" />

      <Navbar
        currentLang={lang}
        onSelectLang={setLang}
        onStartTextChat={() => router.push("/text-chat")}
        onStartVideoChat={() => router.push("/video-chat")}
      />

      <main className="relative z-10 w-full flex-1 flex flex-col mx-auto max-w-5xl px-4 sm:px-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 max-w-3xl mx-auto gap-6 sm:gap-7">
          
          {/* Top Tagline Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="glass-pill flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold text-purple-100 shadow-xl border border-purple-500/30 bg-purple-950/40"
          >
            <Sparkles size={15} className="text-pink-400 animate-spin-slow" />
            <span>✨ Next-Generation 1-on-1 Social Discovery</span>
          </motion.div>

          {/* Main Headline Title */}
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl leading-none">
            <span className="gradient-text">Vidibro</span>
          </h1>

          {/* Subtitle */}
          <div className="flex flex-col gap-2.5 sm:gap-1.5 text-base sm:text-xl text-purple-200/80 font-normal leading-relaxed max-w-2xl px-3">
            <p className="block">Meet amazing people around the globe in real-time.</p>
            <p className="block text-purple-300/90 font-medium">Free, anonymous, and protected by smart AI moderation.</p>
          </div>

          {/* Dual Pill Badges Row */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="glass-pill flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white border border-emerald-500/30 bg-emerald-950/30 shadow-lg">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{onlineCount.toLocaleString()}+ Active Users</span>
            </div>

            <div className="glass-pill flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white border border-cyan-500/30 bg-cyan-950/30 shadow-lg">
              <Globe2 size={16} className="text-cyan-400" />
              <span>180+ Countries</span>
            </div>
          </div>

          {/* Primary Mode Action Buttons (Concept 1: Hero Video + Side-by-Side Cards on Mobile) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md sm:max-w-none pt-2">
            {/* Full-Width Featured Video Match Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/video-chat")}
              className="btn-gradient glow-pulse flex w-full sm:w-auto items-center justify-center gap-3 rounded-full px-9 py-4 text-base sm:text-lg font-extrabold text-white shadow-2xl shadow-purple-500/30 transition uppercase tracking-wider"
            >
              <Video size={22} />
              START VIDEO MATCH
            </motion.button>

            {/* Side-by-Side Cards Grid for Mobile (Voice Chat & Text Chat) */}
            <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto">
              {/* Voice Chat Button with Cyan/Blue Gradient Border */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push("/audio-chat")}
                className="relative p-[2px] rounded-2xl sm:rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition w-full sm:w-auto"
              >
                <div className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl sm:rounded-full bg-[#130835] hover:bg-[#1a0b47] px-3 sm:px-7 py-3.5 text-xs sm:text-base font-bold text-white backdrop-blur-xl transition">
                  <PhoneCall size={16} className="text-cyan-300 animate-pulse shrink-0" />
                  <span>Voice Chat</span>
                </div>
              </motion.button>

              {/* Text Chat Button with Pink/Purple Gradient Border */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push("/text-chat")}
                className="relative p-[2px] rounded-2xl sm:rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition w-full sm:w-auto"
              >
                <div className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl sm:rounded-full bg-[#130835] hover:bg-[#1a0b47] px-3 sm:px-7 py-3.5 text-xs sm:text-base font-bold text-white backdrop-blur-xl transition">
                  <MessageSquare size={16} className="text-pink-300 shrink-0" />
                  <span>Text Chat</span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Bottom Assurance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm text-purple-200/90 font-medium pt-3">
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-emerald-400" /> Zero Signup Required
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-emerald-400" /> P2P Encrypted Streams
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={16} className="text-emerald-400" /> Instant Matching
            </span>
          </div>
        </div>

        {/* Auto-advancing carousel: Video Calling / Text Chat / Audio Chat */}
        <AppShowcaseCarousel />

        {/* Honest, factual privacy-architecture explainer — not social proof */}
        <PrivacyFlowSection />

        {/* Section 2: How Vidibro Works */}
        <HowItWorks />

        {/* Section 3: Why Vidibro is the Best Omegle Alternative */}
        <WhyVidibro />

        {/* FAQ accordion */}
        <FAQAccordion />

        {/* Final call-to-action band before the footer */}
        <FinalCTASection />
      </main>

      <Footer
        onStartVideoChat={() => router.push("/video-chat")}
        onStartTextChat={() => router.push("/text-chat")}
        onStartAudioChat={() => router.push("/audio-chat")}
      />
    </div>
  );
}
