import type { Metadata } from "next";
import { BASE_URL } from "@/lib/seo";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "Vidibro — Free Random Video Chat with Strangers, No Signup",
  description:
    "Free random video chat with strangers — no account, no coins, instant match. Anonymous 1-on-1 video, voice & text chat from 180+ countries. The best Omegle alternative in 2026.",
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
      "es": `${BASE_URL}/es`,
      "ml": `${BASE_URL}/ml`,
      "ar": `${BASE_URL}/ar`,
      "x-default": BASE_URL,
    },
  },
};

export default function HomePage() {
  return <HomeContent />;
}
