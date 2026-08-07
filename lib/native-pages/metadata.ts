import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";
import type { NativeLangData } from "./types";

export function nativePageMetadata(data: NativeLangData): Metadata {
  const url = `${BASE_URL}${data.canonicalSlug}`;
  const hreflangCode = data.hreflang ?? data.lang;
  return {
    title: data.title,
    description: data.description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        [hreflangCode]: url,
        "x-default": BASE_URL,
      },
    },
    openGraph: {
      locale: data.ogLocale,
      title: data.title,
      description: data.description,
      url,
      siteName: "Vidibro",
      type: "website",
      images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Vidibro" }],
    },
  };
}
