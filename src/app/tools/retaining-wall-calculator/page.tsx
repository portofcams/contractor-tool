import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import RetainingWallCalculator from "./RetainingWallCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/retaining-wall-calculator";
const TITLE = "Retaining Wall Calculator: Blocks & Base (Free)";
const DESCRIPTION = "Free retaining wall calculator. Enter wall length, height, and block size to get the number of wall blocks, cap blocks, courses, and gravel base.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["retaining wall calculator", "retaining wall block calculator", "how many blocks for a retaining wall", "block wall calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many blocks do I need for a retaining wall?", a: "Find blocks per row by dividing the wall length in inches by the block width, and the number of courses by dividing the wall height by the block height. Multiply the two and add ~5% for waste and cuts." },
  { q: "How deep should the base of a retaining wall be?", a: "Bury the first course about 10% of the wall height (at least one full block or ~6 inches) and set it on 4 to 6 inches of compacted gravel base in a level trench." },
  { q: "When does a retaining wall need engineering?", a: "Walls taller than about 3 to 4 feet, or any wall holding back a slope or surcharge, typically require an engineered design, geogrid reinforcement, and a permit. Check local code before building." },
  { q: "What goes behind a retaining wall?", a: "Drainage gravel and a perforated drain pipe behind the blocks let water escape so hydrostatic pressure doesn't push the wall over. This drainage stone is separate from the leveling base." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function RetainingWallCalculatorPage() {
  return (
    <ToolShell breadcrumb="Retaining Wall Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Retaining Wall Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the wall length, height, and block size to get wall blocks, cap blocks, courses, and gravel base.</p>
      <div className="mt-8"><RetainingWallCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate a retaining wall</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Blocks per row = wall length ÷ block width; courses = wall height ÷ block height. Multiply for the block count, add ~5% waste, and add cap blocks for the top course plus a compacted gravel base and drainage stone behind the wall.</p></section>
      <ToolCTA headline="Scope hardscape and grading from a scan" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Retaining wall FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
