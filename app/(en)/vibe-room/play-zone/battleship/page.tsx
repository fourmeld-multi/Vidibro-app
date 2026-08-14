"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/vibe-room/AuthModal";
import ZoneChat from "@/components/vibe-room/ZoneChat";
import type { VibeUser } from "@/lib/vibe-room/types";

const G = 10;
const COLS = ["A","B","C","D","E","F","G","H","I","J"];
const SHIPS = [
  { name: "Carrier",    size: 5, emoji: "🛳" },
  { name: "Battleship", size: 4, emoji: "⚓" },
  { name: "Cruiser",    size: 3, emoji: "🚢" },
  { name: "Submarine",  size: 3, emoji: "🤿" },
  { name: "Destroyer",  size: 2, emoji: "⚡" },
];
const TOTAL = SHIPS.reduce((s, sh) => s + sh.size, 0); // 17

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

// How many cells of each ship are still alive
function shipStatus(grid: Cell[]) {
  // We can't track individual ships without ship IDs, so show aggregate hits
  const totalHit = grid.filter(c => c === "hit").length;
  let remaining = TOTAL - totalHit;
  return SHIPS.map(s => {
    const take = Math.min(s.size, remaining);
    remaining = Math.max(0, remaining - take);
    return { ...s, alive: take > 0 };
  });
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

export default function BattleshipPage() {
  const [state, setState] = useState(initState);
  const [score, setScore] = useState({ you: 0, bot: 0 });
  const [user, setUser] = useState<VibeUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showFleet, setShowFleet] = useState(false);

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
  const botFleet = shipStatus(bot);
  const playerHits = player.filter(c => c === "hit").length;
  const gameOver = phase !== "playing";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #060e1f 0%, #0a1628 60%, #0d1f3c 100%)" }}>
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-3 py-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/vibe-room/play-zone" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">← Play Zone</Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-white font-semibold">🚢 Battleship</span>
        </div>

        {/* Score bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex flex-col items-center py-3 rounded-2xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <span className="text-2xl font-black text-emerald-400">{score.you}</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5">YOU</span>
          </div>
          <div className="text-slate-600 text-sm font-bold">VS</div>
          <div className="flex-1 flex flex-col items-center py-3 rounded-2xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <span className="text-2xl font-black text-red-400">{score.bot}</span>
            <span className="text-[11px] text-red-600 font-semibold mt-0.5">BOT</span>
          </div>
        </div>

        {/* Status banner */}
        <div className="text-center mb-4 h-8 flex items-center justify-center">
          {gameOver ? (
            <div className={`px-5 py-1.5 rounded-full text-sm font-bold ${phase === "player-wins" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
              {phase === "player-wins" ? "🎉 Enemy fleet destroyed!" : "💥 Your fleet was sunk!"}
            </div>
          ) : botThinking ? (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
              Bot is targeting…
            </div>
          ) : (
            <span className="text-sm text-slate-500">🎯 Fire on the enemy grid</span>
          )}
        </div>

        {/* ── ENEMY GRID ── */}
        <div className="mb-4 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5" style={{ background: "rgba(239,68,68,0.12)", borderBottom: "1px solid rgba(239,68,68,0.2)" }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-bold text-red-300 tracking-widest uppercase">Enemy Waters</span>
            </div>
            <span className="text-[11px] text-slate-500">{botHits} / {TOTAL} sunk</span>
          </div>

          {/* Col labels */}
          <div className="grid pl-5 pr-1.5 pt-1.5" style={{ gridTemplateColumns: `repeat(${G}, 1fr)` }}>
            {COLS.map(c => <div key={c} className="text-center text-[9px] text-slate-600 font-bold pb-0.5">{c}</div>)}
          </div>

          {/* Grid with row labels */}
          <div className="px-1.5 pb-1.5">
            {Array.from({ length: G }, (_, row) => (
              <div key={row} className="flex items-center gap-0">
                <div className="w-4 text-[9px] text-slate-600 font-bold text-right pr-1 shrink-0">{row + 1}</div>
                <div className="flex-1 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${G}, 1fr)` }}>
                  {Array.from({ length: G }, (_, col) => {
                    const idx = row * G + col;
                    const c = bot[idx];
                    const canFire = !gameOver && !botThinking && c !== "hit" && c !== "miss";
                    return (
                      <button
                        key={col}
                        onClick={() => fire(idx)}
                        disabled={!canFire}
                        className={`aspect-square rounded-sm text-[11px] flex items-center justify-center transition-all select-none
                          ${c === "hit"  ? "bg-red-600/80 border border-red-500/60 shadow-[0_0_6px_rgba(239,68,68,0.6)]" : ""}
                          ${c === "miss" ? "bg-slate-800/60 border border-slate-700/40" : ""}
                          ${c === "empty" || c === "ship" ? `border ${canFire ? "bg-blue-950/60 border-blue-900/40 hover:bg-blue-800/50 hover:border-blue-600/60 hover:shadow-[0_0_6px_rgba(59,130,246,0.4)] cursor-crosshair" : "bg-blue-950/40 border-blue-900/30 cursor-not-allowed"}` : ""}
                        `}
                        style={{ minHeight: 0 }}
                      >
                        {c === "hit"  && <span>💥</span>}
                        {c === "miss" && <span className="w-1.5 h-1.5 rounded-full bg-slate-600 block" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enemy ship tracker */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {botFleet.map(s => (
            <div key={s.name} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${s.alive ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-red-900/30 text-red-400 border border-red-800/40 line-through opacity-50"}`}>
              <span>{s.emoji}</span>
              <span>{s.name}</span>
              <span className="text-[9px] opacity-60">{"▪".repeat(s.size)}</span>
            </div>
          ))}
        </div>

        {/* ── YOUR FLEET ── (collapsible) */}
        <button onClick={() => setShowFleet(v => !v)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl mb-1 transition-colors" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Your Fleet</span>
            {lastBotIdx >= 0 && !gameOver && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${lastBotHit ? "bg-red-900/50 text-red-300" : "bg-slate-800 text-slate-400"}`}>
                {lastBotHit ? "💥 Hit!" : "🌊 Missed"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600">{shipsLeft(player)} cells left</span>
            <span className="text-slate-600 text-xs">{showFleet ? "▲" : "▼"}</span>
          </div>
        </button>

        {showFleet && (
          <div className="mb-4 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="grid pl-5 pr-1.5 pt-1.5" style={{ gridTemplateColumns: `repeat(${G}, 1fr)` }}>
              {COLS.map(c => <div key={c} className="text-center text-[9px] text-slate-600 font-bold pb-0.5">{c}</div>)}
            </div>
            <div className="px-1.5 pb-1.5">
              {Array.from({ length: G }, (_, row) => (
                <div key={row} className="flex items-center gap-0">
                  <div className="w-4 text-[9px] text-slate-600 font-bold text-right pr-1 shrink-0">{row + 1}</div>
                  <div className="flex-1 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${G}, 1fr)` }}>
                    {Array.from({ length: G }, (_, col) => {
                      const idx = row * G + col;
                      const c = player[idx];
                      const isLastBot = idx === lastBotIdx;
                      return (
                        <div key={col} className={`aspect-square rounded-sm text-[11px] flex items-center justify-center select-none transition-all
                          ${c === "hit"  ? "bg-red-600/80 border border-red-500/60 shadow-[0_0_6px_rgba(239,68,68,0.5)]" : ""}
                          ${c === "miss" ? "bg-slate-800/60 border border-slate-700/40" : ""}
                          ${c === "ship" ? `bg-blue-700/70 border border-blue-500/50 ${isLastBot ? "ring-1 ring-red-400" : ""}` : ""}
                          ${c === "empty" ? "bg-blue-950/40 border border-blue-900/30" : ""}
                        `}>
                          {c === "hit"  && <span>💥</span>}
                          {c === "miss" && <span className="w-1.5 h-1.5 rounded-full bg-slate-600 block" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="flex justify-center my-4">
          {gameOver ? (
            <button onClick={() => setState(initState())}
              className="px-10 py-3 rounded-full text-sm font-bold text-black transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
              ⚓ New Battle
            </button>
          ) : (
            <button onClick={() => setState(initState())}
              className="px-6 py-2 rounded-full text-sm text-slate-500 hover:text-slate-300 transition-colors border border-slate-800 hover:border-slate-700">
              Redeploy Fleet
            </button>
          )}
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 justify-center text-[11px] text-slate-600 mb-5">
          <span>Your hits: <b className="text-slate-400">{botHits}</b></span>
          <span>·</span>
          <span>Bot hits: <b className="text-slate-400">{playerHits}</b></span>
          <span>·</span>
          <span>Accuracy: <b className="text-slate-400">{bot.filter(c => c === "miss").length + botHits > 0 ? Math.round(botHits / (bot.filter(c => c === "miss").length + botHits) * 100) : 0}%</b></span>
        </div>

        {/* Chat */}
        <ZoneChat
          user={user}
          onAuthRequired={() => setShowAuth(true)}
          zone="game"
          initialMessages={[
            { id: "m1", authorName: "ghost_fleet", content: "B7 is always safe 👀", isBot: false, createdAt: new Date(Date.now() - 60000 * 5) },
            { id: "m2", authorName: "torpedo_99", content: "bot got me in 3 shots lmao", isBot: false, createdAt: new Date(Date.now() - 60000 * 2) },
          ]}
        />

      </main>
      <Footer />
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={u => { setUser({ ...u, createdAt: new Date() }); setShowAuth(false); }} />
      )}
    </div>
  );
}
