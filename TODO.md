# TODO

Outstanding work on `tegaandhenry.com`. Roughly in the order it should be done.

> **This site is live at the apex.** Sections 1 and 2 are done; the deployment
> works and `tegaandhenry.com` is attached to this Pages project. Section 0 below
> is *planned, not pending* — do not act on it without being asked.

## 0. Handover to the wedding application — blocked, deliberately

Waiting on the wedding application being ready (wedding repo, ADR-020). It will
take the apex directly; there is no `wedding.` subdomain and none is planned.
After the wedding the apex is intended to come back here.

- [ ] Remove `tegaandhenry.com` from this Pages project's custom domains — **do
      this before the DNS change**, not after. While it is claimed in two places,
      whichever record wins decides which site guests reach, and this one has no
      RSVP.
- [ ] Point the apex DNS at the wedding application's Cloud Run service
- [ ] Verify the apex serves the wedding landing page and that a household invite
      link resolves
- [ ] Keep the Pages project — it is wanted for the move back after the wedding

## 1. Get it into version control

- [x] `git init`, add a first commit, create the GitHub repository, push `main` —
      now at `rjeans/tegaandhenry.com` (public)
- [x] Confirm `images/` is genuinely excluded before the first commit —
      `git check-ignore -v images/` reports `.gitignore:15`, `git ls-files images/`
      is empty, and `.git` is 1.9 MB

## 2. Deploy

- [x] **Create the Pages project via the dashboard Git flow** — done, project is
      `tegaandhenry-com`, `Git Provider: Yes`. Do *not* use `wrangler pages
      project create`: that makes a Direct Upload project, which can never be
      switched to the Git integration.
- [x] Verify the deployment — `/` serves 200, `/robots.txt` and
      `/sitemap-index.xml` 200, unknown paths 404, canonical and `og:url` point
      at `tegaandhenry.com`
- [x] **Apex DNS** — `tegaandhenry.com` is live and the custom domain reports
      `active`, with a valid certificate
- [x] **Push-to-deploy works** — confirmed by a deployment carrying
      `deployment_trigger.type: github:push`, built within ~20s of the push.
      Earlier deployments were `ad_hoc` and predate the fix.
- [ ] Decide whether `www.tegaandhenry.com` should resolve, and redirect it if so
- [ ] Consider blocking indexing of `tegaandhenry-com.pages.dev` — `robots.txt`
      is `Allow: /`, so the placeholder copy is crawlable. Canonical tags already
      point at `tegaandhenry.com`, which limits the damage.

## 3. DNS for the wedding subdomain — dropped

The `wedding.` subdomain plan has been abandoned in favour of the wedding
application taking the apex directly (section 0). `wedding.tegaandhenry.com` has
no DNS record and none is to be created. Nothing to do here.

## 4. Content

Everything below is one edit to `src/config/site.ts`. No component changes needed.

- [ ] Replace the holding copy in `intro.body` with real words from Tega and
      Henry. It currently says only that the site is being put together, which
      is safe to leave up but says nothing.
- [ ] Decide whether to restore `hero.eyebrow` and `hero.strapline` (currently
      empty strings, which hides them)
- [ ] Decide on `contact` — currently an empty array, so no contact links render
- [x] `weddingLink` is `null` — no nav item, no footer entry, and `Wedding in
      2028` renders as plain text rather than a link
- [ ] Confirm `description` — it feeds the `<meta>` tag and the Open Graph card
- [ ] Consider a personal photograph in place of the stock Unsplash hero. If it
      changes: replace `src/assets/hero-winelands.jpg`, update `hero.imageAlt` and
      `photoCredit`, and regenerate `public/images/og-home.jpg` (command in
      `README.md`)

## 5. Polish

- [ ] Check the Open Graph card actually renders — paste the URL into WhatsApp,
      iMessage and a social preview debugger
- [ ] **The giraffe favicon does not survive 16px.** It is traced line art —
      thin strokes over mostly empty space — so at true tab size it renders as a
      pale smudge rather than a mark. Rendering `public/favicon.svg` at 16px and
      32px shows this plainly. Either ask the designer for a simplified,
      heavier-weight emblem drawn for small sizes, or restore the previous
      hand-drawn monogram favicon (`git show d98614a:public/favicon.svg`), which
      was built for it and weighed 525 bytes. The hero logo is unaffected and
      reads well.
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
