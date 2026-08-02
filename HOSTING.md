# Hosting on Cloudflare Pages

Deployment works exactly as jeansy.org does: Cloudflare watches the GitHub
repository, builds on every push to `main`, and serves the result.

## Current state

- [x] `main` pushed to
  [`rjeans/tegaandhenry.com`](https://github.com/rjeans/tegaandhenry.com) (public)
- [x] Pages project `tegaandhenry-com` created through the dashboard Git flow;
  `wrangler pages project list` reports `Git Provider: Yes`
- [x] Live at **https://tegaandhenry-com.pages.dev** — every push to `main`
  rebuilds, and every other branch gets its own preview URL
- [ ] Custom domain `tegaandhenry.com` — not yet attached

## A note on Direct Upload

A `tegaandhenry` project was briefly created with `wrangler pages project create`
and then deleted. That matters, because the choice is permanent:

> If you choose Direct Upload, you cannot switch to Git integration later. You will
> have to create a new project with Git integration to use automatic deployments.
> — [Cloudflare docs](https://developers.cloudflare.com/pages/get-started/direct-upload/)

So **do not create this project with wrangler.** `wrangler pages project create`
and a first `wrangler pages deploy` both produce a Direct Upload project, locking
out the Git integration and PR previews for that project's lifetime. The project
must be created through the dashboard Git flow. Wrangler is still useful afterwards
for a manual emergency deploy, but it must not be what creates the project.

The same lock applies in reverse: a Git-integrated project cannot switch to Direct
Upload.

## Connect to Git

This is dashboard-only. It installs the Cloudflare Pages GitHub App, which is an
OAuth consent flow with no CLI or API equivalent.

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** →
   **Create** → **Pages** tab → **Connect to Git**.
2. Authorise GitHub and select the `tegaandhenry.com` repository. If it is not
   listed, the Cloudflare GitHub App is scoped to selected repositories — use the
   link to grant it access to this one.
3. Apply the build settings below, then **Save and Deploy**.

Afterwards `wrangler pages project list` should show `Git Provider: Yes`, matching
`jeansy-org`. If it shows `No`, the project was created the wrong way — delete it
and redo step 1.

## Build settings

| Setting | Value |
| --- | --- |
| Project name | `tegaandhenry-com` |
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Deploy command | *(leave empty)* |
| Build output directory | `dist` |
| Root directory | `/` (leave empty) |
| Builds for non-production branches | All non-Production branches |

The project name feeds the `*.pages.dev` subdomain and cannot contain dots, so
Cloudflare derived `tegaandhenry-com` from the repository name. The site is
therefore served at **https://tegaandhenry-com.pages.dev**, and `wrangler.toml`
must carry that exact name or a manual `wrangler pages deploy` will miss.

**Deploy command must stay empty.** It is a Workers field that the unified builds
UI also shows for Pages. Pages uploads the build output directory itself, so a
deploy command is redundant at best. Note `jeansy.org`'s `HOSTING.md` lists
`npm run build` here — that is wrong, and merely runs its build twice. Setting
`wrangler pages deploy` would be worse: competing deployments on every push.

**Builds for non-production branches** is what produces preview deployments, one
URL per branch, which is the main reason for using the Git integration rather than
GitHub Actions. Setting it to *None* discards that. The free plan allows 500 builds
a month, far beyond anything this site will use. If automated dependency PRs later
become noisy, the custom option supports include `*` with exclude `dependabot/*`.

No environment variables and no compatibility flags are needed — the site is fully
static, so there is no Worker runtime involved. `wrangler.toml` in the repo already
declares `pages_build_output_dir = "./dist"`, which is what lets a manual
`npx wrangler pages deploy` run with no arguments.

## Custom domain

1. Add `tegaandhenry.com` as a zone in Cloudflare DNS and point the registrar's
   nameservers at Cloudflare.
2. In the Pages project → **Custom domains** → **Set up a custom domain** →
   `tegaandhenry.com`. Repeat for `www.tegaandhenry.com` if you want it.
3. Cloudflare creates the DNS records and issues the certificate itself.

## The wedding subdomain

`wedding.tegaandhenry.com` is **not** part of this project. It is the separate
Next.js wedding application on Cloud Run, and it must stay that way — this repo is
public and static, that one is authenticated.

In the same Cloudflare DNS zone, add a record for `wedding` pointing at the Cloud
Run service (a `CNAME` to the Cloud Run domain mapping, or the mapping records
Google supplies). Two things to watch:

- **Proxy status.** Cloud Run domain mappings manage their own certificate. Add the
  record **DNS-only** (grey cloud) while the Google-managed certificate is
  provisioning; only turn the orange cloud on afterwards if you actually want
  Cloudflare in front, and then set SSL/TLS mode to **Full (strict)** — anything
  less will break or downgrade the connection.
- **Do not** add `wedding.tegaandhenry.com` as a custom domain on this Pages
  project. That would route the subdomain to the static site and take the wedding
  application offline.

The only link between the two sites is the quiet footer entry driven by
`weddingLink` in `src/config/site.ts`.

---

**Cost:** free tier is ample — two HTML pages and a handful of images.
**Included:** automatic HTTPS and the global CDN. Preview deployments and
build-on-push are *not* included today — see "Optional: make pushes deploy
automatically" above.
