import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import CarpetStairsCalculator from "./CarpetStairsCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/carpet-stairs-calculator";
const TITLE = "Carpet Stairs Calculator: How Much Carpet? (Free)";
const DESCRIPTION = "Free carpet stairs calculator. Enter step count, stair width, rise, and tread to get the total linear feet and square footage of carpet for a staircase.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["carpet stairs calculator", "how much carpet for stairs", "stair carpet calculator", "carpet for staircase", "waterfall carpet stairs"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much carpet do I need for stairs?", a: "For each step, add the tread depth and rise height in inches, plus 2 inches for the waterfall fold or 4 inches for an upholstered wrap. Multiply by the number of steps and divide by 12 for linear feet. Add 15% waste." },
  { q: "What is the difference between waterfall and upholstered carpet stairs?", a: "Waterfall carpet folds straight down from the nosing to the riser — easier to install and common in residential work. Upholstered (or cap-and-band) carpet wraps under the nosing and tacks to the riser — a cleaner look but requires more material and labor." },
  { q: "How much waste should I add for carpet on stairs?", a: "Add at least 15% for a plain carpet and 20% or more for patterned carpet where the design must match between steps. Stairs produce more offcuts than flat rooms." },
  { q: "Do I need pad under stair carpet?", a: "Yes — stair pad (usually thin, dense rubber or foam) is tacked to each tread and riser before the carpet goes on. It protects the carpet backing and adds cushion. Measure and buy pad to match your stair count and width." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function CarpetStairsCalculatorPage() {
  return (
    <ToolShell breadcrumb="Carpet Stairs Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Carpet Stairs Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter step count, stair width, rise, and tread depth to get the total linear feet and square footage of carpet for a staircase.</p>
      <div className="mt-8"><CarpetStairsCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate carpet for stairs</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Each step needs rise + tread + wrap allowance in inches. Multiply by steps for total inches, divide by 12 for linear feet, and add 15% waste. Multiply by stair width for square footage. Always run pile direction down the stairs and buy pad separately.</p>
      </section>
      <ToolCTA headline="Measure stair dimensions from a LiDAR scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Carpet stairs FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
