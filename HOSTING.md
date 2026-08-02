# Hosting on Cloudflare Pages

Same shape as the jeansy.org deployment: connect the repo, let Cloudflare build on
every push to `main`, attach the custom domain.

## Stage 1: Push the repository

Create a GitHub repository (`tegaandhenry`) and push `main`.

## Stage 2: Connect to Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Compute (Workers)** → **Workers & Pages** → **Pages** tab → **Connect to Git**.
3. Authorise GitHub and pick the `tegaandhenry` repository.

## Stage 3: Build settings

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

## Stage 4: Deploy

**Save and Deploy.** You get a `tegaandhenry.pages.dev` URL. Check it before
attaching the domain.

## Stage 5: Custom domain

1. Add `tegaandhenry.com` as a zone in Cloudflare DNS and point the registrar's
   nameservers at Cloudflare.
2. In the Pages project → **Custom domains** → **Set up a custom domain** →
   `tegaandhenry.com`. Repeat for `www.tegaandhenry.com` if you want it.
3. Cloudflare creates the DNS records and issues the certificate itself.

## Stage 6: The wedding subdomain

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

## Auto-deploy

Every push to `main` rebuilds and deploys. Pull requests get preview deployments on
their own URLs.

---

**Cost:** free tier is ample — two HTML pages and a handful of images.
**Included:** automatic HTTPS, global CDN, preview deployments.
