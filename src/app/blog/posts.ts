// Blog post data. Articles are generated as structured content and rendered
// through src/app/blog/[slug]/page.tsx. Generated 2026-06-06.

export type BlogSection = { heading: string; body: string[] };
export type BlogFaq = { q: string; a: string };
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  dek: string;
  date: string;
  sections: BlogSection[];
  faq: BlogFaq[];
  related: { href: string; label: string }[];
};

export const POSTS: BlogPost[] = [
  {
    "slug": "how-to-estimate-flooring-materials",
    "title": "How to Estimate Flooring Materials for a Job",
    "description": "A practical guide to estimating flooring: measuring square footage, choosing waste factors by material, converting to boxes, and avoiding common takeoff mistakes.",
    "keywords": [
      "how to estimate flooring",
      "flooring takeoff",
      "flooring waste factor",
      "square footage calculation",
      "flooring material estimate",
      "flooring coverage rate",
      "flooring per box",
      "underlayment estimate"
    ],
    "dek": "Estimating flooring comes down to three things done correctly: measure the area, add the right waste factor, and convert to the units the supplier actually sells. Get any one wrong and you either run short mid-install or eat the cost of returned boxes. Here is the method professionals use.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "Step 1: Measure the Floor in Square Feet",
        "body": [
          "Break the space into rectangles. For each room or section, multiply length by width to get square feet, then add the sections together. A 12 ft by 14 ft room is 168 sq ft. For an L-shaped room, split it into two rectangles, calculate each, and sum them rather than trying to measure the whole thing at once.",
          "Always measure to the longest points and let the wall line, not the baseboard, define the boundary. Include closets, the area under appliances and toe-kicks if the floor runs through, and any alcoves. For diagonal or herringbone layouts, measure the room normally; the extra material those patterns consume is handled by the waste factor in Step 2, not by changing how you measure.",
          "Round each room measurement up to the nearest inch, and convert to decimal feet (a measurement of 12 ft 6 in becomes 12.5 ft). For odd angles, a quick field shortcut is to box in the area to its maximum dimensions, then subtract the obvious cut-out rectangles. LiDAR scanning tools can capture an accurate room footprint and surface area in one pass; ProBuildCalc, for example, turns a phone scan into a square-foot figure you can drop straight into your takeoff, which removes most of the manual tape-and-add errors."
        ]
      },
      {
        "heading": "Step 2: Add a Waste Factor",
        "body": [
          "Net square footage is never what you order. Cuts, breakage, defective boards, and future repairs all need coverage, so you add a waste percentage on top of the measured area. The right number depends on the material and the layout, and it is the single biggest source of estimating mistakes.",
          "Common industry rules of thumb for a straight or grid layout: roughly 5 to 10 percent for sheet vinyl, LVP/LVT, and laminate; about 10 percent for standard hardwood and most tile; and around 10 percent for carpet, though carpet is bought by the roll width so seam planning often drives waste higher. Increase the factor for anything that creates more cuts: add about 5 percent for a diagonal layout and 10 to 15 percent for herringbone, chevron, or busy patterned tile. Small, choppy rooms with lots of corners waste more than one large open space, so lean toward the high end on bathrooms, hallways, and closets."
        ]
      },
      {
        "heading": "Step 3: Convert Square Footage to Sellable Units",
        "body": [
          "Suppliers sell flooring by the box, the carton, or the roll, not by the loose square foot, and the only way to avoid running short is to round up to whole units. The math is: total square feet with waste, divided by the coverage per box, rounded up to the next full box.",
          "Worked example: a 168 sq ft room in LVP at 8 percent waste needs about 181 sq ft (168 times 1.08). If the product covers 23.8 sq ft per box, that is 181 divided by 23.8, which equals 7.6 boxes, so you order 8 boxes. Never round down. Box coverage varies a lot by product line, so read the actual carton coverage rather than assuming a round number. For tile, do the same calculation in square feet, but also confirm the count per box matches your layout if you are working to a specific tile count.",
          "Buy from one dye lot or run number where it matters: hardwood, LVP, carpet, and tile can show visible color or shade variation between production batches, so order the full job, including waste, at once. It is far cheaper to return one unopened box than to discover the supplier is out of your lot halfway through."
        ]
      },
      {
        "heading": "Don't Forget the Companion Materials",
        "body": [
          "A flooring estimate is more than the visible surface. Underlayment, padding, or moisture barrier is usually estimated at the net floor area (the measured square footage, with little or no waste since rolls cut cleanly), but check whether your product has it pre-attached so you do not double-buy. Subfloor patch or self-leveling compound is estimated by coverage at a given thickness per bag, which you will find on the bag.",
          "Trim and transitions are estimated by linear foot, not square foot: measure the perimeter for baseboard or shoe molding, and count each doorway and floor-height change for transition strips and reducers. Add adhesive, mortar, or thinset by the bag or bucket using the product's stated spread rate, which changes with trowel size, and grout by coverage for the tile size and joint width. Fasteners, tack strip for carpet, and a few spare planks for the customer round out a complete material list."
        ]
      },
      {
        "heading": "A Repeatable Estimating Checklist",
        "body": [
          "Standardize the process so every job comes out consistent. First, sketch the space and break it into rectangles. Second, measure and total the net square footage, including closets and under-appliance runs. Third, apply the waste factor for the material and layout. Fourth, divide by real box or roll coverage and round up to whole units, ordered from one lot. Fifth, add underlayment, trim by linear foot, adhesive and grout by spread rate, and a repair allowance.",
          "Keep your assumptions written on the estimate: the net area, the waste percentage you used, and the coverage per box. When a job comes in over or under, those three numbers tell you exactly where the estimate drifted, and they make the next bid sharper. The goal is to order once, finish with a small remainder for repairs, and never stop an install waiting on material."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much extra flooring should I order for waste?",
        "a": "For straight or grid layouts, a common range is 5 to 10 percent for vinyl, LVP, and laminate, and about 10 percent for hardwood, tile, and carpet. Add roughly 5 percent more for diagonal installs and 10 to 15 percent for herringbone, chevron, or busy patterned tile. Small rooms with many corners waste more than large open spaces, so use the higher end there."
      },
      {
        "q": "How do I convert square footage into boxes of flooring?",
        "a": "Take your total square footage including waste and divide it by the coverage per box printed on the carton, then round up to the next whole box. For example, 181 sq ft divided by 23.8 sq ft per box is 7.6, so you order 8 boxes. Always round up and never down, since suppliers sell only whole boxes."
      },
      {
        "q": "Do I include closets and the area under appliances when measuring?",
        "a": "Yes, if the flooring runs into them. Include closets, alcoves, and the space under appliances and toe-kicks whenever the floor continues there. Measure to the wall line rather than the baseboard, and break complex shapes into rectangles you can measure and add up individually."
      },
      {
        "q": "Why should I buy all the flooring from the same dye lot?",
        "a": "Hardwood, LVP, carpet, and tile can vary in color or shade between production batches, so mixing lots can leave a visible difference in the finished floor. Order the entire job, including your waste allowance, in one purchase from the same lot or run number. Returning one unopened box is far easier than matching a sold-out lot mid-install."
      }
    ],
    "related": [
      {
        "href": "/tools/flooring-calculator",
        "label": "Flooring Calculator"
      },
      {
        "href": "/tools/square-footage-calculator",
        "label": "Square Footage Calculator"
      }
    ]
  },
  {
    "slug": "flooring-installation-cost-guide",
    "title": "Flooring Installation Cost: How to Price Materials and Labor",
    "description": "A contractor's guide to flooring installation cost: material and labor rates by type, waste factors, coverage math, and how to build an accurate per-square-foot bid.",
    "keywords": [
      "flooring installation cost",
      "flooring labor cost per square foot",
      "flooring material takeoff",
      "flooring waste factor",
      "how to price flooring jobs",
      "LVP installation cost",
      "tile installation cost",
      "hardwood flooring estimate"
    ],
    "dek": "Flooring is one of the easiest trades to underbid because the labor varies more than the material. This guide breaks down how to measure, what to charge for material and labor by flooring type, and how to assemble a number you can stand behind.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "Start with an accurate measurement, not the listing square footage",
        "body": [
          "Every flooring bid begins with the field measurement, and the number you want is net floor area broken out by room. Measure each room's length times width to the nearest tenth of a foot, then add the rooms together. Closets, the floor area inside doorways, and hearth cutouts all count. Subtract permanent obstructions like islands and built-in cabinetry, but do not subtract toe-kicks unless the flooring genuinely stops short of them.",
          "A common mistake is pulling square footage off a real-estate listing or an old plan. Listed square footage includes wall thickness and often the garage or unconditioned space, so it routinely runs five to ten percent high for flooring purposes. Always measure the actual finished surface you intend to cover.",
          "For irregular rooms, break the space into rectangles and triangles, calculate each, and sum them. This is also the stage where a LiDAR scan pays off: tools like ProBuildCalc let you scan a room and pull room-by-room areas and linear footage straight into a takeoff, which is faster and less error-prone than a tape and a notepad on a multi-room job. Whatever method you use, record area per room separately so you can plan layout and waste intelligently."
        ]
      },
      {
        "heading": "Apply the right waste factor for the product and layout",
        "body": [
          "Order quantity equals net area times one plus the waste factor. Waste is not padding, it is the real material consumed by cuts, off-cuts you cannot reuse, pattern matching, and attic stock for future repairs. The figure depends mostly on the product and the install pattern, not the room size.",
          "Reasonable industry rules of thumb: plank and tile run straight or stacked, roughly five to ten percent. The same products run on a diagonal or in a herringbone or chevron pattern, roughly fifteen to twenty percent because every perimeter cut creates an unusable triangle. Sheet vinyl and broadloom carpet depend on roll width and seam placement and can waste twenty percent or more on a cut-up plan. Patterned tile or carpet that must be matched across seams adds further. Many manufacturers also require ordering full cartons, so round up to the next full box and note the carton coverage on your order.",
          "Two practical points. First, add a slightly higher factor on small or chopped-up rooms and on long narrow hallways, where off-cuts are harder to use. Second, dye-lot and run-number sensitive products should be ordered complete in one purchase; coming back for two more boxes later often means a visible color mismatch, so it is cheaper to carry attic stock than to re-order."
        ]
      },
      {
        "heading": "Material cost ranges by flooring type",
        "body": [
          "These are approximate, regional, and move with the market, so treat them as planning ranges and confirm with a live supplier quote before bidding. Figures are material only, before tax and delivery. Luxury vinyl plank and tile, roughly two to seven dollars per square foot depending on wear-layer thickness and rigid-core construction. Laminate, roughly one to four dollars. Engineered hardwood, roughly four to ten dollars; solid hardwood, roughly five to twelve and higher for wide-plank or exotic species. Ceramic and porcelain tile, roughly two to ten dollars for the tile itself, with large-format and designer lines running higher. Carpet with pad, roughly two to six dollars installed-grade material.",
          "Do not forget the consumables and accessories, which contractors chronically leave off the estimate. Underlayment or pad, moisture barrier, thinset or mortar, grout, adhesive, transition strips and reducers, trim and shoe molding, fasteners or staples, leveling compound, and tile spacers and sealer all carry real cost. On a tile job, thinset, grout, and a membrane can add a meaningful amount per square foot on top of the tile. Build a short accessories line for every job rather than burying it in waste."
        ]
      },
      {
        "heading": "Labor: where most flooring bids go wrong",
        "body": [
          "Labor varies far more than material, and it is what separates a profitable flooring contractor from a busy one. Price labor either as a crew day-rate divided by realistic daily production, or as a per-square-foot install rate, then sanity-check one against the other. As broad, regional, approximate ranges for install labor only: floating LVP or laminate, roughly one to three dollars per square foot; glue-down or nail-down hardwood, roughly two to six; standard tile, roughly four to ten, with large-format, mosaics, or intricate patterns pushing higher; carpet, often priced per square yard.",
          "Production rates anchor those numbers. A two-person crew might float roughly three hundred to six hundred square feet of LVP or laminate per day, install roughly two hundred to four hundred square feet of nail-down hardwood, or set roughly one hundred to two hundred fifty square feet of standard tile per day, less for large-format or detailed layouts. Take your fully burdened crew cost per day, divide by the square feet that crew realistically completes, and you have a defensible labor rate per square foot. Slow access, upstairs work, and constant furniture moving all cut daily production and should raise the rate."
        ]
      },
      {
        "heading": "Don't forget prep, demo, and subfloor work",
        "body": [
          "Tear-out and disposal are separate line items, not part of the install rate. Price demo by area and by how the existing floor is attached: glued vinyl, stapled carpet, and thinset-set tile remove at very different speeds, and tile demo in particular is slow, dusty, and dumpster-heavy. Carry haul-off and dump fees explicitly.",
          "Subfloor prep is the line that quietly destroys margins. Most manufacturers spec a flatness tolerance, commonly something on the order of an eighth to three-sixteenths of an inch over a ten-foot span, and rigid plank and large-format tile are unforgiving of dips and humps. Walk and probe the subfloor before you bid. Self-leveling compound, plywood underlayment, an anti-fracture or uncoupling membrane under tile, squeak repair, and moisture testing or mitigation on slabs all add cost. If you cannot fully assess the subfloor before bidding, state your scope and price prep as an allowance or unit-priced extra rather than absorbing an unknown."
        ]
      },
      {
        "heading": "Assemble the bid and protect your margin",
        "body": [
          "Build the estimate as stacked line items, not a single per-square-foot guess. The sequence is: net area by room from your takeoff, material quantity with waste and rounded to full cartons, accessories and consumables, demo and disposal, subfloor prep, install labor from your production-based rate, and then a line for transitions, trim, and final detailing. Add mobilization or a minimum job charge for small rooms, because a single bathroom costs nearly a full setup regardless of its tiny area.",
          "On top of direct cost, apply overhead and profit. A markup that covers your trucks, insurance, estimating time, and callbacks, plus profit, is what keeps the business alive; the exact percentage is yours to set based on your books, but it must be there as a deliberate line, not an afterthought. Finally, write the proposal so the scope is unambiguous: what is included, what is excluded, who moves furniture and removes appliances, who handles the toilet pull and reset on a tile bath, and how change orders for hidden subfloor damage are priced. A clear scope is the cheapest insurance against the disputes that turn a profitable flooring job into a loss."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much does flooring installation cost per square foot, all in?",
        "a": "As a rough, regional, approximate planning figure, all-in flooring (material plus install labor) commonly lands somewhere around three to fifteen dollars per square foot depending heavily on the product and complexity, with high-end tile and wide-plank hardwood running above that. Always rebuild the number from a real material quote plus your own production-based labor rate rather than relying on a blanket per-foot figure, because labor and prep vary far more than the flooring itself."
      },
      {
        "q": "How much waste should I add when ordering flooring?",
        "a": "Use roughly five to ten percent for straight-laid plank and tile, and roughly fifteen to twenty percent for diagonal, herringbone, or chevron layouts because perimeter cuts create unusable off-cuts. Sheet goods and carpet can waste twenty percent or more depending on roll width and seams. Add a little extra on small or chopped-up rooms, round up to full cartons, and order dye-lot-sensitive products complete in one purchase to avoid color mismatches."
      },
      {
        "q": "Why is flooring labor so much more variable than the material?",
        "a": "Material is a published price per square foot, but labor is driven by install method, layout complexity, subfloor condition, and site access, all of which change daily production. Floating a clean rectangular room is fast; nail-down hardwood, large-format tile, intricate patterns, upstairs work, and constant furniture moving are all slower. Pricing labor from realistic daily production rates for your crew, rather than a flat assumption, is what keeps flooring bids accurate."
      },
      {
        "q": "What costs do contractors most often leave out of a flooring bid?",
        "a": "The usual omissions are accessories and consumables (underlayment, thinset, grout, adhesive, transitions, and trim), demo and dump fees, and especially subfloor prep like leveling compound, membranes, and moisture mitigation. A minimum or mobilization charge for small rooms and an explicit overhead-and-profit markup are also frequently missing. Listing each as its own line item, and pricing unknown subfloor work as an allowance or unit-priced extra, prevents these from eating your margin."
      }
    ],
    "related": [
      {
        "href": "/tools/flooring-calculator",
        "label": "Flooring Calculator"
      }
    ]
  },
  {
    "slug": "lidar-vs-tape-measure-for-takeoffs",
    "title": "LiDAR vs Tape Measure for Material Takeoffs",
    "description": "When phone LiDAR beats a tape measure for material takeoffs, when it doesn't, and the accuracy, workflow, and waste-factor details contractors need to know.",
    "keywords": [
      "lidar vs tape measure",
      "lidar room scanning",
      "material takeoff",
      "construction estimating",
      "phone lidar accuracy",
      "square footage measurement",
      "contractor takeoff app",
      "waste factor"
    ],
    "dek": "A tape measure has run jobsites for a century, and phone LiDAR isn't going to retire it. But for the specific job of turning a room into a material list, the scanner has earned a real place. Here's where each one wins, what the accuracy gap actually is, and how to keep your numbers honest either way.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "What each tool is actually good at",
        "body": [
          "A tape measure is a point-to-point instrument. You read one dimension at a time, write it down, and do the geometry later. It is dead accurate over short, straight, accessible runs, costs almost nothing, never needs charging, and nobody questions a number you pulled off a steel tape. Its weak spots are the boring ones: it takes two hands and often two people, it is slow on large or cluttered rooms, and every measurement is a chance to transpose a digit or forget to log it.",
          "Phone LiDAR works the opposite way. Instead of capturing points one at a time, you walk the space and the phone builds a 3D model of the walls, floor, ceiling, doors, and windows in one pass. The payoff is speed and completeness: in the time it takes to tape out one wall you can capture an entire room, and you walk away with a floor plan and area totals instead of a page of scribbled numbers. The catch is that it is a measurement of a model, not of the wall itself, so it inherits whatever small errors the scan introduced.",
          "Rule of thumb: reach for the tape when you need one or two exact dimensions, especially for cut lists, trim returns, cabinet runs, and anything going to a fabricator. Reach for the scanner when you need the whole-room picture fast for an estimate, a material count, or a client walkthrough."
        ]
      },
      {
        "heading": "How accurate is phone LiDAR, really",
        "body": [
          "Be realistic about the hardware. The LiDAR sensor on a phone or tablet is a short-range depth scanner with an effective working range of roughly 16 feet, not a survey-grade total station. On a typical room scan, expect accuracy on the order of a percent or two of the measured distance, which often lands within an inch or two over a 10 to 15 foot wall. That is plenty for estimating square footage and counting sheet goods. It is not tight enough to cut a countertop or order a custom door off the scan alone.",
          "Accuracy degrades in predictable ways, and knowing them is half the skill. Glass, mirrors, and high-gloss surfaces confuse the depth sensor. So do very dark or matte-black materials that absorb the signal, bright direct sunlight that washes out the return, and long open spans beyond the sensor's range. Scanning too fast, or whipping the phone around corners, causes the model to drift so the room does not quite close back on itself.",
          "The practical fix is technique. Move at a slow walking pace, keep the phone roughly waist to chest height, overlap your passes, and make sure the model closes cleanly when you return to your start point. For any number that drives a cut or a fabrication order, verify the critical dimension with a tape. Treat the scan as your fast 95 percent and the tape as your spot-check on the 5 percent that has to be exact."
        ]
      },
      {
        "heading": "A clean takeoff workflow either way",
        "body": [
          "Whichever tool you use, the takeoff itself follows the same path: get clean dimensions, calculate net area, apply a coverage rate, then add a waste factor. The tool only changes the first step. With a tape you measure length times width for each surface and subtract openings. With a scanner you walk the room and read the area off the model, then sanity-check it against a quick tape measurement or against the room's nominal size.",
          "Two habits keep both methods honest. First, decide up front whether you are working in gross or net area. For paint and most flooring you subtract large openings like doorways and big windows; for drywall you often estimate gross and let the offcuts cover small openings. Second, always write down or export the raw dimensions, not just the total, so you can re-check the math later. Lost source numbers are the most common reason a takeoff cannot be defended when the order looks wrong. This is also where a scan-to-list tool like ProBuildCalc fits naturally: it turns the captured room dimensions straight into area and material counts, so the geometry and the unit math happen in one place instead of on a notepad.",
          "Unit conversions to keep straight: 1 square (roofing and siding) equals 100 square feet; 1 cubic yard of concrete equals 27 cubic feet, so a 4-inch slab covers about 81 square feet per yard; and lineal coverage like baseboard or crown is just the room perimeter, which a scan gives you for free."
        ]
      },
      {
        "heading": "Coverage rates and waste factors to estimate from",
        "body": [
          "These are standard industry rules of thumb, not guarantees, and you should adjust them to your products and local conditions. Interior paint covers roughly 350 to 400 square feet per gallon on a smooth surface for one coat; plan on two coats, and drop the effective coverage on rough, porous, or previously unpainted surfaces. Drywall comes in 32 square foot (4x8) and 48 square foot (4x12) sheets, so divide wall and ceiling area by the sheet size and round up. Standard joint compound and tape usage tracks the board count.",
          "Flooring and tile sell by the box with the square footage printed on the carton, so the move is net area divided by box coverage, rounded up to whole boxes. Concrete is ordered in cubic yards using thickness times area, then converted with the 27-cubic-feet-per-yard figure above. Roofing is counted in squares, with bundles typically running three to a square for standard architectural shingles.",
          "Then add waste. Typical planning figures: paint with little waste beyond the coverage math; drywall around 10 to 15 percent; standard straight-lay flooring and tile about 10 percent; diagonal or herringbone tile layouts 15 to 20 percent; and concrete commonly ordered with roughly 5 to 10 percent over the calculated volume to cover subgrade variation and short loads. Complex rooms, lots of cuts, and patterned layouts push you toward the high end of every range."
        ]
      },
      {
        "heading": "The bottom line for contractors",
        "body": [
          "This is not a contest the tape loses. The honest takeaway is that phone LiDAR has quietly become the better tool for the first mile of estimating, capturing a whole room and its openings faster and more completely than anyone can tape it, while the tape remains the final word on any single dimension that has to be exact.",
          "The crews who get the most out of scanning treat it as a measurement-capture and documentation tool, not a replacement for knowing your numbers. Scan for speed and a record, tape to confirm the cuts, apply real coverage rates and waste factors, and keep your source dimensions. Do that and the scanner pays for itself in saved walkthroughs and fewer transcription errors, without ever putting a bad number in front of a client or a supplier."
        ]
      }
    ],
    "faq": [
      {
        "q": "Is phone LiDAR accurate enough for material takeoffs?",
        "a": "Yes for estimating area and counting materials like paint, drywall, and flooring, where being within an inch or two over a wall is fine. No for cut lists or fabricated items like countertops and custom doors. For those, confirm the critical dimension with a tape. Treat the scan as your fast 95 percent and the tape as the spot-check on what has to be exact."
      },
      {
        "q": "Why does my LiDAR scan come out wrong sometimes?",
        "a": "The usual culprits are glass, mirrors, glossy or matte-black surfaces, direct sunlight, spans beyond the sensor's roughly 16-foot range, and scanning too fast. Move at a slow walking pace, keep the phone at waist-to-chest height, overlap your passes, and make sure the model closes back on its starting point before you trust the numbers."
      },
      {
        "q": "What waste factor should I add to a takeoff?",
        "a": "Common planning figures are about 10 to 15 percent for drywall, around 10 percent for straight-lay flooring and tile, 15 to 20 percent for diagonal or herringbone tile, and roughly 5 to 10 percent extra concrete. These are rules of thumb. Push to the high end for cut-heavy rooms and patterned layouts, and adjust to your products and local conditions."
      },
      {
        "q": "Should I stop using a tape measure if I have LiDAR?",
        "a": "No. They do different jobs. Use the scanner to capture a whole room fast for estimates and material counts, and keep the tape for any single dimension that drives a cut or a fabrication order. The best workflow scans for speed and documentation, then taps the tape to verify the few measurements that must be exact."
      }
    ],
    "related": [
      {
        "href": "/tools/square-footage-calculator",
        "label": "Square Footage Calculator"
      },
      {
        "href": "/tools",
        "label": "All calculators"
      }
    ]
  },
  {
    "slug": "how-to-measure-square-footage-of-a-house",
    "title": "How to Measure Square Footage Accurately",
    "description": "A contractor's guide to measuring square footage of a room or house: the actual steps, waste factors, coverage rates, and unit conversions that prevent costly mistakes.",
    "keywords": [
      "how to measure square footage",
      "measure square footage of a room",
      "square footage calculation",
      "material takeoff",
      "flooring waste factor",
      "gross living area",
      "paint coverage per gallon",
      "square footage of a house"
    ],
    "dek": "Square footage is the number every material order, labor bid, and quote hangs on. Get it wrong and you either run short mid-job or eat the cost of overage. Here is how to measure a room or a whole house the way estimators actually do it, plus the conversions and waste factors that turn raw dimensions into an order you can trust.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "The Core Formula and Why Shape Matters",
        "body": [
          "Square footage of any rectangle is length times width. Measure a 12-foot by 14-foot room and you have 168 square feet. That is the entire math for a simple room. The trouble is that almost no real room is a clean rectangle once you account for closets, bays, offsets, and angled walls.",
          "The reliable method is to divide the space into rectangles and right triangles, calculate each piece separately, then add them up. A rectangle is length times width. A triangle is one-half times base times height. An L-shaped room becomes two rectangles; a room with a clipped corner becomes a rectangle minus a triangle. Sketch the floor plan on paper or a tablet first, write each measured dimension on the sketch, and label each sub-area before you multiply. This sketch-first habit is what separates a takeoff that reconciles from one that does not.",
          "Measure to the face of the finished wall, hold the tape level and tight, and record to the nearest inch (or 0.1 foot if you work in decimal feet). For inches, remember that you divide by 12 to get feet before multiplying, or convert at the end: a 12-foot 6-inch wall is 12.5 feet, not 12.6."
        ]
      },
      {
        "heading": "Measuring a Room Step by Step",
        "body": [
          "Clear the perimeter enough to reach the walls, then measure the two primary dimensions wall to wall. For a rectangular room, that is all you need. For anything irregular, walk the perimeter and capture every jog: each offset, alcove, and closet opening gets its own length and width.",
          "A laser distance measurer is faster and more accurate than a tape over long spans because there is no sag and no two-person hold. Shoot from one wall to the opposite wall, let it read, and log it. For full rooms, a phone or tablet with LiDAR can capture the floor plan and compute the area in one pass; tools like ProBuildCalc scan the room and export the square footage straight into a takeoff, which removes the transcription errors that creep in when you copy tape readings by hand. Whatever the method, spot-check by re-measuring one wall a second time before you leave the room.",
          "Decide up front whether your number includes or excludes things like the floor area under cabinets, hearths, or fixed islands. For flooring you usually deduct large permanent obstructions; for paint and drywall you measure wall area, not floor area, which is a different calculation entirely (perimeter times ceiling height, minus openings)."
        ]
      },
      {
        "heading": "Measuring a Whole House",
        "body": [
          "For total house square footage, the recognized convention for finished living area is to measure the exterior of the heated, finished space and only count floor area with a finished ceiling height of at least 7 feet (under a sloped ceiling, count area where the ceiling is at least 5 feet, provided at least half the room meets the 7-foot rule). This is the basis of the ANSI Z765 standard that appraisers follow, and matching it keeps your numbers consistent with how a house is actually valued and described.",
          "Garages, unfinished basements, attics, and open-to-below areas do not count toward finished living area even though they may matter for your scope of work. Measure them separately and label them, because a flooring or insulation bid often covers space the official square footage excludes.",
          "Work one level at a time, measure the building footprint, deduct open stairwells on upper floors so you do not double-count, and total the levels. Keep the finished-living-area figure and your work-scope figure as two distinct numbers so a quote never gets compared against the wrong basis."
        ]
      },
      {
        "heading": "Turning Square Footage Into a Material Order",
        "body": [
          "Raw square footage is not an order quantity. You convert it using the product's coverage rate, then add waste. Paint covers roughly 350 to 400 square feet per gallon per coat on smooth, sealed drywall; rough, porous, or previously unpainted surfaces drink more, so drop toward 250 to 300 and plan on two coats. Drywall comes in 4-by-8 sheets at 32 square feet each (4-by-12 sheets are 48). Standard carpet and many sheet goods are still priced per square yard, where 1 square yard equals 9 square feet, so divide your square footage by 9 to compare.",
          "Add a waste factor on top of net area. Typical rules of thumb: 5 to 10 percent for standard plank or laminate flooring run straight, 10 percent or more when it runs diagonally or in a pattern, and 10 to 15 percent for tile (push to 15 percent for diagonal layouts, large-format tile, or rooms with many cuts). Order full cartons: if a flooring carton covers, say, 20 square feet, round your waste-adjusted total up to the next whole carton and keep the spare for repairs.",
          "A worked example: a 168-square-foot room getting tile at a 12 percent waste factor needs 168 times 1.12, or about 188 square feet of tile ordered. The same room painted (assume 8-foot ceilings, roughly 4 walls totaling about 416 square feet of wall, minus 40 square feet for a door and window equals 376 net) needs about 376 divided by 375, so roughly one gallon per coat, or two gallons for two coats plus a quart of cushion. Always document the coverage rate and waste percentage you used on the estimate, because that is what lets you defend the number if the order comes up short."
        ]
      },
      {
        "heading": "Common Mistakes That Blow the Number",
        "body": [
          "The big four errors are measuring to the wrong surface (stud face versus finished wall), forgetting closets and offsets, mixing units (adding inches as if they were tenths of a foot), and confusing floor area with wall area. Any one of these can swing a bid by enough to erase the margin on the job.",
          "Confirm units before you multiply, never net out small openings on paint (a single door is not worth deducting, but a wall of windows is), and keep your field sketch with its labeled dimensions attached to the estimate. Reconcile the sum of your sub-areas against a rough overall length-times-width sanity check; if the two are far apart, you missed a jog or fat-fingered a number.",
          "Build the waste factor in at the takeoff stage, not at the supply house. Deciding the percentage at the counter under time pressure is how jobs end up with three extra cartons or, worse, one too few and a dye-lot mismatch on the reorder."
        ]
      }
    ],
    "faq": [
      {
        "q": "How do I measure the square footage of an irregular or L-shaped room?",
        "a": "Break it into rectangles and right triangles. Calculate each piece (length times width for rectangles, one-half base times height for triangles), then add them together. Sketch the room first and label every measured dimension, including closets and offsets, so nothing gets missed when you total it up."
      },
      {
        "q": "How much waste should I add to a flooring or tile order?",
        "a": "Use roughly 5 to 10 percent for standard plank or laminate run straight, 10 percent or more for diagonal or patterned installs, and 10 to 15 percent for tile depending on layout, tile size, and the number of cuts. Add the waste to your net square footage, then round up to whole cartons."
      },
      {
        "q": "How many square feet does a gallon of paint cover?",
        "a": "About 350 to 400 square feet per gallon per coat on smooth, sealed drywall. Rough, porous, or bare surfaces absorb more, so figure 250 to 300 square feet and plan on two coats. Remember you are calculating wall area (perimeter times ceiling height minus large openings), not floor area."
      },
      {
        "q": "Does a garage or unfinished basement count in a house's square footage?",
        "a": "Not in the finished living area under the standard appraisers use, which counts only heated, finished space with adequate ceiling height. Garages, unfinished basements, and attics are excluded. Measure them separately for your scope of work and keep that figure distinct from the official living-area number."
      }
    ],
    "related": [
      {
        "href": "/tools/square-footage-calculator",
        "label": "Square Footage Calculator"
      }
    ]
  },
  {
    "slug": "how-much-paint-do-i-need",
    "title": "How Much Paint Do I Need? A Contractor's Method",
    "description": "Learn how much paint you need with a step-by-step takeoff method, real coverage rates, waste percentages, and unit conversions for any room or whole house.",
    "keywords": [
      "how much paint do I need",
      "paint coverage per gallon",
      "paint estimating",
      "wall paint calculation",
      "interior paint takeoff",
      "gallons of paint for a room",
      "paint waste percentage",
      "primer coverage rate"
    ],
    "dek": "Guessing on paint quantities is how you end up short a half-gallon at 4 p.m. on a Friday or eating the cost of three unused gallons. This is the method estimators actually use to size a job, from a single bedroom to a full repaint, with the coverage rates, waste factors, and conversions worked out.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "The Core Formula",
        "body": [
          "Every paint estimate comes down to one relationship: paintable square footage divided by coverage rate, multiplied by the number of coats, plus a waste allowance. Get those four inputs right and the rest is arithmetic. The mistakes almost always come from sloppy square footage, an optimistic coverage number, or forgetting that most jobs are two coats, not one.",
          "For walls, paintable area is the wall surface minus the openings you are not painting. For a rectangular room, add the lengths of all four walls to get the perimeter, then multiply by the ceiling height. A 12-by-15 room has a 54-foot perimeter; at an 8-foot ceiling that is 432 square feet of gross wall area before you subtract anything."
        ]
      },
      {
        "heading": "Measuring Paintable Square Footage",
        "body": [
          "Take your gross wall area and subtract openings. The reliable shortcut most estimators use is a flat deduction per opening rather than measuring each one: roughly 20 square feet for a standard door and about 15 square feet for an average window. On the 432-square-foot room above, one door and two windows knock off about 50 square feet, leaving roughly 382 square feet of actual wall to cover.",
          "A common judgment call is whether to deduct at all. On small jobs, many pros skip the deductions entirely and let the openings act as built-in waste allowance, since cutting around frames burns extra paint anyway. On larger jobs, or anything with lots of glass, deduct the openings or you will badly overbuy.",
          "Ceilings are just length times width: that same room is 12 times 15, or 180 square feet. For trim, baseboards, and doors, estimators often size by linear feet or simply carry an extra quart or gallon, because trim coverage is hard to pin down and trim paint comes in smaller cans anyway."
        ]
      },
      {
        "heading": "Coverage Rates and Coats",
        "body": [
          "The industry rule of thumb is that one gallon covers about 350 to 400 square feet in a single coat on a smooth, primed, previously painted surface. Use 350 as your working number for estimating; it builds in a small cushion and reflects real-world application, not the lab figure on the label.",
          "Surface texture and color changes move that number a lot. Bare drywall, raw wood, and rough or textured surfaces drink paint, so drop your coverage to roughly 250 to 300 square feet per gallon on porous substrates. Going from a dark wall to a light color, or covering a bold accent, frequently needs an extra coat regardless of the math. Plan on two finish coats as the default for any color change or new drywall; a single coat is only realistic for a same-color refresh in good condition."
        ]
      },
      {
        "heading": "Working a Full Example",
        "body": [
          "Take the room at 382 square feet of wall, two coats. That is 764 square feet of coverage needed. Divide by 350 and you get about 2.2 gallons. Round up to the next purchasable unit, so 3 gallons, or buy a 2-gallon plus a quart if your supplier sells it that way. Add the 180-square-foot ceiling at two coats: 360 square feet divided by 350 is just over a gallon, so one gallon of ceiling paint, maybe with a quart of cushion.",
          "Now add primer if the surface calls for it, which means new drywall, bare wood, stains, or a heavy color change. Primer covers a bit less, commonly 200 to 350 square feet per gallon, and is usually one coat. For new drywall in this room, figure the same 382 wall square feet at, say, 250 square feet per gallon for about 1.5 gallons of primer, rounded to 2.",
          "For a whole house, do not try to measure every wall on day one. A workable planning shortcut is to take the home's finished floor area and multiply by roughly 2.5 to 4 to approximate total interior wall and ceiling paintable area, with the higher multiplier for homes with high ceilings, lots of hallways, or complex layouts. Use that for a ballpark gallon count, then confirm with real measurements before you order, because the rough multiplier can be off by 15 percent or more on an unusual floor plan."
        ]
      },
      {
        "heading": "Waste, Rounding, and Ordering",
        "body": [
          "Add 5 to 10 percent for waste on top of your calculated quantity to cover roller absorption, spills, touch-ups, and the paint left in the tray and can. Bump that toward 10 to 15 percent on cut-up jobs with lots of corners, closets, and trim transitions, where more paint is lost to the process.",
          "Always round up to whole purchasable units, and lean toward buying one full gallon over from a single batch rather than chasing a quart later. Returning to the store mid-job costs you labor, and a quart bought a week later can be a slightly different mix even in the same color. Keep the leftover, labeled by room, for warranty touch-ups.",
          "When a job has many rooms, the fastest way to kill measurement error is to capture dimensions accurately in the first place. Laser-measuring each room beats a tape and a clipboard, and tools like ProBuildCalc that scan a room with LiDAR and pull wall and ceiling areas straight into a takeoff remove the arithmetic mistakes that throw off a paint order. However you capture them, plug the real numbers into the same formula above: square footage, divided by 350, times coats, plus waste."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much paint do I need for one room?",
        "a": "For an average bedroom with 8-foot ceilings, plan on about 2 gallons for two coats on the walls, plus roughly 1 gallon for the ceiling. Calculate it precisely by taking the wall perimeter times ceiling height, subtracting about 20 square feet per door and 15 per window, dividing by 350 square feet per gallon, multiplying by 2 coats, and adding 10 percent waste."
      },
      {
        "q": "How many square feet does a gallon of paint cover?",
        "a": "Use about 350 square feet per gallon as your estimating number for a smooth, primed surface, even though labels often claim 350 to 400. On bare drywall, raw wood, or rough texture, drop to roughly 250 to 300 square feet per gallon because porous surfaces absorb more."
      },
      {
        "q": "Do I count two coats when estimating paint?",
        "a": "Yes, for almost every job. Two finish coats is the default for any color change or new drywall. Only a same-color refresh on a surface in good condition is a realistic one-coat scenario, and even then most pros budget a little extra for touch-ups."
      },
      {
        "q": "How much extra paint should I buy for waste?",
        "a": "Add 5 to 10 percent on top of your calculated amount for normal jobs, and 10 to 15 percent for rooms with lots of corners, closets, and trim. Then round up to whole gallons and buy from one batch so your color stays consistent if you need more."
      }
    ],
    "related": [
      {
        "href": "/tools/paint-calculator",
        "label": "Paint Calculator"
      }
    ]
  },
  {
    "slug": "how-many-coats-of-paint",
    "title": "How Many Coats of Paint You Need (and When to Prime)",
    "description": "A contractor's guide to how many coats of paint you really need, when priming is mandatory, plus coverage rates, waste factors, and gallon math.",
    "keywords": [
      "how many coats of paint",
      "paint coverage rate",
      "when to prime",
      "primer vs paint and primer in one",
      "paint estimating",
      "square feet per gallon paint",
      "two coats of paint",
      "drywall primer"
    ],
    "dek": "\"Two coats\" is the safe default, but it is not always the right answer, and skipping primer to save a step is how callbacks start. Here is how to decide coats, when priming is non-negotiable, and how to turn wall area into gallons without guessing.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "The short answer: usually two coats",
        "body": [
          "For most repaints over a sound, previously painted surface in a similar color, plan on two finish coats. The first coat does the work of bonding and building film; the second evens out sheen, hides roller lap marks, and delivers the uniform color and durability the label promises. A single coat almost always looks acceptable while wet and disappointing once it dries and the sheen flashes unevenly.",
          "The honest exception is a like-for-like repaint with a premium self-priming paint over a clean, same-color wall in good light. Some of those jobs genuinely cover in one coat. But quoting one coat as standard is a trap: any color shift, sheen change, patching, or marginal lighting pushes you back to two, and you have already priced the job for one.",
          "Three or more coats is a specific situation, not a quality upgrade. You need a third coat for dramatic color changes (deep red, bright yellow, or going light over dark), for spot-primed patches that still telegraph, or when a tinted primer was not used under a saturated color. If you find yourself reaching for a fourth coat, the real fix was almost always a primer or a tinted base you skipped earlier."
        ]
      },
      {
        "heading": "When priming is non-negotiable",
        "body": [
          "Prime bare and porous substrates every time. New drywall needs a dedicated drywall primer (or PVA primer) so the paper and the joint compound absorb topcoat at the same rate; skip it and the mudded seams flash through as dull stripes. Bare wood, raw masonry, fresh plaster, and skim-coated repairs all drink paint unevenly and must be primed or sealed first.",
          "Prime for adhesion and problem-solving, not just porosity. Use a bonding primer over glossy or slick surfaces (old oil paint, trim, tile, laminate) and when going from oil-based to latex. Reach for a stain-blocking primer (shellac- or oil-based) on water stains, smoke, tannin-prone woods like cedar and redwood, marker, and grease that will bleed through latex. After major patching or scraping, spot-prime so the repairs do not flash.",
          "You can usually skip a separate primer on a clean, dull, previously painted wall going color-to-color in the same family, where a quality paint-and-primer product is doing real work. Understand what that label means: paint-and-primer-in-one is a higher-build self-priming paint, not a substitute for a true primer over bare or stained substrates. It saves a step on repaints; it does not seal new drywall or block a water stain. And for big color jumps, tint the primer toward the topcoat (gray-scale bases for deep colors) to cut a coat off the finish."
        ]
      },
      {
        "heading": "Coverage rates and the waste factor",
        "body": [
          "The industry rule of thumb is roughly 350 to 400 square feet per gallon for a finish coat on a smooth, primed surface. Treat the high end as marketing and estimate at about 350 sq ft per gallon for your first coat. Texture and porosity eat coverage fast: knockdown or orange-peel drywall, raw wood, and rough masonry can drop you to 200 to 300 sq ft per gallon, and heavily textured or split-face block can fall below that.",
          "Coats are not equal. The first coat over primer or bare substrate covers less because the surface is still thirsty; the second coat goes on at or above the rated rate because it is covering paint, not soaking in. A practical shortcut for a two-coat job on typical walls is to estimate the total at about 175 to 200 sq ft per gallon of finished, two-coat area, which already blends the two rates.",
          "Add a waste factor of about 10 percent for normal work and 15 percent or more for cut-heavy rooms, sprayer overspray, dark colors, or rough texture. Spraying wastes materially more than rolling. Always round up to whole gallons for color consistency, since a fresh machine-tint between cans can vary slightly, and keep the leftover labeled for touch-ups."
        ]
      },
      {
        "heading": "Working the math: a real example",
        "body": [
          "Start with paintable wall area, not floor area. For a rectangular room, add the wall lengths to get the perimeter, multiply by ceiling height, then subtract openings. A 12 by 14 foot room with 9-foot ceilings has a 52-foot perimeter, so 52 times 9 equals 468 sq ft of gross wall. Subtract a standard door at about 21 sq ft and two windows at roughly 15 sq ft each (about 51 sq ft total) and you are at roughly 417 sq ft of net wall to paint.",
          "Now apply coats and waste. Two coats means 417 times 2 equals 834 sq ft of coverage. At 350 sq ft per gallon that is about 2.4 gallons; add 10 percent waste to reach about 2.6 gallons, so you buy 3 gallons (or a 5-gallon pail if you are also doing the ceiling or adjacent rooms in the same color). Price the labor on two coats from the start and note primer separately if the substrate calls for it.",
          "Estimating a whole house this way by hand is slow and error-prone once you account for sloped ceilings, soffits, and dozens of openings. This is where LiDAR scanning earns its keep: ProBuildCalc captures room dimensions from a phone scan and rolls wall area, openings, coats, and a waste percentage into a material count, so the takeoff above takes seconds instead of a clipboard and a calculator. Whatever tool you use, the discipline is the same: net area, times coats, plus waste, rounded up to whole gallons."
        ]
      },
      {
        "heading": "Field practices that save a coat",
        "body": [
          "Most one-extra-coat jobs trace back to skipped prep. Wash off grease and dust, dull glossy surfaces so the topcoat can grip, and fill and sand before you paint, not after the first coat exposes every flaw. A surface that is clean, dull, and uniform in porosity is a surface that covers in the coats you planned for.",
          "Control color and sheen to avoid surprises. Going light over dark, or covering a strong accent wall, costs coats unless you tint the primer toward the finish color first. Higher-sheen finishes show roller marks and flashing more than flat or matte, so they reward careful, consistent application and a full second coat. Keep a wet edge, maintain consistent film thickness, and do not overspread the first coat trying to stretch a gallon, because thin coats hide poorly and you pay for it with a third pass.",
          "Respect recoat windows and conditions. Let each coat dry to the manufacturer's recoat time before the next, and remember that cold or humid conditions extend that. Recoating too early can lift the first coat or trap solvent and ruin the finish. Build the job around two solid coats applied at full rate, and the third coat becomes the exception you charge for, not the rescue you eat."
        ]
      }
    ],
    "faq": [
      {
        "q": "Do I really need two coats of paint, or can I get away with one?",
        "a": "For a professional result, plan on two coats over almost any surface. One coat can look fine over a clean, same-color wall with a premium self-priming paint, but any color change, sheen change, patching, or uneven lighting will flash and force a second coat anyway. Quote two coats so you are not redoing work for free."
      },
      {
        "q": "Is paint-and-primer-in-one good enough to skip a separate primer?",
        "a": "Sometimes. Paint-and-primer products are higher-build self-priming paints that work well on clean, previously painted, sound surfaces. They are not a substitute for a true primer on bare drywall, raw wood, masonry, glossy surfaces, or over stains. For those, use a dedicated drywall, bonding, or stain-blocking primer first."
      },
      {
        "q": "How many square feet does a gallon of paint cover?",
        "a": "Roughly 350 to 400 sq ft per gallon on a smooth, primed surface for a finish coat. Estimate at about 350 to be safe, and expect 200 to 300 on rough or porous surfaces like texture, raw wood, or masonry. The first coat covers less than the second because the surface is still absorbing."
      },
      {
        "q": "How much extra paint should I buy for waste?",
        "a": "Add about 10 percent for normal rolling work and 15 percent or more for cut-heavy rooms, dark colors, rough texture, or spraying, which wastes the most. Always round up to whole gallons so machine-tinted color stays consistent between cans, and keep the labeled leftover for touch-ups."
      }
    ],
    "related": [
      {
        "href": "/tools/paint-calculator",
        "label": "Paint Calculator"
      }
    ]
  },
  {
    "slug": "how-to-estimate-drywall",
    "title": "How to Estimate Drywall: Sheets, Screws, Mud, Tape",
    "description": "A contractor's method for estimating drywall: calculate sheets, screws, joint compound, and tape per room with real coverage rates and waste factors.",
    "keywords": [
      "how to estimate drywall",
      "drywall takeoff",
      "drywall sheets calculator",
      "joint compound coverage",
      "drywall screws per sheet",
      "drywall waste factor",
      "drywall mud and tape estimate",
      "drywall material list"
    ],
    "dek": "Estimating drywall is just area math plus a few reliable coverage rates. This walks through the full takeoff for a single room, with the rules of thumb pros actually use for sheets, fasteners, compound, and tape.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "Start with gross square footage, not net",
        "body": [
          "Drywall estimating begins with one number: total surface area to be covered. Measure each wall (length times height) and the ceiling (length times width), then add them together. For a 12 by 14 foot room with 8 foot walls, the four walls give a 52 foot perimeter times 8 feet, or 416 square feet, and the ceiling adds 168 square feet. That is 584 square feet gross.",
          "Here is the part beginners get wrong: estimate sheets off the gross figure, not the net. It is tempting to subtract every door and window opening, but full sheets get hung over most openings and the cutouts are made afterward, so that material is consumed whether or not the opening is finished. Only deduct large openings such as a wide passage, a fireplace, or a full sliding door wall. For the sample room, a standard door and two windows total about 45 square feet, which brings net coverage to roughly 539 square feet, but the order should still be built on the 584.",
          "Track ceilings separately from walls in your notes. Ceilings often call for a different board, such as 5/8 inch for sag resistance or sound rating, and they drive higher screw and compound counts because of tighter fastener spacing and more overhead waste."
        ]
      },
      {
        "heading": "Convert area to sheets and pick a size",
        "body": [
          "A 4 by 8 foot sheet covers 32 square feet; a 4 by 12 covers 48. Divide your gross area by the sheet coverage, then round up. The sample room at 584 square feet works out to about 18.25 sheets of 4 by 8, or about 12.2 sheets of 4 by 12 before waste.",
          "Then add a waste factor. Ten percent is the standard allowance for a simple rectangular room; bump it to 15 percent for rooms with lots of corners, angles, small closets, or many openings, where offcuts pile up fast. Applying 10 to 15 percent to the sample room lands at 21 sheets of 4 by 8, or 14 sheets of 4 by 12.",
          "Longer sheets are usually the better buy when access and crew allow. Twelve foot board produces fewer butt joints, which are the hardest seams to finish flat, and that means less taping labor and less compound. The trade-off is weight and maneuverability, especially up stairs or in tight remodels, so match sheet length to the room and the crew, not just to the math."
        ]
      },
      {
        "heading": "Screws: count per sheet and check by weight",
        "body": [
          "The fast field method is to estimate screws per sheet. On walls framed 16 inches on center with roughly 12 inch field spacing, a 4 by 8 sheet takes about 28 to 36 screws; call it 32 for planning. Ceilings run tighter, often 8 to 12 inch spacing, so add a few per sheet there. For the 21 sheet sample room, about 32 per sheet comes to roughly 670 screws.",
          "Cross-check by weight, since that is how fasteners are sold. A rough rule is one pound of drywall screws per 100 to 125 square feet of board. The sample room at 584 square feet needs about 5 to 6 pounds. Buy 1-1/4 inch screws for half-inch board on wood and 1-5/8 inch for 5/8 inch board or two-layer work.",
          "Always round up to whole boxes and keep extra on hand. Screws are cheap, stripped or overdriven fasteners get replaced constantly, and running short mid-hang stalls the whole crew."
        ]
      },
      {
        "heading": "Joint compound and tape",
        "body": [
          "For taping plus a typical three-coat finish applied by hand, plan on roughly 0.12 to 0.14 pounds of all-purpose compound per square foot of board. The sample room at 584 square feet needs about 70 to 82 pounds. A standard 4.5 gallon box of ready-mix weighs around 61 to 62 pounds, so that room takes a little over one box; order two. A practical shortcut is about one box of compound per 16 to 18 sheets of 4 by 8.",
          "Compound usage swings with method and finish level. Automatic taping tools and setting-type hot mud can cut waste, while a level 5 skim coat across the whole surface adds a noticeable amount over the per-square-foot figure above. Adjust your rate once you know your own crew's habits.",
          "For paper tape, figure roughly 40 linear feet per 100 square feet of board, which covers both seams and inside corners. The sample room needs about 234 feet, so a single 250 foot roll does it with margin, though most jobs warrant buying 500 foot rolls to avoid splices. If you use metal or paper-faced corner bead, count those outside corners separately by the piece, by length."
        ]
      },
      {
        "heading": "Build the material list and pad for reality",
        "body": [
          "Pull it together into one room list. For the 12 by 14 example: 21 sheets of 4 by 8 (or 14 of 4 by 12), about 5 to 6 pounds of screws, two boxes of all-purpose compound, and one to two rolls of paper tape, plus corner bead by the corner. Repeat per room, then sum the whole job and round each material up to full purchase units.",
          "Two more line items people forget: a few sheets of attic-stock overage beyond your waste factor for future repairs, and consumables like sanding screens, mud pans, and knives that wear out. None of that changes the core area math, but it keeps a job from stalling over a four dollar item.",
          "Where the takeoff actually eats time is the measuring, especially in occupied remodels with offsets and out-of-square walls. Scanning the room with a LiDAR takeoff tool such as ProBuildCalc captures wall and ceiling areas directly so you can drop them into the formulas above instead of taping out every surface by hand. However you get the numbers, the discipline is the same: measure gross area, divide by sheet coverage, add waste, then apply per-square-foot rates for screws, compound, and tape."
        ]
      }
    ],
    "faq": [
      {
        "q": "Should I subtract windows and doors when estimating drywall sheets?",
        "a": "Generally no. Full sheets are hung over most openings and the cutouts are made afterward, so that board is still used. Estimate sheet counts from gross wall and ceiling area, and only deduct unusually large openings like a wide passage, a fireplace, or a full glass-door wall."
      },
      {
        "q": "How much drywall waste should I add?",
        "a": "Use about 10 percent for a simple rectangular room and 15 percent for rooms with many corners, angles, closets, or openings, where offcuts add up. High-end work or unusual layouts can justify slightly more. Round the final sheet count up to whole sheets."
      },
      {
        "q": "How many screws and how much mud does a sheet of drywall need?",
        "a": "A 4 by 8 wall sheet takes roughly 28 to 36 screws (about 32 for planning), and ceilings take a few more due to tighter spacing. For compound, plan one 4.5 gallon box of all-purpose mud per about 16 to 18 sheets for taping and a three-coat finish, then adjust to your crew's method."
      },
      {
        "q": "How much joint tape do I need for a room?",
        "a": "Estimate roughly 40 linear feet of paper tape per 100 square feet of board, which covers both flat seams and inside corners. A 12 by 14 foot room needs about 234 feet, so one 250 foot roll works, though buying 500 foot rolls avoids mid-job splices. Count outside-corner bead separately by the piece."
      }
    ],
    "related": [
      {
        "href": "/tools/drywall-calculator",
        "label": "Drywall Calculator"
      }
    ]
  },
  {
    "slug": "drywall-installation-cost-guide",
    "title": "Drywall Installation Cost: A Contractor's Bidding Guide",
    "description": "A practical drywall installation cost breakdown for contractors and serious DIYers: coverage rates, waste factors, labor, and a step-by-step bidding method.",
    "keywords": [
      "drywall installation cost",
      "drywall bid",
      "drywall estimating",
      "sheetrock cost per square foot",
      "drywall material takeoff",
      "drywall labor cost",
      "hang and finish drywall",
      "drywall waste factor"
    ],
    "dek": "Drywall is one of the most predictable trades to estimate once you know the coverage math and where the labor hides. This guide breaks down what actually drives drywall installation cost and walks through a repeatable way to build a bid that protects your margin.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "What drives drywall installation cost",
        "body": [
          "Drywall installation cost is usually quoted per square foot of finished surface, and that single number bundles together several distinct line items: board, fasteners, joint compound and tape, corner bead, labor to hang, labor to finish, sanding, and cleanup. When bids vary widely between contractors, it is almost always the finish level and the labor assumptions driving the spread, not the board itself. Material is the smaller half of the job on most interior work.",
          "As a rough planning figure, installed drywall on a standard interior project often falls somewhere in the approximate range of 2 to 4 dollars per square foot of surface area for hang and finish combined, with higher numbers on tall walls, heavy textures, high ceilings, fire-rated assemblies, or premium Level 5 finishes. Treat that range as approximate and regional. Material typically runs a smaller portion of the total, with labor making up the majority, because finishing is slow, skilled, multi-day work.",
          "The biggest cost lever is the finish level. The industry recognizes Levels 0 through 5. Level 4 is the common standard for walls that get paint or light texture. Level 5 adds a skim coat over the entire surface and is required for gloss paints, critical lighting, and high-end work. Moving from Level 4 to Level 5 can add meaningfully to the finishing labor and compound because you are coating the whole surface rather than just the joints and fasteners."
        ]
      },
      {
        "heading": "Calculate the material takeoff",
        "body": [
          "Start by measuring the surface area, not the floor area. Add up wall area (perimeter times ceiling height) plus ceiling area for every room in scope. The standard sheet is 4 by 8 feet, which covers 32 square feet; a 4 by 12 sheet covers 48 square feet. To get a raw board count, divide total surface area by the coverage of the sheet you plan to use. Longer sheets reduce the number of butt joints, which speeds finishing and improves quality, so most pros prefer 12-foot board on long walls and ceilings.",
          "Add a waste factor. For simple, square rooms, 10 percent is a reasonable allowance. For rooms with lots of windows, doors, angles, soffits, or small cuts, 12 to 15 percent is safer. Do not subtract small openings like standard doors and windows when buying board; the offcuts rarely return usable full pieces, and counting them as coverage leads to short orders. Subtract only large openings such as garage doors or open stairwells.",
          "Now the consumables, using common industry rules of thumb. Screws: plan for roughly one pound of drywall screws per 200 to 300 square feet on walls with framing at 16 inches on center. Joint compound and tape: a common planning figure is about one gallon of ready-mixed compound and roughly 40 feet of tape per 100 to 150 square feet of board for a standard taped finish, more if you are texturing or running Level 5. Add corner bead by the linear foot for every outside corner, and do not forget fasteners for the bead, setting-type compound for the first coat if you use it, and sanding consumables."
        ]
      },
      {
        "heading": "Estimate the labor",
        "body": [
          "Labor is where bids are won, lost, and blown. Break it into hang and finish, because the two phases move at very different speeds. A reasonable planning rate for hanging is on the order of 35 to 50 sheets per crew-day for a two-person crew on straightforward work, slower for ceilings, tall walls, and cut-up rooms. Finishing is slower and spread across multiple days because each coat of compound has to dry before the next: tape coat, fill coat, finish coat, then sand. Three coats is standard for a Level 4 finish.",
          "Convert your sheet count and surface area into crew-hours, then multiply by your fully burdened labor rate, not just the wage. Burden includes payroll taxes, workers compensation, liability insurance, and any benefits, and it commonly adds a significant percentage on top of the base wage. Estimators who bid against the raw hourly wage consistently underprice the job. Add discrete time for non-production tasks that are easy to forget: stocking and distributing board, protecting floors and finished surfaces, setup and daily cleanup, and final debris haul-off.",
          "Site conditions change the labor multiplier more than people expect. Ceilings over 9 feet, stairwells, scaffolding, occupied spaces requiring dust control, cathedral ceilings, and detailed soffit or archway work all slow a crew down. Build those conditions into the rate or add a line item; do not bury them and hope. A clean takeoff feeds better labor numbers, and scanning a room to capture wall and ceiling dimensions with a tool like ProBuildCalc can speed the measure-up and reduce the count errors that quietly erode margin on a fixed-price bid."
        ]
      },
      {
        "heading": "Assemble the bid",
        "body": [
          "Build the estimate bottom-up so you can defend every number: material with waste, consumables, hang labor, finish labor, equipment such as lifts and scaffold rental, dust protection and floor covering, dumpster or haul-off, and any subcontracted texture or specialty work. Sum those to your direct cost. Then apply overhead and profit on top. Overhead and profit are not the same thing, and folding them into one fuzzy markup is how shops slowly go broke while staying busy.",
          "Write the scope and exclusions in plain language so there is no argument later. State the finish level you priced, who supplies and stocks the board, whether you are removing existing drywall, how you are handling texture and primer, and what is excluded such as painting, electrical and plumbing rough-in coordination, and patching after other trades. Note your assumptions about access, working hours, and that the structure is square and ready. Ambiguity on the proposal becomes a change order argument on site.",
          "Finally, sanity-check the bottom line against your installed-cost-per-square-foot history for similar jobs. If your detailed buildup lands far outside your normal range, find out why before you send it: you either missed scope, mispriced labor, or you are about to leave money on the table. Keeping actuals from past jobs and comparing them to your estimates is the single most effective way to make the next bid more accurate."
        ]
      }
    ],
    "faq": [
      {
        "q": "How many drywall sheets do I need for a room?",
        "a": "Add up wall area (wall perimeter times ceiling height) plus ceiling area to get total surface square footage, then divide by the coverage of your sheet: 32 square feet for a 4-by-8 and 48 square feet for a 4-by-12. Add 10 percent waste for simple square rooms and 12 to 15 percent for cut-up rooms with many openings and angles. Do not deduct standard doors and windows, since the offcuts rarely yield usable full pieces."
      },
      {
        "q": "Is drywall installation cost mostly material or labor?",
        "a": "On most interior jobs, labor is the larger share. Board and consumables are relatively cheap and predictable, but hanging and especially finishing are skilled, multi-day tasks because each coat of joint compound must dry before the next. The finish level you price, your fully burdened labor rate, and site conditions like tall ceilings drive the total far more than the cost of the board."
      },
      {
        "q": "What is the difference between a Level 4 and Level 5 drywall finish?",
        "a": "Level 4 finishes the joints, fasteners, and corners with tape and three coats of compound and is the common standard for surfaces getting paint or light texture. Level 5 adds a skim coat over the entire surface, which is required for gloss paints and areas with critical or raking light. Level 5 increases finishing labor and compound noticeably because the whole surface is coated, not just the seams."
      },
      {
        "q": "How much waste should I add to a drywall estimate?",
        "a": "Use about 10 percent for simple, square rooms with few openings. Bump it to roughly 12 to 15 percent for rooms with many windows, doors, angles, soffits, or short walls that generate small cuts. The waste factor accounts for offcuts and damaged board, and underestimating it is a common cause of short orders and an extra supply run mid-job."
      }
    ],
    "related": [
      {
        "href": "/tools/drywall-calculator",
        "label": "Drywall Calculator"
      }
    ]
  },
  {
    "slug": "how-to-calculate-concrete-for-a-slab",
    "title": "How to Calculate Concrete for a Slab: Yards and Bags",
    "description": "Learn how to calculate concrete for a slab in cubic yards and bags. Real formulas, coverage rates, waste factors, and unit conversions for contractors.",
    "keywords": [
      "how to calculate concrete",
      "concrete cubic yards",
      "concrete for a slab",
      "concrete bags calculator",
      "cubic yards of concrete",
      "concrete waste factor",
      "slab concrete estimate",
      "concrete coverage rate"
    ],
    "dek": "Ordering concrete is one of the few estimating mistakes you cannot walk back once the truck is pouring. Here is the exact method for converting slab dimensions into cubic yards and bags, plus the rules of thumb and waste factors that keep you from coming up short.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "The core formula: everything is cubic feet first",
        "body": [
          "Concrete volume is just length times width times thickness, with every dimension in the same unit. The trick that trips people up is thickness, which is almost always in inches while the slab is measured in feet. Convert thickness to feet by dividing inches by 12 before you multiply. A 4-inch slab is 0.333 feet thick, a 5-inch slab is 0.417 feet, and a 6-inch slab is 0.5 feet.",
          "So the working formula is: length (ft) times width (ft) times thickness (ft) equals cubic feet. Then convert cubic feet to cubic yards by dividing by 27, because a cubic yard is a 3-by-3-by-3-foot block, which is 27 cubic feet. That single number, 27, is the conversion you will use on every concrete order for the rest of your career.",
          "Worked example: a 20 by 24 foot slab at 4 inches. That is 20 times 24 times 0.333, which equals 160 cubic feet. Divide by 27 and you get 5.93 cubic yards of neat concrete before any waste allowance."
        ]
      },
      {
        "heading": "Coverage rules of thumb for fast field checks",
        "body": [
          "When you do not have a calculator handy, memorize the square-feet-per-cubic-yard figures. One cubic yard covers about 81 square feet at 4 inches thick, about 65 square feet at 5 inches, and about 54 square feet at 6 inches. To sanity-check the example above, divide 480 square feet by 81 and you land right back at roughly 5.9 yards.",
          "These coverage numbers are the fastest way to catch a decimal-point error before you call the dispatcher. If your detailed takeoff says a 480 square foot patio needs 12 yards, the rule of thumb tells you instantly that something is wrong, because 480 divided by 81 is nowhere near 12.",
          "For thickened edges, footings, and turn-downs, calculate those separately and add them in. A monolithic slab with a 12 by 12 inch thickened perimeter can easily carry one to two extra yards that a flat-area calculation misses entirely."
        ]
      },
      {
        "heading": "Add a waste factor before you order",
        "body": [
          "Never order your exact calculated volume. Subgrade is never perfectly level, forms bow slightly, and you will spill and over-fill. For a standard slab on grade, add 5 to 10 percent. Use the low end on a tightly formed slab over a clean, screeded base, and the high end on rough subgrade, hand-dug footings, or anything with irregular depth.",
          "Applying 10 percent to the 5.93-yard example gives 6.52 yards. In practice you would order 6.5 or even 7 yards, because most ready-mix suppliers sell in quarter-yard increments and running short means a costly second truck, a cold joint, and a short-load fee. Being a quarter yard over is cheap insurance; being a quarter yard under can ruin the pour.",
          "One regional note on cost: ready-mix is typically sold by the yard and pricing varies widely by market, fuel surcharges, and minimum-load fees, so treat any per-yard figure you see as approximate and get a current local quote before bidding."
        ]
      },
      {
        "heading": "When to use bags instead of ready-mix",
        "body": [
          "For small pours, fence-post footings, equipment pads, and repairs, bagged concrete is often more practical than meeting a ready-mix minimum. You size bags by volume yield, not by weight. A standard 80-pound bag yields about 0.60 cubic feet, a 60-pound bag yields about 0.45 cubic feet, and a 40-pound bag yields roughly 0.30 cubic feet.",
          "To get bag count, divide your total cubic feet by the bag's yield. The 160-cubic-foot example slab would need about 267 eighty-pound bags or about 356 sixty-pound bags, which is exactly why nobody hand-mixes a 480 square foot slab. As a reference, it takes about 45 eighty-pound bags or about 60 sixty-pound bags to equal a single cubic yard.",
          "The practical crossover is usually around one cubic yard. Below that, bags win on convenience and no truck minimum. Above it, the labor of mixing and the inconsistency between batches make ready-mix the clear choice."
        ]
      },
      {
        "heading": "Don't forget columns, footings, and odd shapes",
        "body": [
          "Slabs are rectangles, but pours rarely are. For round footings and column piers, volume is pi times radius squared times height, all in feet. A 12-inch-diameter sonotube poured 4 feet deep holds about 3.14 cubic feet, or roughly 0.12 cubic yards each, so a deck with a dozen of those piers adds about 1.4 yards you must account for separately.",
          "Break any complex pour into simple shapes, calculate each in cubic feet, sum them, then convert the total to yards and apply your waste factor once at the end. Mixing units mid-calculation is the most common source of ordering errors, so keep everything in cubic feet until the final divide-by-27.",
          "This is also where measurement accuracy earns its keep. Field-measuring an irregular slab or a stepped footing with a tape invites small errors that compound across a takeoff. A LiDAR scan of the formed area with an app like ProBuildCalc captures real dimensions and feeds the volume math directly, which tightens the order on jobs where the geometry is anything but a clean rectangle."
        ]
      }
    ],
    "faq": [
      {
        "q": "How many cubic yards of concrete do I need for a slab?",
        "a": "Multiply length in feet by width in feet by thickness in feet (inches divided by 12), then divide by 27. For a 20 by 24 foot slab at 4 inches, that is 160 cubic feet divided by 27, or 5.93 cubic yards before waste. Add 5 to 10 percent and order about 6.5 yards."
      },
      {
        "q": "How many bags of concrete are in a cubic yard?",
        "a": "It takes about 45 eighty-pound bags or about 60 sixty-pound bags to make one cubic yard, based on yields of roughly 0.60 and 0.45 cubic feet per bag. Bagged concrete usually only makes sense below about one cubic yard; above that, ready-mix is faster and more consistent."
      },
      {
        "q": "How much waste should I add when ordering concrete?",
        "a": "Add 5 to 10 percent for a slab on grade. Use the low end for tightly formed slabs over a clean, level base and the high end for rough subgrade or hand-dug footings. Running short triggers a second truck, a cold joint, and short-load fees, so rounding up is cheap insurance."
      },
      {
        "q": "How do I calculate concrete for footings and round piers?",
        "a": "Calculate footings and turn-downs as separate rectangular volumes and add them to the slab. For round piers, use pi times radius squared times height in feet. A 12-inch-diameter tube poured 4 feet deep is about 0.12 cubic yards, so multiply by your pier count and add it to the total."
      }
    ],
    "related": [
      {
        "href": "/tools/concrete-calculator",
        "label": "Concrete Calculator"
      }
    ]
  },
  {
    "slug": "how-to-estimate-roofing-shingles",
    "title": "How to Estimate Shingles: Squares, Bundles, and Waste",
    "description": "Learn how to estimate shingles step by step: measure roof area, convert to squares, count bundles, add waste, and account for starter, ridge, and accessories.",
    "keywords": [
      "how to estimate shingles",
      "roofing squares",
      "shingle bundles per square",
      "roof measurement",
      "roofing waste factor",
      "roof pitch multiplier",
      "shingle takeoff",
      "estimate roofing materials"
    ],
    "dek": "Estimating shingles comes down to four things: getting accurate roof measurements, converting that area into squares, translating squares into bundles, and adding the right waste and accessory materials. Here is the working method estimators actually use, with the rules of thumb and conversions you need on the job.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "The units: squares, bundles, and coverage",
        "body": [
          "Roofing is measured and sold in squares. One square equals 100 square feet of roof surface, regardless of how that area is shaped. Every step of a shingle estimate eventually gets expressed in squares, so get comfortable thinking in them.",
          "Standard architectural (laminated) shingles are packaged so that three bundles cover one square. That means each bundle covers roughly 33.3 square feet. Heavier designer or premium shingles sometimes run four or even five bundles per square, and some basic three-tab products are also three bundles per square, so always confirm the coverage printed on the wrapper before you order. A common cross-check: one square of architectural shingles weighs in the neighborhood of 65 to 80 pounds per bundle, or roughly 200 to 240 pounds per square, which matters for loading a roof and for dumpster sizing on a tear-off.",
          "The short version of the math: total roof area in square feet, divided by 100, equals squares. Squares multiplied by bundles-per-square equals field bundles before waste."
        ]
      },
      {
        "heading": "Step 1: Measure the roof area",
        "body": [
          "You have two reliable paths. The first is measuring on the roof itself: break the roof into rectangles and triangles, measure each plane's length and width, and compute area plane by plane. Rectangle area is length times width; triangle area is one-half base times height. Add the planes together for total surface area. This is the most accurate method because it captures the real surface, including the pitch.",
          "The second path is measuring the building footprint from the ground (or from plans) and then correcting for slope, which is covered in the next step. This is faster and safer, and it is how most quick takeoffs start, but it is only as good as your pitch measurement. Modern phones with LiDAR sensors can also capture roof planes and pull dimensions automatically; a tool like ProBuildCalc lets you scan and generate a plane-by-plane area takeoff so you are not chasing every measurement by hand or guessing on a steep roof.",
          "Whichever path you use, sketch the roof and label every plane. A clean diagram is what keeps a hip-and-valley roof from turning into a guessing game, and it is your backup when the order shows up short."
        ]
      },
      {
        "heading": "Step 2: Correct for roof pitch",
        "body": [
          "Footprint area is not roof area. A sloped roof covers more surface than the flat space beneath it, and ignoring that is the most common way estimates come up short. Pitch is expressed as rise over run, in inches of vertical rise per 12 inches of horizontal run, such as 6/12.",
          "To convert flat (plan) area to actual roof area, multiply by a pitch multiplier. Common values: a 4/12 pitch uses about 1.054, a 6/12 uses about 1.118, an 8/12 uses about 1.202, a 10/12 uses about 1.302, and a 12/12 (45 degrees) uses about 1.414. So a 2,000 square foot footprint at 6/12 is roughly 2,000 times 1.118, or about 2,236 square feet of roof surface. The multiplier comes from the geometry of the slope, so you can compute it for any pitch as the square root of (rise squared plus run squared) divided by the run.",
          "If you measured directly on the roof plane by plane in Step 1, you have already captured the pitch and should not apply a multiplier again. Apply it only to footprint or plan dimensions."
        ]
      },
      {
        "heading": "Step 3: Convert area to squares and bundles",
        "body": [
          "Take your corrected roof area and divide by 100 to get squares. Using the example above, about 2,236 square feet is roughly 22.36 squares. Then multiply squares by your shingle's bundles-per-square. At three bundles per square, 22.36 squares is about 67 field bundles before any waste.",
          "Keep field shingles separate from accessory materials in your takeoff. The field number above covers the main roof surface only. Starter strip, hip and ridge caps, underlayment, and fasteners are calculated on their own, which is the next step. Mixing them together is how crews end up short on caps even when the field count was right."
        ]
      },
      {
        "heading": "Step 4: Add a waste factor",
        "body": [
          "Waste covers cutting, trimming at edges, starter and cap creation if you are cutting them from field shingles, breakage, and the off-cuts at hips and valleys. The standard rule of thumb is to add about 10 percent for a simple gable roof with few penetrations. For a moderately complex roof with hips, valleys, dormers, or several penetrations, plan on roughly 12 to 15 percent. For cut-up, steep, or heavily valleyed roofs, 15 percent or more is reasonable.",
          "Apply waste to the field square count, then re-derive bundles. Continuing the example: 22.36 squares at 10 percent waste is about 24.6 squares, which at three bundles per square is about 74 bundles. Round up to whole bundles, and round up to whole squares when ordering bundled material. It is far cheaper to return or stock one extra bundle than to stop a crew waiting on a single short bundle, so when in doubt, round up.",
          "A note on valleys: closed-cut and woven valleys consume extra shingle in the lap, which the waste percentage is meant to absorb. If a roof is dominated by long valleys, lean toward the higher end of the range rather than the bare 10 percent."
        ]
      },
      {
        "heading": "Step 5: Starter, ridge cap, and the rest of the takeoff",
        "body": [
          "Starter strip runs along all eaves and usually the rakes as well. Measure the total linear feet of eaves and rakes. Dedicated starter product typically lists its linear-foot coverage per bundle on the wrapper; divide your linear footage by that coverage to get bundles. If you are cutting starter from three-tab or field shingles instead, fold that consumption into your waste factor rather than double-counting.",
          "Hip and ridge caps run along every ridge and hip line. Measure total linear feet of ridges and hips. Pre-formed cap product commonly covers somewhere around 20 to 30 linear feet per bundle depending on the product and exposure, so confirm the wrapper and divide your linear footage accordingly. If you are cutting caps from architectural shingles, a square of field shingle yields a meaningful run of caps, but again, the cleanest practice is to count cap separately when you can.",
          "Round out the takeoff with the supporting materials so nothing stalls the job: underlayment (synthetic or felt) sized to the same roof area plus overlap, ice-and-water shield at eaves, valleys, and penetrations per local code, drip edge in linear feet around eaves and rakes, roofing nails (a rough planning figure is on the order of two to four pounds of nails per square depending on nail length and nailing pattern), plus pipe boots, step and counter flashing, and ridge vent as the roof requires. Pricing on all of this varies by region and over time, so treat any dollar figure as an approximate, regional estimate and confirm current local pricing before you quote."
        ]
      }
    ],
    "faq": [
      {
        "q": "How many bundles of shingles are in a square?",
        "a": "Most architectural (laminated) shingles come three bundles to a square, so each bundle covers about 33.3 square feet. Some heavier designer shingles run four or five bundles per square. Always confirm the coverage printed on the wrapper, because it varies by product."
      },
      {
        "q": "What is a roofing square?",
        "a": "A square is 100 square feet of roof surface. Roofing materials are estimated and sold in squares, so the core of any shingle estimate is converting your total roof area in square feet to squares by dividing by 100."
      },
      {
        "q": "How much waste should I add when estimating shingles?",
        "a": "Add about 10 percent for a simple gable roof, 12 to 15 percent for a moderately complex roof with hips, valleys, or dormers, and 15 percent or more for steep, cut-up roofs with many valleys. Apply the waste to your field square count, then round bundles up."
      },
      {
        "q": "How do I convert roof footprint to actual roof area?",
        "a": "Multiply the flat footprint area by a pitch multiplier. For example, 4/12 is about 1.054, 6/12 about 1.118, 8/12 about 1.202, and 12/12 about 1.414. Only apply the multiplier to footprint or plan dimensions, not to areas you measured directly on the sloped roof plane."
      }
    ],
    "related": [
      {
        "href": "/tools/roofing-calculator",
        "label": "Roofing Calculator"
      }
    ]
  },
  {
    "slug": "how-to-estimate-a-deck-build",
    "title": "How to Estimate a Deck: Materials Takeoff Guide",
    "description": "A contractor's step-by-step method to estimate a deck: framing, joist spacing, decking, fasteners, footings, and realistic waste percentages.",
    "keywords": [
      "how to estimate a deck",
      "deck material takeoff",
      "deck framing estimate",
      "decking board calculation",
      "joist spacing",
      "deck waste factor",
      "deck footing count",
      "deck fastener estimate"
    ],
    "dek": "Estimating a deck comes down to breaking it into framing, surface, fasteners, and footings, then applying consistent spacing rules and waste factors. This guide walks the full takeoff in the order a working estimator actually does it.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "Start with the deck dimensions and a sketch",
        "body": [
          "Before counting a single board, nail down the footprint, the height off grade, and the framing direction. A simple example used throughout this article is a 12-foot by 16-foot rectangular deck, 192 square feet, with decking boards running the 16-foot direction so joists run the 12-foot direction. Write down which way the decking runs first, because that single decision drives joist count, beam placement, and board count.",
          "Note the attachment method too. A deck ledgered to the house has one fewer beam line than a freestanding deck, which needs a beam and footings on both the house side and the outer side. Height matters because anything roughly 30 inches or more above grade triggers guardrail requirements in most jurisdictions, and taller decks need longer posts and sometimes bracing. Sketch the joist layout, beam lines, post locations, and stair position; the sketch is your bill of materials in visual form.",
          "Always confirm spans against a current span table or the prescriptive deck provisions in the IRC rather than guessing. Lumber species, grade, and on-center spacing all change allowable spans, so the same 2x8 joist might span very different distances depending on what your supplier actually stocks."
        ]
      },
      {
        "heading": "Frame takeoff: ledger, beams, joists, posts",
        "body": [
          "For joists at 16 inches on center, a reliable count is the run length in inches divided by 16, plus 1 for the starting joist, plus 1 more for the end joist that does not fall on a module. For a 16-foot run that is 192 divided by 16 equals 12, plus 2, so 14 joists. Add a doubled rim or end joist where your design calls for it, and add extra joists for any framing under a hot tub or heavy point load. At 12 inches on center the divisor is 12 instead of 16, which adds roughly a third more joists, and 24-inch spacing cuts joists but limits decking choices.",
          "Beams are usually built up from two or three plies of dimensional lumber bolted together, so a built-up double beam spanning 12 feet is two 12-foot members plus through-bolts or structural screws. The ledger board matches the beam material and the deck width along the house, fastened with code-approved ledger screws or through-bolts on a staggered pattern, never deck screws or nails alone. Count posts from your beam and footing layout; a small freestanding deck commonly lands on four to six posts, typically 6x6 for anything carrying real load or standing tall.",
          "Do not forget the connectors. Each joist generally gets a joist hanger, each post gets a post base at the footing and a post cap at the beam, and a freestanding or elevated deck needs hold-downs or tension ties where required. Connectors are cheap relative to the framing but easy to undercount, so tie the hanger count directly to the joist count, the post base and cap counts directly to the post count, and add a box of structural connector nails or screws per fastener type."
        ]
      },
      {
        "heading": "Decking, fasteners, and the waste factor",
        "body": [
          "To count surface boards, divide the deck width by the actual covered width of one board plus the gap. A nominal 5/4x6 or 2x6 board covers about 5.5 inches; with a roughly 1/8 to 3/16 inch gap, call it about 5.6 to 5.7 inches per board. For a 12-foot (144-inch) width that is roughly 26 boards running the 16-foot length. Convert to lineal feet by multiplying board count by board length, so about 26 boards times 16 feet equals roughly 416 lineal feet before waste. You can sanity-check with area: 192 square feet divided by the square-foot coverage of one board works as a cross-check, not a replacement for the board-by-board count.",
          "Apply waste deliberately. A clean rectangular deck with full-length boards runs about 5 to 10 percent waste; angled or diagonal decking, picture-frame borders, or lots of cuts push that to roughly 15 percent, occasionally higher on complex layouts. Framing lumber typically carries about 5 to 10 percent waste for cutoffs and culls. Round every line item up to whole boards and whole stock lengths, and buy decking in lengths that minimize butt joints, since a 16-foot board run with 16-foot stock has zero field splices.",
          "Fasteners scale with decking. Hidden-clip systems generally use about one clip per joist intersection, so clips roughly equal board count times joist count, and most clip systems publish coverage per box. For face screws, a common rule of thumb is about 350 screws per 100 square feet of decking with two screws per joist bearing, so budget accordingly and round up to full boxes. Add screws or nails for stair treads, railing assembly, and blocking separately."
        ]
      },
      {
        "heading": "Footings, concrete, stairs, and railing",
        "body": [
          "Footing count comes straight from your post layout, and size comes from load and local frost depth, which can range from a few inches in warm climates to 42 inches or more in cold regions. To estimate concrete per footing, use the cylinder volume: radius squared times pi times depth. A 12-inch-diameter footing 48 inches deep is about 0.5 radius squared (0.25) times 3.14 times 4 feet, roughly 3.14 cubic feet, and there are 27 cubic feet in a cubic yard. Multiply per-footing volume by footing count, add about 10 percent for over-dig and spillage, then convert to yards or to bags using the yield printed on the bag.",
          "Stairs are their own mini-takeoff. Determine total rise, divide by a target riser height of about 7 to 7.75 inches to get the number of risers, then treads equal risers minus one. Stringers are usually spaced about 12 to 16 inches on center, so a typical 3-foot-wide stair uses three stringers, and tread material equals tread count times stair width times the number of boards per tread. Add a landing pad or footing at the base if your design or code requires one.",
          "Railing is priced by lineal foot of guard, minus stair and house openings, plus posts at the spacing your system allows, commonly around 4 to 6 feet on center. Count balusters from the opening length divided by the maximum allowable gap, which is commonly a 4-inch sphere rule, then add post caps, rail brackets, and hardware. Tally everything into a clean line-item list with quantities and waste already baked in. Field-measuring an existing deck or a complex footprint is where a LiDAR scan helps; ProBuildCalc captures dimensions and generates a material takeoff from the scan, which you can then reconcile against the hand counts above before you order."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much waste should I add when estimating deck materials?",
        "a": "For a simple rectangular deck with full-length boards, add about 5 to 10 percent waste on both decking and framing. For diagonal decking, picture-frame borders, or layouts with many cuts, plan on roughly 15 percent or more. Always round each line item up to whole boards and whole stock lengths."
      },
      {
        "q": "How do I calculate the number of joists for a deck?",
        "a": "Take the run length in inches, divide by the on-center spacing (16 inches is standard), then add 1 for the first joist and 1 more for the end joist. A 16-foot run at 16 inches on center is 192 divided by 16, which is 12, plus 2, so 14 joists. Add joists for doubled rims and any point loads like a hot tub."
      },
      {
        "q": "How many decking boards do I need?",
        "a": "Divide the deck width by one board's covered width plus the gap. A nominal 5.5-inch board with a roughly 1/8-inch gap covers about 5.6 inches, so a 12-foot (144-inch) width needs about 26 boards. Multiply board count by board length for lineal feet, then add your waste factor and round up."
      },
      {
        "q": "How do I estimate concrete for deck footings?",
        "a": "Use the cylinder volume formula: radius squared times pi times depth. A 12-inch-diameter footing 48 inches deep is about 3.14 cubic feet. Multiply by your footing count, add about 10 percent for over-dig and spillage, then convert at 27 cubic feet per cubic yard or use the yield printed on each concrete bag."
      }
    ],
    "related": [
      {
        "href": "/tools/deck-calculator",
        "label": "Deck Calculator"
      }
    ]
  },
  {
    "slug": "how-to-estimate-tile-for-a-bathroom",
    "title": "How to Estimate Tile for a Floor or Bathroom",
    "description": "A contractor's guide to estimating tile: measure square footage, add the right waste percentage by pattern, convert to boxes, and account for thinset and grout.",
    "keywords": [
      "how to estimate tile",
      "tile waste percentage",
      "tile square footage calculator",
      "how much tile do I need",
      "tile estimating for contractors",
      "thinset coverage",
      "grout estimating",
      "tile takeoff"
    ],
    "dek": "Estimating tile is simple arithmetic once you know the rules: get an accurate square footage, add waste based on the layout, then round up to full boxes. The mistakes that cost money are skipping waste, ignoring the actual box coverage printed on the carton, and forgetting that thinset and grout are separate line items. Here is the method estimators actually use.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "Step 1: Measure the area in square feet",
        "body": [
          "For a rectangular floor, multiply length by width in feet. A bathroom that is 8 ft by 5 ft is 40 square feet. For an L-shaped or irregular room, break it into rectangles, calculate each one, and add them together. Measure to the actual wall, not the baseboard, and measure the longest and widest points so you do not come up short on out-of-square rooms.",
          "For wall tile in a shower or backsplash, measure each wall's width by its tiled height and add the walls together. Subtract large openings like a window or a niche only if they are bigger than roughly 5 to 10 square feet; small cutouts are best left in the number because the offcuts around them usually become waste anyway.",
          "Always carry your raw measured number first, then apply waste as a separate step. Keeping the two figures distinct makes it easy to re-check the order and explain it to a client or supplier."
        ]
      },
      {
        "heading": "Step 2: Add the right waste percentage",
        "body": [
          "Waste covers cuts, breakage, future repairs, and the pieces you trim at walls and corners. The standard industry rule of thumb for a straight or grid layout in a simple rectangular room is 10 percent. For a running bond or brick-offset pattern, plan on about 15 percent. For a diagonal layout, herringbone, or other angled pattern, use 15 to 20 percent because every perimeter tile gets a two-sided cut.",
          "Increase waste further for small or busy rooms, lots of jogs and corners (a typical bathroom with a tub, toilet flange, and vanity), large-format tile where a single bad cut wastes a big piece, or natural stone with high color variation that forces you to cull tiles. In those cases 15 to 20 percent is realistic even for a straight lay.",
          "The practical move is to round up, not down. If 40 square feet plus 10 percent comes to 44, order at least 44, and most pros keep an extra box on hand. Dye lots change between production runs, so a matching repair tile bought a year later may not exist. A few leftover tiles in the closet are cheap insurance."
        ]
      },
      {
        "heading": "Step 3: Convert square feet into boxes",
        "body": [
          "Tile is sold by the box, and each box covers a fixed number of square feet printed on the carton. Coverage varies by tile size, so never assume. As a reference, a box of 12 by 12 inch tile commonly holds about 15 square feet, a 12 by 24 inch box often covers around 16 square feet, and small mosaic sheets are usually sold around 10 to 11 square feet per box. Read the actual carton.",
          "Divide your total square footage including waste by the coverage per box, then round up to the next whole box. For 44 square feet at 15 square feet per box: 44 divided by 15 equals 2.93, so you buy 3 boxes. You cannot buy a partial box, so the rounding step is mandatory.",
          "If you want a quick sanity check on piece count rather than boxes, divide the area in square inches by the area of one tile in square inches. A 40 square foot floor is 5,760 square inches; a 12 by 12 tile is 144 square inches, so you need roughly 40 field tiles before waste. This is useful for mosaics and feature strips priced per piece."
        ]
      },
      {
        "heading": "Don't forget thinset, grout, and underlayment",
        "body": [
          "Tile is only part of the takeoff. Thinset mortar coverage depends on trowel size and tile size: a 50 lb bag of modified thinset roughly covers 40 to 60 square feet with a quarter-inch square-notch trowel for standard tile, but drops to around 20 to 30 square feet when you step up to a half-inch notch for large-format. Bigger tile and uneven substrates burn through mortar faster, so check the bag's coverage chart for your trowel.",
          "Grout depends on tile size, joint width, and joint depth. Small tiles and wide joints use dramatically more grout than large tiles with tight joints, so a mosaic backsplash can need several times the grout of a large-format floor of the same area. Use the manufacturer's coverage calculator for the specific tile dimensions and joint width rather than a flat rule.",
          "Add the rest of the system to the estimate too: uncoupling or crack-isolation membrane, backer board or waterproofing for wet areas, edge trim, corner pieces, and a tube or two of matching caulk for changes of plane. These line items are where a tight tile number can still blow the material budget."
        ]
      },
      {
        "heading": "Speeding up the takeoff and reducing errors",
        "body": [
          "The slow, error-prone part is measuring an irregular room and tallying the rectangles by hand, especially with niches, knee walls, and angled layouts. A LiDAR scan can capture room dimensions and generate a square footage figure in minutes, which is where a tool like ProBuildCalc fits into the workflow before you apply your waste factor and convert to boxes.",
          "Whether you scan or tape it out, the discipline is the same: confirm the raw square footage, choose a waste percentage that matches the actual pattern and room complexity, round up to full boxes, and price thinset, grout, and substrate separately. Getting those four steps right is the difference between one supply run and three.",
          "Build the waste assumption into the written estimate so the client sees it. Listing 'tile plus 15 percent waste for diagonal layout' protects you when the homeowner asks why there are leftover boxes, and it documents that the overage was planned, not a mistake."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much tile waste should I add?",
        "a": "Use about 10 percent for a straight or grid layout in a simple rectangular room, 15 percent for running bond, and 15 to 20 percent for diagonal, herringbone, large-format, or busy bathrooms with many cuts. Round up to full boxes and keep an extra box for future repairs, since dye lots change between production runs."
      },
      {
        "q": "How do I convert square footage into boxes of tile?",
        "a": "Divide your total square footage including waste by the coverage per box printed on the carton, then round up to the next whole box. For example, 44 square feet divided by 15 square feet per box equals 2.93, so you buy 3 boxes. Coverage varies by tile size, so always read the actual carton rather than assuming."
      },
      {
        "q": "Do I subtract doorways, niches, and fixtures when measuring?",
        "a": "Only subtract large openings bigger than roughly 5 to 10 square feet, such as a window or a sizable niche. Leave small cutouts like a toilet flange or narrow openings in the number, because the tile you trim around them usually becomes waste anyway and removing it can leave you short."
      },
      {
        "q": "How much thinset and grout do I need for tile?",
        "a": "A 50 lb bag of thinset roughly covers 40 to 60 square feet with a quarter-inch notch trowel, dropping to about 20 to 30 square feet with a half-inch notch for large-format tile. Grout depends heavily on tile size and joint width, so small tiles and wide joints use far more. Check the manufacturer's coverage chart for your exact tile and trowel."
      }
    ],
    "related": [
      {
        "href": "/tools/tile-calculator",
        "label": "Tile Calculator"
      }
    ]
  },
  {
    "slug": "how-much-mulch-do-i-need",
    "title": "How Much Mulch Do I Need? A Contractor's Method",
    "description": "Learn how much mulch or topsoil a bed needs with the exact formula, coverage rates per depth, waste percentages, and bag-vs-bulk math for accurate takeoffs.",
    "keywords": [
      "how much mulch do I need",
      "mulch coverage calculator",
      "cubic yards of mulch",
      "topsoil per square foot",
      "mulch depth chart",
      "bulk mulch vs bags"
    ],
    "dek": "Mulch and topsoil are sold by volume, but beds get measured by area, and that mismatch is where bids go wrong. Here is the exact method estimators use to size an order, plus the coverage rates, waste factors, and unit conversions that keep you from ordering two yards short on a Saturday.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "The one conversion everything depends on",
        "body": [
          "Mulch and topsoil are sold by the cubic yard in bulk and by the cubic foot in bags. One cubic yard equals 27 cubic feet. Burn that number into memory, because every coverage rule, bag count, and delivery order traces back to it. A bed is a two-dimensional measurement (square feet of area), but the material is three-dimensional (volume). The depth you spread is what bridges the two.",
          "The master formula is simple: square feet of bed area, times depth in feet, gives cubic feet of material. Divide by 27 to get cubic yards. Depth is almost always given in inches, so convert it first by dividing inches by 12. Three inches becomes 0.25 feet, two inches becomes 0.167 feet, four inches becomes 0.333 feet. Get that decimal right and the rest is arithmetic."
        ]
      },
      {
        "heading": "Coverage rates by depth (the cheat sheet)",
        "body": [
          "Because one cubic yard is a fixed 27 cubic feet, you can pre-calculate how much ground a yard covers at any spread depth. At 1 inch deep, one cubic yard covers about 324 square feet. At 2 inches, about 162 square feet. At 3 inches, about 108 square feet. At 4 inches, about 81 square feet. At 6 inches, about 54 square feet. Notice the pattern: double the depth, halve the coverage.",
          "For bagged product, the common retail bag is 2 cubic feet. At a 3-inch depth one 2-cubic-foot bag covers about 8 square feet; at 2 inches it covers about 12 square feet. A loose rule for bag counts: at 3 inches deep you need roughly one 2-cubic-foot bag for every 8 square feet of bed. Some soil and compost bags are sold at 1 cubic foot or by weight (40-pound bags), so always check the bag's stated cubic feet rather than assuming."
        ]
      },
      {
        "heading": "How deep should you actually go",
        "body": [
          "Depth drives the whole order, so pick it deliberately. For wood mulch on an established bed, 2 to 3 inches is the standard working range; 3 inches is the typical spec for good weed suppression and moisture retention. Going past 4 inches wastes material and can suffocate roots or hold too much moisture against stems. For an annual top-dressing over existing mulch, 1 to 2 inches is usually enough to refresh color and depth.",
          "Topsoil depth depends on the job. Top-dressing or leveling a lawn runs about 0.25 to 0.5 inch in a pass. Establishing a new planting bed typically calls for 4 to 6 inches of workable soil; raised beds and vegetable gardens often want 6 to 12 inches. Quote the depth in your estimate so the client understands what the volume buys, and so a change order is easy to justify if they want it deeper."
        ]
      },
      {
        "heading": "A worked example, start to finish",
        "body": [
          "Take a bed 20 feet long by 4 feet wide, mulched at 3 inches. Area is 80 square feet. Convert depth: 3 inches divided by 12 is 0.25 feet. Volume is 80 times 0.25, which is 20 cubic feet. Divide by 27 and you get about 0.74 cubic yards. That is your raw number before waste.",
          "Now decide how to buy it. In bags, 20 cubic feet divided by 2 cubic feet per bag is 10 bags, and you would round up to 11 to cover spillage and uneven spread. In bulk you would order three-quarters of a yard, but most suppliers sell and deliver in half- or full-yard increments, so you would round to a full cubic yard. For irregular beds, break the area into rectangles, triangles, and circles, total the square footage, then run the same formula once on the combined area."
        ]
      },
      {
        "heading": "Add waste, then round to how it's sold",
        "body": [
          "Field math never matches the truck. Add a waste and contingency factor before you order. For straightforward rectangular beds, 5 to 10 percent covers spillage, compaction, and slightly uneven depth. For irregular shapes, slopes, heavy root flare around trees, or crews spreading fast, use 10 to 15 percent. Bulk material also settles and you lose a little to the wheelbarrow and the tarp, so the cushion is real work, not padding the bill.",
          "After adding waste, round to how the product is actually sold. Bulk yards usually come in half-yard steps with a delivery minimum (often 1 to 3 yards) and a flat haul fee, so very small jobs frequently pencil out cheaper in bags despite a higher per-cubic-foot cost. Crossover is typically somewhere around 6 to 9 bags: above that, bulk almost always wins on both price and labor. Treat any prices as approximate and regional, and confirm the supplier's yard price, bag size, and delivery minimum before quoting."
        ]
      },
      {
        "heading": "Measuring fast and keeping the takeoff clean",
        "body": [
          "The error that sinks mulch orders is almost never the formula; it is the area measurement. Curved island beds, beds that wrap a corner, and tree rings are easy to eyeball wrong, and a 15 percent area mistake is a 15 percent volume mistake straight to your margin. Measure with a wheel or tape, sketch the bed, and split complex shapes into simple pieces you can compute and sum.",
          "This is where a phone-based scan beats a tape on oddly shaped beds: apps like ProBuildCalc use LiDAR to capture bed dimensions and roll them into a material takeoff, so the square footage feeding your volume math is measured rather than guessed. However you capture it, document the area, depth, waste percentage, and final ordered quantity on the estimate. That paper trail makes the next similar bid faster and gives you a defensible number if the client asks why the order was what it was."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much mulch do I need for a bed?",
        "a": "Multiply the bed's area in square feet by the depth in feet (inches divided by 12), then divide by 27 to get cubic yards. For example, an 80-square-foot bed at 3 inches deep is 80 x 0.25 = 20 cubic feet, or about 0.74 cubic yards before waste. Add 5 to 15 percent for waste and round up to how the supplier sells it."
      },
      {
        "q": "How many square feet does a yard of mulch cover?",
        "a": "One cubic yard is 27 cubic feet, so coverage depends entirely on depth. It covers about 324 square feet at 1 inch, 162 at 2 inches, 108 at 3 inches, and 81 at 4 inches. Doubling the depth cuts the coverage in half."
      },
      {
        "q": "How many bags of mulch equal a cubic yard?",
        "a": "With the common 2-cubic-foot bag, it takes about 14 bags to equal one cubic yard (27 divided by 2 is 13.5, rounded up). With 3-cubic-foot bags it takes 9. For small jobs bags can be cheaper after delivery fees, but past roughly 6 to 9 bags, bulk usually wins on price and labor."
      },
      {
        "q": "Is mulch and topsoil math the same?",
        "a": "The volume formula is identical, but the depths differ. Mulch is typically spread 2 to 3 inches deep, while new topsoil beds often want 4 to 6 inches and raised beds more. Topsoil is also heavier and sometimes sold by weight, so confirm whether a bag is rated in cubic feet or pounds before converting."
      }
    ],
    "related": [
      {
        "href": "/tools/mulch-calculator",
        "label": "Mulch & Soil Calculator"
      }
    ]
  },
  {
    "slug": "how-to-estimate-a-fence-project",
    "title": "How to Estimate a Fence: Posts, Rails, and Pickets",
    "description": "A contractor's method for estimating fence materials: counting posts, rails, and pickets with real spacing rules, waste factors, and unit conversions.",
    "keywords": [
      "how to estimate a fence",
      "fence material estimate",
      "fence post spacing",
      "fence picket calculation",
      "wood fence takeoff",
      "fence rail estimating",
      "linear feet of fence",
      "fence estimating waste factor"
    ],
    "dek": "Estimating a fence comes down to three counts -- posts, rails, and pickets -- driven by one number: total linear feet. Get the linear footage right and the rest is arithmetic. Here is the method estimators actually use, including the spacing rules, coverage math, and waste factors that keep you from a second supply run.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "Start with accurate linear footage",
        "body": [
          "Every fence takeoff begins with the total run measured in linear feet (LF) along the centerline of the fence. Walk the layout, measure each straight segment, and add them together. Pull your tape along the ground the posts will actually follow, not the property line on paper -- slopes, jogs around utilities, and setback offsets all change the real number. Measure gate openings separately and subtract them from the fenced run, because a 4-foot walk gate and a 10- or 12-foot drive gate need no infill pickets across the opening.",
          "For a rectangular yard, the perimeter is simply two times length plus two times width. For irregular lots, break the run into straight legs, measure each, and sum. Round the total up to the nearest foot. This single figure -- total LF -- feeds every other quantity in the estimate, so it is worth measuring twice. On rough or sloped ground, a measuring wheel or a quick LiDAR scan of the perimeter is faster and less error-prone than a tape; ProBuildCalc can pull linear footage straight from a phone scan of the site so the takeoff starts from a measured plan instead of a sketch."
        ]
      },
      {
        "heading": "Count the posts",
        "body": [
          "Posts are spaced on center, and the industry-standard maximum is 8 feet on center for most wood and many metal residential fences. Many contractors tighten that to 6 feet on center for stronger panels, heavier privacy fences, or windy sites. To get post count for a single straight run, divide the run length by your spacing and add one for the closing post: posts = (run LF / spacing) + 1. A 120-foot straight run at 8-foot spacing is 120 / 8 = 15 spaces, plus 1 = 16 posts.",
          "For a continuous closed loop like a backyard perimeter, you do not add the extra post -- the start and end share a corner -- so posts roughly equal total LF divided by spacing. Then add posts the spacing math misses: one at every corner, one on each side of every gate, and one at any change in direction. Gate posts carry hinge load and should be the heaviest posts on the job, often a larger section or set deeper in concrete. A practical rule: count the line posts from the spacing formula, then physically add corner and gate posts by walking the plan.",
          "Post length depends on fence height plus embedment. The common rule of thumb is to bury about one-third of the post, or a minimum of 24 to 30 inches below grade, whichever is greater, and below the local frost line in cold climates. A 6-foot-tall fence therefore wants an 8-foot post (6 feet above grade, 2 feet in the ground). For concrete-set posts, figure roughly one to two 50- to 60-pound bags of premixed concrete per hole for a standard 4x4 in a 8- to 10-inch-diameter hole; larger gate posts and wider holes use more."
        ]
      },
      {
        "heading": "Count the rails (stringers)",
        "body": [
          "Rails, also called stringers or backer rails, are the horizontal members that span between posts and carry the pickets. The count is driven by fence height. Fences up to about 4 feet typically use 2 rails (top and bottom). Fences from roughly 5 to 6 feet use 3 rails (top, middle, bottom). Fences taller than 6 feet, or any fence that will see heavy wind or livestock, often use 4 rails.",
          "To estimate rail material, multiply the total fence run by the number of rails: rail LF = total LF x rails per section. A 120-foot fence at 3 rails needs 360 linear feet of rail stock. If rails come in fixed lengths -- 8-foot rails are common and align with 8-foot post spacing -- divide the rail LF by the stock length to get a piece count, then add waste for cuts and unusable ends. With 8-foot post bays, one rail per bay per course makes the count clean: bays x rails per section equals the rail piece count, before waste."
        ]
      },
      {
        "heading": "Count the pickets",
        "body": [
          "Pickets (also called boards or palings) are the vertical infill. The picket count depends on board width and whether you want a tight, gapped, or board-on-board look. The base formula is: pickets = (fenced LF x 12) / (picket width + gap), using inches. For a solid privacy fence with 5.5-inch-wide boards (a nominal 1x6) butted with no gap, that is 5.5 inches per picket; with a 0.5-inch gap it becomes 6 inches per picket.",
          "Worked example: a 120-foot privacy fence (minus a 4-foot gate = 116 fenced feet) with 5.5-inch boards and no gap. 116 x 12 = 1,392 inches; divide by 5.5 = about 254 pickets. The same fence with a half-inch gap uses 6 inches per board: 1,392 / 6 = 232 pickets. Board-on-board, where boards overlap to hide gaps and account for shrinkage, increases the count by roughly 30 to 50 percent depending on overlap, so plan for it deliberately rather than discovering it at install. Spaced picket and shadowbox styles use the same formula with the chosen gap plugged in.",
          "Always confirm actual milled width, not nominal. A 1x6 is really 5.5 inches and a 1x4 is really 3.5 inches; estimating off nominal 6- and 4-inch widths will leave you short on every run."
        ]
      },
      {
        "heading": "Add waste, hardware, and a final check",
        "body": [
          "Add waste to every cut material. For pickets and rails, 10 percent is a reasonable allowance on straight, simple layouts; bump to 15 percent for fences with many corners, slopes, stepped sections, or where board grading will reject knotty stock. Posts generally do not get a percentage waste -- you order the exact count plus a spare or two for breakage. Round up to whole pieces and whole bags after applying waste.",
          "Do not forget the fasteners and accessories, which are easy to leave off a bid. Budget screws or nails per picket (typically 2 per rail crossing, so a 3-rail fence is about 6 fasteners per picket), plus post caps, rail brackets or fasteners, gate hardware (hinges, latch, and often a drop rod or cane bolt for double gates), and concrete by the bag.",
          "Close the estimate with a sanity check that ties back to your starting number. Posts should land near total LF divided by spacing plus your corner and gate adds; rail LF should equal total LF times rails per section; picket count should match fenced LF times 12 divided by your spacing-per-board. If any line item is wildly off those ratios, re-measure before you order -- a fence priced short almost always traces back to bad linear footage, not bad math."
        ]
      }
    ],
    "faq": [
      {
        "q": "How many pickets do I need per linear foot of fence?",
        "a": "It depends on board width and gap. For solid privacy fence with butted 5.5-inch boards (nominal 1x6), figure about 2.2 pickets per linear foot. Add a half-inch gap and it drops to 2 per foot. The exact formula is pickets equals fenced length in feet times 12, divided by the sum of picket width and gap in inches. Board-on-board adds roughly 30 to 50 percent more."
      },
      {
        "q": "What is the standard spacing for fence posts?",
        "a": "Eight feet on center is the common maximum for residential wood and metal fences, and rail stock is sold to match. Many contractors tighten to 6 feet on center for heavier privacy panels, taller fences, or windy and exposed sites. Always add posts at every corner, every change of direction, and on both sides of each gate beyond what the spacing formula gives you."
      },
      {
        "q": "How many rails does a fence need?",
        "a": "It scales with height. Fences up to about 4 feet use 2 rails, 5- to 6-foot fences use 3 rails, and fences over 6 feet or those exposed to heavy wind or livestock often use 4. Multiply your total fence run by the rail count to get total rail linear footage."
      },
      {
        "q": "How much waste should I add to a fence material estimate?",
        "a": "Roughly 10 percent on pickets and rails for simple, straight runs, and 12 to 15 percent for layouts with many corners, slopes, stepped sections, or where board grading will reject some stock. Posts are usually ordered at the exact count plus one or two spares for breakage rather than a percentage."
      }
    ],
    "related": [
      {
        "href": "/tools/fence-calculator",
        "label": "Fence Calculator"
      }
    ]
  },
  {
    "slug": "how-much-gravel-for-a-driveway",
    "title": "Gravel for a Driveway: Yards, Tons, and Depth",
    "description": "How to calculate gravel for a driveway in cubic yards and tons, plus the right depth by layer, coverage rates, and the waste percentage to add.",
    "keywords": [
      "gravel for a driveway",
      "gravel driveway calculator",
      "cubic yards of gravel",
      "tons of gravel per cubic yard",
      "gravel driveway depth",
      "gravel coverage rate",
      "driveway base material"
    ],
    "dek": "Ordering gravel by guesswork is how you end up with three extra tons in the yard or a second delivery fee. Here is the exact method estimators use to size a driveway in cubic yards and tons, the depths that actually hold up, and the waste factor to build in.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "The core formula: square feet to cubic yards",
        "body": [
          "Gravel is sold by volume (cubic yards) or weight (tons), but every calculation starts with volume. The formula is length times width times depth, with all three measurements in feet, then divide by 27 to convert cubic feet to cubic yards. The only trick is converting your depth from inches to feet first: divide the inch figure by 12.",
          "Work a real example. A driveway 50 feet long by 12 feet wide is 600 square feet. At a 4-inch depth, that is 600 times 0.333 feet, which equals 200 cubic feet. Divide by 27 and you get 7.41 cubic yards before any waste allowance. Change nothing but the depth and the number moves fast: the same 600 square feet needs 5.56 cubic yards at 3 inches and 11.11 cubic yards at 6 inches. Depth is the variable that drives your order, so nail it down before you do anything else.",
          "For odd shapes, break the area into rectangles and add them up, or for a rough circle (a turnaround, say) use 3.14 times the radius squared. A 20-foot-diameter circle is about 314 square feet."
        ]
      },
      {
        "heading": "Depth: how deep gravel actually needs to be",
        "body": [
          "Depth depends on the soil and the load, not on a single magic number. Over firm, well-drained soil for light passenger-vehicle use, a finished gravel surface of 4 inches is a common minimum. The problem is that 4 inches of loose stone over soft ground will pump, rut, and disappear into the subgrade within a season.",
          "For a driveway built to last, estimators think in layers, not one pour. A typical new build runs 8 to 12 inches total: a 4-to-6-inch base course of larger angular stone (often a crushed 2-to-3-inch rock or a dense-graded crushed base), then a 3-to-4-inch intermediate course, finished with a 2-to-3-inch top course of smaller crushed stone that compacts into a tight driving surface. Each layer should be compacted before the next goes down, and gravel compacts roughly 15 to 20 percent, so order against the loose volume you calculated. If the driveway carries heavy or commercial vehicles, increase base thickness and use a geotextile fabric over weak subgrade rather than just adding more stone.",
          "Resurfacing an existing, stable driveway is the cheaper case: 2 to 3 inches of fresh top-course gravel is usually enough to renew the surface."
        ]
      },
      {
        "heading": "Converting cubic yards to tons",
        "body": [
          "Many suppliers quote and bill by the ton, so you need a reliable conversion. Crushed stone and gravel typically weigh about 1.4 to 1.5 tons per cubic yard. Multiply your cubic-yard figure by roughly 1.4 to 1.5 to get tons, or divide tons by about 1.45 to get back to cubic yards (so 1 ton is close to 0.69 cubic yard).",
          "Using the example above, 7.41 cubic yards at 1.45 tons per cubic yard is about 10.7 tons. Treat this as an estimate: actual weight shifts with the stone type, gradation, and especially moisture, since wet material weighs more per yard. When a job is close to a delivery-truck capacity threshold, ask your supplier for the weight per yard of the specific product you are buying instead of relying on the average."
        ]
      },
      {
        "heading": "Coverage rates and a fast field check",
        "body": [
          "A coverage rate lets you sanity-check an order without redoing the full calculation. One cubic yard of gravel covers about 162 square feet at 2 inches deep, about 108 square feet at 3 inches, about 81 square feet at 4 inches, and about 54 square feet at 6 inches. By weight, at the 1.45 tons-per-yard average, one ton of top-course stone covers roughly 110 square feet at a 2-inch depth.",
          "To use these: divide your total square footage by the coverage number for your depth. The 600-square-foot example divided by 81 gives about 7.4 cubic yards at 4 inches, matching the formula. If the two methods disagree by more than a little, you have a unit error somewhere, usually an inches-versus-feet slip on the depth."
        ]
      },
      {
        "heading": "Waste, ordering, and getting the measurements right",
        "body": [
          "Always add a waste and compaction allowance on top of the calculated volume. For a straightforward rectangular driveway, 5 to 10 percent is standard; go to the higher end for irregular shapes, sloped sites, soft subgrade that will absorb the first layer, or spreading by hand where you lose material to overshoot at the edges. On the 7.41-cubic-yard example, a 10 percent allowance brings the order to about 8.15 cubic yards, or roughly 11.8 tons.",
          "The biggest source of error is not the math, it is the field measurement: an off-by-a-foot width or an inconsistent depth across a long run throws the whole order off. Measure width in several places and average it, and account for any flare at the road or a turnaround. This is where capturing the area accurately pays off; a LiDAR scan with a tool like ProBuildCalc records the driveway footprint and feeds the square footage straight into a takeoff, so the only judgment call left is choosing the depth.",
          "Two ordering notes. First, delivery is typically the same trip cost whether the truck is half or fully loaded, so it is usually cheaper to order slightly long than to pay for a second run for a yard or two. Second, prices are regional and move with fuel and stone type, so get a current per-yard or per-ton quote locally rather than budgeting off an old number; expect crushed driveway stone and delivery to vary meaningfully by market and haul distance (approximate, regional)."
        ]
      }
    ],
    "faq": [
      {
        "q": "How many tons of gravel do I need for a driveway?",
        "a": "First find the volume in cubic yards: length times width times depth, all in feet, divided by 27. Then multiply cubic yards by about 1.4 to 1.5 to get tons. A 50-by-12-foot driveway at 4 inches deep is about 7.4 cubic yards, or roughly 10.7 tons before waste. Add 5 to 10 percent for waste and compaction."
      },
      {
        "q": "How deep should gravel be for a driveway?",
        "a": "For a durable new driveway, plan on 8 to 12 inches total, built in compacted layers: a 4-to-6-inch base of larger angular stone, an intermediate course, and a 2-to-3-inch finer top course. A finished surface of 4 inches is a common minimum over firm soil, but a single thin layer over soft ground will rut. Resurfacing a stable driveway usually needs only 2 to 3 inches of fresh top course."
      },
      {
        "q": "How much does a cubic yard of gravel cover?",
        "a": "Roughly 162 square feet at 2 inches deep, 108 square feet at 3 inches, 81 square feet at 4 inches, and 54 square feet at 6 inches. Divide your driveway's square footage by the figure for your chosen depth to estimate cubic yards needed, then add a waste allowance."
      },
      {
        "q": "How many tons are in a cubic yard of gravel?",
        "a": "About 1.4 to 1.5 tons per cubic yard for typical crushed stone and gravel, so roughly 1.45 tons on average. Going the other way, one ton is about 0.69 cubic yard. Wet material and denser stone weigh more, so confirm the per-yard weight of your specific product when an order is near a truck-capacity limit."
      }
    ],
    "related": [
      {
        "href": "/tools/gravel-calculator",
        "label": "Gravel Calculator"
      }
    ]
  },
  {
    "slug": "material-takeoff-guide-for-contractors",
    "title": "Material Takeoff Guide: Process, Tools, and Costly Mistakes",
    "description": "A practical material takeoff guide for contractors: the step-by-step process, coverage rates, waste factors, unit conversions, and the errors that blow budgets.",
    "keywords": [
      "material takeoff",
      "construction estimating",
      "quantity takeoff",
      "waste factor",
      "coverage rates",
      "material list",
      "takeoff process",
      "contractor estimating"
    ],
    "dek": "A material takeoff turns a set of plans into a precise shopping list and the backbone of your bid. Get the quantities right and you protect your margin; get them wrong and you eat the difference. This guide walks through the actual process, the rules of thumb estimators rely on, and the mistakes that cost the most money.",
    "date": "2026-06-06",
    "sections": [
      {
        "heading": "What a Material Takeoff Actually Is",
        "body": [
          "A material takeoff, sometimes called a quantity takeoff, is the process of reading a project's plans and specs and extracting the exact quantities of every material the job will consume. The output is a structured list: so many board feet of framing lumber, so many sheets of drywall, so many square feet of flooring, so many bags of thinset. It is not the same as a cost estimate. The takeoff answers how much, and the pricing step that follows answers how much it costs. Keeping those two steps separate is what lets you re-price a job months later without redoing the measurement work.",
          "The takeoff is the foundation of nearly everything downstream: your bid, your purchase orders, your delivery schedule, and your labor projections. An error here propagates through all of them. Because most line items are priced per unit, a 10 percent quantity mistake on a major material is a 10 percent cost miss on that line, straight off your margin if you have already signed a fixed-price contract.",
          "Takeoffs are usually organized by trade or by CSI division so nothing falls through the cracks and so the list maps cleanly onto how you actually buy and schedule. A typical residential takeoff moves through site work, concrete, framing, sheathing and roofing, exterior finishes, insulation, drywall, interior finishes, and trim, with mechanical, electrical, and plumbing handled separately."
        ]
      },
      {
        "heading": "The Step-by-Step Process",
        "body": [
          "Start by reading the entire plan set and specifications before you measure a single thing. You are looking for scope, finish schedules, structural notes, and anything ambiguous. Note the drawing scale and confirm it matches the printed sheet, because plans printed to the wrong size are a classic source of error. Build your list of categories first, then fill in quantities, so the structure of the takeoff is set before you get buried in numbers.",
          "Measure systematically and in one direction so you never count an area twice or skip a room. Work elevation by elevation for exterior surfaces and room by room for interiors. For area-based materials like flooring, drywall, paint, and roofing, calculate net surface area first, then apply coverage rates and waste. For linear materials like baseboard, crown, and trim, total the running footage. For count-based items like doors, windows, fixtures, and hardware, tally each one against the schedule. Write down your assumptions as you go; an estimate you cannot explain in three months is an estimate you cannot defend.",
          "Convert everything into purchase units, not just raw measurements. A square-footage number means nothing to a supplier who sells drywall in 4-by-8 sheets, lumber by the piece or board foot, and concrete by the cubic yard. The conversion step is where many takeoffs go wrong, so build it deliberately. Finally, add the appropriate waste factor to each line, total it, and have a second set of eyes review the major quantities before it becomes a purchase order or a bid number."
        ]
      },
      {
        "heading": "Coverage Rates and Unit Conversions Worth Memorizing",
        "body": [
          "A few standard figures speed up almost every residential takeoff. Drywall comes in 4-by-8 sheets at 32 square feet each, so divide net wall and ceiling area by 32 to get sheet count. Joint compound runs roughly one gallon, or about 0.05 of a 4.5-gallon box, per 100 square feet of board for a standard three-coat finish, and you will use about 370 feet of paper tape per 1,000 square feet of drywall. Interior paint covers roughly 350 to 400 square feet per gallon on a smooth, primed surface; rough or porous surfaces and the first coat on bare drywall pull that number down.",
          "For concrete, the core conversion is cubic yards equals length times width times thickness in feet, divided by 27. A 4-inch slab is 0.333 feet thick, so a 10-by-10 pad is about 1.23 cubic yards before waste. An 80-pound bag of premixed concrete yields about 0.6 cubic foot, so it takes roughly 45 bags to equal one cubic yard, which is why anything past a few wheelbarrows should be ordered ready-mix. Framing lumber is often estimated by board foot, where one board foot equals 144 cubic inches, or nominal thickness times width in inches times length in feet, divided by 12.",
          "Other useful ratios: one square of roofing equals 100 square feet, and three bundles of standard architectural shingles cover one square. A standard wall framed at 16 inches on center uses about one stud per linear foot of wall plus extra studs at corners, openings, and intersections, so adding 15 to 20 percent over the bare on-center count covers those conditions. Mortar coverage for thinset and tile varies widely with trowel size and tile format, so always check the bag's coverage table rather than guessing."
        ]
      },
      {
        "heading": "Waste Factors: Plan for the Offcuts",
        "body": [
          "Every material loses some volume to cuts, breakage, and defects, and the takeoff has to account for it or you will be making a second supply run mid-job. Waste factors are added as a percentage on top of net quantity, and they vary by material and by layout complexity. These are common industry rules of thumb, not laws of physics, so adjust them for your specific job.",
          "Typical ranges: framing lumber and dimensional sheathing roughly 10 to 15 percent; drywall about 10 to 15 percent; standard field tile around 10 percent on a simple rectangular room, rising to 15 percent or more with diagonal layouts, lots of cuts, or large-format tile; hardwood and laminate flooring about 5 to 10 percent for straight layouts and 15 percent or more for diagonal or herringbone patterns; paint a few percent for touch-ups; roofing shingles about 10 to 15 percent, more on cut-up roofs with many hips and valleys.",
          "Two rules keep waste factors honest. First, more cuts mean more waste, so geometry drives the number more than the material does. A long straight wall wastes little drywall; a stairwell wastes a lot. Second, buy in the units the material actually ships in, then round up to the whole unit. You cannot buy 0.3 of a sheet, so a calculation that lands at 47.2 sheets is a 48-sheet order, and that rounding is itself a small built-in buffer you should not double-count."
        ]
      },
      {
        "heading": "Tools: From Scale Rulers to LiDAR Scans",
        "body": [
          "Takeoffs have historically been done by hand with a scale ruler, a printed plan set, and a calculator, and that method still works fine for small or simple jobs. Spreadsheets are the next step up, letting you store coverage rates and waste factors as formulas so the math is consistent and re-pricing is fast. For larger commercial work, dedicated on-screen takeoff software lets estimators measure directly on digital plans, which cuts down on transcription errors and speeds up repetitive counts.",
          "Where plans do not exist or are unreliable, which is common on renovations and remodels, the measurement itself is the hard part. This is where LiDAR room scanning has changed the field workflow: walking a space with a scanning app captures dimensions and surface areas directly, and a tool like ProBuildCalc can turn that scan into material quantities without hand-measuring every wall. It is most valuable on existing-conditions work where there is no clean drawing to take off from.",
          "Whatever tool you use, the discipline matters more than the software. A scan or a digital measurement is still only the net quantity. You still have to apply coverage rates, add the right waste factor, convert to purchase units, and sanity-check the totals. The tool removes arithmetic and transcription errors; it does not remove judgment about scope, layout complexity, or what the spec actually calls for."
        ]
      },
      {
        "heading": "The Costly Mistakes to Avoid",
        "body": [
          "The most expensive errors are usually not bad arithmetic; they are scope and process failures. Estimating from an outdated plan revision, missing a finish-schedule note, or taking off the wrong sheet scale will quietly corrupt every quantity downstream. Confirm you are working from the current set, that the scale is right, and that you have read the specs, not just looked at the drawings. Double-counting overlapping areas and forgetting to deduct large openings like garage doors and storefronts are common area-math slips that go both directions.",
          "Forgetting the unglamorous consumables is the mistake that triggers extra supply runs and blown schedules: fasteners, adhesive, tape, joint compound, caulk, flashing, transition strips, and the like. These are cheap per unit but they stop work cold when you run out. Build a standing checklist of accessories per trade so they are never left off. Likewise, do not apply a single blanket waste percentage to everything; a flat number overbuys simple work and underbuys cut-heavy work.",
          "Finally, never let a takeoff go to purchasing or into a bid without a review of the big-ticket lines, and never throw away the assumptions behind the numbers. Document scope exclusions clearly so a forgotten item does not become a margin-eating change you absorb. The combination of a structured category list, written assumptions, realistic per-material waste factors, conversion to real purchase units, and a second-pass check is what separates a takeoff you can stand behind from a number you are hoping is close."
        ]
      }
    ],
    "faq": [
      {
        "q": "What is the difference between a material takeoff and a cost estimate?",
        "a": "A material takeoff lists the quantities of materials a job needs, answering how much of each item. A cost estimate applies prices to those quantities to answer what it costs. Keeping them as separate steps lets you re-price the same takeoff later without remeasuring."
      },
      {
        "q": "How much waste should I add to a material takeoff?",
        "a": "It depends on the material and the layout. Common rules of thumb are roughly 10 to 15 percent for framing lumber, drywall, and roofing shingles, about 10 percent for simple tile rising to 15 percent or more for diagonal or large-format layouts, and 5 to 10 percent for straight-lay flooring. More cuts mean more waste, so geometry drives the number more than the material."
      },
      {
        "q": "How do I convert square footage into materials to order?",
        "a": "Convert net area into the units the supplier sells. Divide wall and ceiling area by 32 for 4-by-8 drywall sheets, divide by 100 for squares of roofing, and divide by the paint coverage rate of about 350 to 400 square feet per gallon. For concrete, multiply length by width by thickness in feet and divide by 27 for cubic yards. Always round up to whole purchase units."
      },
      {
        "q": "Can a LiDAR scanning app replace a manual takeoff?",
        "a": "A LiDAR scan captures accurate dimensions and surface areas, which is especially useful on remodels with no reliable plans, and tools like ProBuildCalc can convert a scan into quantities. But the scan only gives net quantities. You still need to apply coverage rates, add waste factors, convert to purchase units, and check the scope, so the scan speeds up measurement rather than replacing the estimator's judgment."
      }
    ],
    "related": [
      {
        "href": "/tools",
        "label": "Free calculators"
      },
      {
        "href": "/tools/square-footage-calculator",
        "label": "Square Footage Calculator"
      }
    ]
  }
];

export const getPost = (slug: string): BlogPost | undefined =>
  POSTS.find((p) => p.slug === slug);
