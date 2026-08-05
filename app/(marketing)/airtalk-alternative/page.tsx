import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO } from "@/lib/seo";

export const metadata: Metadata = generatePageSEO({
  title: "Best Free AirTALK Alternative 2026 (No Signup)",
  description:
    "Looking for a free AirTALK alternative? Vidibro offers instant anonymous voice calls, HD video match and text chat with zero signup, on any browser.",
  slug: "/airtalk-alternative",
});

export default function AirTalkAlternativePage() {
  return (
    <AlternativePageTemplate
      competitorName="AirTALK"
      pageTitle="Best Free AirTALK Alternative in 2026"
      subtitle="Prefer faceless voice chat or video matching without account barriers? Vidibro gives you instant 1-on-1 audio calls and video matches with real people around the globe — 100% free and private."
      metaDescription="Looking for a free AirTALK alternative? Vidibro offers instant anonymous voice calls, HD 1-on-1 video match, and text chat with zero signup."
      comparisonFeatures={[
        { feature: "Zero Account Registration", vidibro: true, competitor: true },
        { feature: "Faceless Voice Chat Mode", vidibro: true, competitor: true },
        { feature: "1-on-1 HD Video Chat", vidibro: true, competitor: "Limited" },
        { feature: "Instant P2P WebRTC Encryption", vidibro: true, competitor: false },
        { feature: "Interactive Soundboard & Reactions", vidibro: true, competitor: false },
        { feature: "WhatsApp-Style Read Receipts", vidibro: true, competitor: false },
        { feature: "24/7 Red Flag User Reporting", vidibro: true, competitor: true },
      ]}
      sections={[
        {
          heading: "Why Users Choose Vidibro Over AirTALK",
          content:
            "AirTALK introduced popular voice-only chatting for introverts, but many users look for additional features like seamless video matching, instant text message read receipts, and soundboard reactions.\n\nVidibro expands on the anonymous voice concept by providing three distinct chat modes (Video, Voice, and Text) powered by direct WebRTC connections that never route your private conversation through third-party media servers.",
        },
        {
          heading: "Designed for Introverts & Social Anxiety",
          content:
            "If you feel camera pressure, Vidibro's Voice Chat mode lets you talk freely without showing your face. Icebreaker prompt cards give you fun conversation starters so you never experience awkward silence.",
        },
      ]}
    />
  );
}
