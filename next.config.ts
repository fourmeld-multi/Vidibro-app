import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained build (only the files actually needed
  // at runtime) — much smaller Docker image than shipping the full
  // node_modules tree.
  output: "standalone",
};

export default nextConfig;
