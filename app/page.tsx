"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video, Sparkles, MessageSquare, PhoneCall, ShieldCheck, Zap, Globe2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PhoneMockup from "@/components/PhoneMockup";
import FeatureShowcase from "@/components/FeatureShowcase";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<LanguageCode>("EN");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const BADGES = [
    { icon: ShieldCheck, label: t.noSignup },
    { icon: Zap, label: t.instantMatch },
    { icon: Globe2, label: t.freePrivate },
  ];

  return (
    <div className="relative flex min-h-screen flex-1 flex-col font-sans bg-[#070414]">
      <Navbar
        currentLang={lang}
        onSelectLang={setLang}
        onStartTextChat={() => router.push("/text-chat")}
        onStartVideoChat={() => router.push("/video-chat")}
      />

      <main className="w-full flex-1 flex flex-col mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero Section */}
        <div className="grid flex-1 items-center gap-8 py-6 sm:py-16 lg:grid-cols-2 lg:py-20">
              <div className="flex flex-col items-center gap-4 sm:gap-6 text-center lg:items-start lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="glass-pill flex w-fit items-center gap-2 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-medium text-purple-200 shadow-lg"
                >
                  <Sparkles size={13} className="text-pink-400 animate-spin-slow" />
                  <span>{t.heroTag}</span>
                </motion.div>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                  {t.heroTitle1} <br className="hidden sm:inline" />
                  <span className="gradient-text">{t.heroTitleVideo}</span>, <span className="gradient-text">{t.heroTitleVoice}</span> or <span className="gradient-text">{t.heroTitleText}</span>
                </h1>

                <p className="max-w-lg text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
                  {t.heroSubtitle}
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  {BADGES.map((b) => (
                    <span
                      key={b.label}
                      className="glass-pill flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium text-purple-100"
                    >
                      <b.icon size={13} className="text-cyan-400" />
                      {b.label}
                    </span>
                  ))}
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-1 flex flex-col sm:flex-row items-center justify-center gap-3 lg:justify-start w-full max-w-sm sm:max-w-none">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/video-chat")}
                    className="btn-gradient glow-pulse flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-purple-500/25 transition"
                  >
                    <Video size={18} />
                    {t.startVideo}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/audio-chat")}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition"
                  >
                    <PhoneCall size={17} className="text-cyan-300" />
                    {t.startAudio}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/text-chat")}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition"
                  >
                    <MessageSquare size={17} className="text-purple-300" />
                    {t.startText}
                  </motion.button>
                </div>
              </div>

              {/* Right Side: 3D Smartphone Mockup */}
              <div className="w-full flex justify-center overflow-visible">
                <PhoneMockup />
              </div>
            </div>

        {/* Feature Showcase & Why Vidibro is the Best Free Tool */}
        <div id="features">
          <FeatureShowcase currentLang={lang} />
        </div>
      </main>

      <Footer
        onStartVideoChat={() => router.push("/video-chat")}
        onStartTextChat={() => router.push("/text-chat")}
        onStartAudioChat={() => router.push("/audio-chat")}
      />
    </div>
  );
}
