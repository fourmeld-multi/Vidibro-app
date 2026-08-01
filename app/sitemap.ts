import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
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

  const now = new Date();

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.endsWith("-chat") || route.includes("alternative") ? 0.9 : 0.7,
  }));
}
