export interface CityServiceArea {
  slug: string;
  cityName: string;
  county: string;
  zipCodes: string[];
  headline: string;
  localIntro: string;
  keyProjects: string[];
  code?: string;
  neighborhoods?: string[];
  active?: boolean;
}

export const cityServiceAreas: CityServiceArea[] = [
  {
    "slug": "fort-worth",
    "cityName": "Fort Worth",
    "county": "Tarrant County",
    "code": "FW",
    "zipCodes": [
      "76102",
      "76104",
      "76107",
      "76116",
      "76132"
    ],
    "headline": "Dumpster Rental in Fort Worth, TX",
    "localIntro": "Priority scheduling and roll-off dumpster rentals delivered directly to Fort Worth homeowners, general contractors, and business sites with wood driveway protection included.",
    "keyProjects": [
      "Residential cleanouts near Cultural District & TCU",
      "Commercial demolition debris in Downtown Fort Worth",
      "Roofing tear-offs and contractor jobs"
    ],
    "neighborhoods": [
      "Downtown",
      "Cultural District",
      "TCU Area",
      "Stockyards",
      "Westover Hills"
    ],
    "active": true
  },
  {
    "slug": "arlington",
    "cityName": "Arlington",
    "county": "Tarrant County",
    "code": "ARL",
    "zipCodes": [
      "76010",
      "76011",
      "76017",
      "76018"
    ],
    "headline": "Dumpster Rental in Arlington, TX",
    "localIntro": "Fast, reliable roll-off dumpster containers for Arlington homeowners, remodelers, and commercial facilities near the Entertainment District and UTA.",
    "keyProjects": [
      "Kitchen & bath remodel demolition",
      "Entertainment District commercial renovations",
      "Garage and attic clearouts"
    ],
    "neighborhoods": [
      "Entertainment District",
      "North Arlington",
      "South Arlington",
      "Pantego area",
      "UTA campus area"
    ],
    "active": true
  },
  {
    "slug": "keller",
    "cityName": "Keller",
    "county": "Tarrant County",
    "code": "KEL",
    "zipCodes": [
      "76244",
      "76248"
    ],
    "headline": "Dumpster Rental in Keller, TX",
    "localIntro": "Lone Wolf Dumpsters provides driveway-friendly 15, 20, and 25-yard roll-off dumpster rentals throughout Keller and surrounding North Tarrant County neighborhoods.",
    "keyProjects": [
      "Residential kitchen & bath remodels in Keller",
      "Garage & attic clearouts near Keller Town Center",
      "Roofing shingle tear-offs and contractor jobs"
    ],
    "neighborhoods": [
      "Keller Town Center",
      "Hidden Lakes",
      "Marshall Ridge",
      "Overton Ridge"
    ],
    "active": true
  },
  {
    "slug": "southlake",
    "cityName": "Southlake",
    "county": "Tarrant County",
    "code": "SL",
    "zipCodes": [
      "76092"
    ],
    "headline": "Dumpster Rental in Southlake, TX",
    "localIntro": "Professional roll-off dumpster rentals with careful driveway surface protection for Southlake residences and construction sites near Southlake Town Square.",
    "keyProjects": [
      "Custom home renovation waste removal",
      "Kitchen remodel & cabinetry disposal",
      "Property cleanups and roofing tear-offs"
    ],
    "neighborhoods": [
      "Southlake Town Square",
      "Carillon",
      "Monticello",
      "Clariden Ranch"
    ],
    "active": true
  },
  {
    "slug": "colleyville",
    "cityName": "Colleyville",
    "county": "Tarrant County",
    "code": "COL",
    "zipCodes": [
      "76034"
    ],
    "headline": "Dumpster Rental in Colleyville, TX",
    "localIntro": "Prompt, driveway-safe roll-off dumpster delivery for homeowners and renovation contractors in Colleyville, TX with protective wooden driveway boards included.",
    "keyProjects": [
      "Estate cleanouts & home additions",
      "Flooring tear-out & luxury remodel debris",
      "Landscaping waste & brush disposal"
    ],
    "neighborhoods": [
      "Leyton Grove",
      "Warwick Parc",
      "Brookstone",
      "Timarron"
    ],
    "active": true
  },
  {
    "slug": "grapevine",
    "cityName": "Grapevine",
    "county": "Tarrant County",
    "code": "GV",
    "zipCodes": [
      "76051",
      "76099"
    ],
    "headline": "Dumpster Rental in Grapevine, TX",
    "localIntro": "Upfront flat-rate roll-off dumpster containers delivered quickly across Grapevine and surrounding Lake Grapevine communities.",
    "keyProjects": [
      "Commercial retail & office tenant cleanouts",
      "Residential home decluttering & garage clearouts",
      "Contractor roofing and demolition waste"
    ],
    "neighborhoods": [
      "Historic Downtown Grapevine",
      "Lakeview",
      "Silver Lake",
      "Cannon Homestead"
    ],
    "active": true
  },
  {
    "slug": "north-richland-hills",
    "cityName": "North Richland Hills",
    "county": "Tarrant County",
    "code": "NRH",
    "zipCodes": [
      "76180",
      "76182"
    ],
    "headline": "Dumpster Rental in North Richland Hills, TX",
    "localIntro": "Dependable 15, 20, and 25-yard dumpster rentals for North Richland Hills homeowners and contractors tackling remodels and storm debris cleanups.",
    "keyProjects": [
      "Home cleanouts and basement/attic clearouts",
      "Roofing replacements after severe hail",
      "Bathroom and flooring tear-outs"
    ],
    "neighborhoods": [
      "Iron Horse",
      "Walker's Creek",
      "Foxborough",
      "Cambridge Park"
    ],
    "active": true
  },
  {
    "slug": "bedford",
    "cityName": "Bedford",
    "county": "Tarrant County",
    "code": "BED",
    "zipCodes": [
      "76021",
      "76022"
    ],
    "headline": "Dumpster Rental in Bedford, TX",
    "localIntro": "Fast mid-cities roll-off dumpster rental delivery in Bedford, TX. Upfront pricing, driveway protection, and flexible rental periods.",
    "keyProjects": [
      "HEB area residential clearouts",
      "Kitchen and bathroom updates",
      "Fencing and deck demolition disposal"
    ],
    "neighborhoods": [
      "Brook Hollow",
      "Meadow Park",
      "Bedford Parc",
      "Rolling Hills"
    ],
    "active": true
  },
  {
    "slug": "euless",
    "cityName": "Euless",
    "county": "Tarrant County",
    "code": "EUL",
    "zipCodes": [
      "76039",
      "76040"
    ],
    "headline": "Dumpster Rental in Euless, TX",
    "localIntro": "Convenient roll-off dumpsters delivered on-time to Euless homes, apartments, and job sites near Glade Parks and Highway 183.",
    "keyProjects": [
      "Whole-home decluttering projects",
      "Glade Parks area contractor remodels",
      "Tenant move-out debris cleanouts"
    ],
    "neighborhoods": [
      "Glade Parks",
      "Bear Creek",
      "Midway Park",
      "Heritage District"
    ],
    "active": true
  },
  {
    "slug": "hurst",
    "cityName": "Hurst",
    "county": "Tarrant County",
    "code": "HST",
    "zipCodes": [
      "76053",
      "76054"
    ],
    "headline": "Dumpster Rental in Hurst, TX",
    "localIntro": "Driveway-safe roll-off container rentals for Hurst residential cleanouts, roofing jobs, and commercial remodel projects.",
    "keyProjects": [
      "North East Mall corridor renovations",
      "Residential yard & shed demolitions",
      "Flooring & drywall disposal"
    ],
    "neighborhoods": [
      "Bellaire",
      "Mayfair",
      "Hurst Hills",
      "Valentine Court"
    ],
    "active": true
  },
  {
    "slug": "haltom-city",
    "cityName": "Haltom City",
    "county": "Tarrant County",
    "code": "HC",
    "zipCodes": [
      "76117",
      "76137"
    ],
    "headline": "Dumpster Rental in Haltom City, TX",
    "localIntro": "Affordable, fast-response roll-off dumpster drop-offs and container swaps for Haltom City contractors and homeowners.",
    "keyProjects": [
      "Residential cleanups and estate clears",
      "Commercial shop renovations",
      "Roof tear-offs & drywall removal"
    ],
    "neighborhoods": [
      "Birdville",
      "Springlake",
      "North Park",
      "Highland Park"
    ],
    "active": true
  },
  {
    "slug": "mansfield",
    "cityName": "Mansfield",
    "county": "Tarrant County",
    "code": "MAN",
    "zipCodes": [
      "76063"
    ],
    "headline": "Dumpster Rental in Mansfield, TX",
    "localIntro": "Premier roll-off dumpster rentals for South DFW homeowners and contractors in Mansfield, TX. Wood-board driveway protection on every delivery.",
    "keyProjects": [
      "Custom home additions & garage purges",
      "Historic Downtown commercial clearouts",
      "Roofing shingle & landscaping waste"
    ],
    "neighborhoods": [
      "Historic Downtown",
      "Walnut Creek Valley",
      "Towne Crossing",
      "Matlock"
    ],
    "active": true
  },
  {
    "slug": "watauga",
    "cityName": "Watauga",
    "county": "Tarrant County",
    "code": "WAT",
    "zipCodes": [
      "76148"
    ],
    "headline": "Dumpster Rental in Watauga, TX",
    "localIntro": "Driveway-safe roll-off dumpster rentals delivered quickly across Watauga neighborhoods for remodels, roofing, and decluttering.",
    "keyProjects": [
      "Garage & attic cleanouts",
      "Kitchen updates & drywall disposal",
      "Roofing replacements"
    ],
    "neighborhoods": [
      "Park Vista",
      "Watauga Meadows",
      "Caprock",
      "Foster Village"
    ],
    "active": true
  },
  {
    "slug": "saginaw",
    "cityName": "Saginaw",
    "county": "Tarrant County",
    "code": "SAG",
    "zipCodes": [
      "76179"
    ],
    "headline": "Dumpster Rental in Saginaw, TX",
    "localIntro": "Northwest Tarrant County roll-off dumpster containers delivered on schedule to Saginaw homeowners and construction sites.",
    "keyProjects": [
      "Home cleanouts and moves",
      "Deck & patio remodeling",
      "Roofing tear-offs"
    ],
    "neighborhoods": [
      "Willow Creek",
      "Saginaw Springs",
      "Highland Station",
      "Greenfield"
    ],
    "active": true
  },
  {
    "slug": "haslet",
    "cityName": "Haslet",
    "county": "Tarrant County",
    "code": "HAS",
    "zipCodes": [
      "76052"
    ],
    "headline": "Dumpster Rental in Haslet, TX",
    "localIntro": "Fast dispatch to Haslet and the Alliance corridor for new home construction, remodeling jobs, and estate cleanups.",
    "keyProjects": [
      "Alliance area commercial jobs",
      "Residential home clearouts",
      "Roofing and fencing disposal"
    ],
    "neighborhoods": [
      "Alliance Corridor",
      "Haslet Heights",
      "Caribou Ridge",
      "Sendera Ranch"
    ],
    "active": true
  },
  {
    "slug": "richland-hills",
    "cityName": "Richland Hills",
    "county": "Tarrant County",
    "code": "RH",
    "zipCodes": [
      "76118"
    ],
    "headline": "Dumpster Rental in Richland Hills, TX",
    "localIntro": "Compact, driveway-safe roll-off dumpsters placed carefully in tight residential driveways across Richland Hills.",
    "keyProjects": [
      "Single-room remodels & purges",
      "Flooring tear-outs",
      "Yard debris disposal"
    ],
    "neighborhoods": [
      "Rosebud",
      "Richland Park",
      "Windsor Park",
      "Popplewell"
    ],
    "active": true
  },
  {
    "slug": "kennedale",
    "cityName": "Kennedale",
    "county": "Tarrant County",
    "code": "KEN",
    "zipCodes": [
      "76060"
    ],
    "headline": "Dumpster Rental in Kennedale, TX",
    "localIntro": "Dependable dumpster rental service for Southeast Tarrant County homeowners, auto shops, and contractors in Kennedale.",
    "keyProjects": [
      "Residential moves & garage purges",
      "Shop & warehouse cleanouts",
      "Construction waste removal"
    ],
    "neighborhoods": [
      "Steeplechase",
      "Sonora",
      "Town Center",
      "Shady Creek"
    ],
    "active": true
  },
  {
    "slug": "lake-worth",
    "cityName": "Lake Worth",
    "county": "Tarrant County",
    "code": "LW",
    "zipCodes": [
      "76135"
    ],
    "headline": "Dumpster Rental in Lake Worth, TX",
    "localIntro": "Direct roll-off container delivery around Lake Worth and Highway 199 for residential remodels and lake property clearouts.",
    "keyProjects": [
      "Lake cabin & home renovations",
      "Commercial cleanouts",
      "Deck & dock tear-outs"
    ],
    "neighborhoods": [
      "Lakeshore Drive",
      "Hwy 199 Corridor",
      "Indian Oaks",
      "Marina District"
    ],
    "active": true
  },
  {
    "slug": "white-settlement",
    "cityName": "White Settlement",
    "county": "Tarrant County",
    "code": "WS",
    "zipCodes": [
      "76108"
    ],
    "headline": "Dumpster Rental in White Settlement, TX",
    "localIntro": "West Fort Worth roll-off dumpster rentals delivered promptly to White Settlement homes and commercial sites.",
    "keyProjects": [
      "Garage & whole-house purges",
      "Roofing tear-offs",
      "Flooring & tile removal"
    ],
    "neighborhoods": [
      "Cherry Lane",
      "Nasal Road Area",
      "Westgate",
      "Central District"
    ],
    "active": true
  },
  {
    "slug": "river-oaks",
    "cityName": "River Oaks",
    "county": "Tarrant County",
    "code": "RO",
    "zipCodes": [
      "76114"
    ],
    "headline": "Dumpster Rental in River Oaks, TX",
    "localIntro": "Clean, driveway-safe dumpster rentals for homeowners and contractors in River Oaks, TX with flat upfront rates.",
    "keyProjects": [
      "Home remodeling & painting prep",
      "Estate cleanouts",
      "Yard debris and landscaping cleanup"
    ],
    "neighborhoods": [
      "River Oaks Blvd Area",
      "West Castle",
      "Blackstone",
      "Park District"
    ],
    "active": true
  },
  {
    "slug": "forest-hill",
    "cityName": "Forest Hill",
    "county": "Tarrant County",
    "code": "FH",
    "zipCodes": [
      "76140"
    ],
    "headline": "Dumpster Rental in Forest Hill, TX",
    "localIntro": "South Fort Worth roll-off dumpster containers for residential cleanups, commercial demolitions, and roofing tear-offs.",
    "keyProjects": [
      "Commercial property clearouts",
      "Home garage & attic purges",
      "Storm debris removal"
    ],
    "neighborhoods": [
      "Forest Hill Drive Area",
      "Wichita Street Corridor",
      "Oak View",
      "Meadowbrook South"
    ],
    "active": true
  },
  {
    "slug": "everman",
    "cityName": "Everman",
    "county": "Tarrant County",
    "code": "EVR",
    "zipCodes": [
      "76140"
    ],
    "headline": "Dumpster Rental in Everman, TX",
    "localIntro": "Affordable, reliable roll-off dumpster rentals delivered to Everman homes and businesses with no hidden delivery surcharges.",
    "keyProjects": [
      "Residential remodeling projects",
      "Yard debris & fence removal",
      "Property cleanups"
    ],
    "neighborhoods": [
      "Race Street Area",
      "Town Center",
      "Everman Park",
      "South Tarrant View"
    ],
    "active": true
  },
  {
    "slug": "edgecliff-village",
    "cityName": "Edgecliff Village",
    "county": "Tarrant County",
    "code": "EV",
    "zipCodes": [
      "76134"
    ],
    "headline": "Dumpster Rental in Edgecliff Village, TX",
    "localIntro": "Driveway-safe roll-off dumpsters delivered directly to Edgecliff Village residences for decluttering and remodels.",
    "keyProjects": [
      "Single bathroom & kitchen updates",
      "Garage decluttering",
      "Flooring tear-outs"
    ],
    "neighborhoods": [
      "Village Green",
      "South Cliff",
      "Crestview",
      "Edgecliff Park"
    ],
    "active": true
  },
  {
    "slug": "blue-mound",
    "cityName": "Blue Mound",
    "county": "Tarrant County",
    "code": "BM",
    "zipCodes": [
      "76131"
    ],
    "headline": "Dumpster Rental in Blue Mound, TX",
    "localIntro": "Prompt, dependable roll-off container delivery in Blue Mound for home remodels, contractor jobs, and cleanouts.",
    "keyProjects": [
      "Attic & garage cleanouts",
      "Roofing shingle disposal",
      "Drywall & framing debris"
    ],
    "neighborhoods": [
      "Blue Mound Central",
      "North Industrial",
      "Wayside",
      "Saginaw Border"
    ],
    "active": true
  },
  {
    "slug": "sansom-park",
    "cityName": "Sansom Park",
    "county": "Tarrant County",
    "code": "SP",
    "zipCodes": [
      "76164"
    ],
    "headline": "Dumpster Rental in Sansom Park, TX",
    "localIntro": "Fast dumpster drop-offs and container pickups for Sansom Park residences and contractor work sites.",
    "keyProjects": [
      "Residential renovation debris",
      "Estate cleanouts",
      "Fencing & deck tear-downs"
    ],
    "neighborhoods": [
      "Jacksboro Highway Corridor",
      "Cowtown View",
      "Sansom Heights",
      "West Fork"
    ],
    "active": true
  },
  {
    "slug": "lakeside",
    "cityName": "Lakeside",
    "county": "Tarrant County",
    "code": "LS",
    "zipCodes": [
      "76135"
    ],
    "headline": "Dumpster Rental in Lakeside, TX",
    "localIntro": "West Tarrant County roll-off dumpster services for Lakeside waterfront properties, home remodels, and land cleanups.",
    "keyProjects": [
      "Waterfront property renovations",
      "Garage & shed demolitions",
      "Tree trimming & landscaping debris"
    ],
    "neighborhoods": [
      "Lakeside Estates",
      "Lake Worth Shoreline",
      "Waterwood",
      "Western Hills"
    ],
    "active": true
  },
  {
    "slug": "dallas",
    "cityName": "Dallas",
    "county": "Dallas County",
    "code": "DAL",
    "zipCodes": [
      "75201",
      "75212",
      "75219",
      "75208"
    ],
    "headline": "Dumpster Rental in Dallas, TX",
    "localIntro": "Direct roll-off dumpster dispatch from our central Singleton Blvd facility to Dallas homes, job sites, and commercial facilities.",
    "keyProjects": [
      "Downtown & Uptown tenant cleanouts",
      "Oak Cliff residential renovations",
      "Commercial demolition debris"
    ],
    "neighborhoods": [
      "Downtown",
      "Uptown",
      "Oak Cliff",
      "Deep Ellum",
      "Lakewood",
      "North Dallas"
    ],
    "active": true
  },
  {
    "slug": "irving",
    "cityName": "Irving",
    "county": "Dallas County",
    "code": "IRV",
    "zipCodes": [
      "75038",
      "75061",
      "75062",
      "75063"
    ],
    "headline": "Dumpster Rental in Irving, TX",
    "localIntro": "Fast, professional roll-off dumpster service for Irving and Las Colinas residential remodels, office cleanouts, and roofing jobs.",
    "keyProjects": [
      "Las Colinas corporate office clearouts",
      "Residential kitchen & bath tear-outs",
      "Multi-family renovation debris"
    ],
    "neighborhoods": [
      "Las Colinas",
      "Valley Ranch",
      "Heritage District",
      "University Hills"
    ],
    "active": true
  },
  {
    "slug": "grand-prairie",
    "cityName": "Grand Prairie",
    "county": "Dallas County",
    "code": "GP",
    "zipCodes": [
      "75050",
      "75051",
      "75052"
    ],
    "headline": "Dumpster Rental in Grand Prairie, TX",
    "localIntro": "Reliable, affordable roll-off dumpster delivery for Grand Prairie homeowners, remodelers, and industrial contractors.",
    "keyProjects": [
      "Residential cleanouts near EpicCentral",
      "Industrial warehouse updates",
      "Roofing shingle & deck debris"
    ],
    "neighborhoods": [
      "EpicCentral District",
      "Mira Lagos",
      "Lake Ridge",
      "Country Club Park"
    ],
    "active": true
  },
  {
    "slug": "carrollton",
    "cityName": "Carrollton",
    "county": "Dallas County",
    "code": "CAR",
    "zipCodes": [
      "75006",
      "75007",
      "75010"
    ],
    "headline": "Dumpster Rental in Carrollton, TX",
    "localIntro": "Upfront flat-rate roll-off dumpster rentals in Carrollton for roofing replacements, home clearouts, and commercial renovations.",
    "keyProjects": [
      "Residential kitchen & living room renovations",
      "Historic Downtown shop clearouts",
      "Roofing tear-offs"
    ],
    "neighborhoods": [
      "Historic Downtown",
      "Nob Hill",
      "Castle Hills South",
      "Austin Waters"
    ],
    "active": true
  },
  {
    "slug": "coppell",
    "cityName": "Coppell",
    "county": "Dallas County",
    "code": "COP",
    "zipCodes": [
      "75019"
    ],
    "headline": "Dumpster Rental in Coppell, TX",
    "localIntro": "Careful driveway-safe roll-off container delivery in Coppell with heavy-duty protective boards placed under all rollers.",
    "keyProjects": [
      "High-end kitchen & bathroom remodels",
      "Garage & attic decluttering",
      "Landscaping and tree waste removal"
    ],
    "neighborhoods": [
      "Old Town Coppell",
      "Riverchase",
      "Northlake Woodlands",
      "Cottonwood Park"
    ],
    "active": true
  },
  {
    "slug": "farmers-branch",
    "cityName": "Farmers Branch",
    "county": "Dallas County",
    "code": "FB",
    "zipCodes": [
      "75234",
      "75244"
    ],
    "headline": "Dumpster Rental in Farmers Branch, TX",
    "localIntro": "Fast delivery along I-35E and I-635 for Farmers Branch homeowners, remodelers, and commercial facilities.",
    "keyProjects": [
      "Residential home remodels",
      "Commercial office space cleanouts",
      "Flooring tear-outs & tile removal"
    ],
    "neighborhoods": [
      "Historical Park Area",
      "Valwood",
      "Brookhaven",
      "Rawhide Park"
    ],
    "active": true
  },
  {
    "slug": "addison",
    "cityName": "Addison",
    "county": "Dallas County",
    "code": "ADD",
    "zipCodes": [
      "75001"
    ],
    "headline": "Dumpster Rental in Addison, TX",
    "localIntro": "North Dallas and Addison dumpster rentals for restaurant renovations, retail tenant improvements, and residential cleanouts.",
    "keyProjects": [
      "Restaurant & retail clearouts",
      "Apartment complex updates",
      "Home renovation debris"
    ],
    "neighborhoods": [
      "Addison Circle",
      "Belt Line Corridor",
      "Vitruvian Park",
      "Airpark District"
    ],
    "active": true
  },
  {
    "slug": "highland-park",
    "cityName": "Highland Park",
    "county": "Dallas County",
    "code": "HP",
    "zipCodes": [
      "75205"
    ],
    "headline": "Dumpster Rental in Highland Park, TX",
    "localIntro": "High-end residential roll-off dumpster services with white-glove driveway protection for Park Cities luxury renovations.",
    "keyProjects": [
      "Estate remodeling & historic preservation",
      "Luxury kitchen & bathroom demo",
      "Landscape redesign clearouts"
    ],
    "neighborhoods": [
      "Armstrong Parkway",
      "Lakeside Drive Area",
      "Turtle Creek",
      "Versailles Avenue"
    ],
    "active": true
  },
  {
    "slug": "university-park",
    "cityName": "University Park",
    "county": "Dallas County",
    "code": "UP",
    "zipCodes": [
      "75205",
      "75225"
    ],
    "headline": "Dumpster Rental in University Park, TX",
    "localIntro": "Careful container placement for University Park and SMU area custom renovations, additions, and cleanouts.",
    "keyProjects": [
      "SMU area home renovations",
      "Second-story addition tear-outs",
      "Garage & basement purges"
    ],
    "neighborhoods": [
      "Snider Plaza District",
      "SMU Campus Border",
      "Preston Hollow South",
      "Volk Estates"
    ],
    "active": true
  },
  {
    "slug": "duncanville",
    "cityName": "Duncanville",
    "county": "Dallas County",
    "code": "DNC",
    "zipCodes": [
      "75116",
      "75137"
    ],
    "headline": "Dumpster Rental in Duncanville, TX",
    "localIntro": "South Dallas County dumpster rentals for homeowners and contractors tackling garage purges, roofing, and property upgrades.",
    "keyProjects": [
      "Residential cleanouts & roofing",
      "Commercial strip center clearouts",
      "Flooring and framing demo"
    ],
    "neighborhoods": [
      "Main Street District",
      "Green Hills",
      "Red Bird Area",
      "Fairmeadows"
    ],
    "active": true
  },
  {
    "slug": "desoto",
    "cityName": "DeSoto",
    "county": "Dallas County",
    "code": "DES",
    "zipCodes": [
      "75115"
    ],
    "headline": "Dumpster Rental in DeSoto, TX",
    "localIntro": "Prompt, affordable roll-off dumpster drop-offs across DeSoto for whole-house decluttering, renovations, and tree debris.",
    "keyProjects": [
      "Home cleanouts and moves",
      "Kitchen remodel waste",
      "Roofing tear-off debris"
    ],
    "neighborhoods": [
      "Briarwood",
      "Silver Creek",
      "Town Center",
      "Candlelight Park"
    ],
    "active": true
  },
  {
    "slug": "cedar-hill",
    "cityName": "Cedar Hill",
    "county": "Dallas County",
    "code": "CH",
    "zipCodes": [
      "75104"
    ],
    "headline": "Dumpster Rental in Cedar Hill, TX",
    "localIntro": "Southwest Dallas County dumpster rentals delivered on-time to Cedar Hill homes and job sites near Cedar Hill State Park.",
    "keyProjects": [
      "Residential remodeling projects",
      "Hillside landscape clearouts",
      "Deck & fence demolitions"
    ],
    "neighborhoods": [
      "Highlands",
      "Kingswood",
      "Uptown Village",
      "Lake Ridge Border"
    ],
    "active": true
  },
  {
    "slug": "cockrell-hill",
    "cityName": "Cockrell Hill",
    "county": "Dallas County",
    "code": "COCK",
    "zipCodes": [
      "75211"
    ],
    "headline": "Dumpster Rental in Cockrell Hill, TX",
    "localIntro": "Fast dispatch from our central Dallas facility to Cockrell Hill for residential clearouts, roofing, and remodel projects.",
    "keyProjects": [
      "Home cleanouts and moves",
      "Flooring & tile removal",
      "Drywall and framing disposal"
    ],
    "neighborhoods": [
      "Jefferson Blvd Area",
      "Cockrell Central",
      "Mountain Creek Border",
      "Sunset View"
    ],
    "active": true
  },
  {
    "slug": "lewisville",
    "cityName": "Lewisville",
    "county": "Denton County",
    "code": "LEW",
    "zipCodes": [
      "75057",
      "75067",
      "75077"
    ],
    "headline": "Dumpster Rental in Lewisville, TX",
    "localIntro": "Fast-response roll-off dumpster containers for Lewisville residential remodeling, roofing jobs, and commercial clearouts.",
    "keyProjects": [
      "Old Town Lewisville historic renovations",
      "Lake Lewisville property clearouts",
      "Commercial retail renovations"
    ],
    "neighborhoods": [
      "Old Town",
      "Valley Ridge",
      "Vista Ridge Area",
      "Lake Park District"
    ],
    "active": true
  },
  {
    "slug": "flower-mound",
    "cityName": "Flower Mound",
    "county": "Denton County",
    "code": "FM",
    "zipCodes": [
      "75022",
      "75028"
    ],
    "headline": "Dumpster Rental in Flower Mound, TX",
    "localIntro": "Clean, driveway-safe roll-off dumpsters delivered on-time across Flower Mound with wood-board surface protection included.",
    "keyProjects": [
      "Lakeside DFW remodel demolition",
      "Custom kitchen and master bath updates",
      "Roofing tear-off debris"
    ],
    "neighborhoods": [
      "Lakeside DFW",
      "Bridlewood",
      "Wellington",
      "River Walk"
    ],
    "active": true
  },
  {
    "slug": "the-colony",
    "cityName": "The Colony",
    "county": "Denton County",
    "code": "TC",
    "zipCodes": [
      "75056"
    ],
    "headline": "Dumpster Rental in The Colony, TX",
    "localIntro": "Convenient roll-off dumpster rentals near Highway 121 and Grandscape for home renovations, cleanouts, and commercial work.",
    "keyProjects": [
      "Grandscape area commercial renovations",
      "Residential flooring & kitchen teardowns",
      "Garage decluttering & moves"
    ],
    "neighborhoods": [
      "The Tribute",
      "Austin Ranch",
      "Grandscape District",
      "Stewart Peninsula"
    ],
    "active": true
  },
  {
    "slug": "highland-village",
    "cityName": "Highland Village",
    "county": "Denton County",
    "code": "HV",
    "zipCodes": [
      "75077"
    ],
    "headline": "Dumpster Rental in Highland Village, TX",
    "localIntro": "Driveway-safe roll-off containers delivered carefully to Highland Village residential communities and local job sites.",
    "keyProjects": [
      "Highland Shores home renovations",
      "Estate cleanouts & garage decluttering",
      "Deck and patio demolition"
    ],
    "neighborhoods": [
      "Highland Shores",
      "Castlewood",
      "The Shops Area",
      "Highland Village Estates"
    ],
    "active": true
  },
  {
    "slug": "roanoke",
    "cityName": "Roanoke",
    "county": "Denton County",
    "code": "ROA",
    "zipCodes": [
      "76262"
    ],
    "headline": "Dumpster Rental in Roanoke, TX",
    "localIntro": "Unique Dining Capital of Texas dumpster rentals for restaurant remodels, new home builds, and residential clearouts.",
    "keyProjects": [
      "Oak Street restaurant renovations",
      "Residential garage and attic clears",
      "New construction jobsite debris"
    ],
    "neighborhoods": [
      "Historic Oak Street",
      "Briarwyck",
      "Fairway Ranch",
      "Parkside"
    ],
    "active": true
  },
  {
    "slug": "trophy-club",
    "cityName": "Trophy Club",
    "county": "Denton County",
    "code": "TCB",
    "zipCodes": [
      "76262"
    ],
    "headline": "Dumpster Rental in Trophy Club, TX",
    "localIntro": "Premier roll-off dumpster rentals with careful driveway placement for Trophy Club custom homes and renovation sites.",
    "keyProjects": [
      "Golf club community renovations",
      "Luxury kitchen & bathroom demo",
      "Estate clearouts & moves"
    ],
    "neighborhoods": [
      "Trophy Club Country Club",
      "The Highlands",
      "Canterbury",
      "Turnberry"
    ],
    "active": true
  },
  {
    "slug": "westlake",
    "cityName": "Westlake",
    "county": "Denton County",
    "code": "WL",
    "zipCodes": [
      "76262"
    ],
    "headline": "Dumpster Rental in Westlake, TX",
    "localIntro": "White-glove roll-off dumpster service for luxury custom home construction and estate renovations in Westlake, TX.",
    "keyProjects": [
      "Vaquero estate renovations",
      "Custom home construction disposal",
      "Landscape & tree clearing"
    ],
    "neighborhoods": [
      "Vaquero",
      "Entrada",
      "Terra Bella",
      "Granada"
    ],
    "active": true
  },
  {
    "slug": "northlake",
    "cityName": "Northlake",
    "county": "Denton County",
    "code": "NL",
    "zipCodes": [
      "76226",
      "76247"
    ],
    "headline": "Dumpster Rental in Northlake, TX",
    "localIntro": "Fast roll-off dumpster dispatch to Northlake and the Texas Motor Speedway corridor for new builds and cleanouts.",
    "keyProjects": [
      "Harvest community home projects",
      "Commercial industrial development",
      "Roofing and fencing disposal"
    ],
    "neighborhoods": [
      "Harvest",
      "Canyon Falls",
      "Speedway Corridor",
      "Pecan Square Border"
    ],
    "active": true
  },
  {
    "slug": "double-oak",
    "cityName": "Double Oak",
    "county": "Denton County",
    "code": "DO",
    "zipCodes": [
      "75077"
    ],
    "headline": "Dumpster Rental in Double Oak, TX",
    "localIntro": "Driveway-safe roll-off dumpsters with wood-board surface protection for Double Oak acreage estates and renovations.",
    "keyProjects": [
      "Acreage home renovations",
      "Barn & shed demolitions",
      "Tree trimming & yard waste removal"
    ],
    "neighborhoods": [
      "Kings Road Area",
      "Cross Timbers",
      "Simmons Road Area",
      "Double Oak West"
    ],
    "active": true
  }
];
