"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
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
          <div className="h-10 w-10 rounded-2xl btn-gradient flex items-center justify-center shadow-lg">
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Contact Us</h1>
            <p className="text-sm text-purple-200/80">Have questions or feedback? Send us a message.</p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-6 text-center text-emerald-300 font-bold">
            Thank you! Your message has been received. Our team will get back to you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can we help you?"
                className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="btn-gradient w-full py-3 rounded-xl font-bold text-white shadow-xl hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <Send size={16} /> Send Message
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
