import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Background from "@/components/Background";
import PathTracker from "@/components/PathTracker";
import GA4Tracker from "@/components/GA4Tracker";
import JsonLd from "@/components/JsonLd";
import { BASE_URL } from "@/lib/seo";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

export default function RootLayoutShell({
  children,
  lang = "en",
  dir,
}: {
  children: ReactNode;
  lang?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <html
      lang={lang}
      dir={dir}
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
              logo: `${BASE_URL}/icon.png`,
              description:
                "Anonymous, zero-login video, voice and text chat with strangers.",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${BASE_URL}/#website`,
              name: "Vidibro",
              alternateName: ["Vidibro App", "Vidibro Chat"],
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
        {/* Queue gtag + config before any useEffect fires so session source is set first */}
        <Script id="ga-queue" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){dataLayer.push(arguments);};
if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
  gtag('js', new Date());
  gtag('config', 'G-BSGKV3MTVF', { send_page_view: false });
}`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BSGKV3MTVF"
          strategy="afterInteractive"
        />
        <PathTracker />
        <GA4Tracker />
        <Background />
        {children}
      </body>
    </html>
  );
}
