/* =====================================================================
   BEYOND HUMAN // CARTES DE NIGHT CITY
   - Une seule ville cohérente : chaque quartier remplit son emprise sur la
     carte officielle avec son propre réseau de rues (style, densité, noms).
   - Les plans de quartier sont des vues du plan complet : mêmes rues,
     mêmes autoroutes, mêmes lieux, même grille de repérage partout.
   - Coordonnées de configuration : repère de la carte officielle (2000 × 1332).
   ===================================================================== */
(function(){
"use strict";
const IMG={src:"Images/Carte/night-city.jpg",w:3615,h:2408};

/* ---------------------------------------------------------------------
   QUARTIERS (ordre = priorité quand deux emprises se chevauchent)
   fp : emprise sur la carte officielle · t : position du nom · coast : route côtière
   limite : nom du boulevard de limite · zones : 1re = tout le quartier, suivantes = secteurs
   (poly), avec angle, espacement sx/sy, drop, av, warp, border, rues/avenues propres ;
   style "radial" : c (centre), r, rings, spokes
   --------------------------------------------------------------------- */
const QUARTIERS=[{"id":"executive-zone","nom":"Executive Zone","court":"EXECUTIVE ZONE","seed":101,"desc":"Enclave fortifiée des élites corporatistes : mur à bastions, accès uniquement par les portes des avenues.","fp":[[1426.9,423.9],[1420.1,423.1],[1414.5,419.9],[1413.9,413.5],[1418.8,409.3],[1425.1,410.9],[1430.9,415.2],[1493.1,385.8],[1493.9,378.1],[1497.1,372.5],[1503.5,371.9],[1507.7,376.8],[1506.1,383.1],[1501.6,389.3],[1529.4,455.7],[1536.9,456.9],[1542.5,460.2],[1543.1,466.6],[1538.1,470.8],[1531.9,469.1],[1525.4,464.4],[1455.6,489.6],[1453.7,497.3],[1450.0,502.6],[1443.5,502.7],[1439.8,497.4],[1442.0,491.3],[1447.1,486.1]],"t":[1470,362],"coast":null,"limite":"Mur d'enceinte","walled":true,"num":"X ","zones":[{"angle":-24,"sx":41,"sy":39,"drop":0.02,"av":[2,2]}],"rues":["Platinum","Sovereign","Aurora","Monarch","Regent","Opal","Sapphire","Ivory","Gilded","Prestige","Belvedere","Majestic","Solstice","Celestial","Crystal","Marquis","Diamond","Pinnacle","Laureate","Emerald","Aristocrat","Orchid","Ambassador","Grandview","Bellevue","Riviera","Cashmere","Velour","Champagne","Caviar","Penthouse","Concierge","Yacht","Chateau","Villa","Marble"],"avenues":["Executive","Summit","Zenith","Olympus","Elysium","Crown","Apex","Panorama"]},
{"id":"city-center","nom":"City Center — Corp Center, Bank Block, Med Center","court":"CITY CENTER","seed":37,"desc":"Cœur corporatiste : Corp Plaza en anneaux, tours bancaires au nord-est, Med Center à l'est, Lake Park au sud-ouest.","fp":[[870,445],[1080,445],[1080,520],[1200,540],[1210,610],[1150,660],[1040,700],[880,690],[875,560]],"t":[985,515],"coast":null,"limite":"Downtown Blvd","walled":false,"num":"C ","zones":[{"angle":0,"sx":70,"sy":62,"warp":[3,220],"drop":0.03,"av":[4,4]},{"angle":24,"sx":72,"sy":62,"drop":0.05,"av":[3,3],"border":"Med Center Pkwy","rues":["Pulse","Scalpel","Suture","Triage","Cortex","Synapse","Marrow","Plasma","Vital","Serum","Neuron","Retina","Clinic","Ward","Pharma","Surgeon"],"avenues":["Hippocrates","Trauma","Caduceus","Remedy"],"poly":[[1082,505],[1270,530],[1270,760],[1082,720]]},{"style":"radial","c":[962,598],"r":200,"rings":[52,102,152],"spokes":16,"rot":0,"ringNames":["Inner Ring","Crown Circle","Halo Ring"],"border":"Grand Circle Blvd","plaza":"CORP PLAZA"}],"rues":["Arasaka","Kang Tao","Petrochem","Biotech","Zetatech","Kiroshi","Dynalar","Orbital","Netwatch","Ziggurat","Ironcrown","Raven","Merrill","Asukaga","Finch","Highcourt","Halcyon","Sterling","Obsidian","Paragon","Vantage","Chrome","Ledger","Bourse","Tycoon","Mercator","Dividend","Holding","Trust","Capital","Equity","Futures"],"avenues":["Corporation","Plaza","Bank","Exchange","Capitol","Concord","Senate","Sovereign","Obelisk","Spire","Meridian","Atlas","Pinnacle","Monolith","Helix","Quantum","Vector","Cortex","Axiom","Nexus","Prism","Titan"]},
{"id":"upper-marina","nom":"Upper Marina","court":"UPPER MARINA","seed":41,"desc":"Front de mer huppé au nord-est : port de plaisance, ferry, stade McCartney, l'Afterlife.","fp":[[1080,400],[1160,395],[1250,430],[1300,480],[1330,540],[1210,610],[1200,540],[1080,520]],"t":[1195,470],"coast":"Bayfront Esplanade","limite":"Harborline Ave","walled":false,"num":"E ","zones":[{"angle":30,"sx":72,"sy":64,"warp":[5,200],"drop":0.05,"av":[4,4]},{"angle":0,"sx":72,"sy":62,"drop":0.04,"av":[4,4],"border":"Marina Blvd","rues":["Stadium","Bleacher","Touchdown","Marquee","Encore","Matinee","Velvet","Spotlight","Jukebox","Cabaret","Ticket","Arcade","Premiere","Ballroom"],"avenues":["Cinemaxus","Broadway","Showtime"],"poly":[[1060,470],[1170,470],[1215,560],[1060,560]]}],"rues":["Anchor","Harbor","Pier","Seawall","Spinnaker","Regatta","Lighthouse","Mariner","Coral","Keel","Galleon","Compass","Tidewater","Driftwood","Saltair","Bayview","Clipper","Starboard","Pelican","Breakwater","Mooring","Schooner","Ferry","Gull","Kelp","Neptune","Sailcloth","Buoy","Rigging","Gangway","Halyard","Mast","Tiller","Bowline","Capstan","Fathom"],"avenues":["Marina","Ocean","McCartney","Afterlife","Admiral","Pacific","Commodore","Shoreline"]},
{"id":"little-china","nom":"Little China & Old Japan Town","court":"LITTLE CHINA","seed":53,"desc":"Rues denses en diagonale de Little China, damier d'Old Japan Town à l'ouest, US-16 le long de la baie.","fp":[[1210,610],[1330,540],[1380,600],[1275,705],[1150,780],[1040,760],[1040,700],[1150,660]],"t":[1240,650],"coast":"Bayfront Rd","limite":"Pagoda Gate Blvd","walled":false,"num":"E ","zones":[{"angle":35,"sx":70,"sy":60,"warp":[4,200],"drop":0.06,"av":[4,4]},{"angle":0,"sx":68,"sy":58,"drop":0.05,"av":[4,4],"border":"Nihonmachi Ave","rues":["Yamato","Shogun","Kyoto","Osaka","Hokkaido","Torii","Bonsai","Ronin","Shibuya","Asakusa","Nagoya","Matsuri","Sakai","Kobe","Sendai","Hiroshima","Okinawa","Tatami","Origami","Samurai","Ginkgo","Fuji","Kamakura","Nara"],"avenues":["Japantown","Tokugawa","Meiji","Edo","Rising Sun","Sakuragi"],"poly":[[1000,640],[1150,640],[1185,700],[1150,800],[1000,800]]}],"rues":["Canton","Pagoda","Jade","Lotus","Shanghai","Mahjong","Lantern","Phoenix","Jasmine","Bamboo","Ginseng","Macau","Silk","Oolong","Fortune","Cathay","Peking","Ming","Tang","Han","Kowloon Gate","Wonton","Dim Sum","Abacus","Koi","Teahouse","Firecracker","Golden Lion","Harmony","Sampan"],"avenues":["Chinatown","Dragon","Jade Empire","Japantown","Pearl","Imperial","Emperor","Tiger"]},
{"id":"old-combat-zone","nom":"Old Combat Zone","court":"OLD COMBAT ZONE","seed":83,"desc":"Ancienne zone de combat au sud-est, traversée en diagonale par l'US-16.","fp":[[1040,760],[1150,780],[1275,705],[1225,800],[1120,885],[1060,900]],"t":[1130,815],"coast":"Breakwater Rd","limite":"Firebreak Blvd","walled":false,"num":"SE ","zones":[{"angle":40,"sx":70,"sy":62,"warp":[6,170],"drop":0.14,"av":[4,4]},{"angle":0,"sx":72,"sy":62,"drop":0.1,"av":[4,4],"border":"Kennedy St","poly":[[1000,740],[1100,740],[1100,940],[1000,940]]}],"rues":["Mercenary","Napalm","Bunker","Ambush","Trench","Tracer","Bullet","Molotov","Grenade","Sniper","Barrage","Outpost","Siege","Patrol","Mortar","Flak","Recon","Sabotage","Fortress","Bastion","Garrison","Rampart","Flank","Raider","Volley","Sortie","Shellshock","Crossfire","Tripwire","Claymore","Foxhole","Bayonet","Kevlar","Hardpoint","Firebase","Dogtag","Ammo","Breach","Overwatch","Holdout","Sandbag","Killbox","Gunsmoke","Rifle","Muzzle","Payload","Warhead","Ricochet","Salvo","Skirmish","Cordon"],"avenues":["Combat Zone","Old Industrial","Precinct","Lockjaw","Ironside","Warpath","Arsenal","Kevlar"]},
{"id":"the-glen","nom":"The Glen & Lake Park","court":"THE GLEN","seed":61,"desc":"Quartier civique relevé rue par rue sur la carte d'origine : boulevard ovale Glen Circle, axes droits, grande diagonale vers Lake Park.","fp":[[880,690],[1040,700],[1040,828],[1055,830],[1059,901],[1030,930],[990,935],[975,942],[945,942],[905,927],[903,905],[880,900],[880,815],[858,800],[860,720]],"t":[960,850],"coast":"Dockside Rd","limite":"Civic Line","walled":false,"num":"S ","zones":[],"rues":["Justice","Liberty","Charter","Union","Magistrate","Lakeview","Willow","Juniper","Sycamore","Elm","Cypress","Magnolia","Laurel","Linden","Poplar","Rosewood","Hawthorne","Ash","Birch","Cedar","Maple","Aspen","Chestnut","Alder","Hickory","Tribune","Courthouse","Gavel","Verdict","Jury","Docket","Statute","Ballot","Treasury","Archive","Mint","Census","Oath","Decree","Petition","Quorum","Bylaw","Amendment","Consul"],"avenues":["Glen","Mayor","Civic","Federal","Constitution","Founders","Republic","Senate"],"custom":[{"n":"Glen Circle","c":"bd","pts":[[949,762],[972,766],[990,786],[999,800],[1006,818],[1014,836],[1032,849],[1022,875],[1010,905],[1000,918],[985,925],[960,928],[943,922],[930,910],[915,892],[906,882],[903,860],[902,840],[896,822],[892,808],[892,795],[898,785],[905,777],[920,770],[935,764]],"closed":true},{"n":"Federal Pkwy","c":"av","pts":[[937,718],[920,770]]},{"n":"Federal Pkwy","c":"av","pts":[[892,806],[852,825]]},{"n":"Liberty Ave","c":"av","pts":[[850,768],[909,768]]},{"n":"Liberty Ave","c":"av","pts":[[974,768],[1045,768]]},{"n":"Union Blvd","c":"av","pts":[[892,798],[1045,798]]},{"n":"Constitution Ave","c":"av","pts":[[870,842],[1060,842]]},{"n":"Mayor Ave","c":"av","pts":[[870,868],[1060,868]]},{"n":"Republic Ave","c":"av","pts":[[870,895],[1060,895]]},{"n":"Justice St","c":"av","pts":[[901,880],[901,945]]},{"n":"Civic Ave","c":"av","pts":[[944,762],[944,945]]},{"n":"Tribune Ave","c":"av","pts":[[987,787],[987,945]]},{"n":"Sycamore St","c":"loc","pts":[[939,722],[938,763]]},{"n":"Laurel St","c":"loc","pts":[[985,722],[986,778]]},{"n":"Willow St","c":"loc","pts":[[880,700],[880,800]]},{"n":"Juniper Lane","c":"loc","pts":[[858,750],[901,750]]},{"n":"Elm St","c":"loc","pts":[[939,737],[1045,737]]},{"n":"Ledger St","c":"loc","pts":[[992,722],[1020,722],[1045,738]]},{"n":"Magnolia St","c":"loc","pts":[[1008,696],[1036,730]]},{"n":"Linden St","c":"loc","pts":[[963,842],[963,928]]},{"n":"Cypress Lane","c":"loc","pts":[[1009,842],[1009,905]]},{"n":"Rosewood St","c":"loc","pts":[[920,770],[920,842]]}]},
{"id":"little-europe","nom":"Little Europe & University District","court":"LITTLE EUROPE","seed":23,"desc":"Quartiers européens au nord, campus de la NCU au sud, côte ouest sur San Morro Bay.","fp":[[625,470],[700,415],[800,400],[1080,400],[1080,445],[870,445],[875,560],[880,690],[860,720],[700,725],[630,700],[640,600]],"t":[750,560],"coast":"Seawall Promenade","limite":"Old Town Blvd","walled":false,"num":"W ","zones":[{"angle":4,"sx":74,"sy":64,"warp":[5,200],"drop":0.06,"av":[4,4]},{"angle":-12,"sx":96,"sy":80,"drop":0.08,"av":[3,3],"border":"University Ave","rues":["Dean","Faculty","Thesis","Lecture","Tenure","Alumni","Library","Quad","Laboratory","Diploma","Seminar","Chancellor","Varsity","Fellowship","Graduate","Archive"],"avenues":["Campus","Scholar","Academy","Provost"],"poly":[[600,640],[890,630],[900,760],[600,760]]}],"rues":["Marseille","Vienna","Bruges","Kraków","Lisbon","Montmartre","Bavaria","Seville","Florence","Prague","Rotterdam","Lyon","Salzburg","Antwerp","Napoli","Bordeaux","Dublin","Geneva","Turin","Ghent","Porto","Hamburg","Verona","Sorbonne","Oxford","Bologna","Utrecht","Leuven","Basel","Ljubljana","Tallinn","Riga","Krakow Gate","Valencia","Toulouse","Strasbourg"],"avenues":["Europa","Heidelberg","Champs","Danube","Rhine","Campus","Scholar","Academy"]},
{"id":"south-night-city","nom":"South Night City","court":"SOUTH NIGHT CITY","seed":73,"desc":"Zone de combat : rues défoncées, docks au sud-ouest, pont vers Pacifica au sud.","fp":[[630,700],[700,725],[860,720],[1040,760],[1060,900],[1000,960],[990,1000],[830,1000],[720,965],[660,880],[625,780]],"t":[770,860],"coast":"Dockside Rd","limite":"Southline Blvd","walled":false,"num":"S ","zones":[{"angle":2,"sx":72,"sy":62,"warp":[7,160],"drop":0.13,"av":[4,4]},{"angle":-25,"sx":110,"sy":90,"drop":0.15,"av":[3,3],"border":"Dock Rd","poly":[[580,790],[740,850],[800,1020],[580,1020]]}],"rues":["Rust","Gutter","Scrap","Ashfall","Razorwire","Burnout","Cinder","Brimstone","Slagheap","Junkyard","Lockdown","Static","Barricade","Shrapnel","Blackout","Hollow","Vermin","Rubble","Graveyard","Tombstone","Smog","Grime","Shank","Cutthroat","Bleak","Gallows","Ratline","Scrapyard","Dumpster","Furnace Row","Crowbar","Lead Pipe","Chainlink","Barbwire","Sewer","Wreckage"],"avenues":["Combat","South","Warlord","Boneyard","Fallout","Chrome Skull","Salvage","Ironclad"]},
{"id":"watson","nom":"Watson","court":"WATSON","seed":11,"desc":"Ancien district industriel au nord, docks et usines au sud-est, base militaire de NorCal au nord.","fp":[[715,0],[1100,0],[1100,335],[960,345],[900,335],[800,285],[730,180]],"t":[905,180],"coast":"Waterfront Dr","limite":"Watson Blvd","walled":false,"num":"N ","zones":[{"angle":-6,"sx":78,"sy":66,"warp":[6,180],"drop":0.07,"av":[5,4]},{"angle":18,"sx":118,"sy":94,"drop":0.15,"av":[3,3],"border":"Foundry Blvd","rues":["Container","Forklift","Freight","Cargo","Stevedore","Bollard","Hoist","Tanker","Barge","Drydock","Welder","Conveyor"],"avenues":["Dockyard","Shipyard","Longshore"],"poly":[[960,160],[1140,150],[1140,380],[960,380]]}],"rues":["Kabuki","Ishikawa","Ginza","Sakura","Hanami","Kowloon","Shinbashi","Morita","Docklands","Rivet","Anvil","Crane","Ironworks","Sentinel","Pylon","Harbor","Kiyomi","Nakano","Tetsuo","Akasaka","Yokohama","Bluewater","Smelter","Gantry","Cobalt","Slag"],"avenues":["Northside","Watson","Arroyo","Kenji","Militech","Tsunami","Gateway","Meridian"]},
{"id":"new-westbrook","nom":"New Westbrook","court":"NEW WESTBROOK","seed":97,"desc":"Banlieue surpeuplée à l'est, entre l'US-828 et l'I-101, aux portes de l'Executive Zone.","fp":[[1100,0],[1700,0],[1700,620],[1365,620],[1365,590],[1330,500],[1300,430],[1180,345],[1100,335]],"t":[1320,250],"coast":"Bayview Dr","limite":"Northgate Blvd","walled":false,"num":"NE ","zones":[{"angle":12,"sx":66,"sy":58,"warp":[5,190],"drop":0.06,"av":[4,4]},{"angle":-20,"sx":70,"sy":60,"drop":0.06,"av":[3,3],"border":"Westbrook Blvd","poly":[[1420,-20],[1575,-20],[1575,300],[1440,280]]},{"poly":[[1570,-20],[1760,-20],[1760,700],[1580,700]],"angle":8,"sx":140,"sy":120,"warp":[10,200],"drop":0.3,"av":[2,2],"border":"Perimeter Rd"}],"rues":["Charter Hill","Northoak","Elmwood","Silverlake","Hillcrest","Oakmont","Pinecrest","Briarwood","Redwood","Fairview","Glenwood","Ridgeview","Brookside","Meadow","Kingsley","Ashford","Wellington","Belmont","Ivy","Windsor","Highland","Prescott","Crestwood","Sunset","Stonegate","Foxglove","Applewood","Bramble","Cherrywood","Dogwood","Evergreen","Fernhill","Goldenrod","Hazelnut","Ironwood","Lakeside","Mapleton","Northgate","Orchard","Primrose","Quailridge","Rosemont","Sagewood","Thornbury","Valleyview","Westgate","Wildflower","Woodbine","Yarrow","Ashgrove"],"avenues":["Westbrook","Northridge","Empire","Rockling","Skyline","Horizon","Network","Summit Ridge"]},
{"id":"heywood","nom":"Heywood & Heywood Industrial Zone","court":"HEYWOOD","seed":113,"desc":"Territoire des Valentinos : rues en diagonale, zone industrielle au nord-est, trois autoroutes.","fp":[[1365,620],[1700,620],[1700,1332],[1300,1332],[1250,1120],[1150,1100],[1080,1040],[1150,960],[1260,830],[1365,700]],"t":[1470,1000],"coast":"Bayside Dr","limite":"Valentino Blvd","walled":false,"num":"H ","zones":[{"angle":25,"sx":70,"sy":60,"warp":[5,190],"drop":0.07,"av":[4,4]},{"angle":8,"sx":150,"sy":120,"drop":0.1,"av":[2,2],"border":"Industrial Pkwy","rues":["Furnace","Turbine","Piston","Boiler","Assembly","Warehouse","Smokestack","Rail Yard","Lathe","Crucible"],"avenues":["Ironworks","Factory","Zhirafa"],"poly":[[1440,600],[1590,600],[1590,900],[1440,880]]},{"poly":[[1580,600],[1760,600],[1760,1360],[1600,1360]],"angle":8,"sx":140,"sy":120,"warp":[10,200],"drop":0.3,"av":[2,2],"border":"Eastgate Rd"}],"rues":["Valentino","Esperanza","Santa Rosa","Del Sol","Los Feliz","Encanto","Alameda","Mariposa","Hacienda","La Paloma","Bonita","Cielo","Corazón","Guadalupe","Las Palmas","Mercado","Rosario","Tierra","Vista","Zapata","Coyote","Escondido","Fiesta","Solano","Tranquilo","Montaña","Abuela","Cantina","Sombra","Luna","Estrella","Pueblo","Plaza Mayor","Dolores","Primavera","Marisol"],"avenues":["Heywood","Valentinos","Mission","Camino Real","Glory Hill","Vallarta","Industrial","Sierra"]},
{"id":"rancho-coronado","nom":"Rancho Coronado","court":"RANCHO CORONADO","seed":139,"desc":"Lotissements sinueux et impasses de banlieue, au sud de la baie de Del Coronado.","fp":[[840,1080],[1080,1040],[1150,1100],[1250,1120],[1300,1332],[840,1332]],"t":[960,1230],"coast":"Bayshore Dr","limite":"Ranchline Rd","walled":false,"num":"R ","zones":[{"angle":15,"sx":90,"sy":75,"warp":[28,140],"drop":0.2,"av":[4,3]},{"angle":-10,"sx":88,"sy":74,"warp":[30,120],"drop":0.2,"av":[3,3],"border":"Coronado Pkwy","poly":[[1080,1160],[1350,1160],[1350,1360],[1100,1360]]}],"rues":["Mesa Verde","Rancho","Sunnyvale","Palomino","Mustang","Bluebonnet","Prairie","Sagebrush","Cottonwood","Lariat","Saddleback","Canyon","Arroyo Seco","Juniper Hill","Pinto","Bronco","Stagecoach","Buckskin","Wagon Wheel","Rodeo","Cactus","Chaparral","Yucca","Tumbleweed","Corral","Mesquite","Bridle","Spur","Haystack","Buckboard","Rawhide","Barnwood","Silo","Windmill","Prairie Dog","Branding"],"avenues":["Rancho Coronado","Eagle Rock","Sunset Ranch","Del Coronado","Homestead","Frontier","Pioneer","Vaquero"]},
{"id":"pacifica","nom":"Pacifica","court":"PACIFICA","seed":127,"desc":"Station balnéaire abandonnée : Playland by the Sea, front de mer, pont vers South Night City.","fp":[[600,1100],[700,1090],[840,1080],[840,1332],[560,1332],[540,1250],[570,1170]],"t":[700,1255],"coast":"Beachfront Rd","limite":"Pacific Line","walled":false,"num":"P ","zones":[{"angle":-4,"sx":82,"sy":70,"warp":[8,170],"drop":0.12,"av":[4,4]},{"angle":30,"sx":76,"sy":66,"drop":0.1,"av":[3,3],"border":"Boardwalk","poly":[[540,1060],[710,1060],[720,1230],[540,1240]]}],"rues":["Carnival","Sandcastle","Palisade","Surf","Seabreeze","Coconut","Paradise","Tiki","Sunrise","Oasis","Cabana","Flamingo","Lagoon","Dune","Riptide","Seashell","Promenade","Calypso","Mirage","Aloha","Malibu","Bayshore","Tropic","Coastline","Voodoo","Dogtown","Sunbather","Lifeguard","Parasol","Seagull","Starfish","Wave Rider","Driftwood","Shoreline","Tidepool","Sandbar"],"avenues":["Pacifica","Coastview","Grand Resort","Playland","West Wind","Seaside","Sunset Pier","Ocean Park"]}];


/* ------------------------------ outils ------------------------------ */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const px=poly=>poly.map(([x,y])=>[x*W,y*H]);
function inPoly(p,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
function segInt(a,b,c,d){const r0=b[0]-a[0],r1=b[1]-a[1],s0=d[0]-c[0],s1=d[1]-c[1],den=r0*s1-r1*s0;if(Math.abs(den)<1e-9)return null;
  const t=((c[0]-a[0])*s1-(c[1]-a[1])*s0)/den,u=((c[0]-a[0])*r1-(c[1]-a[1])*r0)/den;return t>=0&&t<=1&&u>=0&&u<=1?{t,u,p:[a[0]+t*r0,a[1]+t*r1]}:null}
function polyCross(a,b,poly){let best=null;for(let i=0;i<poly.length;i++){const h=segInt(a,b,poly[i],poly[(i+1)%poly.length]);if(h&&(!best||h.t<best.t)){best=h;best.sa=poly[i];best.sb=poly[(i+1)%poly.length]}}return best}
const segDist=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;let t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;t=Math.max(0,Math.min(1,t));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)};
const polyDist=(p,poly)=>{let d=1e9;for(let i=0;i<poly.length;i++)d=Math.min(d,segDist(p,poly[i],poly[(i+1)%poly.length]));return d};
/* sinus de l'angle entre un tronçon et le bord franchi (0 = parallèle, 1 = perpendiculaire) */
const sinCut=(a,b,h)=>{if(!h||!h.sa)return 1;const ux=b[0]-a[0],uy=b[1]-a[1],vx=h.sb[0]-h.sa[0],vy=h.sb[1]-h.sa[1];return Math.abs(ux*vy-uy*vx)/(Math.hypot(ux,uy)*Math.hypot(vx,vy)||1)};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const ord=n=>{const m=n%100;return n+(m>10&&m<14?"th":["th","st","nd","rd"][n%10]||"th")};
const circle=(cx,cy,r,n=56)=>Array.from({length:n},(_,k)=>[cx+r*Math.cos(k/n*2*Math.PI),cy+r*Math.sin(k/n*2*Math.PI)]);
const ref=(p,G)=>{const c=G.cell;return String.fromCharCode(65+Math.max(0,Math.min(Math.ceil(G.W/c)-1,Math.floor(p[0]/c))))+(Math.max(0,Math.min(Math.ceil(G.H/c)-1,Math.floor(p[1]/c)))+1)};
/* réserve de noms commune (quand la liste du quartier est épuisée) */
const FALL=["Neon","Voltage","Circuit","Synapse","Glitch","Cipher","Pulse","Signal","Vortex","Ember","Onyx","Argent","Quartz","Carbon","Tungsten","Halogen","Plasma","Photon","Echo","Shadow","Talon","Viper","Jackal","Falcon","Wolf","Hornet","Mantis","Cobra","Scorpion","Lynx","Panther","Kestrel","Heron","Osprey","Mercury","Cinnabar","Sulfur","Basalt","Granite","Flint"];
const CAT={CR:"#4fd18b",PU:"#ff5a6a",HB:"#3ad1d1",CH:"#b07cff",CC:"#e6c84a",NL:"#5a8cff",AS:"#ff7ad9",CA:"#ff9a3c",OT:"#ff4040"};

/* ---------------------------- génération ---------------------------- */
const OX=450,K=3,CW=3900,CH=3996,CELL=200;          /* plan : repère officiel (2000 × 1332) × 3, à partir de x = 450 */
const C=([x,y])=>[(x-OX)*K,y*K],CP=poly=>poly.map(C);
const bbox=poly=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;poly.forEach(([x,y])=>{a=Math.min(a,x);b=Math.min(b,y);c=Math.max(c,x);d=Math.max(d,y)});return[a,b,c,d]};
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];

