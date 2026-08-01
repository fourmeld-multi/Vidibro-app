# Vidibro SEO Plan — 400 Pages to Rank

Written after auditing `silly.chat/directory`, `airtalk.live/blog`, and our own
current pages. Every competitor number below was measured directly from their
live HTML, not estimated.

---

## 1. What the two ranking sites actually do

### SillyChat — the directory model

**Directory hub** (`/directory`) is a flat link index in three groups:
- **By Country** — 29 entries, all following `random video chat {country}`
- **Popular Features** — 11 entries (`free cam to cam chat`, `bengali video chat`,
  `kolkata video chat`, `talk to strangers bengali`)
- **Omegle Alternatives** — 3 entries

Note the pattern in "Popular Features": they mix a **generic** tier
(`random video chat`, `free video chat online`) with a **hyper-local** tier
(`bengali video chat`, `kolkata video chat`, `bangla chat online`). The local
tier is where a new site can actually win — nobody outranks Omegle clones on
"random video chat", but "kolkata video chat" is winnable.

**A country page** (`/random-video-chat-malaysia`) measured:

| Signal | Value |
|---|---|
| Word count | 884 |
| Title | `Malaysia Video Chat — Meet Malaysia People Online Free \| SillyChat` |
| Canonical | self-referencing ✓ |
| hreflang | `x-default`, `en`, `hi-IN`, `bn-IN`, `ta-IN`, `te-IN` |
| H1 | one, keyword-loaded |
| H2 | 9 |
| H3 | 27 |
| JSON-LD | Organization, BreadcrumbList, FAQPage |
| Internal links | 48 |

**The URL pattern for languages matters most:**
```
https://silly.chat/random-video-chat-malaysia      (en, x-default)
https://silly.chat/hi/random-video-chat-malaysia   (hi-IN)
https://silly.chat/bn/random-video-chat-malaysia   (bn-IN)
https://silly.chat/ta/random-video-chat-malaysia   (ta-IN)
https://silly.chat/te/random-video-chat-malaysia   (te-IN)
```
Each language is a **real, crawlable URL** cross-linked by hreflang. This is the
single most important structural thing they do that we do not.

**Honest assessment of their content quality:** their country pages are heavily
templated. The Malaysia page's opening is `"Jump into random chat in Malaysia.
SillyChat connects you with locals..."` — swap the country name and it is the
same page. 884 words is thin. They also display `1M+ Active Users`, `500k+
Daily Matches`, `99.9% Uptime` with no source. They rank today; that does not
make it a safe long-term model (see §6).

### AirTalk — the blog model

| Signal | Value |
|---|---|
| Posts | **35** (Guides 18, Community 8, Comparisons 6, Safety 3) |
| Typical post | **1,901 words** |
| Longest flagship guide | 3,832 words |
| JSON-LD | Article, Organization |
| Internal links per post | 13–22 |
| Images per post | 4–6, descriptive filenames + alt |
| Outbound citations | yes — real authorities (e.g. adaa.org) |
| Related Articles block | yes |
| Tag sidebar | 15+ tags |
| Author | "Harris Mesia" — one named human across all posts |

**They have 35 posts, not hundreds.** This is the most important correction in
this document. A competitor ranking in this niche is doing it with 35 well-made
articles. Depth is beating volume, which means our blog target should be far
smaller and far better than originally planned.

Their H2 structure on the flagship guide:
```
What Does It Mean to Talk to Strangers Online?
How to Get Started with Stranger Chat
Benefits of Talking to Strangers Online
Safety & Best Practices for Chatting With Strangers
Talking to Strangers vs Other Online Chat Options
Frequently Asked Questions
Conclusion
Related Articles
```
That is a textbook informational-intent layout: definition → how-to → benefits →
safety → comparison → FAQ. It earns featured snippets because each H2 answers a
distinct query.

**Their slug strategy is the real lesson.** They own both ends:
- Long-tail intent: `how-anonymous-chat-helps-social-anxiety`,
  `feeling-lonely-at-night-find-someone-to-talk-to-online`,
  `talk-to-strangers-without-showing-face`, `voice-chat-for-introverts`
