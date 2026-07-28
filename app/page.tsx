"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, Video, Sparkles, MessageSquare, PhoneCall, Mic, MicOff, ShieldCheck, Zap, Globe2 } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import VideoContainer from "@/components/VideoContainer";
import ImpactReactionOverlay from "@/components/ImpactReactionOverlay";
import MiniGameOverlay from "@/components/MiniGameOverlay";
import ChatDrawer from "@/components/ChatDrawer";
import PhoneMockup from "@/components/PhoneMockup";
import FeatureShowcase from "@/components/FeatureShowcase";
import { useWebRTC, type ChatMode } from "@/hooks/useWebRTC";

const BADGES = [
  { icon: ShieldCheck, label: "No signup, ever" },
  { icon: Zap, label: "Instant match" },
  { icon: Globe2, label: "100% Free & Private" },
];

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
  const [micEnabled, setMicEnabled] = useState(true);

  async function handleStart(chatMode: ChatMode) {
    setStarting(true);
    try {
      await joinQueue(chatMode);
    } catch {
      // Camera/mic permission denied or unavailable — connectionState stays
      // "idle" so the Start button remains visible to retry.
    } finally {
      setStarting(false);
    }
  }

  function toggleMic() {
    const next = !micEnabled;
    localStream?.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicEnabled(next);
  }

  const isActive = connectionState !== "idle";
  const overlaysReady = connectionState === "connected" && dataChannelOpen;

  return (
    <div className="relative flex min-h-screen flex-1 flex-col font-sans">
      {/* Sleek Top Header */}
      <header className="sticky top-0 z-50 border-b border-purple-500/10 backdrop-blur-2xl bg-[#090614]/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="btn-gradient flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg shadow-purple-500/25 group-hover:scale-105 transition">
              <LogoMark size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                Vidibro
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-purple-200/80">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <a href="#blog" className="hover:text-white transition">Blog</a>
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
        {!isActive ? (
          <>
            {/* Hero Section inspired by Whisperly (Image 2) */}
            <div className="grid flex-1 items-center gap-8 py-6 sm:py-16 lg:grid-cols-2 lg:py-20">
              <div className="flex flex-col items-center gap-4 sm:gap-6 text-center lg:items-start lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="glass-pill flex w-fit items-center gap-2 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-medium text-purple-200 shadow-lg"
                >
                  <Sparkles size={13} className="text-pink-400 animate-spin-slow" />
                  <span>1,000s of active people online now</span>
                </motion.div>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                  Talk to Strangers <br className="hidden sm:inline" />
                  by <span className="gradient-text">Video</span> or <span className="gradient-text">Text</span>
                </h1>

                <p className="max-w-lg text-sm sm:text-base text-purple-200/80 leading-relaxed font-normal">
                  Start a free random chat by video, voice or text. Meet new people, make friends, and talk to online strangers instantly without video pressure.
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
                    {starting ? "Connecting…" : "Start a Video Chat"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStart("audio")}
                    disabled={starting}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition disabled:opacity-50"
                  >
                    <PhoneCall size={17} className="text-cyan-300" />
                    Start an Audio Chat
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStart("text")}
                    disabled={starting}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-sm sm:text-base font-bold text-white backdrop-blur-xl transition disabled:opacity-50"
                  >
                    <MessageSquare size={17} className="text-purple-300" />
                    Start a Text Chat
                  </motion.button>
                </div>
              </div>

              {/* Right Side: 3D Smartphone Mockup */}
              <div className="w-full flex justify-center overflow-visible">
                <PhoneMockup />
              </div>
            </div>

            {/* Feature Showcase (Image 3 inspired video card carousel) */}
            <div id="features">
              <FeatureShowcase />
            </div>
          </>
        ) : (
          /* Active Call State */
          <div className="py-3 sm:py-6 flex flex-col gap-4">
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
              <div className="glass flex flex-col items-center gap-4 rounded-3xl px-6 py-10 text-center">
                <div className="btn-gradient flex h-16 w-16 items-center justify-center rounded-full shadow-lg">
                  <PhoneCall size={26} className="text-white" />
                </div>
                <p className="text-sm font-semibold text-white">
                  {connectionState === "waiting" && "Looking for someone to chat with…"}
                  {connectionState === "connecting" && "Establishing connection…"}
                  {connectionState === "connected" && "Audio call connected"}
                  {connectionState === "disconnected" && "Stranger disconnected"}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleMic}
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
                      micEnabled ? "bg-white/15 text-white hover:bg-white/25" : "bg-red-500 text-white shadow-lg"
                    }`}
                  >
                    {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>
                  <button
                    onClick={skipToNext}
                    className="btn-gradient px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1.5"
                  >
                    <SkipForward size={15} /> Next
                  </button>
                  <button
                    onClick={leaveMatch}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    title="End Call"
                  >
                    <PhoneCall size={18} className="rotate-[135deg]" />
                  </button>
                </div>
              </div>
            )}

            {mode === "text" && (
              <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-8 text-center">
                <MessageSquare size={26} className="text-purple-300" />
                <p className="text-sm font-semibold text-white">
                  {connectionState === "waiting" && "Looking for someone to chat with…"}
                  {connectionState === "connecting" && "Connecting…"}
                  {connectionState === "connected" && "Connected — say hi in the chat below"}
                  {connectionState === "disconnected" && "Stranger disconnected"}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={skipToNext}
                    className="btn-gradient px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1.5"
                  >
                    <SkipForward size={15} /> Next
                  </button>
                  <button
                    onClick={leaveMatch}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    title="End Call"
                  >
                    <PhoneCall size={16} className="rotate-[135deg]" />
                  </button>
                </div>
              </div>
            )}

            {mode !== "video" && (
              <AnimatePresence>
                {overlaysReady ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <ImpactReactionOverlay sendMessage={sendMessage} subscribe={subscribe} />
                    <MiniGameOverlay isHost={isHost} sendMessage={sendMessage} subscribe={subscribe} />
                  </motion.div>
                ) : (
                  <p className="text-center text-xs text-purple-300/60">
                    Reactions and mini-games appear here once you&apos;re matched with a stranger.
                  </p>
                )}
              </AnimatePresence>
            )}
          </div>
        )}
      </main>

      {isActive && mode !== "video" && (
        <ChatDrawer sendMessage={sendMessage} subscribe={subscribe} connected={dataChannelOpen} />
      )}
    </div>
  );
}