/* ---------------------------------------------------------------------
   ÉLÉMENTS COMMUNS (repère de la carte officielle : 2000 × 1332)
   --------------------------------------------------------------------- */
const PARCS=[{poly:[[886,606],[891,624],[904,647],[924,664],[949,673],[962,674],[995,674],[992,722],[935,722],[877,688],[877,610]],nom:"LAKE PARK",route:"Lake Park Dr"}];
const INTERDIT=[{poly:[[830,0],[1100,0],[1100,58],[840,58]],nom:"NORCAL MILITARY BASE — ZONE INTERDITE"}];
/* autoroutes : tracés continus d'après la carte officielle */
const AUTOROUTES=[ /* relevé sur la carte officielle (écussons : US-16 925,367 · 640,725 · 1135,820 · 1307,46 ; US-828 1296,228 · 1496,623 · 1375,1155 ; US-126 1345,991 · 804,1289 ; I-101 1624,311 · 1667,1201) */
 {nom:"US-16",pts:[[1330,0],[1307,46],[1290,95],[1239,153],[1174,172],[1103,185],[1044,202],[986,254],[937,299],[925,367],[915,410],[910,440]]},
 {nom:"US-16",pts:[[910,440],[800,460],[700,475],[655,510],[630,580],[630,660],[640,725],[655,805],[700,910],[765,960],[850,980],[970,987],[1000,985]]},
 {nom:"US-16",pts:[[910,440],[1050,440],[1175,447],[1260,480],[1320,530],[1350,575],[1300,620],[1250,660],[1200,730],[1150,800],[1135,820],[1075,905],[1035,960],[1000,985]]},
 {nom:"US-16",pts:[[1350,575],[1395,552],[1436,540]]},
 {nom:"US-828",pts:[[1239,153],[1265,182],[1296,228],[1335,300],[1358,355],[1381,475],[1399,503],[1436,540],[1482,595],[1496,623],[1505,669],[1515,706],[1555,760],[1575,820],[1530,900],[1450,1030],[1375,1155],[1300,1300],[1290,1332]]},
 {nom:"US-126",pts:[[1515,706],[1473,761],[1427,854],[1345,991],[1263,1056],[1186,1102],[1110,1132],[1034,1147],[977,1140],[935,1147],[866,1208],[805,1277],[790,1332]]},
 {nom:"PONT DE PACIFICA",pts:[[975,987],[977,1140]]},
 {nom:"I-101",pts:[[1610,0],[1607,78],[1616,195],[1624,293],[1636,364],[1655,423],[1681,468],[1695,520],[1698,700],[1692,850],[1680,1000],[1667,1201],[1675,1332]]}];
