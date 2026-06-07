import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import FramingCostCalculator from "./FramingCostCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/framing-cost-calculator";
const TITLE = "Framing Cost Calculator: Lumber & Materials Estimate (Free)";
const DESCRIPTION = "Free framing cost calculator. Enter wall dimensions and stud spacing to get stud count, board feet of lumber, and estimated material cost.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["framing cost calculator", "lumber cost calculator", "wall framing material estimate", "stud cost calculator", "framing lumber calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I estimate the cost of framing a wall?", a: "Count the studs (one per 16 or 24 inches of wall length, plus one for each end), add top and bottom plates (2× the wall length), and any headers. Multiply the total linear feet by the lumber cost per foot. Add 10% waste. Labor for interior walls typically runs $1 to $3 per square foot of wall area." },
  { q: "How many studs do I need per linear foot of wall?", a: "At 16-inch on-center spacing, use 0.75 studs per foot (one stud every 1.33 feet). At 24-inch spacing, use 0.5 studs per foot. Add one stud for each end, corner, or door/window rough opening side. Round up to whole studs." },
  { q: "What size lumber is used for wall framing?", a: "Standard wall framing uses 2×4 studs for interior partitions and exterior walls in mild climates, or 2×6 for exterior walls in cold climates (deeper cavity for insulation). Top and bottom plates match the stud size. Headers over openings range from doubled 2×6 up to 2×12 depending on span and load." },
  { q: "How much does framing lumber cost?", a: "Lumber prices fluctuate significantly with the commodity market. As a rough benchmark, 2×4×8 studs have ranged from about $4 to $12 each in recent years. Get a current quote from your supplier and multiply by stud count. Engineered lumber (LVL headers, engineered joists) is priced separately and runs higher." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function FramingCostCalculatorPage() {
  return (
    <ToolShell breadcrumb="Framing Cost Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Framing Cost Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter wall length, height, and stud spacing to get stud count, total linear feet of lumber, and a cost estimate.</p>
      <div className="mt-8"><FramingCostCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate framing lumber</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Studs: <code>(wall length ÷ spacing) + 1</code> per wall, plus 2 end studs. Plates: 3× wall length (two bottom, one top for non-load-bearing; two top for bearing walls). Add 10% waste. Multiply total linear feet by your lumber unit cost for the estimate.</p>
      </section>
      <ToolCTA headline="Get wall dimensions from a LiDAR scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Framing cost calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
