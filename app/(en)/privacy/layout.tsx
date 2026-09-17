import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * privacy renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Vidibro Privacy Policy — No Account, No Stored Conversations",
  description:
    "Vidibro privacy policy — calls are peer-to-peer, no account required, no conversations stored. Here is exactly what we collect and what we do not.",
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
