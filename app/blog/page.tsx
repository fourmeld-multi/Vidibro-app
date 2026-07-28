"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BookOpen, ArrowLeft, Calendar, User } from "lucide-react";

const POSTS = [
  {
    title: "10 Safety Tips for Meeting Strangers Online",
    date: "July 24, 2026",
    author: "Vidibro Safety Team",
    excerpt: "Learn how to protect your privacy, avoid common scams, and have a safe, enjoyable random video chatting experience.",
  },
  {
    title: "Why Voice Chat Without Video is Becoming Popular",
    date: "July 18, 2026",
    author: "Vidibro Tech Blog",
    excerpt: "Discover why millions of users prefer audio-only stranger matching to talk freely without camera pressure or social anxiety.",
  },
  {
    title: "How WebRTC P2P Encryption Keeps Your Calls Private",
    date: "July 10, 2026",
    author: "Engineering Team",
    excerpt: "A deep dive into peer-to-peer WebRTC architecture and how direct media streaming ensures no server ever records your video.",
  },
];

export default function BlogPage() {
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
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Vidibro Blog & Articles</h1>
            <p className="text-sm text-purple-200/80">Latest news, safety guides, and product updates.</p>
          </div>
        </div>

        <div className="space-y-6">
          {POSTS.map((post, idx) => (
            <article
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl hover:border-purple-400/30 transition"
            >
              <div className="flex items-center gap-4 text-xs text-purple-300 mb-2">
                <span className="flex items-center gap-1"><Calendar size={13} /> {post.date}</span>
                <span className="flex items-center gap-1"><User size={13} /> {post.author}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
              <p className="text-sm text-purple-200/80 leading-relaxed mb-4">{post.excerpt}</p>
              <button className="text-xs font-bold text-cyan-300 hover:underline">Read Full Article →</button>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
