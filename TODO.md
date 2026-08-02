# TODO

Outstanding work on `tegaandhenry.com`. Roughly in the order it should be done.

## 1. Get it into version control

- [ ] `git init`, add a first commit, create the GitHub repository, push `main`
- [ ] Confirm `images/` is genuinely excluded before the first commit
      (`git status --short` should not list it; `git check-ignore -v images/` should
      confirm the rule). Committing an 18 MB binary is hard to undo cleanly.

## 2. Deploy

- [ ] Create the Cloudflare Pages project and connect the GitHub repo — build
      settings in `HOSTING.md` §3
- [ ] Check the `*.pages.dev` URL renders correctly before attaching the domain
- [ ] Add `tegaandhenry.com` as a custom domain; decide whether `www` should
      resolve too, and redirect it if so
- [ ] Confirm HTTPS and that `/sitemap-index.xml` and `/robots.txt` are served

## 3. DNS for the wedding subdomain

- [ ] Point `wedding.tegaandhenry.com` at the Cloud Run service (a separate app —
      see `HOSTING.md` §6)
- [ ] Keep the record **DNS-only / grey cloud** while the Google-managed
      certificate provisions; if proxying later, set SSL/TLS to **Full (strict)**
- [ ] **Do not** add `wedding.tegaandhenry.com` as a custom domain on this Pages
      project — it would take the wedding application offline

## 4. Content

Everything below is one edit to `src/config/site.ts`. No component changes needed.

- [ ] Replace the placeholder `"Hello"` with real copy from Tega and Henry
- [ ] Decide whether to restore `hero.eyebrow` and `hero.strapline` (currently
      empty strings, which hides them)
- [ ] Decide on `contact` — currently an empty array, so no contact links render
- [ ] Confirm the footer `weddingLink` should stay (set to `null` to remove it,
      e.g. once the wedding has passed)
- [ ] Confirm `description` — it feeds the `<meta>` tag and the Open Graph card
- [ ] Consider a personal photograph in place of the stock Unsplash hero. If it
      changes: replace `src/assets/hero-winelands.jpg`, update `hero.imageAlt` and
      `photoCredit`, and regenerate `public/images/og-home.jpg` (command in
      `README.md`)

## 5. Polish

- [ ] Check the Open Graph card actually renders — paste the URL into WhatsApp,
      iMessage and a social preview debugger
- [ ] Review the `T&H` monogram favicon at 16px; the two rings may need dropping
      at that size
- [ ] Run Lighthouse against the deployed site
- [ ] Test the light/dark toggle on a real iOS device (the no-flash inline script
      is the fragile part)

## 6. Maintenance

- [ ] Astro 5.18 is installed; 7.x is available. Not urgent for a two-page static
      site, but worth doing on a quiet day: `npx @astrojs/upgrade`
- [ ] `@astrojs/tailwind` v6 is deprecated in favour of the Tailwind 4 Vite
      plugin. Matches `jeansy.org` today, so leave it — but the two sites should
      migrate together when they do
- [ ] `npm audit` reports vulnerabilities in the dev toolchain. Nothing ships to
      the browser from those packages, but check before assuming so
- [ ] Keep the originals in `images/` backed up outside the repo — they are
      gitignored, so a clean clone cannot regenerate them
