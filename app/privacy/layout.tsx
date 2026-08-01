import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * privacy renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Privacy Policy",
  description:
    "What Vidibro collects and what it does not. Calls are peer-to-peer, no account is required, and conversations are never stored.",
  slug: "/privacy",
  keywords: [
    "privacy policy",
    "anonymous chat privacy",
    "is random video chat private",
  ],
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
