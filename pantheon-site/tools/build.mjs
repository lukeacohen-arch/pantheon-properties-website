#!/usr/bin/env node
/**
 * Optional page generator for the Pantheon Properties static site.
 * Run from the site root:  node tools/build.mjs
 * It rewrites every .html page, sitemap.xml, robots.txt and llms.txt from the data below,
 * so header/footer/schema stay consistent. You can also ignore it and edit the HTML by hand.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://pantheonproperties.com";
const TODAY = "2026-11-23";
// Photos and flyers are self-hosted in assets/media/ (same year/month folders as the old WordPress uploads).
const UP = "/assets/media/";
const DEFAULT_OG = UP + "2021/01/jason-chao-EBPv-LVskwc-unsplash-min-768x456.jpg";

/* ------------------------------------------------------------------ data -- */
const CO = {
  name: "Pantheon Properties",
  legal: "Pantheon Properties Inc.",
  phone: "212.277.7500",
  phoneTel: "+12122777500",
  fax: "212.265.8158",
  email: "info@pantheonproperties.com",
  leasing: "leasing@pantheonproperties.com",
  street: "119 West 57th Street, Penthouse South",
  city: "New York",
  region: "NY",
  zip: "10019",
};

const fmt = (n) => n.toLocaleString("en-US");
const U = (label, sf, avail = false, flyer = null, sizeText = null) => ({
  label,
  sizeText: sizeText || `${fmt(sf)} SF`,
  avail,
  flyer,
});

const properties = [
  {
    slug: "401-penhorn-avenue", name: "401 Penhorn Avenue", city: "Secaucus", state: "nj",
    img: UP + "2020/11/prop44bd683f506fd-2-scaled.jpg", hero: UP + "2020/11/prop44bd683f506fd-2-1170x694.jpg",
    sf: "73,921 SF", sfNum: 73921, land: "3.69 acres", acres: 3.69, ceiling: "22 ft", parking: "81 spaces", loading: null,
    status: "available",
    desc: "Prime industrial building located off the New Jersey Turnpike and Route 3. The building is within minutes of Manhattan and Newark International Airport. The Garden State Parkway, Routes 17, 46, 1 & 9, and arteries to I-80, I-95 and I-280 are easily accessible.",
    units: [U("1", 16141), U("2", 12106), U("3", 12106), U("4", 11012), U("5", 10406),
      U("6", 12148, true, UP + "2025/12/401-Penhorn-Unit-6-Marketing-Flyer_LC_12.26.2025.pdf")],
  },
  {
    slug: "70-triangle-boulevard", name: "70 Triangle Boulevard", city: "Carlstadt", state: "nj",
    img: UP + "2020/12/prop4a2919228f306.jpg", hero: UP + "2020/12/prop4a2919228f306.jpg",
    sf: "46,700 SF", sfNum: 46700, land: "2.20 acres", acres: 2.2, ceiling: "16 ft", parking: "5 per 1,000 SF", loading: null,
    status: "leased",
    desc: "A 46,700 SF industrial building on 2.20 acres in Carlstadt, New Jersey, with 16-foot ceilings and parking at 5 spaces per 1,000 SF.",
    note: "Pantheon Properties is engaged as exclusive broker on behalf of the property owner.",
    units: [U("1", 13300, false, UP + "2020/12/unit53d90b7acabf3file.pdf"), U("2", 13000)],
  },
  {
    slug: "217-washington-avenue", name: "217 Washington Avenue", city: "Carlstadt", state: "nj",
    img: UP + "2021/05/217-photo.jpg", hero: UP + "2021/05/217-photo.jpg",
    sf: "±15,840 SF", sfNum: 15840, land: null, ceiling: "20 ft clear", parking: "Extra parking available", loading: "1 loading dock",
    status: "available",
    desc: "An industrial space of approximately 15,840 SF in Carlstadt, New Jersey, with 20-foot clear ceilings, one loading dock and extra parking available.",
    units: [U("D, E & F", 15840, true, UP + "2024/11/217-Washington-Ave_Marketing-Flyer_2024.11.04_Unit-DEF.pdf")],
  },
  {
    slug: "3200-liberty-avenue", name: "3200 Liberty Avenue", city: "North Bergen", state: "nj",
    img: UP + "2023/07/3200-Building-aerial.jpg", hero: UP + "2023/07/3200-Building-aerial.jpg",
    sf: "≈204,950 SF", sfNum: 204950, land: "8.797 acres", acres: 8.797, ceiling: "15–22 ft", parking: "Ample", loading: null,
    status: "available",
    desc: "A multi-unit industrial complex of approximately 204,950 SF on 8.797 acres in North Bergen, New Jersey, with ceiling heights from 15 to 22 feet and ample parking.",
    units: [U("1A", 25317), U("1B", 20741), U("1CW", 7503), U("2A", 28042), U("2B", 7010), U("2C", 9588),
      U("3", 30714), U("4", 41324), U("5LN", 14700, true), U("5M", 14923), U("6", 6324)],
  },
  {
    slug: "280-wilson-avenue", name: "280 Wilson Avenue", city: "Newark", state: "nj",
    img: UP + "2020/11/prop42f3c33f62f78.jpg", hero: UP + "2020/11/prop42f3c33f62f78.jpg",
    sf: "81,326 SF", sfNum: 81326, land: "4.03 acres", acres: 4.03, ceiling: "15 ft", parking: "120 spaces", loading: "3",
    status: "leased",
    desc: "An 81,326 SF industrial building on 4.03 acres in Newark, New Jersey, with 15-foot ceilings and 120 parking spaces.",
    note: "1.2 miles from Newark Liberty International Airport.",
    units: [U("A", 4471), U("B", 20041), U("C", 26545), U("D", 25482), U("E", 4847)],
  },
  {
    slug: "201-penhorn-avenue", name: "201 Penhorn Avenue", city: "Secaucus", state: "nj",
    img: UP + "2020/12/prop42892ad6ef434.jpg", hero: UP + "2020/12/prop42892ad6ef434.jpg",
    sf: "51,065 SF", sfNum: 51065, land: "3.34 acres", acres: 3.34, ceiling: "20 ft", parking: "79 spaces", loading: null,
    status: "leased",
    desc: "Prime industrial building located off the New Jersey Turnpike and Route 3. The building is within minutes of Manhattan and Newark International Airport. The Garden State Parkway, Routes 17, 46, 1 & 9, and arteries to I-80, I-95 and I-280 are easily accessible.",
    units: [U("1", 15331), U("2", 12129), U("3", 10752), U("4", 12853)],
  },
  {
    slug: "100-oak-point-avenue", name: "100 Oak Point Avenue", city: "Bronx", state: "ny",
    img: UP + "2020/12/prop47fd18bfef521.jpeg", hero: UP + "2020/12/prop47fd18bfef521-1170x694.jpg",
    sf: "Up to 250,000 SF", sfNum: null, land: "9 acres upland + 6 riparian", acres: 9, ceiling: null, parking: "To suit", loading: null,
    status: "available",
    desc: "Land in the Bronx, New York offering up to 250,000 SF of building on 9 upland acres plus 6 riparian acres. Up to 9 acres are available now, with parking to suit.",
    units: [U("Smith Point", 0, true, null, "1± acre")],
  },
  {
    slug: "505-jefferson-avenue", name: "505 Jefferson Avenue", city: "Secaucus", state: "nj",
    img: UP + "2020/12/prop4e67a65e571df.jpg", hero: UP + "2020/12/prop4e67a65e571df-1170x694.jpg",
    sf: "51,332 SF", sfNum: 51332, land: "2.3 acres", acres: 2.3, ceiling: "17–24 ft", parking: "50 spaces", loading: null,
    status: "leased",
    desc: "A 51,332 SF industrial building on 2.3 acres in Secaucus, New Jersey, with ceiling heights of 17 to 24 feet and 50 parking spaces.",
    units: [U("Entire building", 51332)],
  },
];

