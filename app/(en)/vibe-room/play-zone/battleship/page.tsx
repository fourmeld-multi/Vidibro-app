"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingChat from "@/components/vibe-room/FloatingChat";
import StrangerBar from "@/components/vibe-room/StrangerBar";
import { useStranger } from "@/hooks/useStranger";

const G = 8;
const COLS = ["A","B","C","D","E","F","G","H"];

type ShipDef = { id: string; name: string; size: number; color: string; darkColor: string };
const SHIP_DEFS: ShipDef[] = [
  { id: "carrier",   name: "Carrier",   size: 4, color: "#64748b", darkColor: "#1e293b" },
  { id: "cruiser",   name: "Cruiser",   size: 3, color: "#0f766e", darkColor: "#0a3d3a" },
  { id: "submarine", name: "Submarine", size: 3, color: "#b45309", darkColor: "#431c04" },
  { id: "destroyer", name: "Destroyer", size: 2, color: "#2563eb", darkColor: "#0f2d80" },
];
const TOTAL = SHIP_DEFS.reduce((s, sh) => s + sh.size, 0);

type PlacedShip = ShipDef & { cells: number[]; horiz: boolean; sunk: boolean };
type Phase = "playing" | "player-wins" | "bot-wins";

// ── Ship SVG Art ──────────────────────────────────────────────────────────────
function ShipCellArt({ id, pos, size, color: c, dark: d }: {
  id: string; pos: number; size: number; color: string; dark: string;
}) {
  const hi = "rgba(255,255,255,0.3)";
  const isBow   = pos === 0;
  const isStern = pos === size - 1;
  const midRect = <rect x="0" y="0.18" width="1" height="0.64" fill={c} />;

  let hull: React.ReactNode;
  let details: React.ReactNode;

  if (id === "submarine") {
    const isTower = pos === Math.floor((size - 1) / 2);
    hull = isBow
      ? <path d="M0.08,0.5 C0.08,0.22 0.28,0.18 0.5,0.18 L1,0.18 L1,0.82 L0.5,0.82 C0.28,0.82 0.08,0.78 0.08,0.5 Z" fill={c} />
      : isStern
        ? <path d="M0,0.18 L0.5,0.18 C0.72,0.18 0.92,0.22 0.92,0.5 C0.92,0.78 0.72,0.82 0.5,0.82 L0,0.82 Z" fill={c} />
        : midRect;
    details = <>
      <line x1={isBow ? "0.22" : "0"} y1="0.5" x2={isStern ? "0.78" : "1"} y2="0.5" stroke={hi} strokeWidth="0.035" />
      {isTower && <>
        <rect x="0.22" y="0.02" width="0.56" height="0.2" rx="0.05" fill={d} />
        <rect x="0.3" y="0.08" width="0.4" height="0.1" rx="0.03" fill={c} opacity="0.5" />
        <line x1="0.36" y1="0.02" x2="0.36" y2="-0.07" stroke={d} strokeWidth="0.04" strokeLinecap="round" />
        <line x1="0.36" y1="-0.07" x2="0.62" y2="-0.07" stroke={d} strokeWidth="0.035" />
        <circle cx="0.64" cy="-0.07" r="0.03" fill={d} />
      </>}
      {isStern && <>
        <line x1="0.82" y1="0.3"  x2="0.96" y2="0.5" stroke={d} strokeWidth="0.07" strokeLinecap="round" />
        <line x1="0.82" y1="0.7"  x2="0.96" y2="0.5" stroke={d} strokeWidth="0.07" strokeLinecap="round" />
        <circle cx="0.92" cy="0.5" r="0.04" fill={d} />
      </>}
    </>;

  } else if (id === "carrier") {
    const isIsland = pos === 2;
    hull = isBow
      ? <path d="M0.1,0.5 L0.34,0.15 L1,0.15 L1,0.85 L0.34,0.85 Z" fill={c} />
      : isStern
        ? <path d="M0,0.15 L0.82,0.15 L0.94,0.38 L0.94,0.62 L0.82,0.85 L0,0.85 Z" fill={c} />
        : <rect x="0" y="0.15" width="1" height="0.7" fill={c} />;
    details = <>
      <line x1={isBow ? "0.32" : "0"} y1="0.19" x2={isStern ? "0.8" : "1"} y2="0.19" stroke={hi} strokeWidth="0.05" />
      <line x1={isBow ? "0.5" : "0"} y1="0.32" x2={isStern ? "0.8" : "1"} y2="0.32" stroke={hi} strokeWidth="0.02" strokeDasharray="0.09,0.05" />
      {isIsland && <>
        <rect x="0.1"  y="0.15" width="0.65" height="0.26" rx="0.04" fill={d} />
        <rect x="0.22" y="0.02" width="0.13" height="0.16" fill={d} />
        <line x1="0.285" y1="0"    x2="0.285" y2="0.04" stroke={hi} strokeWidth="0.045" strokeLinecap="round" />
        <line x1="0.14"  y1="0.01" x2="0.42"  y2="0.01" stroke={hi} strokeWidth="0.025" />
        <rect x="0.27" y="0.22" width="0.09" height="0.07" rx="0.02" fill={hi} opacity="0.8" />
        <rect x="0.44" y="0.22" width="0.09" height="0.07" rx="0.02" fill={hi} opacity="0.8" />
      </>}
      {isStern && <>
        <circle cx="0.86" cy="0.37" r="0.06" fill={d} />
        <circle cx="0.86" cy="0.63" r="0.06" fill={d} />
      </>}
    </>;

  } else if (id === "cruiser") {
    const hasSup = pos === 1 && size >= 3;
    hull = isBow
      ? <path d="M0.06,0.5 L0.34,0.2 L1,0.2 L1,0.8 L0.34,0.8 Z" fill={c} />
      : isStern
        ? <path d="M0,0.2 L0.8,0.2 L0.94,0.5 L0.8,0.8 L0,0.8 Z" fill={c} />
        : <rect x="0" y="0.2" width="1" height="0.6" fill={c} />;
    details = <>
      <line x1={isBow ? "0.28" : "0"} y1="0.5" x2={isStern ? "0.76" : "1"} y2="0.5" stroke={hi} strokeWidth="0.038" />
      {isBow && <>
        <circle cx="0.74" cy="0.5" r="0.16" fill={d} />
        <line x1="0.74" y1="0.5" x2="0.57" y2="0.34" stroke={d} strokeWidth="0.08" strokeLinecap="round" />
      </>}
      {hasSup && <>
        <rect x="0.17" y="0.2" width="0.66" height="0.24" rx="0.04" fill={d} />
        <rect x="0.28" y="0.04" width="0.11" height="0.18" fill={d} />
        <line x1="0.34" y1="0.02" x2="0.34" y2="0.05" stroke={hi} strokeWidth="0.045" strokeLinecap="round" />
        <circle cx="0.7" cy="0.5" r="0.13" fill={c} stroke={d} strokeWidth="0.035" />
        <line x1="0.7" y1="0.5" x2="0.7" y2="0.2" stroke={d} strokeWidth="0.075" strokeLinecap="round" />
      </>}
      {isStern && <>
        <line x1="0.78" y1="0.32" x2="0.94" y2="0.5" stroke={d} strokeWidth="0.065" strokeLinecap="round" />
        <line x1="0.78" y1="0.68" x2="0.94" y2="0.5" stroke={d} strokeWidth="0.065" strokeLinecap="round" />
        <circle cx="0.9" cy="0.5" r="0.045" fill={d} />
      </>}
    </>;

  } else {
    hull = isBow
      ? <path d="M0.02,0.5 L0.44,0.17 L1,0.17 L1,0.83 L0.44,0.83 Z" fill={c} />
      : <path d="M0,0.17 L0.8,0.17 L0.95,0.5 L0.8,0.83 L0,0.83 Z" fill={c} />;
    details = <>
      <line x1={isBow ? "0.4" : "0"} y1="0.5" x2={isStern ? "0.78" : "1"} y2="0.5" stroke={hi} strokeWidth="0.042" />
      {isBow && <>
        <rect x="0.56" y="0.27" width="0.34" height="0.18" rx="0.04" fill={d} />
        <circle cx="0.76" cy="0.5" r="0.15" fill={d} />
        <line x1="0.76" y1="0.5" x2="0.59" y2="0.33" stroke={d} strokeWidth="0.08" strokeLinecap="round" />
        <line x1="0.63" y1="0.27" x2="0.63" y2="0.1"  stroke={d} strokeWidth="0.04" strokeLinecap="round" />
      </>}
      {isStern && <>
        <line x1="0.77" y1="0.32" x2="0.94" y2="0.5" stroke={d} strokeWidth="0.065" strokeLinecap="round" />
        <line x1="0.77" y1="0.68" x2="0.94" y2="0.5" stroke={d} strokeWidth="0.065" strokeLinecap="round" />
        <circle cx="0.9" cy="0.5" r="0.05" fill={d} />
      </>}
    </>;
  }

  return (
    <svg viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4, overflow: "visible" }}>
      {hull}
      {details}
    </svg>
  );
}

