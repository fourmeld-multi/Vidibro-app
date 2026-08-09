"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Cell = "X" | "O" | null;
type GameStatus = "playing" | "win-X" | "win-O" | "draw";

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkStatus(board: Cell[]): { status: GameStatus; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { status: board[a] === "X" ? "win-X" : "win-O", line };
    }
  }
  if (board.every(Boolean)) return { status: "draw", line: null };
  return { status: "playing", line: null };
}

function botMove(board: Cell[]): number {
  const empty = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);

  // Win if possible
  for (const i of empty) {
    const b = [...board]; b[i] = "O";
    if (checkStatus(b).status === "win-O") return i;
  }
  // Block player
  for (const i of empty) {
    const b = [...board]; b[i] = "X";
    if (checkStatus(b).status === "win-X") return i;
  }
  // Take center
  if (board[4] === null) return 4;
  // Take corner
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  // Random
  return empty[Math.floor(Math.random() * empty.length)];
}

const STATUS_MSG: Record<GameStatus, string> = {
  playing: "",
  "win-X": "You won! 🎉",
  "win-O": "Bot wins 🤖",
  draw: "Draw! 🤝",
};

export default function TicTacToePage() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [{ status, line }, setResult] = useState<{ status: GameStatus; line: number[] | null }>({
    status: "playing",
    line: null,
  });
  const [score, setScore] = useState({ you: 0, bot: 0, draw: 0 });
  const [botThinking, setBotThinking] = useState(false);

  useEffect(() => {
    if (status !== "playing" || isPlayerTurn) return;

    setBotThinking(true);
    const t = setTimeout(() => {
      setBoard((prev) => {
        const next = [...prev];
        next[botMove(next)] = "O";
        const result = checkStatus(next);
        setResult(result);
        if (result.status === "win-O") setScore((s) => ({ ...s, bot: s.bot + 1 }));
        if (result.status === "draw") setScore((s) => ({ ...s, draw: s.draw + 1 }));
        setIsPlayerTurn(true);
        return next;
      });
      setBotThinking(false);
    }, 480);

    return () => clearTimeout(t);
  }, [isPlayerTurn, status]);

  function handleClick(i: number) {
    if (!isPlayerTurn || board[i] || status !== "playing" || botThinking) return;

    const next = [...board];
    next[i] = "X";
    const result = checkStatus(next);
    setBoard(next);
    setResult(result);

    if (result.status === "win-X") {
      setScore((s) => ({ ...s, you: s.you + 1 }));
    } else if (result.status !== "draw") {
      setIsPlayerTurn(false);
    }
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setResult({ status: "playing", line: null });
    setBotThinking(false);
  }

  const gameOver = status !== "playing";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1 max-w-sm mx-auto w-full px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/vibe-room/play-zone" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Play Zone
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-medium">⭕ Tic-Tac-Toe</span>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          {[
            { label: "You", val: score.you, color: "text-emerald-400" },
            { label: "Draw", val: score.draw, color: "text-zinc-500" },
            { label: "Bot", val: score.bot, color: "text-red-400" },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-3">
              <span className={`text-2xl font-black ${color}`}>{val}</span>
              <span className="text-[11px] text-zinc-600 mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div className="text-center mb-4 h-7">
          {gameOver ? (
            <span className={`text-base font-semibold ${status === "win-X" ? "text-emerald-400" : status === "win-O" ? "text-red-400" : "text-zinc-400"}`}>
              {STATUS_MSG[status]}
            </span>
          ) : (
            <span className="text-sm text-zinc-600">
              {botThinking ? "Bot is thinking…" : "Your turn — you're X"}
            </span>
          )}
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((cell, i) => {
            const isWinCell = line?.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={!!cell || gameOver || !isPlayerTurn || botThinking}
                className={`aspect-square rounded-2xl border text-4xl font-black flex items-center justify-center transition-all
                  ${isWinCell
                    ? status === "win-X"
                      ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400"
                      : "bg-red-950/60 border-red-500/60 text-red-400"
                    : cell
                      ? "bg-zinc-900 border-zinc-700"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 active:scale-95"
                  }
                  ${!cell && !gameOver && isPlayerTurn && !botThinking ? "cursor-pointer" : "cursor-default"}
                `}
              >
                {cell && (
                  <span className={cell === "X" ? "text-white" : "text-zinc-400"}>
                    {cell}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action */}
        <div className="flex justify-center">
          {gameOver ? (
            <button
              onClick={reset}
              className="px-8 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-100 transition-colors"
            >
              Play again
            </button>
          ) : (
            <button
              onClick={reset}
              className="px-6 py-2 rounded-full border border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 text-sm transition-colors"
            >
              Restart
            </button>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
