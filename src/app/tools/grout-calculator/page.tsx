import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import GroutCalculator from "./GroutCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/grout-calculator";
const TITLE = "Grout Calculator: How Much Grout Do I Need? (Free)";
const DESCRIPTION = "Free tile grout calculator. Enter tile size, joint width, and area to get the pounds of grout needed. Works for floor, wall, and backsplash tile.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["grout calculator", "how much grout do I need", "tile grout calculator", "grout coverage calculator", "sanded grout calculator"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "How much grout do I need per square foot?", a: "It depends on tile size and joint width. A 12×12 tile with a 1/8-inch joint uses roughly 0.15 lb of grout per sq ft. Smaller tiles have more joint area and use more grout per sq ft." },
  { q: "Do I use sanded or unsanded grout?", a: "Use sanded grout for joints 1/8 inch or wider — the sand prevents cracking in wider gaps. Use unsanded (non-sanded) grout for joints under 1/8 inch, like on polished stone or glass tile where sand would scratch the surface." },
  { q: "How much extra grout should I buy?", a: "Add about 10% to your calculated amount. Grout fills into the joints as you work and you'll waste some in mixing. Having a little left over is also useful for future repairs." },
  { q: "How long does premixed grout vs dry-mix grout last?", a: "Dry-mix grout has a long shelf life if kept dry. Premixed (already wet) grout lasts 1–2 years unopened. Once mixed or opened, it should be used within 30–60 minutes." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function GroutCalculatorPage() {
  return (
    <ToolShell breadcrumb="Grout Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tile Grout Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter the tile size, joint width, and area to get how many pounds of grout you need — works for floors, walls, and backsplashes.</p>
      <div className="mt-8"><GroutCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How to calculate grout</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">Grout quantity depends on tile size, joint width, tile thickness, and area. Smaller tiles have more linear feet of joint per square foot and use significantly more grout. The formula is <code>(tile width + tile height) ÷ (tile width × tile height) × joint width × tile depth × grout density</code>, then multiplied by area. Use sanded grout for joints 1/8&quot; or wider.</p>
      </section>
      <ToolCTA headline="Get tile area from a LiDAR scan in seconds" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Grout calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
