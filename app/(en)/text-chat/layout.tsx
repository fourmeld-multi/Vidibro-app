import type { Metadata } from "next";
import { generatePageSEO } from "@/lib/seo";

/**
 * text-chat renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
/**
 * Deliberately noindex.
 *
 * This route is the application itself — a full-screen call UI with no content
 * for a crawler to read, and adding content to it would ruin the product. The
 * page that targets this keyword is /directory/anonymous-text-chat, which
 * has the words, the FAQs and the schema, and sends people here to actually
 * use it. Leaving both indexable would put them in competition for one query.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Anonymous Text Chat with Strangers — Free, No Signup",
  description:
    "Chat by text with random strangers instantly. Fully anonymous, no registration, no chat history kept. Type to someone new the moment you land on the page.",
  slug: "/text-chat",
  noindex: true,
  keywords: [
    "anonymous text chat",
    "chat with strangers",
    "text chat no registration",
    "random chat",
    "talk to strangers online",
  ],
});

export default function TextChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
