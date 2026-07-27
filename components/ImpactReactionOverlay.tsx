"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MessageType, ReactionId, ReactionPayload } from "@/lib/protocol";

const REACTIONS: { id: ReactionId; emoji: string; label: string }[] = [
  { id: "boom", emoji: "💥", label: "Boom" },
  { id: "wow", emoji: "😮", label: "Wow" },
  { id: "lol", emoji: "😂", label: "LOL" },
  { id: "heart", emoji: "❤️", label: "Love it" },
  { id: "fire", emoji: "🔥", label: "Fire" },
];

type Pop = { id: string; reactionId: ReactionId };

export default function ImpactReactionOverlay({
  sendMessage,
  subscribe,
}: {
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
}) {
  const [pops, setPops] = useState<Pop[]>([]);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    return subscribe("reaction", (msg) => {
      const { reactionId } = msg.payload as ReactionPayload;
      const pop: Pop = { id: `${Date.now()}-${Math.random()}`, reactionId };
      setPops((prev) => [...prev, pop]);
      setShakeKey((k) => k + 1);
      window.setTimeout(() => {
        setPops((prev) => prev.filter((p) => p.id !== pop.id));
      }, 1400);
    });
  }, [subscribe]);

  function fire(reactionId: ReactionId) {
    sendMessage<ReactionPayload>("reaction", { reactionId });
  }

  return (
    <>
      {/* Screen-shake wrapper — re-keying triggers a fresh jitter animation
          each time a reaction lands, instead of a floating emoji drifting up. */}
      <motion.div
        key={shakeKey}
        animate={
          shakeKey > 0
            ? { x: [0, -6, 6, -4, 4, -2, 0], y: [0, 3, -3, 2, -2, 1, 0] }
            : {}
        }
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 z-40"
      >
        <AnimatePresence>
          {pops.map((pop) => {
            const meta = REACTIONS.find((r) => r.id === pop.reactionId)!;
            return (
              <motion.div
                key={pop.id}
                initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 320, damping: 14 }}
                className="glass neon-halo absolute left-1/2 top-1/3 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-3xl px-8 py-6"
              >
                <span className="text-5xl">{meta.emoji}</span>
                <span className="text-sm font-semibold tracking-wide text-[var(--foreground)]">
                  {meta.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center justify-center gap-2">
        {REACTIONS.map((r) => (
          <button
            key={r.id}
            onClick={() => fire(r.id)}
            className="rounded-full bg-[var(--card-solid)] px-3 py-2 text-lg ring-1 ring-[var(--border)] transition hover:scale-110"
            aria-label={`Send ${r.label} reaction`}
          >
            {r.emoji}
          </button>
        ))}
      </div>
    </>
  );
}
