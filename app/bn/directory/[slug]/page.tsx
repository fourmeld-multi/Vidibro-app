import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ENTRIES, getEntry } from "@/lib/directory/entries";
import { BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import {
  localeTitle,
  localeDescription,
  localeFaqs,
  localeUrl,
  enUrl,
  UI,
} from "@/lib/directory/locales";

const LOCALE = "bn" as const;

export function generateStaticParams() {
  return ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  const title = localeTitle(entry, LOCALE);
  const description = localeDescription(entry, LOCALE);
  const url = localeUrl(slug, LOCALE);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: enUrl(slug),
        "x-default": enUrl(slug),
        bn: url,
        hi: localeUrl(slug, "hi"),
      },
    },
    openGraph: { title, description, url, siteName: "Vidibro", locale: "bn_BD" },
  };
}

export default async function BnDirectoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const title = localeTitle(entry, LOCALE);
  const description = localeDescription(entry, LOCALE);
  const faqs = localeFaqs(entry, LOCALE);
  const url = localeUrl(slug, LOCALE);
  const ui = UI[LOCALE];

  return (
    <main lang="bn" className="w-full mx-auto max-w-3xl px-5 py-12">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "Directory", item: `${BASE_URL}/directory` },
              { "@type": "ListItem", position: 3, name: entry.name, item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />

      <Link
        href={`/directory/${slug}`}
        className="text-sm text-purple-300 hover:text-purple-200"
      >
        {ui.backToDir}
      </Link>

      <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight">
        {title}
      </h1>

      <p className="mt-4 text-purple-200/80 text-lg leading-relaxed">{description}</p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <a
          href="/video-chat"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-3.5 text-base font-bold text-white shadow-lg"
        >
          {ui.startVideo}
        </a>
        <a
          href="/text-chat"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-500/40 px-8 py-3.5 text-base font-semibold text-purple-200 hover:bg-purple-900/30"
        >
          {ui.startText}
        </a>
      </div>

      <div className="mt-4 flex gap-4 text-sm text-purple-300/70">
        <span>✓ {ui.noSignup}</span>
        <span>✓ {ui.freePrivate}</span>
        <span>✓ {ui.instantMatch}</span>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-6">{ui.faqHeading}</h2>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-purple-500/20 bg-purple-950/30 p-5">
              <p className="font-semibold text-white">{f.q}</p>
              <p className="mt-2 text-purple-200/80 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-sm text-purple-300/60">
        {ui.alsoAvailable}{" "}
        <Link href={`/directory/${slug}`} className="underline hover:text-purple-200">
          English
        </Link>
        {" · "}
        <Link href={`/hi/directory/${slug}`} className="underline hover:text-purple-200">
          हिन्दी
        </Link>
      </p>
    </main>
  );
}
