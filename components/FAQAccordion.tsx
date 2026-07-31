"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

export default function FAQAccordion({ lang = "EN" }: { lang?: LanguageCode }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const FAQS = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Keep the toggled question anchored in a stable position instead of
  // letting the page reflow jump around unpredictably as content above/
  // below it grows or shrinks.
  useEffect(() => {
    if (openIndex === null) return;
    itemRefs.current[openIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [openIndex]);

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          {t.faqTitle1} <span className="gradient-text">{t.faqTitle2}</span>
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal">
          {t.faqSubtitle}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-3">
        {FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.q}
              className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <button
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base font-bold text-white">{item.q}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-purple-300">
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              {/* Previously animated height:0 -> auto via framer-motion, which
                  makes JS measure the element and write an inline style every
                  frame, forcing a layout pass each time — the usual cause of
                  sluggish accordions on mobile. The expand itself is now a
                  single instant layout change, with only opacity/transform
                  animated in CSS (both compositor-only), so no JS runs during
                  the animation at all. */}
              {isOpen && (
                <p className="vidibro-faq-reveal px-5 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-purple-200/75 leading-relaxed">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
