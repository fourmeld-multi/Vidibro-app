import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCategories, getPostsByCategory } from "@/lib/blog/posts";
import { CATEGORY_LABELS, type BlogCategory } from "@/lib/blog/types";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import PostGrid from "@/components/blog/PostGrid";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category as BlogCategory];
  if (!label) return {};
  return generatePageSEO({
    title: `${label} — Random Chat Tips and Advice Blog`,
    description: `${label} posts from the Vidibro blog — practical guides and honest advice for anyone chatting with strangers online.`,
    slug: `/blog/category/${category}`,
  });
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category as BlogCategory];
  if (!label) notFound();

  const posts = getPostsByCategory(category as BlogCategory);

  return (
    <main className="w-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: label, item: `${BASE_URL}/blog/category/${category}` },
          ],
        }}
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-purple-300/70">
          <Link href="/" className="hover:text-purple-200">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-purple-200">Blog</Link>
          <span className="mx-1.5">/</span>
          <span className="text-purple-200">{label}</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {label} <span className="gradient-text">posts</span>
        </h1>
        <p className="mt-4 text-base text-purple-200/70">{posts.length} post{posts.length === 1 ? "" : "s"}</p>

        <div className="mt-10">
          <PostGrid posts={posts} />
        </div>
      </div>
    </main>
  );
}
