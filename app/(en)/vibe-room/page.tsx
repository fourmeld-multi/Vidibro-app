import Link from "next/link";
import type { Metadata } from "next";
import VrHubBg from "@/components/vibe-room/VrHubBg";

export const metadata: Metadata = {
  title: "Vibe Room — Vidibro",
  description: "Play games, drop secrets, and vibe late night — all anonymous.",
};

const CARDS = [
  {
    href: "/vibe-room/play-zone",
    icon: "🎮",
    illus: "🕹️",
    title: "Play Zone",
    desc: "Challenge a stranger to 1v1 mini-games. No downloads, no login needed.",
    cta: "Play Now",
    badge: "1,046 playing",
    badgeDot: "#6ee7b7",
    grad: "linear-gradient(135deg,#1e40af 0%,#2563eb 45%,#3b82f6 80%,#60a5fa 100%)",
    glow: "rgba(37,99,235,.32)",
    sparks: [
      { x: 72, y: 12, s: 13, op: 0.55 },
      { x: 88, y: 55, s: 9,  op: 0.35 },
      { x: 60, y: 80, s: 11, op: 0.4  },
      { x: 14, y: 70, s: 8,  op: 0.3  },
    ],
  },
  {
    href: "/vibe-room/secret-drop",
    icon: "💌",
    illus: "💝",
    title: "Secret Drop",
    desc: "Drop anonymous secrets, react to others & slide into DMs. No names, no shame.",
    cta: "Enter",
    badge: "Anonymous",
    badgeDot: "#f9a8d4",
    grad: "linear-gradient(135deg,#9d174d 0%,#db2777 45%,#ec4899 80%,#f472b6 100%)",
    glow: "rgba(219,39,119,.32)",
    sparks: [
      { x: 68, y: 10, s: 11, op: 0.5  },
      { x: 84, y: 60, s: 8,  op: 0.32 },
      { x: 55, y: 82, s: 13, op: 0.42 },
      { x: 10, y: 65, s: 9,  op: 0.28 },
    ],
  },
  {
    href: "/vibe-room/night-owl",
    icon: "🌙",
    illus: "🦉",
    title: "Night Owl",
    desc: "Pick your mood and get matched 1-on-1. Late-night energy only.",
    cta: "Enter",
    badge: "Live now",
    badgeDot: "#c4b5fd",
    grad: "linear-gradient(135deg,#4c1d95 0%,#6d28d9 45%,#7c3aed 80%,#a78bfa 100%)",
    glow: "rgba(109,40,217,.32)",
    sparks: [
      { x: 70, y: 8,  s: 10, op: 0.5  },
      { x: 86, y: 52, s: 7,  op: 0.3  },
      { x: 58, y: 78, s: 12, op: 0.4  },
      { x: 12, y: 68, s: 8,  op: 0.28 },
    ],
  },
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.28)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(52,211,153,.9)" }}>1,046 people vibing right now</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-3">
            Vibe Room <span style={{ background: "linear-gradient(90deg,#a78bfa,#ec4899,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✦</span>
          </h1>
          <p className="text-base leading-relaxed mx-auto mb-6" style={{ color: "rgba(255,255,255,.48)", maxWidth: 300 }}>
            Play games, drop anonymous secrets &amp; vibe late-night with strangers. No signup. No pressure.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {["🎮 Mini games", "💌 Anonymous", "🌙 Late-night", "⚡ No login"].map((f) => (
              <span key={f} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.55)" }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ CARDS ═══════════════════════════════════════════ */}
        <div className="flex flex-col gap-5">
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} style={{ borderRadius: 22, display: "block" }}>
              <div style={{
                background: c.grad,
                borderRadius: 22,
                overflow: "hidden",
                position: "relative",
                boxShadow: `0 10px 44px ${c.glow}`,
                minHeight: 148,
                display: "flex",
                alignItems: "stretch",
              }}>
                {/* top shine */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)", zIndex: 2 }} />

                {/* sparkle decorations */}
                {c.sparks.map((sp, i) => (
                  <div key={i} style={{ position: "absolute", left: `${sp.x}%`, top: `${sp.y}%`, fontSize: sp.s, opacity: sp.op, color: "#fff", pointerEvents: "none", userSelect: "none", zIndex: 2 }}>✦</div>
                ))}

                {/* subtle dot pattern overlay */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: "22px 22px", zIndex: 1 }} />

                {/* left: text content */}
                <div style={{ flex: 1, padding: "26px 0 26px 26px", position: "relative", zIndex: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: "62%" }}>
                  {/* top: icon + badge */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 20 }}>{c.icon}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, background: "rgba(0,0,0,.22)", border: "1px solid rgba(255,255,255,.18)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.badgeDot, display: "inline-block" }} />
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,.85)", fontWeight: 600 }}>{c.badge}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 7, letterSpacing: "-0.3px", lineHeight: 1.15 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,.72)", lineHeight: 1.55, marginBottom: 18 }}>{c.desc}</div>
                  </div>

                  {/* CTA button — yellow pill */}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "9px 20px", borderRadius: 50, background: "#fcd34d", color: "#1c1c1c", fontSize: 12, fontWeight: 800, width: "fit-content", boxShadow: "0 3px 12px rgba(0,0,0,.2)" }}>
                    {c.cta} →
                  </div>
                </div>

                {/* right: large illustration emoji */}
                <div style={{ width: 150, position: "relative", flexShrink: 0, overflow: "visible", zIndex: 3 }}>
                  <div style={{
                    position: "absolute",
                    right: -8,
                    bottom: -10,
                    fontSize: 115,
                    lineHeight: 1,
                    filter: "drop-shadow(0 8px 24px rgba(0,0,0,.3))",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}>
                    {c.illus}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