/* lieux : codes et positions de la carte officielle */
const LIEUX=[["CA01","Night City University",717,672],["CA02","NCU Fine Arts Campus",723,644],["CA03","Serengeti Gallery",766,639],
 ["NL01","The Atlantis",1009,721],["NL02","The Slammer",820,972],["NL03","Delirium",760,612],["NL04","MindNutz Lover",799,716],
 ["AS01","Colonial Studios",1168,715],["AS02","Biograph Theater",690,672],["AS03","Cinemaxus",1097,492],["AS04","McCartney Field Stadium",1118,463],["AS05","Yacht club",1167,400],
 ["OT01","Camden Court",815,430],["OT02","Holy Angels Church",805,460],["OT03","Orbital Mass Driver",574,363],["OT04","Playland by the Sea",734,1140],["OT05","Aldecaldo Camp",1630,1295],
 ["PU01","First Night City Bank",918,799],["PU02","City Hall",987,905],["PU03","NCPD Precinct #1",1035,772],["PU04","NCPD Precinct #2",1120,1083],["PU05","NCPD Precinct #3",916,209],
 ["PU06","Hall of Justice",1021,844],["PU07","NCFD Firestation #1",1468,578],["PU08","NCFD Firestation #2",692,535],["PU09","City Medical Center",1170,583],["PU10","Crisis Medical Center",1073,684],
 ["PU11","Stuart Hospital",693,654],["PU12","West Hill Library",870,592],["PU13","NC Postal Service",1135,489],["PU14","Ferry building",1137,408],["PU15","Medical Technologies",695,803],
 ["PU16","Savage Docs",803,775],["PU17","Ling Po Public Library",1250,602],
 ["CR01","Merrill, Asukaga & Finch",980,796],["CR02","Raven Microcybernetics",927,715],["CR03","Biotechnica Campus",859,658],["CR04","Continental Brands",761,532],["CR05","Danger Girl",688,489],
 ["CR06","REO Meatwagon",1310,552],["CR07","Ziggurat",1240,477],["CR08","Petrochem",1088,66],["CR09","SovOil",1040,38],["CR10","Trauma Team Tower",920,90],["CR11","Militech",883,27],
 ["CR12","Zhirafa Office Park",1331,889],["CR13","Network 54",1305,188],["CR14","Rockling Augmentics Campus",1395,551],["CR15","WorldSat",1265,87],
 ["HB01","The Afterlife",1128,509],["HB02","Highcourt Plaza Hotel",1157,646],["HB03","Totentanz",993,490],["HB04","The Forlorn Hope",1295,664],["HB05","The Paragon",690,738],
 ["HB06","Short Circuit",862,573],["HB08","MetalStorm",978,1127],["HB09","Red Door Inn",962,926],["HB10","Knight-Marriot Hotel",826,503],["HB11","Yamagumi Hotel",1059,711],
 ["HB12","Franciscini's Cafe",795,527],["HB13","24 Hour Cafe",1284,572],["HB14","American Bar",1172,457],["HB15","Metropolitan BBQ & Grill",972,449],["HB16","McDonnell's",723,740],
 ["HB17","Metro Café",686,720],["HB18","Chen's Oriental Garden",1140,701],["HB19","The Silver Dragon",1190,741],["HB20","La Lune Bleu",1237,507],
 ["CH01","Orbital Air Housing Block #1",526,342],["CH02","Scenic Cubes",600,1189],["CH03","University Cubes",673,597],["CH04","Cube-A-Rama",860,515],["CH05","Cubeland by the Sea",816,1160],
 ["CH06","A dilapidated Cube Hotel",937,466],["CH07","Watson Central Cubelife",957,128],["CH08","Seafoam",977,718],["CH09","McCartney Cubes",1101,433],["CH10","Unnamed Cube Hotel",1203,790],
 ["CC01","University Cargo Bay",695,762],["CC02","Dock Cargo Community",738,944],["CC03","South Cargo Village",982,950],["CC04","Eagle Rock Stadium",1043,1168],["CC05","The Precipe",1098,664],
 ["CC06","North Cargo Village",1203,123],["CC07","NC Ionic Semiconductor",1172,823],["CC08","Old Ironworks",1276,1032],["CC09","Bridgetown",1317,630],["CC10","East Cargo Village",1553,1272]];
/* repères personnels de la campagne : visibles par tous, sur le plan et sur la carte d'origine (repère 2000 × 1332) */
const PERSO=[
 {nom:"La Calavera",info:"Bar de Juan et du fixer Saul — S 8th St",p:[886.9,943]},
 {nom:"Repaire des MetalHead",info:"Dockside Rd × Barbwire Lane",p:[699,935]}];
const EAUX=[["SAN MORRO BAY",790,350],["PACIFIC OCEAN",520,860],["DEL CORONADO BAY",1030,1022],["BAIE DE NIGHT CITY",1150,905]];
const ILES=[{nom:"MORRO ROCK",c:[508,385],rx:62,ry:58}];

