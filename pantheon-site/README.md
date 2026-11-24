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
assets/media/                   Property/team photos and PDF flyers
sitemap.xml  robots.txt  llms.txt
tools/build.mjs                 Optional generator (node tools/build.mjs) that rewrites every page from one data block
```

Preview locally with a server (paths are root-relative): `python3 -m http.server 8000`, then open http://localhost:8000.

## Before launch (items that need your input)

1. **Contact form email notifications.** The contact form uses Netlify Forms (form name `contact`). Submissions are stored in the Netlify dashboard under Forms, spam-filtered automatically, and visitors land on `/contact/thank-you/` if JavaScript is off. To get each inquiry by email, add an email notification for the `contact` form. The recipient must be a member of your Netlify team.
2. **Logo and images.** Everything is self-hosted. The logo is your original design redrawn as a vector (`assets/img/`), and all property/team photos and marketing flyers were copied from the old WordPress uploads folder into `assets/media/`, so nothing depends on WordPress anymore.
3. **Confirm availability.** 280 Wilson Avenue says "Fully Leased" on the live site, but its unit table lists Unit C (26,545 SF) as available. This build shows it as leased. Update the `units`/`status` data if that's wrong.
4. **Tenant names** were derived from the logo file names on the live site. Confirm spellings and that you want them listed.
5. **Property descriptions** for properties other than 401 and 201 Penhorn were written from the live spec data only. Review them.
6. **Hacked content.** The live site contains injected "pokies"/casino spam links. Do not migrate the WordPress database. They already return **410 Gone** on the new site (see below). After cutover, request their removal in Google Search Console.

## Redirects and spam URLs

Redirects from the old WordPress site live in `_redirects` (in this folder). Netlify applies them automatically on every deploy, and the generator never overwrites the file.

- **Spam pages** (the injected "pokies"/casino posts and the `/news/` page that listed them) return **410 Gone** with the normal "Page not found" page, so Google drops them.
- **Old pages that moved** 301 to their closest new page: `/advisory-brokerage/` and `/team_members/*` → `/about/`, `/tenants/*` → the tenants list on `/about/`, `/property-search/`, `/property/` and the type/city/state/street listing pages → `/properties/`. Street pages for a single building go straight to that building.
- **Old flyer and photo links** (`/wp-content/uploads/...`) 301 to the same file under `/assets/media/`. When you upload a new flyer, keep the year/month folder structure and old links keep working.

Old property URLs (`/property/<slug>/`) are unchanged and need no redirect. To add a redirect, add a line `<old path>  <new path>  301` above the wildcard (`*`) rules in its section.

## How to add or replace photos and flyers

1. On GitHub, open `pantheon-site/assets/media/` and choose **Add file → Upload files**. Drag in the photo (JPG/WebP) or flyer (PDF) and commit. Netlify redeploys automatically.
2. Point the page at it with a root-relative path, e.g. `<img src="/assets/media/2026/01/new-photo.jpg">` or `<a href="/assets/media/2026/01/flyer.pdf">`. If you use the generator, set the property's `img`/`hero` or unit flyer to `UP + "2026/01/new-photo.jpg"` and re-run it.
3. Keep file names lowercase with hyphens and no spaces. Resize photos to about 2000 px wide (under ~500 KB) before uploading.

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
- Add security headers at the host (HSTS, `X-Content-Type-Options`, a Content-Security-Policy).
- Update third-party listings (LinkedIn, broker directories) so name, address and phone match exactly.
- Re-check availability data monthly; stale space is the main trust risk for this kind of site.
- Test the site in ChatGPT, Perplexity and Google AI Overviews with queries like "industrial space Secaucus NJ" and note whether Pantheon is cited.
