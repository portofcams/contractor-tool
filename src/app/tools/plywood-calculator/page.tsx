import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import PlywoodCalculator from "./PlywoodCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/plywood-calculator";
const TITLE = "Plywood & Sheathing Calculator: How Many Sheets? (Free)";
const DESCRIPTION =
  "Free plywood and sheathing calculator. Enter the area to get how many 4×8 or 4×10 sheets of plywood, OSB, or subfloor you need, including waste.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["plywood calculator", "how many sheets of plywood", "osb calculator", "sheathing calculator", "subfloor calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many sheets of plywood do I need?", a: "Divide the total area (plus ~10% waste) by the sheet size — 32 sq ft for a 4×8 sheet, 40 for a 4×10. A 400 sq ft floor at 10% waste needs about 14 sheets of 4×8." },
  { q: "What's the square footage of a sheet of plywood?", a: "A standard 4×8-ft sheet is 32 square feet. A 4×10-ft sheet is 40 square feet." },
  { q: "How much waste should I add for sheathing?", a: "Add about 10% for straightforward walls, floors, and roofs, and 15% for cut-up areas with lots of openings or angles." },
  { q: "Does this work for OSB and subfloor?", a: "Yes — plywood, OSB, subfloor, and wall or roof sheathing all come in the same 4×8 and 4×10 sheet sizes, so the count is the same." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function PlywoodCalculatorPage() {
  return (
    <ToolShell breadcrumb="Plywood Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Plywood &amp; Sheathing Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter the area to get how many sheets of plywood, OSB, subfloor, or
        sheathing you need, with waste built in.
      </p>
      <div className="mt-8"><PlywoodCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate sheet goods</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Total the area you&apos;re covering, add ~10% for waste, and divide by the
          sheet size (32 sq ft for 4×8). Stagger the seams and leave a small
          expansion gap between sheets.
        </p>
      </section>
      <ToolCTA headline="Sheet a whole floor or roof from a scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Plywood calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
