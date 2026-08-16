"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

/* ── Types & Interfaces ────────────────────────────── */
type Phase = "idle" | "aiming" | "moving" | "cpu_wait" | "cpu_move" | "round_end" | "game_over";

interface Pen {
  x: number; y: number; a: number;
  vx: number; vy: number; va: number;
  out: boolean;
}

interface Vector2D { x: number; y: number }

interface GS {
  p1: Pen; p2: Pen;
  phase: Phase; lastPhase: "moving" | "cpu_move" | null;
  drag: Vector2D | null;
  contact: Vector2D | null;
  s1: number; s2: number;
  msg: string;
  tmr: ReturnType<typeof setTimeout> | null;
  clackAt: number;
}

const mkP = (x: number, y: number, a: number): Pen => ({
  x, y, a, vx: 0, vy: 0, va: 0, out: false,
});

/* ── Geometry & Rigid Body Physics ─────────────────── */
function getPenDimensions(cw: number, ch: number) {
  const base = Math.min(cw, ch);
  const PL = Math.max(38, Math.min(52, base * 0.082));
  const PR = PL * 0.11;
  return { PL, PR };
}

function getPenCorners(p: Pen, PL: number, PR: number): Vector2D[] {
  const cos = Math.cos(p.a), sin = Math.sin(p.a);
  const ux = cos, uy = sin;
  const vx = -sin, vy = cos;
  return [
    { x: p.x - PL * ux - PR * vx, y: p.y - PL * uy - PR * vy },
    { x: p.x + PL * ux - PR * vx, y: p.y + PL * uy - PR * vy },
    { x: p.x + PL * ux + PR * vx, y: p.y + PL * uy + PR * vy },
    { x: p.x - PL * ux + PR * vx, y: p.y - PL * uy + PR * vx },
  ];
}

function getAxes(corners: Vector2D[]): Vector2D[] {
  const axes: Vector2D[] = [];
  for (let i = 0; i < 2; i++) {
    const p1 = corners[i], p2 = corners[i + 1];
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    const len = Math.hypot(edge.x, edge.y) || 1;
    axes.push({ x: -edge.y / len, y: edge.x / len });
  }
  return axes;
}

function projectCorners(corners: Vector2D[], axis: Vector2D): { min: number; max: number } {
  let min = corners[0].x * axis.x + corners[0].y * axis.y;
  let max = min;
  for (let i = 1; i < corners.length; i++) {
    const proj = corners[i].x * axis.x + corners[i].y * axis.y;
    if (proj < min) min = proj;
    if (proj > max) max = proj;
  }
  return { min, max };
}

/* SAT Collision Resolution (Fixes Orbiting Bug) */
function resolvePenCollision(a: Pen, b: Pen, PL: number, PR: number): boolean {
  if (a.out || b.out) return false;

  const cA = getPenCorners(a, PL, PR);
  const cB = getPenCorners(b, PL, PR);
  const axes = [...getAxes(cA), ...getAxes(cB)];

  let minOverlap = Infinity;
  let mtv: Vector2D = { x: 0, y: 0 };

  for (const axis of axes) {
    const projA = projectCorners(cA, axis);
    const projB = projectCorners(cB, axis);

    const overlap = Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);
    if (overlap <= 0) return false;

    if (overlap < minOverlap) {
      minOverlap = overlap;
      const dir = (b.x - a.x) * axis.x + (b.y - a.y) * axis.y;
      mtv = { x: axis.x * (dir < 0 ? -1 : 1), y: axis.y * (dir < 0 ? -1 : 1) };
    }
  }

  // Position separation
  const sepMargin = minOverlap + 0.6;
  a.x -= mtv.x * sepMargin * 0.5;
  a.y -= mtv.y * sepMargin * 0.5;
  b.x += mtv.x * sepMargin * 0.5;
  b.y += mtv.y * sepMargin * 0.5;

  // Impulse physics
  const nx = mtv.x, ny = mtv.y;
  const contactX = (a.x + b.x) / 2;
  const contactY = (a.y + b.y) / 2;

  const raX = contactX - a.x, raY = contactY - a.y;
  const rbX = contactX - b.x, rbY = contactY - b.y;

  const vA_cX = a.vx - a.va * raY, vA_cY = a.vy + a.va * raX;
  const vB_cX = b.vx - b.va * rbY, vB_cY = b.vy + b.va * rbX;

  const relVx = vA_cX - vB_cX;
  const relVy = vA_cY - vB_cY;
  const velAlongNormal = relVx * nx + relVy * ny;

  if (velAlongNormal > 0) return true;

  const I_A = (PL * PL + PR * PR) / 3;
  const I_B = I_A;
  const mA = 1, mB = 1;

  const raCrossN = raX * ny - raY * nx;
  const rbCrossN = rbX * ny - rbY * nx;

  const invMassSum = (1 / mA) + (1 / mB) + (raCrossN * raCrossN) / I_A + (rbCrossN * rbCrossN) / I_B;
  const restitution = 0.38;

  const j = -(1 + restitution) * velAlongNormal / invMassSum;

  a.vx += (j * nx) / mA; a.vy += (j * ny) / mA; a.va += (raCrossN * j) / I_A;
  b.vx -= (j * nx) / mB; b.vy -= (j * ny) / mB; b.va -= (rbCrossN * j) / I_B;

  // Contact Friction
  const tx = -ny, ty = nx;
  const velAlongTangent = relVx * tx + relVy * ty;
  const raCrossT = raX * ty - raY * tx;
  const rbCrossT = rbX * ty - rbY * tx;

  const invMassTangentSum = (1 / mA) + (1 / mB) + (raCrossT * raCrossT) / I_A + (rbCrossT * rbCrossT) / I_B;
  const frictionCoef = 0.42;
  let jt = -velAlongTangent / invMassTangentSum;
  jt = Math.max(-frictionCoef * j, Math.min(frictionCoef * j, jt));

  a.vx += (jt * tx) / mA; a.vy += (jt * ty) / mA; a.va += (raCrossT * jt) / I_A;
  b.vx -= (jt * tx) / mB; b.vy -= (jt * ty) / mB; b.va -= (rbCrossT * jt) / I_B;

  const MAX_VA = 0.22;
  a.va = Math.max(-MAX_VA, Math.min(MAX_VA, a.va));
  b.va = Math.max(-MAX_VA, Math.min(MAX_VA, b.va));

  return true;
}