- Short head terms: `random-audio-call`, `voice-chat-online`, `1v1-chat`

The emotional long-tail posts are what a new domain can rank for in weeks.

---

## 2. Where we stand

| | Vidibro now | SillyChat | AirTalk |
|---|---|---|---|
| Directory pages | **2** | 43 | — |
| Blog posts | **6** | — | 135 |
| hreflang | **none** | 6 per page | — |
| Sitemap includes dynamic pages | **NO** | yes | yes |
| Per-page metadata on `/video-chat` etc. | **none** | yes | yes |
| OG / Twitter tags | **none** | yes | yes |

### What Antigravity built that should be kept
- `lib/seo.ts` — the `generatePageSEO()` helper is a sound pattern
- `robots.ts` — correct
- JSON-LD on blog and directory detail pages
- The five `(marketing)` alternative pages — good keyword strategy
- The directory item schema (`peakTimes`, `languages`, `trustBadge`) — these are
  exactly the differentiating data points that stop pages being duplicates

### What is wrong and must be fixed
1. **`sitemap.ts` is a hardcoded array of 17 static routes.** No blog post or
   directory page is in it. Google has no list of our content. This is the most
   urgent bug on the site.
2. **Only 2 directory items and 6 blog posts.** Not a directory or a blog yet.
3. **The Russia page is written entirely in Russian at an English URL**
   (`/directory/russia`) with no hreflang and no English equivalent. Google
   cannot tell what market it serves. This approach does not scale — §4 fixes it.
4. **No metadata on the core pages.** `/video-chat`, `/audio-chat`,
   `/text-chat`, `/faq`, `/contact`, `/guidelines`, `/terms`, `/privacy` all
   inherit the homepage title. Eight identical titles = Google filters them.
   `/video-chat` is a page we want ranking.
5. **No `metadataBase`, `openGraph`, `twitter`, or canonical** in
   `app/layout.tsx`. Shares render with no image.
6. **Chat pages have no crawlable content** — client components that request a
   camera immediately. A crawler sees an empty shell.
7. **The language switcher produces zero SEO value.** 13 languages swapping via
   React state on one URL. Google only ever indexes English.

---

## 3. The 400-page architecture

Every page must have a **distinct primary keyword** and a **distinct reason to
exist**. If two pages could be merged, they should be.

### Tier 1 — Money pages (8)
`/`, `/video-chat`, `/audio-chat`, `/text-chat`, `/directory`, `/blog`,
`/faq`, `/guidelines`

These carry the head terms and receive the most internal links.

### Tier 2 — Competitor / alternative pages (25)
Pattern: `/{competitor}-alternative`

Five exist. Extend to 25: omegle, chatroulette, ometv, emerald-chat, airtalk,
camsurf, chathub, monkey-app, azar, holla, bazoocam, shagle, tinychat,
chatrandom, coomeet, joingy, chatspin, fruzo, chatib, ychat, and
`best-omegle-alternatives`, `omegle-alternative-india`,
`omegle-alternative-philippines`, `free-omegle-alternative`,
`omegle-alternative-no-sign-up`.

**Search intent here is comparison** — these need an honest comparison table,
not marketing copy. A table with real columns (login required, video/voice/text,
mobile support, cost) earns featured snippets.

### Tier 3 — Country pages (60)
Pattern: `/random-video-chat-{country}`

Prioritise by actual random-chat demand: India, Bangladesh, Pakistan,
Philippines, Indonesia, Vietnam, Thailand, Malaysia, Nepal, Sri Lanka, Turkey,
Egypt, Morocco, Nigeria, Kenya, South Africa, Brazil, Mexico, Argentina,
Colombia, Peru, Chile, USA, Canada, UK, Germany, France, Italy, Spain, Poland,
Netherlands, Russia, Ukraine, Romania, Japan, South Korea, Taiwan, Saudi Arabia,
UAE, Qatar, Kuwait, Australia, and so on.

### Tier 4 — City pages (80)
Pattern: `/video-chat-{city}`

