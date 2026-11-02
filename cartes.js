/* =====================================================================
   BEYOND HUMAN // CARTES DE NIGHT CITY
   - Onglet CARTE : carte générale (image) + cartes routières par quartier
   - Les cartes de quartier sont générées (SVG) à partir de la configuration
     QUARTIERS ci-dessous : réseau routier, noms de rues, carrefours,
     autoroutes et sorties, lieux de la carte générale, grille de repérage.
   - Coordonnées des configurations : 0 → 1 (x de gauche à droite, y de haut en bas)
   ===================================================================== */
(function(){
"use strict";
const W=1600,H=1100;
const IMG={src:"Images/Carte/night-city.jpg",w:3615,h:2408};

/* ---------------------------------------------------------------------
   CONFIGURATION DES QUARTIERS
   zones  : 1re zone = tout le plan ; les suivantes remplacent la 1re dans leur polygone.
            angle (°), sx/sy (espacement des rues en px), drop (part de tronçons supprimés),
            av:[n,m] (une avenue toutes les n colonnes / m rangées), warp:[amplitude,longueur],
            border (nom du boulevard qui borde la zone), walled (mur avec portes sur les avenues),
            style:"radial" (anneaux + rayons : cx,cy,r,rings,spokes)
   water / parks / restricted : polygones ; hw : autoroutes ; lm : lieux [code,nom,x,y]
   --------------------------------------------------------------------- */
const QUARTIERS=[
{id:"watson",nom:"Watson",seed:11,
 desc:"Ancien district industriel au nord, docks et usines au sud-est, base militaire de NorCal au nord.",
 water:[{poly:[[0,0],[0.1,0],[0.08,0.35],[0.13,0.62],[0.24,0.8],[0.34,0.88],[0.4,1],[0,1]],nom:"SAN MORRO BAY",lx:0.05,ly:0.62},
        {poly:[[0.47,1],[0.5,0.94],[0.62,0.91],[0.75,0.94],[0.79,1]],nom:"CHENAL DE WATSON",lx:0.63,ly:0.97}],
 coast:"Waterfront Dr",
 restricted:[{poly:[[0.14,0],[0.7,0],[0.68,0.12],[0.16,0.12]],nom:"NORCAL MILITARY BASE — ZONE INTERDITE"}],
 zones:[{angle:-6,sx:78,sy:66,warp:[6,180],drop:.07,av:[5,4]},
        {poly:[[0.46,0.48],[0.86,0.42],[0.88,0.92],[0.5,0.92]],angle:18,sx:118,sy:94,drop:.15,av:[3,3],border:"Foundry Blvd",
         rues:["Container","Forklift","Freight","Cargo","Stevedore","Bollard","Hoist","Tanker","Barge","Drydock","Welder","Conveyor"],avenues:["Dockyard","Shipyard","Longshore"]}],
 hw:[{nom:"US-16",pts:[[0.43,0],[0.44,0.2],[0.47,0.45],[0.55,0.7],[0.6,0.88],[0.62,1]]}],
 voisins:[["NEW WESTBROOK →",0.93,0.62],["↓ CITY CENTER",0.66,0.985]],
 lm:[["CR11","Militech",0.24,0.16],["CR09","SovOil",0.55,0.16],["CR08","Petrochem",0.75,0.24],["CR10","Trauma Team Tower",0.4,0.33],
     ["CH07","Watson Central Cubelife",0.33,0.45],["PU05","NCPD Precinct #3",0.27,0.62],["CC06","North Cargo Village",0.93,0.4],["CR15","WorldSat",0.94,0.18]],
 rues:["Kabuki","Ishikawa","Ginza","Sakura","Hanami","Kowloon","Shinbashi","Morita","Docklands","Rivet","Anvil","Crane","Ironworks","Sentinel","Pylon","Harbor","Kiyomi","Nakano","Tetsuo","Akasaka","Yokohama","Bluewater","Smelter","Gantry","Cobalt","Slag"],
 avenues:["Northside","Watson","Arroyo","Kenji","Militech","Tsunami","Gateway","Meridian"],num:"N "},

{id:"little-europe",nom:"Little Europe & University District",seed:23,
 desc:"Quartiers européens au nord, campus de la NCU au sud, côte ouest sur San Morro Bay.",
 water:[{poly:[[0,0],[1,0],[1,0.05],[0.62,0.07],[0.32,0.05],[0.14,0.1],[0.1,0.28],[0.06,0.5],[0.1,0.72],[0.03,0.9],[0,0.92]],nom:"SAN MORRO BAY",lx:0.04,ly:0.3}],
 coast:"Seawall Promenade",
 zones:[{angle:4,sx:74,sy:64,warp:[5,200],drop:.06,av:[4,4]},
        {poly:[[0.04,0.56],[1,0.5],[1,1],[0.04,1]],angle:-12,sx:96,sy:80,drop:.08,av:[3,3],border:"University Ave",
         rues:["Dean","Faculty","Thesis","Lecture","Tenure","Alumni","Library","Quad","Laboratory","Diploma","Seminar","Chancellor","Varsity","Fellowship","Graduate","Archive"],avenues:["Campus","Scholar","Academy","Provost"]}],
 hw:[{nom:"US-16",pts:[[0,0.88],[0.18,0.83],[0.4,0.8],[0.7,0.84],[1,0.9]]}],
 voisins:[["CITY CENTER →",0.94,0.4]],
 lm:[["OT01","Camden Court",0.62,0.11],["OT02","Holy Angels Church",0.5,0.15],["CR05","Danger Girl",0.22,0.18],["PU08","NCFD Firestation #2",0.2,0.33],
     ["CR04","Continental Brands",0.45,0.3],["HB12","Franciscini's Cafe",0.56,0.33],["HB10","Knight-Marriot Hotel",0.67,0.24],["CH04","Cube-A-Rama",0.75,0.3],
     ["CH03","University Cubes",0.14,0.48],["NL03","Delirium",0.5,0.45],["HB06","Short Circuit",0.86,0.42],["PU11","Stuart Hospital",0.3,0.6],
     ["CA02","NCU Fine Arts Campus",0.45,0.6],["CA03","Serengeti Gallery",0.6,0.6],["AS02","Biograph Theater",0.24,0.69],["CA01","Night City University",0.4,0.71],
     ["HB17","Metro Café",0.27,0.78],["HB05","The Paragon",0.33,0.9],["HB16","McDonnell's",0.47,0.92],["NL04","MindNutz Lover",0.66,0.76],["CC01","University Cargo Bay",0.2,0.95]],
 rues:["Marseille","Vienna","Bruges","Kraków","Lisbon","Montmartre","Bavaria","Seville","Florence","Prague","Rotterdam","Lyon","Salzburg","Antwerp","Napoli","Bordeaux","Dublin","Geneva","Turin","Ghent","Porto","Hamburg","Verona","Sorbonne","Oxford","Bologna","Utrecht","Leuven","Basel","Ljubljana","Tallinn","Riga","Krakow Gate","Valencia","Toulouse","Strasbourg"],
 avenues:["Europa","Heidelberg","Champs","Danube","Rhine","Campus","Scholar","Academy"],num:"W "},

{id:"city-center",nom:"City Center — Corp Center, Bank Block, Med Center",seed:37,
 desc:"Cœur corporatiste : Corp Plaza en anneaux, tours bancaires au nord-est, Med Center à l'est, Lake Park au sud-ouest.",
 parks:[{poly:[[0,0.74],[0.24,0.68],[0.34,0.88],[0.3,1],[0,1]],nom:"LAKE PARK",route:"Lakeshore Dr"}],
 zones:[{angle:0,sx:70,sy:62,warp:[3,220],drop:.03,av:[4,4]},
        {poly:[[0.7,0.28],[1,0.22],[1,0.86],[0.74,0.82]],angle:24,sx:72,sy:62,drop:.05,av:[3,3],border:"Med Center Pkwy",
         rues:["Pulse","Scalpel","Suture","Triage","Cortex","Synapse","Marrow","Plasma","Vital","Serum","Neuron","Retina","Clinic","Ward","Pharma","Surgeon"],avenues:["Hippocrates","Trauma","Caduceus","Remedy"]},
        {style:"radial",cx:0.47,cy:0.48,r:270,rings:[70,135,200],spokes:16,rot:0,border:"Grand Circle Blvd",plaza:"CORP PLAZA"}],
 voisins:[["← LITTLE EUROPE",0.05,0.3],["UPPER MARINA ↗",0.92,0.06],["LITTLE CHINA →",0.94,0.93],["↓ THE GLEN",0.5,0.985]],
 lm:[["HB15","Metropolitan BBQ & Grill",0.44,0.07],["CH06","A dilapidated Cube Hotel",0.27,0.15],["HB03","Totentanz",0.57,0.13],
     ["PU12","West Hill Library",0.1,0.4],["CR03","Biotechnica Campus",0.12,0.6],["PU09","City Medical Center",0.86,0.4],
     ["HB02","Highcourt Plaza Hotel",0.86,0.6],["CC05","The Precipe",0.7,0.78],["PU17","Ling Po Public Library",0.93,0.16]],
 rues:["Arasaka","Kang Tao","Petrochem","Biotech","Zetatech","Kiroshi","Dynalar","Orbital","Netwatch","Ziggurat","Ironcrown","Raven","Merrill","Asukaga","Finch","Highcourt","Halcyon","Sterling","Obsidian","Paragon","Vantage","Chrome","Ledger","Bourse","Tycoon","Mercator","Dividend","Holding","Trust","Capital","Equity","Futures"],
 avenues:["Corporation","Plaza","Bank","Exchange","Capitol","Concord","Senate","Sovereign","Obelisk","Spire","Meridian","Atlas","Pinnacle","Monolith","Helix","Quantum","Vector","Cortex","Axiom","Nexus","Prism","Titan"],num:"C "},

{id:"upper-marina",nom:"Upper Marina",seed:41,
 desc:"Front de mer huppé au nord-est : port de plaisance, ferry, stade McCartney, l'Afterlife.",
 water:[{poly:[[0,0],[1,0],[1,1],[0.92,1],[0.88,0.62],[0.79,0.36],[0.6,0.22],[0.4,0.15],[0.15,0.12],[0,0.14]],nom:"BAIE DE NIGHT CITY",lx:0.82,ly:0.12}],
 coast:"Bayfront Esplanade",
 zones:[{angle:30,sx:72,sy:64,warp:[5,200],drop:.05,av:[4,4]},
        {poly:[[0,0.56],[0.55,0.6],[0.6,1],[0,1]],angle:0,sx:72,sy:62,drop:.04,av:[4,4],border:"Marina Blvd",
         rues:["Stadium","Bleacher","Touchdown","Marquee","Encore","Matinee","Velvet","Spotlight","Jukebox","Cabaret","Ticket","Arcade","Premiere","Ballroom"],avenues:["Cinemaxus","Broadway","Showtime"]}],
 voisins:[["← CITY CENTER",0.05,0.8]],
 lm:[["PU14","Ferry building",0.53,0.22],["AS05","Yacht club",0.67,0.28],["CH09","McCartney Cubes",0.3,0.24],["AS04","McCartney Field Stadium",0.4,0.42],
     ["AS03","Cinemaxus",0.27,0.55],["PU13","NC Postal Service",0.46,0.52],["HB14","American Bar",0.62,0.42],["HB01","The Afterlife",0.5,0.66],
     ["CR07","Ziggurat",0.78,0.55],["HB20","La Lune Bleu",0.72,0.68],["CR06","REO Meatwagon",0.76,0.86],["HB13","24 Hour Cafe",0.58,0.92]],
 rues:["Anchor","Harbor","Pier","Seawall","Spinnaker","Regatta","Lighthouse","Mariner","Coral","Keel","Galleon","Compass","Tidewater","Driftwood","Saltair","Bayview","Clipper","Starboard","Pelican","Breakwater","Mooring","Schooner","Ferry","Gull","Kelp","Neptune","Sailcloth","Buoy","Rigging","Gangway","Halyard","Mast","Tiller","Bowline","Capstan","Fathom"],
 avenues:["Marina","Ocean","McCartney","Afterlife","Admiral","Pacific","Commodore","Shoreline"],num:"E "},

{id:"little-china",nom:"Little China & Old Japan Town",seed:53,
 desc:"Rues denses en diagonale de Little China, damier d'Old Japan Town à l'ouest, US-16 le long de la baie.",
 water:[{poly:[[0.88,0],[1,0],[1,1],[0.62,1],[0.74,0.8],[0.84,0.5],[0.9,0.2]],nom:"BAIE DE NIGHT CITY",lx:0.92,ly:0.7}],
 coast:"Bayfront Rd",
 zones:[{angle:35,sx:70,sy:60,warp:[4,200],drop:.06,av:[4,4]},
        {poly:[[0,0.34],[0.48,0.4],[0.52,1],[0,1]],angle:0,sx:68,sy:58,drop:.05,av:[4,4],border:"Nihonmachi Ave",
         rues:["Yamato","Shogun","Kyoto","Osaka","Hokkaido","Torii","Bonsai","Ronin","Shibuya","Asakusa","Nagoya","Matsuri","Sakai","Kobe","Sendai","Hiroshima","Okinawa","Tatami","Origami","Samurai","Ginkgo","Fuji","Kamakura","Nara"],
         avenues:["Japantown","Tokugawa","Meiji","Edo","Rising Sun","Sakuragi"]}],
 hw:[{nom:"US-16",pts:[[0.4,1],[0.55,0.75],[0.68,0.5],[0.78,0.25],[0.84,0]]}],
 voisins:[["← CITY CENTER",0.05,0.1],["↓ OLD COMBAT ZONE",0.3,0.985]],
 lm:[["PU17","Ling Po Public Library",0.52,0.08],["CC09","Bridgetown",0.76,0.12],["HB04","The Forlorn Hope",0.7,0.3],["PU10","Crisis Medical Center",0.24,0.3],
     ["HB18","Chen's Oriental Garden",0.42,0.42],["AS01","Colonial Studios",0.55,0.48],["HB11","Yamagumi Hotel",0.15,0.52],["HB19","The Silver Dragon",0.6,0.62],
     ["PU03","NCPD Precinct #1",0.2,0.8],["CH10","Unnamed Cube Hotel",0.6,0.85]],
 rues:["Canton","Pagoda","Jade","Lotus","Shanghai","Mahjong","Lantern","Phoenix","Jasmine","Bamboo","Ginseng","Macau","Silk","Oolong","Fortune","Cathay","Peking","Ming","Tang","Han","Kowloon Gate","Wonton","Dim Sum","Abacus","Koi","Teahouse","Firecracker","Golden Lion","Harmony","Sampan"],
 avenues:["Chinatown","Dragon","Jade Empire","Japantown","Pearl","Imperial","Emperor","Tiger"],num:"E "},

{id:"the-glen",nom:"The Glen & Lake Park",seed:61,
 desc:"Quartier civique : mairie, palais de justice, banques ; Lake Park au nord-ouest.",
 parks:[{poly:[[0,0],[0.44,0],[0.42,0.3],[0.2,0.36],[0,0.3]],nom:"LAKE PARK",route:"Lake Park Dr"}],
 zones:[{angle:-3,sx:76,sy:66,warp:[4,200],drop:.04,av:[4,4]},
        {poly:[[0.76,0],[1,0],[1,1],[0.68,1],[0.7,0.5]],angle:30,sx:72,sy:62,drop:.1,av:[3,3],border:"Glen Blvd"}],
 voisins:[["↑ CITY CENTER",0.6,0.03],["OLD COMBAT ZONE →",0.92,0.5],["↓ SOUTH NIGHT CITY",0.25,0.985]],
 lm:[["CR02","Raven Microcybernetics",0.5,0.1],["CH08","Seafoam",0.58,0.18],["NL01","The Atlantis",0.67,0.2],["CR03","Biotechnica Campus",0.15,0.45],
     ["PU01","First Night City Bank",0.4,0.5],["CR01","Merrill, Asukaga & Finch",0.6,0.5],["PU06","Hall of Justice",0.82,0.63],["PU02","City Hall",0.62,0.82],
     ["HB09","Red Door Inn",0.42,0.92],["CC03","South Cargo Village",0.55,0.96]],
 rues:["Justice","Liberty","Charter","Union","Magistrate","Lakeview","Willow","Juniper","Sycamore","Elm","Cypress","Magnolia","Laurel","Linden","Poplar","Rosewood","Hawthorne","Ash","Birch","Cedar","Maple","Aspen","Chestnut","Alder","Hickory","Tribune","Courthouse","Gavel","Verdict","Jury","Docket","Statute","Ballot","Treasury","Archive","Mint","Census","Oath","Decree","Petition","Quorum","Bylaw","Amendment","Consul"],
 avenues:["Glen","Mayor","Civic","Federal","Constitution","Founders","Republic","Senate"],num:"S "},

{id:"south-night-city",nom:"South Night City",seed:73,
 desc:"Zone de combat : rues défoncées, docks au sud-ouest, pont vers Pacifica au sud.",
 water:[{poly:[[0,0],[0.12,0],[0.06,0.3],[0.1,0.6],[0.25,0.82],[0.5,0.92],[0.8,0.9],[1,0.88],[1,1],[0,1]],nom:"DEL CORONADO BAY",lx:0.45,ly:0.97}],
 coast:"Dockside Rd",
 zones:[{angle:2,sx:72,sy:62,warp:[7,160],drop:.13,av:[4,4]},
        {poly:[[0,0.5],[0.45,0.62],[0.5,1],[0,1]],angle:-25,sx:110,sy:90,drop:.15,av:[3,3],border:"Dock Rd"}],
 hw:[{nom:"PONT DE PACIFICA",pts:[[0.72,0.72],[0.74,0.88],[0.75,1]]}],
 voisins:[["THE GLEN →",0.93,0.2],["↑ UNIVERSITY DISTRICT",0.35,0.03],["↓ PACIFICA",0.8,0.985]],
 lm:[["CC01","University Cargo Bay",0.3,0.08],["PU15","Medical Technologies",0.22,0.38],["PU16","Savage Docs",0.55,0.25],
     ["CC02","Dock Cargo Community",0.32,0.8],["NL02","The Slammer",0.62,0.8]],
 rues:["Rust","Gutter","Scrap","Ashfall","Razorwire","Burnout","Cinder","Brimstone","Slagheap","Junkyard","Lockdown","Static","Barricade","Shrapnel","Blackout","Hollow","Vermin","Rubble","Graveyard","Tombstone","Smog","Grime","Shank","Cutthroat","Bleak","Gallows","Ratline","Scrapyard","Dumpster","Furnace Row","Crowbar","Lead Pipe","Chainlink","Barbwire","Sewer","Wreckage"],
 avenues:["Combat","South","Warlord","Boneyard","Fallout","Chrome Skull","Salvage","Ironclad"],num:"S "},

{id:"old-combat-zone",nom:"Old Combat Zone",seed:83,
 desc:"Ancienne zone de combat au sud-est, traversée en diagonale par l'US-16.",
 water:[{poly:[[1,0],[1,1],[0.42,1],[0.56,0.86],[0.8,0.56],[0.93,0.26]],nom:"DEL CORONADO BAY",lx:0.88,ly:0.8}],
 coast:"Breakwater Rd",
 zones:[{angle:40,sx:70,sy:62,warp:[6,170],drop:.14,av:[4,4]},
        {poly:[[0,0],[0.42,0],[0.38,1],[0,1]],angle:0,sx:72,sy:62,drop:.1,av:[4,4],border:"Kennedy St"}],
 hw:[{nom:"US-16",pts:[[0.1,1],[0.3,0.75],[0.5,0.5],[0.66,0.28],[0.78,0]]}],
 voisins:[["← THE GLEN",0.05,0.45],["↑ LITTLE CHINA",0.55,0.03]],
 lm:[["PU03","NCPD Precinct #1",0.2,0.15],["CH10","Unnamed Cube Hotel",0.6,0.2],["CC07","NC Ionic Semiconductor",0.72,0.36],["CC03","South Cargo Village",0.15,0.86]],
 rues:["Mercenary","Napalm","Bunker","Ambush","Trench","Tracer","Bullet","Molotov","Grenade","Sniper","Barrage","Outpost","Siege","Patrol","Mortar","Flak","Recon","Sabotage","Fortress","Bastion","Garrison","Rampart","Flank","Raider","Volley","Sortie","Shellshock","Crossfire","Tripwire","Claymore","Foxhole","Bayonet","Kevlar","Hardpoint","Firebase","Dogtag","Ammo","Breach","Overwatch","Holdout","Sandbag","Killbox","Gunsmoke","Rifle","Muzzle","Payload","Warhead","Ricochet","Salvo","Skirmish","Cordon"],
 avenues:["Combat Zone","Old Industrial","Precinct","Lockjaw","Ironside","Warpath","Arsenal","Kevlar"],num:"SE "},

{id:"new-westbrook",nom:"New Westbrook",seed:97,
 desc:"Banlieue surpeuplée à l'est, entre l'US-828 et l'I-101, aux portes de l'Executive Zone.",
 zones:[{angle:12,sx:66,sy:58,warp:[5,190],drop:.06,av:[4,4]},
        {poly:[[0.5,0],[1,0],[1,0.45],[0.55,0.4]],angle:-20,sx:70,sy:60,drop:.06,av:[3,3],border:"Westbrook Blvd"}],
 hw:[{nom:"US-828",pts:[[0.2,0],[0.3,0.3],[0.42,0.6],[0.5,1]]},{nom:"I-101",pts:[[0.78,0],[0.74,0.4],[0.82,0.7],[0.86,1]]}],
 voisins:[["← WATSON",0.05,0.15],["EXECUTIVE ZONE →",0.93,0.55]],
 lm:[["CR15","WorldSat",0.14,0.1],["CC06","North Cargo Village",0.1,0.35],["CR13","Network 54",0.36,0.24],
     ["PU07","NCFD Firestation #1",0.56,0.76],["CR14","Rockling Augmentics Campus",0.33,0.84]],
 rues:["Charter Hill","Northoak","Elmwood","Silverlake","Hillcrest","Oakmont","Pinecrest","Briarwood","Redwood","Fairview","Glenwood","Ridgeview","Brookside","Meadow","Kingsley","Ashford","Wellington","Belmont","Ivy","Windsor","Highland","Prescott","Crestwood","Sunset","Stonegate","Foxglove","Applewood","Bramble","Cherrywood","Dogwood","Evergreen","Fernhill","Goldenrod","Hazelnut","Ironwood","Lakeside","Mapleton","Northgate","Orchard","Primrose","Quailridge","Rosemont","Sagewood","Thornbury","Valleyview","Westgate","Wildflower","Woodbine","Yarrow","Ashgrove"],
 avenues:["Westbrook","Northridge","Empire","Rockling","Skyline","Horizon","Network","Summit Ridge"],num:"NE "},

{id:"executive-zone",nom:"Executive Zone",seed:101,
 desc:"Enclave fortifiée des élites corporatistes : mur à bastions, accès uniquement par les portes des avenues.",
 zones:[{angle:8,sx:140,sy:120,warp:[10,200],drop:.3,av:[2,2]},
        {poly:[[0.35,0.2],[0.65,0.2],[0.73,0.1],[0.68,0.26],[0.68,0.74],[0.73,0.9],[0.65,0.8],[0.35,0.8],[0.27,0.9],[0.32,0.74],[0.32,0.26],[0.27,0.1]],
         angle:0,sx:52,sy:46,drop:.02,av:[5,5],walled:true,border:"Mur d'enceinte"}],
 area:[[0.35,0.2],[0.65,0.2],[0.73,0.1],[0.68,0.26],[0.68,0.74],[0.73,0.9],[0.65,0.8],[0.35,0.8],[0.27,0.9],[0.32,0.74],[0.32,0.26],[0.27,0.1]],
 hw:[{nom:"I-101",pts:[[0.95,0],[0.92,0.5],[0.96,1]]}],
 voisins:[["← NEW WESTBROOK",0.08,0.5],["RECLAIMED PERIMETER",0.85,0.12]],
 lm:[],
 rues:["Platinum","Sovereign","Aurora","Monarch","Regent","Opal","Sapphire","Ivory","Gilded","Prestige","Belvedere","Majestic","Solstice","Celestial","Crystal","Marquis","Diamond","Pinnacle","Laureate","Emerald","Aristocrat","Orchid","Ambassador","Grandview","Bellevue","Riviera","Cashmere","Velour","Champagne","Caviar","Penthouse","Concierge","Yacht","Chateau","Villa","Marble"],
 avenues:["Executive","Summit","Zenith","Olympus","Elysium","Crown","Apex","Panorama"],num:"X "},

{id:"heywood",nom:"Heywood & Heywood Industrial Zone",seed:113,
 desc:"Territoire des Valentinos : rues en diagonale, zone industrielle au nord-est, trois autoroutes.",
 water:[{poly:[[0,0],[0.34,0],[0.25,0.2],[0.1,0.3],[0,0.32]],nom:"DEL CORONADO BAY",lx:0.08,ly:0.1}],
 coast:"Bayside Dr",
 zones:[{angle:25,sx:70,sy:60,warp:[5,190],drop:.07,av:[4,4]},
        {poly:[[0.4,0],[0.85,0],[0.8,0.45],[0.45,0.4]],angle:8,sx:150,sy:120,drop:.1,av:[2,2],border:"Industrial Pkwy",
         rues:["Furnace","Turbine","Piston","Boiler","Assembly","Warehouse","Smokestack","Rail Yard","Lathe","Crucible"],avenues:["Ironworks","Factory","Zhirafa"]}],
 hw:[{nom:"US-828",pts:[[0.56,0],[0.6,0.4],[0.7,0.7],[0.75,1]]},{nom:"US-126",pts:[[0.2,1],[0.35,0.62],[0.6,0.42],[0.9,0.22],[1,0.18]]},{nom:"I-101",pts:[[0.95,0],[0.93,0.6],[0.98,1]]}],
 voisins:[["↓ RANCHO CORONADO",0.2,0.985],["← PACIFICA (PONT)",0.05,0.5]],
 lm:[["CR12","Zhirafa Office Park",0.33,0.13],["CC08","Old Ironworks",0.48,0.52],["HB08","MetalStorm",0.08,0.52],["PU04","NCPD Precinct #2",0.14,0.76],["CC10","East Cargo Village",0.88,0.86]],
 rues:["Valentino","Esperanza","Santa Rosa","Del Sol","Los Feliz","Encanto","Alameda","Mariposa","Hacienda","La Paloma","Bonita","Cielo","Corazón","Guadalupe","Las Palmas","Mercado","Rosario","Tierra","Vista","Zapata","Coyote","Escondido","Fiesta","Solano","Tranquilo","Montaña","Abuela","Cantina","Sombra","Luna","Estrella","Pueblo","Plaza Mayor","Dolores","Primavera","Marisol"],
 avenues:["Heywood","Valentinos","Mission","Camino Real","Glory Hill","Vallarta","Industrial","Sierra"],num:"H "},

{id:"pacifica",nom:"Pacifica",seed:127,
 desc:"Station balnéaire abandonnée : Playland by the Sea, front de mer, pont vers South Night City.",
 water:[{poly:[[0,0],[1,0],[1,0.12],[0.6,0.15],[0.35,0.25],[0.15,0.4],[0.2,0.6],[0.12,0.85],[0.05,1],[0,1]],nom:"PACIFIC OCEAN",lx:0.05,ly:0.3}],
 coast:"Beachfront Rd",
 zones:[{angle:-4,sx:82,sy:70,warp:[8,170],drop:.12,av:[4,4]},
        {poly:[[0.17,0.4],[0.46,0.33],[0.52,0.75],[0.2,0.8]],angle:30,sx:76,sy:66,drop:.1,av:[3,3],border:"Boardwalk"}],
 hw:[{nom:"US-126",pts:[[0.55,1],[0.58,0.75],[0.7,0.55],[1,0.5]]},{nom:"PONT DE PACIFICA",pts:[[0.72,0],[0.73,0.18]]}],
 voisins:[["RANCHO CORONADO →",0.92,0.75],["↑ SOUTH NIGHT CITY",0.85,0.03]],
 lm:[["OT04","Playland by the Sea",0.3,0.34],["CH05","Cubeland by the Sea",0.5,0.24],["CH02","Scenic Cubes",0.18,0.62],["HB08","MetalStorm",0.78,0.2]],
 rues:["Carnival","Sandcastle","Palisade","Surf","Seabreeze","Coconut","Paradise","Tiki","Sunrise","Oasis","Cabana","Flamingo","Lagoon","Dune","Riptide","Seashell","Promenade","Calypso","Mirage","Aloha","Malibu","Bayshore","Tropic","Coastline","Voodoo","Dogtown","Sunbather","Lifeguard","Parasol","Seagull","Starfish","Wave Rider","Driftwood","Shoreline","Tidepool","Sandbar"],
 avenues:["Pacifica","Coastview","Grand Resort","Playland","West Wind","Seaside","Sunset Pier","Ocean Park"],num:"P "},

{id:"rancho-coronado",nom:"Rancho Coronado",seed:139,
 desc:"Lotissements sinueux et impasses de banlieue, au sud de la baie de Del Coronado.",
 water:[{poly:[[0,0],[0.6,0],[0.5,0.12],[0.2,0.18],[0,0.15]],nom:"DEL CORONADO BAY",lx:0.1,ly:0.06}],
 coast:"Bayshore Dr",
 zones:[{angle:15,sx:90,sy:75,warp:[28,140],drop:.2,av:[4,3]},
        {poly:[[0.55,0.4],[1,0.35],[1,1],[0.6,1]],angle:-10,sx:88,sy:74,warp:[30,120],drop:.2,av:[3,3],border:"Coronado Pkwy"}],
 hw:[{nom:"US-126",pts:[[0.05,1],[0.15,0.7],[0.3,0.45],[0.55,0.3],[0.8,0.25],[1,0.22]]}],
 voisins:[["← PACIFICA",0.04,0.6],["HEYWOOD ↗",0.9,0.06]],
 lm:[["CC04","Eagle Rock Stadium",0.25,0.36],["PU04","NCPD Precinct #2",0.62,0.22]],
 rues:["Mesa Verde","Rancho","Sunnyvale","Palomino","Mustang","Bluebonnet","Prairie","Sagebrush","Cottonwood","Lariat","Saddleback","Canyon","Arroyo Seco","Juniper Hill","Pinto","Bronco","Stagecoach","Buckskin","Wagon Wheel","Rodeo","Cactus","Chaparral","Yucca","Tumbleweed","Corral","Mesquite","Bridle","Spur","Haystack","Buckboard","Rawhide","Barnwood","Silo","Windmill","Prairie Dog","Branding"],
 avenues:["Rancho Coronado","Eagle Rock","Sunset Ranch","Del Coronado","Homestead","Frontier","Pioneer","Vaquero"],num:"R "}
];

/* ------------------------------ outils ------------------------------ */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const px=poly=>poly.map(([x,y])=>[x*W,y*H]);
function inPoly(p,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function segInt(a,b,c,d){const r0=b[0]-a[0],r1=b[1]-a[1],s0=d[0]-c[0],s1=d[1]-c[1],den=r0*s1-r1*s0;if(Math.abs(den)<1e-9)return null;
  const t=((c[0]-a[0])*s1-(c[1]-a[1])*s0)/den,u=((c[0]-a[0])*r1-(c[1]-a[1])*r0)/den;return t>=0&&t<=1&&u>=0&&u<=1?{t,u,p:[a[0]+t*r0,a[1]+t*r1]}:null}
function polyCross(a,b,poly){let best=null;for(let i=0;i<poly.length;i++){const h=segInt(a,b,poly[i],poly[(i+1)%poly.length]);if(h&&(!best||h.t<best.t))best=h}return best}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const ord=n=>{const m=n%100;return n+(m>10&&m<14?"th":["th","st","nd","rd"][n%10]||"th")};
const circle=(cx,cy,r,n=56)=>Array.from({length:n},(_,k)=>[cx+r*Math.cos(k/n*2*Math.PI),cy+r*Math.sin(k/n*2*Math.PI)]);
const ref=p=>String.fromCharCode(65+Math.max(0,Math.min(15,Math.floor(p[0]/100))))+(Math.max(0,Math.min(10,Math.floor(p[1]/100)))+1);
/* réserve de noms commune (quand la liste du quartier est épuisée) */
const FALL=["Neon","Voltage","Circuit","Synapse","Glitch","Cipher","Pulse","Signal","Vortex","Ember","Onyx","Argent","Quartz","Carbon","Tungsten","Halogen","Plasma","Photon","Echo","Shadow","Talon","Viper","Jackal","Falcon","Wolf","Hornet","Mantis","Cobra","Scorpion","Lynx","Panther","Kestrel","Heron","Osprey","Mercury","Cinnabar","Sulfur","Basalt","Granite","Flint"];
const CAT={CR:"#4fd18b",PU:"#ff5a6a",HB:"#3ad1d1",CH:"#b07cff",CC:"#e6c84a",NL:"#5a8cff",AS:"#ff7ad9",CA:"#ff9a3c",OT:"#ff4040"};

/* ---------------------------- génération ---------------------------- */
const CACHE={};
function build(q){
  if(CACHE[q.id])return CACHE[q.id];
  const R=rng(q.seed);
  const water=(q.water||[]).map(w=>({...w,p:px(w.poly)})),parks=(q.parks||[]).map(k=>({...k,p:px(k.poly)})),
        restr=(q.restricted||[]).map(k=>({...k,p:px(k.poly)})),area=q.area?px(q.area):null;
  const zones=q.zones.map((z,k)=>{const o={...z,k};
    if(z.style==="radial"){o.c=[z.cx*W,z.cy*H];o.p=circle(o.c[0],o.c[1],z.r)}
    else o.p=z.poly?px(z.poly):null;return o});
  const inCanvas=p=>p[0]>-80&&p[0]<W+80&&p[1]>-80&&p[1]<H+80;
  const wet=p=>water.some(w=>inPoly(p,w.p)),inPark=p=>parks.some(k=>inPoly(p,k.p))||restr.some(k=>inPoly(p,k.p));
  const zoneOf=p=>{for(let k=zones.length-1;k>0;k--)if(inPoly(p,zones[k].p))return k;return 0};
  const land=p=>inCanvas(p)&&!wet(p)&&!inPark(p);

  const edges=[];          /* {a,b,line,ord} */
  const lines={};          /* key -> {key,cls,name,dir} */
  const nodeEnds=[];       /* points d'extrémité sur une bordure : {p,line,border} */
  const addLine=(key,cls,extra)=>lines[key]||(lines[key]={key,cls,...extra});

  /* ---- zones en damier ---- */
  zones.forEach(z=>{
    if(z.style==="radial")return;
    const th=z.angle*Math.PI/180,c=Math.cos(th),s=Math.sin(th),cx=W/2,cy=H/2,D=Math.hypot(W,H)/2+160;
    const ni=Math.ceil(D/z.sx),nj=Math.ceil(D/z.sy),[A,L]=z.warp||[0,200],ph1=R()*6,ph2=R()*6,jit=Math.min(z.sx,z.sy)*0.12;
    const N={};
    for(let i=-ni;i<=ni;i++)for(let j=-nj;j<=nj;j++){
      const u=i*z.sx+(R()-.5)*jit,v=j*z.sy+(R()-.5)*jit;
      let x=cx+u*c-v*s,y=cy+u*s+v*c;
      const x2=x+A*Math.sin(y/L+ph1),y2=y+A*Math.sin(x/L*1.3+ph2);
      const p=[x2,y2];N[i+","+j]={p,ok:inCanvas(p)&&zoneOf(p)===z.k&&land(p),zone:zoneOf(p)};
    }
    const avI=i=>((i%z.av[0])+z.av[0])%z.av[0]===0,avJ=j=>((j%z.av[1])+z.av[1])%z.av[1]===0;
    const link=(n1,n2,key,cls,o)=>{
      if(!n1||!n2)return;
      if(!n1.ok&&!n2.ok)return;
      const isAv=cls==="av";
      if(n1.ok&&n2.ok){if(!isAv&&R()<(z.drop||0))return;edges.push({a:n1.p,b:n2.p,line:key,ord:o});return}
      /* une extrémité hors zone : tronquer sur la bordure franchie */
      const [inN,outN,rev]=n1.ok?[n1,n2,false]:[n2,n1,true];
      const q2=outN.p;let cut=null,border=null;
      if(wet(q2)){for(const w of water){const h=polyCross(inN.p,q2,w.p);if(h&&(!cut||h.t<cut.t)){cut=h;border=q.coast?"coast":null}}}
      else if(inPark(q2)){for(const k of parks.concat(restr)){const h=polyCross(inN.p,q2,k.p);if(h&&(!cut||h.t<cut.t)){cut=h;border=k.route?"park:"+k.nom:null}}}
      else if(inCanvas(q2)){
        const zk=Math.max(z.k,outN.zone),zz=zones[zk];
        if(zz.walled&&!(isAv&&z.k===zk))return; /* seules les avenues intérieures franchissent le mur */
        const h=polyCross(inN.p,q2,zz.p);if(h){cut=h;border="bd:"+zk}
      }else{edges.push({a:rev?q2:inN.p,b:rev?inN.p:q2,line:key,ord:o});return}
      if(!cut){if(R()<.5)return;cut={p:[(inN.p[0]+q2[0])/2,(inN.p[1]+q2[1])/2]}}
      edges.push(rev?{a:cut.p,b:inN.p,line:key,ord:o}:{a:inN.p,b:cut.p,line:key,ord:o});
      if(border)nodeEnds.push({p:cut.p,line:key,border});
    };
    for(let i=-ni;i<=ni;i++)for(let j=-nj;j<=nj;j++){
      const rk=`z${z.k}:r:${j}`,ck=`z${z.k}:c:${i}`;
      addLine(rk,avJ(j)?"av":"loc",{dir:"r",zk:z.k,idx:j});addLine(ck,avI(i)?"av":"loc",{dir:"c",zk:z.k,idx:i});
      link(N[i+","+j],N[(i+1)+","+j],rk,lines[rk].cls,i);
      link(N[i+","+j],N[i+","+(j+1)],ck,lines[ck].cls,j);
    }
    z.N=N;z.ni=ni;z.nj=nj;
  });

  /* ---- zone radiale (anneaux + rayons) ---- */
  const radInter=[];
  zones.forEach(z=>{
    if(z.style!=="radial")return;
    const [cx,cy]=z.c,radii=z.rings.concat([z.r]),n=z.spokes,a0=(z.rot||0)*Math.PI/180;
    const P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
    z.rings.forEach((r,k)=>{const key=`rg:${k}`;addLine(key,k===z.rings.length-1?"av":"loc",{dir:"g"});
      for(let m=0;m<n;m++)for(let q2=0;q2<4;q2++){const t1=a0+(m+q2/4)/n*2*Math.PI,t2=a0+(m+(q2+1)/4)/n*2*Math.PI;edges.push({a:P(r,t1),b:P(r,t2),line:key,ord:m*4+q2})}});
    for(let m=0;m<n;m++){const key=`sp:${m}`,a=a0+m/n*2*Math.PI;addLine(key,m%4===0?"av":"loc",{dir:"s"});
      for(let k=0;k<radii.length-1;k++)edges.push({a:P(radii[k],a),b:P(radii[k+1],a),line:key,ord:k});
      for(let k=0;k<radii.length;k++)radInter.push({p:P(radii[k],a),l1:key,l2:k<z.rings.length?`rg:${k}`:`bd:${z.k}`})}
    z.plazaR=z.rings[0];
  });

  /* ---- bordures : boulevards, murs, parcs, côte ---- */
  const borderPieces=(poly,key,keep)=>{let o=0;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],L=dist(a,b),n=Math.max(1,Math.ceil(L/40));
      for(let k=0;k<n;k++){const p1=[a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n],p2=[a[0]+(b[0]-a[0])*(k+1)/n,a[1]+(b[1]-a[1])*(k+1)/n],mid=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2];
        if(keep(mid))edges.push({a:p1,b:p2,line:key,ord:o});o++}}};
  zones.forEach(z=>{if(!z.k)return;const key="bd:"+z.k;addLine(key,z.walled?"wall":"bd",{name:z.border,dir:"b"});
    borderPieces(z.p,key,m=>inCanvas(m)&&!wet(m)&&!zones.slice(z.k+1).some(o=>inPoly(m,o.p)))});
  parks.forEach(k=>{if(!k.route)return;const key="park:"+k.nom;addLine(key,"loc",{name:k.route,dir:"b"});
    borderPieces(k.p,key,m=>m[0]>2&&m[0]<W-2&&m[1]>2&&m[1]<H-2&&!wet(m))});
  if(q.coast){addLine("coast","av",{name:q.coast,dir:"b"});
    water.forEach(w=>borderPieces(w.p,"coast",m=>m[0]>4&&m[0]<W-4&&m[1]>4&&m[1]<H-4&&!zones.some(z=>z.k&&z.walled&&inPoly(m,z.p))))}

  /* ---- noms des rues ---- */
  const pool=q.rues.slice(),avp=q.avenues.slice();
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  /* chaque nom de base n'est utilisé qu'une fois par quartier */
  const usedBase=new Set();Object.values(lines).forEach(l=>{if(l.name)usedBase.add(l.name.replace(/ \S+$/,""))});
  const src=arr=>({arr,i:0}),P1=src(pool),P2=src(avp),PF=src(FALL);
  const ZP={},ZA={};zones.forEach(z=>{ZP[z.k]=src(z.rues||[]);ZA[z.k]=src(z.avenues||[])});
  const pick=list=>{for(const o of list)while(o.i<o.arr.length){const w=o.arr[o.i++];if(!usedBase.has(w)){usedBase.add(w);return w}}return null};
  let num=1,letter=0,na=0,nr=0,extra=1;
  const SUF=["St","St","Way","St","Lane","Rd","St","Pl"],AVS=["Ave","Blvd","Ave","Pkwy","Ave"];
  const present={};edges.forEach(e=>present[e.line]=(present[e.line]||0)+dist(e.a,e.b));
  const keys=Object.keys(lines).filter(k=>present[k]>60).sort((x,y)=>{const a=lines[x],b=lines[y];return (a.zk??9)-(b.zk??9)||String(a.dir).localeCompare(String(b.dir))||(a.idx??0)-(b.idx??0)||x.localeCompare(y)});
  keys.forEach(k=>{const l=lines[k];if(l.name)return;
    if(l.cls==="av"){const w=pick([ZA[l.zk]||src([]),P2,P1,PF]);l.name=w?`${w} ${AVS[na++%AVS.length]}`:`Route ${extra++}`}
    else if(l.dir==="c"&&l.zk===0)l.name=`${q.num||""}${ord(num++)} St`;
    else if(l.dir==="c"&&l.zk>0&&letter<26)l.name=`${String.fromCharCode(65+letter++)} St`;
    else{const w=pick([ZP[l.zk]||src([]),P1,PF]);l.name=w?`${w} ${SUF[nr++%SUF.length]}`:`Alley ${extra++}`}});
  zones.forEach(z=>{if(z.style==="radial"){z.rings.forEach((r,k)=>{const l=lines[`rg:${k}`];if(l)l.name=["Inner Ring","Crown Circle","Halo Ring"][k]||l.name})}});

  /* ---- carrefours ---- */
  const inter=[],seen={};
  const addI=(p,l1,l2)=>{if(!lines[l1]?.name||!lines[l2]?.name||l1===l2)return;if(p[0]<0||p[0]>W||p[1]<0||p[1]>H)return;
    const g=Math.round(p[0]/14)+":"+Math.round(p[1]/14);if(seen[g])return;seen[g]=1;inter.push({p,a:lines[l1].name,b:lines[l2].name,av:lines[l1].cls!=="loc"&&lines[l2].cls!=="loc"})};
  const byPt={};const pk=p=>Math.round(p[0])+":"+Math.round(p[1]);
  edges.forEach(e=>{[e.a,e.b].forEach(p=>{const k=pk(p);(byPt[k]||(byPt[k]={p,ls:new Set()})).ls.add(e.line)})});
  Object.values(byPt).forEach(o=>{const ls=[...o.ls];if(ls.length>=2)addI(o.p,ls[0],ls[1])});
  nodeEnds.forEach(n=>addI(n.p,n.line,n.border));
  radInter.forEach(r=>addI(r.p,r.l1,r.l2));

  /* ---- autoroutes et sorties ---- */
  const hws=(q.hw||[]).map(h=>({...h,p:px(h.pts)}));
  const exits=[];let ex=1;
  hws.forEach(h=>{for(let i=0;i<h.p.length-1;i++)edges.forEach(e=>{const l=lines[e.line];if(!l||l.cls==="loc"||l.cls==="wall")return;
    const hit=segInt(h.p[i],h.p[i+1],e.a,e.b);if(!hit||wet(hit.p))return;
    if(exits.some(x=>dist(x.p,hit.p)<70))return;if(hit.p[0]<10||hit.p[0]>W-10||hit.p[1]<10||hit.p[1]>H-10)return;
    exits.push({p:hit.p,n:ex++,hw:h.nom,rue:l.name})})});

  /* ---- portes de l'enceinte ---- */
  const gates=[];
  zones.forEach(z=>{if(!z.walled)return;nodeEnds.forEach(n=>{if(n.border==="bd:"+z.k&&!gates.some(g=>dist(g.p,n.p)<30))gates.push({p:n.p,rue:lines[n.line].name})})});

  /* ---------------------------- rendu SVG ---------------------------- */
  const pth=poly=>"M"+poly.map(p=>p[0].toFixed(1)+" "+p[1].toFixed(1)).join("L")+"Z";
  const segs={loc:"",av:"",bd:"",wall:""};
  edges.forEach(e=>{const c=lines[e.line]?.cls||"loc";segs[c]+=`M${e.a[0].toFixed(1)} ${e.a[1].toFixed(1)}L${e.b[0].toFixed(1)} ${e.b[1].toFixed(1)}`});
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="nc-svg">`;
  s+=`<defs><pattern id="hatch-${q.id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#1a0a0c"/><line x1="0" y1="0" x2="0" y2="14" stroke="#ff2a3d" stroke-opacity=".35" stroke-width="5"/></pattern>
    <pattern id="waves-${q.id}" width="60" height="20" patternUnits="userSpaceOnUse"><rect width="60" height="20" fill="#05141d"/><path d="M0 12 Q15 6 30 12 T60 12" fill="none" stroke="#0e3346" stroke-width="1.5"/></pattern></defs>`;
  s+=`<rect width="${W}" height="${H}" fill="#0b120e"/>`;
  /* grille de repérage */
  let g="";for(let x=100;x<W;x+=100)g+=`M${x} 0V${H}`;for(let y=100;y<H;y+=100)g+=`M0 ${y}H${W}`;
  s+=`<path d="${g}" stroke="#00ff9c" stroke-opacity=".06" stroke-width="1"/>`;
  parks.forEach(k=>s+=`<path d="${pth(k.p)}" fill="#0f3320" stroke="#1d6b3f" stroke-width="2"/>`);
  zones.forEach(z=>{if(z.style==="radial")s+=`<circle cx="${z.c[0]}" cy="${z.c[1]}" r="${z.plazaR}" fill="#123d2a" stroke="#1d6b3f" stroke-width="2"/>`});
  restr.forEach(k=>s+=`<path d="${pth(k.p)}" fill="url(#hatch-${q.id})" stroke="#ff2a3d" stroke-width="2" stroke-dasharray="10 6"/>`);
  water.forEach(w=>s+=`<path d="${pth(w.p)}" fill="url(#waves-${q.id})" stroke="#1f6f8f" stroke-width="2.5"/>`);
  /* routes : bordure sombre puis chaussée */
  s+=`<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${segs.loc}" stroke="#020604" stroke-width="9"/><path d="${segs.av}${segs.bd}" stroke="#020604" stroke-width="15"/>
    <path d="${segs.loc}" stroke="#2b6b4f" stroke-width="5"/>
    <path d="${segs.av}" stroke="#00c27a" stroke-width="10"/><path d="${segs.bd}" stroke="#00e08d" stroke-width="11"/>
    <path d="${segs.av}${segs.bd}" stroke="#003b24" stroke-width="1.2" stroke-dasharray="10 10"/>
    <path d="${segs.wall}" stroke="#ff2a3d" stroke-width="9" stroke-dasharray="4 3"/></g>`;
  /* assombrir hors du quartier */
  if(area)s+=`<path d="M0 0H${W}V${H}H0Z ${pth(area)}" fill="#000" fill-opacity=".45" fill-rule="evenodd"/>`;
  /* autoroutes */
  hws.forEach(h=>{const d="M"+h.p.map(p=>p.join(" ")).join("L");
    s+=`<path d="${d}" fill="none" stroke="#000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffb000" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#5a3a00" stroke-width="1.6" stroke-dasharray="16 12"/>`});
  /* étiquettes : rues */
  const occ={},cell=p=>Math.floor(p[0]/26)+":"+Math.floor(p[1]/26);
  const free=(pts)=>pts.every(p=>!occ[cell(p)]),mark=pts=>pts.forEach(p=>occ[cell(p)]=1);
  const labels=[];
  const place=(pts,name,cls,fs,at)=>{ /* pts : polyligne ; at : distance */
    let d=0;for(let i=0;i<pts.length-1;i++){const L=dist(pts[i],pts[i+1]);if(d+L>=at){const t=(at-d)/L,p=[pts[i][0]+(pts[i+1][0]-pts[i][0])*t,pts[i][1]+(pts[i+1][1]-pts[i][1])*t];
      let ang=Math.atan2(pts[i+1][1]-pts[i][1],pts[i+1][0]-pts[i][0])*180/Math.PI;if(ang>90)ang-=180;if(ang<-90)ang+=180;
      const half=name.length*fs*0.31,ca=Math.cos(ang*Math.PI/180),sa=Math.sin(ang*Math.PI/180),samp=[];
      for(let k=-half;k<=half;k+=10)samp.push([p[0]+ca*k,p[1]+sa*k]);
      if(p[0]<half*0.3||p[0]>W-20||p[1]<14||p[1]>H-10||!free(samp))return false;if(area&&!inPoly(p,area))return false;
      mark(samp);labels.push(`<text class="${cls}" x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" transform="rotate(${ang.toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)})" font-size="${fs}" dy="${(fs*0.35).toFixed(1)}">${esc(name)}</text>`);return true}d+=L}return false};
  /* priorité : autoroutes > boulevards > avenues > rues */
  const byLine={};edges.forEach(e=>(byLine[e.line]||(byLine[e.line]=[])).push(e));
  const runsOf=k=>{const es=byLine[k].slice().sort((a,b)=>a.ord-b.ord),runs=[];let cur=null;
    es.forEach(e=>{if(cur&&dist(cur[cur.length-1],e.a)<1.5)cur.push(e.b);else{cur=[e.a,e.b];runs.push(cur)}});return runs};
  const plen=pts=>pts.reduce((t,p,i)=>i?t+dist(pts[i-1],p):t,0);
  hws.forEach(h=>{const L=plen(h.p);for(let f of [0.3,0.75])place(h.p,h.nom,"t-hw",17,L*f)});
  const order=Object.keys(byLine).filter(k=>lines[k]?.name).sort((a,b)=>({bd:0,wall:0,av:1,loc:2}[lines[a].cls]-{bd:0,wall:0,av:1,loc:2}[lines[b].cls]));
  order.forEach(k=>{const l=lines[k],cls=l.cls==="loc"?"t-loc":"t-av",fs=l.cls==="loc"?10.5:13,step=l.cls==="loc"?520:430;
    runsOf(k).forEach(r=>{const L=plen(r);if(L<l.name.length*fs*0.62+20)return;const n=Math.max(1,Math.floor(L/step));
      for(let m=0;m<n;m++){const base=L*(m+0.5)/n;for(const off of [0,-0.18,0.18,-0.32,0.32]){const at=base+off*L/n;if(at>10&&at<L-10&&place(r,l.name,cls,fs,at))break}}})});
  s+=`<g class="labels" font-family="'Courier New',monospace">${labels.join("")}</g>`;
  /* sorties d'autoroute, portes */
  exits.forEach(x=>s+=`<g class="exit"><circle cx="${x.p[0]}" cy="${x.p[1]}" r="11" fill="#ffb000" stroke="#000" stroke-width="2.5"/><text x="${x.p[0]}" y="${x.p[1]}" dy="4" font-size="11" font-weight="bold" text-anchor="middle" fill="#000" font-family="monospace">${x.n}</text></g>`);
  gates.forEach(gt=>s+=`<rect x="${gt.p[0]-9}" y="${gt.p[1]-9}" width="18" height="18" fill="#ff2a3d" stroke="#000" stroke-width="2"/><text x="${gt.p[0]}" y="${gt.p[1]}" dy="4" font-size="11" text-anchor="middle" fill="#fff" font-family="monospace" font-weight="bold">⛨</text>`);
  /* lieux */
  const lms=(q.lm||[]).map(([code,nom,x,y])=>({code,nom,p:[x*W,y*H],col:CAT[code.slice(0,2)]||"#ccc"}));
  lms.forEach(l=>s+=`<g class="lm"><rect x="${l.p[0]-22}" y="${l.p[1]-11}" width="44" height="22" rx="3" fill="${l.col}" stroke="#000" stroke-width="2"/><text x="${l.p[0]}" y="${l.p[1]}" dy="4.5" font-size="12" font-weight="bold" text-anchor="middle" fill="#000" font-family="monospace">${l.code}</text><text class="t-lm" x="${l.p[0]}" y="${l.p[1]+25}" font-size="12" text-anchor="middle" fill="${l.col}" font-family="'Courier New',monospace">${esc(l.nom)}</text></g>`);
  /* noms d'eau, parcs, zones interdites, voisins */
  const big=(t,x,y,fill,fs,cls="")=>`<text class="${cls}" x="${x}" y="${y}" font-size="${fs}" fill="${fill}" text-anchor="middle" font-family="'Courier New',monospace" font-weight="bold" letter-spacing="3">${esc(t)}</text>`;
  water.forEach(w=>{if(w.nom)s+=big(w.nom,(w.lx??0.5)*W,(w.ly??0.5)*H,"#2a85ad",18,"t-big")});
  parks.forEach(k=>{const c=k.p.reduce((a,p)=>[a[0]+p[0]/k.p.length,a[1]+p[1]/k.p.length],[0,0]);s+=big(k.nom,c[0],c[1],"#3fae6a",20,"t-big")});
  zones.forEach(z=>{if(z.plaza)s+=big(z.plaza,z.c[0],z.c[1]+6,"#3fae6a",15,"t-big")});
  restr.forEach(k=>{const c=k.p.reduce((a,p)=>[a[0]+p[0]/k.p.length,a[1]+p[1]/k.p.length],[0,0]);s+=big(k.nom,c[0],c[1]+6,"#ff5a6a",17,"t-big")});
  (q.voisins||[]).forEach(([t,x,y])=>s+=`<text x="${x*W}" y="${y*H}" font-size="16" fill="#9fb8aa" fill-opacity=".55" text-anchor="middle" font-family="'Courier New',monospace" letter-spacing="2">${esc(t)}</text>`);
  /* repères de grille */
  let gr="";for(let i=0;i<16;i++)gr+=`<text x="${i*100+50}" y="16" font-size="13" text-anchor="middle">${String.fromCharCode(65+i)}</text><text x="${i*100+50}" y="${H-6}" font-size="13" text-anchor="middle">${String.fromCharCode(65+i)}</text>`;
  for(let j=0;j<11;j++)gr+=`<text x="8" y="${j*100+55}" font-size="13">${j+1}</text><text x="${W-8}" y="${j*100+55}" font-size="13" text-anchor="end">${j+1}</text>`;
  s+=`<g fill="#00ff9c" fill-opacity=".5" font-family="monospace" font-weight="bold">${gr}</g>`;
  /* cibles tactiles */
  let hit="";
  inter.forEach((it,i)=>hit+=`<circle data-i="${i}" cx="${it.p[0].toFixed(1)}" cy="${it.p[1].toFixed(1)}" r="11"/>`);
  exits.forEach((x,i)=>hit+=`<circle data-x="${i}" cx="${x.p[0].toFixed(1)}" cy="${x.p[1].toFixed(1)}" r="14"/>`);
  gates.forEach((x,i)=>hit+=`<circle data-g="${i}" cx="${x.p[0].toFixed(1)}" cy="${x.p[1].toFixed(1)}" r="14"/>`);
  lms.forEach((l,i)=>hit+=`<rect data-l="${i}" x="${l.p[0]-24}" y="${l.p[1]-13}" width="48" height="26"/>`);
  s+=`<g class="hit" fill="#fff" fill-opacity="0">${hit}</g><circle class="sel" r="14" cx="-50" cy="-50" fill="none" stroke="#fff" stroke-width="3"/></svg>`;
  const nbStreets=new Set(Object.values(lines).filter(l=>l.name&&present[l.key]>60).map(l=>l.name)).size;
  return CACHE[q.id]={svg:s,inter,exits,gates,lms,nbStreets};
}

