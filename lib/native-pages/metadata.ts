import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";
import type { NativeLangData } from "./types";

// Full mesh: every page in the hreflang group must list all other members
const ALL_LANG_ALTERNATES: Record<string, string> = {
  "en": BASE_URL,
  "hi": `${BASE_URL}/hi`,
  "bn": `${BASE_URL}/bn`,
  "ta": `${BASE_URL}/ta`,
  "kn": `${BASE_URL}/kn`,
  "ja": `${BASE_URL}/ja`,
  "ko": `${BASE_URL}/ko`,
  "zh": `${BASE_URL}/zh`,
  "ru": `${BASE_URL}/ru`,
  "th": `${BASE_URL}/th`,
  "tr": `${BASE_URL}/tr`,
  "id": `${BASE_URL}/id`,
  "vi": `${BASE_URL}/vi`,
  "pt-BR": `${BASE_URL}/pt-br`,
  "es": `${BASE_URL}/es`,
  "x-default": BASE_URL,
};

export function nativePageMetadata(data: NativeLangData): Metadata {
  const url = `${BASE_URL}${data.canonicalSlug}`;
  return {
    title: data.title,
    description: data.description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: ALL_LANG_ALTERNATES,
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
