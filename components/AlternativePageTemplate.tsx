"use client";

import { motion } from "framer-motion";
import { Video, PhoneCall, MessageSquare, ShieldCheck, Zap, Lock, Check, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  competitorName: string;
  pageTitle: string;
  subtitle: string;
  metaDescription: string;
  comparisonFeatures: Array<{
    feature: string;
    vidibro: boolean | string;
    competitor: boolean | string;
  }>;
  sections: Array<{
    heading: string;
    content: string;
  }>;
};

export default function AlternativePageTemplate({
  competitorName,
  pageTitle,
  subtitle,
  comparisonFeatures,
  sections,
}: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-12">
        {/* Hero Section */}
        <div className="text-center flex flex-col items-center gap-4 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-widest">
            <span>⚡ 2026 Alternative Guide</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">
            {pageTitle}
          </h1>

          <p className="text-base sm:text-lg text-purple-200/80 max-w-2xl font-medium leading-relaxed">
            {subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
            <button
              onClick={() => router.push("/video-chat")}
              className="btn-gradient glow-pulse flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-extrabold text-white shadow-2xl transition uppercase tracking-wider"
            >
              <Video size={20} />
              Start Video Call Now
            </button>

            <button
              onClick={() => router.push("/audio-chat")}
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition"
            >
              <PhoneCall size={18} className="text-cyan-300" />
              Voice Chat
            </button>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="rounded-3xl bg-white/5 border border-purple-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Vidibro vs. {competitorName}: Side-by-Side Comparison
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/70 font-medium">
              See why millions of users switch to Vidibro for faster, safer 1-on-1 random matches.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase font-extrabold text-purple-300">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-center bg-purple-600/20 text-white rounded-t-xl">Vidibro</th>
                  <th className="py-3 px-4 text-center">{competitorName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm font-medium">
                {comparisonFeatures.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-4 px-4 font-semibold text-gray-200">{item.feature}</td>
                    <td className="py-4 px-4 text-center bg-purple-600/10 font-bold text-purple-300">
                      {typeof item.vidibro === "boolean" ? (
                        item.vidibro ? <Check size={18} className="text-emerald-400 mx-auto" /> : <X size={18} className="text-red-400 mx-auto" />
                      ) : (
                        item.vidibro
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-400">
                      {typeof item.competitor === "boolean" ? (
                        item.competitor ? <Check size={18} className="text-emerald-400 mx-auto" /> : <X size={18} className="text-red-400 mx-auto" />
                      ) : (
                        item.competitor
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Human-Style Content Sections */}
        <div className="flex flex-col gap-8 text-purple-100/90 leading-relaxed font-normal text-sm sm:text-base">
          {sections.map((sec, idx) => (
            <div key={idx} className="flex flex-col gap-3 rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8">
              <h2 className="text-lg sm:text-2xl font-bold text-white">{sec.heading}</h2>
              <p className="whitespace-pre-line text-purple-200/80 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-500/30 p-8 text-center flex flex-col items-center gap-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready for a Better Chat Experience?</h2>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
            No signup, zero registration fees, and 100% P2P encrypted media streams. Connect with a stranger right now.
          </p>
          <button
            onClick={() => router.push("/video-chat")}
            className="btn-gradient flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-extrabold text-white shadow-xl hover:scale-105 transition uppercase"
          >
            <span>Launch Vidibro Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
