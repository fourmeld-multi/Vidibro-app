"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingChat from "@/components/vibe-room/FloatingChat";
import StrangerBar from "@/components/vibe-room/StrangerBar";
import { useStranger } from "@/hooks/useStranger";

// ── Canvas constants ──────────────────────────────────────────────────────────
const CW = 580, CH = 300;
const GY = 252;
const SH = 74;
const DW = 22, DH = 60;
const GRAVITY = 0.65;
const JUMP_V  = -14;
const PX = 70;
const BX = 70;

const FAR_TILE = 400;
const FAR_BLDS = [
  { rx: 0,   w: 60,  h: 95  }, { rx: 70,  w: 40,  h: 140 },
  { rx: 120, w: 72,  h: 85  }, { rx: 202, w: 50,  h: 115 },
  { rx: 260, w: 82,  h: 105 }, { rx: 352, w: 45,  h: 125 },
];
const NEAR_TILE = 500;
const NEAR_BLDS = [
  { rx: 0,   w: 82,  h: 70  }, { rx: 92,  w: 48,  h: 95  },
  { rx: 150, w: 90,  h: 58  }, { rx: 250, w: 62,  h: 80  },
  { rx: 322, w: 72,  h: 96  }, { rx: 404, w: 88,  h: 62  },
];

// ── Drawing helpers ───────────────────────────────────────────────────────────

