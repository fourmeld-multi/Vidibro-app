import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * report renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Report a User or Problem",
  description:
    "Report abusive behaviour, a safety concern, or a technical problem on Vidibro. Reports are reviewed and acted on.",
  slug: "/report",
  keywords: [
    "report user",
    "report abuse random chat",
    "chat safety report",
  ],
});

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
