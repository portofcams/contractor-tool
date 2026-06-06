import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import TileCalculator from "./TileCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/tile-calculator";
const TITLE = "Tile Calculator: How Many Tiles Do I Need? (Free)";
const DESCRIPTION =
  "Free tile calculator. Enter your area and tile size to get the number of tiles (and boxes) you need for a floor or wall, including a waste allowance.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["tile calculator", "how many tiles do I need", "floor tile calculator", "tile square footage calculator"],
  openGraph: {
    type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`, images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How many tiles do I need?", a: "Divide the area you're tiling (plus 10% for waste) by the square footage of one tile. A 12×12 in tile is 1 sq ft, so a 120 sq ft floor at 10% waste needs about 132 tiles." },
  { q: "How much extra tile should I buy for waste?", a: "Add 10% for a standard straight layout, 15% for diagonal, and up to 20% for herringbone or patterned installs. Cuts at walls and around fixtures add up fast." },
  { q: "How do I find the square footage of one tile?", a: "Multiply the tile's width by its height in inches, then divide by 144. A 12×24 in tile is 288 ÷ 144 = 2 sq ft." },
  { q: "Should I buy tile by the box?", a: "Yes — tile is sold by the box, so round your tile count up to whole boxes from the same dye lot, and keep a few spares for repairs." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function TileCalculatorPage() {
  return (
    <ToolShell breadcrumb="Tile Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tile Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Enter your area and tile size to get how many tiles — and boxes — to buy
        for a floor or wall, with a waste allowance built in.
      </p>
      <div className="mt-8"><TileCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate tile</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">
          Find your area in square feet (<code>length × width</code>), add 10–20%
          for waste depending on the layout, and divide by the square footage of a
          single tile (<code>tile width × height ÷ 144</code>). Round up to whole
          boxes.
        </p>
      </section>
      <ToolCTA headline="Tile, floor, and wall takeoffs from one scan" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Tile calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map((f) => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
