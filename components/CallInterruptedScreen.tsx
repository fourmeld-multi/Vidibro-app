"use client";

import { useEffect } from "react";
import { PhoneOff } from "lucide-react";

/**
 * Shown when the microphone gets taken away by another app — in practice, a
 * phone call. Video and audio chat are blocked outright while that is true,
 * rather than dropping the user into a call where nobody can hear them.
 *
 * Note this is not "we detected a phone call" — no browser can tell us that.
 * It is "the mic is gone", which is what a phone call looks like from here.
 */
export default function CallInterruptedScreen({
  mode,
  onHome,
}: {
  mode: "video" | "audio";
  onHome: () => void;
}) {
  // Don't strand anyone on this screen if they put the phone down and walk off.
  useEffect(() => {
    const t = setTimeout(onHome, 6000);
    return () => clearTimeout(t);
  }, [onHome]);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-[#070414] px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/15">
        <PhoneOff size={28} className="text-red-300" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold text-white">You&apos;re on a phone call</h2>
        <p className="max-w-xs text-xs leading-relaxed text-purple-200/70">
          Your microphone is being used by another call, so {mode} chat can&apos;t start.
          End the call and try again.
        </p>
      </div>

      <button
        onClick={onHome}
        className="btn-gradient rounded-full px-7 py-2.5 text-xs font-extrabold text-white shadow-lg"
      >
        Back to home
      </button>
    </div>
  );
}
