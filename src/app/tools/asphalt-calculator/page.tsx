import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import AsphaltCalculator from "./AsphaltCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/asphalt-calculator";
const TITLE = "Asphalt Calculator: Tons for a Driveway (Free)";
const DESCRIPTION = "Free asphalt calculator. Enter area and thickness to get the tons of hot-mix asphalt needed for a driveway, parking area, or path.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["asphalt calculator", "how much asphalt do I need", "asphalt tonnage calculator", "driveway asphalt calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much asphalt do I need?", a: "Multiply area by thickness in feet for cubic feet, then multiply by about 145 pounds per cubic foot and divide by 2,000 for tons. A 600 sq ft driveway at 3 inches is roughly 10.9 tons of hot mix." },
  { q: "How thick should an asphalt driveway be?", a: "Residential driveways are usually 2 to 3 inches of compacted asphalt over 4 to 8 inches of compacted aggregate base. Heavier loads need more." },
  { q: "How much does a ton of asphalt cover?", a: "At 2 inches compacted, one ton covers roughly 80 to 90 square feet; at 3 inches, about 55 to 60 square feet. Density and mix vary, so treat it as an estimate." },
  { q: "Does the calculator include the base?", a: "No — it estimates the asphalt layer only. The aggregate base under it is a separate material; use a gravel calculator for the base course." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function AsphaltCalculatorPage() {
  return (
    <ToolShell breadcrumb="Asphalt Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Asphalt Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the area and thickness to get the tons of hot-mix asphalt for a driveway, lot, or path.</p>
      <div className="mt-8"><AsphaltCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate asphalt</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Volume in cubic feet is <code>area × (thickness ÷ 12)</code>. Hot-mix asphalt weighs ~145 lb/cu ft compacted, so multiply by 145 and divide by 2,000 for tons. Estimate the aggregate base separately.</p></section>
      <ToolCTA headline="Measure lots and driveways without a wheel" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Asphalt calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
