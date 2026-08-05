export type BlogCategory = "guides" | "safety" | "comparisons" | "community";

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  guides: "Guides",
  safety: "Safety",
  comparisons: "Comparisons",
  community: "Community",
};

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string; // ISO date, e.g. "2026-08-05"
  author: string;
  category: BlogCategory;
  tags: string[];
  excerpt: string;
};

export type BlogPost = BlogFrontmatter & {
  content: string;
  readingTimeMinutes: number;
};
