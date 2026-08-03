# GEMINI.md

Context for AI coding sessions working in this repository.

> ## ⚠ This site is live, and a handover is planned
>
> **Right now this project serves `tegaandhenry.com`.** The apex is attached to
> the `tegaandhenry-com` Pages project and returns this site. Verify before
> acting on anything below:
>
> ```
> npx wrangler pages project list
> curl -s https://tegaandhenry.com/ | grep '<title>'
> ```
>
> **Planned:** under ADR-020 in the wedding repository, the wedding application
> will take `tegaandhenry.com` directly — landing page, household RSVP links,
> guest sign-in and admin console on one origin. That application renders its
> landing page from Firestore `content` and `theme`, so the couple can edit the
> words, the photograph and the palette from the console with no deploy, which
> this site cannot do. There is no `wedding.` subdomain and none is planned.
>
> **The handover has not happened, and is not to be carried out yet** — it waits
> on the wedding application being ready. Until then, do not detach the apex from
> this project: doing so takes the live site off the internet.
>
> **After the wedding**, this repo is intended to take the apex back as the
> couple's long-term personal page. It is not a dead project.

## What this is

The public home page for `tegaandhenry.com` — a single-page Astro site,
statically built, served from Cloudflare Pages, intended to outlive the wedding.

It is deliberately tiny: a hero photograph, the couple's name, and two short
paragraphs of holding copy. Resist the urge to grow it. Sections get added when
there is something real to put in them, not before.

## What this is NOT

**This repo is not the wedding site.** The wedding is a completely separate
application:

| | This repo | The wedding site |
| --- | --- | --- |
| Where | `~/Development/tegaandhenry.com` | `~/Development/wedding` |
| Stack | Astro 5, static | Next.js 15 App Router, Firestore, Firebase Auth |
| Host | Cloudflare Pages | Cloud Run |
| Domain | `tegaandhenry.com` (until the handover) | none yet |
| Access | Public | Public landing page; RSVP behind a household token or a signed-in session |

There is **no link between them**: `weddingLink` in `src/config/site.ts` is
`null`, so the header nav item, the footer entry and the linked phrase in the
intro copy are all absent. This site stands in for the wedding site until that
application is ready. Do not import code, config, or content between the two, and
do not reinstate the link without being asked.

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
- **Do not detach `tegaandhenry.com` from this Pages project.** It is attached
  here and serving; removing it takes the live site off the internet. The handover
  to the wedding application is planned but deliberately not yet done — see the
  notice at the top. Equally, do not add further hostnames without being asked.
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
wrangler.toml                  project name + pages_build_output_dir = "./dist"
```

`wrangler.toml`'s `name` must stay `tegaandhenry-com`, matching the Pages project
Cloudflare derived from the repository name. If it drifts, a manual
`npx wrangler pages deploy` targets a project that does not exist and offers to
create one — which would be a Direct Upload project, permanently unable to use the
Git integration. There is no `.github/workflows`: Cloudflare builds on push.

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

## The planned handover — not yet

When the wedding application is ready, the apex moves to it. **Do not start
this without being asked.** The order matters:

1. Remove `tegaandhenry.com` from this project's custom domains.
2. Point the apex DNS at the wedding application's Cloud Run service.
3. Verify the apex serves the wedding landing page and that a household invite
   link resolves.

Doing (2) before (1) leaves the domain claimed in two places, and whichever
record wins decides which site guests reach — this one has no RSVP.

Keep the Pages project through the handover. After the wedding the intention is
to reverse the move and have this site serve the apex again as the couple's
long-term personal page, at which point the project and its build pipeline are
wanted intact.
