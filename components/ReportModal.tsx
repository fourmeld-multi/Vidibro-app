"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, ShieldAlert, CheckCircle2 } from "lucide-react";

const REPORT_REASONS = [
  { id: "nudity", label: "Nudity or Sexual Content", icon: "🔞" },
  { id: "harassment", label: "Harassment or Bullying", icon: "🚫" },
  { id: "spam", label: "Spam, Ads or Scam", icon: "⚠️" },
  { id: "underage", label: "Appears Underage (<18)", icon: "🛡️" },
  { id: "other", label: "Other Policy Violation", icon: "❓" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (reason: string, comment?: string) => void;
};

export default function ReportModal({ isOpen, onClose, onReportSubmitted }: Props) {
  const [selectedReason, setSelectedReason] = useState<string>("nudity");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        onReportSubmitted(selectedReason, comment);
        onClose();
      }, 1200);
    }, 400);
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md rounded-3xl bg-[#120836] border border-purple-500/30 p-6 shadow-2xl text-white flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                <Flag size={18} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Report Stranger</h3>
                <p className="text-[11px] text-purple-200/70 font-medium">Keep Vidibro safe and clean</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-purple-300 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {submittedSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
              <CheckCircle2 size={48} className="text-emerald-400 animate-bounce" />
              <h4 className="text-lg font-extrabold text-white">Report Submitted!</h4>
              <p className="text-xs text-purple-200/80 max-w-xs font-medium">
                User blocked successfully. Finding you a new match now…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-xs text-purple-200/90 font-medium">
                Select the reason for reporting this user:
              </p>

              {/* Reasons Grid */}
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border text-xs font-semibold transition text-left ${
                      selectedReason === r.id
                        ? "bg-purple-600/40 border-pink-500/60 text-white shadow-md"
                        : "bg-white/5 border-white/10 text-purple-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{r.icon}</span>
                      <span>{r.label}</span>
                    </span>
                    {selectedReason === r.id && (
                      <span className="h-2 w-2 rounded-full bg-pink-400 shadow-glow" />
                    )}
                  </button>
                ))}
              </div>

              {/* Comment Text Area */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Additional details (optional)..."
                rows={2}
                className="w-full rounded-2xl bg-white/5 border border-white/15 p-3 text-xs text-white placeholder-purple-300/50 outline-none focus:border-purple-400 transition"
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 text-xs border border-white/15 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-extrabold py-2.5 text-xs rounded-full shadow-lg shadow-red-600/30 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert size={14} />
                  <span>Report & Skip</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
