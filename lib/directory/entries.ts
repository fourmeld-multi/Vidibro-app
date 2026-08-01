import type { DirectoryEntry } from "./types";

/**
 * Seed entries. These three exist to set the quality bar for the remaining
 * pages — a country, one of its cities, and one of its languages — so the
 * hub-and-spoke linking pattern is real and testable before it is scaled.
 *
 * Every fact below is checkable. Peak hours are real local windows, the places
 * exist, the talking points are things people in that market actually discuss,
 * and the connectivity notes describe real network conditions. Anything that
 * cannot be written to that standard for a given market should not become a
 * page.
 */
export const ENTRIES: DirectoryEntry[] = [
  {
    slug: "video-chat-india",
    kind: "country",
    name: "India",
    primaryKeyword: "video chat india",
    title: "Video Chat India — Talk to Indian Strangers Free, No Signup",
    description:
      "Free random video chat with people across India. Match instantly with strangers in Mumbai, Delhi, Kolkata and beyond — no account, no phone number, works on Jio and Airtel.",
    languages: [
      "हिन्दी (Hindi)",
      "বাংলা (Bengali)",
      "தமிழ் (Tamil)",
      "తెలుగు (Telugu)",
      "मराठी (Marathi)",
      "English",
    ],
    peakHours: "21:00 – 01:00 IST",
    timezone: "Asia/Kolkata",
    places: ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune"],
    talkingPoints: [
      "Cricket, and the IPL in particular — during the season it is the default opener with almost anyone",
      "Regional food arguments: Hyderabadi versus Lucknowi biryani is a genuinely contested subject",
      "Film industries beyond Bollywood — Tollywood, Kollywood and Mollywood each have their own following",
      "Festivals, which vary enormously by region: Durga Puja in the east, Onam in Kerala, Navratri in Gujarat",
      "Exam and job-prep culture, which nearly everyone under thirty has an opinion about",
    ],
    connectivityNote:
      "Most people in India will reach you on 4G or 5G rather than fixed broadband, usually on Jio or Airtel. Vidibro caps video at roughly 600 kbps and adapts downward when the connection tightens, so a call holds together on a moving train or in a patchy area — it will look softer rather than freezing.",
    localNote:
      "India spans one time zone but a very wide range of daily rhythms. Metro users tend to come online late, after 21:00 IST, while smaller-city users are often around earlier in the evening. If matching feels slow at 15:00, it is not the queue being broken — it is genuinely quiet.",
    intro: [
      "India is the single largest source of random-chat traffic in the world, and it is not close. That has an obvious practical consequence: at almost any hour there is someone online, and during the late-evening peak the wait between matches is usually a few seconds rather than a few minutes.",
      "What it does not mean is that every conversation will be in the same language. India has twenty-two official languages and Vidibro does not filter by any of them, so a match from Chennai and a match from Chandigarh are genuinely different conversations. Most people default to English or Hindi with a stranger and switch if they find common ground, which happens more often than you would expect.",
      "You do not need an account, a phone number, or an app. The call runs directly between the two browsers over WebRTC, so nothing routes through a server we control and nothing is recorded.",
    ],
    faqs: [
      {
        question: "Is video chat with strangers legal in India?",
        answer:
          "Yes. Using a random video chat service is legal in India, and Vidibro requires no registration. What is illegal anywhere — harassment, sharing sexual content with minors, recording someone without consent — is illegal here too, and is what the report button exists for.",
      },
      {
        question: "How much mobile data does a video call use?",
        answer:
          "Roughly 250–300 MB per hour at our default quality, because video is capped around 600 kbps. A ten-minute conversation costs about 45 MB. Audio-only chat uses closer to 15 MB an hour if you are watching a data limit.",
      },
      {
        question: "Does it work on Jio and Airtel?",
        answer:
          "Yes, on both, including 4G. Vidibro adapts the bitrate as your connection changes rather than dropping the call, so quality softens on a weak signal instead of freezing. Some carrier networks make a direct peer-to-peer connection harder, in which case the call is relayed automatically.",
      },
      {
        question: "Can I talk in Hindi or Bengali instead of English?",
        answer:
          "You can talk in whatever you like — there is no language filter, and no way to guarantee a match speaks yours. In practice most people open in English or Hindi and switch once they find a shared language. If you specifically want a language, our Hindi and Bengali pages explain what to expect.",
      },
      {
        question: "What time of day is busiest in India?",
        answer:
          "Between 21:00 and 01:00 IST, after dinner. Weekday afternoons are noticeably quieter, so if you are waiting a long time at 15:00 the queue is genuinely thin rather than broken.",
      },
      {
        question: "Is my video recorded or stored?",
        answer:
          "No. Calls are peer-to-peer, so the video and audio travel directly between the two browsers. We never see the stream, there is no account to attach it to, and nothing is written to disk.",
      },
    ],
    related: [
      { slug: "video-chat-kolkata", label: "Video chat in Kolkata", relation: "city" },
      { slug: "video-chat-mumbai", label: "Video chat in Mumbai", relation: "city" },
      { slug: "video-chat-delhi", label: "Video chat in Delhi", relation: "city" },
      { slug: "bengali-video-chat", label: "Bengali video chat", relation: "language" },
      { slug: "hindi-video-chat", label: "Hindi video chat", relation: "language" },
      { slug: "audio-chat", label: "voice chat with the camera off", relation: "mode" },
      { slug: "text-chat", label: "text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-bangladesh", label: "Bangladesh", relation: "sibling" },
      { slug: "video-chat-pakistan", label: "Pakistan", relation: "sibling" },
    ],
  },

  {
    slug: "video-chat-kolkata",
    kind: "city",
    name: "Kolkata",
    parent: "India",
    primaryKeyword: "kolkata video chat",
    title: "Kolkata Video Chat — Talk to Strangers in Kolkata Free",
    description:
      "Random video chat with people in Kolkata and across West Bengal. Free, anonymous, no signup — talk in Bengali or English, day or night.",
    languages: ["বাংলা (Bengali)", "हिन्दी (Hindi)", "English"],
    peakHours: "22:00 – 01:30 IST",
    timezone: "Asia/Kolkata",
    places: ["Park Street", "Salt Lake", "College Street", "Howrah", "Ballygunge", "New Town"],
    talkingPoints: [
      "Durga Puja — the city effectively stops for it, and pandal-hopping routes are argued over months in advance",
      "Adda itself: the long, meandering, no-particular-purpose conversation is close to a local art form",
      "Food, specifically where to get the best kathi roll, phuchka, or mishti doi, which is never settled",
      "East Bengal versus Mohun Bagan, a football rivalry older than most European ones",
      "College Street and the second-hand book stalls, if you land on anyone who reads",
    ],
    connectivityNote:
      "Kolkata has solid 4G and expanding 5G coverage, though older parts of the city — around College Street and the Howrah side — can be patchy indoors. Vidibro drops video quality rather than the call when signal dips, so a conversation survives a walk between rooms.",
    localNote:
      "Kolkata runs late even by Indian standards. The busiest window is after 22:00 IST and holds past 01:00, later than the national average. During Durga Puja in autumn, expect activity to shift dramatically — much of the city is out at night rather than online.",
    intro: [
      "Kolkata is a city where talking at length to someone you have just met is close to a civic habit. Adda — the unhurried conversation that goes nowhere in particular and lasts hours — is a genuine local institution, and it makes the city unusually well suited to random chat. People here tend not to end a call after ninety seconds.",
      "Most matches from Kolkata will speak Bengali, and many will switch to English or Hindi without being asked once they realise you do not. There is no language filter on Vidibro, so what you get is whoever is online — which in practice means a mix of students, night-shift workers, and people who simply keep late hours.",
      "No account, no phone number, no download. The call connects browser to browser, and nothing about it is stored.",
    ],
    faqs: [
      {
        question: "Will people in Kolkata speak Bengali or English?",
        answer:
          "Both, usually in the same conversation. Bengali is the first language for most of the city, but English is widely spoken and most people switch easily with a stranger. Hindi is common too, particularly with anyone who has worked outside West Bengal.",
      },
      {
        question: "What is the best time to find people from Kolkata online?",
        answer:
          "After 22:00 IST, and it stays busy past 01:00 — later than most Indian cities. Afternoons are thin. During Durga Puja the pattern breaks completely, since much of the city is out at the pandals rather than at home.",
      },
      {
        question: "Do I need to download an app?",
        answer:
          "No. Vidibro runs in your phone or laptop browser. There is nothing to install and nothing to sign up for — you open the page, allow the camera, and you are in the queue.",
      },
      {
        question: "Is it free?",
        answer:
          "Entirely. No subscription, no credits, no premium tier that unlocks matching. The only cost to you is mobile data, roughly 250–300 MB an hour for video.",
      },
      {
        question: "How do I report someone behaving badly?",
        answer:
          "There is a report button in the top bar during every call. Using it ends the conversation immediately and moves you to a new match. Reports are reviewed — we would rather you use it than sit through something unpleasant.",
      },
      {
        question: "Can I chat without showing my face?",
        answer:
          "Yes. Voice chat pairs you the same way with the camera off entirely, and text chat needs no camera or microphone at all. Both match from the same pool of people.",
      },
    ],
    related: [
      { slug: "video-chat-india", label: "video chat across India", relation: "sibling" },
      { slug: "video-chat-delhi", label: "Delhi", relation: "city" },
      { slug: "video-chat-mumbai", label: "Mumbai", relation: "city" },
      { slug: "video-chat-bangalore", label: "Bangalore", relation: "city" },
      { slug: "bengali-video-chat", label: "Bengali video chat", relation: "language" },
      { slug: "hindi-video-chat", label: "Hindi video chat", relation: "language" },
      { slug: "audio-chat", label: "voice-only chat", relation: "mode" },
      { slug: "text-chat", label: "text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-bangladesh", label: "Bangladesh", relation: "sibling" },
    ],
  },

  {
    slug: "bengali-video-chat",
    kind: "language",
    name: "Bengali",
    primaryKeyword: "bengali video chat",
    title: "Bengali Video Chat — Talk to Strangers in Bangla, Free",
    description:
      "Free video chat in Bengali. Meet Bangla-speaking strangers from West Bengal, Bangladesh and beyond — no signup, no app, video, voice or text.",
    languages: ["বাংলা (Bengali)", "English", "हिन्दी (Hindi)"],
    peakHours: "22:00 – 01:00 IST / 22:30 – 01:30 BST",
    timezone: "Asia/Dhaka",
    places: ["Kolkata", "Dhaka", "Chittagong", "Sylhet", "Howrah", "Siliguri"],
    talkingPoints: [
      "Rabindranath Tagore, whose songs are still sung on both sides of the border and are common ground almost immediately",
      "The Bengali new year, Pohela Boishakh, celebrated in April in both West Bengal and Bangladesh",
      "Food that crosses the border — ilish, kosha mangsho, and an unresolvable argument about who makes better mishti",
      "Cricket, though with a split loyalty that is worth handling lightly",
      "Differences in the language itself: Dhaka and Kolkata Bengali diverge enough to be a conversation of its own",
    ],
    connectivityNote:
      "Bengali speakers split across two countries with different network conditions. Indian users are typically on Jio or Airtel 4G/5G; Bangladeshi users on Grameenphone or Robi, where speeds vary more outside Dhaka and Chittagong. Vidibro adapts to whichever end is weaker, so a cross-border call settles at a quality both sides can hold.",
    localNote:
      "Bengali is spoken by well over 200 million people across two countries, which makes it one of the most widely spoken languages in the world and an unusually large pool for a language-specific match. West Bengal and Bangladesh are thirty minutes apart, so the evening peaks overlap almost exactly.",
    intro: [
      "Bengali is spoken by more than 200 million people, which makes it roughly the sixth most spoken language on earth and a far larger pool than most language-specific chat pages can offer. It also spans a border: West Bengal in India and Bangladesh, with sizeable communities in the UK, the Gulf and North America.",
      "That split is the interesting part. A Bangla conversation on Vidibro is as likely to reach Dhaka or Sylhet as Kolkata, and the two varieties differ enough in vocabulary and rhythm that people frequently end up discussing the language itself. It is a reliable opener when nothing else presents itself.",
      "Vidibro does not filter by language, so this page is about what to expect rather than a guarantee. In practice, matching during the shared evening peak — the two regions are only thirty minutes apart — is when you are most likely to land on another Bangla speaker.",
    ],
    faqs: [
      {
        question: "Can I really find Bengali speakers on a random chat site?",
        answer:
          "Often, yes, particularly during the evening peak across India and Bangladesh. There is no language filter, so it is not guaranteed on any single match — but with over 200 million speakers, Bengali comes up far more than most languages.",
      },
      {
        question: "Will I be matched with people from Bangladesh or India?",
        answer:
          "Both. Vidibro does not filter by country, so a Bangla conversation might reach Kolkata, Dhaka, Chittagong or Sylhet. Many people find the differences between Dhaka and Kolkata Bengali become the conversation.",
      },
      {
        question: "Is Bengali video chat free?",
        answer:
          "Yes, completely. No account, no subscription, no credits. You need a browser and a camera, and nothing else.",
      },
      {
        question: "Can I use it without a camera?",
        answer:
          "Yes. Voice chat matches you the same way with the camera off, and text chat needs neither camera nor microphone. Voice is popular with people who want to practise or hear the language without being on video.",
      },
      {
        question: "Is it safe to chat with strangers in Bengali?",
        answer:
          "The same rules apply as in any language: share no personal details, no full name, no address, no financial information. Calls are peer-to-peer and never recorded, and a report button is available throughout every conversation.",
      },
      {
        question: "What is the best time to find Bangla speakers?",
        answer:
          "Between 22:00 and 01:00 local time. India and Bangladesh are only thirty minutes apart, so the two evening peaks overlap almost completely — that overlap is the busiest window for Bengali conversation.",
      },
    ],
    related: [
      { slug: "video-chat-kolkata", label: "Kolkata", relation: "city" },
      { slug: "video-chat-dhaka", label: "Dhaka", relation: "city" },
      { slug: "video-chat-chittagong", label: "Chittagong", relation: "city" },
      { slug: "hindi-video-chat", label: "Hindi video chat", relation: "language" },
      { slug: "tamil-video-chat", label: "Tamil video chat", relation: "language" },
      { slug: "audio-chat", label: "Bengali voice chat", relation: "mode" },
      { slug: "text-chat", label: "Bangla text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-india", label: "India", relation: "sibling" },
      { slug: "video-chat-bangladesh", label: "Bangladesh", relation: "sibling" },
    ],
  },
];

export const ENTRY_BY_SLUG: Record<string, DirectoryEntry> = Object.fromEntries(
  ENTRIES.map((e) => [e.slug, e])
);

export function getEntry(slug: string) {
  return ENTRY_BY_SLUG[slug];
}

export function getAllSlugs() {
  return ENTRIES.map((e) => e.slug);
}

/**
 * Only links to pages that exist should render. Everything else in `related`
 * is a placeholder for a page not yet written — rendering it would put a 404 on
 * a live page, which is worse than a shorter link list.
 */
const REAL_ROUTES = new Set(["audio-chat", "text-chat", "video-chat", "omegle-alternative"]);

export function resolvableRelated(entry: DirectoryEntry) {
  return entry.related.filter(
    (r) => ENTRY_BY_SLUG[r.slug] !== undefined || REAL_ROUTES.has(r.slug)
  );
}

/**
 * Directory entries live under /directory/{slug}; the standalone routes
 * (/audio-chat, /omegle-alternative, …) sit at the top level. Getting this
 * wrong silently produces 404s on every cross-link, so it lives in one place.
 */
export function hrefFor(slug: string) {
  if (ENTRY_BY_SLUG[slug]) return `/directory/${slug}`;
  return `/${slug}`;
}
