"use client";

import { useState } from "react";

const MAX_CHARS = 280;

interface NewDropFormProps {
  onSubmit: (content: string) => void;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

export default function NewDropForm({ onSubmit, onAuthRequired, isLoggedIn }: NewDropFormProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  function handleOpen() {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || content.length > MAX_CHARS) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    onSubmit(content.trim());
    setContent("");
    setOpen(false);
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl px-4 py-3.5 text-zinc-500 hover:text-zinc-400 transition-colors text-sm text-left"
      >
        <span className="text-lg">💌</span>
        Drop something anonymously...
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4">
      <textarea
        autoFocus
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind? Keep it anonymous..."
        rows={4}
        maxLength={MAX_CHARS}
        className="w-full bg-transparent text-white text-sm placeholder-zinc-600 resize-none focus:outline-none leading-relaxed"
      />
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
        <span className={`text-xs ${content.length > MAX_CHARS * 0.9 ? "text-amber-400" : "text-zinc-600"}`}>
          {MAX_CHARS - content.length} left
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setOpen(false); setContent(""); }}
            className="px-4 py-1.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-4 py-1.5 rounded-xl text-sm font-medium bg-white text-black hover:bg-zinc-100 transition-colors disabled:opacity-40"
          >
            {loading ? "Dropping..." : "Drop it"}
          </button>
        </div>
      </div>
    </form>
  );
}
