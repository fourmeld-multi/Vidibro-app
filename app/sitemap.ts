import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/blogData";
import { DIRECTORY_ITEMS } from "@/lib/directoryData";

/**
 * Every indexable URL on the site.
 *
 * This used to be a hardcoded list of static routes only, which meant no blog
 * post and no directory page was ever submitted to Google — the two sections we
 * actually intend to rank with were invisible to it. They are now generated
 * from the same data the pages render from, so adding content can never again
 * silently skip the sitemap.
 */

const STATIC_ROUTES = [
  "",
  "/video-chat",
  "/audio-chat",
  "/text-chat",
  "/omegle-alternative",
  "/airtalk-alternative",
  "/chatroulette-alternative",
  "/ometv-alternative",
  "/emerald-chat-alternative",
  "/directory",
  "/blog",
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
  if (route === "/directory" || route === "/blog") return 0.8;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages genuinely only change when we deploy a change to them, so a
  // build timestamp is honest here. Content pages carry their own dates below.
  const buildTime = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: buildTime,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: priorityFor(route),
  }));

  const blogEntries: MetadataRoute.Sitemap = Object.values(BLOG_POSTS).map((post) => {
    // Fall back to the build time only if a post's date is unparseable, rather
    // than emitting an Invalid Date that would break the whole sitemap.
    const published = new Date(post.date);
    return {
      url: `${BASE_URL}/blog/${post.slug}`,
      // The post's own date, not the build time. Stamping every page with
      // "changed today" on every deploy teaches Google to ignore the signal.
      lastModified: Number.isNaN(published.getTime()) ? buildTime : published,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  const directoryEntries: MetadataRoute.Sitemap = Object.values(DIRECTORY_ITEMS).map((item) => ({
    url: `${BASE_URL}/directory/${item.slug}`,
    lastModified: buildTime,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries, ...directoryEntries];
}
