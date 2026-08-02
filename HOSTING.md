# Hosting on Cloudflare Pages

## Current state

The site is **live at https://tegaandhenry.pages.dev** via *direct upload*, not via
the Git integration. This differs from jeansy.org — read the next section before
assuming a push deploys anything.

- [x] `main` pushed to
  [`rjeans/tegaandhenry.com`](https://github.com/rjeans/tegaandhenry.com) (public)
- [x] Pages project `tegaandhenry` created (`wrangler pages project create`)
- [x] First deployment uploaded and verified
- [ ] Custom domain `tegaandhenry.com` — not yet attached

## How deploys currently happen

Manually, from a working copy:

```
npm run build
npx wrangler pages deploy
```

`wrangler.toml` declares `pages_build_output_dir = "./dist"`, so no arguments are
needed. Authentication is the OAuth session from `npx wrangler login`, stored in
`~/Library/Preferences/.wrangler/`.

**Pushing to `main` deploys nothing.** There is no `.github/workflows` and no Git
integration. `wrangler pages project list` shows `Git Provider: No` for this
project, against `Yes` for `jeansy-org`.

## Optional: make pushes deploy automatically

Two mutually exclusive routes. Do not do both — they would race on every push.

**A. Cloudflare Pages Git integration** (what jeansy.org uses). Cloudflare builds
server-side and gives PR preview URLs for free. Dashboard only, because it needs a
GitHub OAuth app install that has no API equivalent:

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** →
   the `tegaandhenry` project → **Settings** → **Builds** → connect to Git.
2. Pick the `tegaandhenry.com` repository, then use the build settings below.

**B. GitHub Actions + `wrangler pages deploy`.** Needs `CLOUDFLARE_API_TOKEN` (a
custom token with `Account → Cloudflare Pages → Edit`) and `CLOUDFLARE_ACCOUNT_ID`
as repository secrets. No PR previews unless a second workflow adds them, and the
token needs rotating. Note the `gh` CLI token here lacks the `workflow` scope, so
workflow files must be pushed over the SSH remote.

## Build settings

| Setting | Value |
| --- | --- |
| Project name | `tegaandhenry` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (leave empty) |

No environment variables and no compatibility flags are needed — the site is fully
static, so there is no Worker runtime involved. `wrangler.toml` in the repo already
declares `pages_build_output_dir = "./dist"`.

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
