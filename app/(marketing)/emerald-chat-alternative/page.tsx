import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Best Emerald Chat Alternative 2026 (Free)",
  description:
    "Looking for a clean Emerald Chat alternative? Vidibro offers instant 1-on-1 video, audio and text matching with zero ads and zero registration.",
  slug: "/emerald-chat-alternative",
});

export default function EmeraldChatAlternativePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Emerald Chat Alternative", item: `${BASE_URL}/emerald-chat-alternative` },
          ],
        }}
      />
      <AlternativePageTemplate
      competitorName="Emerald Chat"
      pageTitle="Best Free Emerald Chat Alternative in 2026"
      subtitle="Connect with real people around the globe in video, voice, and text modes with zero signup, anti-bot protection, and fast WebRTC matching."
      metaDescription="Looking for a clean Emerald Chat alternative? Vidibro provides instant 1-on-1 video, audio, and text matching with zero ads and zero registration."
      comparisonFeatures={[
        { feature: "Zero Signup or Account Needed", vidibro: true, competitor: false },
        { feature: "P2P WebRTC Direct Connection", vidibro: true, competitor: false },
        { feature: "Voice & Text Chat Options", vidibro: true, competitor: true },
        { feature: "WhatsApp-Style Read Receipts", vidibro: true, competitor: false },
        { feature: "24/7 Red Flag Reporting", vidibro: true, competitor: true },
      ]}
      sections={[
        {
          heading: "A Modern, Ad-Free Alternative to Emerald Chat",
          content:
            "Vidibro offers a streamlined, modern chat experience with clean glassmorphic aesthetics, zero mandatory registrations, and instant 1-click matching across Video, Voice, and Text modes.",
        },
      ]}
    />
    </>
  );
}