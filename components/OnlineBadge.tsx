"use client";

import { useEffect, useState } from "react";
import { globalOnlineCount, formatCount } from "@/lib/liveCount";

export default function OnlineBadge() {
  const [count, setCount] = useState(() => globalOnlineCount());

  useEffect(() => {
    const id = setInterval(() => {
      setCount(globalOnlineCount());
    }, 5_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="font-semibold text-white">{formatCount(count)}</span>
      <span>people available right now</span>
    </div>
  );
}
