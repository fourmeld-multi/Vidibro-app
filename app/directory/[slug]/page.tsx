import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generatePageSEO, generateJsonLdSchema } from "@/lib/seo";
import { DIRECTORY_ITEMS, getAllDirectorySlugs, getDirectoryItem } from "@/lib/directoryData";
import { Video, PhoneCall, MessageSquare, Clock, Globe, ShieldCheck, ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllDirectorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getDirectoryItem(slug);

  if (!item) {
    return {};
  }

  return generatePageSEO({
    title: item.title,
    description: item.description.slice(0, 155),
    slug: `/directory/${slug}`,
  });
}

export default async function DynamicDirectoryPage({ params }: Props) {
  const { slug } = await params;
  const item = getDirectoryItem(slug);

  if (!item) {
    notFound();
  }

  const jsonLdFaqs = generateJsonLdSchema({
    type: "FAQPage",
    title: item.title,
    description: item.description,
    url: `https://vidibro.com/directory/${slug}`,
    faqs: item.faqs,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqs) }}
      />
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
        {/* Header Badge & Title */}
        <div className="text-center flex flex-col items-center gap-3 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-wider">
            <span>{item.flag || "🌐"} {item.name} Hub</span>
            <span>•</span>
            <span className="text-emerald-400">🟢 {item.onlineCount} Online</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {item.title}
          </h1>
        </div>

        {/* Live Matching CTA Card */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-pink-900/60 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-purple-200">
            <span className="flex items-center gap-1.5">
              <Globe size={15} className="text-cyan-300" />
              <span>Languages: {item.languages.join(", ")}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-amber-300" />
              <span>Peak Times: {item.peakTimes}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Link
              href="/video-chat"
              className="btn-gradient glow-pulse flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-extrabold text-white uppercase shadow-xl transition"
            >
              <Video size={18} />
              Start Video Match
            </Link>

            <Link
              href="/audio-chat"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition"
            >
              <PhoneCall size={16} className="text-cyan-300" />
              Voice Chat
            </Link>

            <Link
              href="/text-chat"
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition"
            >
              <MessageSquare size={16} className="text-pink-300" />
              Text Chat
            </Link>
          </div>
        </div>

        {/* Human-Style Description */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white">About Stranger Chatting in {item.name}</h2>
          <p className="text-purple-200/80 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {item.description}
          </p>
        </div>

        {/* Localized FAQs */}
        {item.faqs && item.faqs.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-3">
              {item.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-purple-200">{faq.question}</h3>
                  <p className="text-xs sm:text-sm text-purple-300/80 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
