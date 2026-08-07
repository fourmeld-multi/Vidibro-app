"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function GuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-white transition mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl btn-gradient flex items-center justify-center shadow-lg">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Community Guidelines</h1>
            <p className="text-sm text-purple-200/80">Keeping Vidibro safe, fun, and friendly for everyone.</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4 text-sm text-purple-200/90 leading-relaxed">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white">Be Respectful & Kind</h3>
              <p className="text-xs text-purple-200/80">Treat every stranger with courtesy and respect regardless of background.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white">Protect Your Privacy</h3>
              <p className="text-xs text-purple-200/80">Never share your home address, financial info, or passwords with strangers.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