This is where a new domain wins, because competition is thin. India first
(Mumbai, Delhi, Kolkata, Bangalore, Chennai, Hyderabad, Pune, Ahmedabad,
Jaipur, Lucknow, Surat, Kanpur, Nagpur, Indore, Bhopal, Patna, Guwahati,
Kochi, Coimbatore, Chandigarh), then Dhaka, Chittagong, Lahore, Karachi,
Islamabad, Manila, Cebu, Jakarta, Surabaya, Bangkok, Hanoi, Ho Chi Minh City,
Kuala Lumpur, Kathmandu, Colombo, Istanbul, Cairo, Lagos, Nairobi, São Paulo,
Rio, Mexico City, Buenos Aires, Bogotá, Lima, New York, LA, Chicago, Toronto,
London, Manchester, Berlin, Paris, Madrid, Rome, Warsaw, Moscow, Kyiv, Tokyo,
Seoul, Dubai, Riyadh, Sydney, Melbourne.

### Tier 5 — Language pages (35)
Pattern: `/{language}-video-chat` — e.g. `/bengali-video-chat`,
`/hindi-video-chat`, `/tamil-video-chat`, `/telugu-video-chat`,
`/marathi-video-chat`, `/punjabi-video-chat`, `/urdu-video-chat`,
`/arabic-video-chat`, `/spanish-video-chat`.

SillyChat proves these convert — `bengali video chat`, `bangla chat online`,
and `talk to strangers bengali` are three separate entries in their directory.

### Tier 6 — Feature / use-case pages (40)
`/random-video-chat`, `/free-video-chat-online`,
`/chat-without-registration`, `/cam-to-cam-chat`, `/talk-to-strangers`,
`/anonymous-chat`, `/1v1-chat`, `/video-chat-with-girls`,
`/video-chat-with-boys`, `/voice-chat-online`, `/random-audio-call`,
`/text-chat-with-strangers`, `/chat-without-showing-face`,
`/video-chat-no-login`, `/talk-to-someone-right-now`,
`/make-friends-online`, `/practice-english-with-strangers`,
`/late-night-chat`, `/chat-when-lonely`, `/video-chat-for-introverts`…

### Tier 7 — Blog (150)
Four categories, matching AirTalk's proven split:

**Guides (25)** — how-to and definitional; targets featured snippets
**Comparisons (15)** — `X vs Y`, `best N alternatives`; highest commercial intent
**Safety (10)** — trust and E-E-A-T; the content Google most wants to see from a
stranger-chat site
**Community (20)** — emotional long-tail: loneliness, social anxiety, making
friends, first-conversation nerves. **The fastest-ranking category for a new
domain**, and AirTalk's strongest work.

**Blog total: 70** — double what the ranking competitor has, not four times.
Writing 150 mediocre posts to beat a site that ranks on 35 good ones would be
solving the wrong problem.

**Total: 8 + 25 + 60 + 80 + 35 + 40 + 70 = 318.**

Round the remainder up with city and language pages, which are the cheapest to
differentiate legitimately — not with more blog posts.

---

## 4. Internationalization — the decision that matters most

Our current approach (whole page written in Russian at `/directory/russia`, no
hreflang) is the worst of both worlds. Adopt SillyChat's structure:

```
/random-video-chat-india          ← canonical, English, x-default
/hi/random-video-chat-india       ← hreflang="hi-IN"
/bn/random-video-chat-india       ← hreflang="bn-IN"
/ta/random-video-chat-india       ← hreflang="ta-IN"
/te/random-video-chat-india       ← hreflang="te-IN"
```

Rules:
- Every page carries a **self-referencing canonical**
- hreflang tags are **reciprocal** — each version links to all others including
  itself, or Google ignores the whole cluster
- `x-default` points at the English version
- Translations must be **real translations**, not machine-swapped keywords

**Scope control:** do NOT localise all 400 pages — that is 2,000 URLs of
thin content and a guaranteed quality problem. Localise only the **top 20**
pages into 4 Indian languages = 80 extra URLs. Expand only where analytics
shows demand.

The existing 13-language client-side switcher should stay as a **UX** feature.
It is not an SEO asset and never will be. Do not confuse the two.

---

## 5. Content quality bar

You said 1000+ words and no AI-looking writing. To hit that at 400 pages, each
template needs genuine per-page variables — not a find-and-replace on the
country name. That is the difference between a directory and a doorway.

