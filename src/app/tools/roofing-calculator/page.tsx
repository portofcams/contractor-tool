import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import RoofingCalculator from "./RoofingCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/roofing-calculator";
const TITLE = "Roofing Calculator: Squares & Shingle Bundles (Free)";
const DESCRIPTION =
  "Free roofing calculator. Enter your roof footprint and pitch to get the roof area, roofing squares, and how many bundles of shingles you need.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["roofing calculator", "how many bundles of shingles", "roofing squares calculator", "shingle calculator"],
  openGraph: {
    type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "What is a roofing square?", a: "A square is 100 square feet of roof area. Roofers measure and price work in squares — a 2,000 sq ft roof is 20 squares." },
  { q: "How many bundles of shingles are in a square?", a: "Most architectural (dimensional) shingles come 3 bundles per square. Heavier or premium shingles can be 4 bundles per square — check the wrapper." },
  { q: "How do I figure roof area from the footprint?", a: "Multiply the building's footprint by a pitch factor: about 1.12 for a 6-in-12 roof, 1.25 for 9-in-12, and 1.42 for 12-in-12. The calculator applies this for you." },
  { q: "How much waste should I add for roofing?", a: "Add about 10% for a simple gable roof and 15% for roofs with hips, valleys, and dormers that need more cutting." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function RoofingCalculatorPage() {
  return (
    <ToolShell breadcrumb="Roofing Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Roofing Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your roof footprint and pitch to get the roof area, roofing squares,
        and how many bundles of shingles to order.
      </p>
      <div className="mt-8"><RoofingCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate shingles</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Multiply the roof footprint by a pitch factor to get the true sloped
          area, divide by 100 for squares, and multiply squares by 3 for bundles
          of architectural shingles. Add 10–15% for waste, plus starter, ridge
          cap, and underlayment.
        </p>
      </section>
      <ToolCTA headline="Measure the whole exterior, not just the roof" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Roofing calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
