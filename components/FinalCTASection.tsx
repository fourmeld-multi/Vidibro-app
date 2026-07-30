"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Video } from "lucide-react";

export default function FinalCTASection() {
  const router = useRouter();

  return (
    <section className="w-full py-16 sm:py-24 text-center">
      <div className="max-w-2xl mx-auto px-4 flex flex-col items-center gap-4">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Ready to Meet Someone <span className="gradient-text">New</span>?
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal max-w-lg">
          No camera required, no signup, no waiting around. Vidibro is free, instant, and anonymous —
          real conversations with real people, worldwide.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push("/video-chat")}
          className="btn-gradient glow-pulse mt-2 flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base sm:text-lg font-extrabold text-white shadow-2xl shadow-purple-500/30 transition"
        >
          <Video size={20} />
          Start Chatting Now
        </motion.button>
      </div>
    </section>
  );
}