**Every country/city page must carry data unique to that place:**
- Languages actually spoken there, with native script
- Peak activity hours **in local time** (we already model this — `peakTimes`)
- Local connectivity reality (4G/5G availability affects video quality advice)
- 3–5 cities/regions named specifically
- Conversation-starter topics that are locally true (food, sport, festivals,
  music) — this is where a page stops reading as generated
- Local etiquette and safety notes that genuinely differ by country
- FAQs written for that market's actual concerns (data cost, VPN legality,
  language barrier) — **not** the same five FAQs with a name swapped

**Structure per page (targets 1,200–1,500 words):**
```
H1  — primary keyword, natural phrasing
Intro (100–150w) — keyword in first 100 words, states what the page delivers
H2  — What is {mode} chat in {place}?           (200w)
H2  — How to start (numbered steps)             (200w)
H2  — Why people in {place} use Vidibro         (200w, LOCAL specifics)
H2  — Languages & best times to connect         (150w, real data)
H2  — Safety guidance for {place}               (200w)
H2  — Vidibro vs other options                  (table, 150w)
H2  — FAQ (6–8 Q&As, market-specific)           (300w)
Related pages block — 6–10 contextual internal links
```

**Blog posts: 2,000–3,500 words**, matching AirTalk's 3,832 on flagship guides.
Depth wins here; 150 posts at 800 words will lose to 60 posts at 2,500.

### On "no AI-generated writing"
I have to be straight with you: **I am an AI. Anything I write is AI-generated.**
I cannot produce human-written text, and I will not label my output as human.

What I *can* do is write content that is genuinely useful, factually specific,
and not templated — which is what Google actually measures. Google's policy does
not ban AI content; it bans **scaled content abuse**: mass-produced pages with
no original value, whoever or whatever made them. A 500-word spun template is a
problem whether a human or a model wrote it. A 1,400-word page with real local
data is fine either way.

**My recommendation:** I draft, a human edits. Even light human editing — adding
a genuine observation, fixing a phrasing that reads generic — measurably lifts
quality, and it makes the author byline honest.

---

## 6. Risks I have to name

**1. 400 templated pages is exactly what Google's scaled-content-abuse policy
targets.** This is a real, current enforcement priority. SillyChat ranking today
is not proof of safety — thin programmatic directories are precisely what gets
hit in broad core updates. Mitigation: the per-page unique data in §5, and
**shipping in waves** (§7) so a penalty hits 50 pages, not 400.

**2. The author byline may be fabricated.** `lib/blogData.ts` credits
"Nitin Jain, Product Lead & WebRTC Engineer". If that is not a real person, it
is an invented E-E-A-T signal — the same category of problem as the testimonials
you correctly rejected. Either use a real name with a real bio page, or use a
neutral byline like "Vidibro Team". A fake expert is worse than no expert.

**3. The homepage stat counter.** `24,918+ Active Users` visibly changes between
loads and went *down* across my screenshots (24,918 → 24,921 → 24,906). If it is
not real, remove it. SillyChat does the same thing with `1M+`; copying their
weakest choice is not a strategy.

**4. Duplicate-content risk across tiers.** `/random-video-chat-india`,
`/hindi-video-chat`, and `/video-chat-mumbai` will overlap heavily unless each
has a clearly separate angle: country = national scope, language = the language
itself, city = local specifics. Write the angle into the brief before writing
the page.

**5. Crawl budget.** A new domain will not get 400 pages indexed at once. Waves
plus a correct sitemap plus internal links from already-indexed pages is how
they get discovered.

---

## 7. Execution order

### Phase 0 — Technical foundation (do first, ~1 day)
Nothing below matters until this is done.

1. **Fix `sitemap.ts`** to import blog + directory data and map over it —
   currently the single worst bug
2. Add `metadataBase`, `openGraph`, `twitter`, canonical to `app/layout.tsx`
3. Add `export const metadata` to all 8 core pages
4. Verify `/public/og-image.webp` exists (referenced by `lib/seo.ts`)
5. Add `WebSite` + `Organization` JSON-LD to the homepage
6. Add `FAQPage` JSON-LD to `/faq` (the Q&As already exist in `translations.ts`)
7. Add `manifest.ts`
8. Server-render real content onto `/video-chat`, `/audio-chat`, `/text-chat`
9. Set up Google Search Console + Bing Webmaster and submit the sitemap

