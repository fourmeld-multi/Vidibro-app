"use client";

import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import { ShieldCheck, Heart, Lock, Zap } from "lucide-react";
import { TRANSLATIONS, type LanguageCode } from "@/lib/translations";

type Props = {
  onStartVideoChat?: () => void;
  onStartTextChat?: () => void;
  onStartAudioChat?: () => void;
  lang?: LanguageCode;
};

export default function Footer({ onStartVideoChat, onStartTextChat, onStartAudioChat, lang = "EN" }: Props) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  return (
    <footer className="w-full bg-[#05030f] border-t border-purple-500/15 text-purple-200/80 pt-12 pb-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Brand Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-purple-500/25">
              <LogoMark size={40} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-extrabold text-white font-mono tracking-tight">Vidibro</span>
              <span className="text-xs text-purple-300">{t.footerTagline}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-purple-200">
            <span className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> {t.footerNoLogin}
            </span>
            <span className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Lock size={14} className="text-cyan-400" /> {t.footerEncrypted}
            </span>
            <span className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Zap size={14} className="text-yellow-400" /> {t.footerInstant}
            </span>
          </div>
        </div>

        {/* Multi-Column Directory Grid (With Working Redirects!) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-10 border-b border-white/10 text-xs">

          {/* Column 1: Video Chat */}
          <div className="flex flex-col gap-2.5 text-left">
            <h2 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-pink-400">
              {t.footerVideoHeading}
            </h2>
            <button onClick={onStartVideoChat} className="text-left hover:text-white transition">HD Random Video Call</button>
            <button onClick={onStartVideoChat} className="text-left hover:text-white transition">Girls Video Chat</button>
            <button onClick={onStartVideoChat} className="text-left hover:text-white transition">Global Video Match</button>
            <button onClick={onStartVideoChat} className="text-left hover:text-white transition">Stranger Cam Chat</button>
            <button onClick={onStartVideoChat} className="text-left hover:text-white transition">1-on-1 Video Call</button>
            <button onClick={onStartVideoChat} className="text-left hover:text-white transition">No Signup Video Chat</button>
          </div>

          {/* Column 2: Text Chat */}
          <div className="flex flex-col gap-2.5 text-left">
            <h2 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-cyan-400">
              {t.footerTextHeading}
            </h2>
            <button onClick={onStartTextChat} className="text-left hover:text-white transition">Anonymous Text Chat</button>
            <button onClick={onStartTextChat} className="text-left hover:text-white transition">Random Stranger Text</button>
            <button onClick={onStartTextChat} className="text-left hover:text-white transition">3D Sticker Chat</button>
            <button onClick={onStartTextChat} className="text-left hover:text-white transition">Photo Sharing Chat</button>
            <button onClick={onStartTextChat} className="text-left hover:text-white transition">Instant Text Room</button>
          </div>

          {/* Column 3: Voice Chat */}
          <div className="flex flex-col gap-2.5 text-left">
            <h2 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-purple-400">
              {t.footerVoiceHeading}
            </h2>
            <button onClick={onStartAudioChat} className="text-left hover:text-white transition">Random Audio Call</button>
            <button onClick={onStartAudioChat} className="text-left hover:text-white transition">Voice Match Room</button>
            <button onClick={onStartAudioChat} className="text-left hover:text-white transition">Clear HD P2P Voice</button>
            <button onClick={onStartAudioChat} className="text-left hover:text-white transition">Soundboard FX Chat</button>
            <button onClick={onStartAudioChat} className="text-left hover:text-white transition">No Camera Voice Call</button>
          </div>

          {/* Column 4: Resources & Safety */}
          <div className="flex flex-col gap-2.5 text-left">
            <h2 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-yellow-400">
              {t.footerResourcesHeading}
            </h2>
            <Link href="/guidelines" className="hover:text-white transition">{t.footerGuidelines}</Link>
            <Link href="/report" className="hover:text-white transition">{t.footerReportAbuse}</Link>
            <Link href="/faq" className="hover:text-white transition">{t.footerSafetyFaq}</Link>
            {/* Not run through the translation system like its neighbors —
                same gap /directory already has in this footer. Adding a plain
                English link now beats shipping the blog with zero site-wide
                nav entry point at all. */}
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
            <Link href="/directory" className="hover:text-white transition">Directory</Link>
          </div>

          {/* Column 5: Legal & About */}
          <div className="flex flex-col gap-2.5 text-left">
            <h2 className="font-extrabold text-white uppercase tracking-wider text-[11px] text-emerald-400">
              {t.footerLegalHeading}
            </h2>
            <Link href="/privacy" className="hover:text-white transition">{t.footerPrivacyPolicy}</Link>
            <Link href="/terms" className="hover:text-white transition">{t.footerTerms}</Link>
            <Link href="/contact" className="hover:text-white transition">{t.footerContact}</Link>
            <Link href="/report" className="hover:text-white transition">{t.footerReportIssue}</Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-purple-300/60">
          <p>© {new Date().getFullYear()} {t.footerCopyright}</p>
          <p className="flex items-center gap-1.5">
            <Heart size={12} className="text-pink-500 fill-pink-500 shrink-0" />
            {t.footerBuiltWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
