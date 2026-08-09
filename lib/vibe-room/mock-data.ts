import type { SecretDrop } from "./types";

export const MOCK_DROPS: SecretDrop[] = [
  {
    id: "1",
    content: "There's this person in my class who always saves me a seat but never says why. I think about it every single day.",
    authorId: null,
    redFlags: 3,
    greenFlags: 47,
    replyCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: "2",
    content: "I matched with someone on a game last night and we talked till 4am about literally nothing. I don't even know their name but I miss them.",
    authorId: null,
    redFlags: 1,
    greenFlags: 89,
    replyCount: 31,
    createdAt: new Date(Date.now() - 1000 * 60 * 23),
  },
  {
    id: "3",
    content: "My situationship texted 'you up?' at 2am and I said no even though I was wide awake. Character development.",
    authorId: null,
    redFlags: 0,
    greenFlags: 214,
    replyCount: 58,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
  },
  {
    id: "4",
    content: "I've been on 3 dates with someone and I still haven't told my friends because I don't want to jinx it.",
    authorId: null,
    redFlags: 2,
    greenFlags: 61,
    replyCount: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "5",
    content: "They said 'I'll call you later' three days ago. I already know the plot twist.",
    authorId: null,
    redFlags: 18,
    greenFlags: 302,
    replyCount: 74,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "6",
    content: "We broke up 6 months ago but I still check their Spotify to see what they're listening to. I need help.",
    authorId: null,
    redFlags: 29,
    greenFlags: 188,
    replyCount: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
];

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
