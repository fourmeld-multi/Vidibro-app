import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/*/opengraph-image", "/opengraph-image"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