// ── Game helpers ──────────────────────────────────────────────────────────────
function placeShipsRandom(defs: ShipDef[]): PlacedShip[] {
  const occupied = new Set<number>();
  const ships: PlacedShip[] = [];
  for (const def of defs) {
    let placed = false, tries = 0;
    while (!placed && tries++ < 500) {
      const horiz = Math.random() < 0.5;
      const row = Math.floor(Math.random() * (horiz ? G : G - def.size));
      const col = Math.floor(Math.random() * (horiz ? G - def.size : G));
      const cells = Array.from({ length: def.size }, (_, i) =>
        horiz ? row * G + col + i : (row + i) * G + col
      );
      if (cells.every(c => !occupied.has(c))) {
        cells.forEach(c => occupied.add(c));
        ships.push({ ...def, cells, horiz, sunk: false });
        placed = true;
      }
    }
  }
  return ships;
}

function initState() {
  return {
    playerShips: placeShipsRandom(SHIP_DEFS),
    botShips:    placeShipsRandom(SHIP_DEFS),
    playerHits:  new Set<number>(),
    playerMiss:  new Set<number>(),
    botHits:     new Set<number>(),
    botMiss:     new Set<number>(),
    phase:       "playing" as Phase,
    botThinking: false,
    lastBotIdx:  -1,
    lastBotWasHit: false,
  };
}

