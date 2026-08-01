import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { ENTRIES } from "@/lib/directory/entries";

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
  "/video-chat",
  "/audio-chat",
  "/text-chat",
  "/omegle-alternative",
  "/airtalk-alternative",
  "/chatroulette-alternative",
  "/ometv-alternative",
  "/emerald-chat-alternative",
  "/directory",
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

  return [...staticEntries, ...directoryEntries];
}
