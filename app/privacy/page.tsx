"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
            <p className="text-sm text-purple-200/80">Last updated: July 2026</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6 text-sm text-purple-200/90 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. No Personal Data Collection</h2>
            <p>Vidibro is designed to be 100% anonymous. We do not require account registration, email addresses, phone numbers, or passwords to use the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Peer-to-Peer Encryption (WebRTC)</h2>
            <p>All video calls, voice conversations, and text messages are transmitted directly between peers using WebRTC technology. Your audio and video streams never pass through or record onto our central servers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Cookies and Local Storage</h2>
            <p>We use minimal session storage strictly necessary to maintain temporary matching states and user UI preferences.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
