import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import RebarCalculator from "./RebarCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/rebar-calculator";
const TITLE = "Rebar Calculator: Grid Length & Bars (Free)";
const DESCRIPTION = "Free rebar calculator. Enter slab size and grid spacing to get the total linear feet of rebar and how many standard bars you need for a two-way grid.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["rebar calculator", "rebar grid calculator", "how much rebar do I need", "slab rebar calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate rebar for a slab?", a: "For a two-way grid, count bars in each direction: divide the slab width in inches by the spacing and add one for the bars running lengthwise, and do the same the other way. Multiply each count by the run length and add the two totals for linear feet." },
  { q: "What spacing should rebar be?", a: "Residential slabs commonly use #3 or #4 bar at 12 to 18 inches on center, but always follow the engineered drawings or local code for your specific slab and loads." },
  { q: "How long are standard rebar lengths?", a: "Rebar is commonly stocked in 20-foot lengths, with 10-foot also available. Divide your total linear feet by the stock length and round up." },
  { q: "Do I need extra rebar for laps?", a: "Yes. Where bars overlap (lap splices), you lose length, typically 40 bar diameters. Add about 10–15% to your linear footage on larger pours to cover laps and waste." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function RebarCalculatorPage() {
  return (
    <ToolShell breadcrumb="Rebar Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Rebar Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the slab size and grid spacing to get the total linear feet of rebar and the number of standard bars for a two-way grid.</p>
      <div className="mt-8"><RebarCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate rebar</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Count the bars in each direction from the spacing, multiply by the run length, and sum. Divide by the bar stock length for piece count, and add 10–15% for lap splices and waste. Always defer to engineered drawings.</p></section>
      <ToolCTA headline="Lay out slabs and footings from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Rebar calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
