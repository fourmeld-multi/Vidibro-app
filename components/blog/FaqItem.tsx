"use client";

import { useState } from "react";

export default function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`mb-3 rounded-xl border transition-colors ${open ? "border-purple-500/40 bg-purple-500/[0.06]" : "border-white/10 bg-white/[0.03] hover:border-purple-500/25"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left font-semibold text-white"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className={`ml-4 shrink-0 text-xl leading-none text-purple-400 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed text-purple-100/85">
          {a}
        </div>
      )}
    </div>
  );
}
