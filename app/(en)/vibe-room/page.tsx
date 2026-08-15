import Link from "next/link";
import type { Metadata } from "next";
import VrHubBg from "@/components/vibe-room/VrHubBg";

export const metadata: Metadata = {
  title: "Vibe Room — Vidibro",
  description: "Play games, drop secrets, and vibe late night — all anonymous.",
};

const ZONES = [
  {
    href: "/vibe-room/play-zone",
    icon: "🎮",
    name: "PlayZone",
    tag: "1v1 icebreaker mini-games",
    desc: "Challenge a stranger to Tic-Tac-Toe, Battleship, or Stacktris. Chat and react while you play.",
    pills: ["Tic-Tac-Toe", "Battleship", "Stacktris", "Live reactions"],
    color: "from-emerald-500/10 to-transparent",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    href: "/vibe-room/secret-drop",
    icon: "💌",
    name: "Secret Drop",
    tag: "Anonymous crush board",
    desc: "Post anonymous crush stories. React with red or green flags. Slide into DMs from any post.",
    pills: ["🚩 Red flag", "🟩 Green flag", "DM from post", "Text-only"],
    color: "from-pink-500/10 to-transparent",
    border: "border-pink-500/20",
    iconBg: "bg-pink-500/10 text-pink-400",
    authNote: "Sign in to post or reply",
  },
  {
    href: "/vibe-room/night-owl",
    icon: "🌙",
    name: "Night Owl",
    tag: "Late-night chill + flirt zone",
    desc: "Dark-themed rooms with mood toggle. Prompt cards spark instant conversations.",
    pills: ["Late-night chill", "Flirt & banter", "Prompt cards", "Mood switcher"],
    color: "from-violet-500/10 to-transparent",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10 text-violet-400",
  },
];

export default function VibeRoomPage() {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <VrHubBg />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10" style={{ position:"relative", zIndex:1 }}>
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Vidibro
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Vibe Room</h1>
          <p className="text-zinc-400 text-base">Games. Secrets. Late-night energy. All anonymous.</p>
        </div>

        <div className="flex flex-col gap-4">
          {ZONES.map((zone) => (
            <Link
              key={zone.href}
              href={zone.href}
              className={`block rounded-2xl border ${zone.border} bg-gradient-to-br ${zone.color} bg-zinc-900/60 p-5 hover:bg-zinc-800/60 transition-colors group`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${zone.iconBg}`}>
                  {zone.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-lg">{zone.name}</span>
                    <span className="text-xs text-zinc-500">{zone.tag}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-3 leading-relaxed">{zone.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {zone.pills.map((p) => (
                      <span key={p} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {p}
                      </span>
                    ))}
                  </div>
                  {zone.authNote && (
                    <p className="text-xs text-zinc-600 mt-3 border-l-2 border-zinc-700 pl-2">{zone.authNote}</p>
                  )}
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors mt-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
