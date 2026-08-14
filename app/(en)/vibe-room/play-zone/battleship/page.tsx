"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/vibe-room/AuthModal";
import ZoneChat from "@/components/vibe-room/ZoneChat";
import type { VibeUser } from "@/lib/vibe-room/types";

const G = 10; // grid size
const SHIPS = [
  { name: "Carrier",    size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser",    size: 3 },
  { name: "Submarine",  size: 3 },
  { name: "Destroyer",  size: 2 },
];
const TOTAL_SHIP_CELLS = SHIPS.reduce((s, sh) => s + sh.size, 0); // 17

type Cell = "empty" | "ship" | "hit" | "miss";
type Phase = "playing" | "player-wins" | "bot-wins";

function makeGrid(): Cell[] { return Array(G * G).fill("empty"); }

function placeRandom(grid: Cell[]): Cell[] {
  const g = [...grid];
  for (const ship of SHIPS) {
    let placed = false;
    let tries = 0;
    while (!placed && tries < 500) {
      tries++;
      const horiz = Math.random() < 0.5;
      const row = Math.floor(Math.random() * (horiz ? G : G - ship.size));
      const col = Math.floor(Math.random() * (horiz ? G - ship.size : G));
      const cells: number[] = [];
      for (let i = 0; i < ship.size; i++) {
        cells.push(horiz ? row * G + col + i : (row + i) * G + col);
      }
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

function botPick(grid: Cell[]): number {
  const opts = grid.map((c, i) => (c === "empty" || c === "ship" ? i : -1)).filter(i => i !== -1);
  return opts[Math.floor(Math.random() * opts.length)];
}

function initState() {
  return {
    player: placeRandom(makeGrid()),
    bot: placeRandom(makeGrid()),
    phase: "playing" as Phase,
    botThinking: false,
    lastBotShot: -1,
  };
}

export default function BattleshipPage() {
  const [state, setState] = useState(initState);
  const [score, setScore] = useState({ you: 0, bot: 0 });
  const [user, setUser] = useState<VibeUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const { player, bot, phase, botThinking, lastBotShot } = state;

  // Bot fires after a short delay
  useEffect(() => {
    if (!botThinking || phase !== "playing") return;
    const t = setTimeout(() => {
      setState(prev => {
        if (!prev.botThinking || prev.phase !== "playing") return prev;
        const idx = botPick(prev.player);
        const newPlayer = shoot(prev.player, idx);
        const newPhase: Phase = shipsLeft(newPlayer) === 0 ? "bot-wins" : "playing";
        if (newPhase === "bot-wins") setScore(s => ({ ...s, bot: s.bot + 1 }));
        return { ...prev, player: newPlayer, botThinking: false, phase: newPhase, lastBotShot: idx };
      });
    }, 600 + Math.random() * 500);
    return () => clearTimeout(t);
  }, [botThinking, phase]);

  function handleFire(idx: number) {
    if (phase !== "playing" || botThinking || bot[idx] === "hit" || bot[idx] === "miss") return;
    setState(prev => {
      const newBot = shoot(prev.bot, idx);
      const newPhase: Phase = shipsLeft(newBot) === 0 ? "player-wins" : "playing";
      if (newPhase === "player-wins") setScore(s => ({ ...s, you: s.you + 1 }));
      return { ...prev, bot: newBot, phase: newPhase, botThinking: newPhase === "playing" };
    });
  }

  function restart() { setState(initState()); }

  const playerHits  = player.filter(c => c === "hit").length;
  const playerMiss  = player.filter(c => c === "miss").length;
  const botHits     = bot.filter(c => c === "hit").length;

  function cellColor(c: Cell, isBotGrid: boolean, idx: number) {
    if (c === "hit")  return "bg-red-600 border-red-500";
    if (c === "miss") return "bg-zinc-800 border-zinc-700";
    if (!isBotGrid && c === "ship") return "bg-blue-600/70 border-blue-500/60";
    if (isBotGrid) return idx === lastBotShot ? "bg-zinc-700 border-zinc-600" : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 active:scale-95 cursor-crosshair";
    return "bg-zinc-900 border-zinc-800";
  }

  const gameOver = phase !== "playing";
  const statusMsg = phase === "player-wins" ? "You sank the fleet! 🎉" : phase === "bot-wins" ? "Your fleet was destroyed 💥" : "";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-3 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-5">
          <Link href="/vibe-room/play-zone" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Play Zone
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-medium">🚢 Battleship</span>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-5">
          {[
            { label: "You", val: score.you, color: "text-emerald-400" },
            { label: "Bot", val: score.bot, color: "text-red-400" },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-3">
              <span className={`text-2xl font-black ${color}`}>{val}</span>
              <span className="text-[11px] text-zinc-600 mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="text-center mb-4 h-7">
          {gameOver ? (
            <span className={`text-base font-semibold ${phase === "player-wins" ? "text-emerald-400" : "text-red-400"}`}>
              {statusMsg}
            </span>
          ) : (
            <span className="text-sm text-zinc-500">
              {botThinking ? "Bot is firing… 🤖" : "Click the enemy grid to fire 🎯"}
            </span>
          )}
        </div>

        {/* Enemy grid */}
        <div className="mb-1">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span className="text-xs font-semibold text-zinc-400">Enemy Fleet</span>
            <span className="text-xs text-zinc-600">{botHits}/{TOTAL_SHIP_CELLS} hit</span>
          </div>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${G}, 1fr)` }}>
            {bot.map((c, i) => (
              <button
                key={i}
                onClick={() => handleFire(i)}
                disabled={gameOver || botThinking || c === "hit" || c === "miss"}
                className={`aspect-square rounded-sm border text-[10px] flex items-center justify-center transition-all select-none ${cellColor(c, true, i)}`}
              >
                {c === "hit"  && <span>💥</span>}
                {c === "miss" && <span className="text-zinc-600">·</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle player grid */}
        <div className="mt-4 mb-1">
          <button
            onClick={() => setShowPlayer(v => !v)}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-2"
          >
            <span>{showPlayer ? "▲" : "▼"}</span>
            <span>Your Fleet — {shipsLeft(player)} ship cells remaining</span>
            {lastBotShot >= 0 && !gameOver && (
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-red-900/50 text-red-400">
                Bot hit {player[lastBotShot] === "hit" ? "a ship" : "water"}!
              </span>
            )}
          </button>
          {showPlayer && (
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${G}, 1fr)` }}>
              {player.map((c, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm border text-[10px] flex items-center justify-center select-none ${cellColor(c, false, i)}`}
                >
                  {c === "hit"  && <span>💥</span>}
                  {c === "miss" && <span className="text-zinc-600">·</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-3 text-[11px] text-zinc-600">
          <span>Your hits: <span className="text-red-400 font-semibold">{botHits}</span></span>
          <span>·</span>
          <span>Bot hits: <span className="text-red-400 font-semibold">{playerHits}</span></span>
          <span>·</span>
          <span>Your misses: <span className="text-zinc-500">{bot.filter(c => c === "miss").length}</span></span>
        </div>

        {/* Action */}
        <div className="flex justify-center mt-5">
          {gameOver ? (
            <button onClick={restart} className="px-8 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-100 transition-colors">
              Play again
            </button>
          ) : (
            <button onClick={restart} className="px-6 py-2 rounded-full border border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 text-sm transition-colors">
              Restart
            </button>
          )}
        </div>

        {/* Chat */}
        <div className="mt-6">
          <ZoneChat
            user={user}
            onAuthRequired={() => setShowAuth(true)}
            zone="game"
            initialMessages={[
              { id: "m1", authorName: "ghost_fleet", content: "B7 is always safe 👀", isBot: false, createdAt: new Date(Date.now() - 60000 * 5) },
              { id: "m2", authorName: "torpedo_99", content: "bot got me in 3 shots lmao", isBot: false, createdAt: new Date(Date.now() - 60000 * 2) },
            ]}
          />
        </div>

      </main>
      <Footer />
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={u => { setUser({ ...u, createdAt: new Date() }); setShowAuth(false); }}
        />
      )}
    </div>
  );
}
