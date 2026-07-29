"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "1",
    title: "Pick Your Preferred Mode",
    desc: "Choose Video, Voice, or Text chat. No registration, email, or personal details required.",
  },
  {
    number: "2",
    title: "Instant Peer Pairing",
    desc: "Our lightning-fast matching engine pairs you with an active online stranger in under a second.",
  },
  {
    number: "3",
    title: "Enjoy & Skip Freely",
    desc: "Have fun conversations, share reactions, or hit Next whenever you're ready to meet someone new.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-14 sm:py-20 border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          How Vidibro Works
        </h2>
        <p className="text-sm sm:text-base text-purple-200/70 font-medium">
          Connect with someone new in three simple steps.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {STEPS.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-7 backdrop-blur-xl hover:border-purple-500/40 transition shadow-xl group"
          >
            {/* Huge Watermarked Step Number Background */}
            <span className="absolute top-2 left-4 text-7xl sm:text-8xl font-black text-white/[0.06] select-none pointer-events-none font-mono group-hover:text-purple-500/10 transition">
              {step.number}
            </span>

            <div className="relative z-10 flex flex-col gap-3 pt-6">
              <h3 className="text-xl font-bold text-white tracking-wide">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
