import type { Metadata } from "next";
import RootLayoutShell from "@/components/RootLayoutShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://vidibro.com"),
  title: {
    default: "Vidibro — Free Random Video Chat. No Signup. Talk to Strangers.",
    template: "%s | Vidibro",
  },
  description:
    "Free random video chat with strangers — no signup, no account. Anonymous 1-on-1 video, voice and text chat. Instant match, works on any browser, 180+ countries.",
  applicationName: "Vidibro",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Vidibro",
    locale: "en_US",
    url: "https://vidibro.com",
    title: "Vidibro — Free Random Video Chat. No Signup. Talk to Strangers.",
    description:
      "Anonymous, zero-login video chat. Get matched instantly — no account, no history, just a real conversation.",
    images: [
      {
        url: "https://vidibro.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Vidibro — Free Random Video Chat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidibro — Free Random Video Chat. No Signup. Talk to Strangers.",
    description:
      "Anonymous, zero-login video chat. Get matched instantly — no account, no history, just a real conversation.",
    images: ["https://vidibro.com/logo.png"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutShell lang="en">{children}</RootLayoutShell>;
}
