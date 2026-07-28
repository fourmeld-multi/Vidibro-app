"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";
import type { ChatPayload, MessageType } from "@/lib/protocol";

type ChatEntry = { id: string; text: string; mine: boolean };

export default function ChatDrawer({
  sendMessage,
  subscribe,
  connected,
}: {
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
  connected: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [unread, setUnread] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return subscribe("chat", (msg) => {
      const { text } = msg.payload as ChatPayload;
      setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, text, mine: false }]);
      if (!open) setUnread((u) => u + 1);
    });
  }, [subscribe, open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function toggleOpen() {
    setOpen((v) => !v);
    if (!open) setUnread(0);
  }

  function send() {
    const text = draft.trim();
    if (!text || !connected) return;
    sendMessage<ChatPayload>("chat", { text });
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, text, mine: true }]);
    setDraft("");
  }

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-5 right-5 z-30 flex h-12 w-12 items-center justify-center rounded-full btn-gradient text-black/80 shadow-lg"
        aria-label="Toggle chat"
      >
        <MessageSquare size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="glass fixed bottom-20 right-5 z-30 flex h-96 w-80 flex-col rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <span className="text-sm font-semibold text-[var(--foreground)]">Chat</span>
              <button onClick={toggleOpen} aria-label="Close chat">
                <X size={16} className="text-[var(--muted)]" />
              </button>
            </div>
            <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {messages.length === 0 && (
                <p className="pt-6 text-center text-xs text-[var(--muted)]">
                  {connected ? "Say hi 👋" : "Waiting to connect to a stranger…"}
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-xl px-3 py-1.5 text-sm ${
                    m.mine
                      ? "ml-auto btn-gradient text-black/80"
                      : "bg-[var(--overlay-1)] text-[var(--foreground)]"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--border)] p-2.5">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={connected ? "Message the stranger…" : "Waiting to connect…"}
                maxLength={500}
                disabled={!connected}
                className="min-w-0 flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-sm outline-none focus:border-[var(--accent)] disabled:opacity-50"
              />
              <button
                onClick={send}
                disabled={!draft.trim() || !connected}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full btn-gradient text-black/80 disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