/* ------------------------------ génération de la ville ------------------------------ */
const CACHE={};
function buildCity(){
  if(CACHE.v)return CACHE.v;
  const Q=QUARTIERS,fps=Q.map(q=>CP(q.fp)),bbs=fps.map(bbox);
  const own=p=>{for(let i=0;i<fps.length;i++)if(p[0]>=bbs[i][0]&&p[0]<=bbs[i][2]&&p[1]>=bbs[i][1]&&p[1]<=bbs[i][3]&&inPoly(p,fps[i]))return i;return -1};
  const parks=PARCS.map(k=>({...k,p:CP(k.poly)})),restr=INTERDIT.map(k=>({...k,p:CP(k.poly)}));
  const blocked=p=>parks.some(k=>inPoly(p,k.p))||restr.some(k=>inPoly(p,k.p));
  const edges=[],lines={},nodeEnds=[],radInter=[];
  const addLine=(key,cls,extra)=>lines[key]||(lines[key]={key,cls,...extra});
  const bKey=(i,j)=>`B:${Math.min(i,j)}-${Math.max(i,j)}`;
  /* lignes de limite : nom donné par le quartier prioritaire */
  for(let i=0;i<Q.length;i++)for(let j=i+1;j<Q.length;j++)addLine(bKey(i,j),Q[i].walled||Q[j].walled?"wall":"bd",{name:Q[i].walled?Q[i].limite:Q[j].walled?Q[j].limite:Q[i].limite,d:i,dir:"b"});
  parks.forEach((k,n)=>addLine("park:"+n,"loc",{name:k.route,d:-1,dir:"b"}));

  Q.forEach((q,di)=>{
    const R=rng(q.seed),fp=fps[di],bb=bbs[di],mine=p=>own(p)===di;
    const zones=q.zones.map((z,k)=>{const o={...z,k};
      if(z.style==="radial"){o.c=C(z.c);o.p=circle(o.c[0],o.c[1],z.r)}else o.p=k?CP(z.poly):fp;return o});
    const zoneOf=p=>{for(let k=zones.length-1;k>0;k--)if(inPoly(p,zones[k].p))return k;return 0};
    if(q.coast)addLine(q.id+":coast","av",{name:q.coast,d:di,dir:"b"});
    /* coupure d'un tronçon qui sort du quartier : bord de l'emprise ou d'un quartier prioritaire */
    const cutOut=(a,b)=>{let best=null,who=-2;
      const h=polyCross(a,b,fp);if(h){best=h;who=own([b[0],b[1]])}
      for(let j=0;j<di;j++){if(!inPoly(b,fps[j])&&!polyCross(a,b,fps[j]))continue;const h2=polyCross(a,b,fps[j]);if(h2&&(!best||h2.t<best.t)){best=h2;who=j}}
      return best?{...best,who}:null};

    /* quartier décrit rue par rue (q.custom) : polylignes coupées entre elles, puis aux limites et aux parcs */
    if(q.custom){const segs=[];
      q.custom.forEach((r,ri)=>{let pts=CP(r.pts);if(r.closed)pts=pts.concat([pts[0]]);const key=`${q.id}:cu:${ri}`;addLine(key,r.c||"loc",{name:r.n,d:di,dir:"b"});
        for(let i=0;i<pts.length-1;i++)segs.push({a:pts[i],b:pts[i+1],key,o:ri*1000+i,cut:[]})});
      for(let i=0;i<segs.length;i++)for(let j=i+1;j<segs.length;j++){const A=segs[i],B=segs[j];
        const h=segInt(A.a,A.b,B.a,B.b);if(!h)continue;A.cut.push({t:h.t,p:h.p});B.cut.push({t:h.u,p:h.p})}
      const lims=[{p:fp,fp:true},...parks.map((k,n)=>({p:k.p,park:n})),...restr.map(k=>({p:k.p}))];
      segs.forEach(sg=>{
        lims.forEach(L=>{for(let i=0;i<L.p.length;i++){const h=segInt(sg.a,sg.b,L.p[i],L.p[(i+1)%L.p.length]);if(h)sg.cut.push({t:h.t,p:h.p,lim:L})}});
        for(let j=0;j<di;j++){const f=fps[j];for(let i=0;i<f.length;i++){const h=segInt(sg.a,sg.b,f[i],f[(i+1)%f.length]);if(h)sg.cut.push({t:h.t,p:h.p,lim:{p:f,other:j}})}}
        const cuts=[{t:0,p:sg.a},...sg.cut.sort((x,y)=>x.t-y.t),{t:1,p:sg.b}];
        for(let k=0;k<cuts.length-1;k++){const a=cuts[k],b=cuts[k+1];if(dist(a.p,b.p)<1)continue;const m=lerp(a.p,b.p,.5);if(!mine(m)||blocked(m))continue;
          edges.push({a:a.p,b:b.p,line:sg.key,ord:sg.o*100+k,d:di});
          [a,b].forEach(c=>{if(!c.lim)return;const L=c.lim;let bd=null;
            if(L.park!==undefined)bd="park:"+L.park;else{const o=L.other!==undefined?L.other:own(lerp(c.p,m,-0.15));if(o>=0&&o!==di)bd=Q[o].walled?null:bKey(di,o)}
            if(bd)nodeEnds.push({p:c.p,line:sg.key,border:bd,d:di})})}})}
    if(!q.custom)zones.forEach(z=>{
      if(z.style==="radial")return;
      /* lattice : le secteur reprend le quadrillage d'une autre zone (mêmes rues de part et d'autre de sa limite) */
      const base=z.lattice!==undefined&&zones[z.lattice]._L?zones[z.lattice]:null,LZ=base?base.k:z.k,N={};
      let ni,nj,pos;
      if(base)({ni,nj,pos}=base._L);
      else{const zb=bbox(z.p),th=z.angle*Math.PI/180,c=Math.cos(th),s=Math.sin(th),cx=(zb[0]+zb[2])/2,cy=(zb[1]+zb[3])/2,D=Math.hypot(zb[2]-zb[0],zb[3]-zb[1])/2+120;
        ni=Math.ceil(D/z.sx);nj=Math.ceil(D/z.sy);pos={};const [A,L]=z.warp||[0,200],ph1=R()*6,ph2=R()*6,jit=Math.min(z.sx,z.sy)*0.12;
        for(let i=-ni;i<=ni;i++)for(let j=-nj;j<=nj;j++){const u=i*z.sx+(R()-.5)*jit,v=j*z.sy+(R()-.5)*jit,x=cx+u*c-v*s,y=cy+u*s+v*c;
          pos[i+","+j]=[x+A*Math.sin(y/L+ph1),y+A*Math.sin(x/L*1.3+ph2)]}
        z._L={ni,nj,pos}}
      /* aucune rue à moins d'un tiers d'îlot d'une limite (quartier, secteur, parc, rond) : évite les rues collées et les triangles */
      const gap=Math.min(z.sx,z.sy)*0.4,near=[fp,...fps.filter((f,j)=>j<di&&bbs[j][0]<bb[2]&&bbs[j][2]>bb[0]&&bbs[j][1]<bb[3]&&bbs[j][3]>bb[1]),...zones.filter(x=>x.k).map(x=>x.p),...parks.map(k=>k.p),...restr.map(k=>k.p)];
      const clear=p=>near.every(poly=>polyDist(p,poly)>=gap);
      for(let i=-ni;i<=ni;i++)for(let j=-nj;j<=nj;j++){
        const p=pos[i+","+j];
        const m=mine(p);N[i+","+j]={p,ok:m&&!blocked(p)&&zoneOf(p)===z.k&&clear(p),mine:m,zone:m?zoneOf(p):-1};
      }
      const AV=(base||z).av,avI=i=>((i%AV[0])+AV[0])%AV[0]===0,avJ=j=>((j%AV[1])+AV[1])%AV[1]===0;
      const link=(n1,n2,key,cls,o)=>{
        if(!n1||!n2||(!n1.ok&&!n2.ok))return;const isAv=cls==="av";
        if(n1.ok&&n2.ok){if(!isAv&&R()<(z.drop||0))return;edges.push({a:n1.p,b:n2.p,line:key,ord:o,d:di});return}
        const [inN,outN,rev]=n1.ok?[n1,n2,false]:[n2,n1,true],q2=outN.p;let cut=null,border=null;
        if(outN.mine&&blocked(q2)){for(let n=0;n<parks.length;n++){const h=polyCross(inN.p,q2,parks[n].p);if(h&&(!cut||h.t<cut.t)){cut=h;border="park:"+n}}
          restr.forEach(k=>{const h=polyCross(inN.p,q2,k.p);if(h&&(!cut||h.t<cut.t)){cut=h;border=null}})}
        else if(outN.mine&&outN.zone!==z.k){const zk=Math.max(z.k,outN.zone),h=polyCross(inN.p,q2,zones[zk].p);if(h){cut=h;border=`${q.id}:bd:${zk}`}}
        else if(outN.mine){ /* noeud écarté car trop près d'une limite : prolonger jusqu'à la limite la plus proche */
          let best=null,bd=null;const far=[q2[0]+(q2[0]-inN.p[0]),q2[1]+(q2[1]-inN.p[1])];
          zones.forEach(x=>{if(!x.k)return;const h=polyCross(inN.p,far,x.p);if(h&&(!best||h.t<best.t)){best=h;bd=`${q.id}:bd:${x.k}`}});
          parks.forEach((k,n)=>{const h=polyCross(inN.p,far,k.p);if(h&&(!best||h.t<best.t)){best=h;bd="park:"+n}});
          const h2=cutOut(inN.p,far);if(h2&&(!best||h2.t<best.t)){best=h2;const j=h2.who;bd=j<0||j===undefined?(q.coast?q.id+":coast":null):(q.walled&&!isAv?"X":Q[j].walled?null:bKey(di,j))}
          if(bd==="X")return;if(best){cut=best;border=bd}}
        else{const h=cutOut(inN.p,q2);if(h){cut=h;const j=h.who;
            if(j<0||j===undefined)border=q.coast?q.id+":coast":null;
            else{if(q.walled&&!isAv)return;border=Q[j].walled?null:bKey(di,j)}}}
        if(!cut)return;
        if(sinCut(inN.p,q2,cut)<0.45)return; /* raccord trop rasant : formerait un triangle */
        edges.push(rev?{a:cut.p,b:inN.p,line:key,ord:o,d:di}:{a:inN.p,b:cut.p,line:key,ord:o,d:di});
        if(border)nodeEnds.push({p:cut.p,line:key,border,d:di,gate:q.walled&&isAv});
      };
      for(let i=-ni;i<=ni;i++)for(let j=-nj;j<=nj;j++){
        const rk=`${q.id}:z${LZ}:r:${j}`,ck=`${q.id}:z${LZ}:c:${i}`;
        addLine(rk,avJ(j)?"av":"loc",{dir:"r",zk:z.k,idx:j,d:di});addLine(ck,avI(i)?"av":"loc",{dir:"c",zk:z.k,idx:i,d:di});
        link(N[i+","+j],N[(i+1)+","+j],rk,lines[rk].cls,i);link(N[i+","+j],N[i+","+(j+1)],ck,lines[ck].cls,j);
      }
    });
    /* zone radiale */
    if(!q.custom)zones.forEach(z=>{
      if(z.style!=="radial")return;
      const [cx,cy]=z.c,radii=z.rings.concat([z.r]),n=z.spokes,a0=(z.rot||0)*Math.PI/180,P=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
      const good=p=>mine(p)&&!blocked(p);
      /* tronçon d'arc ou de rayon : entier s'il est dans le quartier, sinon coupé sur la limite (parc, côte, autre quartier) */
      const put=(a,b,key,o)=>{const ga=good(a),gb=good(b);
        if(ga&&gb){if(key.includes(":rg:")&&polyDist(lerp(a,b,.5),fp)<20)return; /* anneau qui longerait la limite */
          edges.push({a,b,line:key,ord:o,d:di});return}if(!ga&&!gb)return;
        const [pin,pout]=ga?[a,b]:[b,a];let best=null,bd=null;
        parks.forEach((k,n)=>{const h=polyCross(pin,pout,k.p);if(h&&(!best||h.t<best.t)){best=h;bd="park:"+n}});
        const h2=cutOut(pin,pout);if(h2&&(!best||h2.t<best.t)){best=h2;const j=h2.who;bd=j<0||j===undefined?(q.coast?q.id+":coast":null):(Q[j].walled?null:bKey(di,j))}
        if(!best)return;edges.push(ga?{a,b:best.p,line:key,ord:o,d:di}:{a:best.p,b,line:key,ord:o,d:di});if(bd)nodeEnds.push({p:best.p,line:key,border:bd,d:di})};
      z.rings.forEach((r,k)=>{const key=`${q.id}:rg:${k}`;addLine(key,(z.avRings||[z.rings.length-1]).includes(k)?"av":"loc",{dir:"g",d:di,name:z.ringNames?z.ringNames[k]:undefined,zk:z.k,idx:k});
        const sub=Math.max(4,Math.ceil(r*2*Math.PI/n/40));
        for(let m=0;m<n;m++)for(let s2=0;s2<sub;s2++)put(P(r,a0+(m+s2/sub)/n*2*Math.PI),P(r,a0+(m+(s2+1)/sub)/n*2*Math.PI),key,m*sub+s2)});
      for(let m=0;m<n;m++){const key=`${q.id}:sp:${m}`,a=a0+m/n*2*Math.PI;addLine(key,m%(z.avSpoke||4)===0?"av":"loc",{dir:"s",d:di,zk:z.k,idx:m});
        for(let k=0;k<radii.length-1;k++)put(P(radii[k],a),P(radii[k+1],a),key,k)
        for(let k=0;k<radii.length;k++){const p=P(radii[k],a);if(good(p))radInter.push({p,l1:key,l2:k<z.rings.length?`${q.id}:rg:${k}`:`${q.id}:bd:${z.k}`,d:di})}}
      z.plazaR=z.rings[0];
    });
    /* bordures : sous-zones (boulevards), côte, limites avec les autres quartiers */
    const pieces=(poly,cb)=>{for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],Lg=dist(a,b),n=Math.max(1,Math.ceil(Lg/36));
        const nx=-(b[1]-a[1])/Lg,ny=(b[0]-a[0])/Lg;
        for(let k=0;k<n;k++){const p1=lerp(a,b,k/n),p2=lerp(a,b,(k+1)/n),m=lerp(p1,p2,.5);cb(p1,p2,m,[m[0]+nx*7,m[1]+ny*7],[m[0]-nx*7,m[1]-ny*7],i*1000+k)}}};
    zones.forEach(z=>{if(!z.k)return;const key=`${q.id}:bd:${z.k}`;addLine(key,"bd",{name:z.border,d:di,dir:"b"});
      pieces(z.p,(p1,p2,m,A,B,o)=>{if(mine(m)&&!blocked(m)&&!zones.slice(z.k+1).some(x=>inPoly(m,x.p))&&polyDist(m,fp)>=30)edges.push({a:p1,b:p2,line:key,ord:o,d:di})})});
    pieces(fp,(p1,p2,m,A,B,o)=>{const oa=own(A),ob=own(B);if(oa!==di&&ob!==di)return;const other=oa===di?ob:oa;if(other===di)return;
      if(other<0){if(q.coast&&!blocked(m))edges.push({a:p1,b:p2,line:q.id+":coast",ord:o,d:di})}
      else if(di<other&&!blocked(m))edges.push({a:p1,b:p2,line:bKey(di,other),ord:o,d:di})});
    q._zones=zones;
  });
  /* périmètre des parcs */
  const rings=[];Q.forEach(q=>q._zones.forEach(z=>{if(z.style==="radial")rings.push(z)}));
  parks.forEach((k,n)=>{for(let i=0;i<k.p.length;i++){const a=k.p[i],b=k.p[(i+1)%k.p.length],m=lerp(a,b,.5);
    if(own(m)>=0&&!rings.some(z=>Math.abs(dist(m,z.c)-z.r)<60)&&!fps.some(f=>polyDist(m,f)<14))edges.push({a,b,line:"park:"+n,ord:i,d:own(m)})}});

  /* aucun tronçon ne traverse un parc ou une zone interdite (sauf la route qui en fait le tour) */
  for(let i=edges.length-1;i>=0;i--){const e=edges[i];if(e.line.startsWith("park:"))continue;
    const pts=[lerp(e.a,e.b,.25),lerp(e.a,e.b,.5),lerp(e.a,e.b,.75)];
    if(pts.some(p=>parks.some(k=>inPoly(p,k.p)&&polyDist(p,k.p)>3)||restr.some(k=>inPoly(p,k.p)&&polyDist(p,k.p)>3)))edges.splice(i,1)}
  /* nettoyage : fragments isolés et bouts d'impasse très courts */
  {const key=p=>Math.round(p[0]/3)+":"+Math.round(p[1]/3),ends=new Set(nodeEnds.map(n=>key(n.p)));
   for(let pass=0;pass<3;pass++){const deg={};edges.forEach(e=>{deg[key(e.a)]=(deg[key(e.a)]||0)+1;deg[key(e.b)]=(deg[key(e.b)]||0)+1});
     for(let i=edges.length-1;i>=0;i--){const e=edges[i];if(e.line.startsWith("park:")||e.line.startsWith("B:")||e.line.endsWith(":coast"))continue;
       const ka=key(e.a),kb=key(e.b),da=deg[ka]===1&&!ends.has(ka),db=deg[kb]===1&&!ends.has(kb);
       if((da||db)&&dist(e.a,e.b)<28)edges.splice(i,1)}}
   const par={},f=k=>{while(par[k]!==undefined&&par[k]!==k)k=par[k]=par[par[k]]??par[k];return k},u=(x,y)=>{x=f(x);y=f(y);if(x!==y)par[x]=y};
   edges.forEach(e=>{const ka=key(e.a),kb=key(e.b);if(par[ka]===undefined)par[ka]=ka;if(par[kb]===undefined)par[kb]=kb;u(ka,kb)});
   const len={};edges.forEach(e=>{const r=f(key(e.a));len[r]=(len[r]||0)+dist(e.a,e.b)});
   for(let i=edges.length-1;i>=0;i--){const e=edges[i];if(e.line.startsWith("park:")||e.line.startsWith("B:")||e.line.endsWith(":coast"))continue;if(len[f(key(e.a))]<300)edges.splice(i,1)}}
  /* rues qui s'arrêtent à moins de 45 m d'une autre route, dans leur axe : prolongées jusqu'à elle */
  {const key=p=>Math.round(p[0])+":"+Math.round(p[1]),deg={};edges.forEach(e=>{deg[key(e.a)]=(deg[key(e.a)]||0)+1;deg[key(e.b)]=(deg[key(e.b)]||0)+1});
   const GS=60,grid=new Map();edges.forEach((e,i)=>{const x0=Math.floor(Math.min(e.a[0],e.b[0])/GS),x1=Math.floor(Math.max(e.a[0],e.b[0])/GS),y0=Math.floor(Math.min(e.a[1],e.b[1])/GS),y1=Math.floor(Math.max(e.a[1],e.b[1])/GS);
     for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){const c=x+":"+y;(grid.get(c)||grid.set(c,[]).get(c)).push(i)}});
   const ext=[];edges.forEach((e,i)=>{if(e.line.startsWith("park:")||e.line.startsWith("B:")||e.line.endsWith(":coast"))return;
     [[e.b,e.a],[e.a,e.b]].forEach(([p,o])=>{if(deg[key(p)]!==1)return;const L=dist(p,o);if(L<1)return;const q=[p[0]+(p[0]-o[0])/L*45,p[1]+(p[1]-o[1])/L*45];
       let best=null;const cs=new Set();[p,lerp(p,q,.5),q].forEach(z=>{for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)(grid.get((Math.floor(z[0]/GS)+x)+":"+(Math.floor(z[1]/GS)+y))||[]).forEach(j=>cs.add(j))});
       let touch=false;cs.forEach(j=>{if(j===i)return;const f=edges[j];if(key(f.a)===key(p)||key(f.b)===key(p)){touch=true;return}if(segDist(p,f.a,f.b)<5){touch=true;return}
         const h=segInt(p,q,f.a,f.b);if(h&&h.t>0.01&&(!best||h.t<best.t))best=h});if(touch)return;
       if(best&&!blocked(lerp(p,best.p,.5)))ext.push({a:p,b:best.p,line:e.line,ord:e.ord+(p===e.b?0.5:-0.5),d:e.d})})});
   edges.push(...ext)}
  /* ---- noms des rues, quartier par quartier ---- */
  const present={};edges.forEach(e=>present[e.line]=(present[e.line]||0)+dist(e.a,e.b));
  const fixed=new Set(Object.values(lines).filter(l=>l.name).map(l=>l.name.replace(/ \S+$/,"")));
  Q.forEach((q,di)=>{
    const R=rng(q.seed+7),pool=q.rues.slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
    const usedBase=new Set(fixed),src=arr=>({arr,i:0}),P1=src(pool),P2=src(q.avenues.slice()),PF=src(FALL);
    const ZP={},ZA={};q._zones.forEach(z=>{ZP[z.k]=src(z.rues||[]);ZA[z.k]=src(z.avenues||[])});
    const pick=list=>{for(const o of list)while(o.i<o.arr.length){const w=o.arr[o.i++];if(!usedBase.has(w)){usedBase.add(w);return w}}return null};
    let num=1,letter=0,na=0,nr=0,extra=1;const SUF=["St","St","Way","St","Lane","Rd","St","Pl"],AVS=["Ave","Blvd","Ave","Pkwy","Ave"];
    Object.keys(lines).filter(k=>lines[k].d===di&&!lines[k].name&&present[k]>40)
      .sort((x,y)=>{const a=lines[x],b=lines[y];return (a.zk??9)-(b.zk??9)||String(a.dir).localeCompare(String(b.dir))||(a.idx??0)-(b.idx??0)||x.localeCompare(y)})
      .forEach(k=>{const l=lines[k];
        if(l.cls==="av"){const w=pick([ZA[l.zk]||src([]),P2,P1,PF]);l.name=w?`${w} ${AVS[na++%AVS.length]}`:`Route ${extra++}`}
        else if(l.dir==="c"&&(l.zk??0)===0)l.name=`${q.num||""}${ord(num++)} St`;
        else if(l.dir==="c"&&l.zk>0&&letter<26)l.name=`${String.fromCharCode(65+letter++)} St`;
        else{const w=pick([ZP[l.zk]||src([]),P1,PF]);l.name=w?`${w} ${SUF[nr++%SUF.length]}`:`Alley ${extra++}`}});
  });
  edges.forEach(e=>{const l=lines[e.line];e.cls=l?.cls||"loc";e.name=l?.name||""});

  /* ---- carrefours ---- */
  const inter=[],seen={};
  const addI=(p,l1,l2,d)=>{if(!lines[l1]?.name||!lines[l2]?.name||l1===l2||lines[l1].name===lines[l2].name)return;
    const g=Math.round(p[0]/14)+":"+Math.round(p[1]/14);if(seen[g])return;seen[g]=1;const o=own(p);inter.push({p,a:lines[l1].name,b:lines[l2].name,d:o>=0?o:d,q:Q[o>=0?o:d].nom})};
  const byPt={},pk=p=>Math.round(p[0])+":"+Math.round(p[1]);
  edges.forEach(e=>[e.a,e.b].forEach(p=>{const k=pk(p);(byPt[k]||(byPt[k]={p,ls:new Set(),d:e.d})).ls.add(e.line)}));
  Object.values(byPt).forEach(o=>{const ls=[...o.ls];if(ls.length>=2)addI(o.p,ls[0],ls[1],o.d)});
  nodeEnds.forEach(n=>addI(n.p,n.line,n.border,n.d));
  radInter.forEach(r=>addI(r.p,r.l1,r.l2,r.d));

  /* ---- autoroutes et sorties (numérotées le long de chaque autoroute) ---- */
  const hws=AUTOROUTES.map(h=>({nom:h.nom,p:CP(h.pts)}));
  const exits=[],cnt={};
  hws.forEach(h=>{const hits=[];let acc=0;
    for(let i=0;i<h.p.length-1;i++){edges.forEach(e=>{if(e.cls==="loc"||e.cls==="wall")return;const x=segInt(h.p[i],h.p[i+1],e.a,e.b);if(!x)return;const o=own(x.p);if(o<0)return;
        hits.push({p:x.p,s:acc+x.t*dist(h.p[i],h.p[i+1]),rue:e.name,d:o})});acc+=dist(h.p[i],h.p[i+1])}
    hits.sort((a,b)=>a.s-b.s).forEach(x=>{if(exits.some(y=>dist(y.p,x.p)<75))return;cnt[h.nom]=(cnt[h.nom]||0)+1;exits.push({p:x.p,n:cnt[h.nom],hw:h.nom,rue:x.rue,d:x.d,q:Q[x.d].nom})})});
  /* ---- portes de l'enceinte ---- */
  const gates=[];nodeEnds.forEach(n=>{if(n.gate&&!gates.some(g=>dist(g.p,n.p)<30))gates.push({p:n.p,rue:lines[n.line].name,d:n.d,q:Q[n.d].nom})});
  /* ---- lieux ---- */
  const perso=PERSO.map(r=>({...r,p:C(r.p),d:own(C(r.p)),q:own(C(r.p))>=0?Q[own(C(r.p))].nom:""}));
  const lms=LIEUX.map(([code,nom,x,y])=>{const p=C([x,y]),o=own(p);return{code,nom,p,col:CAT[code.slice(0,2)]||"#ccc",d:o,q:o>=0?Q[o].nom:""}});

  /* ---- assemblage pour le rendu ---- */
  const pth=poly=>"M"+poly.map(p=>p[0].toFixed(1)+" "+p[1].toFixed(1)).join("L")+"Z";
  let land=fps.map(f=>`<path d="${pth(f)}" fill="#0b120e"/>`).join("");
  const titles=Q.map((q,i)=>({t:q.court,p:C(q.t),fs:q.walled?30:46}));
  ILES.forEach(t=>{const c=C(t.c);land+=`<ellipse cx="${c[0]}" cy="${c[1]}" rx="${t.rx*K}" ry="${t.ry*K}" fill="#0b120e" stroke="#1f6f8f" stroke-width="3"/>`;titles.push({t:t.nom,p:[c[0],c[1]-40],fs:30})});
  const V={id:"ville",W:CW,H:CH,cell:CELL,edges:edges.filter(e=>e.name||e.cls==="wall"),
    water:EAUX.map(([t,x,y])=>({p:[[0,0]],nom:t,lp:C([x,y]),fs:40})),
    parks:parks.map(k=>({p:k.p,nom:k.nom})),plazas:[],restr:restr.map(k=>({p:k.p,nom:k.nom})),area:null,
    hws,exits,gates,inter,lms,perso,voisins:[],titles,outlineD:(()=>{let d="";fps.forEach((f,i)=>{for(let e=0;e<f.length;e++){const a=f[e],b=f[(e+1)%f.length],Lg=dist(a,b),n=Math.max(1,Math.ceil(Lg/24)),nx=-(b[1]-a[1])/Lg,ny=(b[0]-a[0])/Lg;
      for(let k=0;k<n;k++){const p1=lerp(a,b,k/n),p2=lerp(a,b,(k+1)/n),m=lerp(p1,p2,.5),oa=own([m[0]+nx*6,m[1]+ny*6]),ob=own([m[0]-nx*6,m[1]-ny*6]);
        if(oa===ob||(oa!==i&&ob!==i))continue;const other=oa===i?ob:oa;if(other>=0&&other<i)continue;d+=`M${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`}}});return d})(),base:`<rect width="${CW}" height="${CH}" fill="url(#waves-ville)"/>${land}`,mask:true};
  Q.forEach(q=>q._zones.forEach(z=>{if(z.style==="radial")V.plazas.push({c:z.c,r:z.plazaR,nom:z.plaza})}));
  /* statistiques par quartier */
  V.dist={};Q.forEach((q,i)=>{const names=new Set(V.edges.filter(e=>e.d===i&&e.name).map(e=>e.name));
    V.dist[q.id]={i,bb:bbs[i],fp:fps[i],nb:names.size,cls:new Set(V.edges.filter(e=>e.d===i).map(e=>e.cls))}});
  V.nbStreets=new Set(V.edges.filter(e=>e.name).map(e=>e.d+"|"+e.name)).size;
  return CACHE.v=renderSVG(V);
}

