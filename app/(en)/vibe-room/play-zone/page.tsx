import Link from "next/link";

const GAMES = [
  {
    href: "/vibe-room/play-zone/tic-tac-toe",
    illus: "⭕",
    name: "Tic-Tac-Toe",
    category: "CLASSIC",
    desc: "X vs O battle with a stranger. Quick and addictive.",
    online: 284,
    grad: "linear-gradient(145deg,#f59e0b 0%,#fbbf24 60%,#fde68a 100%)",
    textDark: true,
    glow: "rgba(245,158,11,.28)",
  },
  {
    href: "/vibe-room/play-zone/battleship",
    illus: "🚢",
    name: "Battleship",
    category: "STRATEGY",
    desc: "Drop bombs, sink fleets. No mercy on the high seas.",
    online: 157,
    grad: "linear-gradient(145deg,#be185d 0%,#db2777 55%,#f472b6 100%)",
    textDark: false,
    glow: "rgba(219,39,119,.28)",
  },
  {
    href: "/vibe-room/play-zone/dino-race",
    illus: "🦕",
    name: "Dino Race",
    category: "RUNNER",
    desc: "Race a stranger. Jump obstacles, outlast them.",
    online: 512,
    grad: "linear-gradient(145deg,#0e7490 0%,#0284c7 55%,#38bdf8 100%)",
    textDark: false,
    glow: "rgba(2,132,199,.28)",
  },
  {
    href: "/vibe-room/play-zone/pen-fight",
    illus: "✏️",
    name: "Pen Fight",
    category: "PHYSICS",
    desc: "Flick your pen to knock the opponent's off the desk. First to 3 wins.",
    online: 389,
    grad: "linear-gradient(145deg,#14532d 0%,#166534 55%,#22c55e 100%)",
    textDark: false,
    glow: "rgba(22,101,52,.32)",
  },
];

const GEO_DECO = [
  { x:3,  y:10, s:16, op:.08 }, { x:9,  y:62, s:11, op:.06 },
  { x:18, y:32, s:8,  op:.07 }, { x:78, y:12, s:10, op:.07 },
  { x:85, y:58, s:14, op:.05 }, { x:93, y:28, s:8,  op:.08 },
];

