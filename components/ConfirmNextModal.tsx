"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Small confirmation shown before skipping the current stranger, so a stray
 * tap on "Next" doesn't silently end a conversation the user was enjoying.
 */
export default function ConfirmNextModal({ isOpen, onCancel, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4">
          {/* No backdrop-filter here on purpose — a full-viewport blur is the
              single most expensive thing this overlay could do on a phone,
              and over an 85% scrim it isn't even visible. Only opacity and
              transform are animated (both compositor-only) and kept short,
              so opening feels immediate rather than "loading". */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="relative w-full max-w-xs rounded-3xl bg-[#120836] border border-purple-500/30 p-6 shadow-2xl text-white flex flex-col gap-4 text-center"
          >
            <button
              onClick={onCancel}
              className="absolute top-3 right-3 rounded-full p-1.5 text-purple-300 hover:bg-white/10 hover:text-white transition"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30">
              <SkipForward size={22} className="text-purple-300" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-extrabold text-white">Find a new partner?</h3>
              <p className="text-xs text-purple-200/75 leading-relaxed">
                This will end your current conversation and connect you with someone else.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onCancel}
                className="flex-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 py-2.5 text-xs font-bold text-white transition"
              >
                Stay
              </button>
              <button
                onClick={onConfirm}
                className="btn-gradient flex-1 rounded-full py-2.5 text-xs font-extrabold text-white shadow-lg transition hover:scale-[1.03]"
              >
                Yes, Next
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
