"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Sparkles, MessageSquare, PhoneCall, ShieldCheck, Zap, Globe2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoContainer from "@/components/VideoContainer";
import TextChatContainer from "@/components/TextChatContainer";
import AudioChatContainer from "@/components/AudioChatContainer";
import ImpactReactionOverlay from "@/components/ImpactReactionOverlay";
import MiniGameOverlay from "@/components/MiniGameOverlay";
import PhoneMockup from "@/components/PhoneMockup";
import FeatureShowcase from "@/components/FeatureShowcase";
import { useWebRTC, type ChatMode } from "@/hooks/useWebRTC";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

export default function Home() {
  const {
    connectionState,
    isHost,
    mode,
    localStream,
    remoteStream,
    dataChannelOpen,
    joinQueue,
    leaveMatch,
    skipToNext,
    sendMessage,
    subscribe,
  } = useWebRTC();

  const [starting, setStarting] = useState(false);
  const [lang, setLang] = useState<LanguageCode>("EN");

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const BADGES = [
    { icon: ShieldCheck, label: t.noSignup },
    { icon: Zap, label: t.instantMatch },
    { icon: Globe2, label: t.freePrivate },
  ];

  async function handleStart(chatMode: ChatMode) {
    setStarting(true);
    try {
      await joinQueue(chatMode);
    } catch {
      // Camera/mic permission denied or unavailable
    } finally {
      setStarting(false);
    }
  }

  const isActive = connectionState !== "idle";
  const overlaysReady = connectionState === "connected" && dataChannelOpen;

  return (
    <div className="relative flex min-h-screen flex-1 flex-col font-sans bg-[#070414]">
      {/* Navbar Header with Working Language Switcher */}
      {!isActive && (
        <Navbar
          currentLang={lang}
          onSelectLang={setLang}
          onStartTextChat={() => handleStart("text")}
          onStartVideoChat={() => handleStart("video")}
        />
      )}

      <main className={`w-full flex-1 flex flex-col ${isActive ? "p-0 max-w-none" : "mx-auto max-w-6xl px-4 sm:px-6"}`}>
        {!isActive ? (
          <>
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
                    onClick={() => handleStart("video")}
                    disabled={starting}
                    className="btn-gradient glow-pulse flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-xl shadow-purple-500/25 transition disabled:opacity-50"
                  >
                    <Video size={18} />
                    {starting ? t.connecting : t.startVideo}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStart("audio")}
                    disabled={starting}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition disabled:opacity-50"
                  >
                    <PhoneCall size={17} className="text-cyan-300" />
                    {t.startAudio}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStart("text")}
                    disabled={starting}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition disabled:opacity-50"
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
          </>
        ) : (
          /* Active Call State - Pure Full Viewport */
          <div className="w-full h-dvh flex flex-col overflow-hidden">
            {mode === "video" && (
              <VideoContainer
                localStream={localStream}
                remoteStream={remoteStream}
                connectionState={connectionState}
                dataChannelOpen={dataChannelOpen}
                sendMessage={sendMessage}
                subscribe={subscribe}
                skipToNext={skipToNext}
                leaveMatch={leaveMatch}
                isHost={isHost}
              />
            )}

            {mode === "audio" && (
              <AudioChatContainer
                localStream={localStream}
                remoteStream={remoteStream}
                connectionState={connectionState}
                dataChannelOpen={dataChannelOpen}
                sendMessage={sendMessage}
                subscribe={subscribe}
                skipToNext={skipToNext}
                leaveMatch={leaveMatch}
              />
            )}

            {mode === "text" && (
              <TextChatContainer
                connectionState={connectionState}
                dataChannelOpen={dataChannelOpen}
                sendMessage={sendMessage}
                subscribe={subscribe}
                skipToNext={skipToNext}
                leaveMatch={leaveMatch}
              />
            )}

            {mode !== "video" && mode !== "text" && mode !== "audio" && (
              <AnimatePresence>
                {overlaysReady && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <ImpactReactionOverlay sendMessage={sendMessage} subscribe={subscribe} />
                    <MiniGameOverlay isHost={isHost} sendMessage={sendMessage} subscribe={subscribe} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )}
      </main>

      {/* Multi-column Footer with Working Redirects */}
      {!isActive && (
        <Footer
          onStartVideoChat={() => handleStart("video")}
          onStartTextChat={() => handleStart("text")}
          onStartAudioChat={() => handleStart("audio")}
        />
      )}
    </div>
  );
}
