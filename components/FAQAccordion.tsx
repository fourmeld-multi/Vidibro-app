"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Is Vidibro completely free to use?",
    a: "Yes! Vidibro is 100% free with no registration, no hidden fees, and no subscriptions required.",
  },
  {
    q: "Do I need to create an account or sign up?",
    a: "No signup is required. You can start video, audio, or text chatting with strangers instantly with one tap.",
  },
  {
    q: "Are video and audio chats private and secure?",
    a: "All video, audio, and text streams use direct Peer-to-Peer (P2P) WebRTC encryption. Your conversations are never saved on servers.",
  },
  {
    q: "How do I skip to the next stranger?",
    a: "Simply tap the 'Next' button during any active video, voice, or text chat to be matched immediately with another online stranger.",
  },
  {
    q: "What should I do if someone behaves inappropriately?",
    a: "Tap the red 'Report Issue' button in the menu or footer to report inappropriate behavior. Our moderation team reviews reports 24/7.",
  },
];

export default function FAQAccordion() {
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
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <p className="text-sm sm:text-base text-purple-200/80 font-normal">
          Everything you need to know before you hit Start.
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

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-purple-200/75 leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
