"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Terms of Service</h1>
            <p className="text-sm text-purple-200/80">Rules and conditions for using Vidibro.</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6 text-sm text-purple-200/90 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Age Requirement (18+)</h2>
            <p>You must be at least 18 years of age (or legal adult age in your jurisdiction) to use Vidibro.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Prohibited Conduct</h2>
            <p>Users must not transmit inappropriate content, harassment, hate speech, explicit illegal material, or perform unauthorized recordings.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