/* ===================== GRAPHE ROUTIER (poursuites) =====================
   Nœuds : extrémités des tronçons (clé "x:y" arrondie, identique sur tous les appareils).
   Les rues en T (qui s'arrêtent sur une autre rue sans sommet commun) sont raccordées.
   Carrefour = nœud de degré ≠ 2. Les autoroutes ne font pas partie du graphe.          */
function buildGraph(){
  if(CACHE.g)return CACHE.g;
  const V=buildCity(),K=p=>Math.round(p[0])+":"+Math.round(p[1]);
  const E=V.edges.filter(e=>e.cls!=="wall").map(e=>({a:e.a,b:e.b,name:e.name,cls:e.cls}));
  const GS=40,grid=new Map(),cellsOf=e=>{const r=[];const x0=Math.floor(Math.min(e.a[0],e.b[0])/GS)-1,x1=Math.floor(Math.max(e.a[0],e.b[0])/GS)+1,y0=Math.floor(Math.min(e.a[1],e.b[1])/GS)-1,y1=Math.floor(Math.max(e.a[1],e.b[1])/GS)+1;
    for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)r.push(x+":"+y);return r};
  const addG=i=>cellsOf(E[i]).forEach(c=>{(grid.get(c)||grid.set(c,[]).get(c)).push(i)});
  E.forEach((e,i)=>addG(i));
  const deg={};const inc=k=>deg[k]=(deg[k]||0)+1;E.forEach(e=>{inc(K(e.a));inc(K(e.b))});
  const ends=[];E.forEach(e=>[e.a,e.b].forEach(p=>{if(deg[K(p)]===1)ends.push({p,name:e.name,cls:e.cls})}));
  ends.forEach(({p,name,cls})=>{const kp=K(p);if(deg[kp]!==1)return;
    let best=null,bd=6;(grid.get(Math.floor(p[0]/GS)+":"+Math.floor(p[1]/GS))||[]).forEach(i=>{const e=E[i];if(e.dead||K(e.a)===kp||K(e.b)===kp)return;const d=segDist(p,e.a,e.b);if(d<bd){bd=d;best=i}});
    if(best===null)return;const e=E[best],dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],L=dx*dx+dy*dy;let t=((p[0]-e.a[0])*dx+(p[1]-e.a[1])*dy)/L;t=Math.max(0,Math.min(1,t));
    let q=[e.a[0]+t*dx,e.a[1]+t*dy];
    if(dist(q,e.a)<3)q=e.a;else if(dist(q,e.b)<3)q=e.b;
    else{e.dead=true;E.push({a:e.a,b:q,name:e.name,cls:e.cls},{a:q,b:e.b,name:e.name,cls:e.cls});addG(E.length-2);addG(E.length-1);inc(K(q))}
    if(K(q)!==kp){E.push({a:p,b:q,name,cls});addG(E.length-1);inc(kp);inc(K(q))}});
  /* fusion des extrémités distantes de moins de 5 m (un seul carrefour au lieu de plusieurs points collés) */
  const rep={},pts={};E.forEach(e=>{if(!e.dead)[e.a,e.b].forEach(p=>{pts[K(p)]=p})});
  const cg=new Map();Object.entries(pts).forEach(([k,p])=>{const c=Math.floor(p[0]/8)+":"+Math.floor(p[1]/8);(cg.get(c)||cg.set(c,[]).get(c)).push(k)});
  const root=k=>{while(rep[k]&&rep[k]!==k)k=rep[k];return k};
  Object.entries(pts).forEach(([k,p])=>{const cx=Math.floor(p[0]/8),cy=Math.floor(p[1]/8);
    for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)(cg.get((cx+x)+":"+(cy+y))||[]).forEach(j=>{if(j!==k&&dist(pts[j],p)<5){const a=root(k),b=root(j);if(a!==b)rep[a]=b}})});
  const N={};const node=p=>{const k=root(K(p));return N[k]||(N[k]={k,p:pts[k].map(Math.round),adj:new Map()})};
  E.forEach(e=>{if(e.dead)return;const a=node(e.a),b=node(e.b);if(a===b)return;const L=dist(e.a,e.b),o={name:e.name,len:L,cls:e.cls};
    if(!a.adj.has(b.k))a.adj.set(b.k,o);if(!b.adj.has(a.k))b.adj.set(a.k,o)});
  /* suppression des bouts de rue de moins de 30 m qui finissent en impasse (faux carrefours) */
  for(let pass=0;pass<3;pass++)Object.values(N).forEach(n=>{if(!N[n.k]||n.adj.size!==1)return;const chain=[n.k];let prev=n.k,cur=[...n.adj.keys()][0],L=n.adj.get(cur).len,g=0;
    while(N[cur].adj.size===2&&g++<50){const nx=[...N[cur].adj.keys()].find(k=>k!==prev);chain.push(cur);L+=N[cur].adj.get(nx).len;prev=cur;cur=nx}
    if(N[cur].adj.size>=3&&L<30){chain.forEach(k=>{[...N[k].adj.keys()].forEach(j=>N[j]&&N[j].adj.delete(k));delete N[k]})}});
  Object.values(N).forEach(n=>{if(!n.adj.size)delete N[n.k]});
  /* carrefours dédoublés (moins de 28 m l'un de l'autre) : fusionnés en un seul */
  for(let pass=0;pass<4;pass++){let ch=0;Object.values(N).forEach(n=>{if(!N[n.k]||n.adj.size<3)return;
    /* raccourcir les chaînes courtes (points intermédiaires) entre deux carrefours */
    for(const [j0,o0] of [...n.adj]){if(!N[j0]||N[j0].adj.size!==2)continue;let prev=n.k,cur=j0,L=o0.len,ch2=[],g=0;
      while(N[cur]&&N[cur].adj.size===2&&g++<20){ch2.push(cur);const nx=[...N[cur].adj.keys()].find(k=>k!==prev);L+=N[cur].adj.get(nx).len;prev=cur;cur=nx}
      if(N[cur]&&N[cur].adj.size>=3&&cur!==n.k&&L<28&&!n.adj.has(cur)&&n.adj.size+N[cur].adj.size<=8){ch2.forEach(k=>{delete N[k]});n.adj.delete(j0);N[cur].adj.delete(prev);const o={...o0,len:L};n.adj.set(cur,o);N[cur].adj.set(n.k,o)}}
    for(const [j,o] of [...n.adj]){const m=N[j];if(!m||j===n.k||o.len>=28||m.adj.size<3||n.adj.size+m.adj.size>8)continue;
      n.p=[Math.round((n.p[0]+m.p[0])/2),Math.round((n.p[1]+m.p[1])/2)];n.adj.delete(j);
      for(const [x,ox] of m.adj){if(x===n.k)continue;const X=N[x];if(!X)continue;X.adj.delete(j);if(!X.adj.has(n.k))X.adj.set(n.k,ox);if(!n.adj.has(x))n.adj.set(x,ox)}
      delete N[j];ch++}});if(!ch)break}
  const inter=Object.values(N).filter(n=>n.adj.size>=3);
  return CACHE.g={N,inter};
}
/* carrefour le plus proche d'un point (repère du plan) */
function nearestInter(p,max=1e9){const g=buildGraph();let best=null,bd=max;g.inter.forEach(n=>{const d=dist(n.p,p);if(d<bd){bd=d;best=n}});return best}
/* position enregistrée → carrefour valide du graphe actuel (après une mise à jour de la carte) */
function fixCar(c){if(!c)return c;const g=buildGraph();let n=g.N[c.n];
  if(!n||n.adj.size<3&&n.adj.size!==1){const xy=String(c.n).split(":").map(Number);n=nearestInter(xy)}
  if(!n)return c;const f=n.adj.has(c.f)?c.f:[...n.adj.keys()][0];return{n:n.k,f}}
