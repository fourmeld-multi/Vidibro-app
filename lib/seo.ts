import type { Metadata } from "next";

export const BASE_URL = "https://vidibro.com";

type SEOProps = {
  title: string;
  description: string;
  slug: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
  /** For application screens that should not compete with a content page. */
  noindex?: boolean;
};

export function generatePageSEO({
  title,
  description,
  slug,
  image = `${BASE_URL}/og-default.png`,
  type = "website",
  publishedTime,
  noindex = false,
  keywords = [
    "free random video chat",
    "talk to strangers online",
    "omegle alternative 2026",
    "anonymous voice chat",
    "free cam chat no signup",
    "1-on-1 video call strangers",
  ],
}: SEOProps): Metadata {
  const canonicalUrl = `${BASE_URL}${slug === "/" ? "" : slug}`;

  return {
    // No brand suffix here. app/layout.tsx defines title.template as
    // "%s | Vidibro", which appends it — doing it in both places produced
    // "Page | Vidibro | Vidibro" on every page that used this helper.
    title,
    description,
    keywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noindex,
      follow: true,
      googleBot: {
        index: !noindex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${title} | Vidibro`,
      description,
      url: canonicalUrl,
      siteName: "Vidibro",
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
      locale: "en_US",
      type: type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Vidibro`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function generateJsonLdSchema({
  type,
  title,
  description,
  url,
  faqs,
}: {
  type: "WebApplication" | "FAQPage" | "Organization";
  title: string;
  description: string;
  url: string;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  if (type === "WebApplication") {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Vidibro",
      url: BASE_URL,
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "All",
      browserRequirements: "Requires WebRTC and HTML5 support",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description,
    };
  }

  if (type === "FAQPage" && faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vidibro",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    description,
  };
}
