import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import BoardFootCalculator from "./BoardFootCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/board-foot-calculator";
const TITLE = "Board Foot Calculator: Lumber Quantity & Cost (Free)";
const DESCRIPTION = "Free board foot calculator. Enter lumber thickness, width, length, and quantity to get total board feet and an optional cost estimate.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["board foot calculator", "board feet calculator", "lumber calculator", "how to calculate board feet"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do you calculate board feet?", a: "Board feet equal thickness in inches × width in inches × length in feet, divided by 12. A 2×6 that's 8 feet long is (2 × 6 × 8) ÷ 12 = 8 board feet." },
  { q: "What is a board foot?", a: "A board foot is a volume of lumber equal to 144 cubic inches — a piece 1 inch thick, 12 inches wide, and 1 foot long. It's the standard unit for pricing hardwood." },
  { q: "Do I use nominal or actual dimensions?", a: "Lumber is sold by nominal size (a 2×4 is really 1.5 × 3.5 inches). For board-foot pricing, use the nominal thickness and width unless your supplier specifies surfaced (actual) dimensions." },
  { q: "How is lumber priced per board foot?", a: "Hardwood and rough lumber are usually quoted as a price per board foot. Multiply your total board feet by that price to estimate material cost." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function BoardFootCalculatorPage() {
  return (
    <ToolShell breadcrumb="Board Foot Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Board Foot Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter lumber dimensions and quantity to get total board feet — and an optional cost if you add a price per board foot.</p>
      <div className="mt-8"><BoardFootCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to calculate board feet</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">The formula is <code>(thickness × width × length-in-feet) ÷ 12</code>. Multiply by quantity for the total, and by your price per board foot for cost. It's the standard way hardwood is measured and sold.</p></section>
      <ToolCTA headline="Take off framing and trim from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Board foot FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
