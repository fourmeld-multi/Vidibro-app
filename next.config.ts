import type { NextConfig } from "next";
import { directoryRedirects } from "./lib/directory/redirects";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained build (only the files actually needed
  // at runtime) — much smaller Docker image than shipping the full
  // node_modules tree.
  output: "standalone",

  // Alternate keyword slugs 301 into one canonical page per market, rather than
  // being built as separate competing pages. See lib/directory/redirects.ts.
  async redirects() {
    return directoryRedirects();
  },

  // AppShowcaseCarousel pulls its 3 photos straight from Unsplash. Routing
  // them through next/image gets automatic AVIF/WebP + correctly-sized
  // requests instead of always shipping the raw 800px source.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
