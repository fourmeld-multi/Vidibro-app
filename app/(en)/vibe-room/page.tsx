import Link from "next/link";
import type { Metadata } from "next";
import VrHubBg from "@/components/vibe-room/VrHubBg";

export const metadata: Metadata = {
  title: "Vibe Room — Vidibro",
  description: "Play games, drop secrets, and vibe late night — all anonymous.",
};

const GAMES = [
  { e: "⭕", n: "Tic-Tac-Toe", p: 284, col: "rgba(248,113,113,.2)",  dot: "#f87171" },
  { e: "🚢", n: "Battleship",   p: 157, col: "rgba(96,165,250,.2)",   dot: "#60a5fa" },
  { e: "🧱", n: "Stacktris",    p: 93,  col: "rgba(251,146,60,.2)",   dot: "#f59e0b" },
  { e: "🦕", n: "Dino Race",    p: 512, col: "rgba(52,211,153,.2)",   dot: "#34d399" },
];

const MOODS = [
  { e: "😔", l: "Sad",      bg: "rgba(96,165,250,.14)",  c: "rgba(96,165,250,.8)"  },
  { e: "😴", l: "Boring",   bg: "rgba(251,191,36,.12)",  c: "rgba(251,191,36,.8)"  },
  { e: "💕", l: "Romantic", bg: "rgba(251,113,133,.14)", c: "rgba(251,113,133,.8)" },
  { e: "😌", l: "Chill",    bg: "rgba(52,211,153,.12)",  c: "rgba(52,211,153,.8)"  },
  { e: "😏", l: "Flirty",   bg: "rgba(196,181,253,.14)", c: "rgba(196,181,253,.8)" },
];

export default function VibeRoomPage() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <VrHubBg />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10" style={{ position: "relative", zIndex: 1 }}>

        <div className="mb-8">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Vidibro
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-end gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tight">Vibe Room</h1>
            <div className="flex items-center gap-1.5 mb-1" style={{ padding: "3px 10px 3px 8px", borderRadius: 20, background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.28)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 7px #34d399", display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(52,211,153,.9)", letterSpacing: "0.06em" }}>LIVE</span>
            </div>
          </div>
          <p className="text-zinc-500 text-sm">Games. Secrets. Late-night energy. All anonymous.</p>
        </div>

        <div className="flex flex-col gap-4">

          {/* ═══ PLAY ZONE ═══════════════════════════════════ */}
          <Link href="/vibe-room/play-zone" className="block group" style={{ borderRadius: 24 }}>
            <div style={{ background: "linear-gradient(145deg,#051a0e 0%,#061510 60%,#030c08 100%)", border: "1px solid rgba(52,211,153,.22)", borderRadius: 24, overflow: "hidden", position: "relative" }}>
              {/* top-left corner glow */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at -10% 0%, rgba(52,211,153,.18) 0%, transparent 100%)", pointerEvents: "none" }} />

              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🎮</span>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(52,211,153,.9)", textTransform: "uppercase" }}>Play Zone</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "rgba(52,211,153,.55)" }}>1,046 playing</span>
                  </div>
                </div>

                {/* Game tiles — each unique color */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
                  {GAMES.map((g) => (
                    <div key={g.n} style={{ borderRadius: 14, padding: "12px 4px 10px", textAlign: "center", background: g.col, border: `1px solid ${g.dot}40` }}>
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{g.e}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", lineHeight: 1.3, fontWeight: 500 }}>{g.n}</div>
                      <div style={{ fontSize: 9, color: g.dot, marginTop: 4, fontWeight: 600, opacity: 0.9 }}>{g.p}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)" }}>1v1 icebreaker games · No login</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(52,211,153,.85)" }}>Play →</span>
                </div>
              </div>
            </div>
          </Link>

          {/* ═══ SECRET DROP ═════════════════════════════════ */}
          <Link href="/vibe-room/secret-drop" className="block group" style={{ borderRadius: 24 }}>
            <div style={{ background: "linear-gradient(145deg,#140408 0%,#0e0306 60%,#0a0205 100%)", border: "1px solid rgba(190,18,60,.24)", borderRadius: 24, overflow: "hidden", position: "relative" }}>
              {/* top-right corner glow */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 110% 0%, rgba(190,18,60,.2) 0%, transparent 100%)", pointerEvents: "none" }} />

              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>💌</span>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(251,113,133,.9)", textTransform: "uppercase" }}>Secret Drop</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "rgba(190,18,60,.15)", color: "rgba(251,113,133,.75)", border: "1px solid rgba(190,18,60,.28)" }}>Anonymous</span>
                </div>

                {/* Mock secret post */}
                <div style={{ borderRadius: 16, padding: "14px", background: "rgba(190,18,60,.09)", border: "1px solid rgba(190,18,60,.18)", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>💌</span>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.62)", lineHeight: 1.55, margin: 0 }}>
                      "I actually have feelings for my best friend&apos;s ex and it&apos;s been eating me alive for months..."
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ fontSize: 11, color: "rgba(248,113,113,.75)" }}>🚩 32</span>
                    <span style={{ fontSize: 11, color: "rgba(74,222,128,.75)" }}>🟩 156</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)" }}>💬 14</span>
                  </div>
                </div>

                {/* Find Your Crash row */}
                <div style={{ borderRadius: 16, padding: "12px 14px", background: "linear-gradient(135deg,rgba(190,18,60,.22) 0%,rgba(120,8,36,.18) 100%)", border: "1px solid rgba(255,100,130,.16)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>💘</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Find Your Crash</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>Heart-to-heart anonymous chat</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16, color: "rgba(251,113,133,.5)" }}>→</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)" }}>No names, no shame</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(251,113,133,.85)" }}>Enter →</span>
                </div>
              </div>
            </div>
          </Link>

          {/* ═══ NIGHT OWL ═══════════════════════════════════ */}
          <Link href="/vibe-room/night-owl" className="block group" style={{ borderRadius: 24 }}>
            <div style={{ background: "linear-gradient(145deg,#030510 0%,#050819 60%,#020410 100%)", border: "1px solid rgba(99,102,241,.22)", borderRadius: 24, overflow: "hidden", position: "relative" }}>
              {/* top-centre glow */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 45% at 50% -10%, rgba(99,102,241,.18) 0%, transparent 100%)", pointerEvents: "none" }} />

              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🌙</span>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", color: "rgba(165,180,252,.9)", textTransform: "uppercase" }}>Night Owl</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 6px #818cf8", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "rgba(165,180,252,.5)" }}>Late-night vibes</span>
                  </div>
                </div>

                {/* Mood chips — single scrollable row */}
                <div className="scrollbar-none" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
                  {MOODS.map((m) => (
                    <div key={m.l} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 20, background: m.bg, border: `1px solid ${m.c.replace(".8)", ".22)")}`, color: m.c, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <span>{m.e}</span>
                      <span>{m.l}</span>
                    </div>
                  ))}
                </div>

                {/* Private Mood Chat row */}
                <div style={{ borderRadius: 16, padding: "12px 14px", background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>🦉 Private Mood Chat</span>
                    <span style={{ fontSize: 10, color: "rgba(165,180,252,.4)", marginLeft: 8 }}>matched 1-on-1</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: "rgba(99,102,241,.2)", color: "rgba(165,180,252,.9)", border: "1px solid rgba(99,102,241,.3)" }}>NEW</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.28)" }}>Pick your mood · find your match</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(165,180,252,.85)" }}>Enter →</span>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
