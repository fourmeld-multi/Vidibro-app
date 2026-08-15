"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const KEY = "vidibro:prevPath";

// framer-motion calls releasePointerCapture after the OS has already
// cancelled the pointer (common on mobile scroll + drag). The error is
// harmless but pollutes the console — patch it away globally, once.
if (typeof window !== "undefined") {
  const orig = Element.prototype.releasePointerCapture;
  Element.prototype.releasePointerCapture = function (id: number) {
    try { orig.call(this, id); } catch { /* pointer already gone — safe to ignore */ }
  };
}

/**
 * Records the path the user was on right before their most recent
 * navigation, in sessionStorage. The video/audio/text chat pages read this
 * on "leave" so they can return to wherever the user actually came from
 * (a directory page, an alternative page, the homepage, ...) instead of
 * always bouncing to "/". document.referrer can't be used for this — it
 * only reflects the very first full page load of the tab, not later
 * client-side route changes.
 */
export default function PathTracker() {
  const pathname = usePathname();
  const prevRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevRef.current && prevRef.current !== pathname) {
      try {
        sessionStorage.setItem(KEY, prevRef.current);
      } catch {
        // sessionStorage unavailable (private mode, etc.) — return-to just
        // falls back to home, which is the pre-existing behavior.
      }
    }
    prevRef.current = pathname;
  }, [pathname]);

  return null;
}
