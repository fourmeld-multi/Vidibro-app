/**
 * The single RTCDataChannel ("vidibro-main") carries every peer-to-peer
 * feature — chat, reactions, mini-games, and speech subtitles. The signaling
 * server never sees any of this; it only ever relays SDP/ICE.
 *
 * Every message on the wire is one of these envelopes. `type` is the sole
 * discriminator consumers subscribe by — each feature only ever registers a
 * listener for its own `type`, so there's no risk of collision even though
 * everything shares one channel.
 */

export type MessageType = "chat" | "reaction" | "game" | "subtitle" | "system";

export interface Envelope<T = unknown> {
  type: MessageType;
  ts: number;
  /** Monotonically increasing per-sender counter — matters most for `game`
   * messages, where move ordering has to be unambiguous. */
  seq: number;
  payload: T;
}

export interface ChatPayload {
  msgId?: string;
  ackId?: string;
  text?: string;
  imageUrl?: string;
  sticker?: string;
}

export type ReactionId = "boom" | "wow" | "lol" | "heart" | "fire";

export interface ReactionPayload {
  reactionId: ReactionId;
}

export interface SubtitlePayload {
  text: string;
  isFinal: boolean;
}

export type GameName = "tic-tac-toe" | "rps" | "reaction-tap";
export type GameAction =
  | "invite"
  | "accept"
  | "decline"
  | "move"
  | "reveal"
  | "state"
  | "reset"
  | "forfeit";

export interface GamePayload<D = unknown> {
  game: GameName;
  action: GameAction;
  data: D;
}

export interface SystemPayload {
  event: "typing" | "left" | "ping";
}

// ---- Tic-Tac-Toe ----
export type Cell = "X" | "O" | null;
export interface TicTacToeMoveData {
  cellIndex: number;
  player: "X" | "O";
}
export interface TicTacToeStateData {
  board: Cell[];
  currentTurn: "X" | "O";
  winner: "X" | "O" | "draw" | null;
}

// ---- Rock-Paper-Scissors ----
export type RpsChoice = "rock" | "paper" | "scissors";
export interface RpsCommitData {
  commitHash: string;
}
export interface RpsRevealData {
  choice: RpsChoice;
  nonce: string;
}
// "host"/"guest" are absolute (WebRTC-initiator/receiver roles), not
// relative to whoever's computing it — a relative "me"/"opponent" would be
// interpreted backwards by whichever side didn't send the message.
export interface RpsStateData {
  winner: "host" | "guest" | "draw" | null;
}

// ---- Reaction Speed Tap ----
export interface ReactionTapCountdownData {
  goAt: number; // future Date.now()-comparable timestamp both peers schedule against
}
export interface ReactionTapMoveData {
  reactionTimeMs: number;
}
export interface ReactionTapStateData {
  winner: "host" | "guest" | "draw" | null;
}

let seqCounter = 0;

/** Builds a ready-to-send envelope, stamping ts/seq automatically. */
export function makeEnvelope<T>(type: MessageType, payload: T): Envelope<T> {
  seqCounter += 1;
  return { type, ts: Date.now(), seq: seqCounter, payload };
}

export function isEnvelope(value: unknown): value is Envelope {
  return (
    !!value &&
    typeof value === "object" &&
    "type" in value &&
    "ts" in value &&
    "seq" in value &&
    "payload" in value
  );
}