for (const p of properties) {
  p.stateName = p.state === "nj" ? "New Jersey" : "New York";
  p.st = p.state.toUpperCase();
  p.url = `/property/${p.slug}/`;
  p.avail = p.units.filter((u) => u.avail);
  p.availLine = p.avail.length
    ? "Space available: " + p.avail.map((u) => `${p.slug === "100-oak-point-avenue" ? "land" : "Unit " + u.label} (${u.sizeText})`).join("; ") + "."
    : "Currently fully leased.";
}
const available = properties.filter((p) => p.status === "available");

const tenantsHome = ["Target", "NBCUniversal", "Verizon", "Warner Bros.", "Netflix", "Coach", "Bulgari", "L’Oréal"];
const tenantsAll = [...tenantsHome, "Viacom", "CBS", "Transgroup", "Shred-it", "Bimbo", "Caudalie", "Azaleia", "Maersk",
  "D’Artagnan", "Mavi", "Sara Lee", "Naked Juice", "Expeditors", "Lee’s Art Shop", "JAS", "New York City Ballet",
  "Imperial", "Baked by Melissa", "Frito-Lay", "Panera", "ACME", "Junior’s", "Dynamic", "Chef’s Warehouse", "Colavita"];

/* ---------------------------------------------------------------- helpers -- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const abs = (p) => (/^https?:/.test(p) ? p : SITE + p);

const ICONS = {
  build: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M9 11h.01M15 11h.01"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6"/></svg>',
  handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7 9.5 4.5a3 3 0 0 0-4.2 0L2 8l8 8 2-2M12 7l3-3 4 4 3 3-8 8-4-4M7 13l2 2"/></svg>',
};

const LOGO_DARK = "/assets/img/logo.svg";
const LOGO_WHITE = "/assets/img/logo-white.svg";
const SITE_ICON = "/assets/img/favicon.svg";
const APPLE_ICON = "/assets/img/apple-touch-icon.png";
const logoImg = (src) => `<img class="brand-logo" src="${src}" alt="Pantheon Properties" width="236" height="46" decoding="async">`;

const NAV = [
  ["/properties/", "Properties", "properties"],
  ["/property-management/", "Property Management", "management"],
  ["/about/", "About", "about"],
  ["/contact/", "Contact", "contact"],
];

function header(section) {
  const items = NAV.map(([href, label, key]) =>
    `<li><a href="${href}"${section === key ? ' aria-current="page"' : ""}>${label}</a></li>`).join("");
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">${logoImg(LOGO_DARK)}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-bars" aria-hidden="true"><span></span></span>Menu</button>
    <nav class="site-nav" id="site-nav" aria-label="Primary">
      <ul>${items}<li class="nav-cta"><a class="btn btn--primary" href="/contact/?type=leasing">Inquire about space</a></li></ul>
    </nav>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="/">${logoImg(LOGO_WHITE)}</a>
        <p class="footer-about">New York–headquartered developer, advisor, broker and property manager of industrial, commercial and land assets in New Jersey and the New York metro area.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h2>Available now</h2>
        <ul>${available.map((p) => `<li><a href="${p.url}">${esc(p.name)}</a></li>`).join("")}</ul>
      </div>
      <div>
        <h2>Contact</h2>
        <address>
          119 West 57th Street<br>Penthouse South<br>New York, NY 10019<br>
          <a href="tel:${CO.phoneTel}">${CO.phone}</a><br>
          <a href="mailto:${CO.leasing}">${CO.leasing}</a>
        </address>
      </div>
    </div>
    <div class="footer-legal">
      <span>© 2026 ${CO.legal} All rights reserved.</span>
      <span>Leasing &amp; property management · New Jersey &amp; New York metro</span>
    </div>
  </div>
</footer>`;
}

function breadcrumb(trail) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${trail.map(([label, href], i) =>
    i === trail.length - 1
      ? `<li><span aria-current="page">${esc(label)}</span></li>`
      : `<li><a href="${href}">${esc(label)}</a></li>`).join("")}</ol></nav>`;
}

const orgNode = () => ({
  "@type": ["RealEstateAgent", "LocalBusiness"],
  "@id": abs("/#organization"),
  name: CO.name,
  legalName: CO.legal,
  url: abs("/"),
  logo: abs("/assets/img/logo.png"),
  image: abs(DEFAULT_OG),
  description: "Full-service developer, advisory and brokerage, and property management firm for industrial, commercial and land-development real estate in New Jersey and the New York metro area.",
  telephone: "+1-212-277-7500",
  faxNumber: "+1-212-265-8158",
  email: CO.email,
  address: { "@type": "PostalAddress", streetAddress: CO.street, addressLocality: CO.city, addressRegion: CO.region, postalCode: CO.zip, addressCountry: "US" },
  areaServed: [
    { "@type": "State", name: "New Jersey" },
    { "@type": "State", name: "New York" },
  ],
  founder: { "@type": "Person", "@id": abs("/about/#ken-cohen"), name: "Ken Cohen", jobTitle: "Founder, President and CEO" },
  knowsAbout: ["Industrial real estate", "Commercial real estate leasing", "Property management", "Real estate development", "Land development", "Environmental remediation", "Energy-efficient retrofits"],
  contactPoint: [
    { "@type": "ContactPoint", contactType: "leasing", email: CO.leasing, telephone: "+1-212-277-7500", areaServed: "US", availableLanguage: "English" },
    { "@type": "ContactPoint", contactType: "customer service", email: CO.email, telephone: "+1-212-277-7500", areaServed: "US", availableLanguage: "English" },
  ],
});
const siteNode = () => ({ "@type": "WebSite", "@id": abs("/#website"), url: abs("/"), name: CO.name, publisher: { "@id": abs("/#organization") }, inLanguage: "en-US" });
const crumbNode = (trail) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(href) })),
});
const faqNode = (faqs) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
const faqHtml = (faqs, open = false) => `<div class="faq">${faqs.map(([q, a], i) =>
  `<details${open && i === 0 ? " open" : ""}><summary>${esc(q)}</summary><div class="faq-a"><p>${esc(a)}</p></div></details>`).join("")}</div>`;

function page({ path, section, title, description, ogImage = DEFAULT_OG, extra = [], noindex = false, head = "", body }) {
  const url = abs(path);
  const graph = { "@context": "https://schema.org", "@graph": [orgNode(), siteNode(), ...extra] };
  return `<!doctype html>
<html lang="en-US">
<head>
<!-- Google tag (Google Tag Manager container GTM-TRZFN394) -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-TRZFN394"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}">
<meta name="theme-color" content="#0b2545">
<meta name="format-detection" content="telephone=no">
<meta property="og:site_name" content="${CO.name}">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(ogImage)}">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="${SITE_ICON}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${APPLE_ICON}">
<link rel="stylesheet" href="/assets/css/styles.css">
${head}
<noscript><style>.nav-toggle{display:none}.site-nav{display:block;position:static;box-shadow:none}</style></noscript>
${ld(graph)}
</head>
<body>
${header(section)}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

const specRows = (p) => [["Square footage", p.sf], ["Land area", p.land], ["Ceiling height", p.ceiling], ["Parking", p.parking], ["Loading", p.loading]].filter(([, v]) => v);

// Banner label for an available unit, e.g. "Unit 6", "Units D, E & F", "Smith Point land".
const unitName = (p, u) => p.slug === "100-oak-point-avenue" ? `${u.label} land` : `Unit${/[,&]/.test(u.label) ? "s" : ""} ${u.label}`;

// Banner under the card photo listing what is available at the property (omitted when fully leased).
const availBanner = (p) => p.avail.length ? `
  <div class="prop-avail">
    <p class="prop-avail-label">Available now</p>
    <ul class="prop-avail-list">${p.avail.map((u) => `<li><span class="prop-avail-unit">${esc(unitName(p, u))}</span><span class="prop-avail-size">${esc(u.sizeText)}</span></li>`).join("")}</ul>
  </div>` : "";

function propCard(p, headingLevel = 3) {
  const h = `h${headingLevel}`;
  const specs = specRows(p).filter(([k]) => k !== "Loading").slice(0, 4);
  return `<article class="prop-card" data-property data-status="${p.status}" data-state="${p.state}">
  <div class="prop-media">
    <img src="${p.img}" alt="${esc(p.name)} industrial property in ${esc(p.city)}, ${p.stateName}" width="768" height="512" loading="lazy" decoding="async">
    <span class="badge ${p.status === "available" ? "badge--ok" : "badge--off"}">${p.status === "available" ? "Available" : "Fully leased"}</span>
  </div>${availBanner(p)}
  <div class="prop-body">
    <p class="prop-market">${esc(p.stateName)} · ${esc(p.city)}</p>
    <${h}><a href="${p.url}">${esc(p.name)}</a></${h}>
    <dl class="prop-specs">${specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <span class="text-link" aria-hidden="true">View details</span>
  </div>
</article>`;
}

const ctaBand = (title = "Looking for space or a management partner?", text = "Speak with our leasing team about available space, or ask how Pantheon can manage your property.") => `<section class="section" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta-band">
      <div><h2 id="cta-title">${esc(title)}</h2><p>${esc(text)}</p></div>
      <div class="btn-row">
        <a class="btn btn--primary" href="/contact/?type=leasing">Contact leasing</a>
        <a class="btn btn--ghost" href="tel:${CO.phoneTel}">Call ${CO.phone}</a>
      </div>
    </div>
  </div>
</section>`;

const heroPage = (trail, h1, lead, extraHtml = "") => `<section class="hero hero--page">
  <div class="container hero-inner">
    ${breadcrumb(trail)}
    <h1>${esc(h1)}</h1>
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ""}
    ${extraHtml}
  </div>
</section>`;

const pages = []; // {path, html}
const add = (path, html) => pages.push({ path, html });

/* ------------------------------------------------------------------ HOME -- */
const homeFaqs = [
  ["What does Pantheon Properties do?", "Pantheon Properties is a New York–headquartered, full-service real estate organization. It acquires, develops, brokers and manages industrial, commercial/office and land-development projects in New Jersey and the New York metro area, for its own account and for third parties."],
  ["Where are Pantheon Properties’ buildings located?", "Pantheon’s current portfolio includes industrial properties in Secaucus, Carlstadt, North Bergen and Newark, New Jersey, and a land opportunity in the Bronx, New York. Its offices are at 119 West 57th Street in Manhattan."],
  ["Who leads Pantheon Properties?", "Ken Cohen is the founder, President and CEO. He has more than 36 years in real estate, including repositioning, remediating, developing and managing properties across the eastern seaboard."],
  ["How do I inquire about available space?", "Call 212.277.7500 or email leasing@pantheonproperties.com. Marketing flyers for available units are linked on each property page and in the available-space table on the Properties page."],
  ["Who are Pantheon Properties’ partners?", "Pantheon’s partners include Canyon Capital Realty Advisors, SoBro, Turner Impact Capital and the Turner Multifamily Impact Fund. Pantheon has had a 24+ year partnership with Canyon Capital Advisors."],
];

