import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { generatePageSEO } from "@/lib/seo";
import { DIRECTORY_ITEMS } from "@/lib/directoryData";

export const metadata: Metadata = generatePageSEO({
  title: "Global Chat Directory — Country, Language & Topic Hubs",
  description:
    "Explore Vidibro's Global Chat Directory. Connect with strangers by country (USA, Russia, India, UK, Japan), language (English, Russian, Hindi, Spanish), or interest.",
  slug: "/directory",
});

export default function DirectoryIndexPage() {
  const items = Object.values(DIRECTORY_ITEMS);
  const countries = items.filter((i) => i.category === "country");
  const cities = items.filter((i) => i.category === "city");
  const languages = items.filter((i) => i.category === "language");
  const topics = items.filter((i) => i.category === "topic");

  return (
    <div className="min-h-screen flex flex-col bg-[#070414] text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col gap-12">
        <div className="text-center flex flex-col items-center gap-3 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 text-xs font-extrabold text-purple-300 uppercase tracking-widest">
            <span>🌐 Global Connection Index</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Vidibro Chat Directory
          </h1>
          <p className="text-sm sm:text-base text-purple-200/80 max-w-2xl font-medium">
            Select a region, language, or interest hub to start instant 1-on-1 video, voice, or text chat with online strangers.
          </p>
        </div>

        {/* Countries Hub */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>🌍 Country Hubs</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((item) => (
              <Link
                key={item.slug}
                href={`/directory/${item.slug}`}
                className="flex items-center justify-between rounded-2xl bg-white/5 hover:bg-white/10 border border-purple-500/20 p-4 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-purple-200/60 font-medium">
                      {item.languages.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                  {item.onlineCount}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cities Hub */}
        {cities.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>🏙️ Major City Hubs</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((item) => (
                <Link
                  key={item.slug}
                  href={`/directory/${item.slug}`}
                  className="flex items-center justify-between rounded-2xl bg-white/5 hover:bg-white/10 border border-purple-500/20 p-4 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-purple-200/60 font-medium">
                        {item.languages.slice(0, 2).join(", ")}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
                    {item.onlineCount}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Languages Hub */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>🗣️ Language Hubs</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map((item) => (
              <Link
                key={item.slug}
                href={`/directory/${item.slug}`}
                className="flex items-center justify-between rounded-2xl bg-white/5 hover:bg-white/10 border border-purple-500/20 p-4 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.flag}</span>
                  <span className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {item.onlineCount}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Topics Hub */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>💬 Interest & Topic Hubs</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((item) => (
              <Link
                key={item.slug}
                href={`/directory/${item.slug}`}
                className="flex items-center justify-between rounded-2xl bg-white/5 hover:bg-white/10 border border-purple-500/20 p-4 transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.flag}</span>
                  <span className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-pink-300 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                  {item.onlineCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
