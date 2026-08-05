"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Menu, X, Globe, Video, Zap, ShieldAlert } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import ReportUsModal from "@/components/ReportUsModal";
import { useRouter } from "next/navigation";
import { LANGUAGES, TRANSLATIONS, type LanguageCode } from "@/lib/translations";

type Props = {
  currentLang?: LanguageCode;
  onSelectLang?: (lang: LanguageCode) => void;
  onStartTextChat?: () => void;
  onStartVideoChat?: () => void;
};

export default function Navbar({
  currentLang = "EN",
  onSelectLang,
  onStartTextChat,
  onStartVideoChat,
}: Props) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  const handleStartVideo = onStartVideoChat || (() => router.push("/video-chat"));

  const selectedItem = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.EN;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <header className="relative sticky top-0 z-50 bg-[#090518]/95 shadow-md">
      {/* Glowing gradient bottom border to separate the bar from the page,
          instead of a flat 10%-opacity border that barely reads on black.
          Hidden while the mobile drawer is open: the line then falls between
          the bar and the drawer, cutting a stray glowing streak across a panel
          that is already visually attached to the header. Single copy, no
          blur filter — a `filter` on a child of a `position: sticky` element
          is a known Android Chrome compositing bug (the sticky layer can
          drop a paint frame during fast scroll, i.e. the whole bar
          vanishing), so the softer blurred duplicate was removed rather
          than risk it. */}
      {!mobileMenuOpen && (
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-purple-500/25 group-hover:scale-105 transition">
            <LogoMark size={36} className="h-full w-full object-cover" priority />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tight text-white font-mono">
            Vidibro
          </span>
        </Link>

        {/* Desktop Links Matching Reference Image */}
        <div className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-semibold text-purple-200/90">
          <Link href="/text-chat" className="flex items-center gap-1.5 text-white font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition shadow-sm">
            <MessageSquare size={14} className="text-purple-300" />
            <span>{t.navTalkToStrangers}</span>
          </Link>
          <Link href="/contact" className="hover:text-white transition">{t.navContact}</Link>
          <Link href="/guidelines" className="hover:text-white transition">{t.navGuidelines}</Link>
          <Link href="/faq" className="hover:text-white transition">{t.navFAQ}</Link>
          <Link href="/terms" className="hover:text-white transition">{t.navTerms}</Link>
          <Link href="/privacy" className="hover:text-white transition">{t.navPrivacy}</Link>
          <button
            onClick={() => setReportOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-red-600/30 transition"
          >
            <ShieldAlert size={13} />
            {t.navReportUs}
          </button>

          {/* Language Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-1 text-xs font-semibold text-purple-100 transition"
            >
              <span>{selectedItem.code}</span>
              <span className="text-[9px] text-purple-300">▼</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#120a2e] border border-white/20 p-1.5 shadow-2xl z-50 text-xs max-h-64 overflow-y-auto"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLang?.(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left ${
                        lang.code === currentLang
                          ? "bg-purple-600/50 text-white font-bold"
                          : "text-purple-200/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] text-purple-300">{lang.code}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleStartVideo}
            className="btn-gradient flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/25 hover:scale-105 transition uppercase tracking-wider"
          >
            <span>{t.navStartVideoChat}</span>
            <Zap size={14} />
          </button>
        </div>

        {/* Mobile Hamburger Menu Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 border border-white/15 text-white transition hover:bg-white/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay.
          No animation on purpose. Fading it in meant that for the length of the
          transition the panel was partly transparent, so the hero text behind it
          showed straight through the menu links — two layers visible at once,
          which read as a blink every time it opened or closed. A nav menu isn't
          communicating anything with that motion anyway, so it just appears. */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50 bg-[#0e0828] border-b border-purple-500/20 px-6 py-8 flex flex-col items-center text-center space-y-4 shadow-2xl rounded-b-3xl">

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              {t.navContact}
            </Link>

            <Link
              href="/guidelines"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              {t.navGuidelines}
            </Link>

            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              {t.navFAQ}
            </Link>

            <Link
              href="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              {t.navTerms}
            </Link>

            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              {t.navPrivacy}
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setReportOpen(true);
              }}
              className="flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-red-600/30 transition"
            >
              <ShieldAlert size={16} />
              {t.navReportUs}
            </button>
        </div>
      )}
    </header>

    {/* Rendered outside <header> — an ancestor with backdrop-filter (the
        header's blur) creates a new containing block for position:fixed
        descendants in Chromium, which broke this modal's centering. */}
    <ReportUsModal isOpen={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
