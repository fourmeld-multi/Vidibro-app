"use client";

import { useState } from "react";
import { Copy, Check, MessageCircleQuestion, Languages, Sparkles } from "lucide-react";

/**
 * The "Speak Local" and "Conversation Starters" cards.
 *
 * These replace what was a bulleted list of talking points. A bullet saying
 * "festivals" is a topic; a card saying 'which pandal are you doing this year?'
 * with a copy button is something a reader actually uses mid-call. That is the
 * difference between a page you read and a page you keep open.
 *
 * Client component only because of the copy buttons — everything else here is
 * static and server-rendered content.
 */

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
      className="shrink-0 rounded-lg border border-white/10 bg-white/[0.04] p-1.5 text-purple-300/70 transition hover:border-purple-400/30 hover:text-purple-200"
    >
      {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
    </button>
  );
}

export function SpeakLocal({
  name,
  phrases,
}: {
  name: string;
  phrases: Array<{ phrase: string; meaning: string; say: string }>;
}) {
  if (!phrases?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
          <Languages size={16} />
        </span>
        <h3 className="text-base font-black text-white">Speak local</h3>
      </div>
      <p className="mb-4 text-sm text-purple-200/65">
        Four phrases worth having ready. Using one in the first ten seconds changes how the
        conversation goes.
      </p>

      <div className="space-y-2.5">
        {phrases.map((p) => (
          <div
            key={p.phrase}
            className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-3.5 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold text-amber-200">{p.phrase}</div>
              <div className="mt-1 text-sm text-purple-100/85">{p.meaning}</div>
              <div className="mt-0.5 text-[13px] italic text-purple-300/50">say: {p.say}</div>
            </div>
            <CopyButton text={p.phrase} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConversationStarters({
  name,
  starters,
}: {
  name: string;
  starters: Array<{ topic: string; ask: string; why: string }>;
}) {
  if (!starters?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
          <MessageCircleQuestion size={16} />
        </span>
        <h3 className="text-base font-black text-white">What to actually ask</h3>
      </div>
      <p className="mb-4 text-sm text-purple-200/65">
        Specific questions get answers. &ldquo;Hi&rdquo; gets skipped.
      </p>

      <div className="space-y-2.5">
        {starters.map((s) => (
          <div
            key={s.topic}
            className="rounded-xl border border-white/[0.07] bg-black/20 px-3.5 py-3"
          >
            <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-pink-300/70">
              <Sparkles size={12} /> {s.topic}
            </div>
            <div className="mt-1.5 flex items-start gap-3">
              <p className="min-w-0 flex-1 text-base font-semibold leading-snug text-white">
                &ldquo;{s.ask}&rdquo;
              </p>
              <CopyButton text={s.ask} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-purple-200/65">{s.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
