#!/usr/bin/env python3
"""Append 10 new blog posts (Batch G) to posts.ts."""

import json, re

NEW_POSTS = [
  {
    "slug": "how-much-does-a-wood-fence-cost",
    "title": "How Much Does a Wood Fence Cost? (2024 Pricing Guide)",
    "description": "A complete breakdown of wood fence costs per linear foot by style, with material lists, labor estimates, and tips for getting accurate bids from contractors.",
    "keywords": [
      "wood fence cost",
      "wood fence cost per foot",
      "privacy fence cost",
      "wood fence price",
      "cedar fence cost",
      "wood fence installation cost",
      "privacy fence installation cost",
      "fence cost calculator"
    ],
    "dek": "Wood privacy fence costs most homeowners $15 to $35 per linear foot installed, but the number swings widely based on fence style, wood species, post spacing, and local labor rates. Here is how to build an accurate estimate before you call a single contractor.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "Average Wood Fence Cost Per Linear Foot",
        "body": [
          "For a standard 6-foot privacy fence, installed costs typically run $15 to $35 per linear foot, putting a 150-foot fence somewhere between $2,250 and $5,250. That range is wide because it covers everything from pressure-treated pine (the cheapest durable option) up through cedar and redwood (which cost more but resist rot naturally). A split-rail fence drops as low as $10 to $15 per linear foot because it uses far less wood. A board-on-board or shadowbox style adds roughly 15 to 20 percent over a standard privacy fence because it uses more boards.",
          "The single biggest cost driver is usually the posts. A wood fence needs a post every 6 to 8 feet, and each post requires a concrete footing dug below the frost line. In cold climates where frost depth is 36 inches or more, post installation alone can consume a large share of the labor budget. Ask any contractor bidding your fence to break out the post and footing cost separately so you can compare bids apples to apples.",
          "For a quick rough estimate on your specific fence length, the ProBuildCalc wood fence cost calculator takes your linear footage, fence height, and post spacing and outputs a materials list and cost range you can use as a baseline before soliciting bids."
        ]
      },
      {
        "heading": "Materials Breakdown: What You Are Actually Paying For",
        "body": [
          "A typical 6-foot privacy fence breaks down into posts, rails, pickets, concrete, hardware, and fasteners. Posts are usually 4x4 pressure-treated lumber set 2 feet deeper than the frost line. A fence with 8-foot post spacing on a 100-foot run needs about 14 posts. Rails run horizontally between posts — a 6-foot privacy fence usually has two or three rails made of 2x4 pressure-treated lumber. Pickets are the vertical boards that create the visible face of the fence.",
          "Wood species changes the cost significantly. Pressure-treated pine pickets run roughly $1.50 to $2.50 each for a standard 6-inch-wide board. Cedar pickets in the same size cost $3 to $5 each but resist rot without treatment and have a much better appearance without paint or stain. Redwood is the premium option at $5 to $8 per picket and is mostly found on the West Coast. The difference in picket cost for a 150-foot fence adds up fast — premium cedar over pressure-treated pine can add $400 to $800 in material cost alone on a project that size.",
          "Don't overlook concrete for the posts, post caps or finials if desired, galvanized or stainless screws (standard screws bleed rust stains down wood within a year), and gate hardware if you are adding a gate. A gate opening with a single gate adds roughly $250 to $600 to the total cost depending on gate width and hardware quality."
        ]
      },
      {
        "heading": "Labor Cost and What It Covers",
        "body": [
          "Labor for wood fence installation typically runs $8 to $18 per linear foot on top of materials, and it covers layout and line staking, post hole digging (the most physical part of the job), setting posts in concrete, letting the concrete cure, installing rails, and nailing or screwing pickets. On rocky or root-filled ground, digging can cost significantly more because contractors may need a hydraulic post hole digger, which adds rental cost and time.",
          "If you are in an HOA community or municipality that requires a fence permit, add $50 to $200 for the permit fee and a few days for the inspection and approval process. Most fence contractors handle permitting for you, but confirm this before signing a contract. Some also offer to remove and dispose of an existing fence, which usually adds $3 to $8 per linear foot to the project cost.",
          "DIY installation cuts the labor cost to near zero but adds significant time — a first-timer on a 150-foot fence can expect two to three full weekends of work, and renting a post hole digger for a day costs $80 to $150. The labor savings are real ($1,200 to $2,700 on a mid-size fence), but factor in the rental cost, the time, and the learning curve on getting posts truly plumb before deciding."
        ]
      },
      {
        "heading": "Fence Style Comparison",
        "body": [
          "Privacy or stockade fence (boards edge to edge, 6 feet tall) is the most common choice and runs $15 to $30 per linear foot installed. Board-on-board or shadowbox fence staggers boards on alternating sides of the rail so you can see through at an angle but not straight through — it uses more material but looks the same from both sides, which neighbors tend to prefer, and it costs roughly $18 to $35 per linear foot. Picket fence (shorter boards with gaps, typically 3 to 4 feet tall) is the classic front-yard look and costs $10 to $25 per linear foot installed because it uses fewer materials.",
          "Split-rail fence is the lowest-cost wood option at $10 to $20 per linear foot installed. It uses round or half-round posts and 2 to 3 horizontal rails with no vertical boards, so it provides boundary definition and looks but no privacy or containment for small animals. It is commonly used on rural lots, ranches, and large suburban yards where the aesthetic fits the setting and full privacy is not the goal."
        ]
      },
      {
        "heading": "Getting Accurate Bids",
        "body": [
          "Before calling contractors, know your linear footage (walk the property line with a measuring wheel or measure on a satellite map), your desired height, and whether you want gates and where. A contractor who knows these three things can give you a real number in a short conversation instead of scheduling a site visit just to get a ballpark. Having your own estimate from a fence calculator gives you a baseline so you know whether the bids you receive are reasonable or if someone is padding the materials.",
          "Get at least three bids and ask each contractor to itemize materials and labor separately. Request that they specify the wood species, post size, and fastener type, as these are where cheap bids cut corners. Check that the bid includes post holes to the correct frost depth for your region, concrete for the posts, and disposal of soil from the post holes. A complete bid should also note whether the fence will be sealed or stained — bare pressure-treated pine needs to dry for 6 to 12 months before stain will adhere, while cedar can be stained right away."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much does a wood privacy fence cost for a typical backyard?",
        "a": "A typical backyard privacy fence runs 150 to 200 linear feet. At $15 to $35 per linear foot installed, that puts most projects between $2,250 and $7,000 depending on wood species, fence style, and local labor rates. Cedar costs more than pressure-treated pine but lasts longer without treatment."
      },
      {
        "q": "Is cedar or pressure-treated pine better for a fence?",
        "a": "Cedar naturally resists rot and insects without chemical treatment, looks better, and takes stain immediately. Pressure-treated pine is 30 to 50 percent cheaper upfront but requires waiting 6 to 12 months before staining and may not match cedar's lifespan in wet climates. For most homeowners, cedar is worth the premium if budget allows."
      },
      {
        "q": "How deep should fence posts be set?",
        "a": "The general rule is one-third of the post length below ground, plus 6 inches below the frost line. For a 6-foot fence with 8-foot posts in a climate where the frost line is 24 inches, you would dig 2 feet 6 inches deep. In colder climates with a 36-inch frost line, posts need to go deeper, which adds labor cost."
      },
      {
        "q": "Can I build a wood fence myself to save money?",
        "a": "Yes. DIY fence installation saves $8 to $18 per linear foot in labor, which can amount to $1,200 to $2,700 on a 150-foot fence. The key investments are renting a post hole digger ($80 to $150 per day), buying the right fasteners (galvanized or stainless), and taking the time to get posts truly plumb. Budget two to three full weekends for a fence that size."
      }
    ],
    "related": [
      {"href": "/tools/wood-fence-cost-calculator", "label": "Wood Fence Cost Calculator"},
      {"href": "/tools/fence-calculator", "label": "Fence Material Calculator"},
      {"href": "/tools/concrete-calculator", "label": "Concrete Calculator (Post Footings)"},
      {"href": "/blog/how-to-estimate-a-fence-project", "label": "How to Estimate a Fence Project"}
    ]
  },
  {
    "slug": "concrete-vs-asphalt-driveway-cost",
    "title": "Concrete vs Asphalt Driveway: Cost, Durability & Which to Choose",
    "description": "A side-by-side comparison of concrete and asphalt driveways covering installation cost, lifespan, maintenance requirements, and which performs better in cold and hot climates.",
    "keywords": [
      "concrete vs asphalt driveway",
      "driveway cost comparison",
      "asphalt vs concrete driveway cost",
      "concrete driveway cost",
      "asphalt driveway cost",
      "driveway replacement cost",
      "concrete driveway vs asphalt",
      "which driveway material is best"
    ],
    "dek": "Concrete driveways cost more upfront ($8 to $18 per sq ft installed) but can last 30 to 40 years with minimal maintenance. Asphalt costs less to install ($3 to $7 per sq ft) but needs sealing every 3 to 5 years and typically lasts 20 to 30 years. The right choice depends on your climate, budget, and how long you plan to own the house.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "Cost Comparison: Upfront vs Lifetime",
        "body": [
          "For a standard two-car driveway of about 600 square feet, concrete installation runs $4,800 to $10,800 and asphalt runs $1,800 to $4,200. The gap is real, but it narrows over time once you factor in maintenance. Asphalt requires sealing every 3 to 5 years at roughly $0.15 to $0.30 per square foot per seal coat, and cracks that go untreated become potholes that require more expensive patching or resurfacing. Concrete requires no routine sealing, though surface sealer ($0.25 to $0.50 per sq ft) extends the life in freeze-thaw climates.",
          "Replacement cost is where the lifetime calculation really swings. A concrete driveway that lasts 35 years before needing replacement was replaced once in the time you would have replaced an asphalt driveway twice. On a 600 sq ft driveway, two asphalt replacements at $3,000 each plus several seal coats can approach or exceed the cost of one concrete installation. If you are buying a house you plan to own for decades, concrete is often the better financial decision. If you are flipping or expect to sell in 5 to 10 years, asphalt's lower upfront cost and fresh appearance after a seal coat can make it the smarter short-term choice.",
          "Use a driveway cost calculator to get a quick estimate for your specific square footage. Enter your area, choose your material, and get a cost range in seconds — useful for sanity-checking contractor bids before you start soliciting them."
        ]
      },
      {
        "heading": "Performance in Cold Climates",
        "body": [
          "Freeze-thaw cycles are asphalt's enemy. As water seeps into small surface cracks and freezes, it expands and widens those cracks, eventually creating potholes or causing sections to heave. Asphalt's flexibility, which is an advantage in some respects, means it moves with temperature changes and is more prone to cracking in climates with repeated freeze-thaw cycles. Annual crack filling and sealing every few years are not optional maintenance items in the North — they are what keep an asphalt driveway from deteriorating quickly.",
          "Concrete handles cold weather better structurally but has its own cold-climate issue: deicing salt. Road salt and calcium chloride that drip off vehicles can penetrate concrete's surface and cause spalling and scaling over time, particularly in the first few years before the concrete has fully cured and hardened. In areas with heavy salt use, use a penetrating concrete sealer after the first winter and use sand instead of salt on your own driveway surface. Concrete is generally the more durable choice in cold climates as long as you manage the salt exposure."
        ]
      },
      {
        "heading": "Performance in Hot Climates",
        "body": [
          "In hot climates, asphalt softens in extreme heat. A surface temperature above 140 degrees Fahrenheit — which a dark asphalt driveway in Arizona or Texas can reach in summer — makes asphalt pliable enough that car jacks can sink into it and bicycle kickstands leave divots. This is a real practical issue, not just an aesthetic one. Asphalt also expands and contracts with temperature, which can cause cracking at the edges over years.",
          "Concrete reflects heat rather than absorbing it, stays cooler on the surface, and does not soften in heat. It is the clearly superior choice in hot desert climates. Concrete also has the advantage of being lighter in color, which some homeowners appreciate for the appearance and which contributes slightly to a cooler driveway surface compared to black asphalt."
        ]
      },
      {
        "heading": "Appearance and Customization",
        "body": [
          "Standard asphalt is black, and the options for changing that are limited. You can seal it with a standard or tinted sealer, but asphalt is essentially a black surface with little customization potential. Standard concrete is medium gray and also not very exciting, but concrete can be stamped, colored, or exposed-aggregate finished to look significantly better. Stamped concrete that mimics brick or stone patterns costs $12 to $25 per square foot installed but produces a driveway that looks like a premium hardscape product.",
          "For most homeowners who want a clean, neutral driveway, broom-finished concrete is a reasonable-looking surface at a standard concrete price. For homeowners who want something that stands out, exposed aggregate (which reveals the stone within the concrete mix) or stamped patterns offer options that asphalt simply cannot match."
        ]
      },
      {
        "heading": "The Short Answer: Which Should You Choose?",
        "body": [
          "Choose concrete if you live in a hot climate, plan to own the house for more than 15 years, want minimal ongoing maintenance, or want appearance options beyond plain black. Choose asphalt if you are in a moderate climate, want the lowest upfront cost, or are in a situation where short-term economics matter more than long-term cost of ownership.",
          "In cold climates, the choice is closer. Asphalt handles the flexibility of freeze-thaw cycles reasonably well if maintained, but concrete, properly sealed and protected from deicing salt, will outlast asphalt significantly. Either way, get at least three contractor bids and use a driveway cost calculator to build a rough estimate so you know what a fair price looks like before you start talking to contractors."
        ]
      }
    ],
    "faq": [
      {
        "q": "Which is cheaper — concrete or asphalt driveway?",
        "a": "Asphalt costs $3 to $7 per square foot installed compared to $8 to $18 for concrete, so asphalt is significantly cheaper upfront. A 600 sq ft asphalt driveway runs $1,800 to $4,200 vs $4,800 to $10,800 for concrete. However, asphalt needs sealing every 3 to 5 years and typically needs replacement sooner, so the lifetime cost difference is smaller than the upfront gap suggests."
      },
      {
        "q": "How long does a concrete driveway last compared to asphalt?",
        "a": "A well-installed concrete driveway typically lasts 30 to 40 years, while an asphalt driveway usually lasts 20 to 30 years with regular maintenance (sealing every 3 to 5 years and crack filling as needed). In both cases, the actual lifespan depends heavily on installation quality, climate, and how well the surface is maintained."
      },
      {
        "q": "Does asphalt crack more than concrete?",
        "a": "Both materials crack over time, but the cracking mechanisms differ. Asphalt is more prone to cracking from freeze-thaw cycles and can develop alligator cracking from base failure. Concrete cracks along control joints that are intentionally cut every 8 to 10 feet to guide where cracking occurs. Well-installed concrete with proper control joints tends to crack less visibly than asphalt over time."
      },
      {
        "q": "Can you pour concrete over an existing asphalt driveway?",
        "a": "Technically yes, but most concrete contractors will remove the asphalt first. Pouring concrete over asphalt creates bonding issues and makes it harder to achieve adequate thickness and a flat surface. Removal and disposal of old asphalt typically adds $1 to $3 per square foot to the project cost."
      }
    ],
    "related": [
      {"href": "/tools/driveway-cost-calculator", "label": "Driveway Cost Calculator"},
      {"href": "/tools/concrete-calculator", "label": "Concrete Calculator"},
      {"href": "/tools/asphalt-calculator", "label": "Asphalt Calculator"},
      {"href": "/blog/how-much-gravel-for-a-driveway", "label": "How Much Gravel for a Driveway?"}
    ]
  },
  {
    "slug": "shed-materials-list-and-cost",
    "title": "Shed Materials List: What You Need and How Much It Costs",
    "description": "A complete materials list for building a 12x16 storage shed, with lumber quantities, roofing, siding, hardware, and cost breakdowns for both DIY and contractor builds.",
    "keywords": [
      "shed materials list",
      "how to build a shed materials",
      "shed cost",
      "shed material cost",
      "building a shed cost",
      "shed framing materials",
      "shed lumber list",
      "storage shed cost"
    ],
    "dek": "A 12x16 storage shed built with standard materials runs roughly $1,800 to $3,500 in materials. Here is exactly what goes into it — foundation, framing, roofing, siding, and doors — with quantities and typical prices so you can build a real budget before you buy a single board.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "Foundation: Skids, Piers, or Slab",
        "body": [
          "Every shed needs a level, stable base that keeps the floor framing off the ground. The three common options are pressure-treated skids (4x6 or 4x4 beams laid directly on the ground or on gravel), concrete piers (tube forms filled with concrete with post brackets on top), and a poured concrete slab. Skids are the cheapest and easiest option for a small shed — a 12x16 shed on skids needs two or three 16-foot 4x6 pressure-treated beams, which cost roughly $25 to $40 each. The skids sit on a bed of crushed gravel about 4 inches deep and 4 feet wide, which costs about $100 to $200 in material for this size.",
          "Concrete piers cost more than skids ($10 to $20 per pier in materials) but give you a more permanent, frost-resistant foundation. Most codes require piers below the frost line in climates with freezing temperatures. A 12x16 shed typically needs 6 to 9 piers. A full concrete slab adds $800 to $2,500 in materials and labor for a 12x16 shed but creates a true permanent structure with a floor you can drive a riding mower onto. For most storage sheds, skids with a gravel bed are the practical, cost-effective choice."
        ]
      },
      {
        "heading": "Floor Framing Materials",
        "body": [
          "The floor frame for a 12x16 shed is built from pressure-treated 2x6 or 2x8 lumber. You need two rim joists the full length of the shed (two 16-foot boards) and two the full width (two 12-foot boards), plus interior joists spaced 16 inches on center. For a 12-foot span, 12x16 puts interior joists at 16-inch spacing along the 16-foot direction, requiring roughly 10 to 11 interior joists at 12 feet each. Budget for about 200 linear feet of 2x6 pressure-treated lumber for the floor frame.",
          "The floor decking is typically 3/4-inch tongue-and-groove plywood rated for exterior use. A 12x16 shed floor is 192 square feet, which requires 12 sheets of 4x8 plywood (192 divided by 32 sq ft per sheet, rounded up). At $30 to $55 per sheet depending on grade and market, budget $360 to $660 for floor decking. Use ring-shank nails or screws to fasten it rather than smooth nails, which can work loose over time."
        ]
      },
      {
        "heading": "Wall Framing and Sheathing",
        "body": [
          "Standard shed walls are framed with 2x4 studs at 16 or 24 inches on center. The total wall perimeter of a 12x16 shed is 56 linear feet. At 16-inch spacing, you need roughly 48 to 52 studs at 8 feet each, plus top and bottom plates (two per wall, so 112 linear feet of 2x4 for plates), plus headers over any door or window openings. Add 10 to 15 percent for waste and blocking. Budget for roughly 700 to 800 linear feet of 2x4 lumber for the wall framing.",
          "Wall sheathing — typically 7/16-inch OSB or 1/2-inch plywood — covers the outside of the wall frame. A 12x16 shed has approximately 600 square feet of wall surface (before window and door subtractions), requiring about 20 sheets of 4x8 OSB. At $16 to $28 per sheet, budget $320 to $560 for wall sheathing. Housewrap or building paper goes over the sheathing before siding and costs $50 to $100 for a shed this size."
        ]
      },
      {
        "heading": "Roof Framing, Decking, and Shingles",
        "body": [
          "A simple gable roof on a 12x16 shed with a 4:12 pitch uses pre-cut rafters or ridge board and common rafters spaced 24 inches on center. You need roughly 18 rafters at approximately 8 feet each, one ridge board at 16 feet, and collar ties or ceiling joists if you want attic storage. Budget for about 200 linear feet of 2x6 for the roof framing of a modest pitch. Add a fascia board around the perimeter (about 60 linear feet of 1x6) and rake boards if desired.",
          "Roof decking is the same 7/16-inch OSB as the wall sheathing. The roof surface area for a 12x16 shed with a 4:12 pitch is roughly 220 to 240 square feet, requiring 8 sheets of OSB. Over the decking goes 15-pound felt paper or synthetic underlayment, then asphalt shingles. Shingles are sold by the square (100 sq ft). A 12x16 shed needs about 2.5 to 3 squares of shingles including a waste factor, plus ridge cap shingles. At $35 to $80 per square for three-tab shingles, budget $90 to $240 for shingles, plus $20 to $40 for underlayment."
        ]
      },
      {
        "heading": "Siding, Doors, and Total Cost Summary",
        "body": [
          "The most common shed siding options are T1-11 plywood siding (a single sheet that serves as both sheathing and siding, with vertical grooves), lap siding (horizontal boards), and vinyl siding panels. T1-11 is the fastest and often cheapest option for a shed — the 600 square feet of wall area needs about 20 sheets at $35 to $60 each, for a material cost of $700 to $1,200. Lap siding in pine or engineered wood costs similarly but takes longer to install. Vinyl siding is durable and low-maintenance but adds cost in corners, trim pieces, and fasteners.",
          "A pre-hung exterior door for the shed runs $150 to $400 for a standard 36-inch entry door. Double doors or barn-style doors for equipment access add $200 to $600. Add roofing nails, framing nails, joist hangers, hurricane ties, door hinges and hardware, and miscellaneous fasteners — budget $200 to $400 for hardware. Putting it all together: a 12x16 shed built from materials typically costs $1,800 to $3,500 depending on material choices, and a contractor-built version on the same footprint runs $4,000 to $8,000 including labor. Use a shed calculator to get a tailored material list and estimate for your specific shed dimensions and configuration."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much does it cost to build a 12x16 shed?",
        "a": "DIY materials for a standard 12x16 shed run $1,800 to $3,500. A contractor-built 12x16 shed typically costs $4,000 to $8,000. The range reflects differences in foundation type, siding material, roofing quality, door choices, and local labor rates."
      },
      {
        "q": "Do I need a permit to build a shed?",
        "a": "It depends on your municipality and shed size. Many areas exempt sheds under a certain size (commonly 100 to 200 square feet) from permit requirements, but sheds larger than that or on permanent foundations often require a permit. Check with your local building department before starting — the fee is usually $50 to $150 and a permit avoids problems when you sell the property."
      },
      {
        "q": "What lumber do I need for a basic storage shed?",
        "a": "A 12x16 shed requires approximately: pressure-treated 4x6 skids for the base, pressure-treated 2x6 for floor framing (about 200 LF), 3/4\" T&G plywood for flooring (12 sheets), 2x4 studs and plates for walls (about 750 LF), OSB sheathing for walls and roof (about 28 sheets), and 2x6 rafters for the roof (about 200 LF). Add siding, roofing, trim, and hardware."
      },
      {
        "q": "Is it cheaper to buy a pre-built shed or build one yourself?",
        "a": "Pre-built sheds delivered and installed typically cost $2,000 to $6,000 for a 12x16 basic model, which is comparable to or slightly above DIY material cost. The advantage of DIY is customization — you choose the foundation, door placement, and siding material. Pre-built is faster and requires no construction skills, but site preparation and delivery limitations (clearance for delivery trucks) can be limiting factors."
      }
    ],
    "related": [
      {"href": "/tools/shed-calculator", "label": "Shed Materials Calculator"},
      {"href": "/tools/framing-cost-calculator", "label": "Framing Cost Calculator"},
      {"href": "/tools/concrete-calculator", "label": "Concrete Calculator"},
      {"href": "/blog/wall-framing-stud-spacing-guide", "label": "Wall Framing Stud Spacing Guide"}
    ]
  },
  {
    "slug": "how-much-tile-for-a-bathroom",
    "title": "How Much Tile Does a Bathroom Need? (With Cost Guide)",
    "description": "Learn how to calculate tile quantity for bathroom floors, shower walls, and tub surrounds — with waste factors, material costs, and a step-by-step estimating method.",
    "keywords": [
      "how much tile for bathroom",
      "bathroom tile cost",
      "bathroom tile calculator",
      "how many tiles do I need",
      "shower tile estimate",
      "bathroom floor tile cost",
      "tile square footage bathroom",
      "how to calculate bathroom tile"
    ],
    "dek": "A typical 5x8 bathroom needs 40 to 60 square feet of floor tile plus 80 to 120 square feet of shower or tub wall tile, depending on how high you tile. Here is how to measure each surface correctly, choose the right waste factor, and estimate material cost before you buy.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "Measuring the Bathroom Floor",
        "body": [
          "Start with the floor. Measure the room length by width in feet and multiply to get square footage. For a standard 5x8 bathroom, that's 40 square feet. Subtract the footprint of the toilet (about 0.5 sq ft at the base), vanity (if floor-to-wall with no floor tile underneath), and tub if it sits on the subfloor and won't have tile under it. In practice, most tile installers do not subtract the toilet because the tile runs under it, and the small deductions rarely change the tile order quantity.",
          "For L-shaped or irregular bathrooms, break the space into rectangles, calculate each, and sum them. Include the closet floor if it gets the same tile. Once you have the net square footage, add a waste factor: 10 percent for a straight grid layout, 15 percent for a diagonal layout (cuts on every edge create more waste), and 15 to 20 percent for mosaic or small-format tile like 2x2 penny tile, which has many more cuts and a higher chance of breakage.",
          "A 40 sq ft bathroom floor at 10 percent waste needs 44 sq ft of tile to order. Check the box coverage printed on the tile carton and divide your total by that number, rounding up to the next full box. A 12x12 tile in a box covering 8 square feet needs 6 boxes for a 44 sq ft floor."
        ]
      },
      {
        "heading": "Measuring Shower Walls or Tub Surrounds",
        "body": [
          "Shower and tub walls are measured by their surface area in square feet. For a standard tub surround that tiles three walls up to 60 inches high, measure the width of the back wall and multiply by the tile height (5 feet), then do the same for each side wall. A standard 5-foot tub with a 3-foot-wide alcove has a back wall of 5 feet wide by 5 feet high (25 sq ft) and two side walls of 3 feet wide by 5 feet high (15 sq ft each) for a total of 55 square feet. Add 10 to 15 percent waste for a tub surround — the cuts at the tub deck, corners, and around the faucet valve add up.",
          "A walk-in shower is measured the same way: measure each wall that gets tile and multiply by the tile height. If you are tiling to the ceiling (a common design choice for a spa look), measure the full wall height. Do not forget the shower floor, which is usually a different, smaller tile — 2x2, 3x3, or 2x4 — for slip resistance. A 36x36 inch shower floor is 9 square feet, and with 20 percent waste for mosaic tile it rounds to about 11 square feet. The ProBuildCalc bathroom tile calculator handles all of this — input each surface and it adds the right waste factor and outputs the total boxes to order."
        ]
      },
      {
        "heading": "Tile Cost Breakdown",
        "body": [
          "Ceramic tile for bathroom floors runs $1 to $5 per square foot for standard field tile, $5 to $15 for mid-range porcelain, and $15 to $30 or more for large-format, natural stone, or imported designer tile. For the wall tile in a shower or tub surround, costs follow a similar range. The total material cost for tile in an average bathroom (floor plus tub surround) using mid-range porcelain ranges from $400 to $900 in tile alone.",
          "Add grout, thinset mortar, and backer board. Thinset runs roughly $20 to $35 per 50-pound bag, which covers about 40 to 60 square feet at 3/16-inch notch trowel. Grout comes in sanded (for joints wider than 1/8 inch) and unsanded (for narrow joints) varieties and costs $15 to $25 per bag covering 50 to 100 square feet depending on tile size and joint width. Cement board (backer board) for the shower walls costs $10 to $15 per 3x5 sheet. For a full bathroom tile job, budget an additional $200 to $400 in materials beyond the tile itself."
        ]
      },
      {
        "heading": "Labor Cost for Bathroom Tile",
        "body": [
          "Professional tile installation typically runs $8 to $20 per square foot for labor, depending on tile size, layout complexity, region, and the contractor. Large-format tile (24x24 or bigger) often costs more to install because each piece requires a perfectly flat surface and more time to set. Mosaic tile with many small pieces takes longer to set than standard field tile, so its labor cost is higher per square foot as well. A diagonal or herringbone layout adds roughly 15 to 25 percent to the labor cost over a straight grid pattern.",
          "For a standard bathroom with a 40 sq ft floor, 60 sq ft tub surround, and 9 sq ft shower floor using standard porcelain tile in a straight layout, expect $800 to $1,600 in labor on top of materials. Total project cost (materials plus labor) for a bathroom tile job in the average size and material tier runs $1,500 to $3,500. Upgrading to large-format stone or complex layouts can push the total to $4,000 to $6,000 or more."
        ]
      }
    ],
    "faq": [
      {
        "q": "How do I calculate how much tile I need for a bathroom floor?",
        "a": "Measure the room length times width in feet to get square footage. Add 10 percent for a straight grid layout or 15 percent for diagonal. Divide the total by the box coverage printed on the tile carton and round up to the next whole box. For a 5x8 bathroom with 10% waste, you need 44 sq ft of tile."
      },
      {
        "q": "How much does it cost to tile a bathroom floor?",
        "a": "Bathroom floor tile material costs $1 to $15 per square foot depending on tile type. Labor adds $8 to $20 per square foot. A standard 40 sq ft bathroom floor in mid-range porcelain with standard labor runs $400 to $1,400 total for floor tile only, not including walls."
      },
      {
        "q": "How many square feet of tile do I need for a tub surround?",
        "a": "A standard 5-foot tub in a three-wall alcove tiled to 60 inches high has roughly 55 square feet of surface area. Add 10 to 15 percent for waste, bringing the order quantity to about 60 to 63 square feet. This does not include the floor tile, which is calculated separately."
      },
      {
        "q": "Should I tile behind the toilet and vanity?",
        "a": "Tiling behind a wall-hung or pedestal vanity is standard practice since those fixtures are removed during tile work anyway. For a floor-mounted vanity with a full base, tile installers typically stop at the vanity base since it will not show. For the toilet, the tile almost always runs under it — the toilet is removed, tile is laid, and the toilet is reset with a new wax ring. This adds a small reset fee but is the correct approach."
      }
    ],
    "related": [
      {"href": "/tools/bathroom-tile-calculator", "label": "Bathroom Tile Calculator"},
      {"href": "/tools/tile-calculator", "label": "Tile Calculator"},
      {"href": "/tools/grout-calculator", "label": "Grout Calculator"},
      {"href": "/blog/how-to-estimate-tile-for-a-bathroom", "label": "How to Estimate Tile for a Bathroom"}
    ]
  },
  {
    "slug": "framing-cost-per-square-foot",
    "title": "Framing Cost Per Square Foot: What Contractors Charge (2024)",
    "description": "A breakdown of house framing costs per square foot for walls, floors, and roofs — with material and labor splits, regional differences, and tips for getting accurate contractor bids.",
    "keywords": [
      "framing cost per square foot",
      "house framing cost",
      "wall framing cost",
      "framing labor cost",
      "framing materials cost",
      "cost to frame a house",
      "framing contractor cost",
      "structural framing cost"
    ],
    "dek": "Framing a house costs $7 to $16 per square foot on average, depending on story count, roof complexity, local lumber prices, and labor market. Wall framing alone runs $3 to $6 per square foot. Here is how to understand what you are paying for and what a fair bid looks like.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "What Is Included in Framing Cost?",
        "body": [
          "Framing cost covers the structural skeleton of a building: floor joists and subfloor decking, wall studs and plates (exterior and interior), headers over windows and doors, shear panels or let-in bracing for lateral load, and roof rafters or engineered trusses. On a full house framing bid, the contractor typically supplies labor, and the owner or general contractor supplies materials — though some framers work on a total cost basis that includes both.",
          "The line items that drive framing cost are lumber, labor, and engineered lumber or trusses. Standard dimensional lumber (2x4, 2x6, 2x10) for wall framing has fluctuated significantly in recent years — from a pre-pandemic baseline of roughly $350 per thousand board feet to peaks above $1,500, though prices have since moderated. Engineered lumber (LVL beams, I-joists, engineered rim board) is more expensive per board foot than dimensional lumber but allows longer spans without intermediate supports, which can reduce the number of load-bearing walls and simplify the design.",
          "Roof trusses are a major cost item. A set of pre-fabricated trusses for a 2,000 square foot house typically runs $8,000 to $15,000 delivered, which is why some builders use stick-framed roofs with cut rafters on simpler designs — though stick framing requires more skilled labor and takes more time."
        ]
      },
      {
        "heading": "Wall Framing Cost Per Square Foot",
        "body": [
          "Wall framing (studs, plates, headers, blocking) for a standard single-story residence runs roughly $3 to $6 per square foot of floor area. A 2,000 sq ft house with standard 8-foot walls and a moderate number of windows and doors comes out to $6,000 to $12,000 in wall framing material and labor combined. Taller walls (9-foot or 10-foot ceilings) cost more because studs must be special-ordered in longer lengths and the wall area is larger. Complex designs with vaulted ceilings, cathedral ceilings, or many corners and bump-outs cost more because each irregularity requires additional framing.",
          "For isolated wall framing work — adding a partition wall, framing a basement, or building an addition — contractors typically bid by the linear foot of wall rather than by square footage. Expect $12 to $30 per linear foot for a standard interior partition wall including material and labor. Exterior walls with insulated headers, structural sheathing, and hurricane ties cost more than interior partitions."
        ]
      },
      {
        "heading": "Floor and Roof Framing Costs",
        "body": [
          "Floor framing (joists, rim board, subfloor) for a second story or raised foundation runs $3 to $7 per square foot of floor area. Engineered I-joists, which are the standard for floor framing on most current construction, cost more in materials but allow longer spans, which means fewer beams and intermediate supports — and a quieter floor. A 1,000 sq ft second floor framed with I-joists and 3/4-inch T&G plywood decking costs roughly $3,000 to $7,000 in material and labor.",
          "Roof framing is the most variable cost because roof complexity varies so much. A simple gable or hip roof on a rectangular house can be framed with pre-manufactured trusses at $3 to $6 per square foot of floor area. A complex roof with multiple valleys, dormers, shed roofs, or cathedral ceilings that must be stick-framed can run $7 to $14 per square foot. Use a framing cost calculator to get a rough estimate for your footprint — plug in the square footage, story count, and roof style, and you will get a range that helps you evaluate contractor bids."
        ]
      },
      {
        "heading": "What Affects Framing Bids the Most",
        "body": [
          "Five factors move framing bids more than anything else: lumber prices (which have been volatile and are always worth checking against recent commodity prices), story count (two-story homes cost less per square foot to frame than one-story homes of the same area because the foundation and roof footprint are smaller), roof complexity, local labor market, and lead time. Framing crews are in high demand in active construction markets, and a tight labor market will push bids up even if material costs are flat.",
          "When reviewing framing bids, ask the contractor to separate labor from materials, specify the lumber species and grade they are bidding, confirm whether engineered lumber and trusses are included in the bid or by separate supply agreement, and clarify what is not included (usually temporary bracing removal, rough window and door bucks, and any steel beams). A well-itemized framing bid allows you to compare contractor pricing accurately and to spot where a low bid is cutting something out that you will need to pay for separately."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much does it cost to frame a 2,000 sq ft house?",
        "a": "Framing a full 2,000 sq ft house typically costs $14,000 to $32,000 in total, including materials and labor. That works out to roughly $7 to $16 per square foot. Costs vary significantly based on story count, roof complexity, lumber prices at the time of construction, and local labor rates."
      },
      {
        "q": "Is framing labor or materials the bigger cost?",
        "a": "In most markets, materials account for about 50 to 60 percent of framing cost and labor is 40 to 50 percent. Lumber price spikes (as happened in 2021) can push materials to 65 to 70 percent of the total. When lumber prices are elevated, it is worth exploring engineered lumber or design changes that reduce lumber volume."
      },
      {
        "q": "How much does it cost to frame a single wall?",
        "a": "Interior partition walls typically cost $12 to $30 per linear foot including materials and labor for standard 8-foot height. A 10-foot interior wall runs $120 to $300. Exterior walls with structural sheathing, insulated headers, and code-required hardware cost $25 to $45 per linear foot installed."
      },
      {
        "q": "Why is framing cost per square foot lower for two-story homes?",
        "a": "A two-story home with 2,000 sq ft of living space has a 1,000 sq ft footprint, meaning a smaller foundation, less roofing area, and less exterior wall area compared to a single-story 2,000 sq ft home. Since floor area is larger relative to the envelope, the framing cost per square foot is lower for two-story homes — typically $2 to $4 less per square foot than a comparable one-story design."
      }
    ],
    "related": [
      {"href": "/tools/framing-cost-calculator", "label": "Framing Cost Calculator"},
      {"href": "/tools/stud-calculator", "label": "Stud Calculator"},
      {"href": "/tools/joist-calculator", "label": "Joist Calculator"},
      {"href": "/blog/wall-framing-stud-spacing-guide", "label": "Wall Framing & Stud Spacing Guide"}
    ]
  },
  {
    "slug": "how-much-mortar-do-i-need",
    "title": "How Much Mortar Do I Need? Brick, Block & Tile Guide",
    "description": "Calculate mortar quantities for brick walls, concrete block, stone, and tile — with bag coverage estimates, mix ratios, and tips on buying the right amount for your project.",
    "keywords": [
      "how much mortar do i need",
      "mortar calculator",
      "mortar for brick",
      "mortar coverage per bag",
      "mortar mix ratio",
      "thinset mortar coverage",
      "how much mortar for concrete block",
      "mortar estimate"
    ],
    "dek": "One 60-pound bag of premixed mortar covers roughly 30 to 40 bricks for standard brick laying, or about 8 to 10 concrete blocks. For tile thinset, one 50-pound bag covers 40 to 60 square feet at standard thickness. Here is how to calculate mortar for any masonry project.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "Mortar for Brick Walls",
        "body": [
          "Brick mortar coverage depends on brick size, joint thickness, and mortar type (pre-mixed vs. site-batched). For standard modular brick (7-5/8 x 3-5/8 x 2-1/4 inches) with a 3/8-inch mortar joint, the rule of thumb is approximately 7 cubic feet of mortar per 1,000 bricks, which works out to one 60-pound bag of premixed mortar per 30 to 40 bricks. A 100-square-foot brick wall in standard running bond pattern contains roughly 700 bricks (7 bricks per square foot), so it needs about 18 to 20 bags of premixed mortar.",
          "For larger blocks — traditional 8x8x16 concrete masonry units (CMU) — mortar consumption per unit goes up because the joints are longer and the beds are thicker. A 60-pound bag of mortar covers roughly 8 to 10 standard CMU blocks. A 100 sq ft concrete block wall at one block thick (about 113 blocks) needs 12 to 14 bags. Factor in a 10 to 15 percent overage for waste, mixing errors, and the mortar that ends up on the ground during learning curve.",
          "Always check the coverage printed on the mortar bag for the brand you are buying — coverage varies between manufacturers and formulations. The mortar calculator on ProBuildCalc lets you input wall area, unit type, and joint size to get a bag count matched to your specific project."
        ]
      },
      {
        "heading": "Mortar Mix Ratios: What They Mean",
        "body": [
          "Mortar is a mixture of Portland cement, hydrated lime, and mason's sand in ratios that vary by application. Type S mortar (1 part Portland cement, 1/2 part lime, 4.5 parts sand) is the most common specification for below-grade, load-bearing, or high-strength masonry work. Type N mortar (1 part cement, 1 part lime, 6 parts sand) is a softer mix used for above-grade, non-load-bearing applications and is the most common general-purpose masonry mortar. Type M is high-strength for foundations and below-grade; Type O is low-strength for non-load-bearing interior work.",
          "For most homeowner projects — brick veneer, garden walls, chimney repointing — Type N is the right specification and the most available premixed product at home centers. If you are batching on-site, buy Portland cement, Type S hydrated lime, and coarse mason's sand separately. A standard Type N batch is approximately 1 bag Portland cement (94 lbs), 1 bag lime (50 lbs), and 4 to 5 cubic feet of sand, which makes about 4.5 cubic feet of finished mortar and covers roughly 700 to 800 bricks."
        ]
      },
      {
        "heading": "Thinset Mortar for Tile",
        "body": [
          "Thinset mortar (also called tile adhesive or tile mortar) is a different product from masonry mortar. It is a Portland cement-based adhesive used to bond ceramic, porcelain, and stone tile to floors and walls. Coverage depends heavily on trowel notch size, which is chosen based on tile size. A 3/16-inch V-notch trowel for small tile (under 4x4) covers about 55 to 65 square feet per 50-pound bag. A 1/4x1/4-inch square notch for medium tile (4x4 to 12x12) covers 40 to 55 square feet. A 1/2x1/2-inch square notch for large-format tile (12x12 and bigger) covers 30 to 40 square feet.",
          "The reason large tile needs a bigger notch is back-buttering and ensuring full coverage — with large tile you need more mortar mass to fill any unevenness in the substrate. For large-format porcelain (24x24 and above), a 3/4-inch notch trowel drops coverage to about 20 to 30 square feet per bag, meaning a 200 sq ft floor installation can require 7 to 10 bags of thinset. Always add 10 to 15 percent to your calculated thinset quantity for waste, cleanup, and the mortar left in the bucket."
        ]
      },
      {
        "heading": "Estimating and Buying the Right Amount",
        "body": [
          "The biggest mistake homeowners make with mortar is underbuying and then discovering the product is out of stock or from a different lot when they return to the store. Mortar is not a critical dye-lot match item the way tile is, but consistency in batch batching matters for color consistency in grout joints, particularly with gray or tan tinted mortars. Buy all the mortar you need upfront, then return unopened bags if you have significant overage.",
          "To estimate mortar for a project: determine the total area or unit count, find the per-unit or per-square-foot coverage for the mortar type you are using (from the bag or manufacturer's spec sheet), divide total by coverage, and add 10 to 15 percent for waste and error. Use the ProBuildCalc mortar calculator to do this math instantly — choose your masonry unit type or tile size, enter the area, and get a bag count and approximate cost range."
        ]
      }
    ],
    "faq": [
      {
        "q": "How many bags of mortar do I need for 100 bricks?",
        "a": "At roughly 30 to 40 bricks per 60-pound bag of premixed mortar, 100 bricks needs 3 to 4 bags. Always add 10 to 15 percent overage — buy 4 bags for a 100-brick project to account for waste, mixing, and mortar dropped during installation."
      },
      {
        "q": "What is the difference between mortar and thinset?",
        "a": "Traditional masonry mortar (used for laying brick, block, or stone) contains Portland cement, lime, and sand. Thinset mortar (used for tile) is a Portland cement-based adhesive without lime, often containing polymer additives for adhesion. Do not use masonry mortar to set tile or thinset to lay brick — they are different products for different applications."
      },
      {
        "q": "How do I know what notch trowel size to use for thinset?",
        "a": "Trowel notch size is determined by tile size. For tile under 4x4 inches, use a 3/16-inch V-notch. For 4x4 to 12x12, use a 1/4x1/4-inch square notch. For 12x12 to 18x18, use a 1/4x3/8-inch notch. For tile larger than 18x18, use a 1/2x1/2 inch or larger. When in doubt, use the next size up — insufficient mortar coverage causes tiles to crack or hollow out over time."
      },
      {
        "q": "How long does unmixed mortar last in the bag?",
        "a": "Dry premixed mortar and Portland cement have a shelf life of about 6 to 12 months in an unopened bag stored off the ground in a dry location. Once a bag is opened, moisture from the air begins to degrade the cement content — use opened bags within a few weeks. Never use mortar that has clumped or hardened in the bag, as the cement has already partially hydrated and will not develop full strength."
      }
    ],
    "related": [
      {"href": "/tools/mortar-calculator", "label": "Mortar Calculator"},
      {"href": "/tools/brick-calculator", "label": "Brick Calculator"},
      {"href": "/tools/grout-calculator", "label": "Grout Calculator"},
      {"href": "/blog/how-to-estimate-brick-and-block", "label": "How to Estimate Brick and Block"}
    ]
  },
  {
    "slug": "pex-pipe-sizing-guide",
    "title": "PEX Pipe Sizing Guide: How Much Pipe Do You Need?",
    "description": "A practical guide to sizing PEX pipe for plumbing and radiant heat systems — with pipe diameter selection, footage calculations, and tips on a, b, and c type differences.",
    "keywords": [
      "pex pipe sizing",
      "how much pex pipe do i need",
      "pex pipe calculator",
      "pex tubing sizing",
      "radiant heat pex pipe",
      "pex plumbing guide",
      "pex pipe diameter",
      "pex pipe installation"
    ],
    "dek": "For radiant floor heat, plan on 1 linear foot of PEX per square foot of floor area at 12-inch spacing, or 1.5 feet per square foot at 8-inch spacing. For plumbing, size by fixture count and distance from the manifold. Here is how to calculate both.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "PEX for Radiant Floor Heat: How to Calculate",
        "body": [
          "Radiant floor heating systems embed PEX tubing in the floor (in a concrete slab, gypcrete topping, or between subfloor and finish floor) and circulate warm water through it. The amount of PEX you need depends on the floor area and the spacing between runs. The two most common spacings are 12 inches on center and 8 inches on center — closer spacing delivers more heat per square foot, which is needed in high-heat-loss areas like rooms with lots of glass or in colder climates.",
          "The calculation is: square footage of the heated area divided by spacing (in feet) gives linear feet of tubing. At 12-inch spacing (1 foot between runs), a 200 sq ft room needs 200 linear feet of PEX. At 8-inch spacing (0.67 feet between centers), the same 200 sq ft room needs 200 divided by 0.67 = 300 linear feet. Add 10 to 15 percent for the runs from the manifold to the loop start point and back, plus the curves at each end that eat into straight-run efficiency. A 200 sq ft room at 12-inch spacing needs about 220 to 230 feet of PEX in total.",
          "Each loop should be a single continuous run from the manifold and back — do not splice PEX within the slab or subfloor. Keep individual loops under 300 feet to maintain proper flow and even heat distribution. If your room or zone is large, divide it into multiple loops, each connected to the manifold separately. The ProBuildCalc PEX pipe calculator handles this — enter the room area, choose your spacing, and it outputs total footage and number of loops."
        ]
      },
      {
        "heading": "PEX for Plumbing: Sizing by Fixture and Flow",
        "body": [
          "For domestic plumbing, PEX is sized by the fixture load it serves. The main trunk line from the water heater or main shutoff is typically 3/4 inch or 1 inch, depending on the number of fixtures in the home. Individual branch lines to single fixtures (a toilet, a bathroom sink, a washing machine) are typically 1/2 inch. A branch that serves multiple fixtures — say, a bathroom with a toilet, sink, and shower — may start at 3/4 inch before splitting to 1/2-inch branches at each fixture.",
          "The home-run manifold system, where each fixture gets its own dedicated 1/2-inch line from a central manifold, simplifies sizing because every branch is 1/2 inch and you size the manifold supply line (usually 3/4 inch) based on total fixture count. For a typical 3-bathroom house with kitchen and laundry, budget about 400 to 600 feet of 1/2-inch PEX for the branches and 50 to 100 feet of 3/4-inch PEX for the supply trunk lines. Measure the actual run from the manifold to each fixture location — PEX is installed in continuous runs, so add 10 percent for routing around obstacles and framing."
        ]
      },
      {
        "heading": "PEX-A vs PEX-B vs PEX-C: Which to Choose",
        "body": [
          "PEX tubing is manufactured three ways, and the differences affect flexibility, freeze resistance, and fitting compatibility. PEX-A (made by the Engel method) is the most flexible, has the best freeze resistance (it can expand instead of splitting in a freeze event), and uses expansion-style fittings that are inserted inside the pipe — these fittings reduce pipe diameter less than crimp fittings and are considered the best long-term solution. PEX-A is the most expensive type.",
          "PEX-B (manufactured by the silane method) is less flexible, not as freeze-resistant, and uses crimp or clamp fittings that compress around the outside of the pipe. It is the most widely available and the most affordable, and it is completely suitable for most residential plumbing and radiant heat applications. PEX-C is the least flexible and least freeze-resistant and is used less frequently in residential work. For radiant heat embedded in slabs, PEX-A is typically specified because of its superior flexibility for bending loops and its better resistance to damage during installation. For plumbing, PEX-B is a practical and cost-effective choice."
        ]
      },
      {
        "heading": "Estimating Total PEX and Fittings",
        "body": [
          "For a radiant heat project: calculate each zone's square footage, determine spacing, calculate footage per zone (area divided by spacing in feet, plus 15 percent for headers and bends), and sum the zones. Order PEX in coil lengths that match your zone runs — 300-foot and 500-foot coils are common for radiant applications. For plumbing, measure the distance from the manifold to each fixture location along the intended routing path, add 10 percent, and tally by diameter.",
          "Fittings add cost and need to be counted separately. For a manifold system, count one manifold port and two push-to-connect or compression fittings (supply and return) per fixture. For traditional trunk-and-branch plumbing, count tees, elbows, and couplings based on your pipe routing. Ball valves at the manifold, expansion tanks for closed-loop systems, and air vents for radiant loops are additional line items. A plumbing or radiant heat contractor should itemize fittings in their bid — if they do not, ask for a material breakdown before signing."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much PEX pipe do I need for a 1,000 sq ft radiant heat system?",
        "a": "At 12-inch spacing: roughly 1,000 linear feet plus 10 to 15 percent for headers and bends, so about 1,100 to 1,150 feet total. At 8-inch spacing: about 1,500 feet plus overage, so 1,650 to 1,725 feet. Divide by your maximum loop length (usually 250 to 300 feet) to find the number of loops."
      },
      {
        "q": "What size PEX do I need for a house?",
        "a": "For a typical home-run manifold system: 3/4-inch PEX for the supply trunk from the water heater or main, and 1/2-inch PEX for all individual fixture branches. A 3-bathroom house typically needs 50 to 100 feet of 3/4-inch and 400 to 600 feet of 1/2-inch PEX for a complete plumbing rough-in."
      },
      {
        "q": "Can PEX pipe freeze and burst?",
        "a": "PEX is significantly more freeze-resistant than copper or CPVC because it expands when water freezes inside it rather than splitting. PEX-A has the best freeze resistance due to its superior flexibility. That said, PEX can still fail if water freezes in it repeatedly or under extreme conditions — insulating pipes in cold spaces is still the right practice even with PEX."
      },
      {
        "q": "How far apart should PEX loops be spaced for radiant heat?",
        "a": "The two most common spacings are 12 inches on center for typical heating loads and 8 inches on center for high-heat-loss areas or where faster floor surface warm-up is desired. Wider spacing (18 inches) is sometimes used in mild climates or insulated slabs. Closer spacing means more tubing but more even surface temperature distribution."
      }
    ],
    "related": [
      {"href": "/tools/pex-pipe-calculator", "label": "PEX Pipe Calculator"},
      {"href": "/tools/concrete-calculator", "label": "Concrete Calculator (Slab)"},
      {"href": "/tools/square-footage-calculator", "label": "Square Footage Calculator"},
      {"href": "/blog/how-to-estimate-attic-insulation", "label": "Insulation Estimating Guide"}
    ]
  },
  {
    "slug": "window-rough-opening-size-chart",
    "title": "Window Rough Opening Size Chart and Framing Guide",
    "description": "A complete guide to window rough opening sizes — how to calculate the RO from the window unit size, standard framing dimensions, and how to account for header depth and jack stud height.",
    "keywords": [
      "window rough opening",
      "rough opening size chart",
      "window rough opening calculator",
      "how to frame a window",
      "window rough opening dimensions",
      "window framing",
      "rough opening for window",
      "header size for window"
    ],
    "dek": "The standard rough opening for a window is the window unit width plus 2 inches and the height plus 2.5 inches — but the exact dimensions depend on the window manufacturer and your local framing practice. Here is the complete framing guide, including header sizing.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "What Is a Rough Opening and How Is It Calculated?",
        "body": [
          "A rough opening (RO) is the framed hole in the wall into which a window or door unit is installed. The RO is larger than the window's nominal or unit size to allow for shimming, leveling, and the window's nailing flanges. The standard rule of thumb for windows is: rough opening width = window unit width + 2 inches, and rough opening height = window unit height + 2.5 inches. So a 36-inch wide by 48-inch tall window unit requires a rough opening of 38 inches wide by 50.5 inches tall.",
          "The extra 2 inches in width (1 inch on each side) allows for shimming the window plumb and level and provides clearance for the nailing flanges. The extra 2.5 inches in height accounts for shimming under the sill plate and clearance at the top. Some window manufacturers specify different tolerances — always check the installation instructions for the specific window you are installing, because premium windows with integral fins or between-the-studs installation may have slightly different requirements.",
          "The ProBuildCalc window rough opening calculator lets you input the window unit size and it outputs the framing dimensions — RO width, RO height, jack stud height, sill plate height, and header size — so you can lay out the wall before cutting studs."
        ]
      },
      {
        "heading": "Framing Components: King Studs, Jack Studs, and Sill",
        "body": [
          "A framed window opening has four key structural members beyond the regular stud layout. The king studs are full-height studs on each side of the opening that run from bottom plate to top plate. The jack studs (also called trimmer studs) are shorter studs that sit inside the king studs and support the header. The header spans the top of the rough opening and carries the load from above. The rough sill is a horizontal member at the bottom of the opening, and cripple studs fill the space between the rough sill and the bottom plate.",
          "Jack stud height is the rough opening height plus the sill height from the floor, minus the header depth. For a window with an 8-inch header (common for wider windows in load-bearing walls), the jack stud height for a 50.5-inch RO at a sill height of 36 inches from the subfloor would be 36 + 50.5 = 86.5 inches from subfloor to top of RO, minus the header depth of 8 inches = 78.5 inches for the jack stud. This is the calculation that trips up most first-timers — the rough opening height on the plans is measured from the sill to the underside of the header, not from the floor."
        ]
      },
      {
        "heading": "Header Size by Span",
        "body": [
          "The header carries the load above the window and must be sized for the span (the rough opening width) and whether the wall is load-bearing. In a non-load-bearing wall, a single 2x4 or doubled 2x4 on the flat is often sufficient. In a load-bearing wall, header size is governed by the span and the load above. Common rules of thumb for load-bearing headers (confirm with local code and an engineer for your specific situation): up to 3-foot span use doubled 2x4; 3 to 5 feet use doubled 2x6; 5 to 7 feet use doubled 2x8; 7 to 9 feet use doubled 2x10; 9 to 11 feet use doubled 2x12.",
          "LVL (laminated veneer lumber) headers are stronger than dimensional lumber of the same depth, so they can carry the same load in a shallower member. This matters when ceiling or floor structure above the window limits how deep the header can be. Engineered wood product (EWP) suppliers publish span tables for their LVL products — provide the span and load conditions and they will specify the right LVL size. For complex load situations (point loads, multi-story construction, large openings), consult a structural engineer — the cost of an engineering review is minor compared to the consequences of an undersized header."
        ]
      },
      {
        "heading": "Common Rough Opening Sizes for Standard Windows",
        "body": [
          "Standard double-hung windows come in nominal sizes based on width and height in inches, coded as, for example, a 3040 window (30 inches wide by 40 inches tall in unit dimensions). Standard residential window widths run 24, 28, 30, 32, 36, 40, 44, 48, 60, and 72 inches. Heights commonly run 36, 42, 48, 52, 54, 60, 62, and 72 inches. Using the +2/+2.5 rule: a 3040 window (30x40 unit) needs a 32x42.5 rough opening; a 4060 window (40x60 unit) needs a 42x62.5 rough opening.",
          "For egress windows in bedrooms — which must meet minimum opening area requirements of typically 5.7 square feet with a minimum width of 20 inches and minimum height of 24 inches — plan the rough opening around a compliant window unit first, then calculate the RO from the unit size. Egress requirements vary by code edition and jurisdiction, so confirm the requirements with your local building department before framing egress windows."
        ]
      }
    ],
    "faq": [
      {
        "q": "What is the standard rough opening for a window?",
        "a": "The standard rough opening is the window unit width plus 2 inches and the height plus 2.5 inches. For a 36x48 window unit, the rough opening is 38 inches wide by 50.5 inches tall. Always check the manufacturer's installation instructions, as some windows specify slightly different clearances."
      },
      {
        "q": "How do I measure a rough opening for an existing window replacement?",
        "a": "For a replacement window in an existing rough opening, measure the RO width (between the king studs) and the RO height (from the top of the sill to the underside of the header). Subtract 1/2 inch from each dimension to get the window unit size to order, giving you clearance to shim. If the existing RO is out of square, measure both diagonals — if they differ by more than 1/2 inch, the RO may need reframing."
      },
      {
        "q": "How big should the header be for a 6-foot window opening?",
        "a": "For a 6-foot opening in a load-bearing wall, a doubled 2x10 header is the common specification. If the load above is heavy (second floor, roof load) or the span is at the upper end, a doubled 2x12 or an LVL header of equivalent strength is advisable. In a non-load-bearing wall, a doubled 2x6 is typically sufficient. Confirm with your local building code requirements and a structural engineer for critical applications."
      },
      {
        "q": "What is the difference between the rough opening and the window unit size?",
        "a": "The window unit size (or nominal size) is the dimension of the window itself as manufactured. The rough opening is the framed hole in the wall, which is 2 inches wider and 2.5 inches taller than the unit size to allow for shimming and the window flanges. When ordering a window, you order by the unit size, not the rough opening size."
      }
    ],
    "related": [
      {"href": "/tools/rough-opening-calculator", "label": "Rough Opening Calculator"},
      {"href": "/tools/window-calculator", "label": "Window Calculator"},
      {"href": "/tools/stud-calculator", "label": "Stud Calculator"},
      {"href": "/blog/wall-framing-stud-spacing-guide", "label": "Wall Framing Stud Spacing Guide"}
    ]
  },
  {
    "slug": "concrete-vs-gravel-driveway",
    "title": "Concrete vs Gravel Driveway: Cost, Durability & Which to Choose",
    "description": "A comparison of concrete and gravel driveways covering installation cost per square foot, long-term maintenance, performance in wet and cold climates, and the best use cases for each.",
    "keywords": [
      "concrete vs gravel driveway",
      "gravel driveway cost",
      "gravel vs concrete driveway",
      "gravel driveway pros and cons",
      "cheapest driveway option",
      "driveway material comparison",
      "crushed stone driveway cost",
      "gravel driveway installation"
    ],
    "dek": "Gravel driveways cost $1 to $3 per square foot installed — a fraction of concrete at $8 to $18 per square foot. But gravel needs regrading every few years, gets muddy in wet conditions, and may require edging to stay contained. Here is when gravel makes sense and when to spend more on concrete.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "Cost Comparison",
        "body": [
          "Gravel (crushed stone) is the cheapest permanent driveway option. A standard 12-foot-wide, 50-foot-long driveway (600 sq ft) in gravel runs $600 to $1,800 installed including gravel delivery and spreading. That typically covers 3 to 4 inches of compacted gravel base plus a 2-inch layer of top stone. Concrete for the same footprint costs $4,800 to $10,800. Asphalt falls in between at $1,800 to $4,200.",
          "The gravel cost advantage shrinks when you account for maintenance. Gravel needs to be regraded every 2 to 5 years as it spreads, ruts, or washes away, typically costing $200 to $600 per regrading event. Adding fresh gravel to replace what has shifted out is another $150 to $400 every few years. Over 30 years, a gravel driveway that is properly maintained will cost $3,000 to $6,000 in cumulative material and maintenance — still less than one concrete installation, but the gap is smaller than the initial price suggests.",
          "For rural properties with long driveways of 200 feet or more, gravel is almost always the practical choice. At those lengths, concrete or asphalt installation cost becomes very high, while the gravel advantage compounds — a 200-foot gravel driveway at $1.50 per sq ft installed costs about $3,600 vs $28,000 or more for concrete."
        ]
      },
      {
        "heading": "Performance and Durability",
        "body": [
          "Concrete is rigid and hard — it does not move, shift, or wash away. A properly installed concrete driveway with the right base preparation and control joints can last 30 to 40 years with minimal maintenance. It handles heavy loads (RVs, trucks) without rutting and maintains a smooth, clean surface throughout its life.",
          "Gravel is more variable. Fresh, well-installed gravel with proper base compaction and a stabilizing fabric underneath can look sharp for several years. But gravel migrates: tires kick it to the edges, heavy rain washes fine particles downhill, and over time the surface develops ruts and low spots that hold water. Regular raking and periodic regrading keep gravel looking maintained, but it is an ongoing chore that concrete simply does not require. In freeze-thaw climates, gravel has one major advantage over concrete: it is not rigid, so freeze-thaw heaving does not crack it the way it can crack concrete."
        ]
      },
      {
        "heading": "Wet Weather and Drainage",
        "body": [
          "Gravel's biggest weakness is wet weather. In areas with frequent rain or in clay soils that do not drain well, a gravel driveway can become muddy and soft — this is particularly common in the Pacific Northwest, the Southeast, and other high-rainfall regions. The standard solution is a proper base: excavate 8 to 12 inches, lay geotextile fabric to separate the base from the native soil, compact crushed run (a mix of stone and fines that binds well), and then top with 2 to 3 inches of clean crushed stone. Done correctly, this drains rapidly and stays firm. Done cheaply (just dumping gravel on native soil), it turns muddy.",
          "Concrete sheds water efficiently and maintains firm footing in all weather. Drainage is managed by sloping the driveway surface (usually 1 to 2 percent slope to the sides or toward the street) so water runs off quickly. Concrete does not allow water to infiltrate like gravel does, which is a disadvantage from a stormwater management perspective — some municipalities now prefer or even require permeable surfaces for new driveways, which gives gravel another environmental advantage."
        ]
      },
      {
        "heading": "When to Choose Each",
        "body": [
          "Choose gravel when: the driveway is long (over 50 to 100 feet) and concrete cost is prohibitive; the property is rural or semi-rural and aesthetics favor a natural surface; the soil and climate allow for good gravel drainage; or you want the lowest possible upfront cost and are comfortable with periodic maintenance. Gravel is also the right choice for secondary access drives, turnaround areas, and parking pads where the surface sees less traffic.",
          "Choose concrete when: the driveway is short to medium length (under 100 feet) where the cost difference per project is manageable; the climate is hot and asphalt softening is a concern; you want a low-maintenance, permanent surface; or you want the option to stain, stamp, or customize the surface for appearance. For most suburban homeowners with a standard two-car driveway, concrete's long-term performance and minimal maintenance usually justify the higher upfront cost."
        ]
      }
    ],
    "faq": [
      {
        "q": "How much does a gravel driveway cost per square foot?",
        "a": "A properly installed gravel driveway costs $1 to $3 per square foot, including excavation, geotextile fabric, compacted base, and top stone. A standard 600 sq ft two-car driveway runs $600 to $1,800. Long rural driveways cost proportionally but are much cheaper per foot than concrete or asphalt."
      },
      {
        "q": "How long does a gravel driveway last?",
        "a": "A properly installed gravel driveway can last indefinitely if maintained. The gravel itself does not degrade, but it migrates and needs regrading and replenishing every 2 to 5 years depending on traffic, rainfall, and how well it was installed. The base (excavation and compacted crushed run under the top gravel) can last 20 to 30 years before needing attention."
      },
      {
        "q": "Does a gravel driveway need edging?",
        "a": "Edging significantly extends the life of a gravel driveway by containing the stone and preventing it from spreading into the lawn or garden beds. Common options include plastic or steel landscape edging, concrete or brick mowing strips, and wooden timbers. Edging adds cost but pays for itself in reduced regrading frequency."
      },
      {
        "q": "What type of gravel is best for a driveway?",
        "a": "For the base layer: crushed run (also called road base or crusher run) — a mix of stone particles and fines that compacts tightly. For the top layer: 3/4-inch crushed stone, #57 stone, or pea gravel for a cleaner appearance. Avoid round river rock for driveways — it rolls and provides no traction. In cold climates, recycled asphalt millings are another popular, low-cost option for gravel driveways."
      }
    ],
    "related": [
      {"href": "/tools/driveway-cost-calculator", "label": "Driveway Cost Calculator"},
      {"href": "/tools/gravel-calculator", "label": "Gravel Calculator"},
      {"href": "/tools/concrete-calculator", "label": "Concrete Calculator"},
      {"href": "/blog/concrete-vs-asphalt-driveway-cost", "label": "Concrete vs Asphalt Driveway"}
    ]
  },
  {
    "slug": "tile-vs-lvp-flooring-for-contractors",
    "title": "Tile vs LVP Flooring: A Contractor's Guide to Estimating and Choosing",
    "description": "A practical comparison of ceramic/porcelain tile and luxury vinyl plank for contractors — covering installation speed, material cost, waste factors, durability, and which trades each favors.",
    "keywords": [
      "tile vs LVP flooring",
      "luxury vinyl plank vs tile",
      "LVP vs ceramic tile",
      "tile or LVP for bathroom",
      "LVP flooring cost vs tile",
      "which is better tile or vinyl plank",
      "flooring comparison contractors",
      "tile vs vinyl plank kitchen"
    ],
    "dek": "LVP installs faster and costs less in labor, but tile lasts longer in wet areas and adds more resale value. For a contractor, the choice often comes down to the room, the budget, and how fast the job needs to turn around. Here is what the numbers actually look like.",
    "date": "2026-06-07",
    "sections": [
      {
        "heading": "Material Cost Comparison",
        "body": [
          "Entry-level LVP runs $1.50 to $3.50 per square foot for the flooring alone. Mid-range LVP with a thicker wear layer (12 mil or more) and realistic wood or stone visuals runs $3 to $6 per square foot. Premium waterproof LVP with rigid core construction goes $5 to $10 per square foot. Standard ceramic tile starts around $1 to $3 per square foot for basic floor tile and runs $5 to $15 for mid-range porcelain. Large-format or specialty tile pushes $15 to $40 or more per square foot. On material cost alone, LVP and tile overlap significantly in the mid-range — the real cost difference shows up in labor.",
          "LVP typically requires underlayment ($0.25 to $0.75 per sq ft for standard foam, or integrated into rigid-core products), transitions at doorways and changes in floor height ($5 to $25 each), and installation adhesive in some cases (most floating LVP does not require glue). Tile requires thinset mortar ($0.15 to $0.40 per sq ft), grout ($0.10 to $0.30 per sq ft), cement board in wet areas ($0.50 to $1 per sq ft), and grout sealer. Total installed material cost — tile plus mortar, grout, and backer — often ends up $1 to $2 per sq ft higher than LVP for comparable-grade products."
        ]
      },
      {
        "heading": "Labor Speed and Installation Cost",
        "body": [
          "LVP is significantly faster to install than tile. A skilled installer can cover 300 to 500 square feet of click-lock floating LVP per day with minimal prep work on a flat subfloor. Tile installation runs 100 to 200 square feet per day for standard floor tile in a straight layout, and closer to 75 to 150 sq ft per day for large-format tile or complex patterns. For a contractor, that speed difference translates directly to job profitability.",
          "Labor rates reflect this: LVP installation runs $2 to $5 per square foot, while tile installation runs $6 to $14 per square foot. The labor gap is the dominant factor in total installed cost — a 500 sq ft floor in mid-range LVP might cost $3,500 to $5,000 installed, while the same area in comparable porcelain tile costs $6,000 to $10,000. For homeowners on a budget and contractors trying to stay competitive on a per-job basis, LVP's labor advantage is significant."
        ]
      },
      {
        "heading": "Durability and Performance by Room",
        "body": [
          "For dry living areas — bedrooms, living rooms, hallways — LVP performs extremely well. Modern rigid-core LVP with a 12-mil or thicker wear layer is scratch-resistant, waterproof, and holds up to heavy residential traffic. It handles temperature fluctuations less well than tile (LVP expands and contracts with temperature, requiring expansion gaps at all walls and transitions), and it cannot be used with radiant floor heating systems above certain temperatures without checking manufacturer specifications.",
          "In wet areas — bathrooms, laundry rooms, and kitchen — the right choice depends on the level of moisture exposure. LVP is waterproof at the surface level, but water that gets under LVP through gaps at transitions or penetrations can cause the subfloor to deteriorate. Tile, properly installed with waterproof membrane in showers and tubs and grout properly sealed, is impervious to water at every layer. For showers and tub surrounds, tile is the only practical option. For bathroom floors, both tile and LVP work well, but tile's permanent seal with grout (when sealed) gives it an edge in longevity in high-moisture environments."
        ]
      },
      {
        "heading": "Waste Factors and Estimating",
        "body": [
          "Both products require waste factors for cuts, pattern matching, and breakage. LVP waste is typically 5 to 10 percent for a straight lay (parallel to walls), and 10 to 15 percent for a diagonal layout. Because LVP planks are long (usually 48 to 72 inches), hallways and small rooms with many cuts have higher waste than large open areas. Tile waste runs 10 percent for a straight grid layout, 15 percent for diagonal, and 15 to 20 percent for herringbone or complex patterns. Small tile (2x2 penny tile, 3x3 subway) also wastes more because there are more cuts.",
          "For a 500 sq ft floor in LVP at 10 percent waste, order 550 sq ft. At 22 sq ft per carton, that's 25 cartons. For tile, the same 500 sq ft at 10 percent waste is 550 sq ft. Divide by carton coverage (varies by tile — check the box) and round up. Use the ProBuildCalc flooring and tile calculators to get the box count for your specific product coverage rate, including waste, without doing the math by hand on every job."
        ]
      }
    ],
    "faq": [
      {
        "q": "Is LVP cheaper than tile to install?",
        "a": "Yes, significantly. LVP labor runs $2 to $5 per square foot vs $6 to $14 for tile. For a 500 sq ft floor, LVP saves $2,000 to $4,500 in labor alone. Material costs are comparable in the mid-range. Total installed cost: LVP at $5 to $11 per sq ft vs tile at $8 to $20 per sq ft."
      },
      {
        "q": "Does tile last longer than LVP?",
        "a": "Properly installed ceramic or porcelain tile with sealed grout can last 50 to 100 years. High-quality LVP with a thick wear layer (20+ mil commercial grade) lasts 25 to 30 years in residential use; standard 12-mil residential LVP lasts 15 to 25 years. For permanent flooring in a house you plan to own long-term, tile has a longevity advantage in high-traffic areas."
      },
      {
        "q": "Can you use LVP in a bathroom?",
        "a": "Yes, on bathroom floors. Rigid-core waterproof LVP is suitable for bathroom floors as long as transitions and penetrations are properly sealed and there is no standing water risk. LVP should not be used in wet showers or anywhere water will pool on the surface for extended periods — tile is the correct material for shower walls and floors."
      },
      {
        "q": "Which has better resale value — tile or LVP?",
        "a": "Tile generally adds more resale value, particularly in kitchens and bathrooms, because buyers associate it with permanence and quality. However, high-quality LVP is increasingly accepted by buyers as a durable, attractive option — especially in living areas. Cheap LVP is easy for buyers to spot and can hurt perceived value. If resale is the goal, use at least 12-mil commercial-grade LVP or go with tile in high-visibility areas."
      }
    ],
    "related": [
      {"href": "/tools/tile-calculator", "label": "Tile Calculator"},
      {"href": "/tools/flooring-calculator", "label": "Flooring Calculator"},
      {"href": "/tools/bathroom-tile-calculator", "label": "Bathroom Tile Calculator"},
      {"href": "/blog/how-to-estimate-flooring-materials", "label": "How to Estimate Flooring Materials"}
    ]
  }
]

# Load the file
with open('src/app/blog/posts.ts', 'r') as f:
    content = f.read()

# Build the new posts TypeScript string
def post_to_ts(post):
    return json.dumps(post, indent=2, ensure_ascii=False)

new_ts = ',\n  '.join(post_to_ts(p) for p in NEW_POSTS)
injection = f',\n  {new_ts}'

# Find the insertion point: right before the closing ];
insert_pos = content.rfind('\n];')
if insert_pos == -1:
    raise ValueError("Could not find closing ]; in posts.ts")

new_content = content[:insert_pos] + injection + content[insert_pos:]

with open('src/app/blog/posts.ts', 'w') as f:
    f.write(new_content)

# Verify
import re
slugs = re.findall(r'"slug": "([^"]+)"', new_content)
print(f"Total posts after injection: {len(slugs)}")
print("New posts:")
for s in slugs[-10:]:
    print(f"  {s}")
