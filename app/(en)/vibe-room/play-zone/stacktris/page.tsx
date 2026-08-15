"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import AuthModal from "@/components/vibe-room/AuthModal";
import type { VibeUser } from "@/lib/vibe-room/types";

const COLS = 10;
const ROWS = 18;
type Color = string | null;
type Board = Color[][];

const PIECES = {
  I: { shape: [[1,1,1,1]],             color: "#06b6d4" },
  O: { shape: [[1,1],[1,1]],            color: "#f59e0b" },
  T: { shape: [[0,1,0],[1,1,1]],        color: "#a855f7" },
  S: { shape: [[0,1,1],[1,1,0]],        color: "#22c55e" },
  Z: { shape: [[1,1,0],[0,1,1]],        color: "#ef4444" },
  J: { shape: [[1,0,0],[1,1,1]],        color: "#3b82f6" },
  L: { shape: [[0,0,1],[1,1,1]],        color: "#f97316" },
} as const;
type PieceId = keyof typeof PIECES;

const SPEEDS = [800,650,520,400,320,240,190,150,120,90];
const SCORE_PER_LINES = [0, 100, 300, 500, 800];

function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function rotateCW(shape: number[][]): number[][] {
  const R = shape.length, C = shape[0].length;
  return Array.from({ length: C }, (_, c) =>
    Array.from({ length: R }, (_, r) => shape[R - 1 - r][c])
  );
}

function randPiece(): PieceId {
  const k = Object.keys(PIECES) as PieceId[];
  return k[Math.floor(Math.random() * k.length)];
}

function fits(board: Board, shape: number[][], x: number, y: number) {
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nr = y + r, nc = x + c;
      if (nc < 0 || nc >= COLS || nr >= ROWS) return false;
      if (nr >= 0 && board[nr][nc]) return false;
    }
  return true;
}

function lock(board: Board, shape: number[][], x: number, y: number, color: string): Board {
  const b = board.map(r => [...r]);
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      if (shape[r][c] && y + r >= 0) b[y + r][x + c] = color;
  return b;
}

function sweep(board: Board) {
  const kept = board.filter(row => row.some(c => !c));
  const n = ROWS - kept.length;
  return { board: [...Array.from({ length: n }, () => Array(COLS).fill(null)), ...kept], lines: n };
}

function ghostDrop(board: Board, shape: number[][], x: number, y: number) {
  let gy = y;
  while (fits(board, shape, x, gy + 1)) gy++;
  return gy;
}

function spawnX(shape: number[][]) {
  return Math.floor((COLS - shape[0].length) / 2);
}

type GamePhase = "idle" | "playing" | "paused" | "over";

interface Piece { id: PieceId; shape: number[][]; x: number; y: number; color: string }

function newPiece(id: PieceId): Piece {
  const { shape, color } = PIECES[id];
  return { id, shape, color, x: spawnX(shape), y: -shape.length + 1 };
}