/* Round Rect Helper */
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, -Math.PI / 2);
  ctx.closePath();
}

/* ── Fullscreen Rendering Functions ────────────────── */

function drawClassroomScene(ctx: CanvasRenderingContext2D, cw: number, ch: number, g: GS) {
  const wallH = ch * 0.28; // Reduced green wall gap!

  // 1. Green Classroom Wall
  const wallGrad = ctx.createLinearGradient(0, 0, 0, wallH);
  wallGrad.addColorStop(0, "#2c3b2c");
  wallGrad.addColorStop(1, "#212d21");
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, cw, wallH);

  // 2. Blackboard
  const boardM = Math.max(8, cw * 0.03);
  const boardY = Math.max(4, ch * 0.012);
  const boardW = cw - boardM * 2;
  const boardH = Math.min(130, wallH * 0.68); // Fits neatly

  // Outer wood frame
  ctx.fillStyle = "#3e2410";
  ctx.fillRect(boardM - 4, boardY - 4, boardW + 8, boardH + 8);
  ctx.fillStyle = "#1e1208";
  ctx.fillRect(boardM - 2, boardY - 2, boardW + 4, boardH + 4);

  // Board surface
  ctx.fillStyle = "#1b251d";
  ctx.fillRect(boardM, boardY, boardW, boardH);
  ctx.strokeStyle = "rgba(255,255,255,0.07)";
  ctx.lineWidth = 1;
  ctx.strokeRect(boardM + 4, boardY + 4, boardW - 8, boardH - 8);

  // Orange "PEN FIGHT Reynolds 045" Top-Left Badge
  ctx.save();
  ctx.fillStyle = "#d9731e";
  rr(ctx, boardM + 6, boardY + 6, Math.min(95, boardW * 0.28), 22, 5);
  ctx.fill();
  ctx.fillStyle = "#ffffff"; ctx.font = "bold 9px sans-serif";
  ctx.fillText("PEN FIGHT", boardM + 12, boardY + 16);
  ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.font = "7px sans-serif";
  ctx.fillText("Reynolds 045", boardM + 12, boardY + 23);

  // Top-Right Music Icon
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  rr(ctx, boardM + boardW - 24, boardY + 6, 18, 18, 4);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fff"; ctx.font = "9px sans-serif";
  ctx.fillText("🎵", boardM + boardW - 20, boardY + 18);
  ctx.restore();

  // Chalkboard Hand-written Notes & Scoreboard
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "10px 'Comic Sans MS', cursive, sans-serif";
  ctx.fillText("Thought for the Day :", boardM + boardW * 0.36, boardY + 16);
  ctx.font = "italic 9px 'Comic Sans MS', cursive, sans-serif";
  ctx.fillText('"Practice makes a man perfect"', boardM + boardW * 0.39, boardY + 28);

  // Left Score Chalk Text
  ctx.font = "bold 11px sans-serif"; ctx.fillStyle = "#e5c07b";
  ctx.fillText("PEN FIGHT", boardM + 8, boardY + 44);
  ctx.font = "8px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("best of 5", boardM + 74, boardY + 44);
  ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(boardM + 8, boardY + 48); ctx.lineTo(boardM + 110, boardY + 48); ctx.stroke();

  // Chalk Tally Scores
  ctx.font = "bold 15px sans-serif"; ctx.fillStyle = "#ffffff";
  ctx.fillText(`T t t t  ${g.s1}`, boardM + 8, boardY + 68);
  ctx.fillText(`bunty   ${g.s2}`, boardM + 8, boardY + 88);

  // Chalk Sketches
  ctx.strokeStyle = "rgba(255,255,255,0.38)"; ctx.lineWidth = 1;
  const sx = boardM + boardW * 0.54, sy = boardY + 44;
  ctx.beginPath();
  ctx.moveTo(sx, sy + 25); ctx.lineTo(sx + 20, sy); ctx.lineTo(sx + 40, sy + 25); ctx.closePath();
  ctx.stroke();

  ctx.font = "8px cursive"; ctx.fillStyle = "rgba(255,255,255,0.38)";
  ctx.fillText("Map of India", boardM + boardW * 0.72, boardY + 62);
  ctx.fillText("H.W Ch.4 Q.1-5", boardM + boardW * 0.72, boardY + 18);
  ctx.fillText("Monitor : Rinku", boardM + boardW * 0.72, boardY + 90);
  ctx.restore();

  // 3. Tiled Floor (Middle to Bottom Background)
  ctx.fillStyle = "#d4cdbc";
  ctx.fillRect(0, wallH, cw, ch - wallH);

  // Tile Grid Lines
  ctx.strokeStyle = "rgba(130,120,105,0.25)";
  ctx.lineWidth = 1;
  const tileSize = Math.max(28, cw / 10);
  for (let x = 0; x < cw; x += tileSize) {
    ctx.beginPath(); ctx.moveTo(x, wallH); ctx.lineTo(x, ch); ctx.stroke();
  }
  for (let y = wallH; y < ch; y += tileSize * 0.75) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke();
  }

  // 4. Wooden Bench Back Mounted on Wall
  const tableTopY = ch * 0.28; // Table starts right below blackboard
  const topW = cw * 0.78;
  const topX1 = (cw - topW) / 2;
  ctx.fillStyle = "#5c3716";
  ctx.fillRect(topX1 - 10, tableTopY - 20, topW + 20, 20);
  ctx.fillStyle = "#3a200a";
  ctx.fillRect(topX1 - 10, tableTopY - 20, topW + 20, 4);

  // 5. 3D Wooden Plate Mounted IN CENTER OF GREEN WALL
  if (g.phase !== "game_over") {
    const gapTop = boardY + boardH;
    const badgeY = gapTop + (tableTopY - gapTop) / 2 - 14;
    const bx = cw / 2 - 55, bw = 110, bh = 28;

    ctx.save();
    // 3D Shadow on green wall
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    rr(ctx, bx + 2, badgeY + 4, bw, bh, 6); ctx.fill();

    // 3D Wooden Plate Bevel Outer Frame (Dark Mahogany Wood)
    ctx.fillStyle = "#3a1e0b";
    rr(ctx, bx - 2, badgeY - 2, bw + 4, bh + 4, 7); ctx.fill();

    // Wooden Plate Surface (Rich Oak Grain Gradient)
    const woodGrad = ctx.createLinearGradient(bx, badgeY, bx, badgeY + bh);
    woodGrad.addColorStop(0, "#7c451b");
    woodGrad.addColorStop(0.5, "#653613");
    woodGrad.addColorStop(1, "#4b250a");
    ctx.fillStyle = woodGrad;
    rr(ctx, bx, badgeY, bw, bh, 5); ctx.fill();

    // Golden / Brass Inner Inset Border Line
    ctx.strokeStyle = "rgba(235, 185, 120, 0.45)";
    ctx.lineWidth = 1;
    rr(ctx, bx + 2.5, badgeY + 2.5, bw - 5, bh - 5, 3.5); ctx.stroke();

    // Corner Brass Rivets/Screws
    ctx.fillStyle = "#d4a755";
    [ [bx + 5, badgeY + 6], [bx + bw - 5, badgeY + 6],
      [bx + 5, badgeY + bh - 6], [bx + bw - 5, badgeY + bh - 6] ].forEach(([rx, ry]) => {
      ctx.beginPath(); ctx.arc(rx, ry, 1.4, 0, Math.PI * 2); ctx.fill();
    });

    // White Letters: "your turn" or "partner turn"
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1;

    const turnText = (g.phase === "cpu_wait" || g.phase === "cpu_move") ? "partner turn" : "your turn";
    ctx.fillText(turnText, cw / 2, badgeY + 18);
    ctx.restore();
  }
}

