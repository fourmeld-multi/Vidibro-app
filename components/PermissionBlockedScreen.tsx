"use client";

import { CameraOff } from "lucide-react";

/**
 * Shown only when the browser is permanently blocking camera/mic for this site
 * — i.e. the user picked "Never allow" at some point.
 *
 * This is deliberately NOT a retry prompt. Retrying does nothing: once a site
 * is blocked, getUserMedia rejects instantly and no permission dialog appears,
 * so a button that re-asks would just fail silently every time. The only route
 * back is site settings, so that is what this screen explains.
 *
 * A plain decline never lands here — that sends the user back to the landing
 * page, where clicking Start re-prompts normally.
 */
export default function PermissionBlockedScreen({
  mode,
  onHome,
}: {
  mode: "video" | "audio";
  onHome: () => void;
}) {
  const device = mode === "audio" ? "microphone" : "camera and microphone";

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-5 bg-[#070414] px-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/15">
        <CameraOff size={28} className="text-amber-300" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-extrabold text-white">
          {mode === "audio" ? "Audio" : "Video"} chat is blocked
        </h2>
        <p className="max-w-xs text-xs leading-relaxed text-purple-200/70">
          Your browser is blocking the {device}{" "}for Vidibro, so we can&apos;t ask you
          again from here. Tap the lock or camera icon in the address bar, set the{" "}
          {device} to <span className="font-bold text-purple-100">Allow</span>, then
          reload this page.
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
