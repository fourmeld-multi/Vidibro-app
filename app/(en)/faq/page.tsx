"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

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
    a: "Simply tap the 'NEXT' button during any active video, voice, or text chat to be matched immediately with another online stranger.",
  },
  {
    q: "What should I do if someone behaves inappropriately?",
    a: "Tap the red 'Report Issue' button in the menu or footer to report inappropriate behavior. Our moderation team reviews reports 24/7.",
  },
];

export default function FAQPage() {
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
            <HelpCircle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Frequently Asked Questions</h1>
            <p className="text-sm text-purple-200/80">Everything you need to know about using Vidibro safely.</p>
          </div>
        </div>

        <div className="space-y-4">
          {FAQS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-xl"
            >
              <h3 className="text-base font-bold text-white mb-2">{item.q}</h3>
              <p className="text-sm text-purple-200/80 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
