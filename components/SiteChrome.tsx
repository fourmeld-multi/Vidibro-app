"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { LanguageCode } from "@/lib/translations";

/**
 * Navbar + Footer wrapper for content pages.
 *
 * Both components take navigation callbacks, so they cannot be dropped into a
 * server layout directly — this holds the small amount of client state they
 * need. Existing pages import them individually, which is exactly how the
 * directory pages ended up shipping with no navigation at all: a visitor
 * arriving from search had no way to reach anything else on the site, and the
 * pages contributed nothing to internal linking. Using this in a layout means
 * the next 200 directory pages cannot repeat that.
 *
 * Chat pages deliberately do not use it — they are full-screen call UIs where a
 * navbar would be in the way.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [lang, setLang] = useState<LanguageCode>("EN");

  return (
    <>
      <Navbar
        currentLang={lang}
        onSelectLang={setLang}
        onStartTextChat={() => router.push("/text-chat")}
        onStartVideoChat={() => router.push("/video-chat")}
      />
      {children}
      <Footer
        lang={lang}
        onStartVideoChat={() => router.push("/video-chat")}
        onStartTextChat={() => router.push("/text-chat")}
        onStartAudioChat={() => router.push("/audio-chat")}
      />
    </>
  );
}
