import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  alternates: {
    canonical: BASE_URL,
    languages: {
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
      "x-default": BASE_URL,
    },
  },
};

export default function HomePage() {
  return <HomeContent />;
}
