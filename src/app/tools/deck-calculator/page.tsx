import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import DeckCalculator from "./DeckCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/deck-calculator";
const TITLE = "Deck Boards Calculator: How Many Boards? (Free)";
const DESCRIPTION =
  "Free deck board calculator. Enter your deck size and board dimensions to get how many deck boards and total linear feet you need, including waste.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["deck calculator", "deck board calculator", "how many deck boards", "decking calculator"],
  openGraph: {
    type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`, images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many deck boards do I need?", a: "Divide your deck's square footage (plus ~10% waste) by the coverage of one board — its width plus the gap, times its length. A 5.5-inch board with a 1/8-inch gap covers about 0.47 ft per foot of length." },
  { q: "How much gap should I leave between deck boards?", a: "Leave about 1/8 inch for pressure-treated lumber that's still wet (it shrinks as it dries) and 1/8–1/4 inch for dry or composite boards for drainage." },
  { q: "How much waste should I add for decking?", a: "Add about 10% for straight, parallel boards and 15% for diagonal or picture-frame layouts that need more cuts." },
  { q: "How many screws for a deck?", a: "Plan on roughly 350 deck screws per 100 square feet — two per board at each joist crossing." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function DeckCalculatorPage() {
  return (
    <ToolShell breadcrumb="Deck Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Deck Board Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your deck size and board dimensions to get how many deck boards and
        total linear feet to buy, with waste built in.
      </p>
      <div className="mt-8"><DeckCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to estimate decking</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Each board covers its <code>(width + gap) × length</code> in area. Divide the
          deck area (plus waste) by that coverage for the board count. Joists,
          beams, posts, and fasteners are estimated separately.
        </p>
      </section>
      <ToolCTA headline="Take off the whole deck build in minutes" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Deck calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
