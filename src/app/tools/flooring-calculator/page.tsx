import type { Metadata } from "next";
import Link from "next/link";
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
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ProBuildCalc" }],
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
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-bold tracking-tight">
            ProBuildCalc
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try the app
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-4 text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Flooring Calculator</span>
        </nav>

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

        {/* SEO content */}
        <section className="prose-neutral mt-12 max-w-none">
          <h2 className="text-2xl font-semibold">How to calculate flooring materials</h2>
          <ol className="mt-4 space-y-2 text-neutral-700 dark:text-neutral-300 list-decimal pl-5">
            <li><strong>Measure each room</strong> in feet (length × width) and add the areas together.</li>
            <li><strong>Add a waste factor</strong> — 10% for straight lays, more for diagonal or herringbone.</li>
            <li><strong>Divide by the box coverage</strong> printed on the product (commonly 18–24 sq ft per box).</li>
            <li><strong>Round up</strong> to the next whole box, and buy from a single dye lot.</li>
          </ol>
          <p className="mt-4 text-neutral-700 dark:text-neutral-300">
            The formula is: <code>boxes = ceil( total_sq_ft × (1 + waste%) ÷ coverage_per_box )</code>.
            That&apos;s exactly what the calculator above runs.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/40">
          <h2 className="text-xl font-bold">Stop measuring rooms by hand</h2>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">
            ProBuildCalc turns your iPhone&apos;s LiDAR scanner into a job-site
            measuring kit — walk the room, and it captures the square footage,
            material takeoff, and a blueprint automatically. No tape measure, no
            graph paper.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Get started free
            </Link>
            <Link href="/landing" className="rounded-md border border-neutral-300 px-4 py-2 font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900">
              See how it works
            </Link>
          </div>
        </section>

        {/* FAQ */}
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
      </div>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href="/" className="hover:underline">ProBuildCalc</Link> — LiDAR room
        scans &amp; material takeoffs for contractors.
      </footer>
    </main>
  );
}
