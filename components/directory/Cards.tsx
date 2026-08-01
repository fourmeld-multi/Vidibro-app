import Link from "next/link";
import type { ReactNode } from "react";
import { Check, X } from "lucide-react";

/**
 * The shared card vocabulary for directory pages.
 *
 * One design across every page, content differing per market. These exist
 * because the previous template said everything in paragraphs and bullet lists,
 * which reads as an article rather than a product page — a bulleted list is the
 * default shape of generated content, and it gives a reader nothing to scan.
 */

export type Tone = "purple" | "cyan" | "emerald" | "amber" | "pink";

/** Green is reserved for what matters most — safety, and the live peak state. */
export const TONES: Record<Tone, string> = {
  purple: "bg-purple-500/15 text-purple-300",
  cyan: "bg-cyan-500/15 text-cyan-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  amber: "bg-amber-500/15 text-amber-300",
  pink: "bg-pink-500/15 text-pink-300",
};

export function SectionHead({
  icon,
  title,
  blurb,
  tone = "purple",
}: {
  icon: ReactNode;
  title: string;
  blurb?: string;
  tone?: Tone;
}) {
  return (
    <div className="mb-6">
      <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
          {icon}
        </span>
        {title}
      </h2>
      {blurb && <p className="mt-3 text-base leading-relaxed text-purple-200/75">{blurb}</p>}
    </div>
  );
}

/** Big number + label. Facts only — nothing here should be unverifiable. */
export function StatTile({
  value,
  label,
  tone = "purple",
}: {
  value: string;
  label: string;
  tone?: Tone;
}) {
  const ring: Record<Tone, string> = {
    purple: "border-purple-400/20 bg-purple-500/[0.07]",
    cyan: "border-cyan-400/20 bg-cyan-500/[0.07]",
    emerald: "border-emerald-400/25 bg-emerald-500/[0.09]",
    amber: "border-amber-400/20 bg-amber-500/[0.07]",
    pink: "border-pink-400/20 bg-pink-500/[0.07]",
  };
  const text: Record<Tone, string> = {
    purple: "text-purple-100",
    cyan: "text-cyan-200",
    emerald: "text-emerald-300",
    amber: "text-amber-200",
    pink: "text-pink-200",
  };
  return (
    <div className={`rounded-2xl border px-4 py-5 text-center ${ring[tone]}`}>
      <div className={`text-xl sm:text-2xl font-black leading-tight ${text[tone]}`}>{value}</div>
      <div className="mt-1.5 text-[13px] font-bold uppercase tracking-wider text-purple-300/60">
        {label}
      </div>
    </div>
  );
}

export function IconCard({
  icon,
  title,
  children,
  tone = "purple",
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  tone?: Tone;
}) {
  const edge: Record<Tone, string> = {
    purple: "hover:border-purple-400/30",
    cyan: "hover:border-cyan-400/30",
    emerald: "hover:border-emerald-400/30",
    amber: "hover:border-amber-400/30",
    pink: "hover:border-pink-400/30",
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition ${edge[tone]}`}>
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONES[tone]}`}>
          {icon}
        </span>
        <h3 className="text-base font-black text-white">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-purple-100/80">{children}</div>
    </div>
  );
}

export function StepCard({
  step,
  icon,
  title,
  children,
}: {
  step: number;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
          {icon}
        </span>
        <div>
          <div className="text-[13px] font-bold uppercase tracking-wider text-cyan-400/80">
            Step {step}
          </div>
          <h3 className="text-base font-black leading-tight text-white">{title}</h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-purple-100/80">{children}</p>
    </div>
  );
}

/**
 * Comparison rows. Every claim here must be checkable — a competitor row that
 * is wrong is worse than no table, and Omegle having had text chat is exactly
 * the kind of thing that gets noticed.
 */
export function CompareTable({
  rows,
}: {
  rows: Array<{ feature: string; us: boolean | string; them: boolean | string }>;
}) {
  const cell = (v: boolean | string) =>
    typeof v === "string" ? (
      <span className="text-sm text-purple-200/75">{v}</span>
    ) : v ? (
      <Check size={16} className="mx-auto text-emerald-400" />
    ) : (
      <X size={16} className="mx-auto text-purple-300/30" />
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[420px] text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04]">
            <th className="px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-purple-300/60">
              &nbsp;
            </th>
            <th className="px-4 py-3 text-center text-[13px] font-bold uppercase tracking-wider text-purple-200">
              Vidibro
            </th>
            <th className="px-4 py-3 text-center text-[13px] font-bold uppercase tracking-wider text-purple-300/60">
              Typical clone site
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.feature} className={i % 2 ? "bg-white/[0.015]" : ""}>
              <td className="px-4 py-3 text-sm text-purple-100/85">{r.feature}</td>
              <td className="px-4 py-3 text-center">{cell(r.us)}</td>
              <td className="px-4 py-3 text-center">{cell(r.them)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RelatedGroup({
  label,
  items,
}: {
  label: string;
  items: Array<{ href: string; label: string }>;
}) {
  if (!items.length) return null;
  return (
    <div className="mb-4">
      <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-purple-300/45">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-purple-100/85 transition hover:border-purple-400/30 hover:bg-white/[0.08] hover:text-white"
          >
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
