"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/vibe-room/AuthModal";
import ZoneChat from "@/components/vibe-room/ZoneChat";
import type { VibeUser } from "@/lib/vibe-room/types";

const G = 8;
const COLS = ["A","B","C","D","E","F","G","H"];
const SHIPS = [
  { name: "Carrier",    size: 4, emoji: "🛳" },
  { name: "Cruiser",    size: 3, emoji: "🚢" },
  { name: "Submarine",  size: 3, emoji: "🤿" },
  { name: "Destroyer",  size: 2, emoji: "⚡" },
];
const TOTAL = SHIPS.reduce((s, sh) => s + sh.size, 0); // 12

type Cell = "empty" | "ship" | "hit" | "miss";
type Phase = "playing" | "player-wins" | "bot-wins";

function makeGrid(): Cell[] { return Array(G * G).fill("empty"); }

function placeRandom(grid: Cell[]): Cell[] {
  const g = [...grid];
  for (const ship of SHIPS) {
    let placed = false, tries = 0;
    while (!placed && tries++ < 500) {
      const horiz = Math.random() < 0.5;
      const row = Math.floor(Math.random() * (horiz ? G : G - ship.size));
      const col = Math.floor(Math.random() * (horiz ? G - ship.size : G));
      const cells = Array.from({ length: ship.size }, (_, i) =>
        horiz ? row * G + col + i : (row + i) * G + col
      );
      if (cells.every(i => g[i] === "empty")) {
        cells.forEach(i => { g[i] = "ship"; });
        placed = true;
      }
    }
  }
  return g;
}

function shoot(grid: Cell[], idx: number): Cell[] {
  const g = [...grid];
  g[idx] = g[idx] === "ship" ? "hit" : "miss";
  return g;
}

function shipsLeft(grid: Cell[]) { return grid.filter(c => c === "ship").length; }

function botPick(grid: Cell[]) {
  const opts = grid.map((c, i) => (c === "empty" || c === "ship" ? i : -1)).filter(i => i !== -1);
  return opts[Math.floor(Math.random() * opts.length)];
}

function initState() {
  return {
    player: placeRandom(makeGrid()),
    bot: placeRandom(makeGrid()),
    phase: "playing" as Phase,
    botThinking: false,
    lastBotIdx: -1,
    lastBotHit: false,
  };
}

