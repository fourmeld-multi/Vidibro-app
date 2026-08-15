import Link from "next/link";
import type { Metadata } from "next";
import VrHubBg from "@/components/vibe-room/VrHubBg";

export const metadata: Metadata = {
  title: "Vibe Room — Vidibro",
  description: "Play games, drop secrets, and vibe late night — all anonymous.",
};

const GAMES = [
  { e: "⭕", n: "Tic-Tac-Toe" },
  { e: "🚢", n: "Battleship" },
  { e: "🧱", n: "Stacktris" },
  { e: "🦕", n: "Dino Race" },
];

const MOODS = [
  { e: "😔", l: "Sad",      bg: "rgba(96,165,250,.13)",  c: "rgba(96,165,250,.65)"  },
  { e: "😴", l: "Boring",   bg: "rgba(251,191,36,.11)",  c: "rgba(251,191,36,.65)"  },
  { e: "💕", l: "Romantic", bg: "rgba(251,113,133,.13)", c: "rgba(251,113,133,.65)" },
  { e: "😌", l: "Chill",    bg: "rgba(52,211,153,.11)",  c: "rgba(52,211,153,.65)"  },
  { e: "😏", l: "Flirty",   bg: "rgba(196,181,253,.13)", c: "rgba(196,181,253,.65)" },
];

