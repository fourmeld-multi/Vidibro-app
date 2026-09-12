import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * Same reason as contact/layout.tsx — about renders as a client component and
 * cannot export metadata itself, so without this it inherits the homepage
 * title.
 */
export const metadata: Metadata = generatePageSEO({
  title: "About Vidibro — Free Random Video Chat, No Signup Required",
  description:
    "Vidibro is a free random video chat app — talk to strangers instantly with no signup, no camera required for text mode. Peer-to-peer encrypted, 180+ countries, always 100% free.",
  slug: "/about",
  keywords: ["about vidibro", "what is vidibro", "vidibro review", "anonymous video chat", "peer to peer chat"],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
