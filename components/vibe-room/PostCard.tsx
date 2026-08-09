"use client";

import { useState } from "react";
import type { SecretDrop } from "@/lib/vibe-room/types";
import { formatTimeAgo } from "@/lib/vibe-room/mock-data";

interface PostCardProps {
  drop: SecretDrop;
  onReply: (dropId: string) => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

export default function PostCard({ drop, onReply, isLoggedIn, onAuthRequired }: PostCardProps) {
  const [redFlags, setRedFlags] = useState(drop.redFlags);
  const [greenFlags, setGreenFlags] = useState(drop.greenFlags);
  const [userRed, setUserRed] = useState(drop.userRedFlagged ?? false);
  const [userGreen, setUserGreen] = useState(drop.userGreenFlagged ?? false);

  function handleFlag(type: "red" | "green") {
    if (type === "red") {
      if (userRed) {
        setRedFlags((n) => n - 1);
        setUserRed(false);
      } else {
        setRedFlags((n) => n + 1);
        setUserRed(true);
        if (userGreen) {
          setGreenFlags((n) => n - 1);
          setUserGreen(false);
        }
      }
    } else {
      if (userGreen) {
        setGreenFlags((n) => n - 1);
        setUserGreen(false);
      } else {
        setGreenFlags((n) => n + 1);
        setUserGreen(true);
        if (userRed) {
          setRedFlags((n) => n - 1);
          setUserRed(false);
        }
      }
    }
  }

  function handleReply() {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    onReply(drop.id);
  }

  return (
    <article className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-colors">
      <p className="text-white text-[15px] leading-relaxed mb-4">{drop.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFlag("red")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              userRed
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-red-500/30 hover:text-red-400"
            }`}
          >
            🚩 <span>{redFlags}</span>
          </button>

          <button
            onClick={() => handleFlag("green")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              userGreen
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-400"
            }`}
          >
            🟩 <span>{greenFlags}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-600" suppressHydrationWarning>{formatTimeAgo(drop.createdAt)}</span>
          <button
            onClick={handleReply}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors"
          >
            💬 <span>{drop.replyCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
