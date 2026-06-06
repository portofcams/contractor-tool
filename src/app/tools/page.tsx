import type { Metadata } from "next";
import Link from "next/link";
import ToolShell from "./_components/ToolShell";
import ToolCTA from "./_components/ToolCTA";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://probuildcalc.com";
const PATH = "/tools";
const TITLE = "Free Contractor Calculators — Flooring, Paint, Drywall, Concrete";
const DESCRIPTION =
  "Free estimating calculators for contractors and DIYers: square footage, flooring boxes, paint gallons, drywall sheets, and concrete yards. No sign-up required.";

export const metadata: Metadata = {
  title: `${TITLE} | ProBuildCalc`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  keywords: ["contractor calculators", "construction calculators", "free estimating calculators"],
  openGraph: {
    type: "website", siteName: "ProBuildCalc",
    title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const TOOLS = [
  { href: "/tools/square-footage-calculator", name: "Square Footage Calculator", desc: "Length × width to total square feet, yards, meters, and acres." },
  { href: "/tools/flooring-calculator", name: "Flooring Calculator", desc: "Square footage and how many boxes of flooring, with a waste factor." },
  { href: "/tools/paint-calculator", name: "Paint Calculator", desc: "Gallons of paint for a room — doors and windows deducted." },
  { href: "/tools/drywall-calculator", name: "Drywall Calculator", desc: "Sheets of drywall plus screw, compound, and tape estimates." },
  { href: "/tools/concrete-calculator", name: "Concrete Calculator", desc: "Cubic yards of ready-mix or bags for a slab." },
];

export default function ToolsIndexPage() {
  return (
    <ToolShell>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free Contractor Calculators</h1>
      <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-300">
        Quick, no-sign-up estimating tools for the job site — square footage,
        flooring, paint, drywall, and concrete. Built by the team behind
        ProBuildCalc, the LiDAR scanning + takeoff app.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block rounded-xl border border-neutral-200 p-5 transition hover:border-blue-400 hover:shadow-sm dark:border-neutral-800 dark:hover:border-blue-700"
          >
            <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">{t.name}</h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t.desc}</p>
          </Link>
        ))}
      </div>

      <ToolCTA headline="Do the whole takeoff automatically" />
    </ToolShell>
  );
}
