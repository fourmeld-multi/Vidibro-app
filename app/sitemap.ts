import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { ENTRIES } from "@/lib/directory/entries";
import { getAllPosts, getAllCategories, getAllTags, tagToSlug } from "@/lib/blog/posts";

const NATIVE_ROUTES = [
  "/hi", "/kn", "/ta", "/bn",
  "/ja", "/ko", "/ru", "/pt-br",
  "/id", "/vi", "/tr", "/zh", "/th",
  "/es", "/ml",
];

/**
 * Every indexable URL on the site.
 *
 * Currently static routes only. The blog and directory were removed to be
 * rebuilt from scratch (SEO-PLAN.md, Phase 1) — when they come back, generate
 * their entries from the same data the pages render from rather than hardcoding
 * them here, which is how they went missing from the sitemap the first time.
 */

const STATIC_ROUTES = [
  "",
  // /video-chat, /audio-chat and /text-chat are deliberately absent: they are
  // noindex application screens. The content pages that target those terms live
  // in the directory and are included below.
  "/dating",
  "/omegle-alternative",
  "/airtalk-alternative",
  "/chatroulette-alternative",
  "/ometv-alternative",
  "/emerald-chat-alternative",
  "/monkey-alternative",
  "/coomeet-alternative",
  "/camsurf-alternative",
  "/shagle-alternative",
  "/strangerline-alternative",
  "/directory",
  "/blog",
  "/about",
  "/faq",
  "/guidelines",
  "/privacy",
  "/terms",
  "/contact",
  "/report",
];

function priorityFor(route: string): number {
  if (route === "") return 1.0;
  if (route.endsWith("-chat")) return 0.9;
  if (route.includes("alternative")) return 0.9;
  if (route === "/directory") return 0.8;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages genuinely only change when we deploy a change to them, so a
  // build timestamp is honest here.
  const buildTime = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: buildTime,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: priorityFor(route),
  }));

  // Generated from the same data the pages render from — never hardcoded, which
  // is how the old directory ended up missing from the sitemap entirely.
  const directoryEntries: MetadataRoute.Sitemap = ENTRIES.map((e) => ({
    url: `${BASE_URL}/directory/${e.slug}`,
    lastModified: buildTime,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Same principle for the blog — generated from content/blog/*.mdx, not a
  // hand-maintained list, so a new post can never silently miss the sitemap.
  const blogPostEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const blogCategoryEntries: MetadataRoute.Sitemap = getAllCategories().map((c) => ({
    url: `${BASE_URL}/blog/category/${c.category}`,
    lastModified: buildTime,
    changeFrequency: "weekly",
    priority: 0.5,
  }));
  const blogTagEntries: MetadataRoute.Sitemap = getAllTags().map((t) => ({
    url: `${BASE_URL}/blog/tag/${tagToSlug(t.tag)}`,
    lastModified: buildTime,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const nativeEntries: MetadataRoute.Sitemap = NATIVE_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: buildTime,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...nativeEntries, ...directoryEntries, ...blogPostEntries, ...blogCategoryEntries, ...blogTagEntries];
}
