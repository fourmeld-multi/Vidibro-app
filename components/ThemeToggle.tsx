"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  // The server always renders assuming "dark" (it has no access to
  // localStorage/system preference), but the beforeInteractive script in
  // layout.tsx may have already corrected the DOM to "light" before this
  // component mounts. Reading that real value during the initial client
  // render (even via a lazy useState initializer) would mismatch what the
  // server sent — hence reading it in an effect, post-hydration, and
  // suppressing the resulting one-frame icon mismatch explicitly below.
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("vidibro-theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light / dark mode"
      suppressHydrationWarning
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--overlay-1)] text-[var(--muted)] transition hover:bg-[var(--overlay-2)] hover:text-[var(--foreground)]"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
