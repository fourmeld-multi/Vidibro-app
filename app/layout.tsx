import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Background from "@/components/Background";
import { BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Site-wide defaults. Individual pages override title/description/canonical via
 * generatePageSEO(); everything here is what they inherit.
 *
 * metadataBase matters more than it looks: without it, Next cannot resolve
 * relative OG image URLs, so shares silently render with no image.
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Vidibro — Talk to a Random Stranger, Instantly",
    // Pages that set a plain string title get the brand appended automatically,
    // so no page can ship an untitled or brandless tab.
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
    url: BASE_URL,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Site-wide entity graph. Organization and WebSite establish Vidibro as
            a known entity; WebApplication is what makes a browser-based tool
            eligible for richer treatment than a plain page. Emitted on every
            route so no page is missing the brand context. */}
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${BASE_URL}/#organization`,
              name: "Vidibro",
              url: BASE_URL,
              logo: `${BASE_URL}/logo.svg`,
              description:
                "Anonymous, zero-login video, voice and text chat with strangers.",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${BASE_URL}/#website`,
              name: "Vidibro",
              url: BASE_URL,
              publisher: { "@id": `${BASE_URL}/#organization` },
              inLanguage: "en",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Vidibro",
              url: BASE_URL,
              applicationCategory: "SocialNetworkingApplication",
              operatingSystem: "Any browser with WebRTC support",
              browserRequirements: "Requires WebRTC and HTML5 support",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              publisher: { "@id": `${BASE_URL}/#organization` },
            },
          ]}
        />
        {/* The design is dark-only: the landing page alone carries 144 hardcoded
            dark colour classes and zero theme-variable usages, and ThemeToggle
            was never mounted anywhere. This script used to honour
            prefers-color-scheme, which meant every visitor whose OS is set to
            light got a light page background behind text styled for a dark one
            — white-on-white in places. Until the palette is genuinely
            themeable, dark is the only honest answer. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`document.documentElement.setAttribute('data-theme','dark');`}
        </Script>
        <Background />
        {children}
      </body>
    </html>
  );
}
