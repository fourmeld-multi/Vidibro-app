"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, Send, CheckCircle2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ReportUsModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Inappropriate Video / Nudity");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    // Reset after the close animation so a fresh report starts blank next time.
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setDetails("");
    }, 250);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-3xl bg-[#120836] border border-purple-500/30 p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Report an Issue or Abuse</h3>
                  <p className="text-[11px] text-purple-200/70 font-medium">Our safety team reviews reports 24/7</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-full p-1.5 text-purple-300 hover:bg-white/10 hover:text-white transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                <CheckCircle2 size={48} className="text-emerald-400" />
                <h4 className="text-lg font-extrabold text-white">Report Submitted</h4>
                <p className="text-xs text-purple-200/80 max-w-xs font-medium">
                  Thank you for helping keep Vidibro safe.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-2 rounded-full bg-white/10 hover:bg-white/20 px-5 py-2 text-xs font-bold text-white border border-white/15 transition"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-purple-200 mb-1">Name (optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-purple-300/50 outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-200 mb-1">Email (optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-purple-300/50 outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-[#120a2e] border border-white/15 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400 transition"
                  >
                    <option>Inappropriate Video / Nudity</option>
                    <option>Harassment or Verbal Abuse</option>
                    <option>Spam or Commercial Promotion</option>
                    <option>Underage User Suspicion</option>
                    <option>Technical Bug / App Glitch</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1">Details & Context</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    required
                    placeholder="Describe what happened or explain the issue..."
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-purple-300/50 outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 bg-red-600 hover:bg-red-500 w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-red-600/30 transition hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Submit Report
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