### Phase 1 — Templates + first wave (50 pages)
- Build the page template with all §5 sections
- Rebuild `/directory` as a proper hub: grouped by Country / City / Language /
  Topic, matching SillyChat's grouping but with our own data columns
- Ship 20 countries + 20 blog posts + 10 competitor pages
- **Then stop and measure for 3–4 weeks.** Confirm indexation and impressions
  before scaling.

### Phase 2 — Scale (150 pages)
40 more countries, 50 cities, 60 blog posts. Only if Phase 1 indexed cleanly.

### Phase 3 — Long tail (200 pages)
Remaining cities, all language pages, feature pages, remaining blog.

### Phase 4 — Internationalization
`/hi/`, `/bn/`, `/ta/`, `/te/` for the top 20 pages, with reciprocal hreflang.

### Phase 5 — Off-page
Programmatic SEO does not rank without links. Reddit/Quora participation,
directory submissions, digital-PR angles around anonymous-chat safety, and
guest posts. This is the part most competitors under-invest in.

---

## 8. Things you did not ask about that matter for ranking

- **Core Web Vitals** — a confirmed mobile ranking factor. Today's performance
  work (removing the box-shadow animation, header blur, per-frame call costs)
  directly helps. Measure with PageSpeed Insights after deploy.
- **Search Console is non-negotiable.** Without it you are guessing at which of
  the 400 pages actually earned impressions.
- **Internal linking is the highest-leverage free win.** SillyChat has 48
  internal links on one country page. Every page needs contextual links to its
  siblings — country → its cities, city → its language, all → money pages.
- **Breadcrumbs with `BreadcrumbList` schema** — SillyChat has them, we do not.
  They also render in SERPs.
- **`lastModified` in the sitemap must be real**, not `new Date()` on every
  build. Ours currently claims every page changed on every deploy, which trains
  Google to ignore the signal.
- **Trailing-slash consistency** — AirTalk uses trailing slashes throughout. Pick
  one and enforce it with redirects, or you create duplicate URLs.
- **Image `alt` text and file names** — AirTalk uses 6 images per post. We use
  one shared `/og-image.webp` everywhere.
- **404 and redirect hygiene** — any URL that ever shipped and changed needs a
  301.
- **Page speed on the blog** — long articles need lazy-loaded images.

---

## 9. Design & content standard (decisions, not options)

You asked what is best rather than giving a preference, so these are decisions.
Change any of them and I will follow, but this is what I would ship.

### 9.1 The author byline

Use **"Vidibro Team"** until there is a real person willing to be named with a
real `/author/{name}` bio page and at least one external profile to corroborate
them. Google does not verify identity, so an invented expert is not "caught" —
it simply provides no E-E-A-T benefit while carrying a human trust risk. A real
named author with a real footprint is worth building later; a fictional one is
worth nothing now.

If a real person is available, build it properly:
- `/author/{slug}` page with a genuine bio, photo, and areas of expertise
- `Person` schema on that page, linked via `author` in each post's `Article`
  schema with `sameAs` pointing at their external profiles

### 9.2 Images — yes, and they matter more than people think

AirTalk uses **6 images per post**. We currently reuse one shared
`/og-image.webp` everywhere, which wastes an easy signal.

Per page:
- **1 hero image**, unique per page, descriptive filename
  (`video-chat-mumbai-hero.webp`, not `hero-1.webp`)
- **3–5 in-content images** for blog posts, one roughly every 500 words
- **Real `alt` text** describing the image, with the keyword only where it is
  natural. `alt="Two people on a video call"` beats
  `alt="random video chat mumbai free no login"` — keyword stuffing in alt is a
  known negative signal.
- **WebP**, lazy-loaded below the fold, explicit `width`/`height` to prevent
  layout shift (CLS is a ranking factor)
- **Diagrams and comparison tables outperform stock photos.** A "how matching
  works" diagram or an honest feature-comparison table earns links and
  snippets; a stock photo of smiling strangers earns nothing.

