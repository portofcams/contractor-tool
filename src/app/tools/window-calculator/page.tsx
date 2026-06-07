import type { Metadata } from "next";
import ToolShell from "../_components/ToolShell";
import ToolCTA from "../_components/ToolCTA";
import WindowCalculator from "./WindowCalculator";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools/window-calculator";
const TITLE = "Window Calculator: Count, Area & Rough Opening Size (Free)";
const DESCRIPTION = "Free window calculator. Count how many windows fit a wall, get total glass area, and look up rough opening dimensions for standard window sizes.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, alternates: { canonical: PATH },
  keywords: ["window calculator", "rough opening calculator", "how many windows in a wall", "window area calculator", "window rough opening size"],
  openGraph: { type: "website", siteName: "ProBuildCalc", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }] },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const FAQ = [
  { q: "What is the rough opening for a window?", a: "Rough opening (RO) is the framed hole in the wall — typically 2 inches wider and 2 inches taller than the actual window unit. A 36×48 window needs a 38×50 rough opening. Always check the manufacturer's spec sheet, as it varies by brand and window type." },
  { q: "How much space should be between windows?", a: "Structurally, leave at least one stud-bay width (16 inches) between window rough openings to maintain wall strength. From a design standpoint, 12 to 18 inches of wall between windows is common. Very large windows may require engineered headers spanning the combined opening." },
  { q: "How do I calculate the total glass area of a wall?", a: "Multiply each window's width by its height to get the glass area per unit, then add them all together. This matters for load calculations, heat gain/loss estimates, and permit drawings. Remember the glass area is smaller than the rough opening — most window units lose 2 to 3 inches per side to the frame." },
  { q: "How many windows can fit in a standard wall?", a: "A standard 8-ft wall typically fits 2 to 3 double-hung windows side by side at comfortable spacing. The limit depends on the wall length, header size, and structural load above. Code usually requires at least 10% of floor area in natural light for habitable rooms." },
];

const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default function WindowCalculatorPage() {
  return (
    <ToolShell breadcrumb="Window Calculator">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Window Calculator</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">Enter your wall dimensions and window size to get window count, total glass area, and rough opening dimensions.</p>
      <div className="mt-8"><WindowCalculator /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Rough opening vs window size</h2>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">The rough opening (RO) is the framed hole — add 2 inches to both width and height of the window unit. A 36×48 window needs a 38×50 RO. The header spans the full RO width; size it by load (a 4-ft span typically uses a double 2×8, 6-ft needs a double 2×10). Always verify with the window manufacturer's installation guide.</p>
      </section>
      <ToolCTA headline="Scan the wall, get the opening size automatically" />
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Window calculator FAQ</h2>
        <dl className="mt-4 divide-y divide-neutral-200 dark:divide-neutral-800">
          {FAQ.map(f => (<div key={f.q} className="py-4"><dt className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</dt><dd className="mt-1 text-neutral-700 dark:text-neutral-300">{f.a}</dd></div>))}
        </dl>
      </section>
    </ToolShell>
  );
}