function markSunk(ships: PlacedShip[], hits: Set<number>): PlacedShip[] {
  return ships.map(s => ({ ...s, sunk: s.cells.every(c => hits.has(c)) }));
}

function cellCorners(ship: PlacedShip, idx: number) {
  const pos = ship.cells.indexOf(idx);
  const first = pos === 0, last = pos === ship.cells.length - 1;
  if (ship.horiz) return { tl: first?8:2, tr: last?8:2, bl: first?8:2, br: last?8:2 };
  return { tl: first?8:8, tr: first?8:8, bl: last?8:8, br: last?8:8 };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BattleshipPage() {
  const router = useRouter();
  const { matchState, stranger, elapsed, findNext, close } = useStranger();

  const [state, setState] = useState(initState);
  const [score, setScore] = useState({ you: 0, bot: 0 });
  const [tab, setTab] = useState<"enemy" | "fleet">("enemy");
  const [appPhase, setAppPhase] = useState<"idle" | "playing">("idle");
  const [rematchState, setRematchState] = useState<"none" | "waiting" | "confirming">("none");
  const [showNextConfirm, setShowNextConfirm] = useState(false);
  const rematchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCloseGame() {
    close();
    router.push("/vibe-room/play-zone");
  }

  function handleNext() {
    setShowNextConfirm(true);
  }

  function confirmNext() {
    setShowNextConfirm(false);
    findNext();
    setState(initState());
    setAppPhase("idle");
    setRematchState("none");
  }

  function handleStartGame() {
    setState(initState());
    setAppPhase("playing");
    setRematchState("none");
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
  }

  const { playerShips, botShips, playerHits, playerMiss, botHits, botMiss, phase, botThinking, lastBotIdx, lastBotWasHit } = state;

  // Partner auto-requests rematch after game ends
  useEffect(() => {
    if (phase === "playing" || appPhase !== "playing") return;
    rematchTimerRef.current = setTimeout(() => {
      setRematchState(prev => prev === "none" ? "confirming" : prev);
    }, 4000 + Math.random() * 3000);
    return () => { if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current); };
  }, [phase, appPhase]);

  function handlePlayAgain() {
    setRematchState("waiting");
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    setTimeout(() => {
      setRematchState("none");
      handleStartGame();
    }, 1500 + Math.random() * 1000);
  }

  function handleConfirmRematch() {
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    setRematchState("none");
    handleStartGame();
  }

  useEffect(() => {
    if (!state.botThinking || phase !== "playing" || appPhase !== "playing") return;
    const t = setTimeout(() => {
      setState(prev => {
        if (!prev.botThinking || prev.phase !== "playing") return prev;
        const all   = new Set(prev.playerShips.flatMap(s => s.cells));
        const fired = new Set([...prev.playerHits, ...prev.playerMiss]);
        const opts  = Array.from({ length: G * G }, (_, i) => i).filter(i => !fired.has(i));
        const idx   = opts[Math.floor(Math.random() * opts.length)];
        const isHit = all.has(idx);
        const newH  = new Set(prev.playerHits); const newM = new Set(prev.playerMiss);
        if (isHit) newH.add(idx); else newM.add(idx);
        const newShips = markSunk(prev.playerShips, newH);
        const allSunk  = newShips.every(s => s.sunk);
        if (allSunk) setScore(s => ({ ...s, bot: s.bot + 1 }));
        return { ...prev, playerShips: newShips, playerHits: newH, playerMiss: newM, botThinking: false, phase: allSunk ? "bot-wins" : "playing", lastBotIdx: idx, lastBotWasHit: isHit };
      });
    }, 700 + Math.random() * 500);
    return () => clearTimeout(t);
  }, [state.botThinking, phase, appPhase]);

  function fire(idx: number) {
    if (phase !== "playing" || botThinking || botHits.has(idx) || botMiss.has(idx) || appPhase !== "playing") return;
    setState(prev => {
      const all   = new Set(prev.botShips.flatMap(s => s.cells));
      const isHit = all.has(idx);
      const newH  = new Set(prev.botHits); const newM = new Set(prev.botMiss);
      if (isHit) newH.add(idx); else newM.add(idx);
      const newShips = markSunk(prev.botShips, newH);
      const allSunk  = newShips.every(s => s.sunk);
      if (allSunk) setScore(s => ({ ...s, you: s.you + 1 }));
      return { ...prev, botShips: newShips, botHits: newH, botMiss: newM, phase: allSunk ? "player-wins" : "playing", botThinking: !allSunk, lastBotIdx: -1 };
    });
  }

  const gameOver = phase !== "playing";
  const playerCellMap = new Map<number, PlacedShip>();
  playerShips.forEach(s => s.cells.forEach(c => playerCellMap.set(c, s)));

  function renderGrid(isEnemy: boolean) {
    const hits   = isEnemy ? botHits   : playerHits;
    const misses = isEnemy ? botMiss   : playerMiss;
    const ships  = isEnemy ? botShips  : playerShips;
    const sunkMap = new Map<number, PlacedShip>();
    ships.filter(s => s.sunk).forEach(s => s.cells.forEach(c => sunkMap.set(c, s)));

    return (
      <div style={{ padding: "10px 10px 10px 6px" }}>
        <div style={{ display: "flex", paddingLeft: 22, marginBottom: 4 }}>
          {COLS.map(c => (
            <div key={c} style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>{c}</div>
          ))}
        </div>

        {Array.from({ length: G }, (_, row) => (
          <div key={row} style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
            <div style={{ width: 18, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textAlign: "right", paddingRight: 4, flexShrink: 0 }}>{row + 1}</div>

            {Array.from({ length: G }, (_, col) => {
              const idx        = row * G + col;
              const isHit      = hits.has(idx);
              const isMiss     = misses.has(idx);
              const playerShip = !isEnemy ? playerCellMap.get(idx) : undefined;
              const sunkShip   = sunkMap.get(idx);
              const canFire    = isEnemy && !gameOver && !botThinking && !isHit && !isMiss && appPhase === "playing";
              const isLastBot  = !isEnemy && idx === lastBotIdx;

              const visShip  = sunkShip ?? (!isEnemy ? playerShip : undefined);
              const shipPos  = visShip ? visShip.cells.indexOf(idx) : -1;
              const corners  = visShip ? cellCorners(visShip, idx) : null;

              let bg     = "rgba(255,255,255,0.12)";
              let border = "1px solid rgba(255,255,255,0.18)";
              let shadow = "none";
              let showArt  = false;
              let showSunk = false;
              let topContent: React.ReactNode = null;

              if (isHit && sunkShip) {
                bg      = "rgba(255,255,255,0.08)";
                border  = `1px solid ${sunkShip.color}66`;
                shadow  = `0 0 10px ${sunkShip.color}55`;
                showArt = true; showSunk = true;
                topContent = (
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6, fontSize: 12 }}>
                    {sunkShip.cells[0] === idx ? "🔥" : "💨"}
                  </span>
                );
              } else if (isHit) {
                bg      = "rgba(185,28,28,0.8)";
                border  = "1px solid rgba(239,68,68,0.7)";
                shadow  = "0 0 10px rgba(239,68,68,0.5)";
                topContent = <span style={{ fontSize: 15, zIndex: 6 }}>💥</span>;
              } else if (isMiss) {
                bg     = "rgba(255,255,255,0.07)";
                border = "1px solid rgba(255,255,255,0.1)";
                topContent = <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.4)", boxShadow: "0 0 4px rgba(255,255,255,0.2)" }} />;
              } else if (playerShip && !isEnemy) {
                bg      = isLastBot ? "rgba(180,30,30,0.25)" : "rgba(255,255,255,0.1)";
                border  = `1px solid ${playerShip.sunk ? "rgba(120,120,120,0.3)" : playerShip.darkColor + "99"}`;
                shadow  = isLastBot ? "0 0 8px rgba(239,68,68,0.4)" : "none";
                showArt = true;
              }

              const artColor = showSunk ? "#6b7280" : visShip?.color ?? "";
              const artDark  = showSunk ? "#2d3748" : visShip?.darkColor ?? "";
              const cr = corners;

              return (
                <button
                  key={col}
                  onClick={() => canFire && fire(idx)}
                  style={{
                    flex: 1, aspectRatio: "1",
                    background: bg, border,
                    borderRadius: cr ? `${cr.tl}px ${cr.tr}px ${cr.br}px ${cr.bl}px` : 6,
                    marginRight: col < G - 1 ? 3 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: canFire ? "crosshair" : "default",
                    boxShadow: shadow,
                    transition: "background 0.12s, box-shadow 0.12s",
                    padding: 0, minWidth: 0, minHeight: 0,
                    position: "relative", overflow: "visible",
                  }}
                  onMouseEnter={e => { if (canFire) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={e => { if (canFire) (e.currentTarget as HTMLElement).style.background = bg; }}
                >
                  {showArt && visShip && shipPos >= 0 && (
                    <div style={{
                      position: "absolute", inset: 0,
                      transform: visShip.horiz ? undefined : "rotate(90deg)",
                      transformOrigin: "center center",
                      overflow: "visible", pointerEvents: "none", zIndex: 4,
                    }}>
                      <ShipCellArt
                        id={visShip.id} pos={shipPos} size={visShip.size}
                        color={artColor} dark={artDark}
                      />
                    </div>
                  )}
                  {topContent}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg,#0369a1 0%,#0284c7 40%,#0ea5e9 100%)" }}>
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5">

        <div className="flex items-center gap-2 mb-4">
          <Link href="/vibe-room/play-zone" className="text-sky-200 hover:text-white text-sm transition-colors">← Play Zone</Link>
          <span className="text-sky-400">/</span>
          <span className="text-sm text-white font-semibold">🚢 Battleship</span>
        </div>

        <StrangerBar
          matchState={matchState} stranger={stranger} elapsed={elapsed}
          onNext={handleNext} onClose={handleCloseGame}
          closeLabel="Close Game"
        />

        {/* Next stranger confirm modal */}
        {showNextConfirm && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              background: "#0c2a40", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 18, padding: "28px 32px", textAlign: "center", maxWidth: 300,
            }}>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#fff" }}>Find next stranger?</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>Current game will end.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={confirmNext} style={{
                  padding: "8px 20px", borderRadius: 20, border: "none",
                  background: "#0369a1", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>Yes, find next</button>
                <button onClick={() => setShowNextConfirm(false)} style={{
                  padding: "8px 20px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.2)", background: "transparent",
                  color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Score */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 rounded-2xl py-3 text-center" style={{ background: "rgba(0,0,0,0.3)", border: "2px solid rgba(255,200,100,0.4)" }}>
            <div className="text-2xl font-black text-yellow-300">{score.you}</div>
            <div className="text-[11px] text-yellow-500 font-bold mt-0.5">YOU</div>
          </div>
          <div className="text-white/60 font-black text-lg">VS</div>
          <div className="flex-1 rounded-2xl py-3 text-center" style={{ background: "rgba(0,0,0,0.3)", border: "2px solid rgba(239,68,68,0.4)" }}>
            <div className="text-2xl font-black text-red-300">{score.bot}</div>
            <div className="text-[11px] text-red-400 font-bold mt-0.5">PARTNER</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4 h-8 flex items-center justify-center">
          {appPhase === "playing" && gameOver ? (
            <div className={`px-5 py-1.5 rounded-full text-sm font-bold ${phase === "player-wins" ? "bg-green-500 text-white" : "bg-red-600 text-white"}`}>
              {phase === "player-wins" ? "🎉 Enemy fleet destroyed!" : "💀 Your partner wins!"}
            </div>
          ) : appPhase === "playing" && botThinking ? (
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              Partner is targeting…
            </div>
          ) : appPhase === "playing" ? (
            <span className="text-sm text-white/60">🎯 Tap enemy grid to fire</span>
          ) : null}
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-xl p-1 mb-3 gap-1" style={{ background: "rgba(0,0,0,0.25)" }}>
          <button onClick={() => setTab("enemy")}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: tab==="enemy" ? "rgba(239,68,68,0.7)" : "transparent", color: tab==="enemy" ? "#fff" : "rgba(255,255,255,0.5)" }}>
            🎯 Attack <span className="text-xs opacity-70 ml-1">{botHits.size}/{TOTAL}</span>
          </button>
          <button onClick={() => setTab("fleet")}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ background: tab==="fleet" ? "rgba(30,64,175,0.7)" : "transparent", color: tab==="fleet" ? "#fff" : "rgba(255,255,255,0.5)" }}>
            🛡 My Fleet
            {lastBotIdx >= 0 && !gameOver && (
              <span className={`text-[10px] ml-1.5 px-1.5 py-0.5 rounded-full ${lastBotWasHit ? "bg-red-500 text-white" : "bg-white/20 text-white/70"}`}>
                {lastBotWasHit ? "HIT" : "miss"}
              </span>
            )}
          </button>
        </div>

        {/* Grid */}
        <div className="rounded-2xl mb-4 relative" style={{
          background: "linear-gradient(135deg,rgba(14,165,233,0.55),rgba(2,132,199,0.45))",
          border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          overflow: "visible",
        }}>
          {tab === "enemy" ? renderGrid(true) : renderGrid(false)}

          {/* Idle overlay */}
          {appPhase === "idle" && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(2,80,130,0.9)", borderRadius: 14,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 16,
            }}>
              <div style={{ fontSize: 40 }}>🚢</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>Battleship</div>
              <button onClick={handleStartGame} style={{
                padding: "10px 36px", borderRadius: 24, border: "none",
                background: "rgba(255,255,255,0.9)", color: "#0369a1",
                fontWeight: 800, fontSize: 15, cursor: "pointer",
              }}>Start</button>
            </div>
          )}
        </div>

        {/* Fleet status legend */}
        <div className="rounded-2xl p-3 mb-4" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">
            {tab === "enemy" ? "Enemy Fleet Status" : "Your Fleet Status"}
          </div>
          <div className="flex flex-col gap-1.5">
            {(tab === "enemy" ? botShips : playerShips).map(ship => {
              const h = tab === "enemy" ? botHits : playerHits;
              const hitCount = ship.cells.filter(c => h.has(c)).length;
              return (
                <div key={ship.id} className="flex items-center gap-2">
                  <div className="w-20 text-[11px] font-semibold" style={{ color: ship.sunk ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)" }}>
                    {ship.sunk ? "💀" : "🚢"} {ship.name}
                  </div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${((ship.size - hitCount) / ship.size) * 100}%`, background: ship.sunk ? "#6b7280" : `linear-gradient(90deg,${ship.color},${ship.darkColor})` }} />
                  </div>
                  <div className="text-[10px] w-10 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>{ship.size - hitCount}/{ship.size}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-5 text-[11px] text-white/40 mb-4">
          <span>Hits <b className="text-white/70">{botHits.size}</b></span>
          <span>·</span>
          <span>Misses <b className="text-white/70">{botMiss.size}</b></span>
          <span>·</span>
          <span>Accuracy <b className="text-white/70">{(botHits.size + botMiss.size) > 0 ? Math.round(botHits.size / (botHits.size + botMiss.size) * 100) : 0}%</b></span>
        </div>

        {/* Game over rematch / in-game restart */}
        <div className="flex flex-col items-center mb-6 gap-3">
          {appPhase === "playing" && gameOver && (
            <>
              {rematchState === "none" && (
                <>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Play again?</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handlePlayAgain} style={{
                      padding: "10px 24px", borderRadius: 24, border: "none",
                      background: "linear-gradient(135deg,#f59e0b,#d97706)",
                      color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(245,158,11,0.4)",
                    }}>Yes, let's go!</button>
                    <button onClick={handleCloseGame} style={{
                      padding: "10px 24px", borderRadius: 24,
                      border: "1px solid rgba(255,255,255,0.25)", background: "transparent",
                      color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer",
                    }}>No thanks</button>
                  </div>
                </>
              )}
              {rematchState === "waiting" && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }} className="animate-pulse">
                  Waiting for partner…
                </p>
              )}
              {rematchState === "confirming" && (
                <>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Partner wants to play again!</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleConfirmRematch} style={{
                      padding: "10px 24px", borderRadius: 24, border: "none",
                      background: "linear-gradient(135deg,#f59e0b,#d97706)",
                      color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(245,158,11,0.4)",
                    }}>Yes, let's go!</button>
                    <button onClick={handleCloseGame} style={{
                      padding: "10px 24px", borderRadius: 24,
                      border: "1px solid rgba(255,255,255,0.25)", background: "transparent",
                      color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer",
                    }}>No thanks</button>
                  </div>
                </>
              )}
            </>
          )}
          {appPhase === "playing" && !gameOver && (
            <button onClick={() => setState(initState())}
              className="px-6 py-2 rounded-full text-sm font-semibold text-white/50 hover:text-white/80 transition-all"
              style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)" }}>
              Redeploy Fleet
            </button>
          )}
        </div>

        <FloatingChat
          user={null}
          onAuthRequired={() => {}}
          zone="game"
          matchState={matchState}
          stranger={stranger}
          elapsed={elapsed}
          onNext={handleNext}
          onClose={handleCloseGame}
          noAuth
        />
      </main>
    </div>
  );
}
