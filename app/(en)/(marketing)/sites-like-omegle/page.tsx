import { Metadata } from "next";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SitesLikeOmegleContent from "./SitesLikeOmegleContent";

export const metadata: Metadata = generatePageSEO({
  title: "Top 10 Sites Like Omegle 2026 — Best Free Replacements Ranked",
  description:
    "We tested 40+ sites like Omegle so you don't have to. Here are the 10 best Omegle replacements in 2026 — ranked by speed, safety, and genuinely free features. Vidibro ranked #1.",
  slug: "/sites-like-omegle",
});

const faqs = [
  {
    question: "What is the closest site to Omegle in 2026?",
    answer:
      "Vidibro is the closest free alternative to Omegle in 2026 — same instant random matching with zero registration, but with voice-only mode, text chat with read receipts, AI moderation, and mobile-first design. Omegle shut down in November 2023 after 14 years.",
  },
  {
    question: "Why did Omegle shut down?",
    answer:
      "Omegle shut down on November 8, 2023. Founder Leif K-Brooks cited mounting legal pressure over lack of content moderation and the personal stress of running the platform. After 14 years and millions of daily users, it closed permanently.",
  },
  {
    question: "Are sites like Omegle safe in 2026?",
    answer:
      "Safety varies significantly between platforms. Vidibro uses real-time AI moderation, a one-tap report button that ends the call immediately, and P2P WebRTC connections that mean no video or audio passes through any server. Sites with no moderation (like Omegle was by the end) are genuinely risky.",
  },
  {
    question: "Do I have to pay to use these Omegle alternatives?",
    answer:
      "Vidibro is 100% free with no coin system, no premium tier, and no credit card required. Several others on this list (Chatrandom, Shagle, CooMeet) lock their best features behind a paywall. CooMeet charges per minute.",
  },
  {
    question: "Is there an Omegle alternative without registration?",
    answer:
      "Yes — Vidibro, Chatroulette, Bazoocam, Camsurf, and Shagle all work without registration. OmeTV and Monkey require a social media login. Vidibro requires nothing — open the page and you're matched in seconds.",
  },
  {
    question: "Which Omegle alternative has the most users in 2026?",
    answer:
      "Vidibro and OmeTV have the largest active user bases among the true Omegle alternatives in 2026. Vidibro's no-login model attracts users from 180+ countries with 24-hour active queues.",
  },
  {
    question: "Can I use an Omegle alternative on my phone?",
    answer:
      "Vidibro works in any mobile browser (Safari on iPhone, Chrome on Android) with no app download. Camsurf has a mobile app but degrades the web experience to force installs. Bazoocam has no mobile optimization at all.",
  },
];

export default function SitesLikeOmeglePage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Sites Like Omegle", item: `${BASE_URL}/sites-like-omegle` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${BASE_URL}/sites-like-omegle#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Top 11 Sites Like Omegle 2026",
            description: "The best Omegle alternatives tested and ranked in 2026",
            numberOfItems: 11,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Vidibro", url: BASE_URL },
              { "@type": "ListItem", position: 2, name: "OmeTV", url: "https://ome.tv" },
              { "@type": "ListItem", position: 3, name: "Chatroulette", url: "https://chatroulette.com" },
              { "@type": "ListItem", position: 4, name: "Emerald Chat", url: "https://emeraldchat.com" },
              { "@type": "ListItem", position: 5, name: "Chatrandom", url: "https://chatrandom.com" },
              { "@type": "ListItem", position: 6, name: "Shagle", url: "https://shagle.com" },
              { "@type": "ListItem", position: 7, name: "Bazoocam", url: "https://bazoocam.org" },
              { "@type": "ListItem", position: 8, name: "Camsurf", url: "https://camsurf.com" },
              { "@type": "ListItem", position: 9, name: "CooMeet", url: "https://coomeet.com" },
              { "@type": "ListItem", position: 10, name: "Monkey", url: "https://monkey.app" },
              { "@type": "ListItem", position: 11, name: "SillyChat", url: "https://silly.chat" },
            ],
          },
        ]}
      />
      <SitesLikeOmegleContent faqs={faqs} />
    </>
  );
}
