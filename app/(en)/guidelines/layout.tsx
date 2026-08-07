import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * guidelines renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Community Guidelines",
  description:
    "The rules for using Vidibro: what is not allowed, how reporting works, and what happens when someone breaks them. Read before you start chatting.",
  slug: "/guidelines",
  keywords: [
    "community guidelines",
    "random chat rules",
    "chat safety rules",
  ],
});

export default function GuidelinesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
