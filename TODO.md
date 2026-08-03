# TODO

> **⚠ This project no longer serves `tegaandhenry.com`.** As of 2026-08-03 the
> wedding application serves the apex directly (wedding repo, ADR-020). The
> deploy and DNS sections below are superseded — the only outstanding work here
> is retiring the domain from this project. See "Retirement" in `GEMINI.md`.

## 0. Retirement (do this first)

- [ ] **Remove `tegaandhenry.com` from this Pages project's custom domains.**
      While it is attached here, whichever DNS record wins decides which site
      guests reach — and this one has no RSVP.
- [ ] Point the apex DNS at the wedding application's Cloud Run service.
- [ ] Verify: apex serves the hero + names + date + "Already invited? Sign in",
      and a household invite link resolves.
- [ ] Decide whether to keep the Pages project (free, and a reasonable starting
      point for a post-wedding personal site) or delete it.

---

Everything below predates the change and is kept for reference only.

Outstanding work on `tegaandhenry.com`. Roughly in the order it should be done.

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

## 3. DNS for the wedding subdomain

**Under review.** This site now stands in for the full wedding site, so whether
`wedding.tegaandhenry.com` is still wanted is an open question. Everything in this
section assumes the original two-site split and should be confirmed before acting.

- [ ] Point `wedding.tegaandhenry.com` at the Cloud Run service (a separate app —
      see "The wedding subdomain" in `HOSTING.md`)
- [ ] Keep the record **DNS-only / grey cloud** while the Google-managed
      certificate provisions; if proxying later, set SSL/TLS to **Full (strict)**
- [ ] **Do not** add `wedding.tegaandhenry.com` as a custom domain on this Pages
      project — it would take the wedding application offline

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
