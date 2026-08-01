"use client";

import { useEffect, useState } from "react";
import { Clock, Users, Sunrise } from "lucide-react";
import { localTimeIn, isPeakNow, marketOnlineCount, formatCount, formatPeakHours } from "@/lib/liveCount";

/**
 * "What is happening in this market right now."
 *
 * Every entry already stores an IANA timezone that nothing was using. Reading
 * it turns a static page into something that changes through the day and reads
 * differently for a visitor at 9am than at midnight — which no competitor page
 * does, and which cannot be copied without the underlying per-market data.
 *
 * Rendered client-side after mount on purpose: the server has no idea what time
 * it is for the reader, and rendering a time during SSR would either produce a
 * hydration mismatch or bake a stale value into a statically generated page.
 * The skeleton keeps the layout stable so nothing shifts when it fills in.
 */
export default function LiveMarketStatus({
  slug,
  name,
  timezone,
  peakHours,
  weight = 1,
}: {
  slug: string;
  name: string;
  timezone: string;
  peakHours: string;
  weight?: number;
}) {
  const [state, setState] = useState<{
    time: string;
    peak: boolean | null;
    count: string;
    offsetLabel: string;
    sameZone: boolean;
  } | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();

      // How far ahead or behind the reader this market is. Computed by
      // formatting the same instant in both zones rather than by assuming a
      // fixed offset, so it stays correct across DST changes.
      const there = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      const here = new Date(now.toLocaleString("en-US"));
      const diffMin = Math.round((there.getTime() - here.getTime()) / 60000);
      const sign = diffMin === 0 ? "" : diffMin > 0 ? "ahead of" : "behind";
      const abs = Math.abs(diffMin);
      const h = Math.floor(abs / 60);
      const m = abs % 60;
      const offsetLabel =
        diffMin === 0
          ? "the same time as you"
          : `${h}h${m ? ` ${m}m` : ""} ${sign} you`;

      setState({
        time: localTimeIn(timezone, now),
        peak: isPeakNow(peakHours, timezone, now),
        count: formatCount(marketOnlineCount(slug, timezone, weight, now)),
        offsetLabel,
        sameZone: diffMin === 0,
      });
    };

    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [slug, timezone, peakHours, weight]);

  if (!state) {
    return <div className="mt-8 h-[86px] rounded-2xl border border-white/10 bg-white/[0.03]" />;
  }

  const { time, peak, count, offsetLabel, sameZone } = state;

  return (
    <div
      className={`mt-8 rounded-2xl border px-5 py-4 sm:px-6 ${
        peak
          ? "border-emerald-400/25 bg-emerald-500/[0.07]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {!sameZone && (
          <div className="flex items-center gap-2">
            <Clock size={15} className={peak ? "text-emerald-300" : "text-purple-300/70"} />
            <span className="text-base text-purple-100">
              <strong className="font-bold text-white">{time}</strong> in {name}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              peak ? "bg-emerald-400 animate-pulse motion-reduce:animate-none" : "bg-purple-400/50"
            }`}
          />
          <span className="text-base text-purple-100">
            {peak ? (
              <>
                <strong className="font-bold text-emerald-300">Peak hours</strong> — best time to
                match
              </>
            ) : (
              <>Quieter than usual right now</>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users size={15} className="text-purple-300/70" />
          <span className="text-base text-purple-100">
            <strong className="font-bold text-white">{count}</strong> online
          </span>
        </div>
      </div>

      <p className="mt-2.5 flex items-center gap-1.5 text-sm text-purple-300/60">
        <Sunrise size={13} />
        {sameZone ? (
          <>It is {time} where you are · busiest {formatPeakHours(peakHours)}</>
        ) : (
          <>
            {name} is {offsetLabel}
            {!peak && <> · busiest {formatPeakHours(peakHours)}</>}
          </>
        )}
      </p>
    </div>
  );
}
