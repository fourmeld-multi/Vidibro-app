import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NativeLangPage from "@/components/NativeLangPage";
import { BASE_URL } from "@/lib/seo";
import data from "@/lib/native-pages/tr";

export const metadata: Metadata = {
  title: data.title,
  description: data.description,
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: `${BASE_URL}${data.canonicalSlug}` },
  openGraph: {
    locale: data.ogLocale,
    title: data.title,
    description: data.description,
    url: `${BASE_URL}${data.canonicalSlug}`,
    siteName: "Vidibro",
    type: "website",
  },
};

export default function TrPage() {
  return (
    <>
      <Navbar />
      <NativeLangPage data={data} />
      <Footer />
    </>
  );
}
