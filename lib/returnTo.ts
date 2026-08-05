const KEY = "vidibro:prevPath";

/** Paired with PathTracker — see that component for why this exists. */
export function getReturnPath(currentPath: string): string {
  if (typeof window === "undefined") return "/";
  try {
    const prev = sessionStorage.getItem(KEY);
    if (prev && prev.startsWith("/") && prev !== currentPath) return prev;
  } catch {
    // sessionStorage unavailable — fall through to home.
  }
  return "/";
}
