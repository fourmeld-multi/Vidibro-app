import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Background from "@/components/Background";
import PathTracker from "@/components/PathTracker";
import JsonLd from "@/components/JsonLd";
import { BASE_URL } from "@/lib/seo";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayoutShell({
  children,
  lang = "en",
}: {
  children: ReactNode;
  lang?: string;
}) {
  return (
    <html
      lang={lang}
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
              alternateName: ["Vidibro App", "Vidibro Chat", "Vidibro.com"],
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
        <Script id="theme-init" strategy="beforeInteractive">
          {`document.documentElement.setAttribute('data-theme','dark');`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BSGKV3MTVF"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BSGKV3MTVF');`}
        </Script>
        <PathTracker />
        <Background />
        {children}
      </body>
    </html>
  );
}
