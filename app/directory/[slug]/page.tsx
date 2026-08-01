import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Video, Mic, MessageSquare, Clock, Languages, MapPin, Signal, ShieldCheck } from "lucide-react";
import { ENTRIES, getEntry, resolvableRelated, hrefFor } from "@/lib/directory/entries";
import { assertEntryIsPublishable } from "@/lib/directory/types";
import { generatePageSEO, BASE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PeakHoursBar from "@/components/PeakHoursBar";
import LiveMarketStatus from "@/components/LiveMarketStatus";
import MatchingDiagram from "@/components/MatchingDiagram";

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
  return generatePageSEO({
    title: entry.title,
    description: entry.description,
    slug: `/directory/${entry.slug}`,
    keywords: [entry.primaryKeyword, `${entry.name} video chat`, `talk to strangers ${entry.name}`],
    // Each directory page has its own generated card (opengraph-image.tsx in
    // this segment) rather than the generic site one.
    image: `${BASE_URL}/directory/${entry.slug}/opengraph-image`,
  });
}

/** H2s are phrased as questions on purpose — it is what wins featured snippets. */
function kindLabel(kind: string, name: string) {
  if (kind === "language") return `people who speak ${name}`;
  return `people in ${name}`;
}

/**
 * Dropping the raw keyword into a sentence produces "What is video chat india
 * on Vidibro?" — the giveaway phrasing of a template. These read as English.
 */
function whatIsHeading(kind: string, name: string) {
  if (kind === "language") return `What is ${name} video chat?`;
  return `What is random video chat in ${name}?`;
}

