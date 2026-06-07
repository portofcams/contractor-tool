import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import DrivewayCostCalculator from "./DrivewayCostCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/driveway-cost-calculator";
const TITLE = "Driveway Cost Calculator: Concrete vs Asphalt Estimate (Free)";
const DESCRIPTION = "Free driveway cost calculator. Enter driveway dimensions to estimate material cost for concrete or asphalt — includes cubic yards, tonnage, and per-sq-ft price.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["driveway cost calculator", "concrete driveway cost calculator", "asphalt driveway cost calculator", "driveway estimate", "cost to pave a driveway"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much does a concrete driveway cost per square foot?", a: "Material cost for ready-mix concrete runs roughly $5 to $10 per square foot for a 4-inch residential slab. With labor, grading, and finishing, total installed cost typically ranges from $8 to $18 per square foot. Decorative finishes (stamped, exposed aggregate) add $3 to $12 more." },
  { q: "How much does an asphalt driveway cost per square foot?", a: "Asphalt material and installation typically runs $3 to $7 per square foot for a standard 2- to 3-inch residential driveway. Prices vary significantly by region and asphalt market. Asphalt costs less upfront than concrete but needs sealing every 3 to 5 years." },
  { q: "How thick should a residential driveway be?", a: "Concrete driveways are typically 4 inches thick for passenger vehicles, 5 to 6 inches for RVs or heavy trucks. Asphalt driveways are typically 2 to 3 inches of asphalt over 4 to 6 inches of compacted gravel base. The base is critical — poor drainage or soft soil requires extra base material." },
  { q: "Concrete vs asphalt driveway: which is better?", a: "Concrete lasts 30 to 50 years with minimal maintenance but costs more upfront and cracks under freeze-thaw cycles without proper expansion joints. Asphalt is cheaper and more flexible in cold climates but needs sealing every few years and resurfacing after 15 to 20 years. Both need proper gravel base and drainage to perform." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function DrivewayCostCalculatorPage() {
  return (
    <ToolShell breadcrumb="Driveway Cost Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Driveway Cost Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter your driveway dimensions and choose concrete or asphalt to get material quantity and an estimated cost range.</p>
      <div className="mt-8"><DrivewayCostCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate driveway cost</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Multiply length × width for square footage, then multiply by thickness (in feet) for cubic feet — divide by 27 for cubic yards (concrete) or multiply by ~145 lb/cuft for tons (asphalt). Material unit costs vary by region and market conditions; get a supplier quote and multiply by quantity, then add 15–20% for labor and base prep.</p>
      </section>
      <ToolCTA headline="Measure the driveway with a LiDAR scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Driveway cost calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
