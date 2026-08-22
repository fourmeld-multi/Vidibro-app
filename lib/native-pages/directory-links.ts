/** Maps a directory slug → native language pages for that market */
export const NATIVE_LINKS: Record<string, Array<{ href: string; label: string; lang: string }>> = {
  "video-chat-india": [
    { href: "/hi", label: "हिंदी", lang: "Hindi" },
    { href: "/ta", label: "தமிழ்", lang: "Tamil" },
    { href: "/kn", label: "ಕನ್ನಡ", lang: "Kannada" },
    { href: "/ml", label: "മലയാളം", lang: "Malayalam" },
    { href: "/bn", label: "বাংলা", lang: "Bengali" },
  ],
  "video-chat-kolkata": [{ href: "/bn", label: "বাংলা", lang: "Bengali" }],
  "video-chat-bangladesh": [{ href: "/bn", label: "বাংলা", lang: "Bengali" }],
  "video-chat-mumbai": [{ href: "/hi", label: "हिंदी", lang: "Hindi" }],
  "video-chat-delhi": [{ href: "/hi", label: "हिंदी", lang: "Hindi" }],
  "video-chat-bangalore": [
    { href: "/hi", label: "हिंदी", lang: "Hindi" },
    { href: "/kn", label: "ಕನ್ನಡ", lang: "Kannada" },
  ],
  "hindi-video-chat": [{ href: "/hi", label: "हिंदी", lang: "Hindi" }],
  "tamil-video-chat": [{ href: "/ta", label: "தமிழ்", lang: "Tamil" }],
  "bengali-video-chat": [{ href: "/bn", label: "বাংলা", lang: "Bengali" }],
  "video-chat-japan": [{ href: "/ja", label: "日本語", lang: "Japanese" }],
  "video-chat-south-korea": [{ href: "/ko", label: "한국어", lang: "Korean" }],
  "video-chat-russia": [{ href: "/ru", label: "Русский", lang: "Russian" }],
  "video-chat-brazil": [{ href: "/pt-br", label: "Português", lang: "Brazilian Portuguese" }],
  "video-chat-indonesia": [{ href: "/id", label: "Bahasa Indonesia", lang: "Indonesian" }],
  "video-chat-vietnam": [{ href: "/vi", label: "Tiếng Việt", lang: "Vietnamese" }],
  "video-chat-turkey": [{ href: "/tr", label: "Türkçe", lang: "Turkish" }],
  "video-chat-china": [{ href: "/zh", label: "中文", lang: "Chinese" }],
  "video-chat-thailand": [{ href: "/th", label: "ภาษาไทย", lang: "Thai" }],
};

/** Maps a native-page slug → English directory pages for that market */
export const REVERSE_NATIVE_LINKS: Record<string, Array<{ href: string; label: string }>> = {
  "/hi": [
    { href: "/directory/video-chat-india", label: "India" },
    { href: "/directory/video-chat-mumbai", label: "Mumbai" },
    { href: "/directory/video-chat-delhi", label: "Delhi" },
    { href: "/directory/video-chat-bangalore", label: "Bengaluru" },
    { href: "/directory/hindi-video-chat", label: "Hindi Chat" },
  ],
  "/kn": [
    { href: "/directory/video-chat-india", label: "India" },
    { href: "/directory/video-chat-bangalore", label: "Bengaluru" },
  ],
  "/ml": [
    { href: "/directory/video-chat-india", label: "India" },
  ],
  "/ta": [
    { href: "/directory/video-chat-india", label: "India" },
    { href: "/directory/tamil-video-chat", label: "Tamil Chat" },
  ],
  "/bn": [
    { href: "/directory/video-chat-india", label: "India" },
    { href: "/directory/video-chat-bangladesh", label: "Bangladesh" },
    { href: "/directory/video-chat-kolkata", label: "Kolkata" },
    { href: "/directory/bengali-video-chat", label: "Bengali Chat" },
  ],
  "/ja": [{ href: "/directory/video-chat-japan", label: "Japan" }],
  "/ko": [{ href: "/directory/video-chat-south-korea", label: "South Korea" }],
  "/ru": [{ href: "/directory/video-chat-russia", label: "Russia" }],
  "/pt-br": [{ href: "/directory/video-chat-brazil", label: "Brazil" }],
  "/id": [{ href: "/directory/video-chat-indonesia", label: "Indonesia" }],
  "/vi": [{ href: "/directory/video-chat-vietnam", label: "Vietnam" }],
  "/tr": [{ href: "/directory/video-chat-turkey", label: "Turkey" }],
  "/zh": [{ href: "/directory/video-chat-china", label: "China" }],
  "/th": [{ href: "/directory/video-chat-thailand", label: "Thailand" }],
};
