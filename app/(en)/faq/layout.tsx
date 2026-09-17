import type { Metadata } from "next";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { TRANSLATIONS } from "@/lib/translations";

/**
 * faq renders as a client component, which cannot export metadata itself.
 * This layout supplies it — without it the page inherits the homepage title,
 * and nine pages sharing one title get collapsed in search results.
 */
export const metadata: Metadata = generatePageSEO({
  title: "Vidibro FAQ — Free? No Signup? Safe? All Answered",
  description:
    "Is Vidibro really free? Do you need to sign up? Is random video chat safe? Yes, yes, and yes — straight answers with no marketing fluff.",
  slug: "/faq",
  keywords: [
    "vidibro faq",
    "is random video chat safe",
    "free video chat questions",
  ],
});

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  const t = TRANSLATIONS.EN;
  // Built from the same strings the page renders. Structured data that does not
  // match visible content is a spam signal, so there is deliberately no second
  // hand-maintained copy of these answers.
  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${BASE_URL}/faq#faq`,
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      {children}
    </>
  );
}
