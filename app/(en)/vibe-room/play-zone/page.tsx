import Link from "next/link";

const GAMES = [
  {
    href: "/vibe-room/play-zone/tic-tac-toe",
    emoji: "⭕",
    name: "Tic-Tac-Toe",
    desc: "Spend time with a stranger over a quick game of X vs O. Simple, fun, addictive.",
    tags: ["1 player", "quick"],
    online: 284,
    ready: true,
  },
  {
    href: "/vibe-room/play-zone/battleship",
    emoji: "🚢",
    name: "Battleship",
    desc: "Spend time with a stranger on the high seas. Drop bombs, sink fleets, no mercy.",
    tags: ["strategy", "2 min"],
    online: 157,
    ready: true,
  },
  {
    href: "/vibe-room/play-zone/stacktris",
    emoji: "🧱",
    name: "Stacktris",
    desc: "Stack tiles before the grid fills up.",
    tags: ["puzzle", "solo", "chill"],
    online: 93,
    ready: true,
  },
  {
    href: "/vibe-room/play-zone/dino-race",
    emoji: "🦕",
    name: "Dino Race",
    desc: "Spend time racing a stranger. Jump over obstacles, outlast each other — higher score wins.",
    tags: ["runner", "vs stranger", "endless"],
    online: 512,
    ready: true,
  },
];

export default function PlayZonePage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/vibe-room" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Vibe Room
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-medium">🎮 Play Zone</span>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-bold mb-1">Play Zone</h1>
          <p className="text-zinc-500 text-sm">Mini-games. No downloads. No login needed to play.</p>
        </div>

        <div className="flex flex-col gap-3">
          {GAMES.map((g) => (
            <div
              key={g.href}
              className={`group bg-zinc-900 border rounded-2xl p-5 transition-colors ${
                g.ready
                  ? "border-zinc-800 hover:border-zinc-600 cursor-pointer"
                  : "border-zinc-900 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl mt-0.5">{g.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold text-white text-base">{g.name}</h2>
                      {!g.ready && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 font-medium">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 mb-3">{g.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {g.tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[11px] text-zinc-600">
                    {g.online.toLocaleString()} playing
                  </span>
                  {g.ready ? (
                    <Link
                      href={g.href}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-black hover:bg-zinc-100 transition-colors"
                    >
                      Play
                    </Link>
                  ) : (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-zinc-800 text-zinc-600 cursor-not-allowed">
                      Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
