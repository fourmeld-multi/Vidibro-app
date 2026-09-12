import { Metadata } from "next";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import FreeVideoChatContent from "./FreeVideoChatContent";

export const metadata: Metadata = generatePageSEO({
  title: "Free Video Chat with Strangers — No Signup, No Download (2026)",
  description:
    "Free video chat with strangers online — no signup, no download, no coins. Instant random video matching with real people from 180+ countries. Works in any browser.",
  slug: "/free-video-chat",
});

const faqs = [
  {
    question: "Is Vidibro really free for video chat?",
    answer:
      "Yes — completely free. No coins, no credits, no daily limit, no premium tier. Video, voice, and text chat are all free forever with no registration required.",
  },
  {
    question: "Can I do free video chat without signing up?",
    answer:
      "Yes. Vidibro requires zero registration. Open the site, choose video mode, and you are matched with a stranger in seconds. No email, no phone number, no account.",
  },
  {
    question: "What is the best free video chat site with strangers in 2026?",
    answer:
      "Vidibro is the top free video chat site in 2026 — instant random matching, no signup, no coins, P2P encrypted calls, AI moderation, and three modes: video, voice, and text. Works on any device without an app.",
  },
  {
    question: "Can I do free video chat on my phone without an app?",
    answer:
      "Yes. Vidibro works directly in Safari on iPhone and Chrome on Android — no app store, no installation. Open the browser, open the site, start chatting.",
  },
  {
    question: "Is free video chat with strangers safe?",
    answer:
      "On Vidibro, calls run peer-to-peer via WebRTC so no video passes through our servers. AI moderation runs in real time, and a one-tap report button ends any conversation immediately. No recording, no chat logs.",
  },
  {
    question: "Do free video chat sites have bots?",
    answer:
      "Many do. Vidibro uses AI moderation and real-time detection to remove bots and fake accounts. Every person you connect with is a real user in the queue at the same moment.",
  },
  {
    question: "What is the difference between free and paid video chat sites?",
    answer:
      "Paid sites (or sites with coin systems) gate features like gender filters, extended chat time, or HD quality behind a paywall. On Vidibro, all features are free — no coin system, no premium tier, no upgrade prompt mid-call.",
  },
];

export default function FreeVideoChatPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: "Free Video Chat",
                item: `${BASE_URL}/free-video-chat`,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${BASE_URL}/free-video-chat#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Vidibro Free Video Chat",
            url: `${BASE_URL}/free-video-chat`,
            applicationCategory: "SocialNetworkingApplication",
            operatingSystem: "Web, iOS, Android",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free video chat with strangers online — no signup, no download, instant random matching.",
          },
        ]}
      />
      <FreeVideoChatContent faqs={faqs} />
    </>
  );
}
