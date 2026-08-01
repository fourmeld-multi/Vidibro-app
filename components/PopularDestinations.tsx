import Link from "next/link";
import { ArrowRight, Video, Mic, MessageSquare } from "lucide-react";

/**
 * The link rows near the foot of the landing page, ending in a call to action.
 *
 * Every href here points at a page that exists — the competitor block this is
 * modelled on lists "Cam to Cam Chat" three times across its two rows, which
 * wastes the slot and reads as unmaintained.
 */

/**
 * A curated eight, not every entry.
 *
 * This mapped over the whole directory, so it grew to eighteen chips in ragged
 * centred rows as entries were added — and it would have reached two hundred.
 * A landing-page section is a shortlist pointing at the directory, not a second
 * copy of it. The three modes plus the largest markets, and everything else is
 * one click away behind "Explore Full Directory".
 */
const MAIN = [
  { href: "/directory/random-video-chat", label: "Random Video Chat" },
  { href: "/directory/random-voice-chat", label: "Random Voice Chat" },
  { href: "/directory/anonymous-text-chat", label: "Anonymous Text Chat" },
  { href: "/directory/video-chat-india", label: "Video Chat India" },
  { href: "/directory/video-chat-bangladesh", label: "Video Chat Bangladesh" },
  { href: "/directory/video-chat-pakistan", label: "Video Chat Pakistan" },
  { href: "/directory/video-chat-philippines", label: "Video Chat Philippines" },
  { href: "/directory/bengali-video-chat", label: "Bengali Video Chat" },
];

const ALSO = [
  { href: "/omegle-alternative", label: "Omegle Alternative" },
  { href: "/chatroulette-alternative", label: "Chatroulette Alternative" },
  { href: "/ometv-alternative", label: "OmeTV Alternative" },
  { href: "/emerald-chat-alternative", label: "Emerald Chat Alternative" },
];

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-center text-sm font-medium text-purple-100/85 transition hover:border-purple-400/30 hover:bg-white/[0.08] hover:text-white"
    >
      {label}
    </Link>
  );
}

export default function PopularDestinations() {
  return (
    <section className="w-full py-14 sm:py-20">
      <h2 className="text-center text-2xl sm:text-3xl font-black text-white tracking-tight mb-8">
        Popular Chat Destinations
      </h2>

      {/* An even grid rather than a centred wrap: wrapping left the last row
          short and off-centre, which is what made the block look unfinished. */}
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2.5 px-4 sm:grid-cols-3 lg:grid-cols-4">
        {MAIN.map((d) => (
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

      <div className="mx-auto mt-12 max-w-4xl border-t border-white/[0.07] px-4 pt-10">
        <div className="mb-4 text-center text-sm text-purple-300/55">Also explore</div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {ALSO.map((d) => (
            <Chip key={d.href} {...d} />
          ))}
        </div>
      </div>

      {/* A list of links is a dead end without somewhere to actually go. */}
      <div className="mx-auto mt-14 max-w-2xl px-4 text-center">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Stop reading. Start talking.
        </h3>
        <p className="mx-auto mt-2.5 max-w-md text-sm text-purple-200/70">
          One tap and you are matched with someone new. No signup, no history.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/video-chat"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3.5 text-base font-extrabold text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110 sm:w-auto"
          >
            <Video size={18} /> Video chat
          </Link>
          <Link
            href="/audio-chat"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-3.5 text-base font-extrabold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110 sm:w-auto"
          >
            <Mic size={18} /> Voice chat
          </Link>
          <Link
            href="/text-chat"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-3.5 text-base font-extrabold text-white shadow-lg shadow-pink-500/25 transition hover:brightness-110 sm:w-auto"
          >
            <MessageSquare size={18} /> Text chat
          </Link>
        </div>
      </div>
    </section>
  );
}
