"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Grid3x3, Hand, Zap, X } from "lucide-react";
import type {
  Cell,
  GameAction,
  GameName,
  GamePayload,
  MessageType,
  ReactionTapCountdownData,
  ReactionTapMoveData,
  ReactionTapStateData,
  RpsChoice,
  RpsCommitData,
  RpsRevealData,
  RpsStateData,
  TicTacToeMoveData,
  TicTacToeStateData,
} from "@/lib/protocol";

const GAMES: { id: GameName; label: string; icon: typeof Grid3x3 }[] = [
  { id: "tic-tac-toe", label: "Tic-Tac-Toe", icon: Grid3x3 },
  { id: "rps", label: "Rock, Paper, Scissors", icon: Hand },
  { id: "reaction-tap", label: "Reaction Tap", icon: Zap },
];

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkTicTacToeWinner(board: Cell[]): "X" | "O" | "draw" | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every((c) => c !== null) ? "draw" : null;
}

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomNonce(): string {
  return crypto.randomUUID();
}

function rpsWinnerOf(hostChoice: RpsChoice, guestChoice: RpsChoice): "host" | "guest" | "draw" {
  if (hostChoice === guestChoice) return "draw";
  const hostBeatsGuest =
    (hostChoice === "rock" && guestChoice === "scissors") ||
    (hostChoice === "paper" && guestChoice === "rock") ||
    (hostChoice === "scissors" && guestChoice === "paper");
  return hostBeatsGuest ? "host" : "guest";
}

function celebrate() {
  confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
}

type Props = {
  isHost: boolean;
  sendMessage: <T>(type: MessageType, payload: T) => void;
  subscribe: (type: MessageType, cb: (msg: { payload: unknown }) => void) => () => void;
};