I cannot generate images. Options: commission them, use properly licensed stock,
or build SVG/CSS diagrams in-code — the last is free, unique, scales infinitely,
and is what I would do for the structural illustrations.

### 9.3 Landing page structure

Rebuild toward this order. It follows SillyChat's proven sequence but with more
depth, since 603 words is thin for a homepage.

```
1  Hero — H1, one-line value prop, three mode CTAs
2  Three modes — video / audio / text, one card each, each linking to its page
3  How It Works — 3 numbered steps (H3 each)
4  Why Vidibro — 6 feature cards (H3 each)
5  Safety & privacy — our genuine differentiator: P2P, nothing stored
6  Popular Chat Destinations — deduplicated, grouped, ~12 links + directory link
7  FAQ — 6–8 Q&As with FAQPage schema
8  Footer — Product / Features / Resources / Legal / Popular Pages
```

Target 900–1,200 words. Two things to fix from the reference: their destination
list contains a duplicate ("Cam to Cam Chat" appears twice), and their stat
counters are unsourced. Do neither.

### 9.4 The directory hub — full rebuild

The current `/directory` is the weakest page on the site. Rebuild as a real hub:

```
H1   Chat Directory
Intro  100–150 words explaining what the directory is for

H2   By Country          → 60 links, grouped by region (Asia, Europe, …)
H2   By City             → 80 links, grouped by country
H2   By Language         → 35 links, native script alongside English
H2   By Chat Type        → 40 feature links
H2   Omegle Alternatives → 25 links
H2   FAQ about the directory
```

Grouping by region matters: a flat list of 240 links is a link dump, while
grouped sections give Google a semantic hierarchy and users a way to scan.

Each entry shows more than a link — country flag, primary languages, peak hours.
That turns the hub itself into a page with unique value rather than a sitemap in
disguise.

### 9.5 Writing standard

Reference quality bar: AirTalk's flagship guide is 3,832 words with 21 H3s and a
distinct H2 per search intent. That is the target, not 400 thin pages.

Rules for every page:
- **Lead with the answer.** No "In today's digital world" preambles — that is
  the single clearest tell of generated content and it wastes the first 100
  words, which carry the most weight.
- **One concrete, checkable fact per section.** Real numbers, real place names,
  real behaviour. Generic claims are what make a page read as machine-written.
- **Vary sentence length deliberately.** Uniform 15–20 word sentences read
  mechanical.
- **No em-dash-heavy, tricolon-heavy patterning.** Repeated "not X, but Y"
  constructions are a giveaway.
- **Answer the query in the first paragraph under each H2** — this is what wins
  featured snippets.
- **Every claim we make about ourselves must be true.** No invented user counts,
  no fake uptime percentages, no "AI-powered moderation" unless it exists.
- **Write for someone who is lonely at 1am**, which is the actual reader. That
  framing alone removes most of the corporate-generated tone.

Per-page unique data is what makes 400 pages legitimate rather than doorways.
For a city page that means: real neighbourhoods, real peak hours in local time,
locally true conversation topics, the actual languages spoken there, and mobile
data realities in that market.


---

## 10. The writing spec, measured from a ranking competitor

Taken from `airtalk.live/blog/how-anonymous-chat-helps-social-anxiety/`, a
typical (not flagship) post. These are measurements, not preferences.

| Metric | Measured | What it means for us |
|---|---|---|
| Words | 1,901 | 1,500–2,000 is the working target, not 3,000+ |
| H2 | 11 | Most phrased as **questions** |
| H3 | 17 | Sub-answers under each question |
| Paragraphs | 40 | Short — averaging **42 words** |
| Sentences | 140, avg **14 words** | Range **2 to 64** words |
| Bulleted lists | **0** | Entirely prose |
| Images | 4 | Descriptive filenames, real alt text |
| Internal links | 13 | Contextual, mid-sentence |
| Outbound links | 1 | To **adaa.org** — a real authority |

### The four things that make it not read as machine-written

**1. It opens with a hard number and names its source.**
> "Social anxiety disorder affects an estimated 15 million adults in the United
> States … according to the Anxiety and Depression Association of America."

