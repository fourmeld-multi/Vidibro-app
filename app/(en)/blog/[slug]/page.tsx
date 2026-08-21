import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Clock, ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug, tagToSlug } from "@/lib/blog/posts";
import { CATEGORY_LABELS } from "@/lib/blog/types";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import PostIllustration from "@/components/blog/PostIllustration";
import FaqItem from "@/components/blog/FaqItem";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return generatePageSEO({
    title: post.title,
    description: post.excerpt,
    slug: `/blog/${post.slug}`,
    type: "article",
    publishedTime: new Date(post.date).toISOString(),
    keywords: post.tags,
  });
}

const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mt-12 mb-4 flex items-center gap-3 text-xl sm:text-2xl font-black text-white border-l-4 border-purple-500 pl-4" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-8 mb-3 text-lg font-bold text-white" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-5 leading-relaxed text-purple-100/85" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-5 ml-5 list-disc space-y-2 text-purple-100/85" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mb-5 space-y-3 text-purple-100/85 counter-reset-[step]" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="flex gap-3 items-start" {...props} />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-bold text-white" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-purple-300 underline underline-offset-2 hover:text-purple-200" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="my-6 border-l-2 border-purple-400/40 pl-4 italic text-purple-200/80" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm text-left" {...props} />
    </div>
  ),
  thead: (props: React.ComponentProps<"thead">) => (
    <thead className="bg-white/[0.06] text-purple-300 uppercase text-xs tracking-wider" {...props} />
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="px-4 py-3 font-bold" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="px-4 py-3 border-t border-white/[0.06] text-purple-100/85" {...props} />
  ),
  FaqItem,
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${BASE_URL}/blog/${post.slug}`;

  return (
    <main className="w-full">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: new Date(post.date).toISOString(),
            author: { "@type": "Person", name: post.author },
            publisher: { "@type": "Organization", name: "Vidibro", url: BASE_URL },
            mainEntityOfPage: url,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ]}
      />

      <div className="mx-auto max-w-3xl px-5 sm:px-6 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-purple-300/70">
          <Link href="/" className="hover:text-purple-200">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-purple-200">Blog</Link>
          <span className="mx-1.5">/</span>
          <span className="text-purple-200">{post.title}</span>
        </nav>

        <Link
          href={`/blog/category/${post.category}`}
          className="mb-4 inline-flex items-center rounded-full bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-300"
        >
          {CATEGORY_LABELS[post.category]}
        </Link>

        <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-purple-300/70">
          <span>{post.author}</span>
          <span>·</span>
          <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={13} /> {post.readingTimeMinutes} min read</span>
        </div>

        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl">
          <PostIllustration category={post.category} seed={post.slug} title={post.title} className="h-full w-full" />
        </div>

        <article className="mt-10 text-base sm:text-lg">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tagToSlug(tag)}`}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-purple-100/80 transition hover:border-cyan-400/30 hover:text-white"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/blog"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-purple-200"
        >
          <ArrowLeft size={16} /> Back to all posts
        </Link>
      </div>
    </main>
  );
}
