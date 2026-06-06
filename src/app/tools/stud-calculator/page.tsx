import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import StudCalculator from "./StudCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/stud-calculator";
const TITLE = "Stud & Framing Calculator: How Many Studs? (Free)";
const DESCRIPTION =
  "Free wall framing calculator. Enter wall length and stud spacing to get how many studs and how much plate material you need for a stud wall.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["stud calculator", "framing calculator", "how many studs do I need", "wall framing calculator", "studs on center calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many studs do I need?", a: "Divide the wall length in inches by the spacing (16 or 24), add one for the end stud, then add ~15% for corners, openings, and blocking. A 20-ft wall at 16-in centers needs about 18 studs." },
  { q: "What's the difference between 16 and 24 inch on center?", a: "16-inch on center is the standard for load-bearing and most interior walls; 24-inch uses fewer studs and is allowed for some non-load-bearing and advanced-framing walls. Check your local code." },
  { q: "How much plate material do I need?", a: "Most walls use 3 plates — one bottom and a double top — so plate lumber equals the wall length times 3. Multiply by 2 if you're using a single top plate." },
  { q: "Do I need extra studs for corners and openings?", a: "Yes — corners, T-intersections, window and door openings (king studs, jacks, cripples) all add studs. This calculator adds about 15% to cover them." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function StudCalculatorPage() {
  return (
    <ToolShell breadcrumb="Stud Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Stud &amp; Framing Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter the wall length and stud spacing to get how many studs and how much
        plate material to buy.
      </p>
      <div className="mt-8"><StudCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to count studs</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Studs equal the wall length in inches divided by the on-center spacing,
          plus one, plus extras for corners and openings. Plates run the wall
          length once per plate (usually three: one bottom, two top).
        </p>
      </section>
      <ToolCTA headline="Frame the takeoff straight from a scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Framing calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
