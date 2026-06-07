import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import SandCalculator from "./SandCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/sand-calculator";
const TITLE = "Sand Calculator: Cubic Yards, Tons & Bags (Free)";
const DESCRIPTION = "Free sand calculator. Enter area and depth to get cubic yards, tons, and 50 lb bag count for mason sand, concrete sand, play sand, or bedding sand.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["sand calculator", "how much sand do I need", "cubic yards of sand", "play sand calculator", "mason sand calculator", "bedding sand calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate how much sand I need?", a: "Multiply area (length × width) by the depth in feet (divide inches by 12) for cubic feet, then divide by 27 for cubic yards. A 10×10 ft sandbox at 2 inches deep needs about 1.85 cu ft, well under one cubic yard." },
  { q: "How many bags of sand are in a cubic yard?", a: "A 50 lb bag holds roughly 0.5 cubic feet of sand. There are 27 cubic feet in a yard, so it takes about 54 bags of 50 lb sand to make one cubic yard." },
  { q: "What is the difference between mason sand and play sand?", a: "Mason sand is finer and more consistent — used for mortar, bedding pavers, and pool bases. Play sand is washed and screened for safety. Concrete sand is coarser and used in mortar and base mixes. Choose the type for your specific use." },
  { q: "How much does a yard of sand weigh?", a: "Dry sand weighs roughly 2,700 lb (1.35 tons) per cubic yard. Wet or concrete sand is heavier, around 3,000 lb per yard. Weight varies by type and moisture content." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function SandCalculatorPage() {
  return (
    <ToolShell breadcrumb="Sand Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Sand Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter area and depth to get cubic yards, tons, and bags of sand — for bedding, sandboxes, mortar, concrete, and paver bases.</p>
      <div className="mt-8"><SandCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate sand</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Volume is <code>area × (depth ÷ 12)</code> in cubic feet; divide by 27 for cubic yards. Multiply by ~1.35 for tons of dry sand. Order bulk by the yard for anything over about half a yard — it's far cheaper than bags.</p>
      </section>
      <ToolCTA headline="Measure sandboxes, courts, and beds from a scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Sand calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
