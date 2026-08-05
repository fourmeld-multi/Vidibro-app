import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogCategory, BlogFrontmatter, BlogPost } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx$/, "");
}

/**
 * Reads and parses every .mdx file once per process. Blog content only
 * changes on deploy (same as the directory entries), so there is nothing to
 * gain from re-reading the filesystem on every call within a single build —
 * this cache just avoids re-parsing frontmatter for every getAllPosts() /
 * getPostBySlug() call during a single static export.
 */
let cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (cache) return cache;

  const filenames = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = filenames.map((filename) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
    const { data, content } = matter(raw);
    const frontmatter = data as BlogFrontmatter;
    const slug = frontmatter.slug || slugFromFilename(filename);

    return {
      ...frontmatter,
      slug,
      content,
      readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    };
  });

  // Newest first, matching how AirTALK's listing (and every blog convention)
  // orders posts — a reader expects the top of the page to be current.
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  const normalized = tag.toLowerCase();
  return getAllPosts().filter((p) => p.tags.some((t) => t.toLowerCase() === normalized));
}

export function getAllCategories(): { category: BlogCategory; count: number }[] {
  const counts = new Map<BlogCategory, number>();
  for (const post of getAllPosts()) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
}

/** Tag -> display casing taken from its first occurrence, plus how many posts use it. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function tagToSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export function slugToTag(slug: string): string | undefined {
  return getAllTags().find((t) => tagToSlug(t.tag) === slug)?.tag;
}