function drawBuildingLayer(
  ctx: CanvasRenderingContext2D,
  blds: { rx: number; w: number; h: number }[],
  offset: number, tile: number, col: string, winCol: string,
  wxStep: number, wyStep: number,
) {
  for (let t = -1; t <= Math.ceil(CW / tile) + 1; t++) {
    const tx = t * tile - offset;
    for (const b of blds) {
      const bx = Math.floor(tx + b.rx);
      const by = GY - b.h;
      ctx.fillStyle = col;
      ctx.fillRect(bx, by, b.w, b.h);
      ctx.fillStyle = winCol;
      for (let wy = by + 8; wy < GY - 4; wy += wyStep) {
        for (let wx = bx + 5; wx < bx + b.w - 5; wx += wxStep) {
          if ((Math.floor((wx - bx) / wxStep) + Math.floor((wy - by) / wyStep)) % 2 === 0)
            ctx.fillRect(wx, wy, 4, 5);
        }
      }
    }
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.fillStyle = "rgba(255,255,255,0.87)";
  const h = w * 0.38;
  ctx.beginPath();
  ctx.arc(x + w * 0.25, y + h * 0.5,  h * 0.56, 0, Math.PI * 2);
  ctx.arc(x + w * 0.48, y + h * 0.28, h * 0.68, 0, Math.PI * 2);
  ctx.arc(x + w * 0.73, y + h * 0.5,  h * 0.50, 0, Math.PI * 2);
  ctx.arc(x + w * 0.42, y + h * 0.64, h * 0.46, 0, Math.PI * 2);
  ctx.fill();
}

function drawObstacle(ctx: CanvasRenderingContext2D, cx: number, cH: number, cW: number) {
  const mx = cx + cW / 2;
  const tipY = GY - cH;
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(mx - cW * 0.09, tipY); ctx.lineTo(mx + cW * 0.09, tipY);
  ctx.lineTo(mx + cW * 0.5,  GY);  ctx.lineTo(mx - cW * 0.5,  GY);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#c2410c";
  ctx.beginPath();
  ctx.moveTo(mx + cW * 0.04, tipY); ctx.lineTo(mx + cW * 0.09, tipY);
  ctx.lineTo(mx + cW * 0.5,  GY);  ctx.lineTo(mx + cW * 0.25, GY);
  ctx.closePath(); ctx.fill();
  const sy = tipY + cH * 0.48;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.moveTo(mx - cW * 0.30, sy); ctx.lineTo(mx + cW * 0.30, sy);
  ctx.lineTo(mx + cW * 0.35, sy + cH * 0.1); ctx.lineTo(mx - cW * 0.35, sy + cH * 0.1);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#7c2d12";
  ctx.fillRect(cx, GY - 4, cW, 4);
}

function drawRunner(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, jumping: boolean) {
  const leg = Math.floor(frame / 8) % 2;
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath(); ctx.ellipse(x + 15, GY + 5, 13, 4, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = "#1e40af";
  if (jumping) {
    ctx.fillRect(x + 3,  y + 46, 9, 14); ctx.fillRect(x + 1,  y + 56, 13, 8);
    ctx.fillRect(x + 17, y + 44, 9, 14); ctx.fillRect(x + 16, y + 54, 13, 8);
  } else if (leg === 0) {
    ctx.fillRect(x + 4,  y + 44, 9, 23); ctx.fillRect(x + 18, y + 44, 9, 14);
    ctx.fillRect(x + 20, y + 54, 7,  9);
  } else {
    ctx.fillRect(x + 18, y + 44, 9, 23); ctx.fillRect(x + 4,  y + 44, 9, 14);
    ctx.fillRect(x + 1,  y + 54, 7,  9);
  }
  ctx.fillStyle = "#111827";
  if (jumping) {
    ctx.fillRect(x,      y + 62, 15, 7); ctx.fillRect(x + 15, y + 60, 15, 7);
  } else if (leg === 0) {
    ctx.fillRect(x + 2,  y + 65, 14, 7); ctx.fillRect(x + 17, y + 60, 11, 5);
  } else {
    ctx.fillRect(x + 17, y + 65, 14, 7); ctx.fillRect(x,      y + 60, 11, 5);
  }
  ctx.fillStyle = "#1d4ed8"; ctx.fillRect(x + 4, y + 40, 22, 8);
  ctx.fillStyle = "#dc2626"; ctx.fillRect(x + 5, y + 22, 20, 20);
  ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.fillRect(x + 12, y + 22, 5, 20);
  ctx.fillStyle = "#f5c5a3";
  if (jumping) {
    ctx.fillRect(x - 2, y + 23, 6, 16); ctx.fillRect(x + 25, y + 23, 6, 16);
  } else if (leg === 0) {
    ctx.fillRect(x - 2, y + 25, 6, 18); ctx.fillRect(x + 25, y + 21, 6, 12);
  } else {
    ctx.fillRect(x - 2, y + 21, 6, 12); ctx.fillRect(x + 25, y + 25, 6, 18);
  }
  ctx.fillStyle = "#f5c5a3"; ctx.fillRect(x + 11, y + 18, 8, 6);
  ctx.fillStyle = "#f5c5a3";
  ctx.beginPath(); ctx.arc(x + 15, y + 13, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#3d1f00";
  ctx.fillRect(x + 3, y + 2, 24, 8);
  ctx.beginPath(); ctx.arc(x + 15, y + 10, 11, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath(); ctx.arc(x + 10, y + 13, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 20, y + 13, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath(); ctx.arc(x + 11, y + 12, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 21, y + 12, 1, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#b94040"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x + 15, y + 17, 4, 0.15, Math.PI - 0.15); ctx.stroke();
}

function drawRunnerDead(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.globalAlpha = 0.38;
  ctx.fillStyle = "#f5c5a3";
  ctx.beginPath(); ctx.arc(x + 15, y + 22, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#dc2626"; ctx.fillRect(x + 3,  y + 32, 20, 18);
  ctx.fillStyle = "#1e40af"; ctx.fillRect(x + 3,  y + 47, 9,  20); ctx.fillRect(x + 16, y + 47, 9,  20);
  ctx.fillStyle = "#111827"; ctx.fillRect(x + 2,  y + 65, 12,  6); ctx.fillRect(x + 15, y + 65, 12,  6);
  ctx.globalAlpha = 0.8; ctx.fillStyle = "#ef4444"; ctx.font = "bold 12px sans-serif";
  ctx.fillText("×", x + 7,  y + 25); ctx.fillText("×", x + 18, y + 25);
  ctx.globalAlpha = 1;
}

function drawCountdownOverlay(ctx: CanvasRenderingContext2D, n: number) {
  ctx.fillStyle = "rgba(0,0,0,0.58)";
  ctx.fillRect(0, 0, CW, CH);
  ctx.textAlign = "center";
  if (n > 0) {
    const cols = ["", "#f87171", "#fb923c", "#fbbf24"];
    ctx.fillStyle = cols[n] ?? "#fbbf24";
    ctx.font = "bold 100px Arial, sans-serif";
    ctx.fillText(String(n), CW / 2, CH / 2 + 36);
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.font = "14px Arial, sans-serif";
    ctx.fillText("get ready!", CW / 2, CH / 2 - 44);
  } else {
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 76px Arial, sans-serif";
    ctx.fillText("GO!", CW / 2, CH / 2 + 28);
  }
  ctx.textAlign = "left";
}

function drawGameOver(
  ctx: CanvasRenderingContext2D,
  winner: Winner, score: number, botScore: number, name: string,
) {
  const cx = CW / 2, cy = CH / 2 - 6;
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.beginPath(); ctx.roundRect(cx - 135, cy - 46, 270, 92, 14); ctx.fill();
  const borderCol = winner === "player" ? "rgba(74,222,128,0.55)" : winner === "draw" ? "rgba(251,191,36,0.55)" : "rgba(248,113,113,0.55)";
  ctx.strokeStyle = borderCol; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(cx - 135, cy - 46, 270, 92, 14); ctx.stroke();
  ctx.textAlign = "center";
  const textCol = winner === "player" ? "#4ade80" : winner === "draw" ? "#fbbf24" : "#f87171";
  const textMsg = winner === "player" ? "YOU WIN!" : winner === "draw" ? "IT'S A TIE!" : "GAME OVER";
  ctx.fillStyle = textCol; ctx.font = "bold 22px 'Courier New', monospace";
  ctx.fillText(textMsg, cx, cy - 12);
  ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.font = "11px 'Courier New', monospace";
  ctx.fillText(`YOU ${String(score).padStart(5,"0")}  vs  ${String(botScore).padStart(5,"0")} Partner`, cx, cy + 20);
  ctx.textAlign = "left";
}

function renderScene(
  ctx: CanvasRenderingContext2D, g: GameState,
  strangerName?: string, winner?: Winner | null,
  pFinal?: number, bFinal?: number,
) {
  ctx.clearRect(0, 0, CW, CH);
  const sky = ctx.createLinearGradient(0, 0, 0, GY);
  sky.addColorStop(0,    "#0d3b6e"); sky.addColorStop(0.45, "#1565c0");
  sky.addColorStop(0.8,  "#42a5f5"); sky.addColorStop(1,    "#b3e5fc");
  ctx.fillStyle = sky; ctx.fillRect(0, 0, CW, GY);
  drawBuildingLayer(ctx, FAR_BLDS, g.groundOffset * 0.14 % FAR_TILE, FAR_TILE,  "#6b87ab", "rgba(255,248,180,0.45)", 8,  10);
  for (const c of g.clouds) drawCloud(ctx, c.x, c.y, c.w);
  drawBuildingLayer(ctx, NEAR_BLDS, g.groundOffset * 0.38 % NEAR_TILE, NEAR_TILE, "#2e4a62", "rgba(255,248,160,0.70)", 10, 12);
  ctx.fillStyle = "#1c252e"; ctx.fillRect(0, GY, CW, CH - GY);
  ctx.fillStyle = "#78909c"; ctx.fillRect(0, GY, CW, 5);
  ctx.fillStyle = "#546e7a"; ctx.fillRect(0, GY + 5, CW, 3);
  const dLen = 30, dGap = 20, dT = dLen + dGap;
  const dOff = g.groundOffset % dT;
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  for (let dx = -dT + dOff; dx < CW; dx += dT) ctx.fillRect(dx, GY + 22, dLen, 3);
  for (const c of g.cacti) drawObstacle(ctx, c.x, c.h, c.w);
  const jumping = g.playerY < GY - SH - 2;
  if (g.playerAlive) drawRunner(ctx, PX, g.playerY, g.frame, jumping);
  else               drawRunnerDead(ctx, PX, g.playerY);
  ctx.fillStyle = "rgba(0,0,0,0.38)"; ctx.font = "bold 13px 'Courier New', monospace";
  ctx.textAlign = "right"; ctx.fillText(String(g.playerScore).padStart(5,"0"), CW - 14, 22); ctx.textAlign = "left";
  if (winner) drawGameOver(ctx, winner, pFinal ?? g.playerScore, bFinal ?? g.botScore, strangerName ?? "Stranger");
}

// ── Game state ────────────────────────────────────────────────────────────────
interface Cactus { x: number; w: number; h: number; }
interface Cloud  { x: number; y: number; w: number; spd: number; }
interface GameState {
  playerY: number; playerVY: number; playerAlive: boolean; playerScore: number;
  botY:    number; botVY:    number; botAlive:    boolean; botScore:    number;
  cacti: Cactus[]; frame: number; speed: number; spawnIn: number;
  botJumpCooldown: number; groundOffset: number; clouds: Cloud[];
}
type Phase  = "idle" | "countdown" | "playing" | "done";
type Winner = "player" | "bot" | "draw";

function freshState(): GameState {
  return {
    playerY: GY - SH, playerVY: 0, playerAlive: true, playerScore: 0,
    botY:    GY - SH, botVY:    0, botAlive:    true, botScore:    0,
    cacti: [], frame: 0, speed: 4.5, spawnIn: 90, botJumpCooldown: 0,
    groundOffset: 0,
    clouds: [
      { x: 50,  y: 20, w: 70,  spd: 0.42 }, { x: 230, y: 38, w: 52,  spd: 0.26 },
      { x: 410, y: 14, w: 80,  spd: 0.35 }, { x: 540, y: 50, w: 44,  spd: 0.20 },
    ],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DinoRacePage() {
  const router = useRouter();
  const { matchState, stranger, elapsed, findNext, close } = useStranger(10000);

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const gsRef      = useRef<GameState>(freshState());
  const rafRef     = useRef<number>(0);
  const phaseRef   = useRef<Phase>("idle");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const runNodeRef  = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);

  function getAudioCtx() {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  }

  function startRunSound() {
    if (!soundOnRef.current) return;
    try {
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      if (runNodeRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 48;
      gain.gain.value = 0.08;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start();
      runNodeRef.current = { osc, gain };
    } catch {}
  }

  function stopRunSound() {
    try {
      if (!runNodeRef.current) return;
      runNodeRef.current.gain.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.1);
      setTimeout(() => { try { runNodeRef.current?.osc.stop(); } catch {} runNodeRef.current = null; }, 300);
    } catch {}
  }

  function playHitSound() {
    if (!soundOnRef.current) return;
    try {
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 18) * 0.6
                + Math.sin(2 * Math.PI * 80 * t) * Math.exp(-t * 12) * 0.4;
      }
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = 0.7;
      src.buffer = buf; src.connect(gain); gain.connect(ctx.destination); src.start();
    } catch {}
  }

  const [phase, setPhase]           = useState<Phase>("idle");
  const [countdown, setCountdown]   = useState<number | null>(null);
  const [score, setScore]           = useState(0);
  const [botScore, setBotScore]     = useState(0);
  const [winner, setWinner]         = useState<Winner | null>(null);
  const [playerDead, setPlayerDead] = useState(false);
  // rematch flow
  const [rematchState, setRematchState] = useState<"none" | "waiting" | "confirming">("none");
  // next-stranger confirmation
  const [showNextConfirm, setShowNextConfirm] = useState(false);

  const strangerName = stranger?.username ?? "Stranger";
  const rematchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Cleanup audio on unmount ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopRunSound();
      try { audioCtxRef.current?.close(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sound toggle ──────────────────────────────────────────────────────────
  function toggleSound() {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
    if (!next) stopRunSound();
    else if (phaseRef.current === "playing") startRunSound();
  }

  // ── Idle canvas on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    renderScene(cv.getContext("2d")!, gsRef.current);
  }, []);

  // ── Stranger connects → start countdown ──────────────────────────────────
  useEffect(() => {
    if (matchState === "connected" && phaseRef.current === "idle") {
      phaseRef.current = "countdown";
      setPhase("countdown");
      setCountdown(3);
    }
  }, [matchState]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown === null) return;
    if (countdown < 0) { setCountdown(null); startGame(); return; }
    const delay = countdown === 0 ? 800 : 1000;
    const t = setTimeout(() => setCountdown(c => c! - 1), delay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // ── Draw countdown on canvas each tick ───────────────────────────────────
  useEffect(() => {
    if (countdown === null || countdown < 0) return;
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    renderScene(ctx, gsRef.current);
    drawCountdownOverlay(ctx, countdown);
  }, [countdown]);

  // ── Bot requests rematch ~5s after game ends ──────────────────────────────
  useEffect(() => {
    if (phase !== "done" || !stranger) return;
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    rematchTimerRef.current = setTimeout(() => {
      setRematchState(prev => (prev === "none" ? "confirming" : prev));
    }, 4500 + Math.random() * 3000);
    return () => {
      if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    };
  }, [phase, stranger]);

  // ── startGame ─────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const g = freshState();
    gsRef.current = g;
    phaseRef.current = "playing";
    setPhase("playing"); setScore(0); setBotScore(0);
    setWinner(null); setPlayerDead(false); setRematchState("none");
    startRunSound();
    rafRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function resetToIdle(g: GameState) {
    cancelAnimationFrame(rafRef.current);
    gsRef.current = g;
    phaseRef.current = "idle";
    setPhase("idle"); setScore(0); setBotScore(0);
    setWinner(null); setPlayerDead(false);
    setRematchState("none"); setCountdown(null);
    setShowNextConfirm(false);
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    const cv = canvasRef.current; if (!cv) return;
    renderScene(cv.getContext("2d")!, g);
  }

  function handleNext() {
    findNext();
    resetToIdle(freshState());
  }

  function handleCloseGame() {
    close();
    cancelAnimationFrame(rafRef.current);
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    router.push("/vibe-room/play-zone");
  }

  function handleStartAgain() {
    setRematchState("waiting");
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    setTimeout(() => {
      setRematchState("none");
      phaseRef.current = "countdown";
      setPhase("countdown");
      setCountdown(3);
    }, 1500 + Math.random() * 1000);
  }

  function handleConfirmRematch() {
    setRematchState("none");
    if (rematchTimerRef.current) clearTimeout(rematchTimerRef.current);
    phaseRef.current = "countdown";
    setPhase("countdown");
    setCountdown(3);
  }

  // ── Jump ──────────────────────────────────────────────────────────────────
  const jump = useCallback(() => {
    const g = gsRef.current;
    if (phaseRef.current !== "playing" || !g.playerAlive) return;
    if (g.playerY >= GY - SH - 3) g.playerVY = JUMP_V;
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [jump]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // ── Game loop ─────────────────────────────────────────────────────────────
  function tick() {
    if (phaseRef.current !== "playing") return;
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const g = gsRef.current;

    g.frame++;
    if (g.frame % 180 === 0) g.speed = Math.min(g.speed + 0.35, 14);

    if (g.playerAlive) {
      g.playerVY += GRAVITY; g.playerY += g.playerVY;
      if (g.playerY >= GY - SH) { g.playerY = GY - SH; g.playerVY = 0; }
    }
    if (g.botAlive) {
      g.botVY += GRAVITY; g.botY += g.botVY;
      if (g.botY >= GY - SH) { g.botY = GY - SH; g.botVY = 0; }
      if (g.botJumpCooldown > 0) g.botJumpCooldown--;
      if (g.botJumpCooldown === 0 && g.botY >= GY - SH - 3) {
        let nearest: Cactus | null = null;
        for (const c of g.cacti) {
          if (c.x + c.w > BX && (!nearest || c.x < nearest.x)) nearest = c;
        }
        if (nearest) {
          const dist = nearest.x - BX;
          if (dist < 120 + Math.random() * 50 && dist > 0 && Math.random() < 0.91) {
            g.botVY = JUMP_V; g.botJumpCooldown = 26;
          }
        }
      }
    }

    g.spawnIn--;
    if (g.spawnIn <= 0) {
      const h = 32 + Math.floor(Math.random() * 26);
      const w = 15 + Math.floor(Math.random() * 10);
      g.cacti.push({ x: CW + 10, w, h });
      if (Math.random() < 0.26)
        g.cacti.push({ x: CW + 10 + w + 14 + Math.floor(Math.random() * 8), w: w - 3, h: h - 8 });
      g.spawnIn = Math.floor(65 + Math.random() * 70 - g.speed * 1.5);
    }
    for (const c of g.cacti) c.x -= g.speed;
    g.cacti = g.cacti.filter(c => c.x + c.w > -20);
    for (const c of g.clouds) { c.x -= c.spd; if (c.x + c.w < 0) c.x = CW + c.w; }
    g.groundOffset += g.speed;

    const M = 5;
    for (const c of g.cacti) {
      const cRight = c.x + c.w, cTop = GY - c.h;
      if (g.playerAlive && PX + 5 + M < cRight && PX + 5 + DW - M > c.x && g.playerY + 5 + DH > cTop + M) {
        g.playerAlive = false; g.playerScore = Math.floor(g.frame / 5);
        setPlayerDead(true); setScore(g.playerScore);
        stopRunSound(); playHitSound();
      }
      if (g.botAlive && BX + M < cRight && BX + DW - M > c.x && g.botY + 5 + DH > cTop + M) {
        g.botAlive = false; g.botScore = Math.floor(g.frame / 5); setBotScore(g.botScore);
      }
    }
    if (g.frame % 8 === 0) {
      if (g.playerAlive) { g.playerScore = Math.floor(g.frame / 5); setScore(g.playerScore); }
      if (g.botAlive)    { g.botScore    = Math.floor(g.frame / 5); setBotScore(g.botScore); }
    }

    if (!g.playerAlive || !g.botAlive) {
      stopRunSound();
      phaseRef.current = "done";
      const w: Winner = !g.playerAlive ? "bot" : "player";
      setPhase("done"); setWinner(w);
      setScore(g.playerScore); setBotScore(g.botScore);
      renderScene(ctx, g, stranger?.username ?? "Stranger", w, g.playerScore, g.botScore);
      return;
    }
    renderScene(ctx, g);
    rafRef.current = requestAnimationFrame(tick);
  }

  const resultMap: Record<Winner, { emoji: string; text: string; color: string }> = {
    player: { emoji: "🏆", text: "You win!",              color: "#4ade80" },
    bot:    { emoji: "💀", text: "Your partner wins!", color: "#f87171" },
    draw:   { emoji: "🤝", text: "It's a tie!",           color: "#fbbf24" },
  };

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: "linear-gradient(160deg, #0c1a2e 0%, #0f2240 50%, #0c1a2e 100%)" }}>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5">

        <div className="flex items-center gap-2 mb-4">
          <Link href="/vibe-room/play-zone" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            ← Play Zone
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-white font-semibold">🏃 City Run</span>
        </div>

        {/* StrangerBar — no Next button, Close exits page */}
        <StrangerBar
          matchState={matchState} stranger={stranger} elapsed={elapsed}
          onNext={handleNext} onClose={handleCloseGame}
          hideNext closeLabel="Close Game"
        />

        {/* Score bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, padding:"0 4px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ width:8, height:8, borderRadius:2, background:"#dc2626", display:"inline-block", flexShrink:0 }} />
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:"0.04em" }}>YOU</span>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:20, fontWeight:900, letterSpacing:"0.08em", color: playerDead && winner==="bot" ? "#f87171" : "#f1f5f9", minWidth:58 }}>
              {String(score).padStart(5,"0")}
            </span>
          </div>
          {winner ? (
            <span style={{ fontSize:13, fontWeight:800, color:resultMap[winner].color }}>
              {resultMap[winner].emoji} {resultMap[winner].text}
            </span>
          ) : playerDead ? (
            <span style={{ fontSize:11, color:"#f87171", fontWeight:600 }}>You fell 💀</span>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.18)", fontWeight:700, letterSpacing:"0.12em" }}>VS</span>
              <button
                onClick={toggleSound}
                title={soundOn ? "Mute sound" : "Unmute sound"}
                style={{ background:"none", border:"none", cursor:"pointer", padding:"2px 4px", borderRadius:6, color: soundOn ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)", fontSize:16, lineHeight:1, transition:"color 0.2s" }}
              >
                {soundOn ? "🔊" : "🔇"}
              </button>
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ fontFamily:"'Courier New',monospace", fontSize:20, fontWeight:900, letterSpacing:"0.08em", color:"#818cf8", minWidth:58, textAlign:"right" }}>
              {String(botScore).padStart(5,"0")}
            </span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:"0.04em" }}>
              PARTNER
            </span>
            <span style={{ width:8, height:8, borderRadius:2, background:"#818cf8", display:"inline-block", flexShrink:0 }} />
          </div>
        </div>

        {/* Canvas */}
        <div style={{ borderRadius:16, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 8px 48px rgba(21,101,192,0.22),0 2px 8px rgba(0,0,0,0.5)", marginBottom:10 }}>
          <canvas
            ref={canvasRef} width={CW} height={CH}
            onClick={phase==="playing" ? jump : undefined}
            style={{ width:"100%", display:"block", cursor:phase==="playing" ? "pointer":"default" }}
          />
        </div>

        {/* Hints and action area */}
        {phase === "idle" && matchState !== "connected" && (
          <p style={{ textAlign:"center", fontSize:12, color:"rgba(255,255,255,0.2)", marginTop:2 }}>
            Waiting for a stranger… game starts when they join
          </p>
        )}
        {phase === "playing" && (
          <p style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.18)" }}>
            Space · ↑ · Tap to jump
          </p>
        )}

        {/* Done: rematch waiting */}
        {phase === "done" && rematchState === "waiting" && (
          <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.38)", padding:"12px 0" }}>
            Waiting for @{strangerName} to confirm…
          </p>
        )}

        {/* Done: stranger requested rematch */}
        {phase === "done" && rematchState === "confirming" && (
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:"14px 16px", marginTop:2, textAlign:"center" }}>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", marginBottom:10 }}>
              @{strangerName} wants to play again!
            </p>
            <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
              <button
                onClick={handleConfirmRematch}
                style={{ padding:"8px 24px", borderRadius:20, background:"rgba(74,222,128,0.15)", border:"1px solid rgba(74,222,128,0.35)", color:"#4ade80", fontSize:13, fontWeight:700, cursor:"pointer" }}
              >
                Yes, let's go!
              </button>
              <button
                onClick={() => setRematchState("none")}
                style={{ padding:"8px 24px", borderRadius:20, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer" }}
              >
                No thanks
              </button>
            </div>
          </div>
        )}

        {/* Done: normal action buttons */}
        {phase === "done" && rematchState === "none" && (
          <div style={{ display:"flex", gap:8, marginTop:2 }}>
            <button
              onClick={handleStartAgain}
              style={{ flex:1, padding:"12px", borderRadius:14, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc", fontSize:14, fontWeight:700, cursor:"pointer" }}
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setShowNextConfirm(true)}
              style={{ flex:1, padding:"12px", borderRadius:14, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"white", fontSize:14, fontWeight:700, cursor:"pointer" }}
            >
              Next Stranger →
            </button>
          </div>
        )}

      </main>

      {/* Floating chat — no auth required */}
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

      {/* Next Stranger confirmation overlay */}
      {showNextConfirm && (
        <div style={{
          position:"fixed", inset:0, zIndex:10000,
          background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <div style={{
            background:"#161622", border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:20, padding:"28px 32px", maxWidth:300, width:"90%", textAlign:"center",
            boxShadow:"0 16px 60px rgba(0,0,0,0.8)",
          }}>
            <p style={{ fontSize:16, fontWeight:700, color:"white", marginBottom:8 }}>Find a new stranger?</p>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:22 }}>
              You'll leave this match and search again.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button
                onClick={() => { setShowNextConfirm(false); handleNext(); }}
                style={{ flex:1, padding:"10px", borderRadius:12, background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", fontSize:14, fontWeight:700, cursor:"pointer" }}
              >
                Yes, leave
              </button>
              <button
                onClick={() => setShowNextConfirm(false)}
                style={{ flex:1, padding:"10px", borderRadius:12, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontSize:14, cursor:"pointer" }}
              >
                Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
