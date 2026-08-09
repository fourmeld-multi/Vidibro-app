import type { SecretDrop, NightOwlMessage, NightOwlPrompt } from "./types";

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

export const NIGHT_OWL_PROMPTS: NightOwlPrompt[] = [
  { id: "p1", mood: "chill", text: "What's your comfort show right now?" },
  { id: "p2", mood: "chill", text: "Rate your day 1–10 but explain the decimal." },
  { id: "p3", mood: "chill", text: "What song is living rent free in your head?" },
  { id: "p4", mood: "flirt", text: "Describe your type in three emojis only." },
  { id: "p5", mood: "flirt", text: "What's something attractive that isn't physical?" },
  { id: "p6", mood: "flirt", text: "Would you rather: know someone likes you, or let them figure it out?" },
  { id: "p7", mood: "deep-talk", text: "What's a belief you held 3 years ago that's completely changed?" },
  { id: "p8", mood: "deep-talk", text: "When was the last time you felt genuinely understood?" },
  { id: "p9", mood: "deep-talk", text: "What are you proud of that nobody knows about?" },
];

export const MOCK_NIGHT_OWL_MESSAGES: NightOwlMessage[] = [
  {
    id: "n1",
    mood: "chill",
    content: "Currently rewatching Severance for the 3rd time and I still don't fully understand it but I don't care.",
    authorName: "quiet_moth",
    authorId: null,
    likes: 34,
    createdAt: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "n2",
    mood: "chill",
    content: "My day was a solid 6.3. The 0.3 is because I found a really good parking spot.",
    authorName: "sleepy_panda",
    authorId: null,
    likes: 89,
    createdAt: new Date(Date.now() - 1000 * 60 * 11),
  },
  {
    id: "n3",
    mood: "flirt",
    content: "🧠💬🫠 — that's my type. Overthinks, talks too much, and is a little unhinged. send help.",
    authorName: "velvet_void",
    authorId: null,
    likes: 142,
    createdAt: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    id: "n4",
    mood: "flirt",
    content: "I find it attractive when someone is passionate about a random niche thing. Like bro tell me about your deep sea fish obsession.",
    authorName: "neon_ghost",
    authorId: null,
    likes: 217,
    createdAt: new Date(Date.now() - 1000 * 60 * 35),
  },
  {
    id: "n5",
    mood: "deep-talk",
    content: "Three years ago I thought being busy meant being important. Now I think it just means you're bad at saying no.",
    authorName: "midnight_ink",
    authorId: null,
    likes: 301,
    createdAt: new Date(Date.now() - 1000 * 60 * 52),
  },
  {
    id: "n6",
    mood: "deep-talk",
    content: "Last time I felt understood was at 2am on a phone call I still think about. We haven't spoken in months.",
    authorName: "static_wave",
    authorId: null,
    likes: 188,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.2),
  },
  {
    id: "n7",
    mood: "chill",
    content: "Blinding Lights has been stuck in my head for 4 days. I'm starting to think it's just part of my brain now.",
    authorName: "fog_signal",
    authorId: null,
    likes: 56,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "n8",
    mood: "flirt",
    content: "Letting them figure it out slowly is way more fun. The tension is literally the whole point.",
    authorName: "amber_static",
    authorId: null,
    likes: 274,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
  },
  {
    id: "n9",
    mood: "deep-talk",
    content: "I taught myself guitar during lockdown and never told anyone. I play for about 20 minutes every night. That's mine.",
    authorName: "hollow_echo",
    authorId: null,
    likes: 412,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
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
