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
      { href: "/tools/driveway-cost-calculator", label: "Driveway Cost Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-calculate-concrete-for-a-slab", label: "How to Calculate Concrete" },
      { href: "/blog/how-to-estimate-rebar", label: "How to Estimate Rebar" },
      { href: "/blog/asphalt-driveway-paving-guide", label: "Asphalt vs Concrete Driveway Guide" },
    ],
  },
  {
    slug: "roofers",
    trade: "Roofing Contractors",
    title: "ProBuildCalc for Roofing Contractors — Squares, Bundles & Gutters",
    description: "Measure roof area by pitch, take off shingle squares and bundles, and add gutters — the estimating app built for roofing contractors.",
    dek: "Get roof area by pitch, shingle squares, and bundle count from a quick scan — quote reroof and new-construction jobs on the spot.",
    benefits: [
      "Calculate roof area adjusted for pitch — no climbing required for the estimate.",
      "Convert area to shingle squares and bundle count with the right waste factor.",
      "Add gutter linear footage and downspout count to the same quote.",
      "Hand the homeowner a professional PDF with measurements before you leave.",
    ],
    tools: [
      { href: "/tools/roofing-calculator", label: "Roofing Calculator" },
      { href: "/tools/gutter-calculator", label: "Gutter Calculator" },
      { href: "/tools/siding-calculator", label: "Siding Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-estimate-roofing-shingles", label: "How to Estimate Roofing Shingles" },
    ],
  },
  {
    slug: "tile-setters",
    trade: "Tile Setters",
    title: "ProBuildCalc for Tile Setters — Tile, Grout & Thinset Estimates",
    description: "Scan a bathroom or floor, take off tile boxes, grout, and thinset, and quote the job. The estimating app built for tile setters.",
    dek: "Scan the room, pick your tile size and layout, and get box count, grout, and thinset — ready to quote before you leave the job site.",
    benefits: [
      "Capture floor and wall area in one scan, including bathroom and shower layouts.",
      "Get tile boxes with the right waste factor for straight, diagonal, or herringbone.",
      "Calculate grout by tile size and joint width — no guessing at the counter.",
      "Quote tile jobs on-site with a materials list that matches what you'll actually order.",
    ],
    tools: [
      { href: "/tools/tile-calculator", label: "Tile Calculator" },
      { href: "/tools/grout-calculator", label: "Grout Calculator" },
      { href: "/tools/bathroom-tile-calculator", label: "Bathroom Tile Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-estimate-tile-for-a-bathroom", label: "How to Estimate Tile for a Bathroom" },
      { href: "/blog/how-to-measure-for-countertops", label: "How to Measure for Countertops" },
    ],
  },
  {
    slug: "landscapers",
    trade: "Landscapers",
    title: "ProBuildCalc for Landscapers — Mulch, Sod, Gravel & Seed",
    description: "Measure outdoor areas, take off mulch yards, sod pallets, and gravel tons, and quote landscape jobs. The estimating app for landscapers.",
    dek: "Measure the bed, lawn, or hardscape area and get bulk material quantities in cubic yards — sod, mulch, gravel, sand, and seed — ready to order.",
    benefits: [
      "Measure irregular lawn and bed areas faster than a wheel measure.",
      "Convert area to cubic yards of mulch, gravel, or soil — and tons for bulk delivery.",
      "Take off sod pallets, grass seed pounds, and base sand for patios from one measurement.",
      "Quote material and labor on the spot and send a professional estimate to the homeowner.",
    ],
    tools: [
      { href: "/tools/mulch-calculator", label: "Mulch & Soil Calculator" },
      { href: "/tools/sod-calculator", label: "Sod Calculator" },
      { href: "/tools/gravel-calculator", label: "Gravel Calculator" },
      { href: "/tools/grass-seed-calculator", label: "Grass Seed Calculator" },
      { href: "/tools/sand-calculator", label: "Sand Calculator" },
    ],
    guides: [
      { href: "/blog/how-much-mulch-do-i-need", label: "How Much Mulch Do I Need?" },
      { href: "/blog/how-to-estimate-sod-for-a-lawn", label: "How to Estimate Sod" },
      { href: "/blog/how-much-gravel-for-a-driveway", label: "How Much Gravel Do I Need?" },
    ],
  },
  {
    slug: "siding-contractors",
    trade: "Siding Contractors",
    title: "ProBuildCalc for Siding Contractors — Squares, Trim & Cost Estimates",
    description: "Measure wall area, take off siding squares with openings deducted, and add trim — the estimating app built for siding contractors.",
    dek: "Measure the house walls, deduct windows and doors, and get siding squares, trim linear footage, and a quote — before your competitors even call back.",
    benefits: [
      "Capture wall area with openings automatically deducted — no manual math.",
      "Calculate siding squares with the right waste factor for lap, shake, or panel.",
      "Add fascia, soffit, and trim linear footage to the same project.",
      "Quote a full exterior job on-site and hand the homeowner a professional estimate.",
    ],
    tools: [
      { href: "/tools/siding-calculator", label: "Siding Calculator" },
      { href: "/tools/gutter-calculator", label: "Gutter Calculator" },
      { href: "/tools/wood-fence-cost-calculator", label: "Wood Fence Cost Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-estimate-roofing-shingles", label: "Roofing & Siding Estimation Guide" },
      { href: "/blog/how-to-bid-a-construction-job", label: "How to Bid a Construction Job" },
    ],
  },
  {
    slug: "framing-contractors",
    trade: "Framing Contractors",
    title: "ProBuildCalc for Framing Contractors — Studs, Joists & Cost Estimates",
    description: "Measure a floor plan, take off stud counts, joist lengths, and rough opening dimensions, and quote framing jobs fast — the estimating app built for framing contractors.",
    dek: "Scan the floor plan or measure on-site, and walk away with stud counts, joist schedule, rough opening dimensions, and a framing cost estimate — before the next crew shows up.",
    benefits: [
      "Calculate wall stud counts at any spacing from measured linear footage — in seconds.",
      "Take off floor joist quantities with the right span and spacing for the load.",
      "Size rough openings for windows and doors and confirm header requirements.",
      "Quote framing by square foot with a materials list you can hand to the lumber yard.",
    ],
    tools: [
      { href: "/tools/stud-calculator", label: "Stud Calculator" },
      { href: "/tools/joist-calculator", label: "Joist Calculator" },
      { href: "/tools/rough-opening-calculator", label: "Rough Opening Calculator" },
      { href: "/tools/framing-cost-calculator", label: "Framing Cost Calculator" },
    ],
    guides: [
      { href: "/blog/wall-framing-stud-spacing-guide", label: "Wall Framing & Stud Spacing Guide" },
      { href: "/blog/framing-cost-per-square-foot", label: "Framing Cost Per Square Foot" },
      { href: "/blog/window-rough-opening-size-chart", label: "Window Rough Opening Size Chart" },
    ],
  },
  {
    slug: "drywall-contractors",
    trade: "Drywall Contractors",
    title: "ProBuildCalc for Drywall Contractors — Sheets, Compound & Quotes",
    description: "Measure wall and ceiling area, take off drywall sheet counts with the right waste factor, and quote drywall jobs on-site — the estimating app built for drywall contractors.",
    dek: "Measure wall and ceiling square footage in one scan, get your sheet count and compound estimate, and send a quote before the competition finishes measuring.",
    benefits: [
      "Capture wall and ceiling area from a LiDAR scan — no counting studs by hand.",
      "Calculate sheet count with the right waste factor for your layout and room shape.",
      "Estimate joint compound, tape, and corner bead from the same measurements.",
      "Quote drywall jobs on-site with a materials list matched to what you will order.",
    ],
    tools: [
      { href: "/tools/drywall-calculator", label: "Drywall Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
      { href: "/tools/stud-calculator", label: "Stud Calculator" },
      { href: "/tools/paint-calculator", label: "Paint Calculator" },
    ],
    guides: [
      { href: "/blog/how-to-estimate-drywall", label: "How to Estimate Drywall" },
      { href: "/blog/drywall-installation-cost-guide", label: "Drywall Installation Cost Guide" },
      { href: "/blog/how-to-bid-a-construction-job", label: "How to Bid a Construction Job" },
    ],
  },
  {
    slug: "plumbers",
    trade: "Plumbers",
    title: "ProBuildCalc for Plumbers — PEX Pipe, Pool Volume & Material Estimates",
    description: "Calculate PEX pipe footage for radiant heat and plumbing rough-ins, estimate pool volume for fill and chemical costs, and quote plumbing jobs faster.",
    dek: "Get PEX pipe footage by zone and spacing, pool fill volume in gallons, and a rough-in materials list — all from measurements you already have on the job site.",
    benefits: [
      "Calculate PEX tubing footage for radiant floor heat at any spacing and zone layout.",
      "Estimate pool fill volume in gallons for accurate chemical dosing and fill cost quotes.",
      "Measure room area and convert to pipe footage for rough-in plumbing estimates.",
      "Quote plumbing rough-ins with a materials list you can send to the supply house.",
    ],
    tools: [
      { href: "/tools/pex-pipe-calculator", label: "PEX Pipe Calculator" },
      { href: "/tools/pool-volume-calculator", label: "Pool Volume Calculator" },
      { href: "/tools/square-footage-calculator", label: "Square Footage Calculator" },
      { href: "/tools/concrete-calculator", label: "Concrete Calculator" },
    ],
    guides: [
      { href: "/blog/pex-pipe-sizing-guide", label: "PEX Pipe Sizing Guide" },
      { href: "/blog/how-to-bid-a-construction-job", label: "How to Bid a Construction Job" },
    ],
  },
];

export const getRole = (slug: string): Role | undefined => ROLES.find((r) => r.slug === slug);
