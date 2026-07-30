"use client";

import { motion } from "framer-motion";
import { Camera, Server, UserCheck, ShieldOff } from "lucide-react";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

export default function PrivacyFlowSection({ lang = "EN" }: { lang?: LanguageCode }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const STEPS = [
    { icon: Camera, title: t.privacyStep1Title, desc: t.privacyStep1Desc, color: "text-pink-400" },
    { icon: Server, title: t.privacyStep2Title, desc: t.privacyStep2Desc, color: "text-cyan-400" },
    { icon: UserCheck, title: t.privacyStep3Title, desc: t.privacyStep3Desc, color: "text-amber-400" },
  ];

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          {t.privacyTitle1} <span className="gradient-text">{t.privacyTitle2}</span>
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal max-w-xl mx-auto">
          {t.privacySubtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3 items-stretch">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                <step.icon size={18} className={step.color} />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white">{step.title}</h3>
              <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed">{step.desc}</p>

              {i < STEPS.length - 1 && (
                <motion.div
                  className="hidden sm:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-purple-400/60 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 + 0.3 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-xs sm:text-sm text-purple-200/60">
          <ShieldOff size={14} className="text-emerald-400" />
          <span>{t.privacyFooterNote}</span>
        </div>
      </div>
    </section>
  );
}
