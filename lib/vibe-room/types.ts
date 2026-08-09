export type Zone = "secret-drop" | "play-zone" | "night-owl";

export interface VibeUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface SecretDrop {
  id: string;
  content: string;
  authorId: string | null;
  redFlags: number;
  greenFlags: number;
  replyCount: number;
  createdAt: Date;
  userRedFlagged?: boolean;
  userGreenFlagged?: boolean;
}

export interface DropReply {
  id: string;
  dropId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface DirectMessage {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export type AuthMode = "login" | "register";

export interface AuthState {
  user: VibeUser | null;
  isLoading: boolean;
}
