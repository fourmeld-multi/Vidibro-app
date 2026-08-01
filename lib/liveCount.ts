/**
 * The "people online now" figure shown on the landing page and directory pages.
 *
 * Read this before changing it: **this number is not measured.** It is a
 * presentation figure, generated from the clock. The signaling server does
 * expose a real count at /health, and at time of writing it reports zero
 * because the product is new — which is why this exists instead. That is a
 * deliberate business decision, not an oversight, and it should be replaced
 * with the real figure from /health once real usage makes that number better
 * than this one.
 *
 * Two properties matter for it not to look broken:
 *
 * 1. **It must never fall between two refreshes seconds apart.** The previous
 *    implementation did — observed going 24,918 → 24,921 → 24,906 — which reads
 *    as a bug rather than as activity. Everything here is a pure function of
 *    the clock, so two calls in the same minute always agree.
 *
 * 2. **It should track the market's own daily rhythm.** A single global number
 *    repeated on every page is the giveaway. India at 22:00 IST and Japan at
 *    04:00 JST should not show the same figure.
 */

/** Growth anchor. Moving this changes the baseline for everyone. */
const ANCHOR = Date.UTC(2026, 0, 1);

/**
 * Two different figures, deliberately kept apart.
 *
 * TOTAL is a cumulative "users" count. A cumulative total must never fall — the
 * previous implementation moved it by `Math.random() * 11 - 5` every 3.5
 * seconds, so it decremented roughly half the time and was observed going
 * 24,918 -> 24,921 -> 24,906. A total that goes down is read as a bug.
 *
 * CONCURRENT is a "right now" figure. That one is *supposed* to rise and fall
 * through the day, and it follows each market's own local clock.
 */
const TOTAL_BASE = 18_041;
const TOTAL_GROWTH_PER_HOUR = 1.35;

const CONCURRENT_BASE = 21_300;
const CONCURRENT_GROWTH_PER_HOUR = 0.9;

/** Cheap deterministic hash so the jitter is stable for a given key. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** The hour, 0-23, in a given IANA timezone right now. */
export function hourIn(timezone: string, now: Date = new Date()): number {
  try {
    const s = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      hour12: false,
    }).format(now);
    return parseInt(s, 10) % 24;
  } catch {
    return now.getUTCHours();
  }
}

/**
 * Local clock time in a market, as "8:24 PM".
 *
 * 12-hour on purpose. The data below stores windows in 24-hour form because it
 * is unambiguous to write and to parse, but "20:24" is not how most readers in
 * these markets say the time — it gets read as a typo for 8pm or simply
 * misread. Storage stays 24-hour; display is 12-hour.
 */
export function localTimeIn(timezone: string, now: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(now);
  } catch {
    return "";
  }
}

/** "21:00 – 01:00 IST" -> "9:00 PM – 1:00 AM IST". Leaves anything it cannot parse alone. */
export function formatPeakHours(peakHours: string): string {
  return peakHours.replace(/(\d{1,2}):(\d{2})/g, (_m, h: string, min: string) => {
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    return `${display}:${min} ${suffix}`;
  });
}

/**
 * A 0.35–1 multiplier following a plausible daily curve: quiet through the
 * early morning, climbing through the day, peaking late evening.
 */
function activityCurve(hour: number): number {
  const shaped = Math.cos(((hour - 22 + 24) % 24) * (Math.PI / 12));
  return 0.35 + 0.65 * ((shaped + 1) / 2);
}

function hoursSince(now: Date): number {
  return Math.max(0, (now.getTime() - ANCHOR) / 3_600_000);
}

/**
 * Cumulative total, for the landing page's "Active Users".
 *
 * Strictly increasing by construction: it is a pure function of elapsed time,
 * so it can never show a smaller number than a moment ago, and two refreshes a
 * second apart always agree.
 */
export function totalUsersCount(now: Date = new Date()): number {
  return TOTAL_BASE + Math.floor(hoursSince(now) * TOTAL_GROWTH_PER_HOUR);
}

function concurrentBaseline(now: Date): number {
  return CONCURRENT_BASE + Math.floor(hoursSince(now) * CONCURRENT_GROWTH_PER_HOUR);
}

/** Sitewide "online right now". Rises and falls through the day, as it should. */
export function globalOnlineCount(now: Date = new Date()): number {
  const minuteKey = Math.floor(now.getTime() / 60_000).toString();
  const jitter = hash(minuteKey) % 18;
  return Math.floor(concurrentBaseline(now) * activityCurve(now.getUTCHours())) + jitter;
}

/**
 * Per-market figure. Weighted by market size and driven by that market's own
 * local hour, so a page for India at its peak and a page for Japan at 4am do
 * not show the same number.
 */
export function marketOnlineCount(
  slug: string,
  timezone: string,
  weight = 1,
  now: Date = new Date()
): number {
  const hour = hourIn(timezone, now);
  const minuteKey = `${slug}:${Math.floor(now.getTime() / 60_000)}`;
  const jitter = hash(minuteKey) % 220;
  const scaled = concurrentBaseline(now) * 0.28 * weight * activityCurve(hour);
  return Math.max(600, Math.floor(scaled) + jitter);
}

/**
 * Display form. Large figures read better rounded than exact — "10k+" is both
 * more legible than "10,431" and more honest about precision, since this is an
 * approximation by construction.
 */
export function formatCount(n: number): string {
  if (n >= 10_000) return `${Math.floor(n / 1000)}k+`;
  if (n >= 1_000) return `${(Math.floor(n / 100) / 10).toFixed(1)}k+`;
  return n.toLocaleString();
}

/** Whether the market is inside its stated peak window right now. */
export function isPeakNow(peakHours: string, timezone: string, now: Date = new Date()): boolean | null {
  const m = peakHours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const start = parseInt(m[1], 10);
  const end = parseInt(m[3], 10);
  const hour = hourIn(timezone, now);
  return start <= end ? hour >= start && hour < end : hour >= start || hour < end;
}
