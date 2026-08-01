"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";

/**
 * A collapsible block of links, matching the FAQ's +/- behaviour.
 *
 * The important detail is that **every link is always in the HTML**. Collapsing
 * hides them with CSS rather than removing them from the tree, because a
 * crawler follows links it can see in the source regardless of whether they are
 * visually hidden — but it cannot follow links that only appear after a
 * JavaScript fetch. So a reader sees eight, and Googlebot sees all three
 * hundred. Rendering on demand would have quietly cost us the entire long tail.
 */
export default function LinkAccordion({
  title,
  subtitle,
  items,
  initiallyOpen = false,
  previewCount = 8,
}: {
  title: string;
  subtitle?: string;
  items: Array<{ href: string; label: string }>;
  initiallyOpen?: boolean;
  previewCount?: number;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [showAll, setShowAll] = useState(false);

  if (!items.length) return null;
  const hasMore = items.length > previewCount;

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors ${
        open ? "border-purple-400/30 bg-purple-500/[0.05]" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span>
          <span className="text-lg sm:text-xl font-black text-white">{title}</span>
          <span className="ml-2 text-sm font-bold text-purple-300/60">({items.length})</span>
          {subtitle && (
            <span className="mt-1 block text-sm text-purple-200/60">{subtitle}</span>
          )}
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
            open
              ? "border-purple-400/40 bg-purple-500/20 text-purple-200"
              : "border-white/10 bg-white/5 text-purple-300"
          }`}
        >
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      {/* hidden, not unmounted — see the note above */}
      <div className={open ? "px-5 pb-5 sm:px-6 sm:pb-6" : "hidden"}>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <PillLink key={item.href} {...item} hidden={!showAll && i >= previewCount} />
          ))}
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="mt-4 text-sm font-extrabold text-pink-400 underline underline-offset-4 transition hover:text-pink-300"
          >
            {showAll ? "Show fewer" : `Show all ${items.length}`}
          </button>
        )}
      </div>
    </div>
  );
}

export function PillLink({
  href,
  label,
  hidden = false,
}: {
  href: string;
  label: string;
  hidden?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 transition hover:border-purple-400/30 hover:bg-white/[0.07] ${
        hidden ? "hidden" : ""
      }`}
    >
      <span className="text-[13px] sm:text-sm leading-snug text-purple-100/85 transition group-hover:text-white">
        {label}
      </span>
      <ArrowRight
        size={15}
        className="shrink-0 text-purple-300/40 transition group-hover:translate-x-0.5 group-hover:text-purple-200"
      />
    </Link>
  );
}
