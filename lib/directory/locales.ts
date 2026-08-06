import type { DirectoryEntry } from "./types";
import { BASE_URL } from "@/lib/seo";

export type LocaleCode = "hi" | "bn";

export const LOCALE_META: Record<LocaleCode, { lang: string; label: string }> = {
  hi: { lang: "hi", label: "हिन्दी" },
  bn: { lang: "bn", label: "বাংলা" },
};

// ---------- title / description templates ----------

export function localeTitle(entry: DirectoryEntry, locale: LocaleCode): string {
  if (locale === "hi") return `${entry.name} में वीडियो चैट — अजनबियों से मुफ्त बात करें`;
  return `${entry.name}-এ ভিডিও চ্যাট — বিনামূল্যে অপরিচিতদের সাথে কথা বলুন`;
}

export function localeDescription(entry: DirectoryEntry, locale: LocaleCode): string {
  if (locale === "hi")
    return `${entry.name} में मुफ्त रैंडम वीडियो चैट। बिना किसी अकाउंट के तुरंत अजनबियों से मिलें — कोई साइनअप नहीं, कोई डाउनलोड नहीं।`;
  return `${entry.name}-এ বিনামূল্যে র‍্যান্ডম ভিডিও চ্যাট। কোনো অ্যাকাউন্ট ছাড়াই তাৎক্ষণিকভাবে অপরিচিতদের সাথে মিলুন — কোনো সাইনআপ নেই।`;
}

// ---------- UI strings ----------

export const UI: Record<LocaleCode, Record<string, string>> = {
  hi: {
    startVideo:    "वीडियो चैट शुरू करें",
    startAudio:    "वॉयस चैट शुरू करें",
    startText:     "टेक्स्ट चैट शुरू करें",
    noSignup:      "कोई साइनअप नहीं",
    freePrivate:   "मुफ्त और निजी",
    instantMatch:  "तुरंत मिलान",
    faqHeading:    "अक्सर पूछे जाने वाले सवाल",
    backToDir:     "← डायरेक्टरी पर वापस",
    alsoAvailable: "यह पेज इन भाषाओं में भी उपलब्ध है:",
  },
  bn: {
    startVideo:    "ভিডিও চ্যাট শুরু করুন",
    startAudio:    "ভয়েস চ্যাট শুরু করুন",
    startText:     "টেক্সট চ্যাট শুরু করুন",
    noSignup:      "কোনো সাইনআপ নেই",
    freePrivate:   "বিনামূল্যে এবং ব্যক্তিগত",
    instantMatch:  "তাৎক্ষণিক ম্যাচ",
    faqHeading:    "সচরাচর জিজ্ঞাসিত প্রশ্ন",
    backToDir:     "← ডিরেক্টরিতে ফিরুন",
    alsoAvailable: "এই পেজটি এই ভাষাতেও পাওয়া যায়:",
  },
};

// ---------- standard FAQs ----------

export function localeFaqs(
  entry: DirectoryEntry,
  locale: LocaleCode
): Array<{ q: string; a: string }> {
  if (locale === "hi")
    return [
      {
        q: `${entry.name} में Vidibro पर वीडियो चैट मुफ्त है?`,
        a: "हाँ, Vidibro पूरी तरह मुफ्त है। कोई साइनअप, कोई सब्सक्रिप्शन, कोई छिपी हुई फीस नहीं।",
      },
      {
        q: "क्या मुझे अकाउंट बनाने की जरूरत है?",
        a: "नहीं। बस कैमरा और माइक की परमिशन दें और एक सेकंड में किसी से मिलें।",
      },
      {
        q: "क्या Vidibro मोबाइल पर काम करता है?",
        a: "हाँ। iOS और Android दोनों के ब्राउज़र में बिना किसी ऐप के काम करता है।",
      },
      {
        q: "मेरी बातचीत सेव होती है क्या?",
        a: "नहीं। Vidibro कोई चैट हिस्ट्री, नाम या प्रोफाइल स्टोर नहीं करता।",
      },
      {
        q: "वीडियो कॉल कितनी सुरक्षित है?",
        a: "सभी वीडियो कॉल सीधे P2P WebRTC से होती हैं — सर्वर से नहीं गुजरतीं।",
      },
    ];

  return [
    {
      q: `${entry.name}-এ Vidibro-তে ভিডিও চ্যাট কি বিনামূল্যে?`,
      a: "হ্যাঁ, Vidibro সম্পূর্ণ বিনামূল্যে। কোনো সাইনআপ, সাবস্ক্রিপশন বা লুকানো চার্জ নেই।",
    },
    {
      q: "আমার কি অ্যাকাউন্ট তৈরি করতে হবে?",
      a: "না। শুধু ক্যামেরা ও মাইকের অনুমতি দিন এবং এক সেকেন্ডে কারো সাথে মিলুন।",
    },
    {
      q: "Vidibro কি মোবাইলে কাজ করে?",
      a: "হ্যাঁ। iOS এবং Android উভয় ব্রাউজারে কোনো অ্যাপ ছাড়াই কাজ করে।",
    },
    {
      q: "আমার কথোপকথন কি সংরক্ষিত হয়?",
      a: "না। Vidibro কোনো চ্যাট ইতিহাস, নাম বা প্রোফাইল সংরক্ষণ করে না।",
    },
    {
      q: "ভিডিও কল কতটা নিরাপদ?",
      a: "সমস্ত ভিডিও কল সরাসরি P2P WebRTC-এর মাধ্যমে হয় — সার্ভারের মধ্য দিয়ে যায় না।",
    },
  ];
}

// ---------- URL helpers ----------

export function localeUrl(slug: string, locale: LocaleCode): string {
  return `${BASE_URL}/${locale}/directory/${slug}`;
}

export function enUrl(slug: string): string {
  return `${BASE_URL}/directory/${slug}`;
}
