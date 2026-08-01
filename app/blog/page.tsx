import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generatePageSEO } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blogData";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = generatePageSEO({
  title: "Vidibro Blog — Chat Tips, Omegle Guides & Stranger Insights",
  description:
    "Read expert articles about talking to strangers online, Omegle alternatives, voice chat tips for introverts, and WebRTC privacy safety guides.",
  slug: "/blog",
});

export default function BlogIndexPage() {
  const posts = Object.values(BLOG_POSTS);
  const featured = posts[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-3 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-widest">
            <span>📚 Articles & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Vidibro Insights & Guides
          </h1>
          <p className="text-sm sm:text-base text-purple-200/80 max-w-2xl font-medium">
            Expert articles on spontaneous social discovery, Omegle alternatives, privacy safety, and overcoming social anxiety.
          </p>
        </div>

        {/* Featured Hero Article */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group rounded-3xl bg-white/5 border border-purple-500/30 overflow-hidden hover:border-purple-500/60 transition shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8"
          >
            <div className="flex flex-col justify-center gap-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-purple-300">
                <span className="bg-purple-600/30 border border-purple-400/30 rounded-full px-3 py-1 text-purple-200 font-extrabold">
                  {featured.category}
                </span>
                <span className="flex items-center gap-1 text-purple-300/70">
                  <Clock size={14} />
                  {featured.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-purple-300 transition leading-tight">
                {featured.title}
              </h2>

              <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-purple-300/80 font-medium">
                  <User size={14} className="text-purple-400" />
                  <span>{featured.author}</span>
                </div>
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-purple-950/40 border border-purple-500/20 aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/60 via-indigo-900/40 to-pink-900/60" />
              <div className="relative z-10 text-center p-6 flex flex-col items-center gap-2">
                <span className="text-4xl">📹</span>
                <span className="text-sm font-extrabold text-white uppercase tracking-wider">Vidibro Guide</span>
              </div>
            </div>
          </Link>
        )}

        {/* Articles Grid */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Latest Articles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-3xl bg-white/5 border border-purple-500/20 overflow-hidden hover:border-purple-500/50 transition p-6 flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-purple-300">
                    <span className="bg-purple-500/10 border border-purple-500/20 rounded-full px-2.5 py-0.5 font-bold">
                      {post.category}
                    </span>
                    <span className="text-purple-200/60">{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-purple-200/70 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-purple-200/70">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {post.date}
                  </span>
                  <span className="font-bold text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
