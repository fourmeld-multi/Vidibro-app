import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vidibro — Talk to a Random Stranger, Instantly",
    short_name: "Vidibro",
    description:
      "Anonymous, zero-login video, voice and text chat. Get matched instantly — no account, no history.",
    start_url: "/",
    display: "standalone",
    background_color: "#070414",
    theme_color: "#0e0828",
    categories: ["social", "communication"],
    icons: [
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}
