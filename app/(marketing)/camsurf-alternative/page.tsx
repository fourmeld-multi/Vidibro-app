import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Best Camsurf Alternative 2026, No Paywall",
  description:
    "Looking for a Camsurf alternative with no premium tier? Vidibro offers unlimited, ad-free video, voice and text chat — completely free, always.",
  slug: "/camsurf-alternative",
});

export default function CamsurfAlternativePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Camsurf Alternative", item: `${BASE_URL}/camsurf-alternative` },
          ],
        }}
      />
      <AlternativePageTemplate
      competitorName="Camsurf"
      pageTitle="The Best Free Camsurf Alternative in 2026"
      subtitle="Camsurf's free tier comes with daily limits on its filters and ads that only go away on Camsurf Premium. Vidibro skips the tiers entirely — one free experience, no ads, no upgrade prompts, no limits ticking down in the background."
      metaDescription="Looking for a Camsurf alternative without ads or a premium tier? Vidibro offers unlimited, ad-free video, voice and text chat, completely free."
      comparisonFeatures={[
        { feature: "Completely Free, No Premium Tier", vidibro: true, competitor: "Free tier + Premium" },
        { feature: "Zero Registration Required", vidibro: true, competitor: true },
        { feature: "Ad-Free Experience", vidibro: true, competitor: "Ads unless Premium" },
        { feature: "No Daily Feature Limits", vidibro: true, competitor: "Limited on free tier" },
        { feature: "Voice-Only & Text Modes", vidibro: true, competitor: false },
        { feature: "P2P WebRTC Direct Stream", vidibro: true, competitor: false },
      ]}
      sections={[
        {
          heading: "Vidibro vs Camsurf: No Paywall, Ever",
          content:
            "Camsurf's free plan works, but it's built to nudge you toward Camsurf Premium — filters like gender and country matching are capped on a daily basis, and ads run unless you upgrade. It's a fairly standard freemium structure for this category, and it means the 'free' experience quietly changes depending on how much you use it in a day.\n\nVidibro doesn't have a premium tier to nudge you toward. There's exactly one version of the product, it's free, and nothing about your experience changes based on how many calls you've already made that day.",
        },
        {
          heading: "Simple by Design, Not by Accident",
          content:
            "Camsurf leans on filters — country, language, gender — as its main differentiator, gating the more useful ones behind payment. Vidibro takes a different approach on purpose: the queue is one shared pool with no filtering at all, because a filtered match starts to feel like a curated profile browse rather than a genuinely random conversation.\n\nThat's a real design trade-off, not a missing feature — if you want a fully unrestricted, unfiltered random chat with no ads and no paywall standing between you and the next feature, that's what Vidibro is built to be.",
        },
      ]}
    />
    </>
  );
}