export default function VibeRoomPage() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <VrHubBg />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10" style={{ position: "relative", zIndex: 1 }}>

        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Vidibro
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Vibe Room</h1>
            <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full" style={{ background: "rgba(139,92,246,.15)", color: "rgba(167,139,250,.9)", border: "1px solid rgba(139,92,246,.25)" }}>LIVE</span>
          </div>
          <p className="text-zinc-400">Games. Secrets. Late-night energy. All anonymous.</p>
        </div>

        <div className="flex flex-col gap-4">

          {/* ── Play Zone ─────────────────────────────────── */}
          <Link
            href="/vibe-room/play-zone"
            className="block rounded-3xl overflow-hidden group hover:shadow-[0_0_50px_rgba(52,211,153,.10)] transition-shadow duration-300"
            style={{ background: "linear-gradient(140deg,#061410 0%,#0b1d12 100%)", border: "1px solid rgba(52,211,153,.18)" }}
          >
            <div className="p-5" style={{ position: "relative" }}>
              <div style={{ position: "absolute", right: -10, top: -16, fontSize: 110, opacity: .06, lineHeight: 1, transform: "rotate(-12deg)", pointerEvents: "none", userSelect: "none" }}>🎮</div>

              {/* header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎮</span>
                  <span className="text-xs font-black tracking-[.14em] uppercase" style={{ color: "rgba(52,211,153,.85)" }}>Play Zone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399" }} />
                  <span className="text-[11px]" style={{ color: "rgba(52,211,153,.55)" }}>1,046 playing</span>
                </div>
              </div>

              {/* game tiles */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {GAMES.map((g) => (
                  <div key={g.n} className="rounded-2xl py-3 px-1 text-center group-hover:scale-[1.03] transition-transform duration-200" style={{ background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.10)" }}>
                    <div className="text-2xl mb-1.5">{g.e}</div>
                    <div className="text-[9px] leading-tight font-medium" style={{ color: "rgba(255,255,255,.4)" }}>{g.n}</div>
                  </div>
                ))}
              </div>

              {/* footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>1v1 icebreaker mini-games · No login</span>
                <span className="text-xs font-bold group-hover:translate-x-1 transition-transform duration-200" style={{ color: "rgba(52,211,153,.8)" }}>Play →</span>
              </div>
            </div>
          </Link>

          {/* ── Secret Drop ───────────────────────────────── */}
          <Link
            href="/vibe-room/secret-drop"
            className="block rounded-3xl overflow-hidden group hover:shadow-[0_0_50px_rgba(190,18,60,.10)] transition-shadow duration-300"
            style={{ background: "linear-gradient(140deg,#110406 0%,#190709 100%)", border: "1px solid rgba(190,18,60,.2)" }}
          >
            <div className="p-5" style={{ position: "relative" }}>
              <div style={{ position: "absolute", right: -10, top: -14, fontSize: 110, opacity: .06, lineHeight: 1, transform: "rotate(8deg)", pointerEvents: "none", userSelect: "none" }}>💌</div>

              {/* header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💌</span>
                  <span className="text-xs font-black tracking-[.14em] uppercase" style={{ color: "rgba(251,113,133,.85)" }}>Secret Drop</span>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(190,18,60,.14)", color: "rgba(251,113,133,.7)", border: "1px solid rgba(190,18,60,.22)" }}>Anonymous</span>
              </div>

              {/* 2 sub-modes side by side */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-2xl p-3.5" style={{ background: "rgba(190,18,60,.08)", border: "1px solid rgba(190,18,60,.14)" }}>
                  <div className="text-2xl mb-2">💌</div>
                  <div className="text-sm font-semibold text-white mb-0.5">Secret Msg Drop</div>
                  <div className="text-[10px]" style={{ color: "rgba(255,255,255,.35)" }}>Drop a secret · React · Chat</div>
                </div>
                <div className="rounded-2xl p-3.5 group-hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg,rgba(190,18,60,.28) 0%,rgba(120,8,36,.28) 100%)", border: "1px solid rgba(255,100,130,.18)" }}>
                  <div className="text-2xl mb-2">💘</div>
                  <div className="text-sm font-semibold text-white mb-0.5">Find Your Crash</div>
                  <div className="text-[10px]" style={{ color: "rgba(255,255,255,.35)" }}>Heart-to-heart · Anonymous</div>
                </div>
              </div>

              {/* footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>No names, no shame</span>
                <span className="text-xs font-bold group-hover:translate-x-1 transition-transform duration-200" style={{ color: "rgba(251,113,133,.8)" }}>Enter →</span>
              </div>
            </div>
          </Link>

          {/* ── Night Owl ─────────────────────────────────── */}
          <Link
            href="/vibe-room/night-owl"
            className="block rounded-3xl overflow-hidden group hover:shadow-[0_0_50px_rgba(99,102,241,.10)] transition-shadow duration-300"
            style={{ background: "linear-gradient(140deg,#04050f 0%,#080a1c 100%)", border: "1px solid rgba(99,102,241,.2)" }}
          >
            <div className="p-5" style={{ position: "relative" }}>
              <div style={{ position: "absolute", right: -10, top: -14, fontSize: 110, opacity: .06, lineHeight: 1, transform: "rotate(-6deg)", pointerEvents: "none", userSelect: "none" }}>🌙</div>

              {/* header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌙</span>
                  <span className="text-xs font-black tracking-[.14em] uppercase" style={{ color: "rgba(165,180,252,.85)" }}>Night Owl</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "inline-block", boxShadow: "0 0 6px #818cf8" }} />
                  <span className="text-[11px]" style={{ color: "rgba(165,180,252,.5)" }}>Late-night vibes</span>
                </div>
              </div>

              {/* mood chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {MOODS.map((m) => (
                  <div key={m.l} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: m.bg, border: `1px solid ${m.c.replace(".65)", ".22)")}`, color: m.c }}>
                    <span>{m.e}</span>
                    <span>{m.l}</span>
                  </div>
                ))}
              </div>

              {/* private chat teaser */}
              <div className="rounded-2xl px-4 py-2.5 mb-4 flex items-center justify-between" style={{ background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.13)" }}>
                <div>
                  <span className="text-xs font-semibold text-white">🦉 Private Mood Chat</span>
                  <span className="text-[10px] ml-2" style={{ color: "rgba(165,180,252,.5)" }}>get matched 1-on-1</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,.18)", color: "rgba(165,180,252,.8)", border: "1px solid rgba(99,102,241,.25)" }}>NEW</span>
              </div>

              {/* footer */}
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>Pick your mood · find your match</span>
                <span className="text-xs font-bold group-hover:translate-x-1 transition-transform duration-200" style={{ color: "rgba(165,180,252,.8)" }}>Enter →</span>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
