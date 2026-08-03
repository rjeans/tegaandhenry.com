# GEMINI.md

Context for AI coding sessions working in this repository.

> ## ⚠ SUPERSEDED — this site no longer serves the apex domain
>
> As of 2026-08-03 the **wedding application serves `tegaandhenry.com`
> directly** (wedding repo, ADR-020): public landing page, household RSVP
> links, guest sign-in and admin console, all on one origin. There is no
> longer a `wedding.` subdomain.
>
> That application's landing page renders from Firestore `content` and
> `theme`, so the couple edit the words, the photograph and the palette from
> the console with no deploy — which this site could not do.
>
> **Do not point this project at the apex domain**, and do not resume work
> here expecting it to be the live site. It is kept as reference and as a
> possible post-wedding home. See "Retirement" below.

## What this WAS

The permanent, public home page for the apex domain — a single-page Astro
site, statically built, served from Cloudflare Pages, intended to outlive the
wedding.

It is deliberately tiny: a hero photograph, the couple's name, and one line of
copy. Resist the urge to grow it. Sections get added when there is something real
to put in them, not before.

## What this is NOT

**This repo is not the wedding site.** The wedding is a completely separate
application:

| | This repo | The wedding site |
| --- | --- | --- |
| Where | `~/Development/tegaandhenry.com` | `~/Development/wedding` |
| Stack | Astro 5, static | Next.js 15 App Router, Firestore, Firebase Auth |
| Host | Cloudflare Pages | Cloud Run |
| Domain | none (retired) | `tegaandhenry.com` |
| Access | n/a | Public landing page; RSVP behind a household token or a signed-in session |

There is currently **no link between them at all**: `weddingLink` in
`src/config/site.ts` is `null`, because this site is for now standing in for the
full wedding site. Do not import code, config, or content between the two, and do
not reinstate the link without being asked.

Note that the wedding repo is a **generic, content-free engine** with a hard rule
against couple names or PII appearing anywhere in its source. This repo is the
opposite — it is the couple's actual site and their names belong here. Never
"helpfully" copy content from here into `~/Development/wedding`; that breaks its
CI content-leak scan and is treated as a build failure there.

Structurally this site is a sibling of `~/Development/jeansy.org` (same author,
same Astro + Tailwind + Cloudflare Pages shape). Look there for precedent before
inventing a new pattern.

## Hard rules

- **All copy lives in `src/config/site.ts`.** Pages and layouts contain structure
  only. Never hardcode a user-facing string into a `.astro` file. Empty-string and
  empty-array fields are already wired to hide their elements — use them rather
  than deleting markup.
- **All colour lives in the CSS custom properties** at the top of
  `src/layouts/BaseLayout.astro`, with a dark-mode counterpart for every token.
  Never introduce a raw hex value in a component.
- **Keep `output: 'static'`.** No adapter, no SSR, no Worker runtime. If a feature
  seems to need a server, say so explicitly and get a decision before adding
  `@astrojs/cloudflare` — that change has real operational cost for a site that
  currently has none.
- **Never add `tegaandhenry.com` (or any subdomain of it) as a custom domain on
  this Pages project.** The apex now points at the wedding application on Cloud
  Run; claiming it here would take the live site — landing page, RSVP links and
  console — offline in one step.
- **Respect the contrast decisions.** `--muted` is intentionally darker than the
  wedding engine's brand muted (`#7d8273`, only 3.75:1 on cream — below AA for
  body text); the original is kept as `--muted-soft` for large/decorative use.
  Links use `#2f6b2c` (6.0:1) because `--primary` is only 3.3:1 and is for accents,
  never small text. Do not "restore the brand colours" over these.
- **Do not commit the full-resolution originals in `images/`.** They are
  gitignored on purpose (~18 MB each; git stores binaries whole). The build reads
  only the 2560px master in `src/assets/`. If a large-image workflow ever becomes
  necessary, use Git LFS rather than un-ignoring the directory.
- **Do not commit secrets.** There are none today and there should be none — this
  is a static public site with no API keys or environment variables.

## Layout

```
src/config/site.ts             every string and outbound link
src/layouts/BaseLayout.astro   palette tokens, dark mode, header, footer, SEO meta
src/pages/index.astro          hero + intro
src/pages/404.astro
src/assets/                    2560px web master — what the build actually reads
public/images/og-home.jpg      1200x630 Open Graph card
images/                        full-res originals; gitignored, never built from
astro.config.mjs               static output, sitemap, tailwind
wrangler.toml                  pages_build_output_dir = "./dist"
```

## Commands

```
npm install
npm run dev       # http://localhost:4321, hot reload
npm run build     # static build into dist/
npm run preview   # serve dist/ locally
npx astro check   # typecheck; must be 0 errors, 0 warnings, 0 hints
```

## Definition of done

1. `npx astro check` clean — zero errors, warnings and hints.
2. `npm run build` succeeds.
3. Any new copy added to `src/config/site.ts`, not to a component.
4. Any new colour added as a token with a dark-mode counterpart.
5. Verified in both light and dark, at desktop and mobile widths.
6. `README.md` updated if the palette, image pipeline, or structure changed;
   `HOSTING.md` updated if deployment or DNS behaviour changed.

## Retirement

The site builds and renders correctly; it simply is not the live site any more.

To retire it cleanly: remove the custom domain from the Cloudflare Pages
project, then point the apex DNS at the wedding application's Cloud Run
service. Leaving the domain attached here is the dangerous state — whichever
DNS record wins decides which site guests reach, and this one has no RSVP.

Keep or delete the Pages project as you prefer. It costs nothing to keep, and
it remains a reasonable starting point for a post-wedding personal site once
the wedding application is no longer wanted at the apex.