export default function MiniGameOverlay({ isHost, sendMessage, subscribe }: Props) {
  const [activeGame, setActiveGame] = useState<GameName | null>(null);
  const [incomingInvite, setIncomingInvite] = useState<GameName | null>(null);
  const [awaitingAccept, setAwaitingAccept] = useState<GameName | null>(null);
  const [flash, setFlash] = useState(false);

  // Tic-Tac-Toe state
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<"X" | "O">("X");
  const [tttWinner, setTttWinner] = useState<"X" | "O" | "draw" | null>(null);
  const mySymbol = isHost ? "X" : "O";

  // RPS state
  const [myChoice, setMyChoice] = useState<RpsChoice | null>(null);
  const [myNonce, setMyNonce] = useState<string | null>(null);
  const [opponentCommit, setOpponentCommit] = useState<string | null>(null);
  const [opponentReveal, setOpponentReveal] = useState<RpsRevealData | null>(null);
  const [rpsWinner, setRpsWinner] = useState<"host" | "guest" | "draw" | null>(null);

  // Reaction Tap state
  const [tapPhase, setTapPhase] = useState<"idle" | "countdown" | "go" | "done">("idle");
  const [goAt, setGoAt] = useState<number | null>(null);
  const [myReactionMs, setMyReactionMs] = useState<number | null>(null);
  const [opponentReactionMs, setOpponentReactionMs] = useState<number | null>(null);
  const [tapWinner, setTapWinner] = useState<"host" | "guest" | "draw" | null>(null);
  const goTimerRef = useRef<number | null>(null);
  const tapStartRef = useRef<number | null>(null);

  const send = useCallback(
    <D,>(game: GameName, action: GameAction, data: D) => {
      sendMessage<GamePayload<D>>("game", { game, action, data });
    },
    [sendMessage]
  );

  const resetAll = useCallback(() => {
    setActiveGame(null);
    setAwaitingAccept(null);
    setBoard(Array(9).fill(null));
    setCurrentTurn("X");
    setTttWinner(null);
    setMyChoice(null);
    setMyNonce(null);
    setOpponentCommit(null);
    setOpponentReveal(null);
    setRpsWinner(null);
    setTapPhase("idle");
    setGoAt(null);
    setMyReactionMs(null);
    setOpponentReactionMs(null);
    setTapWinner(null);
    if (goTimerRef.current) window.clearTimeout(goTimerRef.current);
  }, []);

  function inviteToPlay(game: GameName) {
    send(game, "invite", null);
    setAwaitingAccept(game);
  }

  function acceptInvite() {
    if (!incomingInvite) return;
    send(incomingInvite, "accept", null);
    setActiveGame(incomingInvite);
    setIncomingInvite(null);
  }

  function declineInvite() {
    if (!incomingInvite) return;
    send(incomingInvite, "decline", null);
    setIncomingInvite(null);
  }

  // ---- Tic-Tac-Toe moves ----
  function playCell(index: number) {
    if (!activeGame || activeGame !== "tic-tac-toe") return;
    if (board[index] || tttWinner || currentTurn !== mySymbol) return;

    if (isHost) {
      const next = [...board];
      next[index] = mySymbol;
      const winner = checkTicTacToeWinner(next);
      setBoard(next);
      setTttWinner(winner);
      setCurrentTurn(mySymbol === "X" ? "O" : "X");
      send<TicTacToeStateData>("tic-tac-toe", "state", {
        board: next,
        currentTurn: mySymbol === "X" ? "O" : "X",
        winner,
      });
      if (winner && winner !== "draw") celebrate();
    } else {
      // Guest proposes a move; host is the sole authority and re-broadcasts truth.
      send<TicTacToeMoveData>("tic-tac-toe", "move", { cellIndex: index, player: mySymbol });
    }
  }

  // ---- RPS ----
  async function chooseRps(choice: RpsChoice) {
    if (myChoice) return;
    const nonce = randomNonce();
    setMyChoice(choice);
    setMyNonce(nonce);
    const commitHash = await sha256Hex(choice + nonce);
    send<RpsCommitData>("rps", "move", { commitHash });
  }

  // ---- Reaction Tap ----
  function startReactionTap() {
    if (!isHost) return;
    const at = Date.now() + 3000 + Math.random() * 2000;
    setGoAt(at);
    setTapPhase("countdown");
    send<ReactionTapCountdownData>("reaction-tap", "state", { goAt: at });
  }

  function tap() {
    if (tapPhase !== "go" || !tapStartRef.current) return;
    const rt = Date.now() - tapStartRef.current;
    setMyReactionMs(rt);
    setTapPhase("done");
    send<ReactionTapMoveData>("reaction-tap", "move", { reactionTimeMs: rt });
  }

  useEffect(() => {
    if (tapPhase !== "countdown" || !goAt) return;
    const delay = goAt - Date.now();
    const t = window.setTimeout(() => {
      tapStartRef.current = Date.now();
      setTapPhase("go");
    }, Math.max(0, delay));
    goTimerRef.current = t;
    return () => window.clearTimeout(t);
  }, [tapPhase, goAt]);

  useEffect(() => {
    if (!isHost) return;
    if (myReactionMs == null || opponentReactionMs == null || tapWinner) return;
    const winner: "host" | "guest" | "draw" =
      myReactionMs === opponentReactionMs ? "draw" : myReactionMs < opponentReactionMs ? "host" : "guest";
    // The host is the sole authority for this result (see plan's "no server
    // authority" section) — this genuinely has to both update local state
    // and broadcast the authoritative outcome over the data channel, so it
    // can't be expressed as a pure render-time derivation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTapWinner(winner);
    send<ReactionTapStateData>("reaction-tap", "state", { winner });
    if (winner === "host") celebrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, myReactionMs, opponentReactionMs]);

  // ---- Incoming message routing ----
  useEffect(() => {
    return subscribe("game", (msg) => {
      const { game, action, data } = msg.payload as GamePayload;

      if (action === "invite") {
        setIncomingInvite(game);
        return;
      }
      if (action === "accept") {
        setActiveGame(game);
        setAwaitingAccept(null);
        return;
      }
      if (action === "decline") {
        setAwaitingAccept(null);
        return;
      }
      if (action === "reset") {
        resetAll();
        return;
      }

      if (game === "tic-tac-toe") {
        if (action === "move" && isHost) {
          const move = data as TicTacToeMoveData;
          setBoard((prev) => {
            if (prev[move.cellIndex] || currentTurn !== move.player) return prev;
            const next = [...prev];
            next[move.cellIndex] = move.player;
            const winner = checkTicTacToeWinner(next);
            const nextTurn = move.player === "X" ? "O" : "X";
            setTttWinner(winner);
            setCurrentTurn(nextTurn);
            send<TicTacToeStateData>("tic-tac-toe", "state", { board: next, currentTurn: nextTurn, winner });
            if (winner && winner !== "draw") celebrate();
            return next;
          });
        } else if (action === "state") {
          const state = data as TicTacToeStateData;
          setBoard(state.board);
          setCurrentTurn(state.currentTurn);
          setTttWinner(state.winner);
          if (state.winner && state.winner !== "draw" && state.winner === mySymbol) celebrate();
        }
      }

      if (game === "rps") {
        if (action === "move") {
          setOpponentCommit((data as RpsCommitData).commitHash);
        } else if (action === "reveal") {
          setOpponentReveal(data as RpsRevealData);
        } else if (action === "state") {
          setRpsWinner((data as RpsStateData).winner);
          if ((data as RpsStateData).winner === (isHost ? "host" : "guest")) celebrate();
        }
      }

      if (game === "reaction-tap") {
        if (action === "state" && "goAt" in (data as object)) {
          const d = data as ReactionTapCountdownData;
          setGoAt(d.goAt);
          setTapPhase("countdown");
        } else if (action === "move") {
          setOpponentReactionMs((data as ReactionTapMoveData).reactionTimeMs);
        } else if (action === "state" && "winner" in (data as object)) {
          const d = data as ReactionTapStateData;
          setTapWinner(d.winner);
          if (d.winner === (isHost ? "host" : "guest")) celebrate();
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe, isHost, currentTurn, mySymbol, resetAll]);

  // RPS: once both commits exist, reveal.
  useEffect(() => {
    if (!myChoice || !myNonce || !opponentCommit || opponentReveal) return;
    send<RpsRevealData>("rps", "reveal", { choice: myChoice, nonce: myNonce });
  }, [myChoice, myNonce, opponentCommit, opponentReveal, send]);

  // RPS: once both reveals are verified, compute the (symmetric, no-authority-needed) result.
  useEffect(() => {
    if (!myChoice || !opponentReveal || rpsWinner) return;
    sha256Hex(opponentReveal.choice + opponentReveal.nonce).then((hash) => {
      if (hash !== opponentCommit) return; // verification failed — ignore
      const hostChoice = isHost ? myChoice : opponentReveal.choice;
      const guestChoice = isHost ? opponentReveal.choice : myChoice;
      const winner = rpsWinnerOf(hostChoice, guestChoice);
      setRpsWinner(winner);
      if (winner === (isHost ? "host" : "guest")) celebrate();
    });
  }, [myChoice, opponentReveal, opponentCommit, rpsWinner, isHost]);

  const iWonSomething =
    (tttWinner && tttWinner !== "draw" && tttWinner === mySymbol) ||
    (rpsWinner && rpsWinner !== "draw" && rpsWinner === (isHost ? "host" : "guest")) ||
    (tapWinner && tapWinner !== "draw" && tapWinner === (isHost ? "host" : "guest"));

  useEffect(() => {
    if (!iWonSomething) return;
    // Triggers a one-shot timed UI flash — genuinely effectful (a timer),
    // not a pure derivation of existing state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlash(true);
    const t = window.setTimeout(() => setFlash(false), 500);
    return () => window.clearTimeout(t);
  }, [iWonSomething]);

  return (
    <div className="relative">
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed inset-0 z-50 bg-[var(--accent)]"
          />
        )}
      </AnimatePresence>

      {incomingInvite && (
        <div className="glass mb-3 flex items-center justify-between rounded-2xl px-4 py-3">
          <span className="text-sm text-[var(--foreground)]">
            Stranger wants to play {GAMES.find((g) => g.id === incomingInvite)?.label}
          </span>
          <div className="flex gap-2">
            <button onClick={acceptInvite} className="rounded-full btn-gradient px-3 py-1.5 text-xs font-medium text-black/80">
              Accept
            </button>
            <button onClick={declineInvite} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">
              Decline
            </button>
          </div>
        </div>
      )}

      {!activeGame && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {GAMES.map((g) => (
            <button
              key={g.id}
              onClick={() => inviteToPlay(g.id)}
              disabled={awaitingAccept !== null}
              className="glass flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--overlay-2)] disabled:opacity-50"
            >
              <g.icon size={14} /> {g.label}
            </button>
          ))}
          {awaitingAccept && (
            <span className="text-xs text-[var(--muted)]">Waiting for stranger to accept…</span>
          )}
        </div>
      )}

      {activeGame && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {GAMES.find((g) => g.id === activeGame)?.label}
            </span>
            <button
              onClick={() => {
                send(activeGame, "reset", null);
                resetAll();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)]"
              aria-label="Leave game"
            >
              <X size={13} />
            </button>
          </div>

          {activeGame === "tic-tac-toe" && (
            <div>
              <div className="mx-auto grid w-fit grid-cols-3 gap-1.5">
                {board.map((cell, i) => (
                  <button
                    key={i}
                    onClick={() => playCell(i)}
                    className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--overlay-1)] text-2xl font-bold text-[var(--foreground)]"
                  >
                    {cell}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">
                {tttWinner
                  ? tttWinner === "draw"
                    ? "It's a draw!"
                    : tttWinner === mySymbol
                    ? "You won! 🎉"
                    : "Stranger won"
                  : currentTurn === mySymbol
                  ? "Your turn"
                  : "Stranger's turn"}
              </p>
            </div>
          )}

          {activeGame === "rps" && (
            <div className="text-center">
              {!rpsWinner ? (
                <>
                  <div className="flex justify-center gap-2">
                    {(["rock", "paper", "scissors"] as RpsChoice[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => chooseRps(c)}
                        disabled={!!myChoice}
                        className="rounded-xl bg-[var(--overlay-1)] px-4 py-3 text-sm font-medium capitalize text-[var(--foreground)] disabled:opacity-40"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    {myChoice ? "Waiting for stranger…" : "Pick one"}
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {rpsWinner === "draw"
                    ? "Draw!"
                    : rpsWinner === (isHost ? "host" : "guest")
                    ? "You won! 🎉"
                    : "Stranger won"}
                </p>
              )}
            </div>
          )}

          {activeGame === "reaction-tap" && (
            <div className="text-center">
              {tapPhase === "idle" && isHost && (
                <button onClick={startReactionTap} className="rounded-full btn-gradient px-4 py-2 text-sm font-medium text-black/80">
                  Start
                </button>
              )}
              {tapPhase === "idle" && !isHost && (
                <p className="text-xs text-[var(--muted)]">Waiting for stranger to start…</p>
              )}
              {tapPhase === "countdown" && (
                <button
                  onClick={tap}
                  className="h-24 w-24 rounded-full bg-red-500 text-sm font-semibold text-white"
                >
                  Wait…
                </button>
              )}
              {tapPhase === "go" && (
                <button
                  onClick={tap}
                  className="h-24 w-24 animate-pulse rounded-full btn-gradient text-sm font-semibold text-black/80"
                >
                  TAP!
                </button>
              )}
              {tapPhase === "done" && !tapWinner && (
                <p className="text-xs text-[var(--muted)]">Your time: {myReactionMs}ms — waiting for stranger…</p>
              )}
              {tapWinner && (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {tapWinner === "draw"
                    ? "Tie!"
                    : tapWinner === (isHost ? "host" : "guest")
                    ? `You won! (${myReactionMs}ms) 🎉`
                    : `Stranger won (${opponentReactionMs}ms)`}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
