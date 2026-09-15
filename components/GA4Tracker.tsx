"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GA4Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.gtag !== "function" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
    )
      return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname]);

  return null;
}