export default function StacktrisPage() {
  const [phase, setPhase]       = useState<GamePhase>("idle");
  const [board, setBoard]       = useState<Board>(emptyBoard);
  const [piece, setPiece]       = useState<Piece | null>(null);
  const [next, setNext]         = useState<PieceId>("I"); // server-safe; randomized on mount
  const [score, setScore]       = useState(0);
  const [best, setBest]         = useState(0);
  const [lines, setLines]       = useState(0);
  const [level, setLevel]       = useState(0);

  // Randomize next piece only on client to avoid SSR hydration mismatch
  useEffect(() => { setNext(randPiece()); }, []);
  const [user, setUser]         = useState<VibeUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [flash, setFlash]       = useState(false);

  const boardRef  = useRef(board);
  const pieceRef  = useRef(piece);
  const phaseRef  = useRef(phase);
  boardRef.current = board;
  pieceRef.current = piece;
  phaseRef.current = phase;

  // ── Start / restart ──────────────────────────────────────────────────────
  function startGame() {
    const firstId = randPiece();
    const secondId = randPiece();
    setBoard(emptyBoard());
    setPiece(newPiece(firstId));
    setNext(secondId);
    setScore(0); setLines(0); setLevel(0);
    setPhase("playing");
  }

  // ── Spawn next ───────────────────────────────────────────────────────────
  const spawnNext = useCallback((b: Board, nextId: PieceId) => {
    const p = newPiece(nextId);
    if (!fits(b, p.shape, p.x, p.y)) {
      setPhase("over");
      setBest(prev => Math.max(prev, scoreRef.current));
      return;
    }
    setPiece(p);
    setNext(randPiece());
  }, []);

  const scoreRef = useRef(0);
  scoreRef.current = score;

  // ── Lock current piece ───────────────────────────────────────────────────
  const lockCurrent = useCallback(() => {
    const p = pieceRef.current;
    if (!p) return;
    const nb = lock(boardRef.current, p.shape, p.x, p.y, p.color);
    const { board: swept, lines: cleared } = sweep(nb);
    setBoard(swept);
    if (cleared > 0) {
      setLines(l => {
        const nl = l + cleared;
        setLevel(Math.min(9, Math.floor(nl / 10)));
        return nl;
      });
      setScore(s => {
        const add = SCORE_PER_LINES[cleared] * (level + 1);
        return s + add;
      });
      if (cleared >= 2) { setFlash(true); setTimeout(() => setFlash(false), 300); }
    }
    spawnNext(swept, next);
  }, [next, level, spawnNext]);

  // ── Gravity tick ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    const ms = SPEEDS[Math.min(level, SPEEDS.length - 1)];
    const id = setInterval(() => {
      const p = pieceRef.current;
      if (!p) return;
      if (fits(boardRef.current, p.shape, p.x, p.y + 1)) {
        setPiece(prev => prev ? { ...prev, y: prev.y + 1 } : prev);
      } else {
        lockCurrent();
      }
    }, ms);
    return () => clearInterval(id);
  }, [phase, level, lockCurrent]);

  // ── Move helpers ─────────────────────────────────────────────────────────
  const moveLeft = useCallback(() => {
    setPiece(p => p && fits(boardRef.current, p.shape, p.x - 1, p.y) ? { ...p, x: p.x - 1 } : p);
  }, []);

  const moveRight = useCallback(() => {
    setPiece(p => p && fits(boardRef.current, p.shape, p.x + 1, p.y) ? { ...p, x: p.x + 1 } : p);
  }, []);

  const rotate = useCallback(() => {
    setPiece(p => {
      if (!p) return p;
      const r = rotateCW(p.shape);
      // Wall kick: try 0, -1, +1, -2, +2
      for (const dx of [0, -1, 1, -2, 2]) {
        if (fits(boardRef.current, r, p.x + dx, p.y))
          return { ...p, shape: r, x: p.x + dx };
      }
      return p;
    });
  }, []);

  const softDrop = useCallback(() => {
    setPiece(p => {
      if (!p) return p;
      if (fits(boardRef.current, p.shape, p.x, p.y + 1)) {
        setScore(s => s + 1);
        return { ...p, y: p.y + 1 };
      }
      return p;
    });
    // If can't move down, lock next tick via gravity
  }, []);

  const hardDrop = useCallback(() => {
    const p = pieceRef.current;
    if (!p) return;
    const gy = ghostDrop(boardRef.current, p.shape, p.x, p.y);
    const dropped = gy - p.y;
    setPiece({ ...p, y: gy });
    setScore(s => s + dropped * 2);
    // Lock after state settles
    setTimeout(() => lockCurrent(), 0);
  }, [lockCurrent]);

  const togglePause = useCallback(() => {
    setPhase(ph => ph === "playing" ? "paused" : "playing");
  }, []);

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); moveLeft(); }
      if (e.key === "ArrowRight") { e.preventDefault(); moveRight(); }
      if (e.key === "ArrowUp")    { e.preventDefault(); rotate(); }
      if (e.key === "ArrowDown")  { e.preventDefault(); softDrop(); }
      if (e.key === " ")          { e.preventDefault(); hardDrop(); }
      if (e.key === "p" || e.key === "P") togglePause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, moveLeft, moveRight, rotate, softDrop, hardDrop, togglePause]);

  // ── Render board with ghost ───────────────────────────────────────────────
  const gy = piece ? ghostDrop(board, piece.shape, piece.x, piece.y) : -99;

  const ghostCells = new Set<number>();
  const activeCells = new Map<number, string>();
  if (piece) {
    for (let r = 0; r < piece.shape.length; r++)
      for (let c = 0; c < piece.shape[r].length; c++)
        if (piece.shape[r][c]) {
          ghostCells.add((gy + r) * COLS + (piece.x + c));
          activeCells.set((piece.y + r) * COLS + (piece.x + c), piece.color);
        }
  }

  const CELL = 32; // px — adjusted below via CSS for small screens

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-1 max-w-md mx-auto w-full px-3 py-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/vibe-room/play-zone" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">← Play Zone</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-semibold">🧱 Stacktris</span>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mb-4">
          {[
            { label: "Score", val: score.toLocaleString(), color: "text-yellow-400" },
            { label: "Level", val: level + 1,              color: "text-purple-400"  },
            { label: "Lines", val: lines,                   color: "text-cyan-400"    },
            { label: "Best",  val: best.toLocaleString(),   color: "text-emerald-400" },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-2 text-center">
              <div className={`text-base font-black ${color}`}>{val}</div>
              <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Game area */}
        <div className="flex gap-3 mb-4">

          {/* Board */}
          <div className={`relative rounded-xl overflow-hidden border-2 transition-all ${flash ? "border-yellow-400 shadow-yellow-400/40 shadow-lg" : "border-zinc-800"}`}
            style={{ background: "#0a0a0f" }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 1, padding: 4 }}>
              {Array.from({ length: ROWS * COLS }, (_, i) => {
                const r = Math.floor(i / COLS), c = i % COLS;
                const locked = board[r][c];
                const active = activeCells.get(i);
                const isGhost = !active && ghostCells.has(i);

                let bg = "rgba(255,255,255,0.03)";
                let shadow = "none";
                if (locked) { bg = locked; shadow = `0 0 6px ${locked}55`; }
                else if (active) { bg = active; shadow = `0 0 8px ${active}88`; }
                else if (isGhost) { bg = "rgba(255,255,255,0.1)"; }

                return (
                  <div key={i} style={{
                    width: CELL, height: CELL, background: bg,
                    borderRadius: 3, boxShadow: shadow,
                    border: (locked || active) ? `1px solid rgba(255,255,255,0.15)` : "1px solid rgba(255,255,255,0.04)",
                    transition: "background 0.05s",
                    position: "relative", overflow: "hidden",
                  }}>
                    {(locked || active) && (
                      <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 60%)",
                        borderRadius: 3,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overlay states */}
            {phase === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
                <div className="text-4xl">🧱</div>
                <div className="text-lg font-black">Stacktris</div>
                <div className="text-xs text-zinc-500 text-center px-4">Stack tiles, clear rows, beat your score.</div>
                <button onClick={startGame}
                  className="px-7 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-100 active:scale-95 transition-all">
                  Play
                </button>
              </div>
            )}
            {phase === "paused" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl gap-3">
                <div className="text-3xl">⏸</div>
                <div className="font-bold text-zinc-300">Paused</div>
                <button onClick={togglePause}
                  className="px-6 py-2 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-100">
                  Resume
                </button>
              </div>
            )}
            {phase === "over" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 rounded-xl gap-2">
                <div className="text-3xl">💀</div>
                <div className="font-black text-lg text-red-400">Game Over</div>
                <div className="text-sm text-zinc-400">Score: <span className="text-yellow-300 font-bold">{score.toLocaleString()}</span></div>
                {score >= best && best > 0 && <div className="text-xs text-emerald-400 font-semibold">🏆 New best!</div>}
                <button onClick={startGame}
                  className="mt-1 px-7 py-2.5 rounded-full text-sm font-bold bg-white text-black hover:bg-zinc-100 active:scale-95">
                  Play again
                </button>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-3">

            {/* Next piece */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2">
              <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-2 text-center">Next</div>
              <div className="w-16 h-16 flex items-center justify-center">
                {(() => {
                  const { shape, color } = PIECES[next];
                  const rows = shape.length, cols = shape[0].length;
                  const cellW = Math.floor(52 / cols);
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cellW}px)`, gap: 2 }}>
                      {shape.flatMap((row, r) => row.map((c, ci) => (
                        <div key={`${r}-${ci}`} style={{
                          width: cellW, height: cellW,
                          background: c ? color : "transparent",
                          borderRadius: 2,
                          boxShadow: c ? `0 0 6px ${color}66` : "none",
                          border: c ? "1px solid rgba(255,255,255,0.15)" : "none",
                        }} />
                      )))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2">
              <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1.5 text-center">Keys</div>
              <div className="text-[10px] text-zinc-500 space-y-0.5">
                <div>← → Move</div>
                <div>↑ Rotate</div>
                <div>↓ Soft drop</div>
                <div>Space Hard drop</div>
                <div>P Pause</div>
              </div>
            </div>

            {(phase === "playing" || phase === "paused") && (
              <button onClick={togglePause}
                className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors text-center">
                {phase === "paused" ? "▶ Resume" : "⏸ Pause"}
              </button>
            )}
            {phase !== "idle" && (
              <button onClick={startGame}
                className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 text-xs font-bold text-zinc-600 hover:text-zinc-300 transition-colors text-center">
                ↺ Restart
              </button>
            )}
          </div>
        </div>

        {/* Mobile touch controls */}
        <div className="mb-4 select-none">
          <div className="flex justify-center mb-2">
            <button onPointerDown={rotate}
              className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl text-purple-400 active:bg-zinc-800 active:scale-95 transition-all">
              ↻
            </button>
          </div>
          <div className="flex justify-center gap-2 mb-2">
            <button onPointerDown={moveLeft}
              className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl text-white active:bg-zinc-800 active:scale-95 transition-all">
              ←
            </button>
            <button onPointerDown={softDrop}
              className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl text-cyan-400 active:bg-zinc-800 active:scale-95 transition-all">
              ↓
            </button>
            <button onPointerDown={moveRight}
              className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl text-white active:bg-zinc-800 active:scale-95 transition-all">
              →
            </button>
          </div>
          <div className="flex justify-center">
            <button onPointerDown={hardDrop}
              className="px-10 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-yellow-400 active:bg-zinc-800 active:scale-95 transition-all gap-2">
              ⬇ Drop
            </button>
          </div>
        </div>

      </main>
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={u => { setUser({ ...u, createdAt: new Date() }); setShowAuth(false); }}
        />
      )}
    </div>
  );
}
