import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import SquareFootageCalculator from "./SquareFootageCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/square-footage-calculator";
const TITLE = "Square Footage Calculator (Free) — Length × Width";
const DESCRIPTION =
  "Free square footage calculator. Enter length and width to get the area in square feet, square yards, square meters, and acres. Add multiple rooms or split an L-shaped room into rectangles.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: [
    "square footage calculator",
    "sq ft calculator",
    "how to calculate square footage",
    "area calculator",
    "room area calculator",
  ],
  openGraph: {
    type: "website", siteName: "ProBuildCalc",
    title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate square footage?", a: "Measure the length and width of the area in feet and multiply them: length × width = square feet. A room that's 12 ft by 10 ft is 120 square feet." },
  { q: "How do I find the square footage of an L-shaped or irregular room?", a: "Break the space into rectangles, calculate the square footage of each, and add them together. Use the “Add an area” button above to total several rectangles at once." },
  { q: "How many square feet are in a square yard?", a: "There are 9 square feet in 1 square yard, so divide your square footage by 9 to get square yards — useful for carpet and some flooring sold by the yard." },
  { q: "How do I convert square feet to acres?", a: "One acre is 43,560 square feet, so divide your total square footage by 43,560. The calculator shows acres automatically." },
];

const faqJsonLd = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function SquareFootagePage() {
  return (
    <ToolShell breadcrumb="Square Footage Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Square Footage Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter a length and width to get the area in square feet — plus square
        yards, square meters, and acres. Add multiple rooms or rectangles to
        total a whole job.
      </p>

      <div className="mt-8"><SquareFootageCalculator /></div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate square footage</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Square footage is simply <strong>length × width</strong> measured in feet.
          For rooms that aren&apos;t a perfect rectangle, divide the floor into
          rectangles, find each one&apos;s area, and add them up. For circles use
          π × radius², and for triangles use ½ × base × height.
        </p>
      </section>

      <ToolCTA headline="Measure a whole house in minutes, not hours" />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Square footage FAQ</h2>
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
