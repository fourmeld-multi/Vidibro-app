export type DirectoryCategory = "country" | "city" | "language" | "topic";

export type DirectoryItem = {
  slug: string;
  title: string;
  category: DirectoryCategory;
  name: string;
  flag?: string;
  languages: string[];
  peakTimes: string;
  onlineCount: string;
  description: string;
  faqs: Array<{ question: string; answer: string }>;
};

export const DIRECTORY_ITEMS: Record<string, DirectoryItem> = {
  russia: {
    slug: "russia",
    title: "Talk to Strangers in Russia (Free 1-on-1 Video & Voice Chat)",
    category: "country",
    name: "Russia",
    flag: "🇷🇺",
    languages: ["Russian (Русский)", "English"],
    peakTimes: "8 PM – 2 AM MSK",
    onlineCount: "9,840+",
    description:
      "Connect instantly with friendly strangers across Moscow, Saint Petersburg, Novosibirsk, and all over Russia. Vidibro provides fast, anonymous WebRTC video calls, voice chats, and text messaging without needing an account or phone number.\n\nWhether you want to practice your Russian language skills, share cultural experiences, or have a relaxed late-night conversation, Vidibro pairs you with an active stranger in under a second.",
    faqs: [
      {
        question: "Is Vidibro free to use in Russia?",
        answer: "Yes, Vidibro is 100% free with no registration, coin subscriptions, or account requirements.",
      },
      {
        question: "Can I choose to speak Russian?",
        answer: "Yes! Russian (Русский) is one of the top active languages on Vidibro. You can select your preferred chat mode (Video, Voice, or Text) to start talking.",
      },
      {
        question: "Is my privacy protected?",
        answer: "All video and audio streams are P2P WebRTC encrypted directly between your browser and your match, so media never passes through third-party servers.",
      },
    ],
  },
  "russian-chat": {
    slug: "russian-chat",
    title: "Russian Voice & Video Chat with Strangers (Русский Чат)",
    category: "language",
    name: "Russian Language Chat",
    flag: "🇷🇺",
    languages: ["Russian (Русский)"],
    peakTimes: "7 PM – 3 AM MSK",
    onlineCount: "12,150+",
    description:
      "Meet Russian speakers around the globe for real-time 1-on-1 voice calls, video matches, and anonymous text chat. Vidibro's Russian Language Hub lets you practice native conversation, make new friends, and enjoy spontaneous talks without registration.\n\nOur platform operates with WebRTC P2P direct streaming, WhatsApp-style text read receipts, and 24/7 Red Flag user reporting for a safe, high-quality experience.",
    faqs: [
      {
        question: "Do I need to download an app for Russian Chat?",
        answer: "No, Vidibro runs 100% directly inside your mobile or desktop browser without requiring any app download.",
      },
      {
        question: "Can I talk without showing my face?",
        answer: "Yes! You can use Voice Chat mode for faceless audio calls or Text Chat mode for anonymous instant messaging.",
      },
      {
        question: "How fast is matching in Russian Chat?",
        answer: "Matching is practically instant, typically pairing you with a Russian speaker in less than a second.",
      },
    ],
  },
  "united-states": {
    slug: "united-states",
    title: "Talk to Strangers in USA (Free 1-on-1 Video & Voice Match)",
    category: "country",
    name: "United States",
    flag: "🇺🇸",
    languages: ["English", "Spanish"],
    peakTimes: "8 PM – 1 AM EST / PST",
    onlineCount: "14,200+",
    description:
      "Looking to meet people across the US? Vidibro connects you instantly with strangers in New York, California, Texas, and across the United States for 1-on-1 video call, voice chat, and text messaging.\n\nEnjoy anonymous, zero-login video matching with adaptive 600 kbps bitrate capping that keeps streams clear even on mobile 4G/5G connections.",
    faqs: [
      {
        question: "Is Vidibro popular in the United States?",
        answer: "Yes, the US is one of Vidibro's largest active regions with thousands of online users matching 24/7.",
      },
      {
        question: "Do I need to enter a credit card or phone number?",
        answer: "Never. Vidibro requires zero personal data, zero credit cards, and zero registration.",
      },
      {
        question: "How does user moderation work?",
        answer: "Vidibro features a 1-tap Red Flag report button. Reporting an inappropriate user immediately blocks them and finds you a new match.",
      },
    ],
  },
  india: {
    slug: "india",
    title: "Talk to Strangers in India (Free Video, Voice & Text Chat)",
    category: "country",
    name: "India",
    flag: "🇮🇳",
    languages: ["Hindi", "English", "Bengali", "Tamil", "Telugu"],
    peakTimes: "9 PM – 2 AM IST",
    onlineCount: "18,450+",
    description:
      "Connect with friendly people across Mumbai, Delhi, Bengaluru, Kolkata, and all over India. Vidibro offers fast 1-on-1 video calls, faceless voice chat, and text messaging in Hindi, English, and regional languages.\n\nNo app store downloads, zero registration, and lightweight WebRTC streaming optimized for Indian mobile networks.",
    faqs: [
      {
        question: "Can I chat in Hindi on Vidibro?",
        answer: "Yes! Hindi and English are widely spoken by users matching from India on Vidibro.",
      },
      {
        question: "Does Vidibro work on Jio/Airtel 4G mobile networks?",
        answer: "Yes, Vidibro features adaptive bitrate capping (600 kbps) designed specifically to run smoothly on mobile networks.",
      },
      {
        question: "Can I use text chat instead of video?",
        answer: "Yes, you can select Text Chat for anonymous messaging with WhatsApp-style read receipts and photo sharing.",
      },
    ],
  },
  "united-kingdom": {
    slug: "united-kingdom",
    title: "Talk to Strangers in UK (Free Stranger Video Call & Voice)",
    category: "country",
    name: "United Kingdom",
    flag: "🇬🇧",
    languages: ["English"],
    peakTimes: "7 PM – 12 AM GMT",
    onlineCount: "7,900+",
    description:
      "Meet people across London, Manchester, Edinburgh, and the UK. Vidibro pairs you instantly for 1-on-1 video chat, voice calls, and text with zero account creation.",
    faqs: [
      {
        question: "Is Vidibro free in the UK?",
        answer: "Yes, Vidibro is completely free for all users in the UK with zero hidden fees.",
      },
    ],
  },
  canada: {
    slug: "canada",
    title: "Talk to Strangers in Canada (Free 1-on-1 Video Chat)",
    category: "country",
    name: "Canada",
    flag: "🇨🇦",
    languages: ["English", "French"],
    peakTimes: "8 PM – 1 AM EST / PST",
    onlineCount: "6,300+",
    description:
      "Connect with strangers in Toronto, Vancouver, Montreal, and across Canada for 1-on-1 video, audio, and text chat.",
    faqs: [
      {
        question: "Is signup required in Canada?",
        answer: "No, you can launch video or voice chat instantly without signing up.",
      },
    ],
  },
  philippines: {
    slug: "philippines",
    title: "Talk to Strangers in Philippines (Free Pinoy Stranger Chat)",
    category: "country",
    name: "Philippines",
    flag: "🇵🇭",
    languages: ["Tagalog / Filipino", "English"],
    peakTimes: "8 PM – 1 AM PHT",
    onlineCount: "11,200+",
    description:
      "Meet Pinoy strangers online for free 1-on-1 video calls, voice chat, and messaging across Manila, Cebu, and Davao.",
    faqs: [
      {
        question: "Is Vidibro free in the Philippines?",
        answer: "Yes, Vidibro is 100% free with no registration or phone number required.",
      },
    ],
  },
  germany: {
    slug: "germany",
    title: "Talk to Strangers in Germany (Deutscher Random Video Chat)",
    category: "country",
    name: "Germany",
    flag: "🇩🇪",
    languages: ["German (Deutsch)", "English"],
    peakTimes: "8 PM – 1 AM CET",
    onlineCount: "8,150+",
    description:
      "Meet German speakers across Berlin, Munich, and Frankfurt for 1-on-1 video, voice, and text chat.",
    faqs: [
      {
        question: "Is WebRTC encrypted in Germany?",
        answer: "Yes, all audio and video streams use direct WebRTC P2P encryption.",
      },
    ],
  },
  japan: {
    slug: "japan",
    title: "Talk to Strangers in Japan (ランダムビデオチャット)",
    category: "country",
    name: "Japan",
    flag: "🇯🇵",
    languages: ["Japanese (日本語)", "English"],
    peakTimes: "9 PM – 2 AM JST",
    onlineCount: "9,100+",
    description:
      "Connect with strangers in Tokyo, Osaka, and Kyoto for anonymous 1-on-1 video and voice chat.",
    faqs: [
      {
        question: "Can I practice Japanese on Vidibro?",
        answer: "Yes, Japan is a highly active region on Vidibro for language practice and casual talks.",
      },
    ],
  },
  "english-chat": {
    slug: "english-chat",
    title: "Global English Random Chat with Strangers",
    category: "language",
    name: "English Chat",
    flag: "🌐",
    languages: ["English"],
    peakTimes: "24/7 Global Activity",
    onlineCount: "24,800+",
    description:
      "Connect with native and fluent English speakers worldwide for instant 1-on-1 video, audio, and text chat.",
    faqs: [
      {
        question: "Is English chat available 24/7?",
        answer: "Yes, English is the most active language hub on Vidibro around the clock.",
      },
    ],
  },
  "hindi-chat": {
    slug: "hindi-chat",
    title: "Hindi Random Video & Voice Chat (हिंदी में बात करें)",
    category: "language",
    name: "Hindi Chat",
    flag: "🇮🇳",
    languages: ["Hindi (हिंदी)"],
    peakTimes: "8 PM – 2 AM IST",
    onlineCount: "15,600+",
    description:
      "Meet Hindi speakers for free 1-on-1 video calls, voice chat, and messaging with zero signup.",
    faqs: [
      {
        question: "Is Hindi chat free?",
        answer: "Yes, Vidibro is 100% free with no coins or account registration.",
      },
    ],
  },
  "spanish-chat": {
    slug: "spanish-chat",
    title: "Spanish Random Chat with Strangers (Chat en Español)",
    category: "language",
    name: "Spanish Chat",
    flag: "🇪🇸",
    languages: ["Spanish (Español)"],
    peakTimes: "8 PM – 2 AM CET / EST",
    onlineCount: "12,400+",
    description:
      "Connect with Spanish speakers across Spain, Mexico, Argentina, and Colombia for 1-on-1 video and voice calls.",
    faqs: [
      {
        question: "Is Spanish chat active in Latin America?",
        answer: "Yes, Vidibro has high active user numbers across Spain and Latin America.",
      },
    ],
  },
  "night-talks": {
    slug: "night-talks",
    title: "2 AM Late Night Stranger Chat & Voice Call Hub",
    category: "topic",
    name: "Late Night Talks",
    flag: "🌙",
    languages: ["English", "Global"],
    peakTimes: " Midnight – 4 AM Local Time",
    onlineCount: "16,800+",
    description:
      "Can't sleep at night? Connect with other night owls around the globe for relaxed, comforting 1-on-1 voice calls, text chats, and video matches when the world is quiet.",
    faqs: [
      {
        question: "Are night chats safe?",
        answer: "Yes, Vidibro features 24/7 Red Flag reporting and P2P encryption to ensure safe late-night conversations.",
      },
    ],
  },
  "gaming-chat": {
    slug: "gaming-chat",
    title: "Gamer Random Voice & Video Chat Hub",
    category: "topic",
    name: "Gaming Chat",
    flag: "🎮",
    languages: ["English", "Global"],
    peakTimes: "6 PM – 3 AM",
    onlineCount: "11,500+",
    description:
      "Talk with fellow gamers about your favorite games, find gaming squad partners, or hang out over anonymous voice and video calls.",
    faqs: [
      {
        question: "Can I talk about gaming on Vidibro?",
        answer: "Yes! Vidibro's Gaming Hub is popular for casual voice chats while playing games.",
      },
    ],
  },
};

export function getDirectoryItem(slug: string): DirectoryItem | undefined {
  return DIRECTORY_ITEMS[slug];
}

export function getAllDirectorySlugs(): string[] {
  return Object.keys(DIRECTORY_ITEMS);
}
