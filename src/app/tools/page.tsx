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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "ProBuildCalc" }],
  },
  twitter: { card: "summary", title: `${TITLE} | ProBuildCalc`, description: DESCRIPTION },
};

const TOOLS = [
  { href: "/tools/square-footage-calculator", name: "Square Footage Calculator", desc: "Length × width to total square feet, yards, meters, and acres." },
  { href: "/tools/flooring-calculator", name: "Flooring Calculator", desc: "Square footage and how many boxes of flooring, with a waste factor." },
  { href: "/tools/paint-calculator", name: "Paint Calculator", desc: "Gallons of paint for a room — doors and windows deducted." },
  { href: "/tools/drywall-calculator", name: "Drywall Calculator", desc: "Sheets of drywall plus screw, compound, and tape estimates." },
  { href: "/tools/concrete-calculator", name: "Concrete Calculator", desc: "Cubic yards of ready-mix or bags for a slab." },
  { href: "/tools/tile-calculator", name: "Tile Calculator", desc: "Tiles and boxes for a floor or wall, with waste." },
  { href: "/tools/roofing-calculator", name: "Roofing Calculator", desc: "Roof area, squares, and shingle bundles by pitch." },
  { href: "/tools/deck-calculator", name: "Deck Board Calculator", desc: "Deck boards and total linear feet for your deck." },
  { href: "/tools/baseboard-calculator", name: "Baseboard & Trim Calculator", desc: "Linear feet and pieces of baseboard, crown, or trim." },
  { href: "/tools/fence-calculator", name: "Fence Calculator", desc: "Posts, rails, and pickets for a fence run." },
  { href: "/tools/mulch-calculator", name: "Mulch & Soil Calculator", desc: "Cubic yards and bags of mulch, topsoil, or gravel." },
  { href: "/tools/carpet-calculator", name: "Carpet Calculator", desc: "Square feet and square yards of carpet for a room." },
  { href: "/tools/insulation-calculator", name: "Insulation Calculator", desc: "Bags or batts of insulation for walls and attics." },
  { href: "/tools/gravel-calculator", name: "Gravel Calculator", desc: "Cubic yards and tons of gravel or crushed stone." },
  { href: "/tools/stud-calculator", name: "Stud & Framing Calculator", desc: "Studs and plate material for a stud wall." },
  { href: "/tools/plywood-calculator", name: "Plywood & Sheathing Calculator", desc: "Sheets of plywood, OSB, or subfloor." },
  { href: "/tools/sod-calculator", name: "Sod Calculator", desc: "Square feet, yards, and pallets of sod." },
  { href: "/tools/wallpaper-calculator", name: "Wallpaper Calculator", desc: "Rolls of wallpaper for a room, with pattern waste." },
  { href: "/tools/brick-calculator", name: "Brick & Block Calculator", desc: "Bricks or blocks plus mortar for a wall." },
  { href: "/tools/rebar-calculator", name: "Rebar Calculator", desc: "Grid rebar length and bar count for a slab." },
  { href: "/tools/stair-calculator", name: "Stair Calculator", desc: "Steps, riser height, and run from total rise." },
  { href: "/tools/paver-calculator", name: "Paver Calculator", desc: "Pavers, base, and sand for a patio." },
  { href: "/tools/asphalt-calculator", name: "Asphalt Calculator", desc: "Tons of asphalt for a driveway or lot." },
  { href: "/tools/retaining-wall-calculator", name: "Retaining Wall Calculator", desc: "Blocks, caps, and base for a retaining wall." },
  { href: "/tools/siding-calculator", name: "Siding Calculator", desc: "Squares of siding for a house, openings deducted." },
  { href: "/tools/gutter-calculator", name: "Gutter Calculator", desc: "Linear feet of gutter, downspouts, and hangers." },
  { href: "/tools/board-foot-calculator", name: "Board Foot Calculator", desc: "Board feet and cost for lumber." },
  { href: "/tools/grass-seed-calculator", name: "Grass Seed Calculator", desc: "Pounds of seed for a new or overseeded lawn." },
  { href: "/tools/drop-ceiling-calculator", name: "Drop Ceiling Calculator", desc: "Tiles and grid for a suspended ceiling." },
  { href: "/tools/cubic-yards-calculator", name: "Cubic Yards Calculator", desc: "Volume in cubic yards for any bulk material." },
  { href: "/tools/grout-calculator", name: "Grout Calculator", desc: "Pounds of grout for tile — floor, wall, or backsplash." },
  { href: "/tools/sand-calculator", name: "Sand Calculator", desc: "Tons and cubic yards of sand for a patio, pool, or base." },
  { href: "/tools/spray-foam-calculator", name: "Spray Foam Calculator", desc: "Board-feet of spray foam insulation for walls or attics." },
  { href: "/tools/caulk-calculator", name: "Caulk Calculator", desc: "Tubes of caulk for a joint length, with waste factor." },
  { href: "/tools/carpet-stairs-calculator", name: "Carpet Stairs Calculator", desc: "Carpet yardage for a staircase — treads, risers, and nosing." },
  { href: "/tools/joist-calculator", name: "Floor Joist Calculator", desc: "Joist count and spacing for a deck or floor framing." },
  { href: "/tools/rough-opening-calculator", name: "Rough Opening Calculator", desc: "Rough opening size for doors and windows." },
  { href: "/tools/pool-volume-calculator", name: "Pool Volume Calculator", desc: "Gallons and liters for rectangular, oval, or round pools." },
  { href: "/tools/window-calculator", name: "Window Calculator", desc: "Window count, glass area, and rough opening size for a wall." },
  { href: "/tools/mortar-calculator", name: "Mortar Calculator", desc: "Bags of mortar for brick or CMU block walls." },
  { href: "/tools/pex-pipe-calculator", name: "PEX Pipe Calculator", desc: "Total PEX footage for radiant floor heating or plumbing." },
  { href: "/tools/framing-cost-calculator", name: "Framing Cost Calculator", desc: "Stud count, linear feet, and lumber cost estimate for a wall." },
  { href: "/tools/driveway-cost-calculator", name: "Driveway Cost Calculator", desc: "Concrete vs asphalt driveway cost estimate by square footage." },
  { href: "/tools/bathroom-tile-calculator", name: "Bathroom Tile Calculator", desc: "Floor and wall tile boxes plus grout for a bathroom remodel." },
  { href: "/tools/wood-fence-cost-calculator", name: "Wood Fence Cost Calculator", desc: "Posts, rails, pickets, and cost estimate for a wood fence." },
  { href: "/tools/shed-calculator", name: "Shed Calculator", desc: "Studs, plywood, roofing squares, and siding for a shed build." },
];

export default function ToolsIndexPage() {
  return (
    <ToolShell hideRelated>
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
