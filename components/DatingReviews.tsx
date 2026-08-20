"use client";

const reviews = [
  {
    text: "Met someone from South Korea on here. We have been video calling every weekend for two months now.",
    name: "Rahim",
    country: "🇧🇩 Bangladesh",
  },
  {
    text: "Better than any dating app I have tried. Real conversation within 10 seconds, no swiping.",
    name: "Ayesha",
    country: "🇮🇳 India",
  },
  {
    text: "Found my girlfriend here after about three months. Started as a random call, turned into something real.",
    name: "Carlos",
    country: "🇧🇷 Brazil",
  },
  {
    text: "I started with voice-only mode because I was nervous. Felt much safer. Now I use video all the time.",
    name: "Selin",
    country: "🇹🇷 Turkey",
  },
  {
    text: "Connected with someone from Japan. We have been teaching each other our languages for weeks.",
    name: "Mehmet",
    country: "🇹🇷 Turkey",
  },
  {
    text: "No fake profiles, no old pictures. What you see is what you get. Refreshing after dating apps.",
    name: "Ji-won",
    country: "🇰🇷 South Korea",
  },
  {
    text: "Skipped like 20 people in a row and then had a two-hour conversation. Worth it.",
    name: "Nadia",
    country: "🇩🇪 Germany",
  },
  {
    text: "Free, instant, no account. I recommended it to all my friends who are tired of Tinder.",
    name: "Lucas",
    country: "🇧🇷 Brazil",
  },
];

export default function DatingReviews() {
  const doubled = [...reviews, ...reviews];

  return (
    <section className="mb-14">
      <div className="overflow-hidden relative">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-[var(--background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-[var(--background)] to-transparent" />

        <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((r, i) => (
            <div
              key={i}
              className="w-72 shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-3"
            >
              <p className="text-sm text-[var(--muted)] leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-auto flex items-center gap-2">
                <span className="text-xs font-semibold text-white">{r.name}</span>
                <span className="text-xs text-[var(--muted)]">{r.country}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
