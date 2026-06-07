import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import GrassSeedCalculator from "./GrassSeedCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/grass-seed-calculator";
const TITLE = "Grass Seed Calculator: How Much Seed? (Free)";
const DESCRIPTION = "Free grass seed calculator. Enter your lawn size and seeding rate to get how many pounds of grass seed you need for a new lawn or overseeding.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["grass seed calculator", "how much grass seed do I need", "lawn seeding rate", "overseeding calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much grass seed do I need?", a: "Multiply your lawn area in square feet, divide by 1,000, and multiply by the seeding rate. A new lawn at 5 lb per 1,000 sq ft over 4,000 sq ft needs about 20 pounds of seed." },
  { q: "What's the seeding rate for a new lawn vs overseeding?", a: "New lawns generally use about 5 pounds per 1,000 sq ft, while overseeding an existing lawn uses about 3 pounds per 1,000 sq ft. Always check your seed bag, since rates vary by species." },
  { q: "How do I measure an irregular lawn?", a: "Break the yard into rectangles, calculate each area, and add them up. Subtract beds, driveways, and the house footprint." },
  { q: "Should I add starter fertilizer?", a: "Yes — a phosphorus-rich starter fertilizer at seeding helps roots establish. On slopes, add straw or a seed blanket to hold seed and moisture." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function GrassSeedCalculatorPage() {
  return (
    <ToolShell breadcrumb="Grass Seed Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Grass Seed Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter your lawn size and seeding rate to get how many pounds of grass seed to buy for a new lawn or overseeding.</p>
      <div className="mt-8"><GrassSeedCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to calculate grass seed</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Take the lawn area in square feet, divide by 1,000, and multiply by the rate on the bag (about 5 lb/1,000 sq ft for new lawns, 3 for overseeding). Subtract beds and hardscape from the area first.</p></section>
      <ToolCTA headline="Measure lawns and lots without a wheel" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Grass seed FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