function Grid({ cells, isBot, onFire, disabled, lastBotIdx }: {
  cells: Cell[];
  isBot: boolean;
  onFire?: (i: number) => void;
  disabled?: boolean;
  lastBotIdx?: number;
}) {
  return (
    <div>
      {/* Col labels */}
      <div className="flex mb-0.5 ml-6">
        {COLS.map(c => (
          <div key={c} className="flex-1 text-center text-[10px] font-bold" style={{ color: "#4a5568" }}>{c}</div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: G }, (_, row) => (
        <div key={row} className="flex items-center mb-0.5">
          {/* Row label */}
          <div className="w-6 text-[10px] font-bold text-right pr-1.5 shrink-0" style={{ color: "#4a5568" }}>{row + 1}</div>
          {Array.from({ length: G }, (_, col) => {
            const idx = row * G + col;
            const c = cells[idx];
            const isLastBot = idx === lastBotIdx;

            let bg = "rgba(15,30,60,0.7)";
            let border = "1px solid rgba(30,60,100,0.5)";
            let content: React.ReactNode = null;
            let cursor = "default";
            let shadow = "none";

            if (c === "hit") {
              bg = "rgba(185,28,28,0.85)";
              border = "1px solid rgba(239,68,68,0.7)";
              shadow = "0 0 10px rgba(239,68,68,0.5)";
              content = <span style={{ fontSize: 14 }}>💥</span>;
            } else if (c === "miss") {
              bg = "rgba(15,30,60,0.5)";
              border = "1px solid rgba(30,60,100,0.3)";
              content = <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(100,140,200,0.4)" }} />;
            } else if (!isBot && c === "ship") {
              bg = isLastBot ? "rgba(120,20,20,0.5)" : "rgba(29,78,137,0.8)";
              border = isLastBot ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(59,130,246,0.6)";
              shadow = isLastBot ? "0 0 8px rgba(239,68,68,0.3)" : "0 0 6px rgba(59,130,246,0.3)";
            } else if (isBot && (c === "empty" || c === "ship")) {
              bg = "rgba(15,30,60,0.7)";
              border = "1px solid rgba(30,60,100,0.5)";
              if (!disabled) {
                cursor = "crosshair";
              }
            }

            return (
              <button
                key={col}
                onClick={() => isBot && onFire?.(idx)}
                disabled={disabled || c === "hit" || c === "miss"}
                style={{
                  flex: 1,
                  aspectRatio: "1",
                  background: bg,
                  border,
                  borderRadius: 5,
                  marginRight: col < G - 1 ? 2 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor,
                  boxShadow: shadow,
                  transition: "all 0.15s",
                  padding: 0,
                  minHeight: 0,
                  minWidth: 0,
                }}
                onMouseEnter={e => {
                  if (isBot && !disabled && c !== "hit" && c !== "miss") {
                    (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.4)";
                    (e.currentTarget as HTMLElement).style.border = "1px solid rgba(96,165,250,0.6)";
                  }
                }}
                onMouseLeave={e => {
                  if (isBot && !disabled && c !== "hit" && c !== "miss") {
                    (e.currentTarget as HTMLElement).style.background = bg;
                    (e.currentTarget as HTMLElement).style.border = border;
                  }
                }}
              >
                {content}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function BattleshipPage() {
  const [state, setState] = useState(initState);
  const [score, setScore] = useState({ you: 0, bot: 0 });
  const [user, setUser] = useState<VibeUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [tab, setTab] = useState<"enemy" | "fleet">("enemy");

  const { player, bot, phase, botThinking, lastBotIdx, lastBotHit } = state;

  useEffect(() => {
    if (!botThinking || phase !== "playing") return;
    const t = setTimeout(() => {
      setState(prev => {
        if (!prev.botThinking || prev.phase !== "playing") return prev;
        const idx = botPick(prev.player);
        const wasShip = prev.player[idx] === "ship";
        const newPlayer = shoot(prev.player, idx);
        const newPhase: Phase = shipsLeft(newPlayer) === 0 ? "bot-wins" : "playing";
        if (newPhase === "bot-wins") setScore(s => ({ ...s, bot: s.bot + 1 }));
        return { ...prev, player: newPlayer, botThinking: false, phase: newPhase, lastBotIdx: idx, lastBotHit: wasShip };
      });
    }, 700 + Math.random() * 500);
    return () => clearTimeout(t);
  }, [botThinking, phase]);

  function fire(idx: number) {
    if (phase !== "playing" || botThinking || bot[idx] === "hit" || bot[idx] === "miss") return;
    setState(prev => {
      const newBot = shoot(prev.bot, idx);
      const newPhase: Phase = shipsLeft(newBot) === 0 ? "player-wins" : "playing";
      if (newPhase === "player-wins") setScore(s => ({ ...s, you: s.you + 1 }));
      return { ...prev, bot: newBot, phase: newPhase, botThinking: newPhase === "playing", lastBotIdx: -1 };
    });
  }

  const botHits = bot.filter(c => c === "hit").length;
  const playerHitsOnMe = player.filter(c => c === "hit").length;
  const gameOver = phase !== "playing";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg,#060e1f 0%,#0a1628 100%)" }}>
      <Navbar />
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/vibe-room/play-zone" className="text-slate-500 hover:text-slate-300 text-sm">← Play Zone</Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-white font-semibold">🚢 Battleship</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 text-center py-3 rounded-2xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <div className="text-2xl font-black text-emerald-400">{score.you}</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">YOU</div>
          </div>
          <div className="text-slate-600 font-bold text-sm">VS</div>
          <div className="flex-1 text-center py-3 rounded-2xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="text-2xl font-black text-red-400">{score.bot}</div>
            <div className="text-[11px] text-red-700 font-bold mt-0.5">BOT</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4 h-8 flex items-center justify-center">
          {gameOver ? (
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${phase === "player-wins" ? "text-emerald-300 bg-emerald-900/40 border border-emerald-700/40" : "text-red-300 bg-red-900/40 border border-red-700/40"}`}>
              {phase === "player-wins" ? "🎉 You sank the fleet!" : "💥 Your fleet was destroyed!"}
            </span>
          ) : botThinking ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
              Bot is targeting…
            </div>
          ) : (
            <span className="text-sm text-slate-500">🎯 Tap a cell to fire</span>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl p-1 mb-4 gap-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setTab("enemy")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: tab === "enemy" ? "rgba(239,68,68,0.2)" : "transparent", color: tab === "enemy" ? "#fca5a5" : "#64748b", border: tab === "enemy" ? "1px solid rgba(239,68,68,0.3)" : "1px solid transparent" }}>
            🎯 Enemy Waters <span className="text-xs opacity-70 ml-1">{botHits}/{TOTAL}</span>
          </button>
          <button onClick={() => setTab("fleet")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: tab === "fleet" ? "rgba(59,130,246,0.2)" : "transparent", color: tab === "fleet" ? "#93c5fd" : "#64748b", border: tab === "fleet" ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent" }}>
            🛡 Your Fleet
            {lastBotIdx >= 0 && !gameOver && (
              <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full font-bold ${lastBotHit ? "bg-red-900/60 text-red-300" : "bg-slate-800 text-slate-400"}`}>
                {lastBotHit ? "HIT!" : "miss"}
              </span>
            )}
          </button>
        </div>

        {/* Grid */}
        <div className="rounded-2xl p-3 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {tab === "enemy" ? (
            <Grid cells={bot} isBot onFire={fire} disabled={gameOver || botThinking} />
          ) : (
            <Grid cells={player} isBot={false} lastBotIdx={lastBotIdx} />
          )}
        </div>

        {/* Ship tracker */}
        <div className="flex flex-wrap gap-2 mb-5">
          {SHIPS.map(s => {
            const totalHit = bot.filter(c => c === "hit").length;
            // approximate: ships with fewer index get sunk first
            const sunk = totalHit >= TOTAL;
            return (
              <div key={s.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                <span>{s.emoji}</span>
                <span>{s.name}</span>
                <span style={{ opacity: 0.5, letterSpacing: 1 }}>{"▪".repeat(s.size)}</span>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-5 text-[11px] text-slate-600 mb-5">
          <span>Your hits <b className="text-slate-400">{botHits}</b></span>
          <span>·</span>
          <span>Bot hits <b className="text-slate-400">{playerHitsOnMe}</b></span>
          <span>·</span>
          <span>Accuracy <b className="text-slate-400">
            {(botHits + bot.filter(c => c === "miss").length) > 0 ? Math.round(botHits / (botHits + bot.filter(c => c === "miss").length) * 100) : 0}%
          </b></span>
        </div>

        {/* Action */}
        <div className="flex justify-center mb-6">
          {gameOver ? (
            <button onClick={() => setState(initState())}
              className="px-10 py-3 rounded-full text-sm font-bold text-black hover:scale-105 active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
              ⚓ New Battle
            </button>
          ) : (
            <button onClick={() => setState(initState())}
              className="px-6 py-2 rounded-full text-sm text-slate-600 hover:text-slate-300 border border-slate-800 hover:border-slate-600 transition-all">
              Redeploy Fleet
            </button>
          )}
        </div>

        {/* Chat */}
        <ZoneChat user={user} onAuthRequired={() => setShowAuth(true)} zone="game"
          initialMessages={[
            { id: "m1", authorName: "ghost_fleet", content: "B7 is always safe 👀", isBot: false, createdAt: new Date(Date.now() - 60000 * 5) },
            { id: "m2", authorName: "torpedo_99",  content: "bot got me in 3 shots lmao", isBot: false, createdAt: new Date(Date.now() - 60000 * 2) },
          ]} />

      </main>
      <Footer />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={u => { setUser({ ...u, createdAt: new Date() }); setShowAuth(false); }} />}
    </div>
  );
}