/* ------------------------- visionneuse zoomable ------------------------- */
function zoomable(box,inner,w,h,onScale,onTap){
  let s=1,tx=0,ty=0,fitS=1;const pts=new Map();let moved=0,downT=null,last=null;
  const rect=()=>box.getBoundingClientRect();
  const apply=()=>{inner.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;onScale&&onScale(s)};
  const fit=()=>{const r=rect();fitS=Math.min(r.width/w,r.height/h);s=fitS;tx=(r.width-w*s)/2;ty=(r.height-h*s)/2;apply()};
  const zoomAt=(f,cx,cy)=>{const ns=Math.max(fitS*0.8,Math.min(fitS*14,s*f));f=ns/s;tx=cx-(cx-tx)*f;ty=cy-(cy-ty)*f;s=ns;apply()};
  box.addEventListener("wheel",e=>{e.preventDefault();const r=rect();zoomAt(Math.exp(-e.deltaY*0.0016),e.clientX-r.left,e.clientY-r.top)},{passive:false});
  box.addEventListener("pointerdown",e=>{if(e.target.closest(".nc-tools"))return;box.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===1){moved=0;downT=e.target}last=null});
  box.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;const prev=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===1){tx+=e.clientX-prev[0];ty+=e.clientY-prev[1];moved+=Math.abs(e.clientX-prev[0])+Math.abs(e.clientY-prev[1]);apply()}
    else if(pts.size===2){const [a,b]=[...pts.values()],d=dist(a,b),m=[(a[0]+b[0])/2,(a[1]+b[1])/2],r=rect();moved+=99;
      if(last){zoomAt(d/last.d,m[0]-r.left,m[1]-r.top);tx+=m[0]-last.m[0];ty+=m[1]-last.m[1];apply()}last={d,m}}});
  const up=e=>{if(!pts.has(e.pointerId))return;pts.delete(e.pointerId);last=null;
    if(pts.size===0&&moved<8&&onTap){const r=rect();onTap(downT,[(e.clientX-r.left-tx)/s,(e.clientY-r.top-ty)/s],[e.clientX-r.left,e.clientY-r.top])}};
  box.addEventListener("pointerup",up);box.addEventListener("pointercancel",up);
  box.addEventListener("dblclick",e=>{const r=rect();zoomAt(2,e.clientX-r.left,e.clientY-r.top)});
  addEventListener("resize",()=>{if(box.isConnected)fit()});
  const c=()=>{const r=rect();return[r.width/2,r.height/2]};
  return{fit,zin:()=>zoomAt(1.5,...c()),zout:()=>zoomAt(1/1.5,...c()),scale:()=>s/fitS,
    centerOn:(p,k)=>{fit();const r=rect();s=fitS*k;tx=r.width/2-p[0]*s;ty=r.height/2-p[1]*s;apply()}};
}

