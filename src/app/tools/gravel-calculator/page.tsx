import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import GravelCalculator from "./GravelCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/gravel-calculator";
const TITLE = "Gravel Calculator: Cubic Yards & Tons (Free)";
const DESCRIPTION =
  "Free gravel calculator. Enter area and depth to get cubic yards and tons of gravel, crushed stone, or aggregate for a driveway, path, or base.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["gravel calculator", "how much gravel do I need", "crushed stone calculator", "gravel tons calculator", "driveway gravel calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much gravel do I need?", a: "Multiply area × depth (in feet) for cubic feet, divide by 27 for cubic yards. A 20×10 ft path at 3 inches deep needs about 1.85 cubic yards." },
  { q: "How many tons of gravel are in a cubic yard?", a: "Gravel weighs roughly 1.4 tons per cubic yard, though it varies from about 1.3 to 1.5 tons depending on the stone and moisture." },
  { q: "How deep should gravel be?", a: "Use 4–6 inches total for a driveway (often in layers over a base), 2–3 inches for a walking path, and 3–4 inches for drainage." },
  { q: "Should I order gravel by the yard or the ton?", a: "Quarries sell both. Cubic yards measure volume and tons measure weight — use whichever your supplier prices by; the calculator gives you both." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function GravelCalculatorPage() {
  return (
    <ToolShell breadcrumb="Gravel Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Gravel Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter area and depth to get cubic yards and tons of gravel, crushed
        stone, or aggregate for a driveway, path, or base layer.
      </p>
      <div className="mt-8"><GravelCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate gravel</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Volume in cubic feet is <code>area × (depth ÷ 12)</code>; divide by 27 for
          cubic yards. Multiply yards by ~1.4 to estimate tons. Order a little
          extra for compaction and uneven subgrade.
        </p>
      </section>
      <ToolCTA headline="Scope driveways and hardscape on-site" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Gravel calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
