import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * video-chat renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
/**
 * Deliberately noindex.
 *
 * This route is the application itself — a full-screen call UI with no content
 * for a crawler to read, and adding content to it would ruin the product. The
 * page that targets this keyword is /directory/random-video-chat, which
 * has the words, the FAQs and the schema, and sends people here to actually
 * use it. Leaving both indexable would put them in competition for one query.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Free Random Video Chat with Strangers — No Signup",
  description:
    "Start a free random video chat with strangers in one tap. 1-on-1 HD video calls, no account, no phone number, no download. Works in any browser on mobile and desktop.",
  slug: "/video-chat",
  noindex: true,
  keywords: [
    "random video chat",
    "free video chat with strangers",
    "cam to cam chat",
    "video chat no login",
    "talk to strangers video",
  ],
});

export default function VideoChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
