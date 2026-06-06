import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import FlooringCalculator from "./FlooringCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/flooring-calculator";
const TITLE = "Flooring Calculator: Square Footage & Boxes Needed (Free)";
const DESCRIPTION =
  "Free flooring calculator — enter your room dimensions to get total square footage, a waste allowance, and exactly how many boxes of flooring to buy. Works for laminate, vinyl plank, hardwood, and tile.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: [
    "flooring calculator",
    "square footage calculator",
    "how many boxes of flooring",
    "flooring waste calculator",
    "laminate flooring calculator",
    "vinyl plank calculator",
  ],
  openGraph: {
    type: "website",
    siteName: "ProBuildCalc",
    title: `${TITLE} | ProBuildCalc`,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  {
    q: "How do I calculate the square footage of a room?",
    a: "Multiply the room's length by its width in feet. For an L-shaped or multi-room job, split it into rectangles, calculate each, and add them together — the calculator above does this when you add more rooms.",
  },
  {
    q: "How much extra flooring should I buy for waste?",
    a: "Add 10% for a standard straight-lay in mostly square rooms. Bump it to 15% for diagonal layouts or rooms with lots of cuts, and up to 20% for herringbone or chevron patterns. The waste covers cuts, mistakes, and offcuts you'll keep for future repairs.",
  },
  {
    q: "How many boxes of flooring do I need?",
    a: "Take your total square footage, add the waste percentage, then divide by the coverage printed on the flooring box (often 18–24 sq ft). Always round up to the next whole box — you can't buy a partial box.",
  },
  {
    q: "Should all my flooring come from the same dye lot?",
    a: "Yes. Color and grain can vary between production runs, so buy all your boxes at once from the same lot number and mix planks from several boxes as you install for a natural look.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FlooringCalculatorPage() {
  return (
    <ToolShell breadcrumb="Flooring Calculator">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Free Flooring Material Calculator
      </h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your room dimensions to get the total square footage, a waste
        allowance, and exactly how many boxes of flooring to buy. Works for
        laminate, vinyl plank, engineered hardwood, and tile.
      </p>

      <div className="mt-8">
        <FlooringCalculator />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate flooring materials</h2>
        <ol className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300 list-decimal pl-5">
          <li><strong>Measure each room</strong> in feet (length × width) and add the areas together.</li>
          <li><strong>Add a waste factor</strong> — 10% for straight lays, more for diagonal or herringbone.</li>
          <li><strong>Divide by the box coverage</strong> printed on the product (commonly 18–24 sq ft per box).</li>
          <li><strong>Round up</strong> to the next whole box, and buy from a single dye lot.</li>
        </ol>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          The formula is: <code>boxes = ceil( total_sq_ft × (1 + waste%) ÷ coverage_per_box )</code>.
        </p>
      </section>

      <ToolCTA headline="Stop measuring floors by hand" />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Flooring calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt>
              <dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-10 text-sm text-neutral-500 dark:text-neutral-400">
        More tools: <Link href="/tools/square-footage-calculator" className="text-blue-600 hover:underline dark:text-blue-400">square footage</Link>,{" "}
        <Link href="/tools/paint-calculator" className="text-blue-600 hover:underline dark:text-blue-400">paint</Link>,{" "}
        <Link href="/tools/drywall-calculator" className="text-blue-600 hover:underline dark:text-blue-400">drywall</Link>,{" "}
        <Link href="/tools/concrete-calculator" className="text-blue-600 hover:underline dark:text-blue-400">concrete</Link>.
      </p>
    </ToolShell>
  );
}