export default async function DirectoryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  // Fails the build rather than publishing a page that breaks the quality rules.
  assertEntryIsPublishable(entry);

  const related = resolvableRelated(entry);
  const who = kindLabel(entry.kind, entry.name);
  const cities = related.filter((r) => r.relation === "city");
  const languages = related.filter((r) => r.relation === "language");
  const siblings = related.filter((r) => r.relation === "sibling");
  const modes = related.filter((r) => r.relation === "mode");
  const competitors = related.filter((r) => r.relation === "competitor");

  const url = `${BASE_URL}/directory/${entry.slug}`;

  return (
    <main className="w-full">
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
            "@id": `${url}#faq`,
            mainEntity: entry.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]}
      />

      <div className="mx-auto max-w-3xl px-5 sm:px-6 py-10 sm:py-14">
        {/* Breadcrumb — matches the BreadcrumbList schema above. */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-purple-300/70">
          <Link href="/" className="hover:text-purple-200">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/directory" className="hover:text-purple-200">Directory</Link>
          <span className="mx-1.5">/</span>
          <span className="text-purple-200">{entry.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {entry.title.split("—")[0].trim()}
        </h1>

        <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-purple-100/85">
          {entry.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/video-chat" className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-lg">
            <Video size={16} /> Start video chat
          </Link>
          <Link href="/audio-chat" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition">
            <Mic size={16} /> Voice only
          </Link>
          <Link href="/text-chat" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition">
            <MessageSquare size={16} /> Text
          </Link>
        </div>

        {/* Reads the entry's timezone to show what is actually happening in this
            market right now. Changes through the day, and differs per page
            because the underlying data does. */}
        <LiveMarketStatus
          slug={entry.slug}
          name={entry.name}
          timezone={entry.timezone}
          peakHours={entry.peakHours}
          weight={entry.weight}
        />

        {/* The locally-true data, surfaced as its own block. This is what makes
            the page different from every other page in the directory. */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Fact icon={<Languages size={15} />} label="Languages you'll hear" value={entry.languages.join(" · ")} />
          <Fact icon={<Clock size={15} />} label="Busiest hours" value={entry.peakHours} />
          <Fact icon={<MapPin size={15} />} label={entry.kind === "city" ? "Areas" : "Places"} value={entry.places.join(" · ")} />
          <Fact icon={<Signal size={15} />} label="Typical connection" value={entry.connectivityNote.split(".")[0] + "."} />
        </div>

        <Section title={whatIsHeading(entry.kind, entry.name)}>
          <p>
            Vidibro pairs you with one stranger at a time — {who} among them — over a direct
            browser-to-browser connection. There is no account, no phone number and no app to
            install. You open the page, allow the camera, and you are in the queue.
          </p>
          <p>
            Because the connection is peer to peer, the video and audio travel straight between the
            two devices rather than through a server we control. Nothing is recorded, and there is
            no profile for a conversation to be attached to afterwards.
          </p>
          <MatchingDiagram />
        </Section>

        <Section title="How do you start?">
          <ol className="space-y-2.5 list-decimal pl-5 marker:text-purple-400 marker:font-bold">
            <li>Pick a mode — video, voice with the camera off, or text only.</li>
            <li>Allow camera and microphone access when the browser asks. Text chat needs neither.</li>
            <li>Wait out the short countdown while we find someone. At peak it is a few seconds.</li>
            <li>Talk. Press Next whenever you want a different conversation.</li>
          </ol>
        </Section>

        <Section title={`What do people in ${entry.name} actually talk about?`}>
          <p>
            Openers matter more than most people expect, and generic ones get skipped. These come up
            reliably here:
          </p>
          <ul className="space-y-2.5 list-disc pl-5 marker:text-purple-400">
            {entry.talkingPoints.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Section>

        <Section title="When is it busiest, and what will the call be like?">
          <PeakHoursBar peakHours={entry.peakHours} />
          <p>
            The queue is fullest between <strong className="text-white">{entry.peakHours}</strong>.{" "}
            {entry.localNote}
          </p>
          <p>{entry.connectivityNote}</p>
        </Section>

        <Section title="Is it safe?">
          <p>
            The connection being peer to peer means we never hold your video — but that is a privacy
            property, not a safety guarantee about who you meet. The rules that actually protect you
            are the ordinary ones: no full name, no address, no workplace, no financial details, and
            nothing you would not want a stranger to keep.
          </p>
          <p>
            A report button sits in the top bar throughout every call. Pressing it ends the
            conversation immediately and moves you on. Use it early rather than sitting through
            something uncomfortable — ending a bad conversation fast is the point of it.
          </p>
          <p className="text-purple-200/70">
            Read the <Link href="/guidelines" className="text-purple-300 underline underline-offset-2 hover:text-purple-200">community guidelines</Link>{" "}
            for what is not allowed and what happens when someone breaks the rules.
          </p>
        </Section>

        {/* Per-market hub-and-spoke. Contextual and in-content, not a footer dump —
            this is what gets the long tail crawled without external links. */}
        <Section title="Where else can you look?">
          {cities.length > 0 && (
            <p>
              Narrower than {entry.name}?{" "}
              <LinkList items={cities} /> each have their own page.
            </p>
          )}
          {languages.length > 0 && (
            <p>
              If you want a particular language, try <LinkList items={languages} />.
            </p>
          )}
          {modes.length > 0 && (
            <p>
              Not in the mood to be on camera? <LinkList items={modes} /> match from the same pool
              of people.
            </p>
          )}
          {siblings.length > 0 && (
            <p>
              Nearby: <LinkList items={siblings} />.
            </p>
          )}
          {competitors.length > 0 && (
            <p>
              Comparing options? See <LinkList items={competitors} />.
            </p>
          )}
        </Section>

        <Section title="Frequently asked questions">
          <div className="space-y-5">
            {entry.faqs.map((f) => (
              <div key={f.question}>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{f.question}</h3>
                <p className="text-purple-100/80">{f.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-12 rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            Ready to talk to someone in {entry.name}?
          </h2>
          <p className="text-sm text-purple-200/75 mb-5">
            No signup. No history. Just a conversation.
          </p>
          <Link href="/video-chat" className="btn-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-extrabold text-white shadow-lg">
            <Video size={16} /> Start video chat
          </Link>
        </div>

        <p className="mt-10 flex items-center gap-2 text-xs text-purple-300/60">
          <ShieldCheck size={14} /> Calls are peer-to-peer and never recorded.
        </p>
      </div>
    </main>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-300/70">
        {icon} {label}
      </div>
      <div className="mt-1.5 text-sm text-purple-100/90 leading-snug">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl sm:text-2xl font-black text-white mb-3.5 tracking-tight">{title}</h2>
      <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-purple-100/85">
        {children}
      </div>
    </section>
  );
}

function LinkList({ items }: { items: Array<{ slug: string; label: string }> }) {
  return (
    <>
      {items.map((r, i) => (
        <span key={r.slug}>
          {i > 0 && (i === items.length - 1 ? " and " : ", ")}
          <Link
            href={hrefFor(r.slug)}
            className="text-purple-300 underline underline-offset-2 hover:text-purple-200"
          >
            {r.label}
          </Link>
        </span>
      ))}
    </>
  );
}
