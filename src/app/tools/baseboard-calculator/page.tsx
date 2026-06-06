import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import BaseboardCalculator from "./BaseboardCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/baseboard-calculator";
const TITLE = "Baseboard & Trim Calculator: Linear Feet (Free)";
const DESCRIPTION =
  "Free baseboard and trim calculator. Enter room dimensions to get the linear feet of trim and how many sticks to buy — for baseboard, crown, shoe, and chair rail.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["baseboard calculator", "trim calculator", "how much baseboard do I need", "linear feet calculator", "crown molding calculator"],
  openGraph: {
    type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`, images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate how much baseboard I need?", a: "Add up the room's perimeter — 2 × (length + width) — subtract the width of each doorway, and add about 10% for waste and miter cuts. Divide by your stock length for the number of pieces." },
  { q: "How much trim waste should I add?", a: "Add 10% for a normal room and 15% for rooms with lots of corners, jogs, or short walls where offcuts can't be reused." },
  { q: "Does this work for crown molding and chair rail?", a: "Yes. The linear-foot math is the same for baseboard, crown, shoe molding, and chair rail — crown just won't subtract doorways." },
  { q: "What length baseboard should I buy?", a: "Longer 16-ft sticks mean fewer seams on long walls; 8-ft pieces are easier to transport and handle. Pick the longest length your walls and vehicle allow." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function BaseboardCalculatorPage() {
  return (
    <ToolShell breadcrumb="Baseboard Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Baseboard &amp; Trim Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter the room size to get the linear feet of trim and how many sticks to
        buy — works for baseboard, crown, shoe, and chair rail.
      </p>
      <div className="mt-8"><BaseboardCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to measure for trim</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Total the wall lengths around the room (<code>2 × (length + width)</code>),
          subtract doorways, add ~10% for miters and mistakes, then divide by the
          stock length you&apos;re buying. Round up.
        </p>
      </section>
      <ToolCTA headline="Measure every room of the job at once" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Baseboard calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