add("/", page({
  path: "/", section: "home", ogImage: abs("/assets/img/og-home.jpg"),
  title: "Pantheon Properties | Industrial Real Estate in NJ & NY Metro",
  description: "Full-service developer, broker and property manager of industrial, commercial and land assets across New Jersey and the New York metro area.",
  extra: [
    { "@type": "WebPage", "@id": abs("/#webpage"), url: abs("/"), name: "Pantheon Properties — Industrial Real Estate in New Jersey and the New York Metro Area", isPartOf: { "@id": abs("/#website") }, about: { "@id": abs("/#organization") }, dateModified: TODAY, inLanguage: "en-US" },
    faqNode(homeFaqs),
  ],
  head: `<link rel="preload" as="image" href="/assets/img/hero-home-1280.webp" imagesrcset="/assets/img/hero-home-800.webp 800w, /assets/img/hero-home-1280.webp 1280w, /assets/img/hero-home-2000.webp 2000w" imagesizes="100vw" fetchpriority="high">`,
  body: `<section class="hero hero--photo">
  <picture class="hero-media">
    <source type="image/webp" srcset="/assets/img/hero-home-800.webp 800w, /assets/img/hero-home-1280.webp 1280w, /assets/img/hero-home-2000.webp 2000w" sizes="100vw">
    <img src="/assets/img/hero-home-1280.webp" width="2000" height="1125" alt="Aerial view of Central Park and the Midtown Manhattan skyline" fetchpriority="high" decoding="async">
  </picture>
  <div class="container hero-inner">
    <p class="eyebrow">New York · New Jersey · Metro area</p>
    <h1>A leading full-service real estate organization</h1>
    <p class="lead">Specializing in industrial real estate across New Jersey and the New York metro area.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="/properties/">View properties</a>
      <a class="btn btn--ghost" href="/contact/?type=leasing">Contact leasing</a>
    </div>
  </div>
</section>

<div class="container">
  <div class="stats" role="list" aria-label="Pantheon Properties at a glance">
    <div class="stat" role="listitem"><div class="stat-num">25<sup>+</sup></div><div class="stat-label">Years of experience</div></div>
    <div class="stat" role="listitem"><div class="stat-num">${properties.length}</div><div class="stat-label">Properties across New Jersey and New York</div></div>
    <div class="stat" role="listitem"><div class="stat-num">36<sup>+</sup></div><div class="stat-label">Years in real estate for founder &amp; CEO Ken Cohen</div></div>
    <div class="stat" role="listitem"><div class="stat-num">24<sup>+</sup></div><div class="stat-label">Year partnership with Canyon Capital Advisors</div></div>
  </div>
</div>

<section class="section" aria-labelledby="what-title">
  <div class="container">
    <div class="split">
      <div>
        <p class="eyebrow">Who we are</p>
        <h2 id="what-title">What is Pantheon Properties?</h2>
        <div class="answer"><p>Pantheon Properties is a New York–headquartered developer, advisor, broker and property manager of industrial, commercial/office and land-development real estate in New Jersey and the New York metro area.</p></div>
        <p style="margin-top:1.25rem">We identify opportunities and create value for our own account and for third parties, working as a partner to JV partners, tenants and investors. Our approach pairs broker relationships and construction-management quality with close attention to the needs of the tenant, the community and the environment.</p>
        <a class="text-link" href="/about/">About Pantheon</a>
      </div>
      <ul class="check-list" aria-label="How Pantheon works">
        <li><strong>Developers</strong> — acquisition, management and development of new building projects, land and rehabilitation opportunities.</li>
        <li><strong>Advisory &amp; Brokerage</strong> — marketing and disposition, acquisition and financial analysis.</li>
        <li><strong>Property Management</strong> — leasing, maintenance, capital improvements and institutional-level financial reporting.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="avail-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div><p class="eyebrow">Available now</p><h2 id="avail-title">Premium properties in New Jersey and the New York metro area</h2></div>
      <a class="text-link" href="/properties/">View all properties</a>
    </div>
    <div class="grid grid--3">${available.map((p) => propCard(p)).join("")}</div>
  </div>
</section>

<section class="section" aria-labelledby="exp-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Capabilities</p><h2 id="exp-title">Over 25 years of experience</h2></div>
    <div class="grid grid--3">
      <div class="card"><div class="card-icon">${ICONS.build}</div><h3>Full-service expertise</h3><p>Marketing and disposition, property acquisition, financial analysis, logistics, planning, design, environmental and construction management.</p></div>
      <div class="card"><div class="card-icon">${ICONS.chart}</div><h3>Data-driven performance</h3><p>Comprehensive operational data and insights with recommended actions to elevate asset performance by lowering costs, balancing risk and increasing revenue.</p></div>
      <div class="card"><div class="card-icon">${ICONS.handshake}</div><h3>Consultative and flexible</h3><p>Our team offers a consultative approach and flexible solutions that are customizable to meet specific client requirements.</p></div>
    </div>
  </div>
</section>

<section class="section section--navy" aria-labelledby="tenants-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div><p class="eyebrow">Tenants</p><h2 id="tenants-title">Trusted by Fortune 500 tenants</h2></div>
      <a class="text-link" style="color:var(--brass-400)" href="/about/#tenants">View all tenants and clients</a>
    </div>
    <ul class="tenants">${tenantsHome.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Questions</p><h2 id="faq-title">Pantheon Properties at a glance</h2></div>
    ${faqHtml(homeFaqs, true)}
  </div>
</section>

${ctaBand()}`,
}));

