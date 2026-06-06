import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import CarpetCalculator from "./CarpetCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/carpet-calculator";
const TITLE = "Carpet Calculator: Square Feet & Yards (Free)";
const DESCRIPTION =
  "Free carpet calculator. Enter room dimensions to get the square footage and square yards of carpet you need, including a waste allowance for seams and cuts.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["carpet calculator", "how much carpet do I need", "carpet square yards calculator", "carpet square footage"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much carpet do I need?", a: "Multiply room length × width for square feet, then add about 10% for waste, seams, and pattern matching. Divide by 9 to convert to square yards if your carpet is priced that way." },
  { q: "How many square feet are in a square yard of carpet?", a: "There are 9 square feet in a square yard. A 180 sq ft room is 20 square yards." },
  { q: "How much waste should I add for carpet?", a: "Add 10% for a standard room and up to 15% for stairs, hallways, or rooms wider than the 12-ft roll where you'll have seams." },
  { q: "Do I need to buy carpet pad separately?", a: "Yes. Carpet pad (and tack strip) is bought separately and covers the same square footage as the carpet — add it to your estimate." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function CarpetCalculatorPage() {
  return (
    <ToolShell breadcrumb="Carpet Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Carpet Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your room size to get the square footage and square yards of carpet
        to order, with waste for seams and cuts.
      </p>
      <div className="mt-8"><CarpetCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to measure for carpet</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Measure length × width for square feet, add ~10% for waste, and divide
          by 9 for square yards. Remember carpet rolls are 12 ft wide, so rooms
          wider than that need seams — and a bit more material.
        </p>
      </section>
      <ToolCTA headline="Measure every floor in the house at once" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Carpet calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
