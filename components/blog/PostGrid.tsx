import Link from "next/link";
import { Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";
import { CATEGORY_LABELS } from "@/lib/blog/types";
import PostIllustration from "@/components/blog/PostIllustration";

export default function PostGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return <p className="text-purple-200/70">No posts here yet — check back soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-purple-400/30"
        >
          <div className="aspect-[16/9] w-full overflow-hidden">
            <PostIllustration
              category={post.category}
              seed={post.slug}
              className="h-full w-full transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2.5 p-5">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-purple-300/60">
              <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTimeMinutes} min read</span>
            </div>
            <h2 className="text-lg font-black leading-snug text-white group-hover:text-purple-200 transition">
              {post.title}
            </h2>
            <p className="line-clamp-2 text-sm leading-relaxed text-purple-200/70">
              {post.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-purple-300/70">{post.author}</span>
              <span className="rounded-full bg-purple-500/15 px-3 py-1 text-[11px] font-bold text-purple-300">
                {CATEGORY_LABELS[post.category]}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
