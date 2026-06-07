import Link from "next/link";

const POPULAR: [string, string][] = [
  ["Square Footage", "/tools/square-footage-calculator"],
  ["Flooring", "/tools/flooring-calculator"],
  ["Paint", "/tools/paint-calculator"],
  ["Concrete", "/tools/concrete-calculator"],
  ["Tile", "/tools/tile-calculator"],
  ["Roofing", "/tools/roofing-calculator"],
  ["Grout", "/tools/grout-calculator"],
  ["Sand", "/tools/sand-calculator"],
  ["Spray Foam", "/tools/spray-foam-calculator"],
  ["Caulk", "/tools/caulk-calculator"],
  ["Carpet Stairs", "/tools/carpet-stairs-calculator"],
  ["Joist Spacing", "/tools/joist-calculator"],
  ["Rough Opening", "/tools/rough-opening-calculator"],
  ["Pool Volume", "/tools/pool-volume-calculator"],
];

export default function RelatedStrip() {
  return (
    <section className="mt-14 border-t border-neutral-200 dark:border-neutral-800 pt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        More free calculators
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR.map(([name, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm text-neutral-700 hover:border-blue-400 hover:text-blue-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-blue-400"
          >
            {name}
          </Link>
        ))}
        <Link
          href="/tools"
          className="rounded-full bg-neutral-900 px-3 py-1 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          All calculators
        </Link>
      </div>
      <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
        See also:{" "}
        <Link href="/blog" className="text-blue-600 hover:underline dark:text-blue-400">estimating guides</Link>
        {" · "}
        <Link href="/for" className="text-blue-600 hover:underline dark:text-blue-400">ProBuildCalc by trade</Link>
      </p>
    </section>
  );
}