No "In today's digital world." A checkable fact in the first sentence, credited
to a named organisation, with an outbound link to it. That single outbound
citation does more for E-E-A-T than any amount of self-description.

**2. Sentence rhythm varies enormously.** Average 14 words, but the range is 2
to 64. Uniform sentence length is the clearest tell of generated text. The
second sentence of that post is five words: *"Most people who have it never get
treatment."*

**3. Zero bullet lists.** Continuous prose throughout. Bullets are the reflex
format for generated content, and their absence is conspicuous in a good way.

**4. H2s are written as the questions people actually search.** "Is Talking to
Strangers Good for Social Anxiety?", "Does Anonymous Chat Help With Social
Anxiety?" — each answered immediately in the paragraph below. That is what wins
featured snippets.

### Blog index structure (also measured)

Sidebar with **category counts** (`Guides (18)`), a **tag cloud** of 15+ tags
with a "See More", pagination, and cards showing image + title + date + author +
category + a real excerpt (not a truncated first line).

The card excerpts are written, not auto-truncated — the social-anxiety card
opens on the statistic, the conversation-starter card opens with *"Most people
delete the first thing they type."* Worth copying: it is a small amount of extra
work per post that makes an index page genuinely readable.

### Decided: the byline is "Vidibro Team"

AirTalk uses one named human ("Harris Mesia") across all 35 posts. A real name
is the stronger signal, and this can be upgraded later without changing a single
URL — the `Article` schema's `author` field is the only thing that changes.

---

## 11. The country/city page, measured

From `silly.chat/video-chat-india` — the page type that maps directly onto our
Tiers 3 and 4.

| Signal | Measured |
|---|---|
| Words | **569** |
| H1 | 1 — "Best Free Video Chat in India" |
| H2 | 8 |
| H3 | **27** |
| Lists | 4 |
| Images | 3 |
| Internal links | **57 total, 38 unique** |
| JSON-LD | Organization, WebPage, BreadcrumbList, FAQPage |
| hreflang | en, hi, bn, ta, te |

### The finding that matters most: they redirect, they don't duplicate

`/random-video-chat-india` **301s to** `/video-chat-india`. One canonical page
per market, with the alternate keyword slug redirecting into it. Their directory
still links the old slug, which simply redirects on click.

This is the mechanism that keeps a programmatic site out of duplicate-content
trouble, and we should adopt it as a rule:

> **One page per market. Every alternate slug 301s to it. Never two URLs
> competing for the same intent.**

For us that means picking one pattern — `/video-chat-{place}` — and redirecting
`/random-video-chat-{place}` into it rather than building both, which §3
originally implied.

### The real engine is internal linking, not word count

569 words is thin. What the page is dense in is **links** — 38 unique internal
destinations from a single country page, and they are not a generic footer dump.
From India specifically:

```
→ /kolkata-video-chat              city within the country
→ /bangla-chat-online              language spoken there
→ /bengali-dating-chat             intent variant of that language
→ /talk-to-strangers-bengali       another intent variant
→ /audio-chat-india                same market, different mode
→ /omegle-alternative-india        competitor term for that market
→ /video-chat-australia            sibling country
```

Every market becomes a **hub with spokes**: country → its cities → its languages
→ its modes → its competitor terms. That is how 240 programmatic pages get
crawled and indexed without external links, and it is the single most
transferable thing on their site.

**Design rule for our template:** each country page must link to at least
3 cities, 2 languages, 2 modes, 1 competitor term, and 2 sibling countries — all
contextual and in-content, not a footer block.

### Where we should deliberately not copy them

- **569 words is thin.** Their Malaysia page is 884, this one is 569, and both
  are heavily templated. It ranks today; it is not a durable position. Our
  1,200–1,500 target with genuine local data stands.
- **Their hreflang is inconsistent** — the Malaysia page carries `x-default`,
  this one does not, and the localised versions sit on a *different* slug
  (`/hi/random-video-chat-india`) from the English canonical
  (`/video-chat-india`). Keep ours consistent: same slug across all languages,
  `x-default` on every cluster, fully reciprocal.
- **Unsourced stat counters** (`1M+`, `500k+`, `99.9%`) appear here too.
