import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * audio-chat renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Random Voice Chat — Talk to Strangers Without Camera",
  description:
    "Free random voice calls with strangers, camera off. Perfect if you want real conversation without being on video. No signup, no download, instant matching.",
  slug: "/audio-chat",
  keywords: [
    "random voice chat",
    "random audio call",
    "talk to strangers without camera",
    "anonymous voice chat",
    "voice chat online",
  ],
});

export default function AudioChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
