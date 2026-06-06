export type Link = { href: string; label: string };
export type Role = {
  slug: string;
  trade: string; // e.g. "Flooring Contractors"
  title: string; // <title>/SEO
  description: string;
  dek: string;
  benefits: string[];
  tools: Link[];
  guides: Link[];
};

export const ROLES: Role[] = [
  {
    slug: "flooring-contractors",
    trade: "Flooring Contractors",
    title: "ProBuildCalc for Flooring Contractors — Scan, Measure, Quote",
    description: "Scan a room with LiDAR and get instant square footage, box counts, and a quote — the measuring and takeoff app built for flooring contractors.",
    dek: "Walk the room, scan it, and walk out with the square footage, box counts, and a quote ready to send. No graph paper, no second trip to re-measure.",
    benefits: [
      "Capture exact square footage of any room — including closets and alcoves — in one LiDAR pass.",
      "Turn the scan straight into a flooring takeoff with the right waste factor for the layout.",
      "Hand the client a clean quote and a blueprint before you leave the driveway.",
      "Keep every scan organized by project so re-orders and change-orders are painless.",
    ],
    tools: [
      { href: "/tools/flooring-calculator", label: "Flooring Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
      { href: "/tools/tile-calculator", label: "Tile Calculator" },
      { href: "/tools/carpet-calculator", label: "Carpet Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-estimate-flooring-materials", label: "How to Estimate Flooring Materials" },
      { href: "/blog/flooring-installation-cost-guide", label: "Flooring Installation Cost Guide" },
      { href: "/blog/how-to-estimate-carpet", label: "How to Estimate Carpet" },
    ],
  },
  {
    slug: "painters",
    trade: "Painters",
    title: "ProBuildCalc for Painters — Wall Area & Paint Quotes Fast",
    description: "Scan a room to get wall area, gallons of paint, and a quote in seconds. The takeoff app built for painting contractors.",
    dek: "Get accurate wall area and gallon counts from a quick scan, so you can quote a paint job on-site instead of guessing.",
    benefits: [
      "Capture wall area automatically — no measuring every wall by hand.",
      "Convert area to gallons by coats and coverage, with doors and windows deducted.",
      "Quote interior jobs on the spot and look more professional than the next bid.",
      "Save the scan and quote to the project for change orders and repaints.",
    ],
    tools: [
      { href: "/tools/paint-calculator", label: "Paint Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
      { href: "/tools/wallpaper-calculator", label: "Wallpaper Calculator" },
    ],
    guides: [
      { href: "/blog/how-much-paint-do-i-need", label: "How Much Paint Do I Need?" },
      { href: "/blog/how-many-coats-of-paint", label: "How Many Coats of Paint You Need" },
    ],
  },
  {
    slug: "remodelers",
    trade: "Remodelers",
    title: "ProBuildCalc for Remodelers — Whole-Room Takeoffs",
    description: "Scan a room and take off flooring, paint, drywall, and tile from one model. The all-in-one measuring app for remodeling contractors.",
    dek: "One scan, every trade. Pull flooring, paint, drywall, and tile quantities from the same room model and build a complete materials list.",
    benefits: [
      "Measure the whole room once and reuse it across every trade in the remodel.",
      "Generate a blueprint and a 3D model for client walkthroughs and approvals.",
      "Tighten your bids with real measurements instead of rough field guesses.",
      "Keep scans, photos, and quotes together per project from demo to punch list.",
    ],
    tools: [
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
      { href: "/tools/flooring-calculator", label: "Flooring Calculator" },
      { href: "/tools/paint-calculator", label: "Paint Calculator" },
      { href: "/tools/drywall-calculator", label: "Drywall Calculator" },
    ],
    guides: [
      { href: "/blog/material-takeoff-guide-for-contractors", label: "Material Takeoff Guide" },
      { href: "/blog/how-to-bid-a-construction-job", label: "How to Bid a Job" },
      { href: "/blog/lidar-vs-tape-measure-for-takeoffs", label: "LiDAR vs Tape Measure" },
    ],
  },
  {
    slug: "deck-builders",
    trade: "Deck Builders",
    title: "ProBuildCalc for Deck Builders — Boards, Footings & Quotes",
    description: "Measure a deck footprint, take off boards and concrete, and quote the build. The estimating app for deck and outdoor builders.",
    dek: "Capture the deck footprint and turn it into board counts, footing concrete, and a clean quote.",
    benefits: [
      "Measure the deck area fast and convert it to deck boards and linear feet.",
      "Add footing concrete and stair layout from the same project.",
      "Quote outdoor builds on-site with numbers you can stand behind.",
      "Store the design and materials list with the job for permits and change orders.",
    ],
    tools: [
      { href: "/tools/deck-calculator", label: "Deck Board Calculator" },
      { href: "/tools/concrete-calculator", label: "Concrete Calculator" },
      { href: "/tools/stair-calculator", label: "Stair Calculator" },
      { href: "/tools/fence-calculator", label: "Fence Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-estimate-a-deck-build", label: "How to Estimate a Deck" },
    ],
  },
  {
    slug: "concrete-contractors",
    trade: "Concrete Contractors",
    title: "ProBuildCalc for Concrete Contractors — Yards, Rebar & Base",
    description: "Measure slabs and footings, take off cubic yards, rebar, and base, and quote the pour. The estimating app for concrete contractors.",
    dek: "Measure the pour area, get cubic yards, rebar, and base material, and quote with confidence.",
    benefits: [
      "Capture slab dimensions and get ready-mix cubic yards with the right waste allowance.",
      "Lay out a rebar grid and base course from the same measurements.",
      "Quote flatwork on-site and avoid ordering short mid-pour.",
      "Keep every pour's numbers and photos attached to the project.",
    ],
    tools: [
      { href: "/tools/concrete-calculator", label: "Concrete Calculator" },
      { href: "/tools/rebar-calculator", label: "Rebar Calculator" },
      { href: "/tools/gravel-calculator", label: "Gravel Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-calculate-concrete-for-a-slab", label: "How to Calculate Concrete" },
      { href: "/blog/how-to-estimate-rebar", label: "How to Estimate Rebar" },
    ],
  },
];

export const getRole = (slug: string): Role | undefined => ROLES.find((r) => r.slug === slug);
