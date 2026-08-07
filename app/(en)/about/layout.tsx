import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * Same reason as contact/layout.tsx — about renders as a client component and
 * cannot export metadata itself, so without this it inherits the homepage
 * title.
 */
export const metadata: Metadata = generatePageSEO({
  title: "About Vidibro — Free Anonymous Chat, No Signup",
  description:
    "What Vidibro is, how peer-to-peer video chat keeps calls private, and why there are no accounts, filters or paid tiers.",
  slug: "/about",
  keywords: ["about vidibro", "anonymous video chat", "peer to peer chat"],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
