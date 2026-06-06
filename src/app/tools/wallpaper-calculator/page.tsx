import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import WallpaperCalculator from "./WallpaperCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/wallpaper-calculator";
const TITLE = "Wallpaper Calculator: How Many Rolls? (Free)";
const DESCRIPTION = "Free wallpaper calculator. Enter room size, doors, and windows to get the wall area and how many rolls of wallpaper you need, including pattern-repeat waste.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["wallpaper calculator", "how many rolls of wallpaper", "wallpaper rolls calculator", "wallpaper coverage"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many rolls of wallpaper do I need?", a: "Find the wall area — 2 × (length + width) × height, minus doors and windows — then divide by the usable square footage per roll (about 25 sq ft after pattern matching) and add 10–20% for the repeat. Round up to whole rolls." },
  { q: "How much usable wallpaper is on a roll?", a: "A standard roll is about 56 square feet, but trimming and matching the pattern cuts usable coverage to roughly 25–30 sq ft. Always estimate with the usable figure, not the printed total." },
  { q: "How does pattern repeat affect waste?", a: "A larger pattern repeat means more is trimmed to line up seams. Use about 10% waste for a random or no-repeat pattern, 15% for a small repeat, and 20% for a large repeat." },
  { q: "Should I buy wallpaper from the same batch?", a: "Yes. Like paint and tile, wallpaper color can shift between print runs, so order all rolls — including a spare — from the same batch or lot number." },
];
const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function WallpaperCalculatorPage() {
  return (
    <ToolShell breadcrumb="Wallpaper Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Wallpaper Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the room size, doors, and windows to get the wall area and how many rolls of wallpaper to buy — with pattern-repeat waste built in.</p>
      <div className="mt-8"><WallpaperCalculator /></div>
      <section className="mt-12"><h2 className="text-2xl font-semibold">How to estimate wallpaper</h2><p className="mt-4 text-neutral-700 dark:text-neutral-300">Calculate wall area, subtract openings, divide by the <em>usable</em> coverage per roll (~25 sq ft), and add 10–20% depending on the pattern repeat. Round up and buy from one batch.</p></section>
      <ToolCTA headline="Measure every wall in the room at once" />
      <section className="mt-12"><h2 className="text-2xl font-semibold">Wallpaper calculator FAQ</h2><dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">{FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}</dl></section>
    </ToolShell>
  );
}
