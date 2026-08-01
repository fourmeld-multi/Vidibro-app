"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

/**
 * Directory FAQ, matching the landing page's accordion behaviour.
 *
 * Conditional render plus a CSS fade rather than an animated height. Animating
 * height:0 -> auto makes JS measure the element and write an inline style every
 * frame, forcing a layout pass each time, which is what made the original
 * accordion feel sluggish on mobile. Only opacity and transform are animated
 * here, both compositor-only, so no JS runs during the reveal at all.
 *
 * The answers are still in the DOM as text for a crawler either way — the
 * FAQPage schema on the page carries the same strings, and the two must match.
 */
export default function FaqAccordion({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-2xl border transition-colors ${
              isOpen
                ? "border-purple-400/30 bg-purple-500/[0.06]"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
            >
              <span className="text-base sm:text-lg font-bold leading-snug text-white">
                {item.question}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                  isOpen
                    ? "border-purple-400/40 bg-purple-500/20 text-purple-200"
                    : "border-white/10 bg-white/5 text-purple-300"
                }`}
              >
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>

            {isOpen && (
              <p className="vidibro-faq-reveal px-5 pb-5 text-base leading-relaxed text-purple-100/80 sm:px-6 sm:pb-6">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