export default function PlayZonePage() {
  const fg      = (dark: boolean) => dark ? "#1c1c1c" : "#fff";
  const fgSub   = (dark: boolean) => dark ? "rgba(0,0,0,.52)" : "rgba(255,255,255,.68)";
  const badgeBg = (dark: boolean) => dark ? "rgba(0,0,0,.13)" : "rgba(255,255,255,.18)";

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: "linear-gradient(160deg,#060d20 0%,#0a1535 50%,#071228 100%)" }}>
      <main className="flex-1 w-full">

        {/* breadcrumb + header */}
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <Link href="/vibe-room" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
              ← Vibe Room
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-sm text-white font-medium">🎮 Play Zone</span>
          </div>
          <h1 className="text-3xl font-black mb-1 tracking-tight">Play Zone</h1>
          <p className="text-zinc-500 text-sm">Pick a game. Challenge a stranger. No downloads, no login.</p>
        </div>

        {/* ── GAMING ABOUT SECTION ── same bg, just a subtle border separator */}
        <div style={{
          borderTop: "1px solid rgba(59,130,246,.1)",
          borderBottom: "1px solid rgba(59,130,246,.1)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* geometric decorations */}
          {GEO_DECO.map((d, i) => (
            <div key={i} style={{ position:"absolute", left:`${d.x}%`, top:`${d.y}%`, width:d.s, height:d.s, border:`1.5px solid rgba(59,130,246,${d.op})`, borderRadius:3, transform:"rotate(30deg)", pointerEvents:"none" }} />
          ))}
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(59,130,246,.06) 1px,transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }} />

          <div className="max-w-2xl mx-auto px-4 py-9 flex items-center gap-4" style={{ position:"relative", zIndex:1 }}>
            {/* left */}
            <div style={{ flex:"1 1 55%" }}>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:"0.14em", color:"#3b82f6", marginBottom:6, textTransform:"uppercase" }}>About Play Zone</div>
              <h2 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:6, lineHeight:1.2 }}>Challenge. Beat. Repeat.</h2>
              <div style={{ width:36, height:3, background:"linear-gradient(90deg,#3b82f6,#06b6d4)", borderRadius:4, marginBottom:18 }} />
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:4 }}>1v1 Battles with Strangers</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.42)", lineHeight:1.65 }}>
                  Go head-to-head with random players worldwide. Every match is a new opponent, a new story, a new chance to win.
                </div>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff", marginBottom:4 }}>No Downloads. No Login.</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,.42)", lineHeight:1.65 }}>
                  Jump straight into the action — no friction, no accounts. Play instantly right in your browser.
                </div>
              </div>
            </div>
            {/* right */}
            <div style={{ flex:"1 1 42%", display:"flex", justifyContent:"center", alignItems:"center", position:"relative", minHeight:170 }}>
              <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.15) 0%,transparent 70%)" }} />
              <span style={{ fontSize:90, filter:"drop-shadow(0 10px 30px rgba(59,130,246,.4))", userSelect:"none", lineHeight:1, position:"relative", zIndex:1 }}>🎮</span>
              <div style={{ position:"absolute", top:"8%", right:"4%", padding:"4px 10px", borderRadius:20, background:"rgba(59,130,246,.14)", border:"1px solid rgba(59,130,246,.28)", fontSize:9, fontWeight:700, color:"#93c5fd" }}>1,046 online</div>
              <div style={{ position:"absolute", bottom:"10%", left:"2%", padding:"4px 10px", borderRadius:20, background:"rgba(6,182,212,.1)", border:"1px solid rgba(6,182,212,.24)", fontSize:9, fontWeight:700, color:"#67e8f9" }}>4 games</div>
            </div>
          </div>
        </div>

        {/* ── GAME CARDS GRID ── */}
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-12">
          {/* cap grid so cards aren't huge on wide screens */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14, maxWidth:520, margin:"0 auto" }}>
            {GAMES.map((g) => (
              <Link key={g.href} href={g.href} style={{ display:"block", borderRadius:20 }}>
                <div style={{
                  background: g.grad,
                  borderRadius: 20,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: "1 / 1",
                  boxShadow: `0 6px 28px ${g.glow}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "14px 14px 16px",
                }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.32),transparent)" }} />

                  {/* top */}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.11em", padding:"3px 8px", borderRadius:20, background:badgeBg(g.textDark), color:fgSub(g.textDark), textTransform:"uppercase" }}>
                      {g.category}
                    </span>
                    <span style={{ fontSize:9, fontWeight:600, color:fgSub(g.textDark) }}>{g.online} playing</span>
                  </div>

                  {/* center illustration */}
                  <div style={{ textAlign:"center", lineHeight:1, userSelect:"none", pointerEvents:"none" }}>
                    <span style={{ fontSize:60, filter:`drop-shadow(0 8px 18px rgba(0,0,0,.25))` }}>{g.illus}</span>
                  </div>

                  {/* bottom */}
                  <div>
                    <div style={{ fontSize:16, fontWeight:900, color:fg(g.textDark), marginBottom:3, letterSpacing:"-0.2px" }}>{g.name}</div>
                    <div style={{ fontSize:10, color:fgSub(g.textDark), lineHeight:1.5, marginBottom:11 }}>{g.desc}</div>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"6px 14px", borderRadius:50, background:g.textDark ? "rgba(0,0,0,.16)" : "rgba(255,255,255,.2)", border:`1px solid ${g.textDark ? "rgba(0,0,0,.14)" : "rgba(255,255,255,.22)"}`, fontSize:10, fontWeight:800, color:fg(g.textDark) }}>
                      Play →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
