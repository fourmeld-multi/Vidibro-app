import type { Tone } from "@/components/directory/Cards";

export interface PhraseItem {
  native: string;
  romanized?: string;
  meaning: string;
}

export interface WhyCard {
  title: string;
  body: string;
  tone: Tone;
}

export interface FamousFact {
  title: string;
  body: string;
  tone: Tone;
}

export interface StepItem {
  step: number;
  title: string;
  body: string;
}

export interface CloneRow {
  feature: string;
  us: boolean | string;
  them: boolean | string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface NativeLangData {
  lang: string;
  dir?: "ltr" | "rtl";
  ogLocale: string;
  canonicalSlug: string;

  /* SEO */
  title: string;
  description: string;

  /* Hero */
  h1: string;
  tagline: string;
  intro: string;

  /* Buttons */
  btnVideo: string;
  btnVoice: string;
  btnText: string;

  /* Stats */
  peakHoursDisplay: string;
  langCount: string;

  /* Why Vidibro */
  whyTitle: string;
  whyBlurb: string;
  whyCards: WhyCard[];

  /* Local knowledge */
  localTitle: string;
  peakNote: string;
  phrases?: PhraseItem[];
  starters: string[];
  connectivity: string;

  /* Famous/Cultural facts */
  famousTitle: string;
  famousFacts: FamousFact[];

  /* How it works */
  howTitle: string;
  steps: StepItem[];

  /* What is section */
  whatIsTitle: string;
  whatIsBody: string;

  /* Clone comparison */
  cloneTitle: string;
  cloneBlurb: string;
  cloneRows: CloneRow[];

  /* Safety */
  safetyTitle: string;
  safetyNote: string;
  safetyBody: string;
  safetyLinkText: string;

  /* FAQ */
  faqTitle: string;
  faqs: FaqItem[];

  /* Final CTA */
  ctaTitle: string;
  ctaBody: string;
}