/* ---------------------------- styles ---------------------------- */
const CSS=`
.nc-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}
.nc-tabs button{padding:6px 10px;font-size:12px}
.nc-box{position:relative;height:min(78vh,860px);min-height:340px;overflow:hidden;border:1px solid var(--c);background:#000;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}
.nc-box:active{cursor:grabbing}
.nc-box:fullscreen{height:100vh;border:0}
.nc-inner{position:absolute;left:0;top:0;transform-origin:0 0}
.nc-inner img{display:block;width:100%;height:100%;pointer-events:none}
.nc-tools{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:3}
.nc-tools button{width:42px;height:42px;padding:0;font-size:20px;background:#000c}
.nc-tip{position:absolute;z-index:4;max-width:280px;background:#020805;border:1px solid var(--c);box-shadow:0 0 14px var(--dim);padding:8px 10px;font-size:13px;pointer-events:none;display:none}
.nc-tip b{display:block;letter-spacing:.08em}
.nc-hint{position:absolute;left:8px;bottom:8px;z-index:3;font-size:11px;background:#000b;padding:4px 8px;opacity:.85;pointer-events:none}
.nc-svg text.t-loc,.nc-svg text.t-av,.nc-svg text.t-hw{paint-order:stroke;stroke:#020604;stroke-width:3.5px;stroke-linejoin:round;text-anchor:middle}
.nc-svg text.t-loc{fill:#b9f5d6}.nc-svg text.t-av{fill:#eafff4;font-weight:bold}.nc-svg text.t-hw{fill:#ffcf57;font-weight:bold;letter-spacing:2px}
.nc-svg text.t-lm{paint-order:stroke;stroke:#020604;stroke-width:3px}
.nc-box.z0 .t-loc,.nc-box.z0 .t-av,.nc-box.z0 .t-lm,.nc-box.z1 .t-loc,.nc-box.z1 .t-lm{display:none}
.nc-legend{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:4px 14px;font-size:12px;margin-top:8px}
.nc-legend span{display:inline-block;width:26px;height:8px;margin-right:8px;vertical-align:middle}
.nc-lms{columns:2 240px;font-size:12px;margin-top:8px}
.nc-lms div{break-inside:avoid;padding:2px 0}
.nc-lms b{display:inline-block;min-width:44px;color:#000;text-align:center;margin-right:6px;padding:0 3px}
.nc-search{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.nc-search input{flex:1;min-width:160px;text-transform:none}
.nc-res{font-size:12px;max-height:180px;overflow:auto;margin-top:6px}
.nc-res button{display:block;width:100%;text-align:left;padding:5px 8px;margin-top:3px;font-size:12px}
`;
let cssDone=false;const css=()=>{if(cssDone)return;cssDone=true;const st=document.createElement("style");st.textContent=CSS;document.head.append(st)};

