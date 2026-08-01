/**
 * A 24-hour strip showing when this market's queue is actually busy.
 *
 * Generated from the entry's own peakHours string, so it is genuinely different
 * on every page rather than decoration repeated 200 times. That matters twice
 * over: it is the kind of thing a reader actually uses, and a visual that
 * differs per page is one more reason the page is not a duplicate.
 *
 * Deliberately not a stock photograph. On a site whose product is talking to
 * real strangers, a stock or generated face is the worst asset we could ship.
 */

function parseWindow(peakHours: string): { start: number; end: number; label: string } | null {
  // Handles "21:00 – 01:00 IST" and the first half of "22:00 – 01:00 IST / 22:30 – 01:30 BST"
  const m = peakHours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*([A-Z]{2,5})?/);
  if (!m) return null;
  return {
    start: parseInt(m[1], 10),
    end: parseInt(m[3], 10),
    label: m[5] ?? "local time",
  };
}

/** Hours are busy if they fall in the window, which usually wraps past midnight. */
function isBusy(hour: number, start: number, end: number) {
  return start <= end ? hour >= start && hour < end : hour >= start || hour < end;
}

export default function PeakHoursBar({ peakHours }: { peakHours: string }) {
  const win = parseWindow(peakHours);
  if (!win) return null;

  const hours = Array.from({ length: 24 }, (_, h) => h);

  return (
    <figure className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 sm:px-6">
      <figcaption className="mb-4 text-[11px] font-bold uppercase tracking-wider text-purple-300/70">
        When the queue is busy · {win.label}
      </figcaption>

      <div className="flex items-end gap-[3px]" aria-hidden="true">
        {hours.map((h) => {
          const busy = isBusy(h, win.start, win.end);
          // A gentle arc across the busy window rather than a flat block, so it
          // reads as activity rather than a progress bar.
          const distance = Math.min(
            ...[h, h + 24, h - 24].map((x) =>
              Math.abs(x - (win.start + ((win.end - win.start + 24) % 24) / 2))
            )
          );
          const height = busy ? 34 - Math.min(distance * 4, 14) : 9;
          return (
            <div
              key={h}
              style={{ height }}
              className={`flex-1 rounded-sm transition-colors ${
                busy ? "bg-gradient-to-t from-purple-500/70 to-pink-400/70" : "bg-white/[0.07]"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-purple-300/45">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>

      {/* The text carries the same information for anyone who cannot see the bar. */}
      <p className="mt-3 text-xs text-purple-200/70">
        Busiest between <strong className="text-purple-100">{peakHours}</strong>. Outside that
        window the queue is genuinely thinner — matching will take longer, and that is the queue,
        not a fault.
      </p>
    </figure>
  );
}
