import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO } from "@/lib/seo";

export const metadata: Metadata = generatePageSEO({
  title: "Best CooMeet Alternative 2026, Totally Free",
  description:
    "Looking for a free CooMeet alternative? Vidibro offers unlimited video, voice and text chat with strangers — no per-minute billing, no account.",
  slug: "/coomeet-alternative",
});

export default function CoomeetAlternativePage() {
  return (
    <AlternativePageTemplate
      competitorName="CooMeet"
      pageTitle="The Best Free CooMeet Alternative in 2026"
      subtitle="CooMeet pairs men with camera-verified women through a paid, per-minute or subscription model — you sign up and pay before you can talk. Vidibro is the opposite by design: anonymous, unrestricted matching that's free from the first second to the last."
      metaDescription="Looking for a free CooMeet alternative with no per-minute billing? Vidibro offers unlimited video, voice and text chat with strangers, completely free."
      comparisonFeatures={[
        { feature: "Completely Free, No Billing", vidibro: true, competitor: "Pay per minute" },
        { feature: "Zero Registration Required", vidibro: true, competitor: false },
        { feature: "No Identity Verification Needed", vidibro: true, competitor: false },
        { feature: "Open, Unrestricted Matching", vidibro: true, competitor: false },
        { feature: "Voice-Only & Text Modes", vidibro: true, competitor: false },
        { feature: "P2P WebRTC Direct Stream", vidibro: true, competitor: false },
      ]}
      sections={[
        {
          heading: "Vidibro vs CooMeet: Free vs Pay-Per-Minute",
          content:
            "CooMeet's business model is built around billing — you create an account, and time in a call is charged either per minute or through a subscription package. It's a genuinely different product category from a free random chat platform, closer to a paid matchmaking service than an anonymous chat site.\n\nVidibro has no billing at all. There's no account to fund, no per-minute clock running in the background, and no subscription tier unlocking anything extra. Every mode — video, voice, text — works exactly the same for every visitor, for free, every time.",
        },
        {
          heading: "Anonymous and Open, Not Verified and Curated",
          content:
            "CooMeet's core pitch is camera-verified matching, built specifically around pairing men with verified women — a curated, filtered experience rather than an open pool of strangers. That's a legitimate product for what it's trying to do, but it's a fundamentally different thing from spontaneous random chat.\n\nVidibro's queue is one shared, anonymous pool — no verification step, no filter, no profile to build. You show up, you're matched, and the conversation is exactly as real or as brief as you make it, with nothing to sign up for and nothing to pay.",
        },
      ]}
    />
  );
}
