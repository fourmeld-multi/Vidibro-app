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

export default function VibeRoomPage() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <VrHubBg />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-8 pb-12" style={{ position: "relative", zIndex: 1 }}>

        {/* Back nav */}
        <div className="mb-10">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">← Vidibro</Link>
        </div>

        {/* ═══ HERO ═══════════════════════════════════════════ */}
        <div className="text-center mb-10">
          {/* live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.28)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(52,211,153,.9)" }}>1,046 people vibing right now</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black tracking-tight mb-3">
            Vibe Room <span style={{ background: "linear-gradient(90deg,#a78bfa,#ec4899,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦</span>
          </h1>
          <p className="text-base leading-relaxed mx-auto mb-6" style={{ color: "rgba(255,255,255,.48)", maxWidth: 300 }}>
            Play games, drop anonymous secrets &amp; vibe late-night with strangers. No signup. No pressure.
          </p>

          {/* Feature pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {["🎮 Mini games", "💌 Anonymous", "🌙 Late-night", "⚡ No login"].map((f) => (
              <span key={f} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.55)" }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ CARDS ═══════════════════════════════════════════ */}
        <div className="flex flex-col gap-4">

          {/* ── PLAY ZONE ── emerald */}
          <Link href="/vibe-room/play-zone" className="block group" style={{ borderRadius: 24 }}>
            <div style={{ background: "linear-gradient(145deg,#064e3b 0%,#065f46 45%,#047857 100%)", borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 8px 40px rgba(5,150,105,.22)" }}>
              {/* ghosted bg icon */}
              <div style={{ position: "absolute", right: -12, bottom: -20, fontSize: 130, opacity: 0.09, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>🎮</div>
              {/* shine top */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)" }} />

              <div style={{ padding: "22px 22px 20px" }}>
                {/* header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 26 }}>🎮</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>Play Zone</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 2 }}>1v1 icebreaker mini-games</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.12)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7", boxShadow: "0 0 5px #6ee7b7", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.75)", fontWeight: 600 }}>1,046</span>
                  </div>
                </div>

                {/* game tiles */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
                  {GAMES.map((g) => (
                    <div key={g.n} style={{ borderRadius: 14, padding: "12px 4px 10px", textAlign: "center", background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.1)" }}>
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{g.e}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,.6)", lineHeight: 1.3, fontWeight: 500 }}>{g.n}</div>
                    </div>
                  ))}
                </div>

                {/* cta */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>No downloads · No login needed</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>Play Now <span style={{ fontSize: 14 }}>→</span></span>
                </div>
              </div>
            </div>
          </Link>

          {/* ── SECRET DROP ── rose */}
          <Link href="/vibe-room/secret-drop" className="block group" style={{ borderRadius: 24 }}>
            <div style={{ background: "linear-gradient(145deg,#4c0519 0%,#881337 45%,#9f1239 100%)", borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 8px 40px rgba(159,18,57,.24)" }}>
              <div style={{ position: "absolute", right: -12, bottom: -20, fontSize: 130, opacity: 0.09, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>💌</div>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)" }} />

              <div style={{ padding: "22px 22px 20px" }}>
                {/* header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 26 }}>💌</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>Secret Drop</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 2 }}>Drop secrets · React · Find your crash</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "5px 10px", borderRadius: 20, background: "rgba(0,0,0,.22)", color: "rgba(255,255,255,.75)", border: "1px solid rgba(255,255,255,.12)" }}>Anonymous</span>
                </div>

                {/* mock post */}
                <div style={{ borderRadius: 14, padding: "12px 14px", background: "rgba(0,0,0,.25)", border: "1px solid rgba(255,255,255,.1)", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>💌</span>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.55, margin: 0 }}>
                      &quot;I actually have feelings for my best friend&apos;s ex and it&apos;s been eating me alive...&quot;
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 11, color: "rgba(252,165,165,.8)" }}>🚩 32</span>
                    <span style={{ fontSize: 11, color: "rgba(134,239,172,.8)" }}>🟩 156</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>💬 14</span>
                  </div>
                </div>

                {/* find your crash */}
                <div style={{ borderRadius: 14, padding: "10px 14px", background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>💘</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Find Your Crash</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>Heart-to-heart anonymous chat</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,.45)" }}>→</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>No names, no shame</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>Enter <span style={{ fontSize: 14 }}>→</span></span>
                </div>
              </div>
            </div>
          </Link>

          {/* ── NIGHT OWL ── indigo */}
          <Link href="/vibe-room/night-owl" className="block group" style={{ borderRadius: 24 }}>
            <div style={{ background: "linear-gradient(145deg,#1e1b4b 0%,#312e81 45%,#3730a3 100%)", borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 8px 40px rgba(55,48,163,.28)" }}>
              <div style={{ position: "absolute", right: -12, bottom: -20, fontSize: 130, opacity: 0.09, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>🌙</div>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)" }} />

              <div style={{ padding: "22px 22px 20px" }}>
                {/* header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 26 }}>🌙</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>Night Owl</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 2 }}>Late-night chill + flirt zone</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20, background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.12)" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a5b4fc", boxShadow: "0 0 5px #a5b4fc", display: "inline-block" }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.75)", fontWeight: 600 }}>Live</span>
                  </div>
                </div>

                {/* mood chips */}
                <div className="scrollbar-none" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
                  {[
                    { e: "😔", l: "Sad" }, { e: "😴", l: "Boring" }, { e: "💕", l: "Romantic" },
                    { e: "😌", l: "Chill" }, { e: "😏", l: "Flirty" },
                  ].map((m) => (
                    <div key={m.l} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 20, background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.14)", color: "rgba(255,255,255,.75)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                      <span>{m.e}</span><span>{m.l}</span>
                    </div>
                  ))}
                </div>

                {/* private mood chat */}
                <div style={{ borderRadius: 14, padding: "10px 14px", background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>🦉 Private Mood Chat — matched 1-on-1</span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 20, background: "rgba(165,180,252,.2)", color: "#c7d2fe", border: "1px solid rgba(165,180,252,.3)" }}>NEW</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,.38)" }}>Pick your mood · find your match</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 4 }}>Enter <span style={{ fontSize: 14 }}>→</span></span>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </main>
    </div>
  );
}