/* ---------------------------- page CARTE ---------------------------- */
function render(view,id){
  css();document.body.classList.add("wide");
  const q=QUARTIERS.find(x=>x.id===id);
  view.innerHTML=`<a href="#">← INDEX</a><h2>▓ CARTE // ${q?esc(q.nom.toUpperCase()):"NIGHT CITY"}</h2>
    <div class="nc-tabs"><a href="#carte"><button class="${q?"":"on"}">NIGHT CITY</button></a>${QUARTIERS.map(x=>`<a href="#carte-${x.id}"><button class="${q&&q.id===x.id?"on":""}">${esc(x.nom.split(/ [—&]/)[0].toUpperCase())}</button></a>`).join("")}</div>
    ${q?`<p><small>${esc(q.desc)}</small></p>`:""}
    <div class="nc-box"><div class="nc-inner"></div><div class="nc-tools"><button data-z="in" title="Zoomer">+</button><button data-z="out" title="Dézoomer">−</button><button data-z="fit" title="Vue entière">⤢</button><button data-z="fs" title="Plein écran">⛶</button></div><div class="nc-tip"></div>
    <div class="nc-hint">${q?"MOLETTE / PINCER : ZOOM · GLISSER : DÉPLACER · TOUCHER UN CARREFOUR : NOMS DES RUES":"MOLETTE / PINCER : ZOOM · GLISSER : DÉPLACER · DOUBLE-CLIC : ZOOM"}</div></div>
    <div id="nc-info"></div>`;
  const box=$(".nc-box",view),inner=$(".nc-inner",view),tip=$(".nc-tip",view);
  let w,h,data=null;
  if(q){data=build(q);w=W;h=H;inner.innerHTML=data.svg}
  else{w=IMG.w;h=IMG.h;inner.innerHTML=`<img src="${IMG.src}" alt="Carte de Night City" width="${w}" height="${h}" draggable="false">`}
  inner.style.width=w+"px";inner.style.height=h+"px";
  const sel=q?inner.querySelector(".sel"):null;
  const showTip=(html,scr,p)=>{tip.innerHTML=html;tip.style.display="block";const r=box.getBoundingClientRect();
    tip.style.left=Math.min(Math.max(8,scr[0]+14),r.width-290)+"px";tip.style.top=Math.min(Math.max(8,scr[1]+14),r.height-90)+"px";
    if(sel&&p){sel.setAttribute("cx",p[0]);sel.setAttribute("cy",p[1])}};
  const hideTip=()=>{tip.style.display="none";if(sel){sel.setAttribute("cx",-50);sel.setAttribute("cy",-50)}};
  let lod=()=>{};
  const z=zoomable(box,inner,w,h,()=>lod(),(t,p,scr)=>{
    if(!data){hideTip();return}
    const el=t&&t.closest&&t.closest("[data-i],[data-x],[data-g],[data-l]");
    if(!el){hideTip();return}
    if(el.dataset.i){const it=data.inter[+el.dataset.i];showTip(`<b>▓ CARREFOUR ${ref(it.p)}</b>${esc(it.a)}<br>× ${esc(it.b)}`,scr,it.p)}
    else if(el.dataset.x){const x=data.exits[+el.dataset.x];showTip(`<b>▓ ${esc(x.hw)} — SORTIE ${x.n}</b>${esc(x.rue)} · ${ref(x.p)}`,scr,x.p)}
    else if(el.dataset.g){const g=data.gates[+el.dataset.g];showTip(`<b>▓ PORTE — POSTE DE CONTRÔLE</b>${esc(g.rue)} · ${ref(g.p)}`,scr,g.p)}
    else if(el.dataset.l){const l=data.lms[+el.dataset.l];showTip(`<b>▓ ${esc(l.code)}</b>${esc(l.nom)} · ${ref(l.p)}`,scr,l.p)}});
  /* niveaux de détail selon le zoom (taille réelle des textes à l'écran) */
  lod=()=>{const k=z.scale()*Math.min(box.clientWidth/w,box.clientHeight/h);box.classList.toggle("z0",k<0.5);box.classList.toggle("z1",k>=0.5&&k<0.85)};
  $(".nc-tools",view).onclick=e=>{const a=e.target.closest("button")?.dataset.z;if(!a)return;hideTip();
    if(a==="in")z.zin();if(a==="out")z.zout();if(a==="fit")z.fit();
    if(a==="fs"){if(document.fullscreenElement)document.exitFullscreen();else box.requestFullscreen?.().catch(()=>{})}};
  document.addEventListener("fullscreenchange",()=>{if(box.isConnected)setTimeout(z.fit,60)});
  box.addEventListener("pointerdown",e=>{if(!e.target.closest(".nc-tools"))hideTip()});
  requestAnimationFrame(z.fit);
  /* légende */
  const info=$("#nc-info",view);
  if(!q){info.innerHTML=`<p><small>CARTE GÉNÉRALE (SOURCE : CARTE NON OFFICIELLE CYBERPUNK RED). CHOISISSEZ UN QUARTIER CI-DESSUS POUR SON PLAN ROUTIER DÉTAILLÉ.</small></p>`;return}
  info.innerHTML=`<div class="panel" style="margin-top:10px"><div>▓ LÉGENDE — ${data.nbStreets} RUES · ${data.inter.length} CARREFOURS${data.exits.length?" · "+data.exits.length+" SORTIES D'AUTOROUTE":""}</div>
    <div class="nc-legend"><div><span style="background:#ffb000"></span>Autoroute / pont (sorties numérotées)</div><div><span style="background:#00e08d"></span>Boulevard / route côtière</div>
    <div><span style="background:#00c27a"></span>Avenue (axe principal)</div><div><span style="background:#2b6b4f"></span>Rue</div>
    ${data.gates.length?`<div><span style="background:#ff2a3d"></span>Mur d'enceinte · ⛨ porte</div>`:""}
    <div><span style="background:#0f3320;border:1px solid #1d6b3f"></span>Parc</div><div><span style="background:#05141d;border:1px solid #1f6f8f"></span>Eau</div>
    ${q.restricted?`<div><span style="background:repeating-linear-gradient(45deg,#ff2a3d55 0 4px,#1a0a0c 4px 8px)"></span>Zone interdite</div>`:""}
    <div>A–P / 1–11 : grille de repérage (100 m env.)</div></div>
    <div class="nc-search"><input id="nc-q" placeholder="Chercher une rue ou un lieu…" autocomplete="off" spellcheck="false"></div><div class="nc-res" id="nc-r"></div>
    ${data.lms.length?`<div class="nc-lms">${data.lms.map(l=>`<div><b style="background:${l.col}">${esc(l.code)}</b>${esc(l.nom)} · ${ref(l.p)}</div>`).join("")}</div>`:""}</div>`;
  /* recherche : centre la carte sur le résultat */
  const qi=$("#nc-q",view),res=$("#nc-r",view);
  qi.oninput=()=>{const v=qi.value.trim().toLowerCase();if(v.length<2){res.innerHTML="";return}
    const hits=[];data.lms.forEach((l,i)=>{if((l.code+" "+l.nom).toLowerCase().includes(v))hits.push({t:`${l.code} — ${l.nom}`,p:l.p})});
    const seenN=new Set();data.inter.forEach(it=>{[it.a,it.b].forEach(n=>{if(n.toLowerCase().includes(v)&&!seenN.has(n)){seenN.add(n);hits.push({t:n,p:it.p})}})});
    res.innerHTML=hits.slice(0,30).map((h,i)=>`<button data-k="${i}">${esc(h.t)} · ${ref(h.p)}</button>`).join("")||"<small>AUCUN RÉSULTAT</small>";
    res.querySelectorAll("button").forEach(b=>b.onclick=()=>{const h=hits[+b.dataset.k];center(h.p);showTip(`<b>▓ ${esc(h.t)}</b>${ref(h.p)}`,[box.clientWidth/2,box.clientHeight/2],h.p)})};
  const center=p=>{z.centerOn(p,3);box.scrollIntoView({behavior:"smooth",block:"center"})};
}
const $=(s,e=document)=>e.querySelector(s);

window.NC_CARTE={render,QUARTIERS,build};
})();
