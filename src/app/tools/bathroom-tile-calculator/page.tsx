import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import BathroomTileCalculator from "./BathroomTileCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/bathroom-tile-calculator";
const TITLE = "Bathroom Tile Calculator: Floor & Wall Tile + Grout (Free)";
const DESCRIPTION = "Free bathroom tile calculator. Enter bathroom dimensions to get floor and wall tile square footage, box count, and grout needed — with waste factor included.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["bathroom tile calculator", "bathroom floor tile calculator", "how much tile for a bathroom", "shower tile calculator", "bathroom remodel tile estimate"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How do I calculate how much tile I need for a bathroom?", a: "Measure the floor area (length × width) and each wall area to be tiled (width × tile height). Add them together for total square footage. Add 10% waste for straight layouts, 15% for diagonal, and 20% for small or intricate patterns. Divide by the coverage per box to get box count." },
  { q: "How much tile do I need for a standard shower?", a: "A typical 36×36-inch shower stall has about 60 to 80 square feet of tileable wall surface (three walls, floor-to-ceiling). A 60×36 shower adds another 20 square feet. Always measure your actual opening dimensions rather than relying on standard sizes, and add 10 to 15% waste." },
  { q: "Do I need special tile for bathroom floors vs walls?", a: "Floor tile must be rated for floor use with a slip-resistance coefficient of at least 0.60 (wet). Many wall tiles are too slippery for floors and may be too thin for foot traffic. Look for the PEI rating: PEI 2–3 for residential bathroom floors, PEI 4–5 for heavy traffic. Wall tile can be any PEI rating." },
  { q: "How much grout do I need for bathroom tile?", a: "Grout quantity depends on tile size and joint width. A 12×12 tile with 3/16-inch joints uses roughly 0.18 lb of grout per square foot. A 4×4 tile with the same joint uses more (about 0.5 lb/sq ft) because smaller tiles have more total joint length. Use a grout calculator for the exact amount." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function BathroomTileCalculatorPage() {
  return (
    <ToolShell breadcrumb="Bathroom Tile Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Bathroom Tile Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter bathroom dimensions to get floor area, wall tile area, total boxes, and grout needed — with waste factor built in.</p>
      <div className="mt-8"><BathroomTileCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate bathroom tile</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Measure floor (L × W) and each wall to be tiled (W × tile height). Total square footage ÷ coverage per box = box count — round up. Add 10% waste for straight layouts, 15% for diagonal. Grout: at 12×12 with 3/16-in joints, figure ~0.18 lb per sq ft. Get grout in matching color from one batch to avoid lot differences.</p>
      </section>
      <ToolCTA headline="Scan the bathroom for exact wall and floor area" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Bathroom tile calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
