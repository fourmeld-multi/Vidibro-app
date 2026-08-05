import { Compass, ShieldCheck, Scale, Users, type LucideIcon } from "lucide-react";
import type { BlogCategory } from "@/lib/blog/types";
import { CATEGORY_LABELS } from "@/lib/blog/types";

const CATEGORY_STYLE: Record<
  BlogCategory,
  { from: string; via: string; to: string; icon: LucideIcon }
> = {
  guides: { from: "#6d28d9", via: "#8b5cf6", to: "#38bdf8", icon: Compass },
  safety: { from: "#b45309", via: "#f59e0b", to: "#ef4444", icon: ShieldCheck },
  comparisons: { from: "#0369a1", via: "#6366f1", to: "#8b5cf6", icon: Scale },
  community: { from: "#be185d", via: "#ec4899", to: "#a78bfa", icon: Users },
};

/** Deterministic 0-1 values from a string, so each post's decoration sits in a
 *  different (but stable across renders) arrangement. */
function seeded(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return {
    a: (hash % 100) / 100,
    b: ((hash >> 7) % 100) / 100,
    c: ((hash >> 13) % 100) / 100,
    d: ((hash >> 19) % 100) / 100,
  };
}

/** Rough character budget per line at the title's font size. */
function wrapTitle(title: string, maxChars = 26, maxLines = 3): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = candidate;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = `${lines[maxLines - 1]}…`;
  }
  return lines;
}

/**
 * A branded cover image per post, drawn as SVG rather than sourced as a photo:
 * no licensing question, nothing to generate externally, and the whole blog
 * reads as one visual family. Carries the post title so a shared link or a
 * card in the grid is legible on its own, the way a real cover image would be.
 */
export default function PostIllustration({
  category,
  seed,
  title,
  className = "",
}: {
  category: BlogCategory;
  seed: string;
  title?: string;
  className?: string;
}) {
  const style = CATEGORY_STYLE[category];
  const Icon = style.icon;
  const { a, b, c, d } = seeded(seed);
  const id = seed.replace(/[^a-z0-9]/gi, "");
  const lines = title ? wrapTitle(title) : [];

  return (
    <svg viewBox="0 0 400 225" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label={title ?? ""}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={style.from} />
          <stop offset="55%" stopColor={style.via} />
          <stop offset="100%" stopColor={style.to} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* Darkens the lower-left so the title always has contrast to sit on,
            regardless of where the decorative shapes land for this seed. */}
        <linearGradient id={`scrim-${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.62" />
          <stop offset="55%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </linearGradient>
        <pattern id={`grid-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L0 0 0 20" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="400" height="225" fill={`url(#g-${id})`} />
      <rect width="400" height="225" fill={`url(#grid-${id})`} />

      {/* Layered decorative geometry — arrangement varies per post via the seed */}
      <circle cx={330 - b * 40} cy={40 + a * 30} r={60 + c * 25} fill="#ffffff" opacity="0.10" />
      <circle cx={355 - a * 30} cy={70 + c * 40} r={95 + d * 25} fill="#000000" opacity="0.12" />
      <circle cx={300 + c * 40} cy={100} r="120" fill={`url(#glow-${id})`} />
      <circle
        cx={250 + a * 60}
        cy={185 + b * 20}
        r={45 + d * 20}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="1.5"
      />

      <rect width="400" height="225" fill={`url(#scrim-${id})`} />

      {/* Brand mark, top-left. Uses the real logo rather than the hand-drawn
          chevron glyph that used to be here (that came from an early design
          doc and is not what the site ships).

          Points at /logo-mark.png, not /logo.png: the original is an opaque
          tile whose four rounded corners are filled white rather than
          transparent, so on a coloured background it renders as a white box
          around the logo. logo-mark.png is the same artwork with a proper
          alpha channel on those corners. */}
      <g transform="translate(20 16)">
        <image
          href="/logo-mark.png"
          x="0"
          y="0"
          width="22"
          height="22"
          preserveAspectRatio="xMidYMid meet"
        />
        <text x="29" y="16" fill="#ffffff" fontSize="12.5" fontWeight="800" letterSpacing="0.3">
          Vidibro
        </text>
      </g>

      {/* Category chip, top-right. Width is derived from the label so the
          longest one ("Comparisons") doesn't overflow the right edge. */}
      {(() => {
        const label = CATEGORY_LABELS[category];
        const chipWidth = 34 + label.length * 5.6;
        return (
          <g transform={`translate(${400 - 16 - chipWidth} 16)`}>
            <rect
              width={chipWidth}
              height="22"
              rx="11"
              fill="#000000"
              fillOpacity="0.32"
              stroke="#ffffff"
              strokeOpacity="0.3"
            />
            <foreignObject x="9" y="4" width="14" height="14">
              <Icon size={14} color="white" strokeWidth={2.4} />
            </foreignObject>
            <text x="27" y="15" fill="#ffffff" fontSize="10" fontWeight="700" letterSpacing="0.3">
              {label}
            </text>
          </g>
        );
      })()}

      {/* Title, bottom-left over the scrim */}
      {lines.length > 0 && (
        <g>
          {lines.map((line, i) => (
            <text
              key={i}
              x="24"
              y={225 - 26 - (lines.length - 1 - i) * 25}
              fill="#ffffff"
              fontSize="21"
              fontWeight="800"
              letterSpacing="-0.3"
            >
              {line}
            </text>
          ))}
          <rect x="24" y={225 - 16} width="44" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.75" />
        </g>
      )}
    </svg>
  );
}