/* Draw Perspective Wooden Desk & Shadow (Increased Height!) */
function drawWoodenDesk(ctx: CanvasRenderingContext2D, cw: number, ch: number) {
  const tableTopY = ch * 0.28; // Table starts higher up (reduced green gap!)
  const tableBotY = ch * 0.90; // Table extends nicely down (increased desk height!)
  const topW = cw * 0.78;
  const botW = cw * 0.92;

  const topX1 = (cw - topW) / 2, topX2 = topX1 + topW;
  const botX1 = (cw - botW) / 2, botX2 = botX1 + botW;

  // 1. Table Shadow on Floor
  ctx.fillStyle = "rgba(0,0,0,0.36)";
  ctx.beginPath();
  ctx.moveTo(topX1 - 14, tableTopY + 10);
  ctx.lineTo(topX2 + 14, tableTopY + 10);
  ctx.lineTo(botX2 + 18, tableBotY + 22);
  ctx.lineTo(botX1 - 18, tableBotY + 22);
  ctx.closePath();
  ctx.fill();

  // 2. Desk Legs
  ctx.fillStyle = "#1c1208";
  ctx.fillRect(botX1 + 12, tableBotY, 24, ch * 0.07);
  ctx.fillRect(botX2 - 36, tableBotY, 24, ch * 0.07);

  // 3. Desk Front Apron Thickness
  ctx.fillStyle = "#4a2910";
  ctx.beginPath();
  ctx.moveTo(botX1, tableBotY);
  ctx.lineTo(botX2, tableBotY);
  ctx.lineTo(botX2 + 2, tableBotY + 12);
  ctx.lineTo(botX1 - 2, tableBotY + 12);
  ctx.closePath();
  ctx.fill();

  // 4. Desk Surface Trapezoid
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(topX1, tableTopY);
  ctx.lineTo(topX2, tableTopY);
  ctx.lineTo(botX2, tableBotY);
  ctx.lineTo(botX1, tableBotY);
  ctx.closePath();

  // Wood Texture Gradient
  const woodGrad = ctx.createLinearGradient(0, tableTopY, 0, tableBotY);
  woodGrad.addColorStop(0, "#df9849");
  woodGrad.addColorStop(0.3, "#d48d3e");
  woodGrad.addColorStop(0.7, "#c97e2f");
  woodGrad.addColorStop(1, "#b5681c");
  ctx.fillStyle = woodGrad;
  ctx.fill();

  // Wood Grain Lines
  ctx.strokeStyle = "rgba(90,45,10,0.11)";
  ctx.lineWidth = 1.2;
  for (let y = tableTopY + 10; y < tableBotY; y += 14) {
    ctx.beginPath();
    ctx.moveTo(topX1, y);
    ctx.bezierCurveTo(cw * 0.35, y + 4, cw * 0.65, y - 3, botX2, y + 2);
    ctx.stroke();
  }

  // Sheen Highlight
  const sheen = ctx.createRadialGradient(cw * 0.5, (tableTopY + tableBotY) / 2, 30, cw * 0.5, (tableTopY + tableBotY) / 2, cw * 0.55);
  sheen.addColorStop(0, "rgba(255,242,215,0.18)");
  sheen.addColorStop(1, "rgba(255,242,215,0)");
  ctx.fillStyle = sheen;
  ctx.fill();

  // Pencil Carvings & Scratches
  ctx.strokeStyle = "rgba(75,35,5,0.36)";
  ctx.fillStyle = "rgba(75,35,5,0.36)";
  ctx.font = "italic bold 11px sans-serif";

  // Carved text
  ctx.fillText("Raju", botX1 + 30, tableBotY - 80);
  ctx.fillText("AJ", botX2 - 65, tableBotY - 45);
  ctx.fillText("golu", topX1 + 35, tableTopY + 110);
  ctx.fillText("18 ROCKS", topX2 - 95, tableTopY + 80);

  // Tic-tac-toe `#`
  const tx = topX1 + 55, ty = tableTopY + 40;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(tx - 10, ty - 4); ctx.lineTo(tx + 10, ty - 4);
  ctx.moveTo(tx - 10, ty + 4); ctx.lineTo(tx + 10, ty + 4);
  ctx.moveTo(tx - 4, ty - 10); ctx.lineTo(tx - 4, ty + 10);
  ctx.moveTo(tx + 4, ty - 10); ctx.lineTo(tx + 4, ty + 10);
  ctx.stroke();

  // Cup stain ring
  ctx.beginPath();
  ctx.arc(topX2 - 80, tableTopY + 50, 18, 0, Math.PI * 2);
  ctx.stroke();

  // Scratches & Arrow
  [[cw * 0.3, tableTopY + 60, cw * 0.55, tableTopY + 75],
   [cw * 0.45, tableTopY + 160, cw * 0.68, tableTopY + 170],
   [cw * 0.2, tableBotY - 130, cw * 0.38, tableBotY - 115]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  // Table rim bevel
  ctx.strokeStyle = "#f3d4a4"; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = "#5a300a"; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
}

/* Draw 3D Pen Artwork */
function drawPen(ctx: CanvasRenderingContext2D, pen: Pen, isPlayer: boolean, isTurn: boolean, PL: number, PR: number) {
  if (pen.out) return;

  ctx.save();
  ctx.translate(pen.x, pen.y);
  ctx.rotate(pen.a);

  const L = PL, R = PR, W2 = R * 2;

  // Drop Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.42)";
  ctx.shadowBlur = 7;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = "rgba(0,0,0,0.01)";
  rr(ctx, -L, -R, L * 2, W2, R);
  ctx.fill();
  ctx.restore();

  if (isPlayer) {
    // Player 1: Reynolds 045 (White body, translucent blue cap)
    const bodyGrad = ctx.createLinearGradient(0, -R, 0, R);
    bodyGrad.addColorStop(0, "#e8edf5");
    bodyGrad.addColorStop(0.3, "#ffffff");
    bodyGrad.addColorStop(0.7, "#f0f4fa");
    bodyGrad.addColorStop(1, "#c5d0e0");
    ctx.fillStyle = bodyGrad;
    rr(ctx, -L, -R, L * 2, W2, R);
    ctx.fill();

    // Cap
    const capGrad = ctx.createLinearGradient(0, -R, 0, R);
    capGrad.addColorStop(0, "#082e80");
    capGrad.addColorStop(0.3, "#1a6bd4");
    capGrad.addColorStop(0.7, "#1251ab");
    capGrad.addColorStop(1, "#061a50");
    ctx.fillStyle = capGrad;
    rr(ctx, -L, -R, L * 0.45, W2, R);
    ctx.fill();

    // Ink Window
    ctx.fillStyle = "rgba(200,225,255,0.85)";
    rr(ctx, -L + L * 0.55, -R + 1.2, L * 0.5, W2 - 2.4, 1.2);
    ctx.fill();

    // Blue Grip Ribs
    ctx.fillStyle = capGrad;
    rr(ctx, L - L * 0.55, -R - 0.5, L * 0.45, W2 + 1, R);
    ctx.fill();

    // Nib Tip
    const nibGrad = ctx.createLinearGradient(0, -R, 0, R);
    nibGrad.addColorStop(0, "#999"); nibGrad.addColorStop(0.5, "#ffffff"); nibGrad.addColorStop(1, "#666");
    ctx.fillStyle = nibGrad;
    ctx.beginPath();
    ctx.moveTo(L - 4, -R * 0.65);
    ctx.lineTo(L + 11, 0);
    ctx.lineTo(L - 4, R * 0.65);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(L + 10, 0, 1.2, 0, Math.PI * 2); ctx.fill();

    // Clip
    ctx.fillStyle = "#d0d8e0";
    ctx.fillRect(-L + 2, -R - 1.6, L * 0.65, 1.5);

    // Turn Glow
    if (isTurn) {
      ctx.shadowColor = "rgba(66,165,245,0.75)";
      ctx.shadowBlur = 16;
      ctx.strokeStyle = "rgba(66,165,245,0.65)";
      ctx.lineWidth = 1.6;
      rr(ctx, -L, -R, L * 2, W2, R);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  } else {
    // Player 2 / CPU: Black Body, Blue Cap, Red Accent
    const bodyGrad = ctx.createLinearGradient(0, -R, 0, R);
    bodyGrad.addColorStop(0, "#151515");
    bodyGrad.addColorStop(0.3, "#333333");
    bodyGrad.addColorStop(0.7, "#222222");
    bodyGrad.addColorStop(1, "#080808");
    ctx.fillStyle = bodyGrad;
    rr(ctx, -L, -R, L * 2, W2, R);
    ctx.fill();

    // Cap
    ctx.fillStyle = "#0c0c0c";
    rr(ctx, -L, -R, L * 0.45, W2, R);
    ctx.fill();

    // Red Accent Band
    const redGrad = ctx.createLinearGradient(0, -R, 0, R);
    redGrad.addColorStop(0, "#990000"); redGrad.addColorStop(0.5, "#ff3333"); redGrad.addColorStop(1, "#660000");
    ctx.fillStyle = redGrad;
    rr(ctx, L - L * 0.6, -R - 0.4, 8, W2 + 0.8, 1.2);
    ctx.fill();

    // Grip
    ctx.fillStyle = "#1e1e1e";
    rr(ctx, L - L * 0.42, -R - 0.5, L * 0.4, W2 + 1, R);
    ctx.fill();

    // Nib
    const nibGrad = ctx.createLinearGradient(0, -R, 0, R);
    nibGrad.addColorStop(0, "#777"); nibGrad.addColorStop(0.5, "#eee"); nibGrad.addColorStop(1, "#444");
    ctx.fillStyle = nibGrad;
    ctx.beginPath();
    ctx.moveTo(L - 4, -R * 0.65);
    ctx.lineTo(L + 11, 0);
    ctx.lineTo(L - 4, R * 0.65);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(L + 10, 0, 1.2, 0, Math.PI * 2); ctx.fill();

    // Clip
    ctx.fillStyle = "#0066cc";
    ctx.fillRect(-L + 2, -R - 1.6, L * 0.65, 1.5);
  }

  // Highlight Reflection Streak
  const streak = ctx.createLinearGradient(-L, 0, L, 0);
  streak.addColorStop(0, "rgba(255,255,255,0)");
  streak.addColorStop(0.2, "rgba(255,255,255,0.3)");
  streak.addColorStop(0.8, "rgba(255,255,255,0.3)");
  streak.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = streak;
  rr(ctx, -L + 4, -R, L * 2 - 8, R * 0.5, 0.4);
  ctx.fill();

  ctx.restore();
}

/* ── Draw Aiming Slingshot & Trajectory Arrow ─────── */
function drawAimTrajectory(ctx: CanvasRenderingContext2D, g: GS) {
  if (g.phase !== "aiming" || !g.drag || !g.contact) return;

  const contact = g.contact;
  const drag = g.drag;

  const pullX = drag.x - contact.x;
  const pullY = drag.y - contact.y;
  const dist = Math.hypot(pullX, pullY);

  if (dist < 3) return;

  // Opposite Launch Vector
  const launchX = -pullX;
  const launchY = -pullY;

  ctx.save();

  // 1. Elastic Slingshot Pull Line (Contact Point to Finger)
  ctx.strokeStyle = "rgba(255, 90, 60, 0.85)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(contact.x, contact.y);
  ctx.lineTo(drag.x, drag.y);
  ctx.stroke();

  // Drag handle circle
  ctx.fillStyle = "rgba(255, 90, 60, 0.9)";
  ctx.beginPath();
  ctx.arc(drag.x, drag.y, 7, 0, Math.PI * 2);
  ctx.fill();

  // Force Aura Ring around contact point
  const powerRatio = Math.min(dist / 120, 1);
  ctx.strokeStyle = `rgba(255, 210, 0, ${0.4 + powerRatio * 0.5})`;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(contact.x, contact.y, 16 + powerRatio * 14, 0, Math.PI * 2);
  ctx.stroke();

  // 2. Trajectory Dotted Line (Launching FORWARD in Opposite Direction)
  const lineLen = Math.min(dist * 2.2, 200);
  const targetX = contact.x + (launchX / dist) * lineLen;
  const targetY = contact.y + (launchY / dist) * lineLen;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(contact.x, contact.y);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();

  // Arrow Head at Trajectory Tip
  const angle = Math.atan2(launchY, launchX);
  const arrowLen = 14;
  ctx.setLineDash([]);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(targetX, targetY);
  ctx.lineTo(targetX - arrowLen * Math.cos(angle - Math.PI / 6), targetY - arrowLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(targetX - arrowLen * Math.cos(angle + Math.PI / 6), targetY - arrowLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/* ── Realistic Action Audio Engine (No Ambient Noise) ─ */
type AC = AudioContext & { webkitAudioContext?: never };

function makeActionAudio() {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)() as AC;

  // Single clean percussive flick & hit sound
  function playFlick() {
    try {
      const t = ctx.currentTime;
      const len = Math.floor(ctx.sampleRate * 0.07);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1800;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      src.connect(hp); hp.connect(g); g.connect(ctx.destination);
      src.start(t);
    } catch (e) { void e; }
  }

  return {
    playFlick,
    playClack: playFlick, // Use the exact same 1st sound when hitting
    resume: () => ctx.state === "suspended" && ctx.resume()
  };
}

/* ── Main Full-Screen Component ───────────────────── */
export default function PenFightPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const sizeRef = useRef({ w: 400, h: 700 });
  const [muted, setMuted] = useState(false);

  const G = useRef<GS>({
    p1: mkP(200, 560, -0.1),
    p2: mkP(200, 370, 0.1),
    phase: "idle", lastPhase: null, drag: null, contact: null, s1: 0, s2: 0,
    msg: "👉 Touch ANY part of your white pen & pull back to flick!",
    tmr: null, clackAt: 0,
  });

  const audio = useRef<ReturnType<typeof makeActionAudio> | null>(null);
  const bgImg = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/pen-fight.png";
    img.onload = () => { bgImg.current = img; };
  }, []);

  // Resize canvas to fill container
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      sizeRef.current = { w, h };
      if (cvs.current) { cvs.current.width = w; cvs.current.height = h; }

      const g = G.current;
      const tableTopY = h * 0.45;
      const tableBotY = h * 0.88;
      if (g.phase === "idle") {
        if (g.p1.y < tableTopY || g.p1.y > tableBotY) g.p1.y = tableBotY - 55;
        if (g.p2.y < tableTopY || g.p2.y > tableBotY) g.p2.y = tableTopY + 55;
        g.p1.x = w / 2;
        g.p2.x = w / 2;
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function initAudio() {
    if (audio.current || muted) return;
    try { audio.current = makeActionAudio(); } catch (e) { void e; }
  }

  function resetRound() {
    const g = G.current;
    const w = sizeRef.current.w, h = sizeRef.current.h;
    const tableTopY = h * 0.45;
    const tableBotY = h * 0.88;

    if (g.tmr) { clearTimeout(g.tmr); g.tmr = null; }
    g.p1 = mkP(w / 2 + (Math.random() - 0.5) * (w * 0.20), tableBotY - 55 + (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 0.5);
    g.p2 = mkP(w / 2 + (Math.random() - 0.5) * (w * 0.20), tableTopY + 55 + (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 0.5);
    g.phase = "idle"; g.lastPhase = null; g.drag = null; g.contact = null;
    g.msg = "Your turn — pull back & release!";
  }

  function endRound() {
    const g = G.current; const { p1, p2 } = g;
    let scored = false;

    if (p1.out && !p2.out) {
      g.s2++; g.msg = "You fell off the table! CPU scores 😅"; scored = true;
    } else if (p2.out && !p1.out) {
      g.s1++; g.msg = "CPU fell off! You score 🎉"; scored = true;
    } else if (p1.out && p2.out) {
      g.msg = "Both pens fell off! Resetting round..."; scored = true;
    }

    if (g.s1 >= 3 || g.s2 >= 3) {
      g.phase = "game_over";
      g.msg = g.s1 >= 3 ? `🏆 YOU WIN ${g.s1}–${g.s2}!` : `💻 CPU WINS ${g.s2}–${g.s1}. Try again!`;
      return;
    }

    if (scored) {
      g.phase = "round_end";
      g.tmr = setTimeout(resetRound, 1500);
      return;
    }

    if (g.lastPhase === "moving") {
      g.phase = "cpu_wait"; g.msg = "CPU thinking... 🤔";
      g.tmr = setTimeout(cpuFlick, 750 + Math.random() * 550);
    } else {
      g.phase = "idle"; g.msg = "Your turn — pull back & release!";
    }
  }

  function cpuFlick() {
    const g = G.current; if (g.phase !== "cpu_wait") return;
    const { p1, p2 } = g;

    const ang = Math.atan2(p1.y - p2.y, p1.x - p2.x) + (Math.random() - 0.5) * 0.35;
    const pwr = 5.5 + Math.random() * 3.5;

    p2.vx = Math.cos(ang) * pwr;
    p2.vy = Math.sin(ang) * pwr;
    p2.va = (Math.random() - 0.5) * 0.15;

    g.phase = "cpu_move"; g.msg = "CPU attacks! 💥";
    if (!muted) audio.current?.playFlick();
  }

  /* Animation Loop */
  useEffect(() => {
    let alive = true;
    function tick() {
      if (!alive) return;
      const c = cvs.current;
      if (c) {
        const ctx = c.getContext("2d")!;
        const cw = c.width, ch = c.height;
        const g = G.current;
        const { PL, PR } = getPenDimensions(cw, ch);

        const moving = g.phase === "moving" || g.phase === "cpu_move";

        if (moving) {
          const { p1, p2 } = g;

          p1.x += p1.vx; p1.y += p1.vy; p1.a += p1.va;
          p2.x += p2.vx; p2.y += p2.vy; p2.a += p2.va;

          const FRIC = 0.938, AFRIC = 0.88;
          p1.vx *= FRIC; p1.vy *= FRIC; p1.va *= AFRIC;
          p2.vx *= FRIC; p2.vy *= FRIC; p2.va *= AFRIC;

          // Collision Resolution
          const hit = resolvePenCollision(p1, p2, PL, PR);
          if (hit) {
            const now = Date.now();
            if (now - g.clackAt > 400) {
              g.clackAt = now;
              if (!muted) audio.current?.playClack();
            }
          }

          // Table boundaries (28% to 90%)
          const tableTopY = ch * 0.45;
          const tableBotY = ch * 0.88;
          const topW = cw * 0.82, botW = cw * 1.0;
          const topX1 = (cw - topW) / 2, topX2 = topX1 + topW;
          const botX1 = (cw - botW) / 2, botX2 = botX1 + botW;

          function checkOff(p: Pen) {
            if (p.out) return true;
            if (p.y < tableTopY || p.y > tableBotY) return true;
            const ratio = (p.y - tableTopY) / (tableBotY - tableTopY);
            const lx = topX1 + (botX1 - topX1) * ratio;
            const rx = topX2 + (botX2 - topX2) * ratio;
            return p.x < lx - 10 || p.x > rx + 10;
          }

          if (!p1.out && checkOff(p1)) { p1.out = true; p1.vx = p1.vy = p1.va = 0; }
          if (!p2.out && checkOff(p2)) { p2.out = true; p2.vx = p2.vy = p2.va = 0; }

          const s1 = Math.hypot(p1.vx, p1.vy), s2 = Math.hypot(p2.vx, p2.vy);
          if ((s1 < 0.12 && s2 < 0.12 && Math.abs(p1.va) < 0.008 && Math.abs(p2.va) < 0.008) || (p1.out && p2.out)) {
            p1.vx = p1.vy = p1.va = 0; p2.vx = p2.vy = p2.va = 0;
            g.lastPhase = g.phase as "moving" | "cpu_move";
            g.phase = "round_end";
            endRound();
          }
        }

        // Render Everything to fill Screen
        ctx.clearRect(0, 0, cw, ch);
        if (bgImg.current) {
          ctx.drawImage(bgImg.current, 0, 0, cw, ch);
        } else {
          ctx.fillStyle = "#2c3b2c";
          ctx.fillRect(0, 0, cw, ch);
        }
        drawPen(ctx, g.p2, false, false, PL, PR);
        drawPen(ctx, g.p1, true, g.phase === "idle", PL, PR);
        drawAimTrajectory(ctx, g);
      }

      raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  useEffect(() => {
    const el = cvs.current!;
    if (!el) return;
    const fn = (e: TouchEvent) => { if (G.current.phase === "aiming") e.preventDefault(); };
    el.addEventListener("touchmove", fn, { passive: false });
    return () => el.removeEventListener("touchmove", fn);
  }, []);

  function getPos(e: React.MouseEvent | React.TouchEvent): Vector2D {
    const c = cvs.current!, r = c.getBoundingClientRect();
    const cl = "touches" in e ? e.changedTouches[0] : e;
    return { x: cl.clientX - r.left, y: cl.clientY - r.top };
  }

  function isTouchOnPen(pos: Vector2D, p: Pen): boolean {
    const { PL, PR } = getPenDimensions(sizeRef.current.w, sizeRef.current.h);
    const dx = pos.x - p.x;
    const dy = pos.y - p.y;
    const cos = Math.cos(p.a), sin = Math.sin(p.a);
    const localX = dx * cos + dy * sin;
    const localY = -dx * sin + dy * cos;
    return Math.abs(localX) <= PL + 14 && Math.abs(localY) <= PR + 14;
  }

  function onDown(e: React.MouseEvent | React.TouchEvent) {
    initAudio(); if (!muted) audio.current?.resume();
    const g = G.current; if (g.phase !== "idle") return;
    const pos = getPos(e);

    if (isTouchOnPen(pos, g.p1)) {
      g.contact = { x: pos.x, y: pos.y };
      g.drag = { x: pos.x, y: pos.y };
      g.phase = "aiming";
    }
  }

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    const g = G.current; if (g.phase !== "aiming" || !g.drag) return;
    const pos = getPos(e);
    g.drag = { x: pos.x, y: pos.y };
  }

  function onUp() {
    const g = G.current; if (g.phase !== "aiming" || !g.drag || !g.contact) return;
    const p = g.p1, contact = g.contact, drag = g.drag;

    const pullX = drag.x - contact.x;
    const pullY = drag.y - contact.y;
    const dist = Math.hypot(pullX, pullY);

    g.drag = null; g.contact = null;

    if (dist > 6) {
      const launchX = -pullX;
      const launchY = -pullY;
      const MAX_V = 9.5;
      const pwr = Math.min(dist / 14, MAX_V);

      p.vx = (launchX / dist) * pwr;
      p.vy = (launchY / dist) * pwr;

      const offsetX = contact.x - p.x;
      const offsetY = contact.y - p.y;
      const torque = offsetX * launchY - offsetY * launchX;
      const MAX_VA = 0.22;
      p.va = Math.max(-MAX_VA, Math.min(MAX_VA, (torque / dist) * 0.003));

      g.phase = "moving"; g.msg = "Pen launched! 💨";
      if (!muted) audio.current?.playFlick();
    } else {
      g.phase = "idle";
    }
  }

  return (
    <div ref={containerRef} className="w-full h-screen fixed inset-0 overflow-hidden bg-[#212d21] select-none touch-none flex flex-col">
      {/* Top Dedicated Navigation Header Bar */}
      <header className="w-full bg-[#1b251d] border-b border-white/10 px-4 py-2.5 flex items-center justify-between z-30 shrink-0 shadow-md">
        <Link
          href="/vibe-room/play-zone"
          className="text-white/80 hover:text-white text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/10 transition-all flex items-center gap-1.5"
        >
          ← Play Zone
        </Link>

        <div className="text-sm font-black text-amber-300 tracking-wide">
          ✏️ PEN FIGHT
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setMuted(!muted)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-xs text-white transition-all"
            title={muted ? "Unmute Sound" : "Mute Sound"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
          {/* Close Direct Exit Button */}
          <Link
            href="/vibe-room/play-zone"
            className="w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-500 border border-red-400/30 flex items-center justify-center text-xs font-bold text-white transition-all"
            title="Exit Game"
          >
            ✕
          </Link>
        </div>
      </header>

      {/* Canvas Container */}
      <div className="flex-1 w-full relative">
        <canvas
          ref={cvs}
          className="w-full h-full block cursor-pointer"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        />
      </div>

      {/* Game Over Overlay */}
      {G.current.phase === "game_over" && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="text-2xl font-black text-amber-300 mb-2">{G.current.msg}</div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { const g = G.current; g.s1 = 0; g.s2 = 0; resetRound(); }}
              className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-black text-sm shadow-lg transition-all transform active:scale-95"
            >
              Play Again 🔄
            </button>
            <Link
              href="/vibe-room/play-zone"
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Exit to Play Zone
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
