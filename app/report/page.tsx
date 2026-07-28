"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-white transition mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Report an Issue or Abuse</h1>
            <p className="text-sm text-purple-200/80">Our safety team investigates all reports 24/7.</p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-6 text-center text-emerald-300 font-bold">
            Report Submitted. Thank you for helping keep Vidibro safe!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Issue Category</label>
              <select className="w-full rounded-xl bg-[#120a2e] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400">
                <option>Inappropriate Video / Nudity</option>
                <option>Harassment or Verbal Abuse</option>
                <option>Spam or Commercial Promotion</option>
                <option>Underage User Suspicion</option>
                <option>Technical Bug / App Glitch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Details & Context</label>
              <textarea
                rows={4}
                required
                placeholder="Describe what happened or explain the issue..."
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 w-full py-3 rounded-xl font-bold text-white shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <Send size={16} /> Submit Report
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