/* nom des rues d'un carrefour */
function interName(k){const n=buildGraph().N[k];if(!n)return"";return[...new Set([...n.adj.values()].map(o=>o.name).filter(Boolean))].slice(0,3).join(" × ")}
/* un pas : depuis le carrefour n (arrivé depuis le nœud voisin f), choix c = "S" tout droit, "L" gauche, "R" droite, "U" demi-tour */
function step(n,f,c){
  const g=buildGraph(),A=g.N[n];if(!A)return{n,f,path:[n],bloque:true};
  const P=A.p,F=g.N[f]?g.N[f].p:null,hin=F?Math.atan2(P[1]-F[1],P[0]-F[0]):0;
  const outs=[...A.adj.keys()].filter(k=>k!==f||!F).map(k=>{const q=g.N[k].p;let a=Math.atan2(q[1]-P[1],q[0]-P[0])-hin;while(a>Math.PI)a-=2*Math.PI;while(a<=-Math.PI)a+=2*Math.PI;return{k,a}});
  let to=null,ok=true;
  if(c==="U"){if(F&&A.adj.has(f))to=f;else ok=false}
  else{const S=outs.filter(o=>Math.abs(o.a)<0.8).sort((x,y)=>Math.abs(x.a)-Math.abs(y.a))[0],
         L=outs.filter(o=>o.a<-0.4).sort((x,y)=>Math.abs(x.a+Math.PI/2)-Math.abs(y.a+Math.PI/2))[0],
         R=outs.filter(o=>o.a>0.4).sort((x,y)=>Math.abs(x.a-Math.PI/2)-Math.abs(y.a-Math.PI/2))[0];
    const w={S,L,R}[c];if(w)to=w.k;else{ok=false;const m=outs.slice().sort((x,y)=>Math.abs(x.a)-Math.abs(y.a))[0];if(m)to=m.k}}
  if(!to)return{n,f,path:[n],bloque:true,ok:false};
  const rue=A.adj.get(to).name;let prev=n,cur=to;const path=[n,cur];let guard=0;
  while(g.N[cur].adj.size===2&&guard++<800){const nx=[...g.N[cur].adj.keys()].find(k=>k!==prev);prev=cur;cur=nx;path.push(cur)}
  return{n:cur,f:prev,path,ok,rue};
}
/* déplacement d'un tour : liste de choix → positions successives */
function course(n,f,ordres){const pos=[n],fs=[f],path=[n],rues=[],notes=[];let bloque=false;
  for(const c of ordres){const r=step(n,f,c);if(r.bloque){bloque=true;notes.push("bloqué");break}
    if(!r.ok)notes.push("choix impossible → "+(c==="U"?"arrêt":"tout droit"));
    n=r.n;f=r.f;pos.push(n);fs.push(f);path.push(...r.path.slice(1));if(r.rue)rues.push(r.rue)}
  return{n,f,pos,fs,path,rues,notes,bloque}}
/* distance en carrefours (BFS) */
function hops(a,b){if(a===b)return 0;const g=buildGraph(),seen=new Set([a]);let fr=[a],d=0;
  while(fr.length&&d<60){d++;const nx=[];for(const k of fr){for(const j of g.N[k].adj.keys()){let prev=k,cur=j,gd=0;while(g.N[cur].adj.size===2&&gd++<800){const z=[...g.N[cur].adj.keys()].find(x=>x!==prev);prev=cur;cur=z}
    if(cur===b)return d;if(!seen.has(cur)){seen.add(cur);nx.push(cur)}}}fr=nx}return Infinity}

/* carte complète montée dans un conteneur (applications) : renvoie la visionneuse */
function mountMap(box,opt={}){
  css();const data=buildCity(),w=data.W,h=data.H;
  box.classList.add("nc-box");
  box.innerHTML=`<div class="nc-inner">${data.svg}</div><div class="nc-tools"><button data-z="in" title="Zoomer">+</button><button data-z="out" title="Dézoomer">−</button><button data-z="fit" title="Recentrer">⤢</button><button data-z="fs" title="Plein écran">⛶</button></div><div class="nc-tip"></div>`;
  const inner=box.querySelector(".nc-inner"),tip=box.querySelector(".nc-tip"),svg=box.querySelector("svg");
  inner.style.width=w+"px";inner.style.height=h+"px";
  let lod=()=>{};
  const z=zoomable(box,inner,w,h,()=>lod(),(t,p,scr)=>opt.onTap&&opt.onTap(p,scr),opt.home);
  lod=()=>{const k=z.px();box.classList.toggle("z0",k<0.5);box.classList.toggle("z1",k>=0.5&&k<0.85);opt.onScale&&opt.onScale(k)};
  box.querySelector(".nc-tools").onclick=e=>{const a=e.target.closest("button")?.dataset.z;if(!a)return;tip.style.display="none";
    if(a==="in")z.zin();if(a==="out")z.zout();if(a==="fit")z.fit();
    if(a==="fs"){if(document.fullscreenElement)document.exitFullscreen();else box.requestFullscreen?.().catch(()=>{})}};
  box.addEventListener("pointerdown",e=>{if(!e.target.closest(".nc-tools"))tip.style.display="none"});
  requestAnimationFrame(()=>{z.fit();lod()});
  const showTip=(html,scr)=>{tip.innerHTML=html;tip.style.display="block";const r=box.getBoundingClientRect();
    tip.style.left=Math.min(Math.max(8,scr[0]+14),r.width-290)+"px";tip.style.top=Math.min(Math.max(8,scr[1]+14),r.height-90)+"px"};
  const ns="http://www.w3.org/2000/svg",layer=document.createElementNS(ns,"g");svg.append(layer);
  return{data,svg,layer,z,box,showTip,lod:()=>lod(),setHome:r=>{z.home=r}};
}

/* marqueur de repère personnel (k = échelle) */
function persoSVG(p,nom,k){const r=15*k,x=p[0],y=p[1],st=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r*.95;st.push((x+rr*Math.cos(a)).toFixed(1)+","+(y+rr*Math.sin(a)).toFixed(1))}
  return `<g class="perso"><circle cx="${x}" cy="${y}" r="${r*1.35}" fill="#ff00c8" stroke="#000" stroke-width="${3*k}"/><polygon points="${st.join(" ")}" fill="#fff"/>`+
    `<text x="${x}" y="${y+r*1.35+15*k}" font-size="${15*k}" text-anchor="middle" font-weight="bold" fill="#ff7ae4" stroke="#000" stroke-width="${4*k}" paint-order="stroke" font-family="'Courier New',monospace" letter-spacing="1">${esc(nom.toUpperCase())}</text></g>`}
