"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Info, ArrowLeft, Video, Lock, Ban, MessageSquare } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-white transition mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl btn-gradient flex items-center justify-center shadow-lg">
            <Info size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">About Vidibro</h1>
            <p className="text-sm text-purple-200/80">What it is, and what it deliberately isn&apos;t.</p>
          </div>
        </div>

        <div className="space-y-6 text-purple-100/85 leading-relaxed">
          <p>
            Vidibro is a free, anonymous chat platform — video, voice-only, or text, your choice —
            that connects you with a random stranger the moment you open it. No account, no login,
            no profile to build. You show up, you get matched, and you talk.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <h2 className="text-lg font-black text-white">What we actually built</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                  <Video size={16} />
                </span>
                <p className="text-sm">
                  <strong className="text-white">Three separate modes.</strong> Video, voice-only,
                  and text aren&apos;t the same feature with parts turned off — each is built to
                  stand on its own.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                  <Lock size={16} />
                </span>
                <p className="text-sm">
                  <strong className="text-white">Peer-to-peer by default.</strong> Calls run over
                  WebRTC, directly between browsers — not routed through our own servers. See{" "}
                  <Link href="/blog/how-peer-to-peer-video-chat-works" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
                    how that actually works
                  </Link>.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <Ban size={16} />
                </span>
                <p className="text-sm">
                  <strong className="text-white">No account, ever.</strong> Nothing to sign up for,
                  nothing tied to your identity, nothing left behind when you close the tab.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
                  <MessageSquare size={16} />
                </span>
                <p className="text-sm">
                  <strong className="text-white">One shared queue, no filters.</strong> That&apos;s
                  a deliberate choice, not a missing feature — see why on the{" "}
                  <Link href="/directory" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
                    directory page
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-black text-white pt-2">Why it&apos;s built this way</h2>
          <p>
            Most of what makes a random chat platform trustworthy or not comes down to what it does
            with your video, audio, and identity — not its feature list. We chose peer-to-peer
            architecture because it means there&apos;s structurally nothing to store: your call
            never passes through a server that could retain it. We chose no accounts because a
            platform for anonymous conversation shouldn&apos;t need to know who you are. Neither of
            these is a marketing claim we&apos;re asking you to trust blindly — both are things you
            can verify, and we&apos;d rather you did.
          </p>

          <p>
            We&apos;re not going to pretend this is a mature company with a decade of history behind
            it, or invent a founding story with more drama than the truth: we built a chat platform
            because the space needed one that was honest about what it does and doesn&apos;t do. If
            you want the deeper technical or safety detail behind any of these decisions, that&apos;s
            what the{" "}
            <Link href="/blog" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
              blog
            </Link>{" "}
            and{" "}
            <Link href="/faq" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
              FAQ
            </Link>{" "}
            are for.
          </p>

          <h2 className="text-lg font-black text-white pt-2">Get in touch</h2>
          <p>
            Questions, feedback, or something to report? Reach us through the{" "}
            <Link href="/contact" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
              contact page
            </Link>{" "}
            — or if it&apos;s about another user&apos;s behavior specifically, use{" "}
            <Link href="/report" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">
              Report
            </Link>{" "}
            instead, which reaches us faster for that kind of issue.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
