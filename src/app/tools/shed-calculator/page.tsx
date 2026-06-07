import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import ShedCalculator from "./ShedCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/shed-calculator";
const TITLE = "Shed Calculator: Lumber, Roofing & Siding Materials (Free)";
const DESCRIPTION = "Free shed material calculator. Enter shed dimensions to get stud count, sheets of plywood, roofing squares, and siding panels needed to build a shed.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["shed calculator", "shed material calculator", "how much lumber to build a shed", "shed building materials list", "shed cost estimate"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much lumber do I need to build a 12x16 shed?", a: "A 12×16 shed typically needs around 40 to 50 studs (16-inch OC), 8 to 10 sheets of 3/4-inch plywood for the floor, 12 to 16 sheets of 1/2-inch OSB or plywood for walls and roof sheathing, and about 4 roofing squares of shingles. Exact quantities depend on wall height, roof pitch, and any windows or doors." },
  { q: "What size shed can I build without a permit?", a: "Most jurisdictions allow sheds under 120 to 200 square feet without a building permit, but rules vary widely by city and county. Some areas also restrict shed height and setback from property lines regardless of size. Always check local zoning rules before building — fines for unpermitted structures can be significant." },
  { q: "What is the best foundation for a shed?", a: "For most backyard sheds, pressure-treated skid runners (4×4 or 4×6 on gravel) are the easiest and most common foundation. They allow the shed to be moved and don't require a concrete pour. For larger sheds (over 200 sq ft) or permanent structures, a concrete slab or concrete piers provide more stability." },
  { q: "How many sheets of plywood do I need for shed walls?", a: "One 4×8 sheet covers 32 square feet. Calculate each wall's area (height × width), subtract door and window openings, add all walls together, then divide by 32. Add 10% waste. A 10×12 shed with 8-foot walls has about 352 sq ft of wall area (4 sides minus door) — roughly 12 sheets with waste." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function ShedCalculatorPage() {
  return (
    <ToolShell breadcrumb="Shed Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shed Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter shed length, width, and wall height to get a complete material list — studs, floor plywood, wall sheathing, roofing, and siding.</p>
      <div className="mt-8"><ShedCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate shed materials</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Floor: area ÷ 32 (sheets of 3/4-in plywood). Walls: perimeter × height ÷ 32 (OSB/plywood, minus openings). Roof: area × pitch factor ÷ 100 (squares of shingles). Studs: (perimeter ÷ 1.33) + corners. Add 10% waste on all sheet goods. Pre-cut stud packs are cheaper than random lengths for standard wall heights.</p>
      </section>
      <ToolCTA headline="Scan the shed footprint with LiDAR for exact dimensions" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Shed calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
