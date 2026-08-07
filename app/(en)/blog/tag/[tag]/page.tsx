import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag, tagToSlug, slugToTag } from "@/lib/blog/posts";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import PostGrid from "@/components/blog/PostGrid";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: tagToSlug(t.tag) }));
}

/**
 * Tag names range from 4 chars ("2026") to 25 ("Online Conversation Tips"),
 * so one fixed suffix can't keep every rendered title (with the layout's
 * " | Vidibro" appended) inside the 50-60 char target — a short tag needs a
 * much longer suffix than a long one to reach the floor without the long
 * ones blowing past the ceiling. Try graduated suffixes shortest-first and
 * use whichever lands in range.
 */
const TITLE_SUFFIXES = [
  " — Vidibro Blog Posts",
  " — Random Chat Blog and Guides",
  " — A Practical Guide to Random Chat",
];

function titleForTag(tag: string): string {
  for (const suffix of TITLE_SUFFIXES) {
    const candidate = `"${tag}"${suffix}`;
    const rendered = `${candidate} | Vidibro`;
    if (rendered.length >= 50 && rendered.length <= 60) return candidate;
  }
  // Every tag in practice matches one of the above; this is just a safe
  // fallback if a much longer tag is ever added.
  return `"${tag}" — Vidibro Blog`;
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const tag = slugToTag(tagSlug);
  if (!tag) return {};
  return generatePageSEO({
    title: titleForTag(tag),
    description: `Browse Vidibro blog posts tagged "${tag}" — practical guides and honest advice for anyone chatting with strangers online.`,
    slug: `/blog/tag/${tagSlug}`,
  });
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagSlug } = await params;
  const tag = slugToTag(tagSlug);
  if (!tag) notFound();

  const posts = getPostsByTag(tag);

  return (
    <main className="w-full">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: tag, item: `${BASE_URL}/blog/tag/${tagSlug}` },
          ],
        }}
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-purple-300/70">
          <Link href="/" className="hover:text-purple-200">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-purple-200">Blog</Link>
          <span className="mx-1.5">/</span>
          <span className="text-purple-200">{tag}</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Tagged <span className="gradient-text">&ldquo;{tag}&rdquo;</span>
        </h1>
        <p className="mt-4 text-base text-purple-200/70">{posts.length} post{posts.length === 1 ? "" : "s"}</p>

        <div className="mt-10">
          <PostGrid posts={posts} />
        </div>
      </div>
    </main>
  );
}