/* ------------------------------ rendu SVG ------------------------------ */
function renderSVG(G){
  const {W,H,cell:CELL}=G,area=G.area,id=G.id;
  const pth=poly=>"M"+poly.map(p=>p[0].toFixed(1)+" "+p[1].toFixed(1)).join("L")+"Z";
  const segs={loc:"",av:"",bd:"",wall:""};
  G.edges.forEach(e=>{segs[e.cls]+=`M${e.a[0].toFixed(1)} ${e.a[1].toFixed(1)}L${e.b[0].toFixed(1)} ${e.b[1].toFixed(1)}`});
  let s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="nc-svg">`;
  s+=`<defs><pattern id="hatch-${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="#1a0a0c"/><line x1="0" y1="0" x2="0" y2="14" stroke="#ff2a3d" stroke-opacity=".35" stroke-width="5"/></pattern>
    <pattern id="waves-${id}" width="60" height="20" patternUnits="userSpaceOnUse"><rect width="60" height="20" fill="#05141d"/><path d="M0 12 Q15 6 30 12 T60 12" fill="none" stroke="#0e3346" stroke-width="1.5"/></pattern>${G.defs||""}</defs>`;
  s+=G.base!==undefined?G.base:`<rect width="${W}" height="${H}" fill="#0b120e"/>`;
  let g="";for(let x=CELL;x<W;x+=CELL)g+=`M${x} 0V${H}`;for(let y=CELL;y<H;y+=CELL)g+=`M0 ${y}H${W}`;
  s+=`<path d="${g}" stroke="#00ff9c" stroke-opacity=".06" stroke-width="1"/>`;
  const clipOpen=k=>k.clip?`<g clip-path="url(#${k.clip})">`:"",clipClose=k=>k.clip?"</g>":"";
  if(G.outlineD)s+=`<path d="${G.outlineD}" fill="none" stroke="#00ff9c" stroke-opacity=".35" stroke-width="4" stroke-dasharray="18 10"/>`;
  G.parks.forEach(k=>s+=`${clipOpen(k)}<path d="${pth(k.p)}" fill="#0f3320" stroke="#1d6b3f" stroke-width="2"/>${clipClose(k)}`);
  G.plazas.forEach(z=>s+=`<circle cx="${z.c[0]}" cy="${z.c[1]}" r="${z.r}" fill="#123d2a" stroke="#1d6b3f" stroke-width="2"/>`);
  G.restr.forEach(k=>s+=`${clipOpen(k)}<path d="${pth(k.p)}" fill="url(#hatch-${id})" stroke="#ff2a3d" stroke-width="2" stroke-dasharray="10 6"/>${clipClose(k)}`);
  G.water.forEach(w=>{if(w.p.length>2)s+=`${clipOpen(w)}<path d="${pth(w.p)}" fill="url(#waves-${id})" stroke="#1f6f8f" stroke-width="2.5"/>${clipClose(w)}`});
  s+=`<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${segs.loc}" stroke="#020604" stroke-width="9"/><path d="${segs.av}${segs.bd}" stroke="#020604" stroke-width="15"/>
    <path d="${segs.loc}" stroke="#2b6b4f" stroke-width="5"/>
    <path d="${segs.av}" stroke="#00c27a" stroke-width="10"/><path d="${segs.bd}" stroke="#00e08d" stroke-width="11"/>
    <path d="${segs.av}${segs.bd}" stroke="#003b24" stroke-width="1.2" stroke-dasharray="10 10"/>
    <path d="${segs.wall}" stroke="#ff2a3d" stroke-width="9" stroke-dasharray="4 3"/></g>`;
  if(area)s+=`<path d="M0 0H${W}V${H}H0Z ${pth(area)}" fill="#000" fill-opacity=".45" fill-rule="evenodd"/>`;
  G.hws.forEach(h=>{const d=h.d||("M"+h.p.map(p=>p.join(" ")).join("L"));
    s+=`<path d="${d}" fill="none" stroke="#000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffb000" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#5a3a00" stroke-width="1.6" stroke-dasharray="16 12"/>`});
  /* étiquettes */
  const occ={},oc=p=>Math.floor(p[0]/26)+":"+Math.floor(p[1]/26);
  const free=pts=>pts.every(p=>!occ[oc(p)]),mark=pts=>pts.forEach(p=>occ[oc(p)]=1);
  const labels=[];
  const place=(pts,name,cls,fs,at)=>{
    let d=0;for(let i=0;i<pts.length-1;i++){const L=dist(pts[i],pts[i+1]);if(d+L>=at){const t=(at-d)/L,p=[pts[i][0]+(pts[i+1][0]-pts[i][0])*t,pts[i][1]+(pts[i+1][1]-pts[i][1])*t];
      let ang=Math.atan2(pts[i+1][1]-pts[i][1],pts[i+1][0]-pts[i][0])*180/Math.PI;if(ang>90)ang-=180;if(ang<-90)ang+=180;
      const half=name.length*fs*0.31,ca=Math.cos(ang*Math.PI/180),sa=Math.sin(ang*Math.PI/180),samp=[];
      for(let k=-half;k<=half;k+=10)samp.push([p[0]+ca*k,p[1]+sa*k]);
      if(p[0]<half*0.3||p[0]>W-20||p[1]<14||p[1]>H-10||!free(samp))return false;if(area&&!inPoly(p,area))return false;
      mark(samp);labels.push(`<text class="${cls}" x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" transform="rotate(${ang.toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)})" font-size="${fs}" dy="${(fs*0.35).toFixed(1)}">${esc(name)}</text>`);return true}d+=L}return false};
  const byLine={};G.edges.forEach(e=>{if(e.name)(byLine[e.line]||(byLine[e.line]=[])).push(e)});
  const runsOf=k=>{const es=byLine[k].slice().sort((a,b)=>a.ord-b.ord),runs=[];let cur=null;
    es.forEach(e=>{if(cur&&dist(cur[cur.length-1],e.a)<1.5)cur.push(e.b);else{cur=[e.a,e.b];runs.push(cur)}});return runs};
  const plen=pts=>pts.reduce((t,p,i)=>i?t+dist(pts[i-1],p):t,0);
  G.hws.forEach(h=>(h.runs||[h.p]).forEach(r=>{const L=plen(r);if(L<160)return;for(let f of (L>900?[0.3,0.75]:[0.5]))place(r,h.nom,"t-hw",17,L*f)}));
  const RK={bd:0,wall:0,av:1,loc:2};
  Object.keys(byLine).sort((a,b)=>RK[byLine[a][0].cls]-RK[byLine[b][0].cls]).forEach(k=>{const e0=byLine[k][0],cls=e0.cls==="loc"?"t-loc":"t-av",fs=e0.cls==="loc"?10.5:13,step=e0.cls==="loc"?520:430;
    runsOf(k).forEach(r=>{const L=plen(r);if(L<e0.name.length*fs*0.62+20)return;const n=Math.max(1,Math.floor(L/step));
      for(let m=0;m<n;m++){const base=L*(m+0.5)/n;for(const off of [0,-0.18,0.18,-0.32,0.32]){const at=base+off*L/n;if(at>10&&at<L-10&&place(r,e0.name,cls,fs,at))break}}})});
  s+=`<g class="labels" font-family="'Courier New',monospace">${labels.join("")}</g>`;
  G.exits.forEach(x=>s+=`<g class="exit"><circle cx="${x.p[0]}" cy="${x.p[1]}" r="11" fill="#ffb000" stroke="#000" stroke-width="2.5"/><text x="${x.p[0]}" y="${x.p[1]}" dy="4" font-size="11" font-weight="bold" text-anchor="middle" fill="#000" font-family="monospace">${x.n}</text></g>`);
  G.gates.forEach(gt=>s+=`<rect x="${gt.p[0]-9}" y="${gt.p[1]-9}" width="18" height="18" fill="#ff2a3d" stroke="#000" stroke-width="2"/><text x="${gt.p[0]}" y="${gt.p[1]}" dy="4" font-size="11" text-anchor="middle" fill="#fff" font-family="monospace" font-weight="bold">⛨</text>`);
  G.lms.forEach(l=>s+=`<g class="lm"><rect x="${l.p[0]-22}" y="${l.p[1]-11}" width="44" height="22" rx="3" fill="${l.col}" stroke="#000" stroke-width="2"/><text x="${l.p[0]}" y="${l.p[1]}" dy="4.5" font-size="12" font-weight="bold" text-anchor="middle" fill="#000" font-family="monospace">${l.code}</text><text class="t-lm" x="${l.p[0]}" y="${l.p[1]+25}" font-size="12" text-anchor="middle" fill="${l.col}" font-family="'Courier New',monospace">${esc(l.nom)}</text></g>`);
  (G.perso||[]).forEach(r=>s+=persoSVG(r.p,r.nom,1));
  const big=(t,x,y,fill,fs,cls="")=>`<text class="${cls}" x="${x}" y="${y}" font-size="${fs}" fill="${fill}" text-anchor="middle" font-family="'Courier New',monospace" font-weight="bold" letter-spacing="3">${esc(t)}</text>`;
  const cen=p=>p.reduce((a,q)=>[a[0]+q[0]/p.length,a[1]+q[1]/p.length],[0,0]);
  G.water.forEach(w=>{if(w.nom&&w.lp)s+=big(w.nom,w.lp[0],w.lp[1],"#2a85ad",w.fs||18,"t-big")});
  G.parks.forEach(k=>{if(!k.nom)return;const c=k.lp||cen(k.p);s+=big(k.nom,c[0],c[1],"#3fae6a",20,"t-big")});
  G.plazas.forEach(z=>{if(z.nom)s+=big(z.nom,z.c[0],z.c[1]+6,"#3fae6a",15,"t-big")});
  G.restr.forEach(k=>{if(!k.nom)return;const c=k.lp||cen(k.p);s+=big(k.nom,c[0],c[1]+6,"#ff5a6a",17,"t-big")});
  G.voisins.forEach(v=>s+=`<text x="${v.p[0]}" y="${v.p[1]}" font-size="16" fill="#9fb8aa" fill-opacity=".55" text-anchor="middle" font-family="'Courier New',monospace" letter-spacing="2">${esc(v.t)}</text>`);
  (G.titles||[]).forEach(t=>s+=`<text class="t-dist" x="${t.p[0]}" y="${t.p[1]}" font-size="${t.fs||46}" text-anchor="middle" font-family="'Courier New',monospace" font-weight="bold" letter-spacing="6">${esc(t.t)}</text>`);
  if(G.mask)s+=`<path class="nc-mask" d="" fill="#000" fill-opacity=".62" fill-rule="evenodd"/>`;
  /* repères de grille */
  const nc=Math.ceil(W/CELL),nr=Math.ceil(H/CELL),gfs=CELL>100?22:13;
  let gr="";for(let i=0;i<nc;i++){const L=String.fromCharCode(65+i);gr+=`<text x="${i*CELL+CELL/2}" y="${gfs+3}" font-size="${gfs}" text-anchor="middle">${L}</text><text x="${i*CELL+CELL/2}" y="${H-6}" font-size="${gfs}" text-anchor="middle">${L}</text>`}
  for(let j=0;j<nr;j++)gr+=`<text x="8" y="${j*CELL+CELL/2+5}" font-size="${gfs}">${j+1}</text><text x="${W-8}" y="${j*CELL+CELL/2+5}" font-size="${gfs}" text-anchor="end">${j+1}</text>`;
  s+=`<g fill="#00ff9c" fill-opacity=".5" font-family="monospace" font-weight="bold">${gr}</g>`;
  let hit="";
  G.inter.forEach((it,i)=>hit+=`<circle data-i="${i}" cx="${it.p[0].toFixed(1)}" cy="${it.p[1].toFixed(1)}" r="11"/>`);
  G.exits.forEach((x,i)=>hit+=`<circle data-x="${i}" cx="${x.p[0].toFixed(1)}" cy="${x.p[1].toFixed(1)}" r="14"/>`);
  G.gates.forEach((x,i)=>hit+=`<circle data-g="${i}" cx="${x.p[0].toFixed(1)}" cy="${x.p[1].toFixed(1)}" r="14"/>`);
  (G.perso||[]).forEach((r,i)=>hit+=`<circle data-p="${i}" cx="${r.p[0].toFixed(1)}" cy="${r.p[1].toFixed(1)}" r="22"/>`);
  G.lms.forEach((l,i)=>hit+=`<rect data-l="${i}" x="${l.p[0]-24}" y="${l.p[1]-13}" width="48" height="26"/>`);
  s+=`<g class="hit" fill="#fff" fill-opacity="0">${hit}</g><circle class="sel" r="14" cx="-50" cy="-50" fill="none" stroke="#fff" stroke-width="3"/></svg>`;
  G.svg=s;return G;
}

