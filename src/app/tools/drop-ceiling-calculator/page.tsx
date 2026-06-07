import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import DropCeilingCalculator from "./DropCeilingCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/drop-ceiling-calculator";
const TITLE = "Drop Ceiling Calculator: Tiles & Grid (Free)";
const DESCRIPTION = "Free drop ceiling calculator. Enter room size and tile size to get how many ceiling tiles you need, plus wall angle and main tee estimates.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["drop ceiling calculator", "suspended ceiling calculator", "ceiling tile calculator", "how many ceiling tiles"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many ceiling tiles do I need?", a: "Divide the ceiling area by the tile size — 8 sq ft for a 2×4 tile or 4 sq ft for a 2×2. A 12×16 ft room is 192 sq ft, or 24 of the 2×4 tiles. Add a few extra for cuts at the walls." },
  { q: "How much wall angle do I need?", a: "Wall angle (the L-shaped molding) runs the full perimeter of the room — 2 × (length + width). It comes in 10 or 12-foot lengths." },
  { q: "What grid pieces does a drop ceiling need?", a: "A suspended grid uses main tees (usually 12 ft, run every 4 ft), 4-ft cross tees, and 2-ft cross tees for a 2×2 layout, all hung from wire about every 4 feet." },
  { q: "What size tile should I use?", a: "2×4 tiles cover faster with fewer pieces and suit larger commercial rooms; 2×2 tiles look more finished and are common in offices and homes. Both use the same grid system." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function DropCeilingCalculatorPage() {
  return (
    <ToolShell breadcrumb="Drop Ceiling Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Drop Ceiling Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter room size and tile size to get ceiling tiles, wall angle, and a main-tee estimate for a suspended ceiling.</p>
      <div className="mt-8"><DropCeilingCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate a drop ceiling</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Divide the ceiling area by the tile size for tile count, run wall angle around the perimeter, and lay out main tees every 4 ft with cross tees filling the grid. Add hanger wire and a few spare tiles.</p></section>
      <ToolCTA headline="Capture ceiling dimensions from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Drop ceiling FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
