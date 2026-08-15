import type { Metadata, Viewport } from "next";
import RootLayoutShell from "@/components/RootLayoutShell";

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vidibro.com"),
  title: {
    default: "Vidibro — Talk to a Random Stranger, Instantly",
    template: "%s | Vidibro",
  },
  description:
    "Anonymous, zero-login video chat. Get matched instantly, play quick games, and connect — no account, no history, just a real conversation.",
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
    title: "Vidibro — Talk to a Random Stranger, Instantly",
    description:
      "Anonymous, zero-login video chat. Get matched instantly — no account, no history, just a real conversation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidibro — Talk to a Random Stranger, Instantly",
    description:
      "Anonymous, zero-login video chat. Get matched instantly — no account, no history, just a real conversation.",
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutShell lang="en">{children}</RootLayoutShell>;
}
