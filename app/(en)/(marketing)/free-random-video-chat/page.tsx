import { Metadata } from "next";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import RandomVideoChatContent from "./RandomVideoChatContent";

export const metadata: Metadata = generatePageSEO({
  title: "Free Random Video Chat with Strangers — No Signup (2026)",
  description:
    "Free random video chat with strangers — no signup, no download, instant match. Talk to real people worldwide via video, voice, or text. Works on any device, 180+ countries.",
  slug: "/free-random-video-chat",
});

const faqs = [
  {
    question: "What is the best free random video chat site in 2026?",
    answer:
      "Vidibro is the top free random video chat site in 2026 — instant matching with strangers from 180+ countries, no signup, no download. Video, voice, and text modes are all free with no premium tier.",
  },
  {
    question: "Can I do random video chat without signing up?",
    answer:
      "Yes. Vidibro requires zero registration. Open the site, pick a mode, and you are matched with a stranger in seconds. No email, no phone number, no account — nothing.",
  },
  {
    question: "Is random video chat free?",
    answer:
      "On Vidibro, yes — completely free. No coins, no credits, no daily limit, no paid gender filter. Video, voice, and text chat are all free forever.",
  },
  {
    question: "Can I do random video chat on my phone?",
    answer:
      "Yes. Vidibro works directly in Safari on iPhone and Chrome on Android — no app download needed. The video adapts to your connection speed so calls stay smooth on mobile data.",
  },
  {
    question: "Is random video chat safe?",
    answer:
      "Vidibro runs AI moderation in real time and gives every user a one-tap report button that ends the conversation immediately. Calls run peer-to-peer via WebRTC so no video or audio passes through our servers — we cannot record or store it.",
  },
  {
    question: "What happened to Omegle random video chat?",
    answer:
      "Omegle shut down on November 8, 2023 after 14 years. Founder Leif K-Brooks cited legal pressure and moderation challenges. Vidibro is the free replacement — same instant random matching, same no-registration model, with better moderation and mobile support.",
  },
  {
    question: "Is there random video chat with voice only — no camera?",
    answer:
      "Yes. Vidibro has a voice-only mode where your camera stays completely off. You still get matched with a random stranger and have a real audio conversation. There is also a text-only mode that needs no camera or mic at all.",
  },
];

export default function RandomVideoChatPage() {
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
                name: "Free Random Video Chat",
                item: `${BASE_URL}/free-random-video-chat`,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${BASE_URL}/free-random-video-chat#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Vidibro Random Video Chat",
            url: `${BASE_URL}/free-random-video-chat`,
            applicationCategory: "SocialNetworkingApplication",
            operatingSystem: "Web, iOS, Android",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description:
              "Free random video chat with strangers worldwide — no signup, no download, instant match.",
          },
        ]}
      />
      <RandomVideoChatContent faqs={faqs} />
    </>
  );
}
