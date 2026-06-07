import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import GutterCalculator from "./GutterCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/gutter-calculator";
const TITLE = "Gutter Calculator: Linear Feet & Downspouts (Free)";
const DESCRIPTION = "Free gutter calculator. Enter your roof eave length to get linear feet of gutter, number of downspouts, and hangers needed.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["gutter calculator", "how many downspouts", "linear feet of gutter", "rain gutter calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many downspouts do I need?", a: "Plan on one downspout for roughly every 30 to 40 feet of gutter run, and at least one per gutter section. Larger or steeper roofs shed more water and need them closer together." },
  { q: "How far apart should gutter hangers be?", a: "Space hangers about every 24 inches in most climates, and every 12 to 18 inches where heavy snow or ice loads are expected." },
  { q: "How much extra gutter should I buy?", a: "Add about 5% for end laps, miters at corners, and mistakes. Also count inside and outside corners, end caps, and elbows separately." },
  { q: "What size gutter and downspout do I need?", a: "Five-inch K-style gutter with 2×3-inch downspouts suits most homes; large or steep roofs often step up to 6-inch gutter and 3×4-inch downspouts to handle the flow." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function GutterCalculatorPage() {
  return (
    <ToolShell breadcrumb="Gutter Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Gutter Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter your total roof eave length to get linear feet of gutter, downspouts, and hangers.</p>
      <div className="mt-8"><GutterCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate gutters</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Measure the total eave run, add ~5% for laps and miters, place a downspout every 30–40 ft, and a hanger about every 2 ft. Add corners, end caps, and elbows separately.</p></section>
      <ToolCTA headline="Measure roof lines without a ladder" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Gutter calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
