import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ENTRIES, hrefFor } from "@/lib/directory/entries";

/**
 * The two link rows on the landing page: "Popular Chat Destinations" and a
 * secondary "Also explore" row.
 *
 * Two deliberate differences from the competitor version this is modelled on:
 *
 * 1. Every chip is generated from directory data that actually exists, so a
 *    half-built directory can never put a 404 on the homepage. Hardcoding the
 *    labels is how you end up shipping dead links.
 * 2. The list is deduplicated. The page this is modelled on shows "Cam to Cam
 *    Chat" three times across the two rows, which wastes the slot and looks
 *    unmaintained.
 */

/** Routes that exist outside the directory and are safe to link. */
const EXTRA = [
  { href: "/omegle-alternative", label: "Omegle Alternative" },
  { href: "/chatroulette-alternative", label: "Chat Roulette" },
  { href: "/ometv-alternative", label: "OmeTV Alternative" },
  { href: "/emerald-chat-alternative", label: "Emerald Chat Alternative" },
  { href: "/airtalk-alternative", label: "AirTalk Alternative" },
  { href: "/text-chat", label: "Talk to Strangers" },
  { href: "/audio-chat", label: "Anonymous Voice Call" },
  { href: "/video-chat", label: "Video Chat No Login" },
];

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs sm:text-sm font-medium text-purple-100/85 transition hover:border-purple-400/30 hover:bg-white/[0.08] hover:text-white"
    >
      {label}
    </Link>
  );
}

export default function PopularDestinations() {
  const destinations = ENTRIES.map((e) => ({ href: hrefFor(e.slug), label: e.title.split("—")[0].trim() }));

  // Dedupe by href across both rows, so nothing appears twice.
  const seen = new Set(destinations.map((d) => d.href));
  const alsoExplore = EXTRA.filter((e) => !seen.has(e.href));

  return (
    <section className="w-full py-14 sm:py-20">
      <h2 className="text-center text-2xl sm:text-3xl font-black text-white tracking-tight mb-8">
        Popular Chat Destinations
      </h2>

      <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5 px-4">
        {destinations.map((d) => (
          <Chip key={d.href} {...d} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 border-b border-pink-400/50 pb-0.5 text-sm font-extrabold text-pink-400 transition hover:border-pink-300 hover:text-pink-300"
        >
          Explore Full Directory <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2.5 border-t border-white/[0.07] px-4 pt-10">
        <span className="mr-1 text-xs text-purple-300/55">Also explore:</span>
        {alsoExplore.map((d) => (
          <Chip key={d.href} {...d} />
        ))}
      </div>
    </section>
  );
}
