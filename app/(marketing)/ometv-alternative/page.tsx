import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO } from "@/lib/seo";

export const metadata: Metadata = generatePageSEO({
  title: "Best Free OmeTV Alternative 2026 (No App)",
  description:
    "Searching for an OmeTV alternative? Vidibro lets you video, voice or text chat with strangers in your browser — no app download, no signup.",
  slug: "/ometv-alternative",
});

export default function OmeTVAlternativePage() {
  return (
    <AlternativePageTemplate
      competitorName="OmeTV"
      pageTitle="Best Free OmeTV Alternative in 2026"
      subtitle="Experience fast 1-on-1 video chat directly in your mobile browser. No app store downloads, no social logins, just instant encrypted matching."
      metaDescription="Searching for an OmeTV alternative? Vidibro lets you chat with strangers in 1-on-1 video, audio, and text modes directly in your web browser."
      comparisonFeatures={[
        { feature: "No App Download Required", vidibro: true, competitor: false },
        { feature: "Zero Social Login Required", vidibro: true, competitor: false },
        { feature: "P2P WebRTC Encryption", vidibro: true, competitor: false },
        { feature: "Voice & Text Mode Options", vidibro: true, competitor: false },
        { feature: "24/7 Red Flag Reporting", vidibro: true, competitor: true },
      ]}
      sections={[
        {
          heading: "Why Switch from OmeTV to Vidibro?",
          content:
            "OmeTV requires downloading mobile apps or logging in via VK or Facebook. Vidibro works 100% in your mobile or desktop browser without requiring any account or personal data.",
        },
      ]}
    />
  );
}
