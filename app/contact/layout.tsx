import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * contact renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Contact Us",
  description:
    "Get in touch with the Vidibro team about a bug, a safety concern, a partnership, or a press enquiry.",
  slug: "/contact",
  keywords: [
    "contact vidibro",
    "random chat support",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
