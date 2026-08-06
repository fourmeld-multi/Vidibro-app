import { Metadata } from "next";
import AlternativePageTemplate from "@/components/AlternativePageTemplate";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = generatePageSEO({
  title: "Best StrangerLine Alternative 2026 (No Signup)",
  description:
    "Looking for a StrangerLine alternative that never stores your chats or profile? Vidibro offers free video, voice and text chat with strangers, nothing saved.",
  slug: "/strangerline-alternative",
});

export default function StrangerlineAlternativePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "StrangerLine Alternative", item: `${BASE_URL}/strangerline-alternative` },
          ],
        }}
      />
      <AlternativePageTemplate
      competitorName="StrangerLine"
      pageTitle="The Best Free StrangerLine Alternative in 2026"
      subtitle="StrangerLine's pitch is doing more than Omegle ever did — saved chats, friend requests, messages that wait for you after a disconnect. Vidibro takes the opposite bet: nothing is kept, nothing is tied to you, and that's the whole feature."
      metaDescription="Looking for a StrangerLine alternative that never stores your chats or profile? Vidibro offers free video, voice and text chat with strangers, nothing saved."
      comparisonFeatures={[
        { feature: "Video, Voice & Text — All Three Modes", vidibro: true, competitor: true },
        { feature: "Zero Registration Required", vidibro: true, competitor: true },
        { feature: "P2P WebRTC Direct Stream", vidibro: true, competitor: false },
        { feature: "No Chat History Stored, Ever", vidibro: true, competitor: "Saves chats" },
        { feature: "No Friend Requests or Persistent Profile", vidibro: true, competitor: false },
        { feature: "Nothing to Reconnect To After You Leave", vidibro: true, competitor: "Message after disconnect" },
      ]}
      sections={[
        {
          heading: "Vidibro vs StrangerLine: Two Different Ideas of 'Better'",
          content:
            "StrangerLine built its case around everything Omegle didn't have — voice notes, saved conversations, friend requests, a message waiting for you after the other person leaves. Those are real features, and for someone who wants random chat to turn into an ongoing thread, they're a genuine draw.\n\nVidibro is built for the opposite use case. There's no chat history sitting on a server anywhere, no profile that persists between sessions, and no friend list linking one conversation to the next. When you close the tab, the conversation is over — not archived, not waiting for a reply, just gone. If what you want out of random chat is the conversation itself and nothing that outlives it, that's the entire design.",
        },
        {
          heading: "Why 'Nothing Saved' Is a Feature, Not a Gap",
          content:
            "Saving chats and enabling friend requests means StrangerLine has to store who talked to whom, and keep that data somewhere. That's not a criticism — it's just a different tradeoff than Vidibro makes. Every call on Vidibro runs peer-to-peer over WebRTC, so video and audio go directly between the two people in the call rather than through a server in the middle, and once it ends there's no log of it to come back to.\n\nNo account means there's also nothing to build a friend list or history around in the first place. That's a deliberate limit, not a missing feature — Vidibro is for the conversation happening right now, with a stranger who stays a stranger once the call ends.",
        },
      ]}
    />
    </>
  );
}