/* ------------------------------------------------------------ PROPERTIES -- */
const propFaqs = [
  ["What space is available right now?", "Available space includes " + available.map((p) => `${p.name} in ${p.city}, ${p.st} (${p.avail.map((u) => (p.slug === "100-oak-point-avenue" ? "up to 9 acres of land" : `Unit ${u.label}, ${u.sizeText}`)).join(", ")})`).join("; ") + ". The table above is the quickest overview."],
  ["Which markets do Pantheon’s properties serve?", "Pantheon’s properties are in Secaucus, Carlstadt, North Bergen and Newark, New Jersey, and the Bronx, New York, close to the New Jersey Turnpike, Route 3 and the Newark and Manhattan markets."],
  ["How do I request a flyer or arrange a visit?", "Download the marketing flyer for an available unit from its property page, then call 212.277.7500 or email leasing@pantheonproperties.com to discuss your requirements."],
];
const availRows = properties.flatMap((p) => p.avail.map((u) => ({ p, u })));
const propsTrail = [["Home", "/"], ["Properties", "/properties/"]];

add("/properties/", page({
  path: "/properties/", section: "properties",
  title: "Industrial Properties in NJ & NY Metro | Pantheon Properties",
  description: "Browse Pantheon Properties’ industrial buildings and land in Secaucus, Carlstadt, North Bergen, Newark and the Bronx, with specs and marketing flyers.",
  ogImage: available[0].hero,
  extra: [
    { "@type": "CollectionPage", "@id": abs("/properties/#webpage"), url: abs("/properties/"), name: "Pantheon Properties — Properties", isPartOf: { "@id": abs("/#website") }, about: { "@id": abs("/#organization") }, dateModified: TODAY, inLanguage: "en-US" },
    { "@type": "ItemList", name: "Pantheon Properties portfolio", itemListElement: properties.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(p.url), name: p.name })) },
    crumbNode(propsTrail),
    faqNode(propFaqs),
  ],
  body: `${heroPage(propsTrail, "Properties in New Jersey and the New York metro area", "Industrial buildings and land opportunities in northern New Jersey and the Bronx, owned and managed by Pantheon.")}

<section class="section" aria-labelledby="space-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">At a glance</p><h2 id="space-title">Available space</h2>
      <p class="lead">Currently available units and land. Call ${CO.phone} or email <a href="mailto:${CO.leasing}">${CO.leasing}</a>.</p></div>
    <div class="table-wrap">
      <table>
        <caption class="visually-hidden">Currently available space across the Pantheon Properties portfolio</caption>
        <thead><tr><th scope="col">Property</th><th scope="col">Market</th><th scope="col">Space</th><th scope="col" class="num">Size</th><th scope="col">Flyer</th></tr></thead>
        <tbody>${availRows.map(({ p, u }) => `<tr><th scope="row"><a href="${p.url}">${esc(p.name)}</a></th><td>${esc(p.city)}, ${p.st}</td><td>${p.slug === "100-oak-point-avenue" ? esc(u.label) : "Unit " + esc(u.label)}</td><td class="num">${esc(u.sizeText)}</td><td>${u.flyer ? `<a href="${u.flyer}" rel="noopener">Marketing flyer (PDF)</a>` : "—"}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="all-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Portfolio</p><h2 id="all-title">All properties</h2></div>
    <div class="filters" data-filters hidden role="group" aria-label="Filter properties">
      <button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>
      <button class="chip" type="button" data-filter="available" aria-pressed="false">Available</button>
      <button class="chip" type="button" data-filter="nj" aria-pressed="false">New Jersey</button>
      <button class="chip" type="button" data-filter="ny" aria-pressed="false">New York</button>
    </div>
    <p class="filter-status" data-filter-status role="status" aria-live="polite"></p>
    <div class="grid grid--3">${properties.map((p) => propCard(p)).join("")}</div>
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Questions</p><h2 id="faq-title">Leasing and availability</h2></div>
    ${faqHtml(propFaqs, true)}
  </div>
