"use client";

import Link from "next/link";
import { Globe, ArrowRight, ShieldCheck, MapPin, MessageSquareText } from "lucide-react";
import { DIRECTORY_ITEMS } from "@/lib/directoryData";

export default function LandingDirectorySection() {
  const items = Object.values(DIRECTORY_ITEMS);
  const countries = items.filter((i) => i.category === "country");
  const cities = items.filter((i) => i.category === "city");
  const languages = items.filter((i) => i.category === "language");
  const topics = items.filter((i) => i.category === "topic");

  const alternatives = [
    { name: "Omegle Alternative", slug: "/omegle-alternative" },
    { name: "AirTALK Alternative", slug: "/airtalk-alternative" },
    { name: "Chatroulette Alternative", slug: "/chatroulette-alternative" },
    { name: "OmeTV Alternative", slug: "/ometv-alternative" },
    { name: "Emerald Chat Alternative", slug: "/emerald-chat-alternative" },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 border-t border-purple-500/20 bg-black/40 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-widest">
            <Globe size={14} className="text-purple-400" />
            <span>Global Chat Directory Index</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect Globally by Country, Language & Topic
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl font-medium">
            Explore active hubs worldwide or jump directly into 1-on-1 random video, voice, and text match.
          </p>
        </div>

        {/* 1. Country Hubs */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>🌍 Country Hubs</span>
            </h3>
            <Link
              href="/directory"
              className="text-xs font-extrabold text-purple-300 hover:text-white flex items-center gap-1 transition"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {countries.map((item) => (
              <Link
                key={item.slug}
                href={`/directory/${item.slug}`}
                className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{item.flag}</span>
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 shrink-0">
                  {item.trustBadge}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. City Hubs */}
        {cities.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <MapPin size={16} className="text-cyan-400" />
                <span>Major City Hubs</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cities.map((item) => (
                <Link
                  key={item.slug}
                  href={`/directory/${item.slug}`}
                  className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{item.flag}</span>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20 shrink-0">
                    {item.trustBadge}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 3. Language & Topic Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Languages */}
          <div className="flex flex-col gap-4">
            <div className="border-b border-white/10 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>🗣️ Language Hubs</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((item) => (
                <Link
                  key={item.slug}
                  href={`/directory/${item.slug}`}
                  className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{item.flag}</span>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="flex flex-col gap-4">
            <div className="border-b border-white/10 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <MessageSquareText size={16} className="text-pink-400" />
                <span>Interest & Topic Hubs</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {topics.map((item) => (
                <Link
                  key={item.slug}
                  href={`/directory/${item.slug}`}
                  className="flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{item.flag}</span>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Competitor Alternatives Grid */}
        <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-purple-400" />
            <span>Popular Chat Alternatives</span>
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {alternatives.map((alt) => (
              <Link
                key={alt.slug}
                href={alt.slug}
                className="rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-4 py-1.5 text-xs font-bold text-purple-200 hover:text-white transition"
              >
                {alt.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Full Directory Link CTA */}
        <div className="text-center pt-4">
          <Link
            href="/directory"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider shadow-lg hover:scale-105 transition"
          >
            <span>Explore Full Global Directory Index</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
