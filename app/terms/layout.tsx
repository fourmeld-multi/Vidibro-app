import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * terms renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Terms of Service",
  description:
    "The terms governing your use of Vidibro, including acceptable use, age requirements, and limitations of liability.",
  slug: "/terms",
  keywords: [
    "terms of service",
  ],
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
