import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Tag as TagIcon } from "lucide-react";
import { getAllPosts, getAllCategories, getAllTags, tagToSlug } from "@/lib/blog/posts";
import { CATEGORY_LABELS } from "@/lib/blog/types";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import PostGrid from "@/components/blog/PostGrid";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Vidibro Blog — Guides, Safety Tips, Comparisons",
  description:
    "Guides on talking to strangers online, honest safety tips, and comparisons with other random chat apps — from the team building Vidibro.",
  slug: "/blog",
  keywords: ["talk to strangers online", "random video chat guide", "online chat safety tips"],
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <main className="w-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
          ],
        }}
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-purple-300/70">
          <Link href="/" className="hover:text-purple-200">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-purple-200">Blog</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Vidibro <span className="gradient-text">Blog</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-purple-100/80">
          Guides for actually talking to strangers online, honest safety habits, and how Vidibro
          compares to other random chat apps — written by the people building it.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
          <PostGrid posts={posts} />

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
                <BookOpen size={16} className="text-purple-300" /> Categories
              </h2>
              <div className="flex flex-col gap-2">
                {categories.map(({ category, count }) => (
                  <Link
                    key={category}
                    href={`/blog/category/${category}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-purple-100/85 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <span>{CATEGORY_LABELS[category]}</span>
                    <span className="text-purple-300/50">{count}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
                <TagIcon size={16} className="text-cyan-300" /> Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map(({ tag }) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tagToSlug(tag)}`}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-purple-100/80 transition hover:border-cyan-400/30 hover:text-white"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
