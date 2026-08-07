import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Best Shagle Alternative 2026 (100% Free)",
  description:
    "Looking for a Shagle alternative with no virtual gifts or credits? Vidibro offers video, voice and text chat with strangers — free, no extras.",
  slug: "/shagle-alternative",
});

export default function ShagleAlternativePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Shagle Alternative", item: `${BASE_URL}/shagle-alternative` },
          ],
        }}
      />
      <AlternativePageTemplate
      competitorName="Shagle"
      pageTitle="The Best Free Shagle Alternative in 2026"
      subtitle="Shagle's core chat is genuinely free, but gender and location filters sit behind a paid plan, and its virtual gifts and credits system adds a whole extra layer of spending on top. Vidibro keeps it to one thing: free, anonymous chat, with nothing to buy."
      metaDescription="Looking for a Shagle alternative with no virtual gifts or credits system? Vidibro offers free video, voice and text chat with strangers, no extras."
      comparisonFeatures={[
        { feature: "Completely Free, No Paid Plan", vidibro: true, competitor: "Filters require payment" },
        { feature: "No Virtual Gifts or Credits System", vidibro: true, competitor: false },
        { feature: "Zero Registration Required", vidibro: true, competitor: true },
        { feature: "Voice-Only & Text Modes", vidibro: true, competitor: false },
        { feature: "P2P WebRTC Direct Stream", vidibro: true, competitor: false },
      ]}
      sections={[
        {
          heading: "Vidibro vs Shagle: One Free Experience, Not a Store",
          content:
            "Shagle's basic random text and video chat is free to use, which is a real point in its favor — but the moment you want a gender or location filter, that's a paid feature. On top of that, Shagle runs a virtual gifts and credits system, adding a spending layer that has nothing to do with the conversation itself.\n\nVidibro has no store, no credits, and nothing to buy at any point. Video, voice and text modes all work exactly the same way for every visitor, and there's no second tier of the product hiding behind a purchase.",
        },
        {
          heading: "No Filters, No Gifting, Just the Conversation",
          content:
            "Shagle's filters and gifting economy are built around giving users more control and ways to stand out — a legitimate approach, but one that adds real complexity and cost on top of a random chat platform. Vidibro deliberately leaves all of that out: the queue is one shared, anonymous pool, and the entire product is just the call itself.\n\nIf what you actually want is to talk to a random stranger without navigating a filter paywall or a gifting system first, that's the whole of what Vidibro does — nothing more layered on top.",
        },
      ]}
    />
    </>
  );
}