</section>

${ctaBand("Don’t see the right fit?", "Tell us your size, timing and location requirements and we’ll tell you what is coming available.")}`,
}));

/* ----------------------------------------------------- PROPERTY DETAIL ----- */
properties.forEach((p, i) => {
  const prev = properties[(i - 1 + properties.length) % properties.length];
  const next = properties[(i + 1) % properties.length];
  const trail = [["Home", "/"], ["Properties", "/properties/"], [p.name, p.url]];
  const flyer = p.avail.find((u) => u.flyer);
  const title = `${p.name} – ${p.city}, ${p.st} | Pantheon Properties`;
  const description = `${p.name}, ${p.city}, ${p.stateName}: ${p.sf}${p.land ? " on " + p.land : ""}${p.ceiling ? ", " + p.ceiling + " ceilings" : ""}. ${p.availLine} Call ${CO.phone}.`;
  const props = [["Building size", p.sf], ["Land area", p.land], ["Ceiling height", p.ceiling], ["Parking", p.parking], ["Loading", p.loading]].filter(([, v]) => v);

  add(p.url, page({
    path: p.url, section: "properties", title, description, ogImage: p.hero,
    extra: [
      { "@type": "WebPage", "@id": abs(p.url) + "#webpage", url: abs(p.url), name: title, isPartOf: { "@id": abs("/#website") }, about: { "@id": abs(p.url) + "#place" }, primaryImageOfPage: { "@type": "ImageObject", url: abs(p.hero) }, dateModified: TODAY, inLanguage: "en-US" },
      {
        "@type": "Place", "@id": abs(p.url) + "#place", name: p.name, description: p.desc,
        address: { "@type": "PostalAddress", streetAddress: p.name, addressLocality: p.city, addressRegion: p.st, addressCountry: "US" },
        image: abs(p.hero),
        additionalProperty: props.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
      },
      crumbNode(trail),
    ],
    body: `${heroPage(trail, p.name, `${p.city}, ${p.stateName}`, `<span class="badge ${p.status === "available" ? "badge--ok" : "badge--off"}">${p.status === "available" ? "Space available" : "Fully leased"}</span>`)}

