import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import PaintCalculator from "./PaintCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/paint-calculator";
const TITLE = "Paint Calculator: How Many Gallons Do I Need? (Free)";
const DESCRIPTION =
  "Free paint calculator. Enter your room size, coats, and door/window count to get the paintable square footage and exactly how many gallons of paint to buy.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: [
    "paint calculator",
    "how much paint do I need",
    "how many gallons of paint",
    "paint coverage calculator",
    "wall paint calculator",
  ],
  openGraph: {
    type: "website", siteName: "ProBuildCalc",
    title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much area does a gallon of paint cover?", a: "A gallon covers roughly 350–400 square feet in one coat on a smooth, primed surface. Textured, porous, or unprimed walls absorb more, so they cover less per gallon." },
  { q: "How many coats of paint do I need?", a: "Plan on 2 coats for most jobs — it's the default here. Use 3 when going from a dark color to a light one or painting over bare drywall; 1 coat is only enough for a light refresh of the same color." },
  { q: "Do I subtract doors and windows?", a: "Yes. Each standard door is about 21 sq ft and each window about 15 sq ft of surface you don't paint. Enter the counts above and they're deducted automatically." },
  { q: "How do I calculate wall area for paint?", a: "Add the length of all walls (the room perimeter) and multiply by the ceiling height: 2 × (length + width) × height. The calculator does this from your room dimensions." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function PaintCalculatorPage() {
  return (
    <ToolShell breadcrumb="Paint Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Paint Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your room size, coats, and how many doors and windows to skip — get
        the paintable square footage and how many gallons to buy.
      </p>

      <div className="mt-8"><PaintCalculator /></div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How much paint do I need?</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Find the wall area — <code>2 × (length + width) × height</code> — subtract
          about 21 sq ft per door and 15 sq ft per window, multiply by the number
          of coats, then divide by the coverage on the can (usually 350–400 sq ft
          per gallon). Round up to the next whole gallon.
        </p>
      </section>

      <ToolCTA headline="Quote a paint job on-site in minutes" />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Paint calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt>
              <dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </ToolShell>
  );
}
