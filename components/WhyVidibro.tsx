"use client";

import { motion } from "framer-motion";
import { Zap, Lock, Globe, Smartphone, Mic, ShieldCheck } from "lucide-react";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

export default function WhyVidibro({ lang = "EN" }: { lang?: LanguageCode }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const REASONS = [
    { icon: Zap, iconColor: "text-amber-400", title: t.card1Title, desc: t.card1Desc },
    { icon: Lock, iconColor: "text-emerald-400", title: t.card2Title, desc: t.card2Desc },
    { icon: Globe, iconColor: "text-cyan-400", title: t.card3Title, desc: t.card3Desc },
    { icon: Smartphone, iconColor: "text-purple-400", title: t.card4Title, desc: t.card4Desc },
    { icon: Mic, iconColor: "text-pink-400", title: t.card5Title, desc: t.card5Desc },
    { icon: ShieldCheck, iconColor: "text-indigo-400", title: t.card6Title, desc: t.card6Desc },
  ];

  return (
    <section className="w-full py-14 sm:py-20 border-t border-white/10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {t.whyTitle1} {t.whyTitle2}
        </h2>
        <p className="text-sm sm:text-base text-purple-200/70 font-medium">
          {t.whySubtitle}
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
              animate={{ opacity: 1, y: 0 }}
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
