import { Metadata } from "next";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import RandomTextChatContent from "./RandomTextChatContent";

export const metadata: Metadata = generatePageSEO({
  title: "Random Text Chat — No Camera, No Signup (2026)",
  description:
    "Free random text chat — no camera, no signup, no mic. Anonymous matching worldwide. Double-tick read receipts, nothing saved.",
  slug: "/random-text-chat",
});

const faqs = [
  {
    question: "What is the best free random text chat site in 2026?",
    answer:
      "Vidibro is the top free random text chat site in 2026 — instant anonymous text matching with strangers, no camera, no signup, double-tick read receipts, and nothing stored when you close the tab.",
  },
  {
    question: "Can I text chat with strangers without a camera?",
    answer:
      "Yes. Vidibro's text mode needs no camera and no microphone. Open the site, choose text mode, and you are matched with a stranger in seconds. No permission prompts, no hardware required.",
  },
  {
    question: "Is random text chat anonymous?",
    answer:
      "Yes. Vidibro requires no registration, no email, and no account. Your identity is never attached to a conversation. When you close the tab, the conversation is gone — there are no logs, no history, nothing saved.",
  },
  {
    question: "What is the difference between random text chat and video chat?",
    answer:
      "Text chat needs no camera or microphone — just a keyboard. It gives you more time to think before you respond, works from anywhere without audio or video permissions, and removes the pressure of being on camera. Vidibro offers both text and video in the same app.",
  },
  {
    question: "Is random text chat safe?",
    answer:
      "Vidibro runs AI moderation across all chat modes, including text. A one-tap report button ends the conversation immediately and escalates to a moderation queue. No conversation is stored — nothing can be retrieved after the session ends.",
  },
  {
    question: "Can I do random text chat on my phone?",
    answer:
      "Yes. Vidibro's text mode works on any smartphone browser — no app download, no installation. Open Safari or Chrome, open the site, pick text mode, and start chatting.",
  },
  {
    question: "Does random text chat have read receipts?",
    answer:
      "Yes. Vidibro's text chat shows double-tick read receipts — one tick when your message is sent, two ticks when it has been read. You always know whether the other person has seen your message.",
  },
];

export default function RandomTextChatPage() {
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
                name: "Random Text Chat",
                item: `${BASE_URL}/random-text-chat`,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${BASE_URL}/random-text-chat#faq`,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Vidibro Random Text Chat",
            url: `${BASE_URL}/random-text-chat`,
            applicationCategory: "SocialNetworkingApplication",
            operatingSystem: "Web, iOS, Android",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Free random text chat with strangers — no camera, no signup, anonymous, nothing saved.",
          },
        ]}
      />
      <RandomTextChatContent faqs={faqs} />
    </>
  );
}