<section class="section" aria-label="Property details">
  <div class="container">
    <div class="detail-layout">
      <div>
        <div class="prop-hero-img"><img src="${p.hero}" alt="${esc(p.name)} industrial property in ${esc(p.city)}, ${p.stateName}" width="1170" height="658" decoding="async" fetchpriority="high"></div>

        <h2>Property details</h2>
        <dl class="spec-grid">${props.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>

        <h2 style="margin-top:2.5rem">About this property</h2>
        <div class="prose"><p>${esc(p.desc)}</p>${p.note ? `<p>${esc(p.note)}</p>` : ""}</div>

        <h2 style="margin-top:2.5rem">Units and availability</h2>
        <div class="table-wrap">
          <table>
            <caption class="visually-hidden">Units at ${esc(p.name)}</caption>
            <thead><tr><th scope="col">${p.slug === "100-oak-point-avenue" ? "Parcel" : "Unit"}</th><th scope="col" class="num">Size</th><th scope="col">Status</th><th scope="col">Flyer</th></tr></thead>
            <tbody>${p.units.map((u) => `<tr><th scope="row">${esc(u.label)}</th><td class="num">${esc(u.sizeText)}</td><td><span class="badge ${u.avail ? "badge--ok" : "badge--off"}">${u.avail ? "Available" : "Leased"}</span></td><td>${u.flyer ? `<a href="${u.flyer}" rel="noopener">${u.avail ? "Marketing flyer (PDF)" : "Flyer (PDF)"}</a>` : "—"}</td></tr>`).join("")}</tbody>
          </table>
        </div>

        <nav class="prop-nav" aria-label="More properties">
          <a class="text-link text-link--prev" href="${prev.url}">${esc(prev.name)}</a>
          <a class="text-link" href="${next.url}">${esc(next.name)}</a>
        </nav>
      </div>

      <aside class="aside-card" aria-labelledby="inq-title">
        <h2 id="inq-title">${p.status === "available" ? "Inquire about this space" : "Interested in similar space?"}</h2>
        <p>${p.status === "available" ? "Speak with our leasing team about requirements, timing and a visit." : "This property is fully leased. Tell us what you need and we’ll point you to what’s next."}</p>
        <p><a href="tel:${CO.phoneTel}">${CO.phone}</a><br><a href="mailto:${CO.leasing}">${CO.leasing}</a></p>
        <a class="btn btn--primary" href="/contact/?type=leasing&amp;property=${p.slug}">Send an inquiry</a>
        ${flyer ? `<a class="btn btn--ghost" href="${flyer.flyer}" rel="noopener">Download flyer (PDF)</a>` : ""}
      </aside>
    </div>
  </div>
</section>`,
  }));
});

/* ------------------------------------------------------------ MANAGEMENT -- */
const mgmtFaqs = [
  ["What property management services does Pantheon provide?", "Pantheon provides continual and systematic property monitoring and maintenance, value-adding capital improvements, timely response to tenant requests, leasing and marketing services, property maintenance and repair, interior improvements, and energy-efficient retrofits and green construction."],
  ["What financial reporting do property owners receive?", "Owners receive monthly statements of operations, annual operating and cash flow budgets, estimated and reconciled CAM amounts, and monthly, quarterly or annual reports. Reporting also includes institutional-level data such as current rent rolls, cash flow statements, bank reconciliations, general ledgers and receivables."],
  ["How does Pantheon handle tenant delinquencies?", "Pantheon provides frequent updates on tenant delinquencies and recommends legal action only when other efforts have been exhausted, while working to maintain positive tenant relationships. Its approach is fair but always firm."],
];
const mgmtTrail = [["Home", "/"], ["Property Management", "/property-management/"]];
const mgmtServices = ["Continual and systematic property monitoring and maintenance", "Creative and insightful capital improvements that add value", "Timely response to tenant requests", "Leasing and marketing services", "Property maintenance and repair services", "Interior improvements", "Energy-efficient retrofits and green construction"];

add("/property-management/", page({
  path: "/property-management/", section: "management",
  title: "Property Management Services | Pantheon Properties",
  description: "Single-point-of-contact property management for industrial and commercial assets: leasing, maintenance, capital projects and financial reporting.",
  ogImage: UP + "2020/12/management-hero-768x456.jpg",
  extra: [
    { "@type": "WebPage", "@id": abs("/property-management/") + "#webpage", url: abs("/property-management/"), name: "Property Management — Pantheon Properties", isPartOf: { "@id": abs("/#website") }, about: { "@id": abs("/property-management/") + "#service" }, dateModified: TODAY, inLanguage: "en-US" },
    {
      "@type": "Service", "@id": abs("/property-management/") + "#service", name: "Commercial and industrial property management", serviceType: "Property management",
      provider: { "@id": abs("/#organization") }, areaServed: [{ "@type": "State", name: "New Jersey" }, { "@type": "State", name: "New York" }],
      description: "Leasing management, marketing, maintenance, capital improvements and institutional-level financial reporting for industrial and commercial real estate.",
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Property management services", itemListElement: mgmtServices.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })) },
    },
    crumbNode(mgmtTrail),
    faqNode(mgmtFaqs),
  ],
  body: `${heroPage(mgmtTrail, "Property management", "A wide range of services enabling our partners to benefit from a single-point-of-contact real estate resource.")}

<section class="section" aria-labelledby="pm-title">
  <div class="container">
    <div class="split">
      <div>
        <p class="eyebrow">Operations</p>
        <h2 id="pm-title">Property management</h2>
        <div class="answer"><p>We stake our reputation and business on the efficiency we apply to the leasing management, marketing and maintenance of our diverse properties.</p></div>
        <h3 style="margin-top:2rem">Specific services include</h3>
        <ul class="check-list">${mgmtServices.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>
      <div class="media-frame"><img src="${UP}2020/11/property-management.jpg" alt="" width="1170" height="731" loading="lazy" decoding="async"></div>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="fin-title">
  <div class="container">
    <div class="split split--reverse">
      <div>
        <p class="eyebrow">Reporting</p>
        <h2 id="fin-title">Financial services</h2>
        <p class="lead">Efficiently managing property finances can be a full-time endeavor, requiring expert understanding of best practices to achieve significant savings. Pantheon is well-equipped for optimizing our clients’ real estate holdings through proven and proactive methods.</p>
        <p>Our reporting is clear and straightforward, providing all the information a property owner needs to gauge performance. Pantheon delivers comprehensive financial reporting and forecasting:</p>
        <ul class="check-list">
          <li>Monthly statements of operations and annual operating and cash flow budgets</li>
          <li>Estimated and reconciled CAM amounts</li>
          <li>Monthly, quarterly or annual reports</li>
          <li>Rent collection, lease interpretation and enforcement, and accounting services</li>
          <li>Institutional-level data: current rent rolls, cash flow statements, bank reconciliations, general ledgers and receivables</li>
        </ul>
        <p>We also provide frequent updates on tenant delinquencies and recommend legal action only when other efforts have been exhausted, while maintaining positive tenant relationships. Our approach is fair but always firm.</p>
      </div>
      <div class="media-frame"><img src="${UP}2020/11/asset-management-1.jpg" alt="" width="1170" height="731" loading="lazy" decoding="async"></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Questions</p><h2 id="faq-title">Property management FAQ</h2></div>
    ${faqHtml(mgmtFaqs, true)}
  </div>
</section>

${ctaBand("Talk to our property management team", "Ask how Pantheon can manage, lease and report on your industrial or commercial property.")}`,
}));

/* ----------------------------------------------------------------- ABOUT -- */
const aboutTrail = [["Home", "/"], ["About", "/about/"]];
add("/about/", page({
  path: "/about/", section: "about",
  title: "About Pantheon Properties | Leadership Through Integrity",
  description: "Pantheon Properties is a New York–headquartered developer, advisor and property manager led by founder Ken Cohen, with a 24+ year Canyon Capital partnership.",
  ogImage: UP + "2020/12/about-hero-768x456.jpg",
  extra: [
    { "@type": "AboutPage", "@id": abs("/about/") + "#webpage", url: abs("/about/"), name: "About Pantheon Properties", isPartOf: { "@id": abs("/#website") }, about: { "@id": abs("/#organization") }, dateModified: TODAY, inLanguage: "en-US" },
    { "@type": "Person", "@id": abs("/about/#ken-cohen"), name: "Ken Cohen", jobTitle: "Founder, President and CEO", worksFor: { "@id": abs("/#organization") }, image: abs(UP + "2020/11/Ken-Cohen.jpeg"), description: "Founder, President and CEO of Pantheon Properties with more than 36 years in real estate: repositioning, remediating, developing and managing properties across the eastern seaboard." },
    crumbNode(aboutTrail),
  ],
  body: `${heroPage(aboutTrail, "Developers, advisory & brokerage, property management", "New York–headquartered Pantheon Properties has emerged as one of the leading full-service developers of industrial, commercial/office and development projects.")}

<section class="section" aria-labelledby="integrity-title">
  <div class="container">
    <div class="split">
      <div>
        <p class="eyebrow">Our approach</p>
        <h2 id="integrity-title">Leadership through integrity</h2>
        <p class="lead">Pantheon Properties has diverse capabilities which include the acquisition, management and development of new building projects, land and rehabilitation opportunities in New Jersey and the New York metro area.</p>
        <p>Our broad-based expertise in real estate underscores our flexibility and value as a partner for our JV partners, tenants and investors. Over the past decade, we have built an excellent reputation for identifying opportunities and creating value in a variety of real estate ventures and locations, for our own account as well as third parties. Our broker relationships, quality of construction management, and scrupulous attention to the needs of the tenant, community and environment are unsurpassed.</p>
        <p>Our leadership shows in our commitment to partnership, our breadth of services and our delivery of optimal return on investment. Above all, Pantheon prides itself on executing its strategic plan with integrity in every transaction, interaction and approach to new projects.</p>
      </div>
      <div class="media-frame"><img src="${UP}2020/10/pantheon-home-hero-1170x565.jpg" alt="" width="1170" height="565" loading="lazy" decoding="async"></div>
    </div>
  </div>
</section>

<section class="section section--paper" aria-labelledby="partner-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Partners</p><h2 id="partner-title">Leadership through partnership</h2>
      <p class="lead">Pantheon’s partners include Canyon Capital Realty Advisors, SoBro, Turner Impact Capital and the Turner Multifamily Impact Fund.</p></div>
    <div class="grid grid--2">
      <div class="card"><h3>24+ year partnership</h3><p>Pantheon enjoys a 24+ year partnership with Canyon Capital Advisors and has concluded multiple transactions with its affiliate group, The Canyon-Johnson Urban Fund, in the acquisition of urban industrial, office, retail and residential development and redevelopment opportunities.</p></div>
      <div class="card"><h3>Our philosophy is simple</h3><p>By making the real estate process as uncomplicated and accommodating as possible for our tenants, we enable them to focus on and grow their businesses. For our investors, our unwavering commitment to partnership has enabled us to attract a first-class tenant roster, optimize return on investment, and consistently achieve 100 percent occupancy in our properties.</p></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="team-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Leadership</p><h2 id="team-title">Executive team</h2></div>
    <div class="split split--portrait">
      <div class="media-frame" style="aspect-ratio:4/5;max-width:280px;width:100%"><img src="${UP}2020/11/Ken-Cohen.jpeg" alt="Ken Cohen, founder, President and CEO of Pantheon Properties" width="280" height="350" loading="lazy" decoding="async"></div>
      <div>
        <h3>Ken Cohen</h3>
        <p class="eyebrow" style="margin-bottom:1rem">Founder, President &amp; CEO</p>
        <p>Ken Cohen, founder, President and CEO of Pantheon, has been involved in the real estate business for over 36 years, repositioning, remediating, developing and managing properties encompassing millions of square feet throughout the eastern seaboard. His expertise and creativity in property development, management, environmental remediation, energy efficiency and strategic financing are central to Pantheon’s success.</p>
        <a class="text-link" href="/contact/">Meet the team on the Contact page</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--navy" id="tenants" aria-labelledby="ten-title">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Tenants and clients</p><h2 id="ten-title">Tenants and clients, past and present</h2></div>
    <ul class="tenants tenants--full">${tenantsAll.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  </div>
</section>

${ctaBand("Partner with Pantheon", "Whether you need space, a development partner or a property manager, start with a conversation.")}`,
}));

/* --------------------------------------------------------------- CONTACT -- */
const contactTrail = [["Home", "/"], ["Contact", "/contact/"]];
add("/contact/", page({
  path: "/contact/", section: "contact",
  title: "Contact Pantheon Properties | Leasing & Inquiries, New York",
  description: "Contact Pantheon Properties at 119 West 57th Street, New York, NY. Call 212.277.7500 or email leasing@pantheonproperties.com about available industrial space.",
  ogImage: UP + "2020/12/contact-hero-2-768x416.jpg",
  extra: [
    { "@type": "ContactPage", "@id": abs("/contact/") + "#webpage", url: abs("/contact/"), name: "Contact Pantheon Properties", isPartOf: { "@id": abs("/#website") }, about: { "@id": abs("/#organization") }, dateModified: TODAY, inLanguage: "en-US" },
    crumbNode(contactTrail),
  ],
  body: `${heroPage(contactTrail, "Contact us", "Leasing inquiries, property management and partnership opportunities. We respond promptly.")}

<section class="section" aria-label="Contact form and details">
  <div class="container contact-grid">
    <div>
      <h2>Send us a message</h2>
      <form class="form" name="contact" data-contact-form method="post" action="/contact/thank-you/" data-netlify="true" netlify-honeypot="company_website" novalidate>
        <input type="hidden" name="form-name" value="contact">
        <div class="form-row form-row--2">
          <div class="field"><label for="name">Name <span class="req" aria-hidden="true">*</span></label><input id="name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="email">Email <span class="req" aria-hidden="true">*</span></label><input id="email" name="email" type="email" autocomplete="email" required></div>
        </div>
        <div class="form-row form-row--2">
          <div class="field"><label for="company">Company</label><input id="company" name="company" type="text" autocomplete="organization"></div>
          <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>
        </div>
        <div class="form-row form-row--2">
          <div class="field"><label for="type">I’m inquiring about</label>
            <select id="type" name="type"><option value="leasing">Leasing space</option><option value="property-management">Property management</option><option value="acquisitions">Acquisitions &amp; joint ventures</option><option value="other">Something else</option></select></div>
          <div class="field"><label for="property">Property of interest</label>
            <select id="property" name="property"><option value="">Not sure yet / general</option>${properties.map((p) => `<option value="${p.slug}">${esc(p.name)} — ${esc(p.city)}, ${p.st}</option>`).join("")}</select></div>
        </div>
        <div class="field"><label for="size">Approximate space needed (SF)</label><input id="size" name="size" type="text" inputmode="numeric" placeholder="e.g. 15,000"></div>
        <div class="field"><label for="message">Your message <span class="req" aria-hidden="true">*</span></label><textarea id="message" name="message" required></textarea></div>
        <div class="hp" aria-hidden="true"><label for="company_website">Leave this field empty</label><input id="company_website" name="company_website" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="form-status" data-form-status role="status" tabindex="-1" hidden></div>
        <div><button class="btn btn--primary" type="submit">Send message</button></div>
      </form>
    </div>

    <div class="contact-card">
      <h2>Pantheon Properties</h2>
      <address>119 West 57th Street<br>Penthouse South<br>New York, NY 10019<br><a href="https://www.google.com/maps/search/?api=1&amp;query=119+West+57th+Street+New+York+NY+10019" rel="noopener">Open in Google Maps</a></address>
      <h3>Phone</h3><p class="mb-0"><a href="tel:${CO.phoneTel}">${CO.phone}</a> · Fax ${CO.fax}</p>
      <h3>Email</h3><p class="mb-0">General: <a href="mailto:${CO.email}">${CO.email}</a><br>Leasing: <a href="mailto:${CO.leasing}">${CO.leasing}</a></p>
      <h3>Contacts</h3>
      <ul class="people">
        <li><strong>Ken Cohen</strong><span>President &amp; CEO · <a href="tel:+12122777500">212.277.7500</a></span></li>
        <li><strong>Lucas Cohen</strong><span>Executive Vice President · <a href="tel:+12122777505">212.277.7505</a></span></li>
        <li><strong>Marissa Walach</strong><span>Property Manager · <a href="tel:+12122777518">212.277.7518</a></span></li>
      </ul>
    </div>
  </div>
</section>`,
}));

/* ------------------------------------------------------------- thank you -- */
// Shown after the contact form is sent without JavaScript (the form's action). Not indexed.
add("/contact/thank-you/", page({
  path: "/contact/thank-you/", section: "contact", noindex: true,
  title: "Message sent | Pantheon Properties",
  description: "Thank you for contacting Pantheon Properties. Our team will respond shortly.",
  body: `<section class="section notfound"><div class="container">
  <p class="eyebrow">Message sent</p><h1>Thank you</h1>
  <p class="lead" style="margin-inline:auto">Your message has been sent and our team will respond shortly. For anything urgent, call <a href="tel:${CO.phoneTel}">${CO.phone}</a>.</p>
  <div class="btn-row" style="justify-content:center"><a class="btn btn--dark" href="/properties/">View properties</a><a class="btn btn--outline" href="/">Back to home</a></div>
</div></section>`,
}));

/* ------------------------------------------------------------------- 404 -- */
add("/404.html", page({
  path: "/404.html", section: "", noindex: true,
  title: "Page not found | Pantheon Properties",
  description: "The page you were looking for could not be found.",
  body: `<section class="section notfound"><div class="container">
  <p class="eyebrow">Error 404</p><h1>Page not found</h1>
  <p class="lead" style="margin-inline:auto">The page may have moved. Try our properties, or get in touch and we’ll help.</p>
  <div class="btn-row" style="justify-content:center"><a class="btn btn--dark" href="/properties/">View properties</a><a class="btn btn--outline" href="/contact/">Contact us</a></div>
</div></section>`,
}));

/* ----------------------------------------------------------------- write -- */
const writeFile = (rel, content) => {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
};
for (const { path, html } of pages) {
  writeFile(path.endsWith(".html") ? path.slice(1) : join(path.slice(1), "index.html"), html);
}

const indexable = pages.filter((p) => p.path !== "/404.html" && p.path !== "/contact/thank-you/");
const prio = (p) => (p === "/" ? "1.0" : p.startsWith("/property/") ? "0.7" : "0.8");
writeFile("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${TODAY}</lastmod><changefreq>${p.path === "/" || p.path === "/properties/" ? "weekly" : "monthly"}</changefreq><priority>${prio(p.path)}</priority></url>`).join("\n")}
</urlset>
`);

writeFile("robots.txt", `# Pantheon Properties — crawling policy
User-agent: *
Allow: /

# AI search and answer engines are welcome to read and cite this site
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

writeFile("llms.txt", `# Pantheon Properties

> Pantheon Properties is a New York–headquartered developer, advisor, broker and property manager of industrial, commercial/office and land-development real estate in New Jersey and the New York metro area. Founder, President and CEO: Ken Cohen. Address: 119 West 57th Street, Penthouse South, New York, NY 10019. Phone: ${CO.phone}. Leasing: ${CO.leasing}.

## Key pages
- [Home](${SITE}/): Overview, capabilities and available properties
- [Properties](${SITE}/properties/): Full portfolio with specs, unit availability and marketing flyers
- [Property Management](${SITE}/property-management/): Leasing, maintenance, capital improvements and financial reporting
- [About](${SITE}/about/): Leadership, partners (Canyon Capital Realty Advisors, SoBro, Turner Impact Capital) and tenants
- [Contact](${SITE}/contact/): Address, phone, email and inquiry form

## Properties
${properties.map((p) => `- [${p.name}](${abs(p.url)}): ${p.city}, ${p.stateName}. ${p.sf}${p.land ? ", " + p.land : ""}${p.ceiling ? ", " + p.ceiling + " ceilings" : ""}. ${p.availLine}`).join("\n")}
`);

console.log(`Built ${pages.length} pages + sitemap.xml, robots.txt, llms.txt`);
for (const { path, html } of pages) {
  const t = /<title>(.*?)<\/title>/.exec(html)[1].length;
  const d = /name="description" content="(.*?)"/.exec(html)[1].length;
  if (t > 65 || d > 165) console.log(`  length warning ${path}: title ${t}, description ${d}`);
}
