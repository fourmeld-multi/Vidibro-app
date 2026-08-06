import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Best Chatroulette Alternative 2026 (Free)",
  description:
    "Looking for a modern Chatroulette alternative? Vidibro pairs you instantly with strangers for 1-on-1 video, voice and text. No coins, no signup.",
  slug: "/chatroulette-alternative",
});

export default function ChatrouletteAlternativePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Chatroulette Alternative", item: `${BASE_URL}/chatroulette-alternative` },
          ],
        }}
      />
      <AlternativePageTemplate
      competitorName="Chatroulette"
      pageTitle="Best Chatroulette Alternative in 2026"
      subtitle="Tired of coin systems, account logins, or long waiting queues? Vidibro pairs you in under a second for instant 1-on-1 video and voice chat with zero fees."
      metaDescription="Looking for a modern Chatroulette alternative? Vidibro pairs you instantly with strangers for 1-on-1 video call, voice, and text."
      comparisonFeatures={[
        { feature: "100% Free - Zero Coin System", vidibro: true, competitor: false },
        { feature: "No Registration or Phone Number", vidibro: true, competitor: false },
        { feature: "P2P WebRTC Direct Audio & Video", vidibro: true, competitor: false },
        { feature: "Faceless Audio & Text Modes", vidibro: true, competitor: false },
        { feature: "Seamless Mobile Camera Flipping", vidibro: true, competitor: "Limited" },
        { feature: "24/7 Red Flag Reporting", vidibro: true, competitor: true },
      ]}
      sections={[
        {
          heading: "A Faster, Completely Free Alternative to Chatroulette",
          content:
            "While Chatroulette pioneered web-cam roulette, recent changes introduced coin balances, paywalls, and mandatory login steps that slow down spontaneous matching.\n\nVidibro keeps random chatting 100% free forever. Simply open the app, tap 'Start Video Match', and meet someone new in real time.",
        },
      ]}
    />
    </>
  );
}