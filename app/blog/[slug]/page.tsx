import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generatePageSEO, generateJsonLdSchema } from "@/lib/seo";
import { BLOG_POSTS, getAllBlogSlugs, getBlogPost } from "@/lib/blogData";
import { Calendar, User, Clock, ArrowRight, ShieldCheck, Video, PhoneCall } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return generatePageSEO({
    title: post.title,
    description: post.excerpt,
    slug: `/blog/${slug}`,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function DynamicBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLdFaqs = post.faqs
    ? generateJsonLdSchema({
        type: "FAQPage",
        title: post.title,
        description: post.excerpt,
        url: `https://vidibro.com/blog/${slug}`,
        faqs: post.faqs,
      })
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      {jsonLdFaqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqs) }}
        />
      )}
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col gap-10">
        {/* Category & Title */}
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center gap-3 text-xs font-semibold text-purple-300">
            <span className="bg-purple-600/30 border border-purple-400/30 rounded-full px-3.5 py-1 text-purple-200 font-extrabold uppercase tracking-wider">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-purple-200/70">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center gap-4 pt-2 border-b border-white/10 pb-6 text-xs sm:text-sm text-purple-200/80">
            <div className="flex items-center gap-2">
              <User size={16} className="text-purple-400" />
              <span className="font-bold text-white">{post.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-pink-950/80 border border-purple-500/30 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 shadow-2xl">
          <span className="text-5xl sm:text-6xl">📹</span>
          <span className="text-base sm:text-xl font-extrabold text-white tracking-wider uppercase">
            Vidibro Official Guide
          </span>
          <span className="text-xs sm:text-sm text-purple-200/80 max-w-lg">
            100% P2P Encrypted • Zero Registration • Instant 1-on-1 Matching
          </span>
        </div>

        {/* Article Body Content */}
        <article className="rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 flex flex-col gap-6 text-purple-100/90 leading-relaxed text-sm sm:text-base whitespace-pre-line">
          {post.content}
        </article>

        {/* Article FAQs if present */}
        {post.faqs && post.faqs.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-3">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-purple-200">{faq.question}</h3>
                  <p className="text-xs sm:text-sm text-purple-300/80 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-purple-500/30 p-8 text-center flex flex-col items-center gap-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Try Vidibro Video & Voice Match Now</h2>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
            No signup, zero registration fees, and 100% P2P encrypted media streams. Start talking in under a second.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/video-chat"
              className="btn-gradient flex items-center gap-2 rounded-full px-7 py-3 text-sm font-extrabold text-white shadow-xl hover:scale-105 transition uppercase"
            >
              <Video size={18} />
              Start Video Call
            </Link>
            <Link
              href="/audio-chat"
              className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-3 text-sm font-bold text-white transition"
            >
              <PhoneCall size={16} className="text-cyan-300" />
              Voice Chat
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
