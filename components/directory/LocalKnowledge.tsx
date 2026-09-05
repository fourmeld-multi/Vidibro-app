"use client";

import { useState } from "react";
import { Copy, Check, MessageCircleQuestion, Languages, Sparkles } from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      aria-label={copied ? "Copied" : `Copy: ${text}`}
      className="shrink-0 rounded-lg border border-white/10 bg-white/[0.06] p-2 text-purple-300/70 transition hover:border-purple-400/40 hover:text-purple-200"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
}

const PHRASE_ACCENTS = [
  "border-l-amber-400 bg-amber-500/[0.07]",
  "border-l-cyan-400 bg-cyan-500/[0.07]",
  "border-l-pink-400 bg-pink-500/[0.07]",
  "border-l-purple-400 bg-purple-500/[0.07]",
];

export function SpeakLocal({
  name,
  phrases,
}: {
  name: string;
  phrases: Array<{ phrase: string; meaning: string; say: string }>;
}) {
  if (!phrases?.length) return null;
  return (
    <div className="dir-card rounded-2xl border border-white/10 bg-white/[0.07] p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
          <Languages size={20} />
        </span>
        <div>
          <h3 className="text-lg font-black text-white">Speak Local</h3>
          <p className="text-xs text-purple-300/60">One phrase changes the whole conversation</p>
        </div>
      </div>

      <div className="space-y-3">
        {phrases.map((p, i) => (
          <div
            key={p.phrase}
            className={`flex items-start gap-4 rounded-xl border-l-4 px-4 py-3.5 ${PHRASE_ACCENTS[i % PHRASE_ACCENTS.length]}`}
          >
            <div className="min-w-0 flex-1">
              <div className="text-xl font-black text-white">{p.phrase}</div>
              <div className="mt-1 text-sm text-purple-100/75">{p.meaning}</div>
            </div>
            <CopyButton text={p.phrase} />
          </div>
        ))}
      </div>
    </div>
  );
}

const STARTER_COLORS = [
  { label: "text-pink-300", border: "border-pink-400/40", bg: "bg-pink-500/10", dot: "bg-pink-400" },
  { label: "text-cyan-300", border: "border-cyan-400/40", bg: "bg-cyan-500/10", dot: "bg-cyan-400" },
  { label: "text-amber-300", border: "border-amber-400/40", bg: "bg-amber-500/10", dot: "bg-amber-400" },
  { label: "text-purple-300", border: "border-purple-400/40", bg: "bg-purple-500/10", dot: "bg-purple-400" },
];

export function ConversationStarters({
  name,
  starters,
}: {
  name: string;
  starters: Array<{ topic: string; ask: string; why: string }>;
}) {
  if (!starters?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-300">
          <MessageCircleQuestion size={20} />
        </span>
        <div>
          <h3 className="text-lg font-black text-white">What to Actually Ask</h3>
          <p className="text-xs text-purple-300/60">Specific questions get answers. &ldquo;Hi&rdquo; gets skipped.</p>
        </div>
      </div>

      <div className="space-y-3">
        {starters.map((s, i) => {
          const c = STARTER_COLORS[i % STARTER_COLORS.length];
          return (
            <div key={s.topic} className={`rounded-xl border ${c.border} ${c.bg} px-4 py-3.5`}>
              <div className={`mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${c.label}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {s.topic}
              </div>
              <div className="flex items-start gap-3">
                <p className="min-w-0 flex-1 text-base font-bold leading-snug text-white">
                  &ldquo;{s.ask}&rdquo;
                </p>
                <CopyButton text={s.ask} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
