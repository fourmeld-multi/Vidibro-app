import { Compass, ShieldCheck, Scale, Users, type LucideIcon } from "lucide-react";
import type { BlogCategory } from "@/lib/blog/types";

const CATEGORY_STYLE: Record<BlogCategory, { from: string; via: string; to: string; icon: LucideIcon }> = {
  guides: { from: "#8b5cf6", via: "#a78bfa", to: "#38bdf8", icon: Compass },
  safety: { from: "#f59e0b", via: "#fb923c", to: "#ef4444", icon: ShieldCheck },
  comparisons: { from: "#38bdf8", via: "#818cf8", to: "#8b5cf6", icon: Scale },
  community: { from: "#ec4899", via: "#f472b6", to: "#a78bfa", icon: Users },
};

/** Deterministic 0-1 values from a string, so each post's blobs sit in a
 *  different (but stable across renders) spot without needing real art. */
function seededOffsets(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const a = (hash % 100) / 100;
  const b = ((hash >> 8) % 100) / 100;
  const c = ((hash >> 16) % 100) / 100;
  return { a, b, c };
}

/**
 * A branded illustration in place of a stock/AI photo for each post — no
 * licensing question, no external generation step, and it reads as one
 * consistent visual family across the whole blog rather than a grab-bag of
 * unrelated photography.
 */
export default function PostIllustration({
  category,
  seed,
  className = "",
}: {
  category: BlogCategory;
  seed: string;
  className?: string;
}) {
  const style = CATEGORY_STYLE[category];
  const Icon = style.icon;
  const { a, b, c } = seededOffsets(seed);
  const gradId = `pig-${seed.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      viewBox="0 0 400 225"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={style.from} />
          <stop offset="55%" stopColor={style.via} />
          <stop offset="100%" stopColor={style.to} />
        </linearGradient>
        <radialGradient id={`${gradId}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="225" fill={`url(#${gradId})`} />

      {/* Decorative soft blobs, positioned per-post from the seed */}
      <circle cx={60 + a * 100} cy={40 + b * 60} r={70 + c * 30} fill="#ffffff" opacity="0.08" />
      <circle cx={320 - b * 80} cy={180 - a * 60} r={90 + b * 20} fill="#000000" opacity="0.1" />
      <circle cx={200 + c * 60} cy={110} r="130" fill={`url(#${gradId}-glow)`} />

      {/* Centered icon badge */}
      <g transform="translate(200 112.5)">
        <circle r="34" fill="rgba(0,0,0,0.18)" />
        <circle r="34" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <foreignObject x="-16" y="-16" width="32" height="32">
          <Icon size={32} color="white" strokeWidth={2} />
        </foreignObject>
      </g>
    </svg>
  );
}