/* ------------------------- visionneuse zoomable ------------------------- */
function zoomable(box,inner,w,h,onScale,onTap,home){
  let s=1,tx=0,ty=0,fitS=1;const pts=new Map();let moved=0,downT=null,last=null;
  const rect=()=>box.getBoundingClientRect();
  const apply=()=>{inner.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;onScale&&onScale(s)};
  const api={};const fit=()=>{const r=rect();fitS=Math.min(r.width/w,r.height/h);home=api.home||home;if(home){const [x0,y0,x1,y1]=home;s=Math.min(r.width/(x1-x0),r.height/(y1-y0));tx=r.width/2-(x0+x1)/2*s;ty=r.height/2-(y0+y1)/2*s}else{s=fitS;tx=(r.width-w*s)/2;ty=(r.height-h*s)/2}apply()};
  const zoomAt=(f,cx,cy)=>{const ns=Math.max(fitS*0.8,Math.min(fitS*40,s*f));f=ns/s;tx=cx-(cx-tx)*f;ty=cy-(cy-ty)*f;s=ns;apply()};
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
  return Object.assign(api,{fit,zin:()=>zoomAt(1.5,...c()),zout:()=>zoomAt(1/1.5,...c()),scale:()=>s/fitS,px:()=>s,
    centerOn:(p,k)=>{const r=rect();s=Math.max(s,k);tx=r.width/2-p[0]*s;ty=r.height/2-p[1]*s;apply()}});
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
.nc-leg{position:absolute;left:8px;top:8px;z-index:3;width:250px;max-height:calc(100% - 52px);overflow:auto;background:#000d;border:1px solid var(--c);box-shadow:0 0 12px var(--dim);padding:8px 10px;font-size:11px;line-height:1.35;cursor:default}
.nc-leg.off{display:none}
.nc-leg-h{font-weight:bold;letter-spacing:.15em;display:flex;justify-content:space-between;border-bottom:1px solid var(--dim);padding-bottom:4px;margin-bottom:4px}
.nc-north{letter-spacing:0}
.nc-leg-r{display:flex;align-items:center;gap:8px;padding:1px 0}.nc-leg-r svg{flex:none}
.nc-leg-s{margin-top:6px;font-weight:bold;letter-spacing:.08em;opacity:.8}
.nc-leg-lm div{padding:1px 0}.nc-leg-lm b{display:inline-block;min-width:26px;text-align:center;color:#000;margin-right:6px}
.nc-leg-t{opacity:.85}
.nc-scale{margin-top:6px;display:flex;align-items:center;gap:6px}.nc-scale i{display:block;height:6px;border:2px solid var(--c);border-top:0}
.nc-svg text.t-dist{fill:#00ff9c;fill-opacity:.55;paint-order:stroke;stroke:#020604;stroke-width:6px}
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

/* ------------------------- légende affichée sur la carte ------------------------- */
const CATN={CR:"Corporations",PU:"Services publics",HB:"Hôtels, bars, restaurants",CH:"Cube hotels",CC:"Camps de conteneurs",NL:"Clubs, vie nocturne",AS:"Spectacles, sport",CA:"Culture, art",OT:"Autres lieux"};
function legendHTML(G,ville){
  const has=c=>G.cls.has(c),sw=st=>`<svg width="34" height="12" viewBox="0 0 34 12">${st}</svg>`;
  const line=(c,w,dash)=>sw(`<line x1="2" y1="6" x2="32" y2="6" stroke="#020604" stroke-width="${w+3}" stroke-linecap="round"/><line x1="2" y1="6" x2="32" y2="6" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${dash?`stroke-dasharray="${dash}"`:""}/>`);
  const box=(f,s,extra="")=>sw(`<rect x="3" y="1" width="28" height="10" fill="${f}" stroke="${s}" stroke-width="1.5" ${extra}/>`);
  const r=[];
  if(G.hws)r.push([line("#ffb000",7),"Autoroute / pont"]);
  if(G.exits)r.push([sw(`<circle cx="17" cy="6" r="5.5" fill="#ffb000" stroke="#000" stroke-width="1.5"/><text x="17" y="8.6" font-size="7" text-anchor="middle" font-weight="bold" font-family="monospace">1</text>`),"Sortie d'autoroute (n° le long de l'autoroute)"]);
  if(has("bd"))r.push([line("#00e08d",5),"Boulevard (limite de quartier ou de secteur)"]);
  if(has("av"))r.push([line("#00c27a",4.5),"Avenue / route côtière"]);
  if(has("loc"))r.push([line("#2b6b4f",2.5),"Rue"]);
  if(has("wall"))r.push([line("#ff2a3d",4,"2 1.5"),"Mur d'enceinte (Executive Zone)"]);
  if(G.gates)r.push([sw(`<rect x="11" y="0" width="12" height="12" fill="#ff2a3d" stroke="#000"/>`),"Porte / poste de contrôle"]);
  if(G.parks)r.push([box("#0f3320","#1d6b3f"),"Parc, place"]);
  r.push([box("#05141d","#1f6f8f"),"Eau"]);
  if(G.restr)r.push([box("#3a0f14","#ff2a3d",'stroke-dasharray="3 2"'),"Zone interdite"]);
  r.push([sw(`<line x1="2" y1="6" x2="32" y2="6" stroke="#00ff9c" stroke-opacity=".6" stroke-width="2" stroke-dasharray="5 3"/>`),"Limite de quartier"]);
  if(G.perso)r.push([sw(`<circle cx="17" cy="6" r="5.5" fill="#ff00c8" stroke="#000"/><text x="17" y="8.5" font-size="7" text-anchor="middle" fill="#fff">★</text>`),"Repère de la campagne"]);
  if(!ville)r.push([box("#000","#333",'fill-opacity=".55"'),"Autres quartiers (assombris)"]);
  const lm=G.cats.map(c=>`<div><b style="background:${CAT[c]||"#ccc"}">${c}</b>${CATN[c]||c}</div>`).join("");
  return `<div class="nc-leg-h">LÉGENDE <span class="nc-north" title="Nord">▲ N</span></div>
    ${r.map(([s,t])=>`<div class="nc-leg-r">${s}<span>${t}</span></div>`).join("")}
    ${lm?`<div class="nc-leg-s">LIEUX (CODES DE LA CARTE OFFICIELLE)</div><div class="nc-leg-lm">${lm}</div>`:""}
    <div class="nc-leg-s">REPÉRAGE</div><div class="nc-leg-t">Grille A–T / 1–20, la même sur toutes les cartes (une case = 200 m).<br>Toucher un carrefour, une sortie ou un lieu pour son nom.</div>
    <div class="nc-scale"><i></i><span></span></div>`;
}

/* ---------------------------- page CARTE ---------------------------- */
/* opt.mj : vue MJ (dossier CARTES) — sinon vue publique, limitée à la carte d'origine */
function render(view,id,opt={}){
  const MJ=!!opt.mj;if(!MJ)id=null;
  css();document.body.classList.add("wide");
  const ville=id==="ville",q=ville?{id:"ville",nom:"Night City — plan complet",desc:"Toute la ville : chaque quartier avec son réseau de rues. Les plans de quartier sont des agrandissements de ce plan (mêmes rues, mêmes noms, mêmes autoroutes). Zoomer pour faire apparaître les noms des rues."}:QUARTIERS.find(x=>x.id===id);
  const tab=(h,t,on)=>`<a href="${h}"><button class="${on?"on":""}">${t}</button></a>`;
  const H=MJ?"#mj-carte":"#carte";
  view.innerHTML=`${MJ?'<a href="#mj">← MJ</a>':'<a href="#">← INDEX</a>'}<h2>▓ ${MJ?"MJ // CARTES // ":"CARTE // "}${q?esc(q.nom.toUpperCase()):"NIGHT CITY"}</h2>
    ${MJ?`<div class="nc-tabs">${tab(H,"CARTE D'ORIGINE",!q)}${tab(H+"-ville","▦ PLAN COMPLET",ville)}${QUARTIERS.slice().sort((a,b)=>a.court.localeCompare(b.court)).map(x=>tab(H+"-"+x.id,esc(x.court),q&&q.id===x.id)).join("")}</div>`:""}
    ${q?`<p><small>${esc(q.desc)}</small></p>`:""}
    <div class="nc-box"><div class="nc-inner"></div>
      <div class="nc-tools"><button data-z="in" title="Zoomer">+</button><button data-z="out" title="Dézoomer">−</button><button data-z="fit" title="${ville?"Vue entière":"Recentrer sur le quartier"}">⤢</button><button data-z="fs" title="Plein écran">⛶</button>${q?`<button data-z="leg" title="Légende">ⓘ</button>`:""}</div>
      ${q?`<div class="nc-leg"></div>`:""}<div class="nc-tip"></div>
      <div class="nc-hint">MOLETTE / PINCER : ZOOM · GLISSER : DÉPLACER${q?" · TOUCHER UN CARREFOUR : NOMS DES RUES":""}</div></div>
    <div id="nc-info"></div>`;
  const box=$(".nc-box",view),inner=$(".nc-inner",view),tip=$(".nc-tip",view),leg=$(".nc-leg",view);
  let w,h,data=null,dist0=null,home=null;
  if(q){data=buildCity();w=data.W;h=data.H;inner.innerHTML=data.svg;
    if(!ville){dist0=data.dist[q.id];const [a,b,c,d]=dist0.bb,m=70;home=[a-m,b-m,c+m,d+m];
      inner.querySelector(".nc-mask").setAttribute("d",`M0 0H${w}V${h}H0Z M${dist0.fp.map(p=>p.join(" ")).join("L")}Z`)}}
  else{w=IMG.w;h=IMG.h;const k=IMG.w/2000;
    inner.innerHTML=`<img src="${IMG.src}" alt="Carte de Night City" width="${w}" height="${h}" draggable="false"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="position:absolute;left:0;top:0;pointer-events:none">${PERSO.map(r=>persoSVG([r.p[0]*k,r.p[1]*k],r.nom,1.1)).join("")}</svg>`}
  inner.style.width=w+"px";inner.style.height=h+"px";
  const R=p=>ref(p,data),sel=q?inner.querySelector(".sel"):null;
  const showTip=(html,scr,p)=>{tip.innerHTML=html;tip.style.display="block";const r=box.getBoundingClientRect();
    tip.style.left=Math.min(Math.max(8,scr[0]+14),r.width-290)+"px";tip.style.top=Math.min(Math.max(8,scr[1]+14),r.height-90)+"px";
    if(sel&&p){sel.setAttribute("cx",p[0]);sel.setAttribute("cy",p[1])}};
  const hideTip=()=>{tip.style.display="none";if(sel){sel.setAttribute("cx",-50);sel.setAttribute("cy",-50)}};
  const qd=o=>o.q?`<br><small>${esc(o.q)}</small>`:"";
  let lod=()=>{};
  const z=zoomable(box,inner,w,h,()=>lod(),(t,p,scr)=>{
    if(!data){hideTip();return}
    const el=t&&t.closest&&t.closest("[data-i],[data-x],[data-g],[data-l],[data-p]");if(!el){hideTip();return}
    if(el.dataset.p){const r=data.perso[+el.dataset.p];showTip(`<b>★ ${esc(r.nom)}</b>${esc(r.info)} · ${R(r.p)}`,scr,r.p);return}
    if(el.dataset.i){const it=data.inter[+el.dataset.i];showTip(`<b>▓ CARREFOUR ${R(it.p)}</b>${esc(it.a)}<br>× ${esc(it.b)}${qd(it)}`,scr,it.p)}
    else if(el.dataset.x){const x=data.exits[+el.dataset.x];showTip(`<b>▓ ${esc(x.hw)} — SORTIE ${x.n}</b>${esc(x.rue)} · ${R(x.p)}${qd(x)}`,scr,x.p)}
    else if(el.dataset.g){const g=data.gates[+el.dataset.g];showTip(`<b>▓ PORTE — POSTE DE CONTRÔLE</b>${esc(g.rue)} · ${R(g.p)}`,scr,g.p)}
    else if(el.dataset.l){const l=data.lms[+el.dataset.l];showTip(`<b>▓ ${esc(l.code)}</b>${esc(l.nom)} · ${R(l.p)}${qd(l)}`,scr,l.p)}},home);
  lod=()=>{const k=z.px();box.classList.toggle("z0",k<0.5);box.classList.toggle("z1",k>=0.5&&k<0.85);
    if(leg){const m=[10,20,50,100,200,500,1000,2000].find(v=>v*k>=60)||2000,sc=leg.querySelector(".nc-scale");
      if(sc){sc.querySelector("i").style.width=(m*k).toFixed(0)+"px";sc.querySelector("span").textContent=m>=1000?m/1000+" km":m+" m"}}};
  /* sous-ensemble du quartier (légende, chiffres, recherche) */
  const inD=o=>ville||o.d===dist0.i;
  const bbHit=pts=>{if(ville)return true;const [a,b,c,d]=home,inB=p=>p[0]>=a&&p[0]<=c&&p[1]>=b&&p[1]<=d;
    for(let i=0;i<pts.length;i++){if(inB(pts[i]))return true;if(i<pts.length-1)for(let t=0.05;t<1;t+=0.05)if(inB(lerp(pts[i],pts[i+1],t)))return true}return false};
  if(data){
    const sub={perso:(data.perso||[]).some(r=>bbHit([r.p])),cls:ville?new Set(data.edges.map(e=>e.cls)):dist0.cls,hws:data.hws.some(x=>bbHit(x.p)),exits:data.exits.some(inD),gates:data.gates.some(inD),
      parks:data.parks.some(k=>bbHit(k.p))||data.plazas.some(k=>bbHit([k.c])),restr:data.restr.some(k=>bbHit(k.p)),
      cats:[...new Set(data.lms.filter(inD).map(l=>l.code.slice(0,2)))].sort()};
    leg.innerHTML=legendHTML(sub,ville);if(box.clientWidth<700)leg.classList.add("off")}
  $(".nc-tools",view).onclick=e=>{const a=e.target.closest("button")?.dataset.z;if(!a)return;hideTip();
    if(a==="in")z.zin();if(a==="out")z.zout();if(a==="fit")z.fit();if(a==="leg")leg.classList.toggle("off");
    if(a==="fs"){if(document.fullscreenElement)document.exitFullscreen();else box.requestFullscreen?.().catch(()=>{})}};
  document.addEventListener("fullscreenchange",()=>{if(box.isConnected)setTimeout(z.fit,60)});
  box.addEventListener("pointerdown",e=>{if(!e.target.closest(".nc-tools,.nc-leg"))hideTip()});
  requestAnimationFrame(z.fit);
  const info=$("#nc-info",view);
  if(!q){info.innerHTML=`<p><small>CARTE DE NIGHT CITY (SOURCE : CARTE NON OFFICIELLE CYBERPUNK RED).${MJ?" « PLAN COMPLET » : TOUTE LA VILLE AU STYLE DES PLANS DE QUARTIER ; LES AUTRES ONGLETS : CHAQUE QUARTIER EN DÉTAIL.":""}</small></p>`;return}
  const I=data.inter.filter(inD),X=data.exits.filter(inD),LM=data.lms.filter(inD);
  info.innerHTML=`<div class="panel" style="margin-top:10px"><div>▓ ${ville?data.nbStreets:dist0.nb} RUES · ${I.length} CARREFOURS${X.length?" · "+X.length+" SORTIES D'AUTOROUTE":""}${LM.length?" · "+LM.length+" LIEUX":""}</div>
    <div class="nc-search"><input id="nc-q" placeholder="Chercher une rue ou un lieu${ville?"":" du quartier"}…" autocomplete="off" spellcheck="false"></div><div class="nc-res" id="nc-r"></div>
    ${LM.length?`<div class="nc-lms">${LM.map(l=>`<div><b style="background:${l.col}">${esc(l.code)}</b>${esc(l.nom)} · ${R(l.p)}</div>`).join("")}</div>`:""}</div>`;
  const qi=$("#nc-q",view),res=$("#nc-r",view);
  qi.oninput=()=>{const v=qi.value.trim().toLowerCase();if(v.length<2){res.innerHTML="";return}
    const hits=[];(data.perso||[]).forEach(r=>{if((r.nom+" "+r.info).toLowerCase().includes(v))hits.push({t:"★ "+r.nom,p:r.p})});LM.forEach(l=>{if((l.code+" "+l.nom).toLowerCase().includes(v))hits.push({t:`${l.code} — ${l.nom}`,p:l.p})});
    const seenN=new Set();I.forEach(it=>{[it.a,it.b].forEach(n=>{const key=n+it.q;if(n.toLowerCase().includes(v)&&!seenN.has(key)){seenN.add(key);hits.push({t:n+(ville?" ("+QUARTIERS[it.d].court+")":""),p:it.p})}})});
    res.innerHTML=hits.slice(0,30).map((h,i)=>`<button data-k="${i}">${esc(h.t)} · ${R(h.p)}</button>`).join("")||"<small>AUCUN RÉSULTAT</small>";
    res.querySelectorAll("button").forEach(b=>b.onclick=()=>{const h=hits[+b.dataset.k];z.centerOn(h.p,1.3);lod();box.scrollIntoView({behavior:"smooth",block:"center"});showTip(`<b>▓ ${esc(h.t)}</b>${R(h.p)}`,[box.clientWidth/2,box.clientHeight/2],h.p)})};
}
const $=(s,e=document)=>e.querySelector(s);

window.NC_CARTE={zoomable,css,PERSO,render,QUARTIERS,buildCity,buildGraph,nearestInter,fixCar,interName,step,course,hops,mountMap,C};
})();
