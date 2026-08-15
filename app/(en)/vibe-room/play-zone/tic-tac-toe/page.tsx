"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingChat from "@/components/vibe-room/FloatingChat";
import StrangerBar from "@/components/vibe-room/StrangerBar";
import { useStranger } from "@/hooks/useStranger";

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
  for (const i of empty) {
    const b = [...board]; b[i] = "O";
    if (checkStatus(b).status === "win-O") return i;
  }
  for (const i of empty) {
    const b = [...board]; b[i] = "X";
    if (checkStatus(b).status === "win-X") return i;
  }
  if (board[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

const STATUS_MSG: Record<GameStatus, string> = {
  playing: "",
  "win-X": "You win! 🎉",
  "win-O": "Your partner wins! 🎯",
  draw: "It's a draw! 🤝",
};

export default function TicTacToePage() {
  const router = useRouter();
  const { matchState, stranger, elapsed, findNext, close } = useStranger();

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [{ status, line }, setResult] = useState<{ status: GameStatus; line: number[] | null }>({
    status: "playing", line: null,
  });
  const [score, setScore] = useState({ you: 0, bot: 0, draw: 0 });
  const [botThinking, setBotThinking] = useState(false);
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
    reset();
    setAppPhase("idle");
    setRematchState("none");
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setResult({ status: "playing", line: null });
    setBotThinking(false);
  }

  function handleStartGame() {
    reset();
    setAppPhase("playing");
    setRematchState("none");
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
  }

  // Partner auto-requests rematch after game ends
  useEffect(() => {
    const gameOver = status !== "playing";
    if (!gameOver || appPhase !== "playing") return;
    rematchTimerRef.current = setTimeout(() => {
      setRematchState(prev => prev === "none" ? "confirming" : prev);
    }, 4000 + Math.random() * 3000);
    return () => { if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current); };
  }, [status, appPhase]);

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

  // Bot move
  useEffect(() => {
    if (status !== "playing" || isPlayerTurn || appPhase !== "playing") return;
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
  }, [isPlayerTurn, status, appPhase]);

  function handleClick(i: number) {
    if (!isPlayerTurn || board[i] || status !== "playing" || botThinking || appPhase !== "playing") return;
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

  const gameOver = status !== "playing";

  return (
    <div className="min-h-screen flex flex-col text-white"
      style={{ background: "linear-gradient(160deg, #0c1a2e 0%, #0f2240 50%, #0c1a2e 100%)" }}>
      <main className="flex-1 max-w-sm mx-auto w-full px-4 py-8">

        <div className="flex items-center gap-3 mb-6">
          <Link href="/vibe-room/play-zone" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Play Zone
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-medium">⭕ Tic-Tac-Toe</span>
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
              background: "#1a2540", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 18, padding: "28px 32px", textAlign: "center", maxWidth: 300,
            }}>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Find next stranger?</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>Current game will end.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={confirmNext} style={{
                  padding: "8px 20px", borderRadius: 20, border: "none",
                  background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>Yes, find next</button>
                <button onClick={() => setShowNextConfirm(false)} style={{
                  padding: "8px 20px", borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.15)", background: "transparent",
                  color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer",
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          {[
            { label: "You", val: score.you, color: "text-emerald-400" },
            { label: "Draw", val: score.draw, color: "text-zinc-500" },
            { label: "Partner", val: score.bot, color: "text-red-400" },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex flex-col items-center rounded-2xl px-6 py-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className={`text-2xl font-black ${color}`}>{val}</span>
              <span className="text-[11px] text-zinc-600 mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="text-center mb-4 h-7">
          {appPhase === "playing" && gameOver ? (
            <span className={`text-base font-semibold ${status === "win-X" ? "text-emerald-400" : status === "win-O" ? "text-red-400" : "text-zinc-400"}`}>
              {STATUS_MSG[status]}
            </span>
          ) : appPhase === "playing" ? (
            <span className="text-sm text-zinc-600">
              {botThinking ? "Partner is thinking…" : "Your turn — you're X"}
            </span>
          ) : null}
        </div>

        {/* Board */}
        <div className="relative mb-6">
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, i) => {
              const isWinCell = line?.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  disabled={!!cell || gameOver || !isPlayerTurn || botThinking || appPhase !== "playing"}
                  className={`aspect-square rounded-2xl border text-4xl font-black flex items-center justify-center transition-all
                    ${isWinCell
                      ? status === "win-X"
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400"
                        : "bg-red-950/60 border-red-500/60 text-red-400"
                      : cell
                        ? "border-zinc-700"
                        : "border-zinc-800 hover:border-zinc-600 active:scale-95"
                    }
                    ${!cell && !gameOver && isPlayerTurn && !botThinking && appPhase === "playing" ? "cursor-pointer" : "cursor-default"}
                  `}
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {cell && (
                    <span className={cell === "X" ? "text-white" : "text-zinc-400"}>{cell}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Idle overlay */}
          {appPhase === "idle" && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(12,26,46,0.9)", borderRadius: 16,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 16,
            }}>
              <div style={{ fontSize: 40 }}>⭕</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>Tic-Tac-Toe</div>
              <button onClick={handleStartGame} style={{
                padding: "10px 36px", borderRadius: 24, border: "none",
                background: "#4f46e5", color: "#fff",
                fontWeight: 800, fontSize: 15, cursor: "pointer",
              }}>Start</button>
            </div>
          )}
        </div>

        {/* Game over actions */}
        {appPhase === "playing" && gameOver && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 16 }}>
            {rematchState === "none" && (
              <>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Play again?</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handlePlayAgain} style={{
                    padding: "10px 24px", borderRadius: 24, border: "none",
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}>Yes, let's go!</button>
                  <button onClick={handleCloseGame} style={{
                    padding: "10px 24px", borderRadius: 24,
                    border: "1px solid rgba(255,255,255,0.15)", background: "transparent",
                    color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer",
                  }}>No thanks</button>
                </div>
              </>
            )}
            {rematchState === "waiting" && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }} className="animate-pulse">
                Waiting for partner…
              </p>
            )}
            {rematchState === "confirming" && (
              <>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Partner wants to play again!</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleConfirmRematch} style={{
                    padding: "10px 24px", borderRadius: 24, border: "none",
                    background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                    color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}>Yes, let's go!</button>
                  <button onClick={handleCloseGame} style={{
                    padding: "10px 24px", borderRadius: 24,
                    border: "1px solid rgba(255,255,255,0.15)", background: "transparent",
                    color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer",
                  }}>No thanks</button>
                </div>
              </>
            )}
          </div>
        )}

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
