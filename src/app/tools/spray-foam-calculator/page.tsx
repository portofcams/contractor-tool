import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import SprayFoamCalculator from "./SprayFoamCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/spray-foam-calculator";
const TITLE = "Spray Foam Insulation Calculator: Kits & Board Feet (Free)";
const DESCRIPTION = "Free spray foam calculator. Enter area and thickness to get board feet and how many 2-component insulation kits you need for closed-cell or open-cell foam.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["spray foam calculator", "spray foam insulation calculator", "how many spray foam kits", "closed cell foam calculator", "board feet foam calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate spray foam insulation?", a: "Spray foam is measured in board feet (bf). One board foot covers 1 square foot at 1 inch thick. Multiply your area by the target thickness in inches to get total board feet, then divide by the kit size (typically 200 bf for closed-cell, 600 bf for open-cell kits)." },
  { q: "What is the R-value of spray foam?", a: "Closed-cell spray foam provides about R-6.5 per inch, making it the highest R-value per inch of any common insulation. Open-cell foam runs about R-3.8 per inch but is less expensive and great for sound dampening." },
  { q: "Closed-cell vs open-cell spray foam: which do I need?", a: "Use closed-cell for exterior walls, crawl spaces, and anywhere you need a vapor barrier, high R-value in a thin space, or structural rigidity. Use open-cell for interior walls, attic decks, and sound control where moisture is not a concern." },
  { q: "How many cans of spray foam do I need?", a: "Small cans (like Great Stuff) are for gap-filling and seal roughly 12–15 board feet per can. For insulating large areas, use 2-component contractor kits — small kits yield about 200 board feet, larger ones 600+ board feet." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function SprayFoamCalculatorPage() {
  return (
    <ToolShell breadcrumb="Spray Foam Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Spray Foam Insulation Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the area and target thickness to get board feet and how many 2-component foam kits you need, for closed-cell or open-cell insulation.</p>
      <div className="mt-8"><SprayFoamCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate spray foam</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Board feet = sq ft × thickness in inches. Divide by the kit yield for kit count. Add 10–15% — cold temperatures and fast technique reduce actual yield. Closed-cell requires multiple thin passes; never exceed 2 inches per pass.</p>
      </section>
      <ToolCTA headline="Measure walls and attics from a LiDAR scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Spray foam FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
