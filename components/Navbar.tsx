"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Video, MessageSquare, ShieldAlert } from "lucide-react";
import LogoMark from "@/components/LogoMark";
import { LANGUAGES, type LanguageCode } from "@/lib/translations";

type Props = {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  onStartTextChat?: () => void;
  onStartVideoChat?: () => void;
};

export default function Navbar({ currentLang, onSelectLang, onStartTextChat, onStartVideoChat }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const langRef = useRef<HTMLDivElement | null>(null);

  const selectedItem = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // Robust Outside Click & Touch Listener to Close Language Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }

    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [langOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-purple-500/10 backdrop-blur-2xl bg-[#090614]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="btn-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-purple-500/25 group-hover:scale-105 transition">
            <LogoMark size={18} className="text-white" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-mono">
            Vidibro
          </span>
        </Link>

        {/* Desktop Links & Actions */}
        <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-purple-200/80">
          <Link href="/" className="hover:text-white transition">Home</Link>
          
          {/* Top Redirect Actions */}
          <button
            onClick={onStartTextChat}
            className="flex items-center gap-1.5 hover:text-cyan-300 text-purple-200 transition font-semibold"
          >
            <MessageSquare size={15} className="text-purple-400" /> Talk to Stranger
          </button>
          
          <button
            onClick={onStartVideoChat}
            className="flex items-center gap-1.5 hover:text-pink-300 text-purple-200 transition font-semibold"
          >
            <Video size={15} className="text-pink-400" /> Video Call
          </button>

          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <Link href="/guidelines" className="hover:text-white transition">Guidelines</Link>
          <Link href="/faq" className="hover:text-white transition">FAQ</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          
          <Link
            href="/report"
            className="bg-[#e6534a] hover:bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold transition shadow-md flex items-center gap-1"
          >
            <ShieldAlert size={13} /> Report Issue
          </Link>
        </div>

        {/* Right Header Controls (Language Selector & Hamburger / Close Icon) */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Dropdown Container with Ref */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-1.5 text-xs font-semibold text-purple-100 backdrop-blur-md transition"
            >
              <Globe size={14} className="text-cyan-300" />
              <span>{selectedItem.code}</span>
              <span className="text-[10px] text-purple-300">▼</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#120a2e] border border-white/20 p-1.5 shadow-2xl z-50 text-xs max-h-64 overflow-y-auto"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLang(lang.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                        currentLang === lang.code ? "bg-purple-600 font-bold text-white" : "text-purple-200 hover:bg-white/10"
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-sm">{lang.flag}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger / Close Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/25 border border-white/15 text-white transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Top Drop-Down Menu Overlay Card */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 z-50 bg-[#0e0828] border-b border-purple-500/20 px-6 py-8 flex flex-col items-center text-center space-y-4 shadow-2xl rounded-b-3xl backdrop-blur-3xl"
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              Home
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              Blog
            </Link>

            <Link
              href="/guidelines"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              Guidelines
            </Link>

            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              FAQ
            </Link>

            <Link
              href="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              Terms
            </Link>

            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              Privacy
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-extrabold text-white hover:text-purple-300 transition"
            >
              Contact Us
            </Link>

            <Link
              href="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full max-w-xs bg-[#e6534a] hover:bg-red-600 text-white font-extrabold py-2.5 rounded-xl shadow-lg transition text-sm tracking-wide mt-2 text-center"
            >
              Report Issue
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
