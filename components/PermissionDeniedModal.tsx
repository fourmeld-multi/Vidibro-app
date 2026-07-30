"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mic, ShieldAlert, ArrowRight, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  mode: "video" | "audio";
  onRetry: () => void;
};

export default function PermissionDeniedModal({ isOpen, mode, onRetry }: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  const isVideo = mode === "video";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl text-center text-white flex flex-col items-center gap-4"
        >
          {/* Icon Header */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg">
            {isVideo ? <Camera size={28} /> : <Mic size={28} />}
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white">
              <ShieldAlert size={14} />
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-extrabold tracking-tight text-white">
              {isVideo ? "Camera & Mic Permission Required" : "Microphone Permission Required"}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed font-medium">
              {isVideo
                ? "Vidibro requires access to your camera and microphone to start video calls. Please enable camera permissions in your browser settings to continue."
                : "Vidibro requires access to your microphone to start voice calls. Please enable microphone permissions in your browser settings to continue."}
            </p>
          </div>

          {/* Security Assurance */}
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10 text-[11px] text-emerald-300 font-semibold w-full justify-center">
            🔒 P2P Encrypted & 100% Anonymous
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 w-full pt-2">
            <button
              onClick={onRetry}
              className="btn-gradient flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold text-white shadow-xl hover:scale-102 active:scale-98 transition uppercase tracking-wider"
            >
              <RefreshCw size={16} /> Allow Camera & Mic
            </button>

            <button
              onClick={() => router.push("/text-chat")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 py-3 text-xs sm:text-sm font-bold text-white transition"
            >
              <span>Switch to Anonymous Text Chat</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
