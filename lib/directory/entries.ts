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
  {
    slug: "video-chat-bangladesh",
    kind: "country",
    name: "Bangladesh",
    primaryKeyword: "video chat bangladesh",
    title: "Video Chat Bangladesh — Talk to Bangladeshi Strangers Free",
    description:
      "Free random video chat with people across Bangladesh. Match with strangers in Dhaka, Chittagong and Sylhet — no signup, works on Grameenphone and Robi.",
    languages: ["বাংলা (Bengali)", "English", "সিলেটি (Sylheti)"],
    peakHours: "22:30 – 01:30 BST",
    timezone: "Asia/Dhaka",
    places: ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Cox's Bazar"],
    talkingPoints: [
      "Cricket, which occupies a place here closer to religion than sport — a Bangladesh–India match stops the country",
      "Pohela Boishakh, the Bengali new year in April, celebrated on a scale that surprises people who have not seen it",
      "Food: ilish with mustard, and the long-running argument over whether Dhaka or Kolkata does Bengali cooking better",
      "Rickshaw art, which is genuinely a recognised folk-art form and something people are proud of",
      "The Sylhet connection to Britain — a large share of the UK's Bangladeshi community traces back to that one region",
    ],
    connectivityNote:
      "Most people connect on mobile through Grameenphone, Robi or Banglalink. 4G is solid across Dhaka and Chittagong but thins out in rural districts, and evening congestion is real. Vidibro drops video quality rather than the call, so a conversation survives a weak signal by getting softer.",
    localNote:
      "Bangladesh runs thirty minutes ahead of India, so its evening peak overlaps almost exactly with West Bengal's — which is why Bangla conversations connect so readily across the border. Ramadan shifts the pattern significantly: activity moves much later, well past midnight.",
    intro: [
      "Bangladesh has one of the youngest populations in the world — the median age is under thirty — and near-universal mobile internet. That combination produces an unusually active late-night queue for a country of its size.",
      "Nearly everyone here speaks Bengali, which makes it one of the few countries where a language-specific conversation is close to guaranteed rather than a matter of luck. English is common among students and city professionals, and many people switch without being asked once they realise you do not speak Bangla.",
      "The other thing worth knowing is how close the border is in practice. Bangladesh runs thirty minutes ahead of India, so its evening peak lands almost exactly on West Bengal's, and cross-border Bangla conversations happen constantly without anyone arranging them. The differences between Dhaka and Kolkata Bengali — in vocabulary, in rhythm — usually become the conversation itself.",
      "There is nothing to install and no account to create. The call runs directly between the two browsers, and nothing about it is stored on our side.",
    ],
    faqs: [
      { question: "Will people from Bangladesh speak English?", answer: "Many will, particularly students and anyone working in Dhaka or Chittagong. Bengali is the first language for almost everyone, so expect conversations to open in Bangla and switch if needed." },
      { question: "Does it work on Grameenphone and Robi?", answer: "Yes, on both, and on Banglalink. 4G handles video comfortably in the cities. In rural areas or during evening congestion the picture softens rather than the call dropping." },
      { question: "How much data does a video call use?", answer: "Around 250–300 MB an hour, since video is capped near 600 kbps. Voice-only chat is closer to 15 MB an hour, which matters if you are on a small data pack." },
      { question: "What time is busiest in Bangladesh?", answer: "Between 22:30 and 01:30 BST. Bangladesh is thirty minutes ahead of India, so its peak overlaps almost exactly with West Bengal's — good news if you want a Bangla conversation." },
      { question: "Can I chat with people in Kolkata from Dhaka?", answer: "Often, yes. There is no country filter, and the shared evening peak means cross-border Bangla conversations are common. The differences between Dhaka and Kolkata Bengali usually become the conversation." },
      { question: "Is it free and anonymous?", answer: "Both. No account, no phone number, no payment. Calls are peer-to-peer and never recorded." },
    ],
    related: [
      { slug: "video-chat-dhaka", label: "Dhaka", relation: "city" },
      { slug: "video-chat-chittagong", label: "Chittagong", relation: "city" },
      { slug: "video-chat-sylhet", label: "Sylhet", relation: "city" },
      { slug: "bengali-video-chat", label: "Bengali video chat", relation: "language" },
      { slug: "hindi-video-chat", label: "Hindi video chat", relation: "language" },
      { slug: "audio-chat", label: "voice chat with the camera off", relation: "mode" },
      { slug: "text-chat", label: "text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-india", label: "India", relation: "sibling" },
      { slug: "video-chat-pakistan", label: "Pakistan", relation: "sibling" },
    ],
  },

  {
    slug: "video-chat-pakistan",
    kind: "country",
    name: "Pakistan",
    primaryKeyword: "video chat pakistan",
    title: "Video Chat Pakistan — Talk to Pakistani Strangers Free",
    description:
      "Free random video chat with people across Pakistan. Meet strangers in Karachi, Lahore and Islamabad — no signup, no app, works on Jazz and Zong.",
    languages: ["اردو (Urdu)", "English", "پنجابی (Punjabi)", "پشتو (Pashto)"],
    peakHours: "21:00 – 01:00 PKT",
    timezone: "Asia/Karachi",
    places: ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Peshawar"],
    talkingPoints: [
      "Cricket, and specifically the long argument about whether the current side is better than the 1992 one",
      "Karachi versus Lahore biryani, which is a genuinely serious dispute and a reliable way to start one",
      "Coke Studio, which turned classical and folk music into something a global audience actually listens to",
      "Truck art — the decorated trucks are a real craft tradition with regional styles people can identify",
      "The northern areas: Hunza, Skardu and the Karakoram, which most Pakistanis will talk about at length",
    ],
    connectivityNote:
      "Jazz, Zong and Telenor carry most traffic, with 4G widespread in the major cities and patchier elsewhere. Fixed broadband is less common than in neighbouring markets, so expect mobile connections. Video adapts downward on a weak signal instead of dropping the call.",
    localNote:
      "Urdu and Hindi are close enough in conversation that Pakistani and north Indian users often understand each other without either switching to English — one of the more interesting things that happens on a service with no country filter. Ramadan moves activity much later into the night.",
    intro: [
      "Pakistan is a large, young, heavily mobile-first market, and its late-evening queue reflects that. Most people you meet will be on a phone rather than a laptop, usually after nine at night.",
      "Urdu is the shared language across the country, though Punjabi, Pashto and Sindhi are first languages for millions. English is widely spoken in cities and in education, so conversations tend to move between languages easily.",
      "The most interesting thing about matching here is unplanned. Urdu and Hindi are mutually intelligible in ordinary conversation, so a Pakistani user and a north Indian user frequently find they can simply talk, with no shared third language needed and no arrangement made. Two people whose countries have a difficult history discover in the first ten seconds that they understand each other perfectly.",
      "Nothing is installed and no account is created. The call runs directly between the two browsers, so nothing passes through a server we control, and nothing is recorded.",
    ],
    faqs: [
      { question: "Is random video chat allowed in Pakistan?", answer: "Using the service is legal and requires no registration. Some networks restrict certain sites at times; Vidibro runs in a normal browser over standard web protocols. Conduct that is illegal offline is illegal here too, and is what reporting is for." },
      { question: "Will people speak Urdu or English?", answer: "Both, often in the same sentence. Urdu is the common language nationally, English is widespread in cities and education. Punjabi and Pashto are first languages for many." },
      { question: "Can I talk to people in India from Pakistan?", answer: "Yes — there is no country filter. Urdu and Hindi are close enough in speech that these conversations often work without switching to English at all." },
      { question: "Does it work on Jazz and Zong?", answer: "Yes, and on Telenor. 4G in the major cities handles video fine. On a weaker signal the picture softens rather than the call ending." },
      { question: "What time do most Pakistani users come online?", answer: "Between 21:00 and 01:00 PKT. During Ramadan the pattern shifts considerably later, with activity continuing well past midnight." },
      { question: "Do I need to give a phone number?", answer: "No. There is no account, no phone number and no email. Nothing identifies you between one conversation and the next." },
    ],
    related: [
      { slug: "video-chat-karachi", label: "Karachi", relation: "city" },
      { slug: "video-chat-lahore", label: "Lahore", relation: "city" },
      { slug: "video-chat-islamabad", label: "Islamabad", relation: "city" },
      { slug: "urdu-video-chat", label: "Urdu video chat", relation: "language" },
      { slug: "hindi-video-chat", label: "Hindi video chat", relation: "language" },
      { slug: "audio-chat", label: "voice-only chat", relation: "mode" },
      { slug: "text-chat", label: "text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-india", label: "India", relation: "sibling" },
      { slug: "video-chat-bangladesh", label: "Bangladesh", relation: "sibling" },
    ],
  },

  {
    slug: "video-chat-philippines",
    kind: "country",
    name: "the Philippines",
    primaryKeyword: "video chat philippines",
    title: "Video Chat Philippines — Talk to Filipino Strangers Free",
    description:
      "Free random video chat with Filipinos. Meet people in Manila, Cebu and Davao instantly — no signup, no download, English widely spoken.",
    languages: ["Filipino / Tagalog", "English", "Cebuano / Bisaya", "Ilocano"],
    peakHours: "20:00 – 00:30 PHT",
    timezone: "Asia/Manila",
    places: ["Manila", "Quezon City", "Cebu", "Davao", "Makati", "Baguio"],
    talkingPoints: [
      "Basketball, which is closer to a national obsession than a pastime — the NBA is followed as closely as the PBA",
      "Karaoke, genuinely inescapable, and a subject almost anyone will engage with",
      "Food that surprises visitors: adobo, sisig, halo-halo, and a serious sweet tooth",
      "Working abroad — a large share of families have someone overseas, which makes video calling emotionally familiar here in a way it is not everywhere",
      "Regional identity: Manila, Cebu and Davao think of themselves as quite different places, and will say so",
    ],
    connectivityNote:
      "Globe and Smart carry most traffic, and mobile data is the norm rather than fixed broadband. Speeds have improved sharply but remain uneven between metro Manila and the provinces, and typhoon season causes genuine outages. Video quality adapts downward rather than the call dropping.",
    localNote:
      "English proficiency here is among the highest in Asia, which makes the Philippines one of the easiest markets to hold a conversation in regardless of where you are from. The queue fills earlier than in South Asia — from about 20:00 PHT — and thins after midnight.",
    intro: [
      "The Philippines is consistently among the heaviest social-media-using countries in the world, and it shows in how readily people here take to random chat. Conversations tend to start warmly and go on longer than the global average.",
      "English is not a second language here so much as a parallel one — it is used in schooling, business and media, and most people switch into it without being asked. That makes this one of the least frustrating markets to match into if you speak no local language.",
      "Filipino, based on Tagalog, is the national language, but Cebuano is the first language for millions in the Visayas and Mindanao, and people are quick to point out that the two are genuinely different languages rather than dialects of one.",
      "There is also a cultural reason video calling lands well here. A large share of Filipino families have someone working overseas, which means calling a distant face on a screen is an ordinary, emotionally familiar act rather than a novelty. No account, no download, nothing recorded.",
    ],
    faqs: [
      { question: "Do Filipinos on video chat speak English?", answer: "Overwhelmingly yes. English proficiency in the Philippines is among the highest in Asia and it is used in schooling and media, so most conversations can happen entirely in English." },
      { question: "What time are most Filipino users online?", answer: "From about 20:00 to 00:30 PHT. The queue fills earlier here than in South Asia and thins after midnight." },
      { question: "Does it work on Globe and Smart?", answer: "Yes. Most people connect on mobile data rather than fixed broadband. Speeds are better in metro Manila than the provinces, and the video quality adjusts rather than the call dropping." },
      { question: "Is Tagalog the same as Filipino?", answer: "Close but not identical — Filipino is the standardised national language, built on Tagalog. Cebuano or Bisaya is a genuinely different language and the first language for millions in the Visayas and Mindanao." },
      { question: "Is it free?", answer: "Yes, with no account and no payment of any kind. The only cost is mobile data." },
      { question: "How do I report someone?", answer: "A report button sits in the top bar during every call. It ends the conversation immediately and moves you to a new match, and reports are reviewed." },
    ],
    related: [
      { slug: "video-chat-manila", label: "Manila", relation: "city" },
      { slug: "video-chat-cebu", label: "Cebu", relation: "city" },
      { slug: "video-chat-davao", label: "Davao", relation: "city" },
      { slug: "tagalog-video-chat", label: "Tagalog video chat", relation: "language" },
      { slug: "cebuano-video-chat", label: "Cebuano video chat", relation: "language" },
      { slug: "audio-chat", label: "voice-only chat", relation: "mode" },
      { slug: "text-chat", label: "text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-indonesia", label: "Indonesia", relation: "sibling" },
      { slug: "video-chat-india", label: "India", relation: "sibling" },
    ],
  },

  {
    slug: "video-chat-mumbai",
    kind: "city",
    name: "Mumbai",
    parent: "India",
    primaryKeyword: "mumbai video chat",
    title: "Mumbai Video Chat — Talk to Strangers in Mumbai Free",
    description:
      "Random video chat with people in Mumbai. Free, anonymous, no signup — meet strangers from Bandra to Andheri in Hindi, Marathi or English.",
    languages: ["हिन्दी (Hindi)", "मराठी (Marathi)", "English", "ગુજરાતી (Gujarati)"],
    peakHours: "22:00 – 01:30 IST",
    timezone: "Asia/Kolkata",
    places: ["Bandra", "Andheri", "Colaba", "Dadar", "Juhu", "Powai"],
    talkingPoints: [
      "The local trains, which are less transport than a shared ordeal everyone has an opinion about",
      "Ganesh Chaturthi, when the whole city reorganises itself around the processions for ten days",
      "Vada pav and where to get it — a debate with genuinely regional loyalties inside the city",
      "The monsoon, which floods the city every year and which people discuss with a mix of dread and affection",
      "Film industry proximity: almost everyone has a story about someone they know working on a set",
    ],
    connectivityNote:
      "Mumbai has among the best mobile coverage in India, with widespread 5G. The exception is the trains — coverage is genuinely unreliable along stretches of the local lines, which is where an adaptive video call earns its keep by softening rather than ending.",
    localNote:
      "Mumbai keeps later hours than most of India, partly because commutes are long and evenings start late. The queue is at its fullest after 22:00 IST and holds well past one in the morning.",
    intro: [
      "Mumbai is India's most linguistically mixed city, and matching here reflects that. Hindi and Marathi are both common, Gujarati is widespread in parts of the city, and English is the default for a lot of younger professionals — often several of them inside one conversation.",
      "It is also a city of long days. Commutes eat hours, evenings start late, and the result is that Mumbai's chat queue peaks later than most of the country and stays busy well past midnight.",
      "The city's geography shapes the conversations too. Mumbai is dense in a way few places are, and people are used to talking to strangers in close quarters — on trains, in queues, at chai stalls — which seems to translate into a lower barrier to talking to one on a screen.",
      "No account, no phone number, nothing installed. The call connects browser to browser and nothing is recorded.",
    ],
    faqs: [
      { question: "What language do people in Mumbai use on video chat?", answer: "Usually Hindi or English, often both. Marathi is the state language and common in conversation, and Gujarati is widespread in parts of the city. Most people switch easily with a stranger." },
      { question: "When is Mumbai busiest on Vidibro?", answer: "After 22:00 IST, holding past 01:00. Later than most Indian cities — long commutes push the whole evening back." },
      { question: "Will video calls work on a Mumbai local train?", answer: "Sometimes, and imperfectly. Coverage along the local lines is genuinely unreliable. The call adapts by lowering quality rather than disconnecting, so it survives more of the journey than it otherwise would." },
      { question: "Do I need an app?", answer: "No. It runs in your browser. Nothing to install, nothing to sign up for." },
      { question: "Is it really anonymous?", answer: "Yes. No account, no phone number, no profile. Calls run directly between browsers and are never recorded, so there is nothing to look up afterwards." },
      { question: "Can I use it without the camera?", answer: "Yes. Voice chat matches you the same way with the camera off, and text chat needs no camera or microphone at all." },
    ],
    related: [
      { slug: "video-chat-delhi", label: "Delhi", relation: "city" },
      { slug: "video-chat-kolkata", label: "Kolkata", relation: "city" },
      { slug: "video-chat-bangalore", label: "Bangalore", relation: "city" },
      { slug: "hindi-video-chat", label: "Hindi video chat", relation: "language" },
      { slug: "marathi-video-chat", label: "Marathi video chat", relation: "language" },
      { slug: "audio-chat", label: "voice-only chat", relation: "mode" },
      { slug: "text-chat", label: "text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-india", label: "India", relation: "sibling" },
      { slug: "video-chat-pakistan", label: "Pakistan", relation: "sibling" },
    ],
  },

  {
    slug: "video-chat-delhi",
    kind: "city",
    name: "Delhi",
    parent: "India",
    primaryKeyword: "delhi video chat",
    title: "Delhi Video Chat — Talk to Strangers in Delhi Free",
    description:
      "Random video chat with people in Delhi and NCR. Free, anonymous, no signup — meet strangers in Hindi, Punjabi or English.",
    languages: ["हिन्दी (Hindi)", "English", "ਪੰਜਾਬੀ (Punjabi)", "اردو (Urdu)"],
    peakHours: "21:30 – 01:00 IST",
    timezone: "Asia/Kolkata",
    places: ["Connaught Place", "Hauz Khas", "Saket", "Chandni Chowk", "Dwarka", "Noida"],
    talkingPoints: [
      "Winter smog, which dominates conversation for two months a year and which everyone has a coping strategy for",
      "Chole bhature and paranthe, and the specific Old Delhi places people insist are the only real ones",
      "University culture — DU, JNU and Jamia give the city an unusually large and opinionated student population",
      "The metro, which Delhi is genuinely proud of and will compare favourably to anywhere else in India",
      "Migration: a large share of the city moved here for work or study, so 'where are you originally from' actually goes somewhere",
    ],
    connectivityNote:
      "Delhi and the wider NCR have strong 4G and broad 5G coverage, and fixed broadband is more common here than in most Indian cities. Calls are generally stable. The metro's underground stretches are the main place you will notice quality dropping.",
    localNote:
      "Delhi's student population gives it a distinctive rhythm — the queue picks up earlier than Mumbai's, from around 21:30 IST, and stays busy until about one. Winter evenings are noticeably more active than summer ones, when much of the city avoids being outdoors anyway.",
    intro: [
      "Delhi is a city of arrivals. A large proportion of the people you meet here moved for university or work, from Bihar, UP, Punjab, the north-east and everywhere else, which makes 'where are you from' an unusually productive opening question.",
      "Hindi is the common language and English is close behind, particularly among students. Punjabi is widely spoken, and Urdu remains present in the older parts of the city.",
      "The student population also shapes when people are online: Delhi's queue fills earlier than Mumbai's and empties a little sooner. It shapes the conversations as well — you will meet a lot of people midway through preparing for an exam that will decide the next decade of their life, and they are usually glad of the distraction.",
      "Nothing to install, no account, no phone number. The call runs directly between browsers and is never recorded.",
    ],
    faqs: [
      { question: "What language will people in Delhi speak?", answer: "Hindi and English, usually interchangeably. Punjabi is common, and Urdu is still spoken in parts of the old city. Most people will switch to whichever language you are more comfortable in." },
      { question: "When is Delhi busiest on Vidibro?", answer: "From about 21:30 to 01:00 IST. The large student population means it picks up earlier than Mumbai and quietens slightly sooner." },
      { question: "Does it work across NCR — Noida, Gurgaon, Faridabad?", answer: "Yes. There is no location filter at all, so the whole NCR is simply part of the same pool, as is the rest of India." },
      { question: "Will it work on the Delhi metro?", answer: "Mostly. Coverage above ground is good; the underground stretches are where you will see quality drop. The call lowers video quality rather than disconnecting." },
      { question: "Is registration required?", answer: "No. No account, no phone number, no email. You open the page and you are in the queue." },
      { question: "Can I switch to voice or text instead?", answer: "Yes, at any time. Voice chat runs with the camera off and text chat needs neither camera nor microphone. All three match from the same pool." },
    ],
    related: [
      { slug: "video-chat-mumbai", label: "Mumbai", relation: "city" },
      { slug: "video-chat-kolkata", label: "Kolkata", relation: "city" },
      { slug: "video-chat-bangalore", label: "Bangalore", relation: "city" },
      { slug: "hindi-video-chat", label: "Hindi video chat", relation: "language" },
      { slug: "urdu-video-chat", label: "Urdu video chat", relation: "language" },
      { slug: "audio-chat", label: "voice-only chat", relation: "mode" },
      { slug: "text-chat", label: "text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-india", label: "India", relation: "sibling" },
      { slug: "video-chat-pakistan", label: "Pakistan", relation: "sibling" },
    ],
  },

  {
    slug: "hindi-video-chat",
    kind: "language",
    name: "Hindi",
    primaryKeyword: "hindi video chat",
    title: "Hindi Video Chat — Talk to Strangers in Hindi, Free",
    description:
      "Free video chat in Hindi. Meet Hindi-speaking strangers across India and beyond — no signup, no app, video, voice or text.",
    languages: ["हिन्दी (Hindi)", "English", "اردو (Urdu)"],
    peakHours: "21:00 – 01:00 IST",
    timezone: "Asia/Kolkata",
    places: ["Delhi", "Lucknow", "Jaipur", "Bhopal", "Patna", "Indore"],
    talkingPoints: [
      "Hindi cinema, which reaches far past India and is common ground with people who have never been there",
      "The Hindi–Urdu overlap, which means Pakistani users often understand you without either side switching",
      "Regional variation: the Hindi of Lucknow, Bhopal and Patna differ enough that people can often place each other",
      "Cricket commentary in Hindi, which has its own vocabulary and devoted following",
      "Exam culture across the Hindi belt — UPSC, JEE, NEET — which shapes a great many young lives here",
    ],
    connectivityNote:
      "Hindi speakers span the whole north Indian belt, from metros with 5G to smaller towns on variable 4G. Expect a wide range of connection quality within a single evening. Video adapts to whichever end is weaker rather than dropping.",
    localNote:
      "Hindi is not the same thing as India. India has twenty-two official languages, and a Tamil or Bengali speaker may not use Hindi at all — which is exactly why this page exists separately from the India page. Hindi is also spoken in Nepal, Fiji, Mauritius, and across large diaspora communities.",
    intro: [
      "Hindi has somewhere over 600 million speakers counting second-language users, which puts it among the three most spoken languages on earth. On a service with no language filter, that scale matters: Hindi comes up more often than almost anything else.",
      "It is worth separating from India itself. India is multilingual to a degree people outside it often underestimate, and a match from Chennai or Kochi may not speak Hindi at all. Meanwhile Hindi is spoken well beyond India's borders — in Nepal, Fiji, Mauritius, and among very large diaspora communities.",
      "The most useful thing to know: Hindi and Urdu are close enough in ordinary speech that Pakistani users frequently understand you without either side switching to English. That happens a lot here, and it tends to be the more memorable kind of conversation.",
    ],
    faqs: [
      { question: "Can I find Hindi speakers on random video chat?", answer: "Frequently. There is no language filter, so no single match is guaranteed — but with 600 million-plus speakers, Hindi is one of the most common languages you will encounter, especially during the Indian evening peak." },
      { question: "Is Hindi video chat different from Indian video chat?", answer: "Yes, and the distinction matters. India has twenty-two official languages; a match from Tamil Nadu or Kerala may not speak Hindi. Hindi is also spoken in Nepal, Fiji and Mauritius." },
      { question: "Will Pakistani users understand Hindi?", answer: "Usually, yes. Spoken Hindi and Urdu are close enough that conversation works without either side switching to English. The writing systems differ, but speech largely does not." },
      { question: "What time is best for Hindi conversations?", answer: "Between 21:00 and 01:00 IST, when the Indian evening peak is fullest." },
      { question: "Is it free?", answer: "Completely. No account, no subscription, no credits. A browser and a camera is all you need — and text chat does not even need that." },
      { question: "Can I practise Hindi with strangers?", answer: "Many people use it that way, and voice chat suits it well — the camera off makes practising less self-conscious. Most people are patient with learners." },
    ],
    related: [
      { slug: "video-chat-delhi", label: "Delhi", relation: "city" },
      { slug: "video-chat-mumbai", label: "Mumbai", relation: "city" },
      { slug: "video-chat-lucknow", label: "Lucknow", relation: "city" },
      { slug: "bengali-video-chat", label: "Bengali video chat", relation: "language" },
      { slug: "urdu-video-chat", label: "Urdu video chat", relation: "language" },
      { slug: "audio-chat", label: "Hindi voice chat", relation: "mode" },
      { slug: "text-chat", label: "Hindi text chat", relation: "mode" },
      { slug: "omegle-alternative", label: "Omegle alternatives", relation: "competitor" },
      { slug: "video-chat-india", label: "India", relation: "sibling" },
      { slug: "video-chat-pakistan", label: "Pakistan", relation: "sibling" },
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
