# Hosting on Cloudflare Pages

Deployment works exactly as jeansy.org does: Cloudflare watches the GitHub
repository, builds on every push to `main`, and serves the result.

## Current state

- [x] `main` pushed to
  [`rjeans/tegaandhenry.com`](https://github.com/rjeans/tegaandhenry.com) (public)
- [x] Pages project `tegaandhenry-com` created through the dashboard Git flow;
  `wrangler pages project list` reports `Git Provider: Yes`
- [x] Live at **https://tegaandhenry.com** and
  **https://tegaandhenry-com.pages.dev**, custom domain `active` with a valid
  certificate
- [x] Push-to-deploy works — confirmed by a deployment carrying
  `deployment_trigger.type: github:push`, built within ~20 seconds of the push
- [ ] `www.tegaandhenry.com` — not configured; still a decision

## If builds stop triggering

This failed once during setup and is worth recognising. The symptom is that
pushes land on GitHub but no build starts, and every deployment in the list reads
`deployment_trigger.type: ad_hoc` rather than `github:push`:

```
npx wrangler pages deployment list --project-name tegaandhenry-com
```

The cause was on the GitHub App side, not the Pages project — Cloudflare could
*read* the repository (it fetched a just-pushed commit on demand) while push
*events* never reached it. Check GitHub → **Settings** → **Applications** →
**Cloudflare Pages** → **Configure**, and confirm this repository is in its access
list; an app scoped to selected repositories will not include one created after it
was installed.

A deployment can be forced meanwhile:

```
curl -X POST -H "Authorization: Bearer $CF_TOKEN" \
  ".../pages/projects/tegaandhenry-com/deployments" -F "branch=main"
```

Do **not** work around it with `wrangler pages deploy` — Direct Upload
deployments into a Git-connected project are a different mechanism and muddy the
deployment history.

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

The zone `tegaandhenry.com` is already active in the account on the
`kevin`/`lindsey` nameservers, so no registrar work is needed.

`tegaandhenry.com` is attached to the Pages project, status `active`, serving over
HTTPS with a certificate issued for the apex. The record is:

| Field | Value |
| --- | --- |
| Type | `CNAME` |
| Name | `@` (i.e. `tegaandhenry.com`) |
| Target | `tegaandhenry-com.pages.dev` |
| Proxy status | **Proxied** (orange cloud) |

Cloudflare flattens the apex CNAME automatically, so this is valid at the root
despite what the DNS spec would otherwise allow.

One trap if this is ever redone: adding a custom domain through the **REST API**
registers the hostname but does *not* create the DNS record, leaving the domain
stuck at `pending` with no certificate. The dashboard flow does both. Add the
record by hand if the API route is used.

`www.tegaandhenry.com` has no DNS record and does not resolve. To change that, add
it as a second custom domain and redirect it to the apex with a redirect rule.

Note the certificate authority for this domain is Google, not Cloudflare — that is
simply which CA the Pages certificate pipeline picked, and needs no action.

## The planned handover of the apex

There is **no `wedding.tegaandhenry.com`** — the hostname has no DNS record, and
the earlier plan to run the wedding application on a subdomain has been dropped.
Under ADR-020 in the wedding repository, the wedding application will serve
`tegaandhenry.com` itself: landing page, household RSVP links, guest sign-in and
admin console all on one origin.

**That handover has not happened.** Today the apex is attached to this Pages
project and serves this site. Both facts are checkable:

```
npx wrangler pages project list          # tegaandhenry.com listed against tegaandhenry-com
curl -s https://tegaandhenry.com/ | grep '<title>'
```

When the cutover does happen, the order matters: remove `tegaandhenry.com` from
this project's custom domains *first*, then point the apex at the wedding
application's Cloud Run service. Leaving it attached in both places is the
dangerous state, because whichever record wins decides which site guests reach —
and this one has no RSVP.

Until then, **do not detach the apex from this project.** It is the live site.

After the wedding, the intention is for this repo to take the apex back as the
couple's long-term personal page.

## Git authentication

The remote is HTTPS, and `gh` supplies the credential:

```
git remote -v                             # https://github.com/rjeans/tegaandhenry.com.git
git config --global --get-regexp credential
                                          # !gh auth git-credential
```

This is deliberate. The repository was originally on an SSH remote signed through
1Password's agent, which locks on a timer and cannot be unlocked by an automated
session — it blocked two pushes mid-task. Routing git through `gh` removes that
failure mode.

One consequence: the `gh` token carries `gist`, `read:org` and `repo`, but **not
`workflow`**. Over HTTPS, GitHub rejects any push that adds or changes a file
under `.github/workflows/`. Nothing here needs one, since Cloudflare builds on
push — but run `gh auth refresh -s workflow` first if that ever changes.

---

**Cost:** free tier is ample — two HTML pages and a handful of images.
**Included:** automatic HTTPS, the global CDN, build-on-push, and a preview
deployment per branch.
