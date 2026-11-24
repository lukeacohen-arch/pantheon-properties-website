# Pantheon Properties — static site (HTML + CSS)

Plain HTML, one stylesheet, one small deferred script. No frameworks, no external fonts, no build step required.

## Structure

```
index.html                      Home
properties/index.html           Portfolio, available-space table, filters
property/<slug>/index.html      One page per property (same URLs as the live WordPress site)
property-management/index.html
about/index.html
contact/index.html
404.html
assets/css/styles.css           Design system (tokens at the top) + components
assets/js/main.js               Mobile nav, property filters, contact form (all optional enhancements)
assets/img/                     favicon.svg, logo.svg
sitemap.xml  robots.txt  llms.txt
tools/build.mjs                 Optional generator (node tools/build.mjs) that rewrites every page from one data block
```

Preview locally with a server (paths are root-relative): `python3 -m http.server 8000`, then open http://localhost:8000.

## Before launch (items that need your input)

1. **Contact form endpoint.** The form action is a placeholder (`https://formspree.io/f/YOUR_FORM_ID`). Until it is replaced, the form opens the visitor's email app addressed to leasing@pantheonproperties.com. Swap in Formspree, Netlify Forms, or your own handler.
2. **Logo and images.** The logo is now your original design redrawn as a vector (`assets/img/logo.svg`, `logo-white.svg`, favicon and apple-touch icon are all self-hosted). Only the property/team photos and the marketing flyers are still loaded from the live WordPress uploads folder. Self-host those before WordPress goes away.
3. **Confirm availability.** 280 Wilson Avenue says "Fully Leased" on the live site, but its unit table lists Unit C (26,545 SF) as available. This build shows it as leased. Update the `units`/`status` data if that's wrong.
4. **Tenant names** were derived from the logo file names on the live site. Confirm spellings and that you want them listed.
5. **Property descriptions** for properties other than 401 and 201 Penhorn were written from the live spec data only. Review them.
6. **Hacked content.** The live site contains injected "pokies"/casino spam links. Do not migrate the WordPress database. After cutover, make those URLs return **410 Gone** (see below) and request removal in Google Search Console.

## Redirects and spam URLs

Old property URLs are preserved (`/property/<slug>/`), so no redirects are needed for them. Add 410s for the spam pages, e.g. on Netlify (`_redirects`):

```
/australian-pokies-at-casino-2024/  /  410
/hack-au-pokies-2024/               /  410
/win-cash-safe-pokies/              /  410
/free-winning-pokies-machines/      /  410
/tax-free-pokies-with-bonus-that-pay-cash/  /  410
/popular-pokies-tricks-to-win/      /  410
/batman-hill-pokies/                /  410
/real-money-pokies-2024/            /  410
/aus-money-accepted-aristocrat-pokies/  /  410
/slot-machines-in-anaheim-au/       /  410
/news/                              /  301
```

On Apache: `Redirect gone /hack-au-pokies-2024/` (one line per URL).

## How to add or update a property

- With the generator: add an object to the `properties` array in `tools/build.mjs`, then run `node tools/build.mjs`. The cards, available-space table, sitemap, llms.txt, schema and footer all update.
- By hand: copy any folder in `property/`, rename it, edit the content and JSON-LD, add it to `properties/index.html`, `sitemap.xml` and `llms.txt`.
- Leasing a unit: set its `U(...)` flag to not available and re-run the build.

## 30-day post-launch checklist

- Verify the domain in Google Search Console, submit `sitemap.xml`, and request indexing for the home and property pages.
- Request removal of the spam URLs and confirm they return 410.
- Claim/update the Google Business Profile (address, phone, categories, link to the new site) and Bing Places.
- Validate structured data (Rich Results Test and validator.schema.org) on home, a property page and Property Management.
- Run PageSpeed Insights and Lighthouse on mobile; target 95+ on all four scores once images are self-hosted and compressed (WebP/AVIF with width/height).
- Set up GA4 or a privacy-friendly analytics tool, plus conversion events for form submit, phone taps and flyer downloads.
- Add security headers at the host (HSTS, `X-Content-Type-Options`, a Content-Security-Policy that allows your form endpoint).
- Update third-party listings (LinkedIn, broker directories) so name, address and phone match exactly.
- Re-check availability data monthly; stale space is the main trust risk for this kind of site.
- Test the site in ChatGPT, Perplexity and Google AI Overviews with queries like "industrial space Secaucus NJ" and note whether Pantheon is cited.
